var inspectionSettings = {
	defaults: {
		serverUrl: 'http://localhost:9900/',
		userName: 'Sefa Ilkimen',
		language: 'en'
	},
	init: function() {
		if(localStorage.hasOwnProperty('settings')) {
			inspectionClient.settings = JSON.parse(localStorage.settings);
		} else {
			inspectionClient.settings = this.defaults;
			if(!inspectionClient.isNwPackage) {
				inspectionClient.settings.serverUrl = location.protocol + '//' + location.host + '/';
			}
		}
		$("body>[data-role='panel']").panel().enhanceWithin();
		$('#input-serverurl').val(inspectionClient.settings.serverUrl)
		$('#input-username').val(inspectionClient.settings.userName);
		$("input[name='radio-language'][value='" + inspectionClient.settings.language + "']").attr('checked',true).checkboxradio('refresh');
		$('#settings-save').click(this.onSave);
	},
	onSave: function(e) {
		var url = $('#input-serverurl').val();
		var lang = $("input[name='radio-language']:checked").val();
		if(url.charAt(url.length - 1) != '/') {
			url = url + '/';
			$('#input-serverurl').val(url);
		}
		localStorage.settings = JSON.stringify({
			serverUrl: url,
			userName: $('#input-username').val(),
			language: lang
		});
		location.reload();
	}
};