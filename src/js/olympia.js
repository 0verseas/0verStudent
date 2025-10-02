(() => {

	/**
	*	private variable
	*/

	// 是否有奧林匹亞獎項
	let _hasOlympia = null;

	let _filterOptionalWish = []; // 篩選的資料（也是需顯示的資料）
	let _optionalWish = []; // 剩餘可選志願
	let _wishList = []; // 已選擇志願

	// 序號調整志願序之參數
	let _prevWishIndex = -1;
	let _currentWishIndex = -1;

	/**
	*	cache DOM
	*/

	const $hasOlympiaForm = $('#form-hasOlympia'); // 是否有「奧林匹亞獎項」表單
	const $hasOlympia = $hasOlympiaForm.find('.hasOlympia'); // 是否有「奧林匹亞獎項」選項
	const $olympiaSelectForm = $('#form-olympiaSelect'); // 奧林匹亞志願選擇表單
	const $optionFilterSelect = $('#select-optionFilter'); // 「招生校系清單」篩選類別 selector
	const $optionFilterInput = $('#input-optionFilter'); // 關鍵字欄位
	const $typeFilterSelector = $('#dept-type-selector');
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

	$hasOlympia.on('change', _changeHasOlympia); // 監聽是否曾獲得國際數理奧林匹亞競賽或美國國際科展獎項
	$optionFilterSelect.on('change', _generateOptionalWish); // 監聽「招生校系清單」類別選項
	$optionFilterInput.on('keyup', _generateOptionalWish); // 監聽「招生校系清單」關鍵字
	$typeFilterSelector.on('change', _generateOptionalWish); // 監聽「系所類型」selector
	$manualSearchBtn.on('click', _generateOptionalWish); // 手動篩選清單，解決在手機上輸入中文不會觸發 keyup 的問題
	$saveBtn.on('click', _handleSave);

	async function _init() {
		try {
			const response = await student.getOlympiaAspirationOrder();
			if (!response[0].ok) { throw response[0]; }

			const resOlympia = await response[0].json();
			const resOrder = await response[1].json();

			await resOrder.forEach((value, index) => { // 志願列表格式整理
				let add = {
					id: value.id, // 系所代碼
					cardCode: value.card_code, //  畫卡號碼
					mainGroup: value.main_group_data.title, // 學群
					school: value.school.title, // 校名
					dept: value.title, // 中文系名
					engDept: value.eng_title, // 英文系名
					specialDeptType: value.special_dept_type, // 特殊系所
					sortNum: index, // 根據初始資料流水號，用於排序清單、抓取資料,
					is_extended_department: value.is_extended_department, // 系所類型
					type: '<span class="badge badge-light hide">一般系所</span>', // 系所類型標籤
					has_eng_taught: value.has_eng_taught, // 是否為全英語授課系所
				};
				if(add.is_extended_department == 1){
					add.type = '<span class="badge badge-warning">重點產業系所</span>';
				} else if(value.is_extended_department == 2){
					add.type = '<span class="badge table-primary">國際專修部</span>';
				}
				_optionalWish.push(add);
			})

			// checked 是否曾獲得獎項
			if (resOlympia.student_misc_data.has_olympia_aspiration !== null) {
				_hasOlympia = +resOlympia.student_misc_data.has_olympia_aspiration;
				$hasOlympia[_hasOlympia].checked = true;
			}

			// 整理已選志願
			let order = [];
			await resOlympia.student_olympia_aspiration_order.forEach((value, index) => {
				order.push(value.department_data.id);
			});
			await order.forEach((value, index) => {
				let orderIndex = _optionalWish.findIndex(order => order.id === value)
				_wishList.push(_optionalWish[orderIndex]);
				_optionalWish.splice(orderIndex, 1);
			});

			_generateOptionalWish();
			_generateWishList();
			_showWishList();
			loading.complete();
		} catch (e) {
			if (e.status && e.status === 401) {
				swal({title: `請重新登入`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=>{
					location.href = "./index.html";
				});
			} else if (e.status && e.status === 403) {
				e.json && e.json().then(data => {
					swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false})
					.then(()=>{
						if(window.history.length>1){
							window.history.back();
						} else {
							location.href = "./personalInfo.html";
						}
					});
				});
			} else {
				e.json && e.json().then((data) => {
					console.error(data);
					swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
				})
			}
			loading.complete();
		}
	}

	function _changeHasOlympia() {
		_hasOlympia = Number($(this).val());
		_showWishList();
	}

	function _showWishList() { // 不參加申請，即不顯示聯分表單
		if (_hasOlympia === 0) {
			$olympiaSelectForm.fadeOut();
		} else if (_hasOlympia === 1) {
			$olympiaSelectForm.fadeIn();
		}
	}

	function _addWish() { // 增加志願
		if (_wishList.length < 3) {
			const sortNum = $(this).data("sortnum");
			const optionalIndex = _optionalWish.findIndex(order => order.sortNum === sortNum)
			const pageNum = $paginationContainer.pagination('getSelectedPageNum');
			_wishList.push(_optionalWish[optionalIndex]);
			_optionalWish.splice(optionalIndex, 1);
			_generateOptionalWish(pageNum);
			_generateWishList();
		} else {
			swal({title:`志願數量已達上限。`, confirmButtonText:'確定', type:'warning'});
		}
	}

	function _removeWish() { // 刪除志願
		const sortNum = $(this).data("sortnum");
		const wishIndex = _wishList.findIndex(order => order.sortNum === sortNum);
		const pageNum = (_filterOptionalWish.length === 0) ? 1 : $paginationContainer.pagination('getSelectedPageNum');
		_optionalWish.push(_wishList[wishIndex]);
		_wishList.splice(wishIndex, 1);
		_optionalWish.sort(function(a, b) {
			return parseInt(a.sortNum) - parseInt(b.sortNum);
		});
		_generateOptionalWish(pageNum);
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
		const medicalList = ["醫學系", "牙醫學系", "中醫學系"];
		$.each(data, function(index, item){
			let medicalHTML = '';
			if (item.specialDeptType !== null && medicalList.indexOf(item.specialDeptType) > -1) {
				medicalHTML = ' class="bg-medical"';
			}
			html += `
			<tr${medicalHTML}>
			<td>
			<span>` + item.cardCode + `</span> ｜ <span>` + item.mainGroup + `</span> ｜ <span>` + item.school + `</span> <br>
			<span>` + item.dept + ` ` + item.engDept + ` ` + item.type + `</span>
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

	function _generateOptionalWish(pageNum) { // 渲染「招生校系清單」、含篩選
		pageNum = (!isNaN(parseFloat(pageNum)) && isFinite(pageNum)) ? pageNum : 1;
		const filterSelect = '' + $optionFilterSelect.val();
		let filter = '';
		if(filterSelect == 'type'){
			$optionFilterInput.hide();
			$typeFilterSelector.show();
			filter = $typeFilterSelector.val();
		} else {
			$optionFilterInput.show();
			$typeFilterSelector.hide();
			filter = $optionFilterInput.val().toUpperCase();
		}

		_filterOptionalWish = _optionalWish.filter(function (obj) {
			if (filterSelect === "dept") {
				return obj['dept'].toUpperCase().indexOf(filter) > -1 ||
				obj['engDept'].toUpperCase().indexOf(filter) > -1
			}
			return obj[filterSelect].toUpperCase().indexOf(filter) > -1;
		});

		$paginationContainer.pagination({
			dataSource: _filterOptionalWish,
			pageNumber: pageNum,
			callback: function(data, pagination) {
				var html = _optionalWishTemplating(data);
				$optionalWishList.html(html);
				const $addWish = $optionalWishList.find('.add-wish');
				$addWish.on("click", _addWish);
			}
		});

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
		const medicalList = ["醫學系", "牙醫學系", "中醫學系"];

		for(let i in _wishList) {
			let medicalHTML = '';
			if (_wishList[i].specialDeptType !== null && medicalList.indexOf(_wishList[i].specialDeptType) > -1) {
				medicalHTML = ' class="bg-medical"';
			}
			rowHtml = rowHtml + `
			<tr${medicalHTML} data-wishIndex="` + i + `">
			<td>
			<button type="button" data-sortNum="` + _wishList[i].sortNum + `" class="btn btn-danger btn-sm remove-wish"><i class="fa fa-times" aria-hidden="true"></i></button>
			</td>
			<td>
			` + _wishList[i].cardCode + ` ｜ ` + _wishList[i].mainGroup + ` ｜ ` + _wishList[i].school + ` <br>
			` + _wishList[i].dept + ` ` + _wishList[i].engDept + `
			</td>
			<td class="text-right td-wish-num">
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

	async function _handleSave() {
		let hasMI = false;
		if (_hasOlympia === 1) {
			let order = [];
			if (_wishList.length > 0) {
				_wishList.forEach((value, index) => {
					order.push(value.id);
					if (value.is_extended_department == 1 && value.has_eng_taught != 1) {
						hasMI = true;
					}
				});
				if(hasMI){
					let hasMIConfirmed = await swal({
						title: `按下確定後，將儲存志願`,
						html:`<ol style="list-style:cjk-ideographic">
									<li>您已選填【重點產業系所】志願，報名時須另檢附華語文能力測驗(TOCFL)基礎級(A2)以上之證明，或達前開程度之中文能力證明文件<br>（例如:「歷年成績單(含中文科目成績)」、「各類會考之中文成績或證明」、「就讀學校以中文授課證明」、其他足以佐證個人中文能力資料等）。</li>
									<li>前開證明文件為分發【重點產業系所】必要文件，請問您是否已瞭解該規定並確定選填【重點產業系所】？</li>
								</ol>`,
						type:"question",
						showCancelButton: true,
						confirmButtonText: '確定',
						cancelButtonText: '取消',
						confirmButtonColor: '#5cb85c',
						cancelButtonColor: '#d9534f',
						allowOutsideClick: false,
						reverseButtons: true
					});
					if(!hasMIConfirmed){
						return;
					}
				}
				const data = {
					has_olympia_aspiration: _hasOlympia,
					order
				};
				await loading.start();
				await student.setOlympiaAspirationOrder(data)
				.then((res) => {
					if (res.ok) {
						return res.json();
					} else {
						throw res;
					}
				})
				.then((json) => {
					// console.log(json);
					swal({title: `儲存成功`, type:"success", confirmButtonText: '確定', allowOutsideClick: false})
					.then(()=>{
						window.location.reload();
					});
					loading.complete();
				})
				.catch((err) => {
					err.json && err.json().then((data) => {
						console.error(data);
						swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
					});
					loading.complete();
				})
			} else {
				swal({title:`沒有選擇志願。`, confirmButtonText:'確定', type:'warning'});
			}
		} else if(_hasOlympia === 0){
			const data = {
				has_olympia_aspiration: _hasOlympia,
			};
			loading.start();
			student.setOlympiaAspirationOrder(data)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				// console.log(json);
				swal({title: `儲存成功`, type:"success", confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=>{
					window.location.reload();
				});
				loading.complete();
			})
			.catch((err) => {
				err.json && err.json().then((data) => {
					console.error(data);
					swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
				});
				loading.complete();
			})
		} else {
			swal({title:`請選擇是或否`, confirmButtonText:'確定', type:'warning'});
		}
	}

})();
