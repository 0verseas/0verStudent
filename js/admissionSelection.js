var admissionSelection = (function () {

	/**
	 * cache DOM
	 */

	var $grid = $('.grid');

	/**
	 * init
	 */

	_init();

	/**
	 * bind event
	 */

	function _init() {
		Sortable.create(sortTrue, {
			group: "sorting",
			sort: true
		});
	}

})();
