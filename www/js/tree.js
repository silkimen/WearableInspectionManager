var inspectionTree = {
	// Member Attribute
	InspectionTreeSettings: {
		edit: {
			enable: true,
			showRemoveBtn: false,
			showRenameBtn: false
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			onClick: function(e, treeId, treeNode, clickFlag) {
				inspectionManager.onSelectNode(treeNode);
			}
		},
		view: {
			selectedMulti: false
		}
	},
	TaskTreeSettings: {
		edit: {
			enable: true,
			showRemoveBtn: false,
			showRenameBtn: false
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			onClick: function(e, treeId, treeNode, clickFlag) {
				taskManager.onSelectNode(treeNode);
			}
		},
		view: {
			selectedMulti: false
		}
	},
	zTree: null,
	taskTree: null,
	currentTask: 0,
	inspectionNodes: [],
	taskNodes: [],
	unsavedChanges: 0,
	freeIdentifier: 1,
	freeTaskIdentifier: 1,
	
	// Event Handler
	onOperation: function(reset) {
		if(!reset) {
			++this.unsavedChanges;
			$('.status-message').text(this.unsavedChanges + ' ' + $.t('editpage.unsavedchanges'));
		} else {
			this.unsavedChanges = 0;
			$('.status-message').text('');
		}
	},
	
	// Tree Funktionen
	loadData: function() {
		var that = this;
		$.mobile.loading('show');
		$.ajax({
			type: 'GET',
			url: inspectionClient.settings.serverUrl + 'getInspectionTree',
			cache: false,
			dataType: 'json'
		}).done(function(data) {
			$.mobile.loading('show');
			that.inspectionNodes = [];
			that.taskNodes = [];
			that.addNode(0, data, false, true);
			that.onOperation(true);
			$.mobile.loading('hide');
		}).fail(function(jqXHR, textStatus) {
			$.mobile.loading('hide');
			if(jqXHR.responseText == '') {
				var initialNode = new inspectionItem.InspectionTree();
				that.inspectionNodes = [];
				that.taskNodes = [];
				that.addNode(0, initialNode, false, true);
			} else {
				alert($.t('app.communicationfail') + ' ' + textStatus);
			}
		});
	},
	saveData: function() {
		$.mobile.loading('show', {
			text: $.t('app.saving'),
			textVisible: true,
			theme: 'z',
			html: ''
		});
		var data = inspectionAdapter.createServerObject(this.getNodesByPId(0)[0]);
		$.ajaxSetup({
			contentType: 'application/json;charset=utf-8',
			mimeType: 'application/json',
			type: 'POST'
		});
		$.ajax({
			dataType: 'json',
			data: JSON.stringify(data),
			url: inspectionClient.settings.serverUrl + 'setInspectionTree',
			cache: false
		}).done(function(data) {
			inspectionTree.onOperation(true);
			$.mobile.loading('hide');
		}).fail(function(jqXHR, textStatus) {
			$.mobile.loading('hide');
			alert($.t('app.communicationfail') + ' ' + textStatus);
		});
	},
	refresh: function(fullReset) {
		if(this.zTree) {
			var selectedInspection = this.zTree.getSelectedNodes()[0];
		}
		if(this.taskTree) {
			var selectedTask = this.taskTree.getSelectedNodes()[0];
		}
		this.zTree = $.fn.zTree.init($('#tree'), this.InspectionTreeSettings, this.inspectionNodes);
		this.taskTree = $.fn.zTree.init($('#tasktree'), this.TaskTreeSettings, this.taskNodes);
		if(selectedInspection && !fullReset) {
			// Wichtig! Neu einlesen des selektierten Nodes, da der Name geändert sein kann
			var newInspection = this.zTree.getNodeByParam('id', selectedInspection.id);
			$('.inspection-edit-path').text(this.getNodePath(newInspection));
			this.zTree.selectNode(newInspection);
		}
		if(selectedTask && !fullReset) {
			// Wichtig! Neu einlesen des selektierten Nodes, da der Name geändert sein kann
			var newTask = this.taskTree.getNodeByParam('id', selectedTask.id);
			$('.task-edit-path').text(this.getNodePath(newTask));
			this.taskTree.selectNode(newTask);
		}
		if(this.currentTask > 0) {
			var rootNodes = this.taskTree.getNodesByParam('pId', null, null);
			var currentRoot = this.taskTree.getNodesByParam('id', this.currentTask, null);
			this.taskTree.hideNodes(rootNodes);
			this.taskTree.showNodes(currentRoot);
		}
		if(fullReset) {
			$('.inspection-edit-path').text($.t('editpage.chooseInspection'));
			$('.task-edit-path').text($.t('edittaskspage.chooseTask'));
			$('.node-operation li a').addClass('ui-state-disabled');
			$('.tasknode-operation li a').addClass('ui-state-disabled');
		}
	},
	reset: function() {
		this.zTree = null;
		this.inspectionNodes = [];
		this.unsavedChanges = 0;
		this.freeIdentifier = 0;
	},
	addNode: function(pId, data, recursiveCall, initial) {
		if(data.class == 'net.muszytowski.WearableInspectionServer.items.InspectionTree') {
			if(data.resourceIdentifier >= this.freeIdentifier) {
				this.freeIdentifier = data.resourceIdentifier + 1;
			}
			this.inspectionNodes.push({
				pId: pId,
				id: data.resourceIdentifier,
				name: data.name,
				open: true,
				author: data.author,
				type: data.data == null ? 'group' : 'doc',
				iconSkin: data.data == null ? 'group' : '',
				taskId: data.data == null ? null : data.data.resourceIdentifier
			});
			if(data.data == null) {
				if(data.children) {
					for (var i = 0; i < data.children.length; ++i) {
						this.addNode(data.resourceIdentifier, data.children[i], true);
					}
				}
			} else {
				this.addNode(0, data.data, true);
			}
		} else {
			var dataClass = data.class.split('.')[4];
			var rangeAttributes = null;
			var listAttributes = null;
			if(data.resourceIdentifier >= this.freeTaskIdentifier) {
				this.freeTaskIdentifier = data.resourceIdentifier + 1;
			}
			if(dataClass == 'RangeTask') {
				rangeAttributes = {
					start: data.start,
					stop: data.stop,
					step: data.step
				};
			} else if(dataClass == 'ListTask') {
				listAttributes = data.options;
			}
			this.taskNodes.push({
				pId: pId,
				id: data.resourceIdentifier,
				name: data.name,
				open: true,
				author: data.author,
				description: data.description,
				date: data.date,
				weight: data.weight,
				type: dataClass,
				range: rangeAttributes,
				list: listAttributes,
				icon: 'img/task-icons/' + data.class.split('.')[4] + '.png'
			});
			if(data.children) {
				for (var i = 0; i < data.children.length; ++i) {
					this.addNode(data.resourceIdentifier, data.children[i], true);
				}
			}
		}
		if(!recursiveCall) {
			if(!initial) {
				this.onOperation();
			}
			this.refresh();
		}
	},
	deleteNode: function(id) {
		this.onOperation();
		var target = this.getNodeById(id);
		if(target) {
			this.inspectionNodes.splice(this.inspectionNodes.indexOf(target), 1);
			this.refresh(true);
		}
	},
	deleteTaskNode: function(id) {
		this.onOperation();
		var target = this.getTaskNodeById(id);
		if(target) {
			this.taskNodes.splice(this.taskNodes.indexOf(target), 1);
			this.refresh(true);
		}
	},
	updateNode: function(id, data) {
		this.onOperation();
		var target = this.getNodeById(id);
		if(target) {
			target.name = data.name;
			target.author = data.author;
			if(target.type == 'doc') {
				var task = this.getTaskNodeById(target.taskId);
				task.name = data.name;
				task.author = data.author;
				task.description = data.description;
			}
			this.refresh();
		}
	},
	updateTaskNode: function(id, data) {
		this.onOperation();
		var target = this.getTaskNodeById(id);
		var listAttributes = null;
		var rangeAttributes = null;
		if(target.type == 'ListTask') {
			listAttributes = data.options;
		} else if(target.type == 'RangeTask') {
			rangeAttributes = {
				start: data.start,
				stop: data.stop,
				step: data.step
			}
		}
		if(target) {
			target.name = data.name;
			target.author = data.author;
			target.description = data.description;
			target.weight = data.weight;
			target.list = listAttributes;
			target.range = rangeAttributes;
			this.refresh();
		}
	},
	getNodeById: function(id) {
		for(var i = 0; i < this.inspectionNodes.length; i++) {
			if(this.inspectionNodes[i].id == id) {
				return this.inspectionNodes[i];
			}
		}
		return null;
	},
	getTaskNodeById: function(id) {
		for(var j = 0; j < this.taskNodes.length; j++) {
			if(this.taskNodes[j].id == id) {
				return this.taskNodes[j];
			}
		}
	},
	getNodesByPId: function(pId) {
		var nodes = [];
		for(var i = 0; i < this.inspectionNodes.length; i++) {
			if(this.inspectionNodes[i].pId == pId) {
				nodes.push(this.inspectionNodes[i]);
			}
		}
		return nodes;
	},
	getTaskNodesByPId: function(pId) {
		var nodes = [];
		for(var i = 0; i < this.taskNodes.length; i++) {
			if(this.taskNodes[i].pId == pId) {
				nodes.push(this.taskNodes[i]);
			}
		}
		return nodes;
	},
	getNodePath: function(node) {
		var parent = node.getParentNode();
		if(parent == null) {
			return node.name;
		} else {
			return this.getNodePath(parent) + ' > ' + node.name;
		}
	}
};