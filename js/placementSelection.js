var placementSelection = (function () {

	/**
	*	cache DOM
	*/

	var $upArrow = $('.up-arrow');
	var $downArrow = $('.down-arrow');
	var $removeWish = $('.remove-wish');
	var $wishList = $('#wish-list');
	var $wishRow = $wishList.find('tr');
	var $wishNum = $wishList.find('.wish-num');

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
	$wishNum.on("focusin", savePrevWishNum);
	$wishNum.on("change", chWishNum);

	function _init() {
		refreshWishNum();
	}

	function prevWish() {
		$(this).closest('tr').insertBefore($(this).closest('tr').prev());
	}

	function nextWish() {
		$(this).closest('tr').insertAfter($(this).closest('tr').next());
	}

	function removeWish() {
		var tableRow = $(this).closest('tr');
		var tbody = $("tr.row");
		var rowIndex = tbody.index(tableRow);

		// console.log(tableRow);
		// console.log(tbody);
		console.log(rowIndex);


		// $(this).closest('tr').remove();
		// 接上 API 後，需要將移除的志願，還原到招生校系清單的陣列中。
	}

	function savePrevWishNum() {
		console.log("Saving value " + $(this).val());
		$(this).data('val', $(this).val());
	}

	function chWishNum() {
		var prev = $(this).data('val');
		var current = $(this).val();
		$(this).data('val', $(this).val());

		if (current >= $wishRow.length) {
			current = $wishRow.length;
			$($wishRow[prev-1]).insertAfter($wishRow[current-1]);
		} else {
			$($wishRow[prev-1]).insertBefore($wishRow[current-1]);
		}

		if (current < prev) {
			var x = $wishRow[prev-1];
			for (var i = prev-1; i > current-1 ; i--) {
				$wishRow[i] = $wishRow[i-1]
			}
			$wishRow[current-1] = x;
		} else {
			var x = $wishRow[prev-1];
			for (var i = prev-1; i < current-1 ; i++) {
				$wishRow[i] = $wishRow[i+1]
			}
			$wishRow[current-1] = x;
		}

		



		// console.log($wishRow[current-1]);
		
		refreshWishNum();

		// console.log($wishRow);

		// console.log("Prev value " + prev);
		// console.log("New value " + current);
		
	}

	function refreshWishNum() {
		for (var i = 0; i < $wishRow.length; i++) {
			$($wishRow[i]).find('.wish-num').val(i+1);
		}
		console.log($wishRow);
	}

})();
