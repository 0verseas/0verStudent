var admissionSelection = (function () {

	/**
	*	cache DOM
	*/

	var $upArrow = $('.up-arrow');
	var $downArrow = $('.down-arrow');
	var $removeWish = $('.remove-wish');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$upArrow.on("click", prevWish);
	$downArrow.on("click", nextWish);
	$removeWish.on("click", removeWish);

	function _init() {

	}

	function prevWish() {
		$(this).closest('tr').insertBefore($(this).closest('tr').prev());
	}

	function nextWish() {
		$(this).closest('tr').insertAfter($(this).closest('tr').next());
	}

	function removeWish() {
		$(this).closest('tr').remove();
		// 接上 API 後，需要將移除的志願，還原到招生校系清單的陣列中。
	}
	
})();
