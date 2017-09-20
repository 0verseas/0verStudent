(() => {

	/**
	*	cache DOM
	*/
	
	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	function _init() {
		student.setHeader();
		
		$(":file").filestyle({
			htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
			btnClass: "btn-secondary",
			text: " 瀏覽"
		});
	}

})();
