const App = {
	init: () => {
		console.log('App iniciado');
		App.initSections;		
	},

	initSections: () => {
		App.initVideo();
		App.initSlider();
		App.initCards();
		App.initAccordions();
		App.initDiscursiveActivity();
		App.initObjectiveActivity();
	},

	initVideo: () => {},
	initSlider: () => {},
	initCards: () => {},
	initAccordions: () => {},
	initDiscursiveActivity: () => {},
	initObjectiveActivity: () => {}
};

document.addEventListener('DOMContentLoaded', App.init);