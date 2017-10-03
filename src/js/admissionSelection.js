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

	const $notJoinSelection = $('#notJoinSelection'); // 是否不參加聯合分發 checkbox
	const $admissionSelectForm = $('#form-admissionSelect'); // 個人申請表單
	const $optionFilterSelect = $('#select-optionFilter'); // 「招生校系清單」篩選類別 selector
	const $optionFilterInput = $('#input-optionFilter'); // 關鍵字欄位
	const $optionalWishList = $('#optionalWish-list'); // 招生校系清單
	const optionalWishList = document.getElementById('optionalWish-list'); // 招生校系清單，渲染用
	const $wishList = $('#wish-list'); // 已填選志願
	const wishList = document.getElementById('wish-list'); // 已填選志願，渲染用

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$notJoinSelection.on('change', _showWishList); // 監聽是否不參加聯合分發
	$optionFilterSelect.on('change', _filterOptionalWishList); // 監聽「招生校系清單」類別選項
	$optionFilterInput.on('keyup', _filterOptionalWishList); // 監聽「招生校系清單」關鍵字

	function _init() {
		student.setHeader();
		_generateOptionalWish();
		_generateWishList();
	}

	function _showWishList() { // 不參加申請，即不顯示聯分表單
		const isJoin = !$(this).prop("checked");
		if (isJoin) {
			$admissionSelectForm.fadeIn();
		} else {
			$admissionSelectForm.fadeOut();
		}
	}

	function _filterOptionalWishList() { // 篩選校系清單項目
		const filterSelect = Number($optionFilterSelect.val());
		const filter = $optionFilterInput.val().toUpperCase();
		const tr = $optionalWishList.find('tr');

		if (_wishList.length > 0) { // 有選志願
			const currentGroup = _wishList[0].group; // 當前類組
			for (i = 0; i < tr.length; i++) {
				let groupVal = String($(tr[i].getElementsByTagName("span")[1]).text()); // 欄位中的類組
				let spanVal = String($(tr[i].getElementsByTagName("span")[filterSelect]).text()); // 要被篩選的欄位
				if (spanVal) {
					// 先篩選資料
					if (spanVal.toUpperCase().indexOf(filter) > -1) {
						tr[i].style.display = "";
					} else {
						tr[i].style.display = "none";
					}
					// 再篩選類組
					if (currentGroup === "第一類組") {
						if (groupVal === "第二類組" || groupVal === "第三類組") {
							tr[i].style.display = "none";
						}
					} else {
						if (groupVal === "第一類組") {
							tr[i].style.display = "none";
						}
					}
				}
			}
		} else { // 沒選志願
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
	}

	function _addWish() { // 增加志願
		if (_wishList.length < 4) {
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

	function _findRowIndex(row) { // 尋找該志願選項 index（移動或刪除志願時使用）
		const tableRow = row.closest('tr');
		const index = tableRow.data('wishindex');
		return index;
	}

	function _prevWish() { // 志願上調
		const rowIndex = _findRowIndex($(this));
		if (rowIndex > 0) {
			const swap = _wishList[rowIndex];
			_wishList[rowIndex] = _wishList[rowIndex - 1];
			_wishList[rowIndex - 1] = swap;
			_generateWishList();
		}
	}

	function _nextWish() { // 志願下調
		const rowIndex = _findRowIndex($(this));
		if (rowIndex < _wishList.length - 1) {
			const swap = _wishList[rowIndex];
			_wishList[rowIndex] = _wishList[rowIndex + 1];
			_wishList[rowIndex + 1] = swap;
			_generateWishList();
		}
	}

	function _removeWish() { // 刪除志願
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

	function _savePrevWishIndex() { // 暫存志願序號
		_prevWishIndex = $(this).val() - 1;
	}

	function _chWishIndex() { // 修改志願序號
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

	function _generateOptionalWish() { // 渲染「招生校系清單」
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
		optionalWishList.innerHTML = rowHtml;

		const $addWish = $optionalWishList.find('.add-wish');
		$addWish.on("click", _addWish);
	}

	function _generateWishList() { // 「渲染已填選志願」
		let rowHtml = '';
		for(i in _wishList) {
			rowHtml = rowHtml + `
			<tr data-wishIndex="` + i + `">
			<td>
			<button type="button" class="btn btn-danger btn-sm remove-wish"><i class="fa fa-times" aria-hidden="true"></i></button>
			</td>
			<td>
			` + _wishList[i].id + ` ｜ ` + _wishList[i].group + ` ｜ ` + _wishList[i].school + ` <br>
			` + _wishList[i].dept + ` ` + _wishList[i].engDept + `
			</td>
			<td class="text-right">
			<div class="input-group">
			<input type="text" class="form-control wish-num" value="` + (Number(i) + 1) + `">
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
		wishList.innerHTML = rowHtml;

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
