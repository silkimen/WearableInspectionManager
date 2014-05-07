var resultDetailManager = {
	// Initialisierung
	init: function() {
		$('#resultdetail').on('pagebeforeshow', this.onLoad);
		$('#resultdetail').on('pageshow', this.onAfterLoad);
		$('#resultdetail-back').click(this.onLeave);
	},
	
	// Prepare Funktionen
	
	// Event Handler
	onLoad: function(event, data) {
		if(data.prevPage.attr('id') != 'result') {
			// springe zurück auf result und lade Daten neu, wenn ein Reload durchgeführt wird
			inspectionTree.loadData();
			$.mobile.back();
			return;
		}
		$('.resultdetail-list').html('');
		executionManager.getListDetail(sessionStorage.executionId, function(list) {
			list.forEach(function(item) {
				if(item.type == 'Main') {
					$('.resultdetail-title').text(item.name);
				} else {
					if(item.value === undefined) {
						$('<li data-role="list-divider">'+ item.name +'</li>').appendTo('.resultdetail-list');
					} else {
						switch(item.type) {
							case 'BooleanTask':
								if(item.value == null) {
									item.value = $.t('resultdetailpage.novalue');
								} else if(item.value === false) {
									item.value = $.t('resultdetailpage.false');
								} else {
									item.value = $.t('resultdetailpage.true');
								}
								break;
							case 'DateTask':
								if(item.value == null) {
									item.value = $.t('resultdetailpage.novalue');
								} else {
									item.value = (new Date(item.value)).toLocaleString();
								}
								break;
						}
						if(item.value === null) {
							item.value = $.t('resultdetailpage.novalue');
						}
						if(item.description == '') {
							item.description = $.t('resultdetailpage.nodescription');
						}
						var img = '<img class="resultdetail-list-img" src="img/task-icons/' + item.type + 'Big.png">';
						var name = '<h2>' + item.name + '</h2>';
						var desc = '<p>' + $.t('resultdetailpage.description') + ': <strong>' + item.description + '</strong></p>';
						var val = '<p>' + $.t('resultdetailpage.value') + ': <strong>' + item.value + '</strong></p>';
						$('<li>').append(img + name + desc + val).appendTo('.resultdetail-list');
					}
				}
			});
		});
		$('.resultdetail-list').listview().listview('refresh');
	},
	onAfterLoad: function(event, data) {
		
	},
	onLeave: function() {
		$.mobile.back();
	}
};