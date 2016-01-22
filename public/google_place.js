var queue ...

var NUM_WORKERS = 10;

var __outStandingQueries = {	// map from query id to query
	
};

function Workers() {
	var me = this;
	var __workers = {};
	var count = 0;
	function dispatchChange() {if (typeof me.onChange === 'function') me.onChange();}
	function dispatchNewWorkerCreated(worker) {if (typeof me.onNewWorkerCreated === 'function') me.onNewWorkerCreated(worker);}
	function dispatchWorkerRemoved(worker) {if (typeof me.onWorkerRemoved === 'function') me.onWorkerRemoved(worker);}
	function dispatchAllWorkersReady() {if (typeof me.onAllWorkersReady === 'function') me.onAllWorkersReady();}
	function dispatchWorkerNotBusy(worker) {if (typeof me.onWorkerNotBusy === 'function') me.onWorkerNotBusy(worker);}
	this.getWorkersCount = function() {return count};
	this.createNew = function(workerId, eventListener) {
		var worker = {
			workerId: workerId
			,ready: false
			,busy: false
			,eventSource: new EventSource()
		};
		__workers[workerId] = worker;
		count++;
		worker.eventSource.addListener(eventListener);
		dispatchNewWorkerCreated(worker);
		dispatchChange();
		return worker;
	};
    this.allReady = function () {
		for (var workerId in __workers) {
			var worker = __workers[workerId];
			if (!worker.ready)
				return false;
		}
		return true;
	};
	this.setWorkerReady = function(workerId) {
		var worker = __workers[workerId];
		if (worker) {
			worker.ready = true;
			dispatchChange();
			if (me.allReady()) dispatchAllWorkersReady();
		}		
	};
	this.setWorkerBusy = function (workerId) {
		var worker = __workers[workerId];
		if (worker) {
			worker.busy = true;
			dispatchChange();
		}
	}
	this.setWorkerNotBusy = function(workerId) {
		var worker = __workers[workerId];
		if (worker) {
			worker.busy = false;
			dispatchChange();
			dispatchWorkerNotBusy(worker);
		}
	};
	this.getAllAvailable = function() {
		var ret = [];
		for (var workerId in __workers) {
			var worker = __workers[workerId];
			if (worker.ready && !worker.busy)
				ret.push(worker);
		}
		return (ret.length == 0 ? null : ret);
	};
	this.getAllIds = function() {
		var ret = [];
		for (var workerId in __workers)
			ret.push(workerId);
		return ret;
	};
	this.remove = function(workerId, listener) {
		var worker = __workers[workerId];
		if (worker) {
			worker.eventSource.removeListener(listener);
			delete __workers[workerId];
			count--;
			dispatchWorkerRemoved(worker);
			dispatchChange();
			if (me.allReady()) dispatchAllWorkersReady();
		}
	};
	this.getJSON = function() {
		var ret = {};
		for (var workerId in __workers) {
			var worker = __workers[workerId];
			ret.push({workerId: worker.workerId, ready: worker.ready, busy: worker.busy});
		}
		return ret;
	};
}

var workers = new Workers();
workers.onAllWorkersReady = function() {
	dispatchQueriesIfNecessary();
};
workers.onWorkerNotBusy = function(worker) {
	dispatchQueriesIfNecessary();
}

workers.onChange = function() {
	var o = workers.getJSON();
	// TODO: fire event with o
}

function dispatchQueryToWorker(worker, query) {
	workers.setWorkerBusy(worker.workerId);
	worker.eventSource.dispatchEvent({event:'QUERY', query: {query.queryString, query.id}});
}

function dispatchQueriesIfNecessary() {
	var availableWorkers = null;
	var queries = null;
	if (workers.allReady() && (availableWorkers=workers.getAllAvailable()) && (queries=queue.dequeueQueries(availableWorkers.length))) {
		//assert(availableWorkers.length>0 && queries.length > 0 && availableWorkers.length >= queries.length);
		var workersSelected = randomlyChooseWorkers(availableWorkers, queries.length);
		//assert(workersSelected.length == queries.length);
		for(var i in workersSelected)
			dispatchQueryToWorker(workersSelected[i], queries[i]);
	}
}

// worker web call handling
//****************************************************************************************************************

// sse handling (GET)
////////////////////////////////////////////////////////////////////////////////////////////
function onSSEInitStreaming(req, rsp) {
	// on first encountering a browser tab worker
	var workerId = req.remoteAddress + ':' + req.remotePort;
	var listener = function(event) {res.sendSse(event);}
	var worker = suggestionEngine.getWorkers().createNew(workerId, listener);
	worker.eventSource.dispatchEvent({event:'WORKER_ID', id: workerId});	// let the browser tab worker knows about the id we assign to it
	return {listener: listener, workerId: workerId};
}

function onSSEStreamingClose(req, res, o) {
	suggestionEngine.getWorkers().remove(o.workerId, o.listener);
}
////////////////////////////////////////////////////////////////////////////////////////////

// via web call from worker ... (GET)
function onWorkerReady(req, res) {
	//... 
	var workerId = req.queries.workerId;
	suggestionEngine.getWorkers().setWorkerReady(workerId);
	res.json({});
}

// via web call from worker ... (POST)
function onQueryReturnedFromWorker(req, res) {
	var q = req.body;
	suggestionEngine.getWorkers().setWorkerNotBusy(q.workerId);
	var query = __outStandingQueries[q.id];
	if (query) query.resolve(q.suggestions);
	res.json({});
}
//****************************************************************************************************************

// via web call from query client...
//****************************************************************************************************************
function(req, res) {
	var query = req.body;
	// incoming query ...
	/*
	var query = {
		queryString: queryString
		,id: generateRnadomId();
	};
	*/
	__outStandingQueries[query.id] = query;
	var p = new Promise(function(resolve, reject) {
		query.resolve = resolve;
		setTimeout(function() {
			reject('query timeout');
		}, 500);
	});
	p.then(function(suggestions) {
		delete __outStandingQueries[query.id];
		res.json({suggestions: suggestions});
	}).catch(function(err) {
		delete __outStandingQueries[query.id];
		res.json({suggestions: []});
	});
	suggestionEngine.sumbitQuery(query);
}
//****************************************************************************************************************
