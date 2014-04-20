var inspectionManager = {
	// Initialisierung
	init: function() {
		$('#edit').on('pagebeforeshow', this.onLoad);
		$('#edit').on('pageshow', this.onAfterLoad);
		$("input[name='radio-nodetype']").on('change', this.onChangeType);
		$('#edit-back').click(this.onLeave);
		$('#edit-save').click(this.onSave);
		$('#button-edit-task').click(this.onEditTask);
		$('#popup-leavepage-yes').click(function() {
			inspectionManager.onConfirmLeave(true);
		});
		$('#popup-leavepage-no').click(function() {
			inspectionManager.onConfirmLeave(false);
		});
		$('#editproperties').on('popupbeforeposition', this.prepareEditPropertiesPopup);
		$('#addnode').on('popupbeforeposition', this.prepareAddNodePopup);
		$('#deletenode').on('popupbeforeposition', this.prepareDeleteNodePopup);
		$('#popup-editproperties-apply').click(this.onApplyProperties);
		$('#popup-addnode-add').click(this.onAddNode);
		$('#popup-deletenode-confirm').click(this.onConfirmDelete);
	},
	
	// Prepare Funktionen
	prepareEditPropertiesPopup: function(e) {
		var selected = inspectionTree.getNodeById(inspectionTree.zTree.getSelectedNodes()[0].id);
		$('#popup-properties-treeitem-name').val(selected.name);
		$('#popup-properties-treeitem-author').val(selected.author);
		if(selected.type == 'doc') {
			var task = inspectionTree.getTaskNodeById(selected.taskId);
			$('#popup-editproperties-textarea-nodedescription').textinput('enable');
			$('#popup-editproperties-textarea-nodedescription').val(task.description);
		} else {
			$('#popup-editproperties-textarea-nodedescription').textinput('disable');
			$('#popup-editproperties-textarea-nodedescription').val('');
		}
	},
	prepareAddNodePopup: function(e) {
		$('#popup-addnode-treeitem-name').val('');
		$('#popup-addnode-textarea-nodedescription').val('');
		$('#popup-addnode-textarea-nodedescription').textinput('disable');
		$('#popup-addnode-treeitem-author').val(inspectionClient.settings.userName);
		$("input[name='radio-nodetype'][value='group']").prop('checked', true).checkboxradio('refresh');
		$("input[name='radio-nodetype'][value='inspection']").prop('checked', false).checkboxradio('refresh');
	},
	prepareDeleteNodePopup: function(e) {
		
	},
	
	// Event Handler
	onLoad: function(event, data) {
		if(data.prevPage.attr('id') != 'edittasks') {
			inspectionTree.loadData();
			$('.inspection-edit-path').text($.t('editpage.chooseInspection'));
			$('.node-operation li a').addClass('ui-state-disabled');
		}
	},
	onAfterLoad: function(event, data) {
		// Wichtig! Greift nur bei diesem Event
		if(data.prevPage.attr('id') != 'edittasks') {
			$.mobile.loading('show');
		}
	},
	onLeave: function() {
		if(inspectionTree.unsavedChanges > 0) {
			$('#leavepage').popup('open');
		} else {
			inspectionTree.zTree = null;
			$.mobile.back();
		}
	},
	onConfirmLeave: function(save) {
		if(save) {
			inspectionManager.onSave();
		}
		inspectionTree.reset();
		$.mobile.changePage('#main');
	},
	onSave: function() {
		if(inspectionTree.unsavedChanges > 0) {
			inspectionTree.saveData();
		}
	},
	onApplyProperties: function() {
		var selected = inspectionTree.getNodeById(inspectionTree.zTree.getSelectedNodes()[0].id);
		var data = null;
		inspectionTree.updateNode(selected.id, {
			name: $('#popup-properties-treeitem-name').val(),
			author: $('#popup-properties-treeitem-author').val(),
			description: selected.type == 'doc' ? $('#popup-editproperties-textarea-nodedescription').val() : ''
		});
	},
	onAddNode: function() {
		var selected = inspectionTree.zTree.getSelectedNodes()[0];
		var author = $('#popup-addnode-treeitem-author').val();
		var name = $('#popup-addnode-treeitem-name').val();
		var type = $("input[name='radio-nodetype']:checked").val();
		var description = $('#popup-addnode-textarea-nodedescription').val();
		var date = new Date().toISOString().substr(0,19).split('T');
		var data = null;
		if(type == 'inspection') {
			data = {
				class: 'net.muszytowski.WearableInspectionServer.items.Task',
				resourceIdentifier: inspectionTree.freeTaskIdentifier,
				name: name,
				description: description,
				author: author,
				date: date[0] + ' ' + date[1],
				weight: 1, //TODO
				children:[]
			};
		}
		inspectionTree.addNode(selected.id, {
			class: 'net.muszytowski.WearableInspectionServer.items.InspectionTree',
			resourceIdentifier: inspectionTree.freeIdentifier,
			name: name,
			author: author,
			data: data
		});
		$('#button-edit-task').addClass('ui-state-disabled');
		$('#button-delete-node').addClass('ui-state-disabled');
	},
	onConfirmDelete: function() {
		var selected = inspectionTree.zTree.getSelectedNodes()[0];
		inspectionTree.deleteNode(selected.id);
	},
	onSelectNode: function(treeNode) {
		$('.inspection-edit-path').text(inspectionTree.getNodePath(treeNode));
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
	onEditTask: function() {
		inspectionTree.currentTask = inspectionTree.zTree.getSelectedNodes()[0].taskId;
		inspectionTree.refresh();
		$.mobile.changePage('#edittasks');
	},
	onChangeType: function(e, ui) {
		if(e.currentTarget.value == 'group') {
			$('#popup-addnode-textarea-nodedescription').textinput('disable');
		} else {
			$('#popup-addnode-textarea-nodedescription').textinput('enable');
		}
	}
};