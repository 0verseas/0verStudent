var placementSelection = (function () {

	/**
	*	cache DOM
	*/

	var $upArrow = $('.up-arrow');
	var $downArrow = $('.down-arrow');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$upArrow.on("click", prevWish);
	$downArrow.on("click", nextWish);

	function _init() {

	}

	function prevWish() {
		$(this).closest('tr').insertBefore($(this).closest('tr').prev());
	}

	function nextWish() {
		$(this).closest('tr').insertAfter($(this).closest('tr').next());
	}

})();
