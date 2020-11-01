(() => {

	/**
	*	private variable
	*/

	let _currentSystem = 0;
	let _showCodeId = "";
	// 是否參加個人申請
	let _isJoin = true;

	let quotaNumber = 0; // 最高可選志願數量
	let _filterOptionalWish = []; // 篩選的資料（也是需顯示的資料）
	let _optionalWish = []; // 剩餘可選志願
	let _wishList = []; // 已選擇志願

	// 序號調整志願序之參數
	let _prevWishIndex = -1;
	let _currentWishIndex = -1;

	let studentApplyWayCode = null;  // 學生聯合分發採計方式 code
	let linktoquotapageUrl = null; // 連結至名額查詢系統系所備審資料 link

	/**
	*	cache DOM
	*/

	const $notJoinSelection = $('#notJoinSelection'); // 是否不參加個人申請 checkbox
	const $admissionSelectForm = $('#form-admissionSelect'); // 個人申請表單
	const $quotaNumber = $('.quota-number'); // 最高可選志願數量
	const $quotaLinkBtn = $('#btn-quotaLink');
	const $optionFilterSelect = $('#select-optionFilter'); // 「招生校系清單」篩選類別 selector
	const $optionFilterInput = $('#input-optionFilter'); // 關鍵字欄位
	const $manualSearchBtn = $('#btn-manualSearch'); // 手動搜尋按鈕
	const $optionalWishList = $('#optionalWish-list'); // 招生校系清單
	const $paginationContainer = $('#pagination-container'); // 分頁區域
	const $wishList = $('#wish-list'); // 已填選志願
	const wishList = document.getElementById('wish-list'); // 已填選志願，渲染用
	const $saveBtn = $('#btn-save');
	const $notJoinPlacement = $('#notJoinPlacement');  // 是否要流至聯合分發的 checkbox
	const $deptMoreInfoUrl = $('#btn-info'); // 系所備審資料 連結至名額查詢系統

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$notJoinSelection.on('change', _changeIsJoin); // 監聽是否不參加個人申請
	$optionFilterSelect.on('change', _generateOptionalWish); // 監聽「招生校系清單」類別選項
	$optionFilterInput.on('keyup', _generateOptionalWish); // // 監聽「招生校系清單」關鍵字
	$manualSearchBtn.on('click', _generateOptionalWish);
	$saveBtn.on('click', _handleSave);
	$notJoinPlacement.on('change', joinPlacementChange);  // 監聽是否不參加聯合分發
	$deptMoreInfoUrl.on('click' , _linktoQuotaPagefunction);

	async function _init() {
		try {
			const response = await student.getAdmissionSelectionOrder();
			if (!response[0].ok) { throw response[0]; }

			const resAdmission = await response[0].json();
			const resOrder = await response[1].json();

			_currentSystem = resAdmission.student_qualification_verify.system_id; // 當前學制
			// const groupName = ["第一類組", "第二類組", "第三類組"]; // 用於類組 code 轉中文
			resOrder.forEach((value, index) => { // 志願列表格式整理
				let add = {
					id: value.id, // 系所編號
					school: value.school.title, // 校名
					dept: value.title, // 中文系名
					engDept: value.eng_title, // 英文系名
					specialDeptType: value.special_dept_type, // 特殊系所
					sortNum: index, // 根據初始資料流水號，用於排序清單、抓取資料
					docs: value.application_docs,
					birth_limit_after: value.birth_limit_after,
					birth_limit_before: value.birth_limit_before,
					gender_limit: value.gender_limit,
					mainGroup: value.main_group_data.title // 學群名稱
				};
				if (_currentSystem === 1) {
					add.cardCode = value.card_code; // 畫卡號碼
				}
				_optionalWish.push(add);
			})

			// 不同學制可選志願數量不同
			if (_currentSystem === 2) {
				quotaNumber = 5;
			} else {
				quotaNumber = 4;
			}
			$quotaNumber.html(quotaNumber);

			$optionFilterSelect.append('<option value="mainGroup">學群</option>');
			if (_currentSystem === 1) { // 學士班志願顯示 cardCode，其餘 id
				_showCodeId = "cardCode";
			} else {
				_showCodeId = "id";
			}
			$('#option-code-id').val(_showCodeId);

			// 只有學士班可以選擇「本人 不參加 個人申請」
			if (+resAdmission.student_qualification_verify.system_id === 1) {
				_isJoin = (resAdmission.student_misc_data.join_admission_selection === null || +resAdmission.student_misc_data.join_admission_selection === 1);
				$notJoinSelection.prop("checked", !_isJoin);
			} else {
				$('.notJoinSelectionWrap').hide();
			}

			// 整理已選志願
			let order = [];
			let orderKey = "";
			if (_currentSystem === 1) {
				orderKey = "student_department_admission_selection_order";
			} else if (_currentSystem === 2) {
				orderKey = "student_two_year_tech_department_admission_selection_order";
			} else {
				orderKey = "student_graduate_department_admission_selection_order";
			}
			resAdmission[orderKey].forEach((value, index) => {
				order.push(value.department_data.id);
			});

			await order.forEach((value, index) => {
				let orderIndex = _optionalWish.findIndex(order => order.id === value)
				_wishList.push(_optionalWish[orderIndex]);
				_optionalWish.splice(orderIndex, 1);
			});

			// 取得學生是否不參加聯合分發
			if(_currentSystem === 1){  // 學士班才有聯合分發
				const resApplyWay = await student.getStudentAdmissionPlacementApplyWay();
				if (!resApplyWay.ok) {
					throw resApplyWay;
				}
				const applyWayJson = await resApplyWay.json();
				studentApplyWayCode = applyWayJson.student_misc_data.admission_placement_apply_way_data ? applyWayJson.student_misc_data.admission_placement_apply_way_data.code : null;
				if(studentApplyWayCode == 99999){  // 不參加聯合分發
					$notJoinPlacement.prop('checked', false);
				}
			} else {  // 沒有聯合分發管道的學制就隱藏要不要流去聯合分發的選項
				$('#joinPlacementForm').addClass('hide');
			}


			// 根據使用者的學制連過去的名額查詢系統自動帶去該學制
			switch (_currentSystem) {
				case 1:  // 學士班
					$quotaLinkBtn.attr('href', env.quotaUrl);
					break;
				case 2:  // 港二技
					$quotaLinkBtn.attr('href', env.quotaUrl+"/two-year.html");
					break;
				case 3:  // 碩士班
					$quotaLinkBtn.attr('href', env.quotaUrl+"/master.html");
					break;
				case 4:  // 博士班
					$quotaLinkBtn.attr('href', env.quotaUrl+"/phd.html");
					break;
				default:
					$quotaLinkBtn.attr('href', env.quotaUrl);
					break;
			}

			_generateOptionalWish();
			_generateWishList();
			_showWishList();
			loading.complete();
		} catch (e) {
			if (e.status && e.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			} else if (e.status && e.status === 403) {
				// 是否有完成資格驗證在 navbar.js 已經有判斷。
				e.json && e.json().then((data) => {
					alert(`ERROR: \n${data.messages[0]}\n` + '即將返回上一頁');
					window.history.back();
				})
			} else {
				e.json && e.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
			}
			loading.complete();
		}
	}

	function _changeIsJoin() {
		_isJoin = !$(this).prop("checked");
		_showWishList();
	}

	function _showWishList() { // 不參加申請，即不顯示志願表單
		if (_isJoin) {
			$admissionSelectForm.fadeIn();
		} else {
			$admissionSelectForm.hide();
		}
	}

	function _addWish() { // 增加志願
		// 檢查所選志願是否超過上限
		if (_wishList.length < quotaNumber) {
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
			let groupHTML = '';
			if (item.specialDeptType !== null && medicalList.indexOf(item.specialDeptType) > -1) {
				medicalHTML = ' class="bg-medical"';
			}
			groupHTML += '｜ ' + item.mainGroup;

			html += `
			<tr${medicalHTML}>
			<td>
			${item[_showCodeId]} ${groupHTML} ｜ ${item.school}<br>
			${item.dept} ${item.engDept}
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
		const filterSelect = $optionFilterSelect.val();
		const filter = $optionFilterInput.val().toUpperCase();
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
				const $docsInfo = $optionalWishList.find('.docs-info');
				$docsInfo.on("click",_showInfo);
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
		const medicalList = ["醫學系", "牙醫學系", "中醫學系"];
		for(let i in _wishList) {
			let medicalHTML = '';
			let groupHTML = '';
			if (_wishList[i].specialDeptType !== null && medicalList.indexOf(_wishList[i].specialDeptType) > -1) {
				medicalHTML = ' class="bg-medical"';
			}
			groupHTML += '｜ ' + _wishList[i].mainGroup;

			rowHtml = rowHtml + `
			<tr${medicalHTML} data-wishIndex="${i}">
			<td>
			<button type="button" data-sortNum="${_wishList[i].sortNum}" class="btn btn-danger btn-sm remove-wish"><i class="fa fa-times" aria-hidden="true"></i></button>
			</td>
			<td>
			${_wishList[i][_showCodeId]} ${groupHTML} ｜ ${_wishList[i].school}<br>
			${_wishList[i].dept} ${_wishList[i].engDept}
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
		// console.log(_isJoin);
		if (_isJoin === true) {
			let order = [];
			if (_wishList.length > 0) {
				_wishList.forEach((value, index) => {
					order.push(value.id);
				});
				const data = {
					join_admission_selection: _isJoin,
					order
				}
				loading.start();
				// 先設定是否參加聯合分發
				if(!$notJoinPlacement.prop('checked')) {  // 如果勾選不要的話
					let data = {
						apply_way: 1
					};
					student.setStudentAdmissionPlacementApplyWay(data).then((res) => {
						if (res.ok) {
							return res.json();
						} else {
							throw res;
						}
					}).then((json) => {
						// console.log(json);
					}).catch((err) => {
						if (err.status && err.status === 401) {
							alert('請登入。');
							location.href = "./index.html";
						}
						err.json && err.json().then((data) => {
							console.error(data.messages[0]);
							alert(data.messages[0]);
						});
						loading.complete();
					});
				} else {  // 有勾選（預設情況）
					// 如果學生已經選好採計方式就不處理（清成 null）=> 如果是不參加聯合分發卻又反悔勾選要才處理
					if(studentApplyWayCode == 99999){
						let data = {
							apply_way: null
						};
						student.setStudentAdmissionPlacementApplyWay(data).then((res) => {
							if (res.ok) {
								return res.json();
							} else {
								throw res;
							}
						}).then((json) => {
							// console.log(json);
						}).catch((err) => {
							if (err.status && err.status === 401) {
								alert('請登入。');
								location.href = "./index.html";
							}
							err.json && err.json().then((data) => {
								console.error(data.messages[0]);
								alert(data.messages[0]);
							});
							loading.complete();
						});
					}
				}

				student.setAdmissionSelectionOrder(data)
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
		} else {
			const data = {
				join_admission_selection: _isJoin,
				order: []
			}
			loading.start();
			student.setAdmissionSelectionOrder(data)
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
		}
	}

	// 是否要流至聯合分發的 checkbox 改變
	function joinPlacementChange() {
		if(!$notJoinPlacement.prop('checked')){  // 沒勾選
			if(confirm("未勾選者，將視同放棄「聯合分發」管道，且無法選填「聯合分發」志願。\n如欲參加聯合分發請按「確定」鍵！")){  // 確定
				$notJoinPlacement.prop('checked', true);  // 幫學生勾回去
			} else {  // 取消
				return;
			}
		}
	}

	// 顯示系所審查項目
	function _showInfo(){
		const sortNum = $(this).data("sortnum");
		const optionalIndex = _optionalWish.findIndex(order => order.sortNum === sortNum);
		let docsList = _optionalWish[optionalIndex].docs;
		const title = _optionalWish[optionalIndex].school+_optionalWish[optionalIndex].dept;
		const departmentID = docsList[0].dept_id;
		const schoolID = departmentID.substr(1,2);
		let quotaUrl = env.quotaUrl;
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

		switch (_currentSystem) {
			case 1:  // 學士班
				quotaUrl += '/bachelor-detail.html?id='+departmentID+'&school-id='+schoolID+'&tab=nav-shenchaItem';
				break;
			case 2:  // 港二技
				quotaUrl += '/two-year-detail.html?id='+departmentID+'&school-id='+schoolID+'&tab=nav-shenchaItem';
				break;
			case 3:  // 碩士班
				quotaUrl += '/master-detail.html?id='+departmentID+'&school-id='+schoolID+'&tab=nav-shenchaItem';
				break;
			case 4:  // 博士班
				quotaUrl += '/phd-detail.html?id='+departmentID+'&school-id='+schoolID+'&tab=nav-shenchaItem';
				break;
		}

		linktoquotapageUrl = quotaUrl;

		let docsHtml = '<h5>個人申請審查項目</h5>';	

		docsList = docsList.sort(function(a,b){return b.required - a.required;});

		docsList.forEach((value, index) => { // 審查項目整理
			let requiredBadge = (value.required) ? '<span class="badge badge-danger">必繳</span>' : '<span class="badge badge-warning">選繳</span>';
			docsHtml+=`
				<div>
					<tr class="table-warning">
						<td>${index + 1}. </td>
						<td>${requiredBadge}</td>
						<td>${value.type.name}<br />${value.type.eng_name}</td>
					</tr>
				</div>
				<br/>
			`;
		})

		docsHtml+=`
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

	// 連結至名額查詢系統 系所備審資料
	function _linktoQuotaPagefunction() {
		window.open(linktoquotapageUrl, '_blank');
	}
})();
