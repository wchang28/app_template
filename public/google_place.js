var Promise = require('proimise');
// TODO: EventSource

function SuggestionEngine () {
	var __this = this;
	function dispatchChange() {if (typeof __this.onChange === 'function') __this.onChange();}
	
	function OutstandingQueries () {
		var me = this;
		function dispatchChange() {if (typeof me.onChange === 'function') me.onChange();}
		var __outstanding = {};	// map from query id to query
		this.add = function(query) {
			__outstanding[query.id] = query;
			dispatchChange();
		};
		this.remove = function (queryId) {
			delete __outstanding[queryId];
			dispatchChange();
		}
		this.resolveQuery = function(queryId, suggestions) {
			var query = __outstanding[queryId];
			if (query) query.resolve(suggestions);			
		};
		this.toJSON = function() {
			var ret = [];
			for (var id in __outstanding) {
				var query = __outstanding[id];
				ret.push({id: query.id, queryString: query.queryString});
			}
			return ret;
		};
	}
	var outstandingQueries = new OutstandingQueries();
			
	function Queue() {
		var me = this;
		function dispatchChange() {if (typeof me.onChange === 'function') me.onChange();}
		function dispatchEnqueued(query) {if (typeof me.onEnqueued === 'function') me.onEnqueued(query);}
		function dispatchDequeued(queries) {if (typeof me.onDequeued === 'function') me.onDequeued(queries);}
		var __queue = [];
		this.enqueue = function(query) {
			__queue.push(query);
			dispatchEnqueued(query);
			dispatchChange();
		};
		this.dequeue = function(maxToDequeue) {
			if (maxToDequeue === 0 || __queue.length === 0)
				return null;
			else {
				var ret = [];
				while (__queue.length > 0 && ret.length < maxToDequeue)
					ret.push(__queue.shift());
				dispatchDequeued(ret);
				dispatchChange();
				return ret;
			}
		};
		this.toJSON = function() {
			var ret = [];
			for (var i in __queue) {
				var query = __queue[i];
				ret.push({id: query.id, queryString: query.queryString});
			}
			return ret;
		};
	}
	var queue = new Queue();
		
	this.resolveQuery = function (queryId, suggestions) {
		outstandingQueries.resolveQuery(queryId, suggestions);
	};

	function generateRandomId() {
		// TODO:
	}
	
	this.sumbitQuery = function(queryString, onDone) {
		var queryId = generateRandomId();
		var query = {
			id: queryId
			,queryString: queryString
		};
		var p = new Promise(function(resolve, reject) {
			query.resolve = resolve;
			setTimeout(function() {
				reject('query timeout');
			}, 500);
		});
		p.then(function(suggestions) {
			outstandingQueries.remove(query.id);
			if (typeof onDone === 'function') onDone(suggestions);
		}).catch(function(err) {
			outstandingQueries.remove(query.id);
			if (typeof onDone === 'function') onDone([]);
		});
		outstandingQueries.add(query);
		queue.enqueue(query);
		return queryId;
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
				id: workerId
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
		};
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
			return (ret.length === 0 ? null : ret);
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
		this.toJSON = function() {
			var ret = {};
			for (var workerId in __workers) {
				var worker = __workers[workerId];
				ret.push({id: worker.id, ready: worker.ready, busy: worker.busy});
			}
			return ret;
		};
	}
	var workers = new Workers();
	
	queue.onEnqueued = function(query) {
		dispatchQueriesIfNecessary();
	};
	workers.onAllWorkersReady = function() {
		dispatchQueriesIfNecessary();
	};
	workers.onWorkerNotBusy = function(worker) {
		dispatchQueriesIfNecessary();
	};
	
	function randomlyChooseWorkers(workers, numToPick) {
		var arr = [];
		for (var i in workers)
			arr.push(workers[i]);
		arr.sort(function() {return 0.5 - Math.random()});
		var ret = [];
		while (ret.length < numToPick)
			ret.push(arr.shift());
		return ret;		
	}
	
	function dispatchQueryToWorker(worker, query) {
		workers.setWorkerBusy(worker.workerId);
		worker.eventSource.dispatchEvent({event:'QUERY', query: {queryString: query.queryString, id: query.id}});
	}

	function dispatchQueriesIfNecessary() {
		var availableWorkers = null;
		var queries = null;
		if (workers.allReady() && (availableWorkers=workers.getAllAvailable()) && (queries=queue.dequeue(availableWorkers.length))) {
			//assert(availableWorkers.length>0 && queries.length > 0 && availableWorkers.length >= queries.length);
			var workersSelected = randomlyChooseWorkers(availableWorkers, queries.length);
			//assert(workersSelected.length == queries.length);
			for(var i in workersSelected)
				dispatchQueryToWorker(workersSelected[i], queries[i]);
		}
	}
	
	this.toJSON = function() {
		return {
			outstanding: outstandingQueries.toJSON()
			,queue: queue.toJSON()
			,workers: workers.toJSON()
		};
	};
	outstandingQueries.onChange = function() {dispatchChange(__this.toJSON());};
	queue.onChange = function() {dispatchChange(__this.toJSON());};
	workers.onChange = function() {dispatchChange(__this.getJSON());};
}

// worker web call handling
//****************************************************************************************************************

// sse handling (GET)
////////////////////////////////////////////////////////////////////////////////////////////
function onSSEInitStreaming(req, rsp) {
	// on first encountering a browser tab worker
	var workerId = req.remoteAddress + ':' + req.remotePort;	// TODO:
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
	suggestionEngine.resolveQuery(q.id, q.suggestions);
	res.json({});
}
//****************************************************************************************************************

// via web call from query client...
//****************************************************************************************************************
function(req, res) {
	var queryString = req.body;
	suggestionEngine.sumbitQuery(queryString, function(suggestions) {
		res.json({suggestions: suggestions});
	});
}
//****************************************************************************************************************
