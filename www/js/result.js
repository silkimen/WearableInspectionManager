var resultManager = {
	// Initialisierung
	init: function() {
		$('#result').on('pagebeforeshow', this.onLoad);
		$('#result').on('pageshow', this.onAfterLoad);
		$('#result-back').click(this.onLeave);
	},
	
	// Prepare Funktionen
	
	// Event Handler
	onLoad: function(event, data) {
		$('.result-list').html('');
		$('.inspection-result-path').text($.t('resultpage.chooseInspection'));
	},
	onAfterLoad: function(event, data) {
		inspectionTree.loadData();
		$.mobile.loading('show');
	},
	onSelectNode: function(treeNode) {
		$('.inspection-result-path').text(inspectionTree.getNodePath(treeNode));
		if(treeNode.type == 'group') {
			// TODO
		}
		if(treeNode.type == 'doc') {
			executionManager.getList(treeNode.taskId, function(list) {
				$('.result-list').html('');
				list.forEach(function(item) {
					$('<li>').append('<a href="#">' + item + '</a>').appendTo('.result-list');
				})
				if(list.length == 0) {
					$('<li>').append('<a href="#">' + $.t('resultpage.noexecutions') + '</a>').appendTo('.result-list');
				}
				$('.result-list').listview().listview('refresh');
			});
		}
	},
	onLeave: function() {
		inspectionTree.zTree = null;
		$.mobile.back();
	}
};