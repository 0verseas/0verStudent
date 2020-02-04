(() => {

	/**
	*	private variable
	*/

	let _system = 1;
	let _studentID;
	let _isDocumentLock = true; // 備審資料是否已提交
	let _wishList = [];
	let _orderIndex;
	let _schoolID;
	let _deptID;
	let _hasWorks = false; // 項目中是否有作品集，有的話要儲存作品集文字
	let _worksRequired = false;
	let _workTypeId; // 作品集的項目編號
	let _workUrls = [];

	/**
	*	cache DOM
	*/

	const $wishListWrap = $('#wrap-wishList');
	const $wishList = $('#wishList');
	const $uploadForm = $('#form-upload'); // 點下「上傳」按鈕後出現的表單
	const $deptId = $('#deptId'); // 顯示，志願代碼
	const $schoolName = $('#schoolName'); // 顯示，學校名稱
	const $deptName = $('#deptName'); // 顯示，系所名稱
	const $reviewItemsArea = $('#reviewItemsArea'); // 各備審項目
	const $downloadBtn = $('#btn-download'); // modal 下載按鈕
	const $imgModalBody= $('#img-modal-body'); // modal 本體
	const $saveBtn = $('#btn-save');
	const $exitBtn = $('#btn-exit');

	const wishList = document.getElementById('wishList');
	const reviewItemsArea = document.getElementById('reviewItemsArea');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$wishListWrap.on('click.edit', '.btn-wishEdit', _handleEditForm);
	$saveBtn.on('click', _handleSave);
	$exitBtn.on('click', _handleExit);
	$('body').on('change.upload', '.file-certificate', _handleUpload);
	$('body').on('click.showOriImg', '.img-thumbnail', _showOriImg);
	$('.btn-delImg').on('click', _handleDelImg);

	async function _init() {

		try {
			const response = await student.getAdmissionSelectionWishOrder();
			if (!response.ok) { throw response; }
			const orderJson = await response.json();

			_studentID = orderJson.id;
			_system = orderJson.student_qualification_verify.system_id;
			_isDocumentLock = !!orderJson.student_misc_data.admission_selection_document_lock_at;
			let key = '';
			let admission_doc_upload_time_limit = '西元 2020 年 1 月 6 日（星期一）臺灣時間下午 5 時前';  // 備審資料上傳截止時間（學士班、研究所）
			switch (_system) {
				case 1:
					key = 'student_department_admission_selection_order';
					break;
				case 2:
					key = 'student_two_year_tech_department_admission_selection_order';
					admission_doc_upload_time_limit = '西元 2020 年 3 月 23 日（星期六）臺灣時間下午 5 時前';  // 備審資料上傳截止時間（港二技）
					break;
				case 3:
				case 4:
					key = 'student_graduate_department_admission_selection_order';
					break;
			}
			_wishList = orderJson[key];
			document.getElementById("admission-doc-time-limit").innerText=admission_doc_upload_time_limit;

			_renderWishList();
			loading.complete();
		} catch(e) {
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

	function _renderWishList() {
		let wishHTML = '';
		_wishList.forEach((value, index) => {
			let showId = (_system === 1) ? value.department_data.card_code : value.department_data.id;
			wishHTML += `
				<tr class="table-warning">
					<td>${index + 1}</td>
					<td>${showId}</td>
					<td>${value.department_data.school.title}<br />${value.department_data.title}</td>
					<td class="text-right">
						<button type="button" class="btn btn-info btn-wishEdit" data-deptid="${value.dept_id}">
							<i class="fa fa-upload" aria-hidden="true"></i>
							<span class="hidden-sm-down"> 上傳</span>
						</button>
					</td>
				</tr>
			`;

			if (_isDocumentLock) {
				wishHTML += `
					<tr>
						<td colspan="4">
							<h6>繳交狀況：</h6>
							<blockquote class="blockquote">
							`;
				value.uploaded_file_list.forEach((doc, docIndex) => {
					const requiredBadge = (doc.required) ? '<span class="badge badge-danger">必繳</span>' : '<span class="badge badge-warning">選繳</span>';
					let filesNum = '';

					if (doc.type.name === "作品集") { // 作品集檔案
						filesNum = (doc.work_files.length + doc.work_urls.length + ' 份檔案');
					} else if (doc.paper === null) { // 非紙本資料
						filesNum = (doc.files.length + ' 份檔案');
					} else { // 紙本資料
						filesNum = '請於期限內寄紙本資料至指定收件處';
					}

					wishHTML += `
						${requiredBadge} ${doc.type.name}：${filesNum}<br />
					`
				});

				wishHTML += `
							</blockquote>
						</td>
					</tr>
					`
			}
		});
		$wishList.html(wishHTML);
	}

	function _handleEditForm() {
		loading.start();
		_hasWorks = false;
		const deptId = _deptID = $(this).data('deptid') || _deptID;
		_orderIndex = _wishList.findIndex(i => i.dept_id === (deptId + ""));

		if (_system === 1) {
			$deptId.text(_wishList[_orderIndex].department_data.card_code);
		} else {
			$deptId.text(_wishList[_orderIndex].department_data.id);
		}
		$schoolName.text(_wishList[_orderIndex].department_data.school.title);
		$deptName.text(_wishList[_orderIndex].department_data.title);

		let reviewItemHTML = '';
		let requiredBadge = '';

		// 如果有填寫審查費用就顯示
		if(_wishList[_orderIndex].department_data.has_review_fee){
			reviewItemHTML += `
				<div class="row">
					<div class="col-12">
						<div class="card">
							<div class="card-header bg-secondary text-white">
								審查費用 (Review fee)
							</div>
							<div class="card-body">
<!--								<blockquote class="blockquote">-->
									${_wishList[_orderIndex].department_data.review_fee_detail} <br /><br />
									${_wishList[_orderIndex].department_data.eng_review_fee_detail}
<!--								</blockquote>-->
							</div>
						</div>
					</div>
				</div>
				<hr>
			`;
		}

		_wishList[_orderIndex].uploaded_file_list.forEach((fileListItem, index) => {
			requiredBadge = (fileListItem.required === true) ? '<span class="badge badge-danger">必繳</span>' : '<span class="badge badge-warning">選繳</span>';

			let descriptionBlock;

			if (!!!fileListItem.description.trim() && !!!fileListItem.eng_description.trim()) {
                descriptionBlock = ``;
			} else {
                descriptionBlock = `<blockquote class="blockquote">${fileListItem.description}<br />${fileListItem.eng_description}</blockquote>`;
			}

			if (fileListItem.type.name === "作品集") {
				_hasWorks = true;
				_worksRequired  = fileListItem.required;
				_workTypeId = fileListItem.type_id;
				_workUrls = (fileListItem.work_urls !== "") ? fileListItem.work_urls : [];

				let worksHTML = _getFileAreaHTML(fileListItem, "work_files");

				reviewItemHTML += `
					<div class="row">
						<div class="col-12">
							<div class="card">
								<div class="card-header bg-primary text-white">
									${fileListItem.type.name} (${fileListItem.type.eng_name}) ${requiredBadge}
								</div>
								<div class="card-body">` + descriptionBlock + `
									<h4 style="margin-bottom: 15px;">作品集檔案</h4>
									<div class="alert alert-warning">
										可接受副檔名為 <strong class="text-danger">pdf、jpg、png、mp3、mp4、avi</strong> 的檔案，單一個檔案大小需 <strong class="text-danger">小於 8 Mbytes</strong> 。
									</div>
									<div class="row" style="margin-bottom: 15px;">
										<div class="col-12">
											<input type="file" class="filestyle file-certificate" data-workstype="works" data-type="${fileListItem.type_id}" data-deptid="${fileListItem.dept_id}" multiple>
										</div>
									</div>
									<div class="card">
										<div class="card-body">
											<h4 class="card-title"><span>已上傳作品檔案</span> <small class="text-muted">(點圖可放大或刪除)</small></h4>
											${worksHTML}
										</div>
									</div>
									<hr />
									<!--作品集文字-->
									<h4 style="margin-bottom: 15px;">作品集資訊</h4>
									<div>
										<div class="form-group">
											<label class="text-danger" for="workName">* 作品名稱</label>
											<input type="text" class="form-control" id="workName" value="${fileListItem.name.replace(/"/g, '&quot;')}">
										</div>
										<div class="form-group">
											<label class="text-danger" for="workPosition">* 個人參與的職位或項目</label>
											<input type="text" class="form-control" id="workPosition" value="${fileListItem.position.replace(/"/g, '&quot;')}">
										</div>
										<div class="form-group">
											<label class="text-danger" for="workType">* 術科類型</label>
											<input type="text" class="form-control" id="workType" value="${fileListItem.work_type.replace(/"/g, '&quot;')}">
										</div>
										<div class="form-group">
											<label for="workMemo">備註</label>
											<textarea class="form-control" id="workMemo" rows="3">${fileListItem.memo}</textarea>
										</div>
										<div class="form-group">
											<label class="text-danger" for="workUrl">* 作品連結</label>
											<div class="input-group">
												<input type="text" class="form-control" id="workUrl">
												<span class="input-group-btn">
													<button class="btn btn-primary" type="button" id="btn-addWorkUrl">
														<i class="fa fa-plus" aria-hidden="true"></i>
													</button>
												</span>
											</div>
										</div>
										<div>已填寫連結：</div>
										<ul id="workUrls"></ul>
										<br />
										<div class="form-group">
											<button type="button" id="btn-save-works" class="btn btn-outline-warning btn-block"><i class="fa fa-floppy-o" aria-hidden="true"></i>&nbsp;&nbsp;儲存已輸入的作品集文字&nbsp;&nbsp;<i class="fa fa-floppy-o" aria-hidden="true"></i></button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<hr>
				`
			} else if (!!fileListItem.paper) {
				console.log('paper');
				reviewItemHTML += `
					<div class="row">
						<div class="col-12">
							<div class="card">
								<div class="card-header bg-primary text-white">
									${fileListItem.type.name} (${fileListItem.type.eng_name}) ${requiredBadge}
								</div>
								<div class="card-block">` + descriptionBlock + `
									<div class="card">
										<div class="card-body">
											<p>只接受紙本，請於 <span class="text-danger">${fileListItem.paper.deadline}</span> 前逕行寄送到下列地址</p>
											<dl class="row">
												<dt class="col-md-3 col-lg-2">收件人：</dt>
												<dd class="col-md-9 col-lg-10">${fileListItem.paper.recipient}</dd>
												<dt class="col-md-3 col-lg-2">地址：</dt>
												<dd class="col-md-9 col-lg-10">${fileListItem.paper.address}</dd>
												<dt class="col-md-3 col-lg-2">聯絡電話：</dt>
												<dd class="col-md-9 col-lg-10">${fileListItem.paper.phone}</dd>
												<dt class="col-md-3 col-lg-2">E-mail：</dt>
												<dd class="col-md-9 col-lg-10">${fileListItem.paper.email}</dd>
											</dl>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<hr>
				`
			} else if(fileListItem.type.name === "師長推薦函"){
				let filesHtml = _getFileAreaHTML(fileListItem, "files");
				let invite_list='';  // 邀請清單
				// 如果有邀請紀錄
				if(fileListItem.invites.length > 0){
					invite_list = getTeacherRecommendationLetterInviteRecord(fileListItem);
				}
				reviewItemHTML += `
					<div class="row">
						<div class="col-12">
							<div class="card">
								<div class="card-header bg-primary text-white">
									${fileListItem.type.name} (${fileListItem.type.eng_name}) ${requiredBadge}
								</div>
								<div class="card-body">
									<div class="alert alert-primary">
										師長推薦函可依「自行上傳」或「邀請師長上傳」二擇一或併行。
									</div>` + descriptionBlock + `
									<div class="alert alert-warning">
										可接受副檔名為 <strong class="text-danger">pdf、jpg、png</strong> 的檔案，單一個檔案大小需 <strong class="text-danger">小於 4 Mbytes</strong> 。
									</div>
									<div class="row" style="margin-bottom: 15px;">
										<div class="col-12">
											<input type="file" class="filestyle file-certificate" data-type="${fileListItem.type_id}" data-deptid="${fileListItem.dept_id}" multiple>
										</div>
									</div>
									<!-- 師長推薦函邀請 -->
									<div class="row col-11">
										<div class="col-md-12">
											<label>或輸入師長資料以寄送電子郵件邀請師長上傳推薦函：</label><br />
										</div>
										<div class="col-md-12 form-group">
											<input type="checkbox" id="agree_teacher_recommendation_pact">本人<b>同意系統提供</b>姓名、電子信箱地址、手機號碼、就讀學校名稱<b>等訊息至邀請函中</b>（<strong class="text-danger">如不同意將無法送出邀請</strong>）。
										</div>
										<div class="col-md-5 form-group">
											<input type="text" id="teacherName" class="form-control" title="請輸入師長姓名（不需頭銜或職稱）" placeholder="師長姓名">
										</div>
										<div class="col-md-7 form-group">
											<input type="email" id="teacherMail" class="form-control" title="請輸入師長的電子信箱地址" placeholder="師長email">
										</div>
									</div>
									<div class="row col-12">
										<div class="col-md-9 form-group">
											<input type="text" id="studentMessage" class="form-control" title="可以輸入讓師長足以辨識您身份或志願科系需求等的訊息" placeholder="給師長的訊息（請同學務必與推薦人先行聯絡，並預留時間供師長上傳）">
										</div>
										<div class="col-md-3 form-group">
											<button type="button" id="btn-invite" class="btn btn-info" style="visibility: hidden" title="師長上傳成功後會有電子郵件通知"><i class="fa fa-envelope"></i> 送出邀請</button>
										</div>
									</div>
									${invite_list}  <!--邀請紀錄-->

									<div class="card">
										<div class="card-body">
											<h4 class="card-title"><span>已上傳檔案</span> <small class="text-muted">(點圖可放大或刪除)</small></h4>
											${filesHtml}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<hr>
				`
			} else {
				let filesHtml = _getFileAreaHTML(fileListItem, "files");
				reviewItemHTML += `
					<div class="row">
						<div class="col-12">
							<div class="card">
								<div class="card-header bg-primary text-white">
									${fileListItem.type.name} (${fileListItem.type.eng_name}) ${requiredBadge}
								</div>
								<div class="card-body">` + descriptionBlock + `
									<div class="alert alert-warning">
										可接受副檔名為 <strong class="text-danger">pdf、jpg、png</strong> 的檔案，單一個檔案大小需 <strong class="text-danger">小於 4 Mbytes</strong> 。
									</div>
									<div class="row" style="margin-bottom: 15px;">
										<div class="col-12">
											<input type="file" class="filestyle file-certificate" data-type="${fileListItem.type_id}" data-deptid="${fileListItem.dept_id}" multiple>
										</div>
									</div>

									<div class="card">
										<div class="card-body">
											<h4 class="card-title"><span>已上傳檔案</span> <small class="text-muted">(點圖可放大或刪除)</small></h4>
											${filesHtml}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<hr>
				`
			}
		});

		$reviewItemsArea.html(reviewItemHTML);

		if (_hasWorks) {
			_renderWorkUrlList();
			$('#btn-addWorkUrl').on('click', _handleAddWorkUrl);
			$('#workUrl').keyup((e) => { e.keyCode == 13 && _handleAddWorkUrl(); });
		}

		$(":file").filestyle({
			htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
			btnClass: "btn-success",
			text: " 選擇檔案",
			input: false
		});
		$wishListWrap.hide();
		$uploadForm.fadeIn();

		$('#btn-invite').on('click',_handleInviteTeacher); //按下「送出邀請」按鈕
		$("#agree_teacher_recommendation_pact").on('change', teacherRecommendationPactChange);  // 是否同意師長推薦函邀請使用條件的核取方塊

		$('#btn-save-works').on('click',_handleSaveWorks);  // 「儲存已輸入的作品集文字」按鈕

		loading.complete();
	}

	function _getFileAreaHTML(fileListItem, fileListKey) {
		let html = '';
		fileListItem[fileListKey].forEach((fileName, index) => {
			const fileType = _getFileType(fileName.split('.')[1]);
			if (fileType === 'img') {
				html += `<img
					class="img-thumbnail"
					src="${env.baseUrl}/students/${_studentID}/admission-selection-application-document/departments/${fileListItem.dept_id}/types/${fileListItem.type_id}/files/${fileName}"
					data-toggle="modal"
					data-target=".img-modal"
					data-type="${fileListItem.type_id}"
					data-filelink="${env.baseUrl}/students/${_studentID}/admission-selection-application-document/departments/${fileListItem.dept_id}/types/${fileListItem.type_id}/files/${fileName}"
					data-filename="${fileName}"
					data-filetype="img"
				/> `;
			} else {
				html += `
					<div
						class="img-thumbnail non-img-file-thumbnail"
						data-toggle="modal"
						data-target=".img-modal"
						data-type="${fileListItem.type_id}"
						data-filelink="${env.baseUrl}/students/${_studentID}/admission-selection-application-document/departments/${fileListItem.dept_id}/types/${fileListItem.type_id}/files/${fileName}"
						data-filename="${fileName}"
						data-filetype="${fileType}"
						data-icon="fa-file-${fileType}-o"
					>
						<i class="fa fa-file-${fileType}-o" aria-hidden="true"></i>
					</div>
				`;
			}
		})
		return html;
	}

	function _handleAddWorkUrl() {
		let workUrl = $('#workUrl').val();
		var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
		var regex = new RegExp(expression);
		if (workUrl.match(regex)) {
			_workUrls.push(workUrl);
			$('#workUrl').val('');
		} else {
			alert("網址格式錯誤。");
		}
		_renderWorkUrlList();
	}

	function _handleRemoveUrl() {
		const workIndex = +$(this).data('workindex');
		_workUrls.splice(workIndex, 1);
		_renderWorkUrlList();
	}

	function _renderWorkUrlList() {
		let workUrlHTML = '';
		_workUrls.forEach((val, index) => {
			workUrlHTML += `
				<li>
					${val}
					<button class="btn btn-danger btn-sm btn-removeWorkUrl" data-workindex="${index}" type="button">
						<i class="fa fa-times" aria-hidden="true"></i>
					</button>
				</li>
			`
		});
		$('#workUrls').html(workUrlHTML);
		$('.btn-removeWorkUrl').on('click', _handleRemoveUrl);
	}

	async function _handleSave() {  // 這邊邏輯有改變記得 _handleSaveWorks() 的內容也要一起改
		// 儲存按鈕在有作品集的狀況下才會作動，否則直接 pass
		if (_hasWorks) {
			const workTypeIndex = _wishList[_orderIndex].uploaded_file_list.findIndex(i => i.type_id === (+_workTypeId));
			// sendType: 判斷是否需要送資料、送的方式。
			// complete: 完整資料, empty: 傳送空資料（選繳清空資料用）。
			let sendType = '';
			if (_worksRequired) {
				// 必填的話，要填，要檢驗
				sendType = 'complete';
			} else {
				// 選填的話，檢查作品集欄位如果有填任何資料，要進行檢驗，否則傳送空值清資料
				let isEmpty = true; // 資料是不是空的
				if ($('#workName').val() !== "") { isEmpty = false; }
				if ($('#workPosition').val() !== "") { isEmpty = false; }
				if ($('#workType').val() !== "") { isEmpty = false; }
				if ($('#workMemo').val() !== "") { isEmpty = false; }
				if (_workUrls.length > 0) { isEmpty = false; }
				//if (_wishList[_orderIndex].uploaded_file_list[workTypeIndex].authorization_files.length > 0) { isEmpty = false; }
				if (_wishList[_orderIndex].uploaded_file_list[workTypeIndex].work_files.length > 0) { isEmpty = false; }

				if (isEmpty) {
					sendType = 'empty';
				} else {
					sendType = 'complete';
				}
			}

			if (sendType === 'complete') {
				let correct = true;
				let errorMsg = [];
				if ($('#workName').val() === "") {
					correct = false;
					$('#workName').addClass('invalidInput');
					errorMsg.push('作品名稱');
				} else {
					$('#workName').removeClass('invalidInput');
				}
				if ($('#workPosition').val() === "") {
					correct = false;
					$('#workPosition').addClass('invalidInput');
					errorMsg.push('個人參與的職位或項目');
				} else {
					$('#workPosition').removeClass('invalidInput');
				}
				if ($('#workType').val() === "") {
					correct = false;
					$('#workType').addClass('invalidInput');
					errorMsg.push('術科類型');
				} else {
					$('#workType').removeClass('invalidInput');
				}

				// 作品連結、檔案擇一上傳。沒檔案，才強制上傳 url
				if (_wishList[_orderIndex].uploaded_file_list[workTypeIndex].work_files.length === 0 && _workUrls.length === 0) {
					correct = false;
					$('#workUrl').addClass('invalidInput');
					errorMsg.push('作品連結');
				} else {
					$('#workUrl').removeClass('invalidInput');
				}

				// 怕是同學填了作品連結，但是沒有按 “＋” 來新增
				if ( $('#workUrl').val() != '') {
					correct = false;
					$('#workUrl').addClass('invalidInput');
				} else {
					$('#workUrl').removeClass('invalidInput');
				}

				if (correct) {
					let data = new FormData();
					data.append('name', $('#workName').val());
					data.append('position', $('#workPosition').val());
					data.append('work_type', $('#workType').val());
					data.append('memo', $('#workMemo').val());

					if (_workUrls.length === 0) {
						data.append('urls', '');
					} else {
						_workUrls.forEach((val, index) => {
							data.append('urls[]', val);
						})
					}

					try {
						loading.start();
						const response = await student.setReviewItem({data, type_id: _workTypeId, dept_id: _deptID, student_id: _studentID});
						if (!response.ok) { throw response; }

						alert('儲存完成');
						loading.complete();
						window.location.reload();
					} catch(e) {
						e.json && e.json().then((data) => {
							console.error(data);
							alert(`ERROR: \n${data.messages[0]}`);
						});
						loading.complete();
					}
				} else {
					if ( $('#workUrl').val() != '') {
						alert("請點選作品連結右邊藍色“＋” 新增作品連結");
					}
					else
						alert(errorMsg.join('、') + " 欄位必填");
				}
			} else if (sendType === 'empty') {
				let data = new FormData();
				data.append('name', '');
				data.append('position', '');
				data.append('work_type', '');
				data.append('memo', '');
				data.append('urls', '');

				try {
					loading.start();
					const response = await student.setReviewItem({data, type_id: _workTypeId, dept_id: _deptID, student_id: _studentID});
					if (!response.ok) { throw response; }

					alert('儲存完成');
					loading.complete();
					window.location.reload();
				} catch(e) {
					e.json && e.json().then((data) => {
						console.error(data);
						alert(`ERROR: \n${data.messages[0]}`);
					});
					loading.complete();
				}
			}
		} else {
			alert('儲存完成');
			loading.complete();
			window.location.reload();
		}
	}
	
	function _handleExit() {
		window.location.reload();
	}

	async function _handleUpload() {
		const type_id = $(this).data('type');
		const dept_id = $(this).data('deptid');
		const workType = ($(this).attr('data-workstype')) ? $(this).data('workstype') : false;

		const fileList = this.files;
		let data = new FormData();
		for (let i = 0; i < fileList.length; i++) {
			data.append('files[]', fileList[i]);
		}
		if (!!workType) {
			data.append('file_type', workType);
		}

		try {
			loading.start();
			const response = await student.setReviewItem({data, type_id, dept_id, student_id: _studentID});
			if (!response.ok) { throw response; }
			const responseJson = await response.json();

			const uploadFileItemIndex = _wishList[_orderIndex].uploaded_file_list.findIndex(i => i.type_id === (+responseJson.type_id ));
			if (!!workType && workType === "works") {
				_wishList[_orderIndex].uploaded_file_list[uploadFileItemIndex].work_files = responseJson.work_files;
			} else {
				_wishList[_orderIndex].uploaded_file_list[uploadFileItemIndex].files = _wishList[_orderIndex].uploaded_file_list[uploadFileItemIndex].files.concat(responseJson.files);
			}
			_handleEditForm();
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
			loading.complete();
		}
	}

	// 顯示檔案 modal
	function _showOriImg() {
		const type = this.dataset.type;
		const fileName = this.dataset.filename;
		const fileType = this.dataset.filetype;

		// 清空 modal 內容
		$imgModalBody.html('');

		// 是圖放圖，非圖放 icon
		if (fileType === 'img') {
			const src = this.src;

			$imgModalBody.html(`
				<img
					src="${src}"
					class="img-fluid rounded img-ori"
				>
			`);
		} else {
			const icon = this.dataset.icon;
			const fileLink = this.dataset.filelink;

			$imgModalBody.html(`
				<div>
					<i class="fa ${icon} non-img-file-ori" aria-hidden="true"></i>
				</div>

				<a class="btn btn-primary non-img-file-download" href="${fileLink}" target="_blank" >
					<i class="fa fa-download" aria-hidden="true"></i> 下載
				</a>
			`);
		}
		const fileListIndex = _wishList[_orderIndex].uploaded_file_list.findIndex(i => i.type_id === parseInt(type));
		const isWork = (_wishList[_orderIndex].uploaded_file_list[fileListIndex].type.name === "作品集"); // 是不是作品集

		$('.btn-delImg').attr({
			'data-type': type,
			'data-filename': fileName,
			'data-iswork': isWork
		});
	}

	async function _handleDelImg() {
		if (!confirm('確定刪除？')) {
			return;
		}
		console.log("back to end",_studentID,_deptID,$(this).attr('data-type'),$(this).attr('data-filename'));
		try {
			loading.start();
			const response = await student.delReviewItem({
				student_id: _studentID,
				dept_id: _deptID,
				type_id: $(this).attr('data-type'),
				filename: $(this).attr('data-filename')
			});
			if (!response.ok) { throw response; }
			const responseJson = await response.json();

			const uploadFileItemIndex = _wishList[_orderIndex].uploaded_file_list.findIndex(i => i.type_id === (+responseJson[0].type_id ));
			if ($(this).attr('data-iswork') === "true") {
				_wishList[_orderIndex].uploaded_file_list[uploadFileItemIndex].work_files = responseJson[0].work_files;
			} else {
				_wishList[_orderIndex].uploaded_file_list[uploadFileItemIndex].files = responseJson[0].files;
			}
			_handleEditForm();
			$('.img-modal').modal('hide');
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
			loading.complete();
		}
	}

	// 副檔名與檔案型態對應（回傳值須符合 font-awesome 規範）
	function _getFileType(fileNameExtension = '') {
		switch (fileNameExtension) {
			case 'doc':
			case 'docx':
				return 'word';

			case 'mp3':
				return 'audio';

			case 'mp4':
			case 'avi':
				return 'video';

			case 'pdf':
				return 'pdf';

			default:
				return 'img';
		}
	}

	//傳送師長資料以便寄送邀請信件
	async function _handleInviteTeacher() {
		// 後端會檢查欄位內容因此原訂這邊要做檢查的部份就刪掉了
		loading.start();
		try{
			// 取得學生輸入的資訊
			let tname = $('#teacherName').val(); // teacher's name
			let tmail = $('#teacherMail').val(); // teacher's email
			let stu_message = $('#studentMessage').val(); // message from student
			console.log(tname,tmail);
			const response = await student.studentInviteTeacher(_deptID, tname, tmail, stu_message);
			if (!response.ok) {
				throw response;
			}
			alert('邀請成功');
			//清空欄位內的值
			$("#teacherName").val("");
			$("#teacherMail").val("");
			$("#studentMessage").val("");

			loading.complete();
		}catch (e) {
			e.json && e.json().then((data) => {
				console.error(data);

				alert(`${data.messages[0]}`);

				loading.complete();
			});
		}
	}

	// 取得邀請師長上傳推薦函的紀錄
	function getTeacherRecommendationLetterInviteRecord(fileListItem) {
		let invite_table = `
			<div id="invitation-area" class="col-md-11" style=" margin:10px auto 28px;overflow-x:auto;">
				<div class="alert alert-danger"><b>注意！ </b><strong>提交備審資料後，師長即無法再上傳推薦函或更新檔案。</strong> <br/>請務必確認上傳情形後再提交備審資料！</div>
				<table id="invitation-list">
					<tr>
						<th>師長姓名</th>
						<th>師長電子信箱地址</th>
						<th>師長完成上傳時間（UTC+8）</th>
					</tr>
		`;
		fileListItem.invites.forEach(function (invitation) {
			if(invitation.deleted_at == null){  // 如果老師還沒鎖定上傳
				invitation.deleted_at = '尚未完成上傳';  // 怕寫 null 有人看不懂
			} else {
			    // 直接拿出去有點難看所以把日期、時間抓出來就好，時區放在標題欄
				invitation.deleted_at = invitation.deleted_at.substr(0,10) + '&nbsp;&nbsp;' + invitation.deleted_at.substr(11,8);
			}
			invite_table += `
					<tr>
						<td>${invitation.teacher_name}</td>
						<td>${invitation.teacher_email}</td>
						<td>${invitation.deleted_at}</td>
					</tr>
			`;
		});
		invite_table += `
				</table>
			</div>
		`;  // 有始有終
		return invite_table;
	}

	// 透過是否勾選同意師長推薦函個資使用條件來控制「送出邀請按鈕」
	function teacherRecommendationPactChange() {
		if($("#agree_teacher_recommendation_pact").prop('checked')){
			document.getElementById("btn-invite").style.visibility="";
		} else {
			document.getElementById("btn-invite").style.visibility="hidden";
		}
	}

	// 和 _handleSave() 內容差不多，只差 alert 的文字和頁面不會 reload
	// 用在先行儲存一次作品集文字，以免上傳檔案就被清掉。
	async function _handleSaveWorks() {
		// 儲存按鈕在有作品集的狀況下才會作動，否則直接 pass
		if (_hasWorks) {
			const workTypeIndex = _wishList[_orderIndex].uploaded_file_list.findIndex(i => i.type_id === (+_workTypeId));
			// sendType: 判斷是否需要送資料、送的方式。
			// complete: 完整資料, empty: 傳送空資料（選繳清空資料用）。
			let sendType = '';
			if (_worksRequired) {
				// 必填的話，要填，要檢驗
				sendType = 'complete';
			} else {
				// 選填的話，檢查作品集欄位如果有填任何資料，要進行檢驗，否則傳送空值清資料
				let isEmpty = true; // 資料是不是空的
				if ($('#workName').val() !== "") { isEmpty = false; }
				if ($('#workPosition').val() !== "") { isEmpty = false; }
				if ($('#workType').val() !== "") { isEmpty = false; }
				if ($('#workMemo').val() !== "") { isEmpty = false; }
				if (_workUrls.length > 0) { isEmpty = false; }
				//if (_wishList[_orderIndex].uploaded_file_list[workTypeIndex].authorization_files.length > 0) { isEmpty = false; }
				if (_wishList[_orderIndex].uploaded_file_list[workTypeIndex].work_files.length > 0) { isEmpty = false; }

				if (isEmpty) {
					sendType = 'empty';
				} else {
					sendType = 'complete';
				}
			}

			if (sendType === 'complete') {
				let correct = true;
				let errorMsg = [];
				if ($('#workName').val() === "") {
					correct = false;
					$('#workName').addClass('invalidInput');
					errorMsg.push('作品名稱');
				} else {
					$('#workName').removeClass('invalidInput');
				}
				if ($('#workPosition').val() === "") {
					correct = false;
					$('#workPosition').addClass('invalidInput');
					errorMsg.push('個人參與的職位或項目');
				} else {
					$('#workPosition').removeClass('invalidInput');
				}
				if ($('#workType').val() === "") {
					correct = false;
					$('#workType').addClass('invalidInput');
					errorMsg.push('術科類型');
				} else {
					$('#workType').removeClass('invalidInput');
				}

				// 作品連結、檔案擇一上傳。沒檔案，才強制上傳 url
				if (_wishList[_orderIndex].uploaded_file_list[workTypeIndex].work_files.length === 0 && _workUrls.length === 0) {
					correct = false;
					$('#workUrl').addClass('invalidInput');
					errorMsg.push('作品連結');
				} else {
					$('#workUrl').removeClass('invalidInput');
				}

				// 怕是同學填了作品連結，但是沒有按 “＋” 來新增
				if ( $('#workUrl').val() != '') {
					correct = false;
					$('#workUrl').addClass('invalidInput');
				} else {
					$('#workUrl').removeClass('invalidInput');
				}

				if (correct) {
					let data = new FormData();
					data.append('name', $('#workName').val());
					data.append('position', $('#workPosition').val());
					data.append('work_type', $('#workType').val());
					data.append('memo', $('#workMemo').val());

					if (_workUrls.length === 0) {
						data.append('urls', '');
					} else {
						_workUrls.forEach((val, index) => {
							data.append('urls[]', val);
						})
					}

					try {
						loading.start();
						const response = await student.setReviewItem({data, type_id: _workTypeId, dept_id: _deptID, student_id: _studentID});
						if (!response.ok) { throw response; }

						alert('作品集文字已儲存，請記得上傳其他備審資料');
						loading.complete();
					} catch(e) {
						e.json && e.json().then((data) => {
							console.error(data);
							alert(`ERROR: \n${data.messages[0]}`);
						});
						loading.complete();
					}
				} else {
					if ( $('#workUrl').val() != '') {
						alert("請點選作品連結右邊藍色“＋” 新增作品連結");
					}
					else
						alert(errorMsg.join('、') + " 欄位必填");
				}
			} else if (sendType === 'empty') {
				let data = new FormData();
				data.append('name', '');
				data.append('position', '');
				data.append('work_type', '');
				data.append('memo', '');
				data.append('urls', '');

				try {
					loading.start();
					const response = await student.setReviewItem({data, type_id: _workTypeId, dept_id: _deptID, student_id: _studentID});
					if (!response.ok) { throw response; }

					alert('作品集文字已儲存，請記得上傳其他備審資料');
					loading.complete();
				} catch(e) {
					e.json && e.json().then((data) => {
						console.error(data);
						alert(`ERROR: \n${data.messages[0]}`);
					});
					loading.complete();
				}
			}
		} else {
			alert('作品集文字已儲存，請記得上傳其他備審資料');
			loading.complete();
		}
	}
})();
