(() => {

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	function _init() {
		$('#btn-smart').attr('href', env.baseUrl + '/students/print-admission-paper');
		console.log("Asd");
		loading.complete();
	}

})();