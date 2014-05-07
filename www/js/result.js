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
		if(data.prevPage.attr('id') != 'resultdetail') {
			$('.result-list').html('');
			$('.inspection-result-path').text($.t('resultpage.chooseInspection'));
			inspectionTree.loadData();
			$.mobile.loading('show');
		}
	},
	onAfterLoad: function(event, data) {

	},
	onSelectNode: function(treeNode) {
		$('.inspection-result-path').text(inspectionTree.getNodePath(treeNode));
		if(treeNode.type == 'group') {
			$('.result-list').html('');
			$('<li>').append('<a href="#">' + $.t('resultpage.choosedocument') + '</a>').appendTo('.result-list');
			$('.result-list').listview().listview('refresh');
		}
		if(treeNode.type == 'doc') {
			executionManager.getList(treeNode.taskId, function(list) {
				$('.result-list').html('');
				list.forEach(function(item) {
					var id = '<h2>' + $.t('resultpage.response') + ' ' + item.id + '</h2>';
					var date = '<p>' + $.t('resultpage.executedon') + ': <strong>' + item.date + '</strong></p>';
					$('<li>').append('<a href="#" onclick="resultManager.onShowDetail(' + item.id + ')">' + id + date + '</a>').appendTo('.result-list');
				})
				if(list.length == 0) {
					$('<li>').append('<a href="#">' + $.t('resultpage.noexecutions') + '</a>').appendTo('.result-list');
				}
				$('.result-list').listview().listview('refresh');
			});
		}
	},
	onShowDetail: function(id) {
		sessionStorage.executionId = id;
		$.mobile.changePage('#resultdetail');
	},
	onLeave: function() {
		inspectionTree.zTree = null;
		$.mobile.back();
	}
};