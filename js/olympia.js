(() => {

	/**
	*	private variable
	*/

	let _optionalWish = [
	{id:"1001", group: "第一類組", school: "國立暨南國際大學", dept: "中國文學系", engDept: "Dept. of Chinese Literature"},
	{id:"1002", group: "第一類組", school: "國立暨南國際大學", dept: "外國語文學系", engDept: "Dept. of Foreign Languages and Literatures"},
	{id:"1003", group: "第一類組", school: "國立暨南國際大學", dept: "歷史學系", engDept: "Dept. of History"},
	{id:"1004", group: "第二類組", school: "國立暨南國際大學", dept: "哲學系", engDept: "Dept. of Philosophy"},
	{id:"1005", group: "第二類組", school: "國立暨南國際大學", dept: "人類學系", engDept: "Dept. of Anthropology"},
	{id:"1006", group: "第二類組", school: "國立暨南國際大學", dept: "圖書資訊學系", engDept: "Dept. of Library and Information Science"},
	{id:"1007", group: "第二類組", school: "國立暨南國際大學", dept: "日本語文學系", engDept: "Dept. of Japanese Language and Literature"},
	{id:"1008", group: "第三類組", school: "國立暨南國際大學", dept: "戲劇學系", engDept: "Dept. of Drama and Theatre"},
	{id:"1008", group: "第三類組", school: "國立暨南國際大學", dept: "法律學系法學組", engDept: "Dept. of Law, Division of Legal Science"},
	{id:"1009", group: "第三類組", school: "國立暨南國際大學", dept: "政治學系政治理論組", engDept: "Dept. of Political Science, Political Theory Division"},
	{id:"1010", group: "第三類組", school: "國立暨南國際大學", dept: "經濟學系", engDept: "Dept. of Economics"}
	];

	let _wishList = [];

	let _prevWishIndex = -1;
	let _currentWishIndex = -1;

	/**
	*	cache DOM
	*/

	const $hasOlympiaForm = $('#form-hasOlympia');
	const $hasOlympia = $hasOlympiaForm.find('.hasOlympia');
	const $olympiaSelectForm = $('#form-olympiaSelect');
	const $optionFilterSelect = $('#select-optionFilter');
	const $optionFilterInput = $('#input-optionFilter'); // 搜尋欄
	const $optionalWishList = $('#optionalWish-list');
	const $wishList = $('#wish-list');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$hasOlympia.on('change', _showWishList);
	$optionFilterSelect.on('change', _filterOptionalWishList);
	$optionFilterInput.on('keyup', _filterOptionalWishList); // 列表篩選

	function _init() {
		student.setHeader();
		_generateOptionalWish();
		_generateWishList();
	}

	function _showWishList() {
		const hasOlympiaVal = Number($(this).val());
		if (hasOlympiaVal === 0) {
			$olympiaSelectForm.fadeOut();
		} else if (hasOlympiaVal === 1) {
			$olympiaSelectForm.fadeIn();
		}
	}

	function _filterOptionalWishList() {
		const filterSelect = Number($optionFilterSelect.val());
		const filter = $optionFilterInput.val().toUpperCase();
		const tr = $optionalWishList.find('tr');
		for (i = 0; i < tr.length; i++) {
			let spanVal = $(tr[i].getElementsByTagName("span")[filterSelect]).text();
			if (spanVal) {
				if (spanVal.toUpperCase().indexOf(filter) > -1) {
					tr[i].style.display = "";
				} else {
					tr[i].style.display = "none";
				}
			}
		}
	}

	function _addWish() {
		if (_wishList.length < 3) {
			let optionalIndex = $(this).data("optionalindex");
			_wishList.push(_optionalWish[optionalIndex]);
			_optionalWish.splice(optionalIndex, 1);
			_generateOptionalWish();
			_generateWishList();
			_filterOptionalWishList();
		} else {
			alert('志願數量已達上限。');
		}
	}

	function _findRowIndex(row) {
		const tableRow = row.closest('tr');
		const index = tableRow.data('wishindex');
		return index;
	}

	function _prevWish() {
		const rowIndex = _findRowIndex($(this));
		if (rowIndex > 0) {
			const swap = _wishList[rowIndex];
			_wishList[rowIndex] = _wishList[rowIndex - 1];
			_wishList[rowIndex - 1] = swap;
			_generateWishList();
		}
	}

	function _nextWish() {
		const rowIndex = _findRowIndex($(this));
		if (rowIndex < _wishList.length - 1) {
			const swap = _wishList[rowIndex];
			_wishList[rowIndex] = _wishList[rowIndex + 1];
			_wishList[rowIndex + 1] = swap;
			_generateWishList();
		}
	}

	function _removeWish() {
		const rowIndex = _findRowIndex($(this));
		_optionalWish.push(_wishList[rowIndex]);
		_wishList.splice(rowIndex, 1);
		_optionalWish.sort(function(a, b) {
		    return parseInt(a.id) - parseInt(b.id);
		});
		_generateOptionalWish();
		_generateWishList();
		_filterOptionalWishList();
	}

	function _savePrevWishIndex() {
		_prevWishIndex = $(this).val() - 1;
	}

	function _chWishIndex() {
		let currentNum = $(this).val();

		if (currentNum > _wishList.length) {
			currentNum = _wishList.length;
		} else if (currentNum < 1 ) {
			currentNum = 1;
		}
		_currentWishIndex = currentNum - 1;

		const element = _wishList[_prevWishIndex];
		_wishList.splice(_prevWishIndex, 1);
		_wishList.splice(_currentWishIndex, 0, element);
		_generateWishList();
	}

	function _generateOptionalWish() {
		let rowHtml = '';

		for(i in _optionalWish) {
			rowHtml = rowHtml + `
			<tr>
			<td>
			<span>` + _optionalWish[i].id + `</span> ｜ <span>` + _optionalWish[i].group + `</span> ｜ <span>` + _optionalWish[i].school + `</span> <br>
			<span>` + _optionalWish[i].dept + ` ` + _optionalWish[i].engDept + `</span>
			</td>
			<td class="text-right">
			<button type="button" data-optionalIndex="` + i + `" class="btn btn-info btn-sm add-wish">
			<i class="fa fa-plus" aria-hidden="true"></i>
			</button>
			</td>
			</tr>
			`;
		}
		$optionalWishList.html(rowHtml);

		const $addWish = $optionalWishList.find('.add-wish');
		$addWish.on("click", _addWish);
	}

	function _generateWishList() {
		let rowHtml = '';
		for(i in _wishList) {
			rowHtml = rowHtml + `
			<tr class="row" data-wishIndex="` + i + `">
			<td class="col-1">
			<button type="button" class="btn btn-danger btn-sm remove-wish"><i class="fa fa-times" aria-hidden="true"></i></button>
			</td>
			<td class="col-7 col-sm-8">
			` + _wishList[i].id + ` ｜ ` + _wishList[i].group + ` ｜ ` + _wishList[i].school + ` <br>
			` + _wishList[i].dept + ` ` + _wishList[i].engDept + `
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

		const $removeWish = $wishList.find('.remove-wish');
		const $wishNum = $wishList.find('.wish-num');
		const $upArrow = $wishList.find('.up-arrow');
		const $downArrow = $wishList.find('.down-arrow');
		$removeWish.on("click", _removeWish);
		$wishNum.on("focusin", _savePrevWishIndex);
		$wishNum.on("change", _chWishIndex);
		$upArrow.on("click", _prevWish);
		$downArrow.on("click", _nextWish);
	}

})();
