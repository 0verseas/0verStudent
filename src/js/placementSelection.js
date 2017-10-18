(() => {

	/**
	*	private variable
	*/

	let _filterOptionalWish = []; // 篩選的資料（也是需顯示的資料）
	let _optionalWish = []; // 剩餘可選志願
	let _wishList = []; // 已選擇志願

	// 僑先部 cardCode
	const _nupsList = ["1FFFF", "2FFFF", "3FFFF"];

	// 序號調整志願序之參數
	let _prevWishIndex = -1;
	let _currentWishIndex = -1;

	/**
	*	cache DOM
	*/

	const $placementSelectForm = $('#form-placementSelect'); // 聯分表單
	const $optionFilterSelect = $('#select-optionFilter'); // 「招生校系清單」篩選類別 selector
	const $optionFilterInput = $('#input-optionFilter'); // 關鍵字欄位
	const $manualSearchBtn = $('#btn-manualSearch'); // 手動搜尋按鈕
	const $optionalWishList = $('#optionalWish-list'); // 招生校系清單
	const $paginationContainer = $('#pagination-container'); // 分頁區域
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

	$optionFilterSelect.on('change', _generateOptionalWish); // 監聽「招生校系清單」類別選項
	$optionFilterInput.on('keyup', _generateOptionalWish); // // 監聽「招生校系清單」關鍵字
	$saveBtn.on('click', _handleSave);

	async function _init() {
		try {
			const response = await student.getPlacementSelectionOrder();
			if (!response[0].ok) { throw response[0]; }

			const resPlacement = await response[0].json();
			const resOrder = await response[1].json();

			const groupName = ["第一類組", "第二類組", "第三類組"]; // 用於類組 code 轉中文
			await resOrder.forEach((value, index) => { // 志願列表格式整理
				let add = {
					id: value.id,
					cardCode: value.card_code,
					group: groupName[value.group_code - 1],
					school: value.school.title,
					dept: value.title,
					engDept: value.eng_title,
					sortNum: index
				};
				_optionalWish.push(add);
			})

			// 整理已選志願
			let order = [];
			await resPlacement.student_department_admission_placement_order.forEach((value, index) => {
				order.push(value.department_data.id);
			});
			await order.forEach((value, index) => {
				let orderIndex = _optionalWish.findIndex(order => order.id === value)
				_wishList.push(_optionalWish[orderIndex]);
				_optionalWish.splice(orderIndex, 1);
			});

			_generateOptionalWish();
			_generateWishList();
			loading.complete();
		} catch (e) {
			console.log(e);
			if (e.status && e.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			} else {
				e.json && e.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
			}
			loading.complete();
		}
	}

	function _addWish() { // 增加志願
		if (_wishList.length < 70) {
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

	function _removeWish() { // 刪除志願

		const sortNum = $(this).data("sortnum");
		const wishIndex = _wishList.findIndex(order => order.sortNum === sortNum);
		_optionalWish.push(_wishList[wishIndex]);
		_wishList.splice(wishIndex, 1);
		_optionalWish.sort(function(a, b) {
			return parseInt(a.sortNum) - parseInt(b.sortNum);
		});
		_generateOptionalWish();
		_generateWishList();
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

	function _prevWish() { // 志願上調
		const sortNum = $(this).data("sortnum");
		const wishIndex = _wishList.findIndex(order => order.sortNum === sortNum);
		if (wishIndex > 0) {
			const swap = _wishList[wishIndex];
			_wishList[wishIndex] = _wishList[wishIndex - 1];
			_wishList[wishIndex - 1] = swap;
			_generateWishList();
		}
	}

	function _nextWish() { // 志願下調
		const sortNum = $(this).data("sortnum");
		const wishIndex = _wishList.findIndex(order => order.sortNum === sortNum);
		if (wishIndex < _wishList.length - 1) {
			const swap = _wishList[wishIndex];
			_wishList[wishIndex] = _wishList[wishIndex + 1];
			_wishList[wishIndex + 1] = swap;
			_generateWishList();
		}
	}

	function _optionalWishTemplating(data) { // 分頁資料渲染（data.length === 0 時不會被呼叫）
		var html = '';
		$.each(data, function(index, item){
			let badgeNUPS = '';
			if (_nupsList.indexOf(item.id) > -1) {badgeNUPS = '<span class="badge badge-info">僑先部</span>';}
			html += `
			<tr>
			<td>
			<span>` + item.cardCode + `</span> ｜ <span>` + item.group + `</span> ｜ <span>` + item.school + `</span> <br>
			<span>` + item.dept + ` ` + item.engDept + `</span>
			<br />
			` + badgeNUPS + `
			</td>
			<td class="text-right">
			<button type="button" data-sortNum="` + item.sortNum + `" class="btn btn-info btn-sm add-wish">
			<i class="fa fa-plus" aria-hidden="true"></i>
			</button>
			</td>
			</tr>
			`;
		});
		return html;
	}

	function _generateOptionalWish() { // 渲染「招生校系清單」、含篩選
		const filterSelect = '' + $optionFilterSelect.val();
		const filter = $optionFilterInput.val().toUpperCase();

		if (_wishList.length > 0) { // 有選志願
			const _currentWishGroup = _wishList[0].group;
			// 先篩類組
			if (_currentWishGroup === "第一類組") {
				_filterOptionalWish = _optionalWish.filter(function (obj) {
					return obj["group"] === "第一類組";
				});
			} else {
				_filterOptionalWish = _optionalWish.filter(function (obj) {
					return obj["group"] === "第二類組" || obj["group"] === "第三類組";
				});
			}

			// 再篩資料
			_filterOptionalWish = _filterOptionalWish.filter(function (obj) {
				if (filterSelect === "dept") {
					return obj['dept'].toUpperCase().indexOf(filter) > -1 ||
					obj['engDept'].toUpperCase().indexOf(filter) > -1
				}
				return obj[filterSelect].toUpperCase().indexOf(filter) > -1;
			});
		} else { // 沒選志願
			// 全部篩選
			_filterOptionalWish = _optionalWish.filter(function (obj) {
				if (filterSelect === "dept") {
					return obj['dept'].toUpperCase().indexOf(filter) > -1 ||
					obj['engDept'].toUpperCase().indexOf(filter) > -1
				}
				return obj[filterSelect].toUpperCase().indexOf(filter) > -1;
			});
		}

		$paginationContainer.pagination({
			dataSource: _filterOptionalWish,
			callback: function(data, pagination) {
				var html = _optionalWishTemplating(data);
				$optionalWishList.html(html);
				const $addWish = $optionalWishList.find('.add-wish');
				$addWish.on("click", _addWish);
			}
		})

		if (_filterOptionalWish.length === 0) {
			$optionalWishList.html(`
				<tr>
				<td class="text-center" colspan="2">查無資料。</td>
				</tr>
				`);
		}
	}

	function _generateWishList() { // 「渲染已填選志願」
		let rowHtml = '';
		let hasNUPS = false;
		let invalidBadge = '';
		
		for(let i in _wishList) {
			let badgeNUPS = ''
			if (_nupsList.indexOf(_wishList[i].id) > -1) {badgeNUPS = '<span class="badge badge-info">僑先部</span>';}
			rowHtml = rowHtml + `
			<tr data-wishIndex="` + i + `">
			<td>
			<button type="button" data-sortNum="` + _wishList[i].sortNum + `" class="btn btn-danger btn-sm remove-wish"><i class="fa fa-times" aria-hidden="true"></i></button>
			</td>
			<td>
			` + _wishList[i].cardCode + ` ｜ ` + _wishList[i].group + ` ｜ ` + _wishList[i].school + ` <br>
			` + _wishList[i].dept + ` ` + _wishList[i].engDept + `
			<br />
			` + badgeNUPS + invalidBadge + `
			</td>
			<td class="text-right">
			<div class="input-group">
			<input type="text" class="form-control wish-num" value="` + (Number(i) + 1) + `">
			<div class="input-group-btn">
			<button type="button" data-sortNum="` + _wishList[i].sortNum + `" class="btn btn-secondary btn-sm up-arrow">
			<i class="fa fa-chevron-up" aria-hidden="true"></i>
			</button>
			<button type="button" data-sortNum="` + _wishList[i].sortNum + `" class="btn btn-secondary btn-sm down-arrow">
			<i class="fa fa-chevron-down" aria-hidden="true"></i>
			</button>
			</div>
			</div>
			</td>
			</tr>
			`;
			if (hasNUPS === false && _nupsList.indexOf(_wishList[i].id) > -1) {invalidBadge = '<span class="badge badge-warning">無效志願</span>';}
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

	function _handleSave() {
		let order = [];
		if (_wishList.length > 0) {
			_wishList.forEach((value, index) => {
				order.push(value.id);
			});
			const data = {
				order
			}
			loading.start();
			student.setPlacementSelectionOrder(data)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				alert("儲存成功");
				window.location.reload();
				loading.complete();
			})
			.catch((err) => {
				err.json && err.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
				loading.complete();
			})
		} else {
			alert('沒有選擇志願。');
		}
	}

})();
