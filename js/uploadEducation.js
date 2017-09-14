var uploadEducation = (function () {

	/**
	 * cache DOM
	 */

	/**
	 * init
	 */

	_init();

	/**
	 * bind event
	 */

	function _init() {
		$(":file").filestyle({
			htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
			btnClass: "btn-primary",
			text: " 瀏覽"
		});
	}

})();
