(() => {

	/**
	*	private variable
	*/

	// 是否有奧林匹亞獎項
	let _isJoin = 0;

	let _filterOptionalWish = []; // 篩選的資料（也是需顯示的資料）
	let _optionalWish = []; // 剩餘可選志願
	let _wishList = []; // 已選擇志願

	// 序號調整志願序之參數
	let _prevWishIndex = -1;
	let _currentWishIndex = -1;

	/**
	*	cache DOM
	*/

	const $notJoinSelection = $('#notJoinSelection'); // 是否不參加聯合分發 checkbox
	const $admissionSelectForm = $('#form-admissionSelect'); // 個人申請表單
	const $optionFilterSelect = $('#select-optionFilter'); // 「招生校系清單」篩選類別 selector
	const $optionFilterInput = $('#input-optionFilter'); // 關鍵字欄位
	const $manualSearchBtn = $('#btn-manualSearch'); // 手動搜尋按鈕
	const $optionalWishList = $('#optionalWish-list'); // 招生校系清單
	const $paginationContainer = $('#pagination-container');
	const $wishList = $('#wish-list'); // 已填選志願
	const wishList = document.getElementById('wish-list'); // 已填選志願，渲染用
	const $saveBtn = $('#btn-save');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$notJoinSelection.on('change', _changeIsJoin); // 監聽是否不參加聯合分發
	$optionFilterSelect.on('change', _generateOptionalWish); // 監聽「招生校系清單」類別選項
	$optionFilterInput.on('keyup', _generateOptionalWish); // // 監聽「招生校系清單」關鍵字
	$saveBtn.on('click', _handleSave);

	async function _init() {
		try {
			const response = await student.getAdmissionSelectionOrder();
			if (!response[0].ok) { throw response[0]; }

			const resAdmission = await response[0].json();
			const resOrder = await response[1].json();

			const groupName = ["第一類組", "第二類組", "第三類組"]; // 用於類組 code 轉中文
			await resOrder.forEach((value, index) => { // 志願列表格式整理
				let add = {
					id: value.id,
					group: groupName[value.group_code - 1],
					school: value.school.title,
					dept: value.title,
					engDept: value.eng_title,
					sortNum: index
				};
				_optionalWish.push(add);
			})

			_isJoin = resAdmission.student_misc_data.join_admission_selection;
			$notJoinSelection.prop("checked", !_isJoin);

			// 整理已選志願
			let order = [];
			await resAdmission.student_olympia_aspiration_order.forEach((value, index) => {
				order.push(value.department_data.id);
			});
			await order.forEach((value, index) => {
				let orderIndex = _optionalWish.findIndex(order => order.id === value)
				_wishList.push(_optionalWish[orderIndex]);
				_optionalWish.splice(orderIndex, 1);
			});

			student.setHeader();
			_generateOptionalWish();
			_generateWishList();
			_showWishList();
		} catch (e) {
			console.log('Boooom!!');
			console.log(e);
		}
	}

	function _changeIsJoin() {
		_isJoin = !$(this).prop("checked");
		_showWishList();
	}

	function _showWishList() { // 不參加申請，即不顯示聯分表單
		if (isJoin) {
			$admissionSelectForm.fadeIn();
		} else {
			$admissionSelectForm.hide();
		}
	}

	function _addWish() { // 增加志願
		if (_wishList.length < 3) {
			const sortNum = $(this).data("sortnum");
			const optionalIndex = _optionalWish.findIndex(order => order.sortNum === sortNum)
			_wishList.push(_optionalWish[optionalIndex]);
			_optionalWish.splice(optionalIndex, 1);
			_generateOptionalWish();
			_generateWishList();
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

		for(let i in _optionalWish) {
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
		for(let i in _wishList) {
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
