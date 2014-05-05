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
		
	},
	onAfterLoad: function(event, data) {
		$('.inspection-result-path').text($.t('resultpage.chooseInspection'));
		inspectionTree.loadData();
		$.mobile.loading('show');
	},
	onSelectNode: function(treeNode) {
		$('.inspection-result-path').text(inspectionTree.getNodePath(treeNode));
		$('.node-operation li a').removeClass('ui-state-disabled');
		if(treeNode.isParent) {
			$('#button-delete-node').addClass('ui-state-disabled');
		}
		if(treeNode.type == 'group') {
			$('#button-edit-task').addClass('ui-state-disabled');
		}
		if(treeNode.type == 'doc') {
			$('#button-add-node').addClass('ui-state-disabled');
		}
		if(treeNode.pId == 0 || treeNode.pId == null) {
			$('#button-delete-node').addClass('ui-state-disabled');
		}
	},
	onLeave: function() {
		inspectionTree.zTree = null;
		$.mobile.back();
	}
};