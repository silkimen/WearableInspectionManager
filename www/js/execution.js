var executionManager = {
	currentExecutionObjects: null,
	getList: function(taskId, callback) {
		this.loadExecution(taskId, function(executionObjects) {
			var list = [];
			executionManager.currentExecutionObjects = executionObjects;
			executionObjects.forEach(function(o) {
				var date = new Date(o.date);
				list.push({
					id: o.resourceIdentifier,
					date: date.toLocaleString()
				});
			});
			callback(list);
		});
	},
	getListDetail: function(executionId, callback) {
		var list = [];
		for(var i = 0; i < this.currentExecutionObjects.length; i++) {
			if(this.currentExecutionObjects[i].resourceIdentifier == executionId) {
				this.executionToList(this.currentExecutionObjects[i], list);
				break;
			}
		}
		callback(list);
	},
	executionToList: function(object, list) {
		list.push({
			name: object.name,
			description: object.description,
			value: object.value,
			type: object.class ? object.class.substr(object.class.lastIndexOf('.') + 1) : 'Main'
		});
		if(object.children) {
			for(var i = 0; i < object.children.length; i++) {
				this.executionToList(object.children[i], list);
			}
			// AbgrenzungsItem
			list.push({
				name: '',
				description: '',
				value: undefined,
				type: 'Task'
			});
		}
	},
	loadExecution: function(taskId, callback) {
		var that = this;
		$.mobile.loading('show');
		$.ajax({
			type: 'GET',
			url: inspectionClient.settings.serverUrl + 'getTaskExecution?Task=' + taskId,
			cache: false,
			dataType: 'json'
		}).done(function(data) {
			var executionObjects = data;
			$.mobile.loading('hide');
			callback(executionObjects);
		}).fail(function(jqXHR, textStatus) {
			$.mobile.loading('hide');
			that.executionObjects = null;
			alert($.t('app.communicationfail') + ' ' + textStatus);
		});
	}
};