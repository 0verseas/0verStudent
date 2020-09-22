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
	const $group1QuotaBtn = $('#btn-group1Quota');
	const $group2QuotaBtn = $('#btn-group2Quota');
	const $group3QuotaBtn = $('#btn-group3Quota');
	const $optionFilterSelect = $('#select-optionFilter'); // 「招生校系清單」篩選類別 selector
	const $optionFilterInput = $('#input-optionFilter'); // 關鍵字欄位
	const $manualSearchBtn = $('#btn-manualSearch'); // 手動搜尋按鈕
	const $optionalWishList = $('#optionalWish-list'); // 招生校系清單
	const $paginationContainer = $('#pagination-container'); // 分頁區域
	const $wishList = $('#wish-list'); // 已填選志願
	const wishList = document.getElementById('wish-list'); // 已填選志願，渲染用
	const $saveBtn = $('#btn-save');
	const $confirmedBtn = $('#btn-confirmed');
	const $secondConfirm = $('#secondConfirm');
	const $notToFFInfo = $('#not-to-FF');  // 提醒目前是不分發僑先部狀態的 alert

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$optionFilterSelect.on('change', _generateOptionalWish); // 監聽「招生校系清單」類別選項
	$optionFilterInput.on('keyup', _generateOptionalWish); // // 監聽「招生校系清單」關鍵字
	$manualSearchBtn.on('click', _generateOptionalWish);
	$saveBtn.on('click', _handleSave);
	$confirmedBtn.on('click', _handleConfirmed);
	$secondConfirm.on('click', _handleSecondConfirmed);

	async function _init() {
		try {
		    // 先檢查學生願不願意去僑先部
			const wantToFF_response = await student.getStudentGoToFForNot();
			if(!wantToFF_response.ok){
				throw wantToFF_response;
			}
			const wantToFF = await wantToFF_response.json();
			if(wantToFF.not_to_FF){  // 如果學生不願意去僑先部的話就多個提示框
				$notToFFInfo.removeClass('hide');
			}

			// 使用 jQuery 的 Tooltip
			$(document).tooltip({
				track: true,  // 提示框會隨著滑鼠游標移動
			});

			const response = await student.getPlacementSelectionOrder();
			if (!response[0].ok) { throw response[0]; }

			const resPlacement = await response[0].json();
			const resOrder = await response[1].json();

			const groupName = ["第一類組", "第二類組", "第三類組"]; // 用於類組 code 轉中文
			await resOrder.forEach((value, index) => { // 志願列表格式整理
				let add = {
					id: value.id, // 系所 id
					cardCode: value.card_code, // 畫卡號碼
					mainGroup: value.main_group_data.title, // 學群
					group: groupName[Number(value.group_code) - 1], // 類組
					school: value.school.title, // 校名
					dept: value.title, // 中文系名
					engDept: value.eng_title, // 英文系名
					specialDeptType: value.special_dept_type, // 特殊系所
					sortNum: index, // 根據初始資料流水號，用於排序清單、抓取資料					
					birth_limit_after: value.birth_limit_after,
					birth_limit_before: value.birth_limit_before,
					gender_limit: value.gender_limit
				};
				_optionalWish.push(add);
			})

			// 整理已選志願
			let order = [];
			await resPlacement.student_department_admission_placement_order.forEach((value, index) => {
				order.push(value.department_data.id);
			});
			await order.forEach((value, index) => {
				let orderIndex = _optionalWish.findIndex(order => order.id === value);
				if (orderIndex > -1) {
					_wishList.push(_optionalWish[orderIndex]);
					_optionalWish.splice(orderIndex, 1);
				}
			});

			$group1QuotaBtn.attr('href', `${env.quotaUrl}/?school=all&group=all&keyword=&first-group=true&second-group=false&third-group=false`);
			$group2QuotaBtn.attr('href', `${env.quotaUrl}/?school=all&group=all&keyword=&first-group=false&second-group=true&third-group=false`);
			$group3QuotaBtn.attr('href', `${env.quotaUrl}/?school=all&group=all&keyword=&first-group=false&second-group=false&third-group=true`);

			_generateOptionalWish();
			_generateWishList();
			loading.complete();
		} catch (e) {
			console.log(e);
			if (e.status && e.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			} else if (e.status && e.status === 403) {
				e.json && e.json().then((data) => {
					if(data.messages[0].includes('持DSE、ALE、CEE者')){
						alert(`${data.messages[0]}\n` + '即將返回志願檢視頁面');
						location.href = './result.html';
					}else if(window.history.length>1){
						alert(`ERROR: \n${data.messages[0]}\n` + '即將返回上一頁');
						window.history.back();
					} else if(data.messages[0].includes('採計')){
						alert(`ERROR: \n${data.messages[0]}\n` + '即將返回聯合分發成績採計方式頁面');
						location.href = './grade.html';
					} else {
						alert(`ERROR: \n${data.messages[0]}\n` + '即將返回志願檢視頁面');
						location.href = './result.html';
					}
				})
			} else {
				e.json && e.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
			}
			loading.complete();
		}
		//僑先部＆＆已填報＆＆後填志願時間期內，要顯示確認鎖定志願按鈕
		student.getStudentRegistrationProgress()
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((data) => {
				if (  // 僑先部個人申請未獲錄取算後填
					(data.student_qualification_verify.identity === 6 &&
					data.student_misc_data.confirmed_at != null &&
					data.can_admission_placement == true  &&
					data.student_misc_data.stage_of_deptid === null &&
					data.student_misc_data.join_admission_selection === 1) ||
					// 印輔班
					(data.student_qualification_verify.identity === 7 &&
					data.student_misc_data.confirmed_at != null &&
                    data.student_misc_data.confirmed_placement_at === null) ||
					// 香港 DSE
					(data.student_misc_data.admission_placement_apply_way_data.code == "23" &&
					data.student_misc_data.confirmed_at != null &&
                    data.student_misc_data.confirmed_placement_at === null) ) {
					$('#div-btn-confirmed').show();
					_checkconfirm(data);
				}
			})
	}

	function _addWish() { // 增加志願
		if (_wishList.length < 70) {
			const sortNum = $(this).data("sortnum");
			const optionalIndex = _optionalWish.findIndex(order => order.sortNum === sortNum)
			const pageNum = $paginationContainer.pagination('getSelectedPageNum');
			_wishList.push(_optionalWish[optionalIndex]);
			_optionalWish.splice(optionalIndex, 1);
			_generateOptionalWish(pageNum);
			_generateWishList();
		} else {
			alert('志願數量已達上限。');
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
		let html = '';
		const medicalList = ["醫學系", "牙醫學系", "中醫學系"];
		$.each(data, function(index, item){
			let medicalHTML = '';
			let badgeNUPS = '';
			if (item.specialDeptType !== null && medicalList.indexOf(item.specialDeptType) > -1) {
				medicalHTML = ' class="bg-medical"';
			}
			if (_nupsList.indexOf(item.id) > -1) {badgeNUPS = '<span class="badge badge-info">僑先部</span>';}
			html += `
			<tr${medicalHTML}>
			<td>
			${item.cardCode} ｜ ${item.group} ｜ ${item.mainGroup} ｜ ${item.school}<br>
			${item.dept} ${item.engDept}
			<br />
			${badgeNUPS}
			</td>
			<td class="text-right">
			<button type="button" data-sortNum="${item.sortNum}" class="btn btn-info btn-sm add-wish">
			<i class="fa fa-plus" aria-hidden="true"></i>
			</button>
			<br/>
			<br/>
			<button type="button" data-sortNum="${item.sortNum}" class="btn btn-secondary btn-sm docs-info" data-toggle="tooltip" title="點擊查看系所招生資訊">
			<i class="fa fa-list-ul" aria-hidden="true"></i>
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
			pageNumber: pageNum,
			callback: function(data, pagination) {
				var html = _optionalWishTemplating(data);
				$optionalWishList.html(html);
				const $addWish = $optionalWishList.find('.add-wish');
				$addWish.on("click", _addWish);
				const $docsInfo = $optionalWishList.find('.docs-info');
				$docsInfo.on("click",_showInfo);
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
		let hasNUPS = false;
		let invalidBadge = '';
		
		for(let i in _wishList) {
			let medicalHTML = '';
			let badgeNUPS = '';
			if (_wishList[i].specialDeptType !== null && medicalList.indexOf(_wishList[i].specialDeptType) > -1) {
				medicalHTML = ' class="bg-medical"';
			}
			if (_nupsList.indexOf(_wishList[i].id) > -1) {badgeNUPS = '<span class="badge badge-info" title="請將此志願置於最後">僑先部</span>';}
			rowHtml = rowHtml + `
			<tr${medicalHTML} data-wishIndex="${i}">
			<td>
			<button type="button" data-sortNum="${_wishList[i].sortNum}" class="btn btn-danger btn-sm remove-wish"><i class="fa fa-times" aria-hidden="true"></i></button>
			</td>
			<td>
			${_wishList[i].cardCode} ｜ ${_wishList[i].group} ｜ ${_wishList[i].mainGroup} | ${_wishList[i].school}<br>
			${_wishList[i].dept} ${_wishList[i].engDept}
			<br />
			${badgeNUPS} ${invalidBadge}
			</td>
			<td class="text-right td-wish-num">
			<div class="input-group">
			<input type="text" class="form-control wish-num" value="${(Number(i) + 1)}">
			<div class="input-group-btn">
			<button type="button" data-sortNum="${_wishList[i].sortNum}" class="btn btn-secondary btn-sm up-arrow">
			<i class="fa fa-chevron-up" aria-hidden="true"></i>
			</button>
			<button type="button" data-sortNum="${_wishList[i].sortNum}" class="btn btn-secondary btn-sm down-arrow">
			<i class="fa fa-chevron-down" aria-hidden="true"></i>
			</button>
			</div>
			</div>
			</td>
			</tr>
			`;
			if (hasNUPS === false && _nupsList.indexOf(_wishList[i].id) > -1) {
				invalidBadge =
					'<span class="badge badge-warning" title="志願序在僑生先修部之後的志願將不會被分發">無效志願</span>' +
					'&nbsp;<span class="badge badge-pill badge-danger" title="志願序在僑生先修部之後的志願將不會被分發！\n請將志願序調整至僑生先修部之前。" data-toggle="tooltip">?</span>';
			}
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

	function _handleConfirmed() {
		var order= _wishList.length;
		if(_wishList.length < 70 ) {
			var text= `提醒您 <br />
				您僅選擇 ${order}  個志願，尚未填滿 70 個志願。 <br/>
				依簡章規定，屆時如分發分數已達大學最低錄取標準，但所填志願已無名額可供分發，一律分發師大僑先部。填滿 70 個志願但未獲分發者，本會將提供二次分發機會。`;
			$("#warningModal").modal();
			document.getElementById("warningText").innerHTML = text;
		}
		else
			_handleSecondConfirmed();
	}

	function _handleSecondConfirmed() {
		setTimeout(function(){
			var isAllSet = confirm("確認後就「無法再次更改志願」，您真的確認送出嗎？");
			if (isAllSet === true) {
				let order = [];
				if (_wishList.length > 0) {
					_wishList.forEach((value, index) => {
						order.push(value.id);
					});
					const data = {
						order
					}
					loading.start();
					student.SecondPlacementSelectionOrder(data)
						.then((res) => {
							if (res.ok) {
								return res.json();
							} else {
								throw res;
							}
						})
						.then((json) => {
							alert("儲存成功並已鎖定，系統已寄送志願選填通知信至您的 email。");
							window.location.reload();
							loading.complete();
							location.href = "./downloadDocs.html";
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
		}, 500);
	}

	function _checkconfirm(data) {
		if (!!data.student_misc_data.confirmed_placement_at) {
			$('#btn-confirmed').removeClass('btn-danger').addClass('btn-success').prop('disabled', true).text('已鎖定志願') && $afterConfirmZone.show();
		}
	}
	
	function _showInfo(){
		const sortNum = $(this).data("sortnum");
		const optionalIndex = _optionalWish.findIndex(order => order.sortNum === sortNum);
		const title = _optionalWish[optionalIndex].school+_optionalWish[optionalIndex].dept;
		const departmentID = _optionalWish[optionalIndex].id;
		const schoolID = departmentID.substr(1,2);
		let quotaUrl = env.quotaUrl + '/bachelor-detail.html?id='+departmentID+'&school-id='+schoolID+'&tab=nav-deptInfo';
		let genderLimit = _optionalWish[optionalIndex].gender_limit;
		let beforeBirthLimit = _optionalWish[optionalIndex].birth_limit_before;
		let afterBirthLimit = _optionalWish[optionalIndex].birth_limit_after;
		let birthLimit;

		switch(genderLimit){
			case 'M':
				genderLimit = '只收男性'
				break;
			case 'F':
				genderLimit = '只收女性'
				break;
			default:
				genderLimit = '無'
		}

		if(beforeBirthLimit == null && afterBirthLimit == null){
			birthLimit = '無'
		} else if(beforeBirthLimit == null){
			birthLimit = '需在  ' +  afterBirthLimit +'  之後出生';
		} else if(afterBirthLimit == null){
			birthLimit = '需在  ' +  beforeBirthLimit +'  之前出生';
		} else{
			birthLimit = '需在  ' + afterBirthLimit +'  ~  '+beforeBirthLimit +'  之間出生';
		}

		$('#modal-title').text(title+"—"+'招生資訊');

		$('#btn-info').on('click' , function () {window.open(quotaUrl, '_blank');});

		let docsHtml =`
			<h5>系所年齡或性別要求</h5>
			<div>
				<tr class="table-warning">
					<td>性別要求：${genderLimit}</td>
				</tr>
			</div>
			<br/>
			<div>
				<tr class="table-warning">
					<td>年齡要求：${birthLimit}</td>
				</tr>
			</div>
		`;
		
		$('#modal-body').html(docsHtml);
		$('#docs-modal').modal('show');
	}

})();
