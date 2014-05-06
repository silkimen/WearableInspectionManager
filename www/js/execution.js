var executionManager = {
	getList: function(taskId, callback) {
		this.loadExecution(taskId, function(executionObject) {
			var list = [];
			executionObject.forEach(function(o) {
				var date = new Date(o.date);
				list.push('ID: ' + o.resourceIdentifier + ' ' + $.t('resultpage.executedon') + ': ' + date.toLocaleString());
			});
			callback(list);
		});
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
			var executionObject = data;
			$.mobile.loading('hide');
			callback(executionObject);
		}).fail(function(jqXHR, textStatus) {
			$.mobile.loading('hide');
			that.executionObject = null;
			alert($.t('app.communicationfail') + ' ' + textStatus);
		});
	}
};