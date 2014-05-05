// Datenobjekt zur Kapselung
var inspectionClient = {
	title: 'Inspection Manager',
	version: '0.1',
	isNwPackage: typeof(process) == 'object',
	init: function() {
		// initialisiere Einstellungen
		inspectionSettings.init();
		
		// initialisiere Lokalisierung
		i18n.init({
			lng: inspectionClient.settings.language,
			resGetPath: 'locales/__ns__-__lng__.json'
		}, function(translate) {
			$('.inspection-logo-small').text(translate('app.name') + ' ' + inspectionClient.version);
			$('body').i18n();
		});
		
		// initialisiere Manager View Handler
		inspectionManager.init();
		
		// initialisiere Tasksedit View Handler
		taskManager.init();
		
		// initialisiere Result View Handler
		resultManager.init();
	},
	settings: {
		// wird aus dem Localstorage geladen, oder Defaults werden übernommen
	}
};

// jQuery Onready Funktion
$(function() {
	inspectionClient.init();
});