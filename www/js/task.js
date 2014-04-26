var taskManager = {
	// Initialisierung
	init: function() {
		$('#edittasks').on('pagebeforeshow', this.onLoad);
		$('#edittasks-save').click(this.onSave);
		$('#edittaskproperties').on('popupbeforeposition', this.prepareEditPropertiesPopup);
		$('#addtasknode').on('popupbeforeposition', this.prepareAddNodePopup);
		$('#taskpopup-editproperties-apply').click(this.onApplyProperties);
		$('#taskpopup-addnode-add').click(this.onAddNode);
		$('#taskpopup-deletenode-confirm').click(this.onConfirmDelete);
		$('#input-range-start').on('change', this.onChangeRange);
		$('#input-range-stop').on('change', this.onChangeRange);
		$('#input-range-step').on('change', this.onChangeRange);
		$('#input-list-options').on('change', this.onChangeList);
	},
	
	// Prepare Funktionen
	prepareEditPropertiesPopup: function(e) {
		//CHECK
		var selected = inspectionTree.getTaskNodeById(inspectionTree.taskTree.getSelectedNodes()[0].id);
		$('#taskpopup-properties-treeitem-name').val(selected.name);
		$('#taskpopup-properties-treeitem-author').val(selected.author);
		$('#taskpopup-properties-textarea-description').val(selected.description);
		$('#taskpopup-properties-treeitem-weight').val(selected.weight);
	},
	prepareAddNodePopup: function(e) {
		//CHECK
		$('#taskpopup-addnode-treeitem-name').val('');
		$('#taskpopup-addnode-textarea-description').val('');
		$('#taskpopup-addnode-treeitem-weight').val('1');
		$('#taskpopup-addnode-treeitem-author').val(inspectionClient.settings.userName);
		$('#taskpopup-addnode-select-type').val('Task').selectmenu('refresh', true);
	},
	
	// Event Handler
	onLoad: function(event, data) {
		//CHECK
		$('.task-edit-path').text($.t('edittaskspage.chooseTask'));
		$('.tasknode-operation li a').addClass('ui-state-disabled');
		$('#tasknode-list-attributes').addClass('hidden-element');
		$('#tasknode-range-attributes').addClass('hidden-element');
		if(data.prevPage.attr('id') != 'edit') {
			// springe zurück auf edit und lade Daten neu, wenn ein Reload durchgeführt wird
			inspectionTree.loadData();
			$.mobile.back();
		}
	},
	onSave: function() {
		if(inspectionTree.unsavedChanges > 0) {
			inspectionTree.saveData();
		}
	},
	onApplyProperties: function() {
		//CHECK
		var zTreeSelected = inspectionTree.taskTree.getSelectedNodes()[0];
		var selected = inspectionTree.getTaskNodeById(zTreeSelected.id);
		inspectionTree.updateTaskNode(selected.id, {
			name: $('#taskpopup-properties-treeitem-name').val(),
			author: $('#taskpopup-properties-treeitem-author').val(),
			description: $('#taskpopup-properties-textarea-description').val(),
			weight: parseInt($('#taskpopup-addnode-treeitem-weight').val(), 10)
		});
	},
	onAddNode: function() {
		//CHECK
		var selected = inspectionTree.taskTree.getSelectedNodes()[0];
		var type = $('#taskpopup-addnode-select-type').val();
		var dateArray = new Date().toISOString().substr(0,19).split('T');
		var data = new inspectionItem[type];
		data.name = $('#taskpopup-addnode-treeitem-name').val();
		data.description = $('#taskpopup-addnode-textarea-description').val();
		data.author = $('#taskpopup-addnode-treeitem-author').val();
		data.date = dateArray[0] + ' ' + dateArray[1];
		data.resourceIdentifier = inspectionTree.freeTaskIdentifier;
		data.weight = parseInt($('#taskpopup-addnode-treeitem-weight').val(), 10);
		inspectionTree.addNode(selected.id, data);
	},
	onConfirmDelete: function() {
		//CHECK
		var selected = inspectionTree.taskTree.getSelectedNodes()[0];
		inspectionTree.deleteTaskNode(selected.id);
	},
	onSelectNode: function(treeNode) {
		//CHECK
		$('.task-edit-path').text(inspectionTree.getNodePath(treeNode));
		$('.tasknode-operation li a').removeClass('ui-state-disabled');
		$('#tasknode-list-attributes').addClass('hidden-element');
		$('#tasknode-range-attributes').addClass('hidden-element');
		// Wenn Task Root
		if(treeNode.id == inspectionTree.currentTask) {
			$('#button-edit-taskproperties').addClass('ui-state-disabled');
			$('#button-delete-tasknode').addClass('ui-state-disabled');
		}
		else {
			if(treeNode.type != 'Task') {
				$('#button-add-tasknode').addClass('ui-state-disabled');
				switch(treeNode.type) {
					case 'ListTask':
						$('#tasknode-list-attributes').removeClass('hidden-element');
						var optionsString = '';
						if(treeNode.list) {
							for(var i = 0; i < treeNode.list.length; i++) {
								optionsString += treeNode.list[i].value + '\n';
							}
						}
						$('#input-list-options').val(optionsString);
						break;
					case 'RangeTask':
						$('#tasknode-range-attributes').removeClass('hidden-element');
						$('#input-range-start').val(treeNode.range.start);
						$('#input-range-stop').val(treeNode.range.stop);
						$('#input-range-step').val(treeNode.range.step);
						break;
				}
			} else if(treeNode.isParent) {
				$('#button-delete-tasknode').addClass('ui-state-disabled');
			}
		}
	},
	onChangeRange: function(e) {
		var zTreeSelected = inspectionTree.taskTree.getSelectedNodes()[0];
		var selected = inspectionTree.getTaskNodeById(zTreeSelected.id);
		inspectionTree.updateTaskNode(selected.id, {
			name: selected.name,
			author: selected.author,
			description: selected.description,
			weight: selected.weight,
			start: parseFloat($('#input-range-start').val().replace(',','.'), 10),
			stop: parseFloat($('#input-range-stop').val().replace(',','.'), 10),
			step: parseFloat($('#input-range-step').val().replace(',','.'), 10)
		});
	},
	onChangeList: function(e) {
		var zTreeSelected = inspectionTree.taskTree.getSelectedNodes()[0];
		var selected = inspectionTree.getTaskNodeById(zTreeSelected.id);
		var optionsList = [];
		var items = $('#input-list-options').val().split('\n');
		for(var i = 0; i < items.length; i++) {
			var current = new inspectionItem.ListOption();
			current.value = items[i];
			optionsList.push(current);
		}
		inspectionTree.updateTaskNode(selected.id, {
			name: selected.name,
			author: selected.author,
			description: selected.description,
			weight: selected.weight,
			options: optionsList
		});
	}
};