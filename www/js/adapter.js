var inspectionItem = function() {
	var GenericTree = function() {
		this.class = 'net.muszytowski.WearableInspectionServer.items.InspectionTree';
		this.resourceIdentifier = 1;
		this.name = 'Inspection Tree';
		this.author = 'Inspection Manager';
		this.children = [];
		this.data = null;
	}
	var GenericTask = function() {
		this.name = '';
		this.description = '';
		this.author = '';
		this.date = '';
		this.resourceIdentifier = null;
		this.weight = 0;
	}
	
	var GenericListOption = function() {
		this.class = 'net.muszytowski.WearableInspectionServer.items.GenericListOption';
		this.value = '';
	}

	var Task = function() {
		this.class = 'net.muszytowski.WearableInspectionServer.items.Task';
		this.weight = 1;
		this.children = [];
	}
	Task.prototype = new GenericTask();

	var BooleanTask = function() {
		this.class = 'net.muszytowski.WearableInspectionServer.items.BooleanTask';
		this.value = false;
	}
	BooleanTask.prototype = new GenericTask();

	var DateTask = function() {
		this.class = 'net.muszytowski.WearableInspectionServer.items.DateTask';
		this.value = '';
	}
	DateTask.prototype = new GenericTask();

	var FloatTask = function() {
		this.class = 'net.muszytowski.WearableInspectionServer.items.FloatTask';
		this.value = 0.0;
	}
	FloatTask.prototype = new GenericTask();

	var IntegerTask = function() {
		this.class = 'net.muszytowski.WearableInspectionServer.items.IntegerTask';
		this.value = 0;
	}
	IntegerTask.prototype = new GenericTask();

	var StringTask = function() {
		this.class = 'net.muszytowski.WearableInspectionServer.items.StringTask';
		this.value = 0;
	}
	StringTask.prototype = new GenericTask();

	var ListTask = function() {
		this.class = 'net.muszytowski.WearableInspectionServer.items.ListTask';
		this.value = '';
		this.options = [];
	}
	ListTask.prototype = new GenericTask();

	var RangeTask = function() {
		this.class = 'net.muszytowski.WearableInspectionServer.items.RangeTask';
		this.start = 0;
		this.stop = 1;
		this.step = 0.1;
		this.value = '';
	}
	RangeTask.prototype = new GenericTask();
	
	var InspectionTree = function() {}
	InspectionTree.prototype = new GenericTree();
		
	var ListOption = function() {
		this.class = 'net.muszytowski.WearableInspectionServer.items.ListOption';
	}
	ListOption.prototype = new GenericListOption();
	
	return {
		InspectionTree: InspectionTree,
		ListOption: ListOption,
		Task: Task,
		BooleanTask: BooleanTask,
		DateTask: DateTask,
		FloatTask: FloatTask,
		IntegerTask: IntegerTask,
		StringTask: StringTask,
		ListTask: ListTask,
		RangeTask: RangeTask
	};
}();


var inspectionAdapter = {
	createServerObject: function(node) {
		if(node.type == 'group' || node.type == 'doc') {
			var children = inspectionTree.getNodesByPId(node.id);
			var childrenArray = [];
			for(var i = 0; i < children.length; i++) {
				childrenArray.push(this.createServerObject(children[i]));
			}
			return {
				class: 'net.muszytowski.WearableInspectionServer.items.InspectionTree',
				children: childrenArray,
				resourceIdentifier: node.id,
				data: node.type == 'group' ? null : this.createServerObject(inspectionTree.getTaskNodeById(node.taskId)),
				name: node.name,
				author: node.author
			};
		} else {
			var children = inspectionTree.getTaskNodesByPId(node.id);
			var childrenArray = [];
			for(var i = 0; i < children.length; i++) {
				childrenArray.push(this.createServerObject(children[i]));
			}

			var item = new inspectionItem[node.type]();
			item.resourceIdentifier = node.id;
			item.name = node.name;
			item.description = node.description;
			item.author = node.author;
			item.date = node.date;

			switch(node.type) {
				case 'BooleanTask':
				case 'DateTask':
				case 'FloatTask':
				case 'IntegerTask':
				case 'StringTask':
					item.weight = node.weight;
					item.value = node.value;
					return item;
					break;
				case 'ListTask':
					item.weight = node.weight;
					item.value = node.value;
					item.options = node.list;
					return item;
					break;
				case 'RangeTask':
					item.weight = node.weight;
					item.start = node.range.start;
					item.stop = node.range.stop;
					item.step = node.range.step;
					item.value = node.value;
					return item;
					break;
				case 'Task':
					item.weight = node.weight;
					item.children = childrenArray;
					return item;
					break;
			}
		}
	}
};