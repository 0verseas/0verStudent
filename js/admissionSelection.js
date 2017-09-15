var admissionSelection = (function () {

	let _wishList = [
	{school: "國立暨南國際大學", dept: "自動化工程系"},
	{school: "國立暨南國際大學", dept: "工業管理系"},
	{school: "國立暨南國際大學", dept: "電機與資訊技術系"},
	{school: "國立暨南國際大學", dept: "多媒體動畫應用系"},
	{school: "國立暨南國際大學", dept: "行銷與流通管理系"},
	{school: "國立暨南國際大學", dept: "數位旅遊管理系"},
	{school: "國立暨南國際大學", dept: "文化創意與設計系"},
	{school: "國立暨南國際大學", dept: "餐飲管理系"},
	{school: "國立暨南國際大學", dept: "應用外語系"},
	{school: "國立暨南國際大學", dept: "福祉科技與服務管理系"},
	{school: "國立暨南國際大學", dept: "數位生活創意系"}
	];

	let _prevWishIndex = -1;
	let _currentWishIndex = -1;

	/**
	*	cache DOM
	*/

	var $wishList = $('#wish-list');
	var $wishRow = $wishList.find('tr');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	function _init() {
		_generateWishList();
	}

	function _findRowIndex(row) {
		var tableRow = row.closest('tr');
		var tbody = $("tr.row");
		var index = tbody.index(tableRow);
		return index;
	}

	function _prevWish() {
		var rowIndex = _findRowIndex($(this));
		if (rowIndex > 0) {
			var swap = _wishList[rowIndex];
			_wishList[rowIndex] = _wishList[rowIndex-1];
			_wishList[rowIndex-1] = swap;
			_generateWishList();
		}
	}

	function _nextWish() {
		var rowIndex = _findRowIndex($(this));
		if (rowIndex < _wishList.length-1) {
			var swap = _wishList[rowIndex];
			_wishList[rowIndex] = _wishList[rowIndex+1];
			_wishList[rowIndex+1] = swap;
			_generateWishList();
		}
	}

	function _removeWish() {
		var rowIndex = _findRowIndex($(this));
		_wishList.splice(rowIndex, 1);
		_generateWishList();
	}

	function _savePrevWishIndex() {
		_prevWishIndex = $(this).val() - 1;
	}

	function _chWishIndex() {
		var currentNum = $(this).val();

		if (currentNum > _wishList.length) {
			currentNum = _wishList.length;
		} else if (currentNum < 1 ) {
			currentNum = 1;
		}
		_currentWishIndex = currentNum - 1;

		var element = _wishList[_prevWishIndex];
		_wishList.splice(_prevWishIndex, 1);
		_wishList.splice(_currentWishIndex, 0, element);
		_generateWishList();
	}

	function _generateWishList() {
		var rowHtml = '';
		for(i in _wishList) {
			var rowHtml = rowHtml + `
			<tr class="row">
			<td class="col-1">
			<button type="button" class="btn btn-danger btn-sm remove-wish"><i class="fa fa-times" aria-hidden="true"></i></button>
			</td>
			<td class="col-7 col-sm-8">
			` + _wishList[i].school + '<br>' + _wishList[i].dept + `
			</td>
			<td class="col-4 col-sm-3 text-right">
			<div class="input-group">
			<input type="number" class="form-control wish-num" value="` + (Number(i) + 1) + `">
			<div class="input-group-btn">
			<button type="button" class="btn btn-secondary btn-sm up-arrow">
			<i class="fa fa-chevron-up" aria-hidden="true"></i>
			</button>
			<button type="button" class="btn btn-secondary btn-sm down-arrow">
			<i class="fa fa-chevron-down" aria-hidden="true"></i>
			</button>
			</div>
			</div>
			</td>
			</tr>
			`;
		}
		$wishList.html(rowHtml);

		var $removeWish = $('.remove-wish');
		var $wishNum = $wishList.find('.wish-num');
		var $upArrow = $('.up-arrow');
		var $downArrow = $('.down-arrow');
		$removeWish.on("click", _removeWish);
		$wishNum.on("focusin", _savePrevWishIndex);
		$wishNum.on("change", _chWishIndex);
		$upArrow.on("click", _prevWish);
		$downArrow.on("click", _nextWish);
	}

})();
