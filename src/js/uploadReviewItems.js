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
			_wishList = orderJson.student_department_admission_selection_order;

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
					<td>${value.department_data.school.title} ${value.department_data.title}</td>
					<td class="text-right">
						<button type="button" class="btn btn-info btn-wishEdit" data-deptid="${value.dept_id}">
							<i class="fa fa-upload" aria-hidden="true"></i>
							<span class="hidden-sm-down"> 上傳</span>
						</button>
					</td>
				</tr>
			`

			if (_isDocumentLock) {
				wishHTML += `
					<tr>
						<td colspan="4">
							<h6>繳交狀況：</h6>
							<blockquote class="blockquote">
							`
				value.uploaded_file_list.forEach((doc, docIndex) => {
					const requiredBadge = (doc.required) ? '<span class="badge badge-danger">必繳</span>' : '<span class="badge badge-warning">選繳</span>';
					let filesNum = '';

					if (doc.type.name === "作品集") { // 作品集檔案
						filesNum = (doc.work_files.length + ' 份檔案');
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

		_wishList[_orderIndex].uploaded_file_list.forEach((fileListItem, index) => {
			requiredBadge = (fileListItem.required === true) ? '<span class="badge badge-danger">必繳</span>' : '<span class="badge badge-warning">選繳</span>'
			if (fileListItem.type.name === "作品集") {
				_hasWorks = true;
				_workTypeId = fileListItem.type_id;

				let authorizationHTML = _getFileAreaHTML(fileListItem, "authorization_files");
				let worksHTML = _getFileAreaHTML(fileListItem, "work_files");

				reviewItemHTML += `
					<div class="row">
						<div class="col-12">
							<div class="card">
								<div class="card-header bg-primary text-white">
									${fileListItem.type.name} ${requiredBadge}
								</div>
								<div class="card-block">
									<blockquote class="blockquote">
										說明：${fileListItem.description}
									</blockquote>

									<div>
										<div class="form-group">
											<label for="workName">作品名稱</label>
											<input type="text" class="form-control" id="workName">
										</div>
										<div class="form-group">
											<label for="workPosition">個人參與的職位或項目</label>
											<input type="text" class="form-control" id="workPosition">
										</div>
										<div class="form-group">
											<label for="workType">術科類型</label>
											<input type="text" class="form-control" id="workType">
										</div>
										<div class="form-group">
											<label for="workMemo">備註</label>
											<textarea class="form-control" id="workMemo" rows="3"></textarea>
										</div>
										<div class="form-group">
											<label for="workUrl">作品連結</label>
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
										<hr />
									</div>

									<h4 style="margin-bottom: 15px;">作品授權書</h4>
									<div class="row" style="margin-bottom: 15px;">
										<div class="col-12">
											<input type="file" class="filestyle file-certificate" data-workstype="authorization" data-type="${fileListItem.type_id}" data-deptid="${fileListItem.dept_id}" multiple>
										</div>
									</div>
									<div class="card">
										<div class="card-block">
											<h4 class="card-title"><span>已上傳授權書</span> <small class="text-muted">(點圖可放大或刪除)</small></h4>
											${authorizationHTML}
										</div>
									</div>
									<hr />

									<h4 style="margin-bottom: 15px;">作品集檔案</h4>
									<div class="row" style="margin-bottom: 15px;">
										<div class="col-12">
											<input type="file" class="filestyle file-certificate" data-workstype="works" data-type="${fileListItem.type_id}" data-deptid="${fileListItem.dept_id}" multiple>
										</div>
									</div>
									<div class="card">
										<div class="card-block">
											<h4 class="card-title"><span>已上傳作品檔案</span> <small class="text-muted">(點圖可放大或刪除)</small></h4>
											${worksHTML}
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
									${fileListItem.type.name} ${requiredBadge}
								</div>
								<div class="card-block">
									<blockquote class="blockquote">
										說明：${fileListItem.description}
									</blockquote>

									<div class="card">
										<div class="card-block">
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
			} else {
				let filesHtml = _getFileAreaHTML(fileListItem, "files");
				reviewItemHTML += `
					<div class="row">
						<div class="col-12">
							<div class="card">
								<div class="card-header bg-primary text-white">
									${fileListItem.type.name} ${requiredBadge}
								</div>
								<div class="card-block">
									<blockquote class="blockquote">
										說明：${fileListItem.description}
									</blockquote>

									<div class="row" style="margin-bottom: 15px;">
										<div class="col-12">
											<input type="file" class="filestyle file-certificate" data-type="${fileListItem.type_id}" data-deptid="${fileListItem.dept_id}" multiple>
										</div>
									</div>

									<div class="card">
										<div class="card-block">
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
		})

		$reviewItemsArea.html(reviewItemHTML);

		if (_hasWorks) {
			_renderWorkUrlList();
			$('#btn-addWorkUrl').on('click', _handleAddWorkUrl);
		}

		$(":file").filestyle({
			htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
			btnClass: "btn-success",
			text: " 選擇檔案",
			input: false
		});
		$wishListWrap.hide();
		$uploadForm.fadeIn();

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
		_workUrls.push(workUrl);
		$('#workUrl').val('');
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
		})
		$('#workUrls').html(workUrlHTML);
		$('.btn-removeWorkUrl').on('click', _handleRemoveUrl);
	}

	async function _handleSave() {
		if (_hasWorks) {
			let data = new FormData();
			data.append('name', $('#workName').val());
			data.append('position', $('#workPosition').val());
			data.append('work_type', $('#workType').val());
			data.append('memo', $('#workMemo').val());
			_workUrls.forEach((val, index) => {
				data.append('urls[]', val);
			})

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
				})
				loading.complete();
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

	function _handleUpload() {
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

		student.setReviewItem({data, type_id, dept_id, student_id: _studentID}).then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			console.log(json);
			const uploadFileItemIndex = _wishList[_orderIndex].uploaded_file_list.findIndex(i => i.type_id === (+json.type_id ));
			if (!!workType) {
				if (workType === "authorization") {
					_wishList[_orderIndex].uploaded_file_list[uploadFileItemIndex].authorization_files = json.authorization_files;
				} else if (workType === "works") {
					_wishList[_orderIndex].uploaded_file_list[uploadFileItemIndex].work_files = json.work_files;
				}
			} else {
				_wishList[_orderIndex].uploaded_file_list[uploadFileItemIndex].files = _wishList[_orderIndex].uploaded_file_list[uploadFileItemIndex].files.concat(json.files);
			}
			_handleEditForm();
		})
		.catch((err) => {
			console.error(err);
			err.json && err.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
		});
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

		$('.btn-delImg').attr({
			'data-type': type,
			'data-filename': fileName
		});

	}

	function _handleDelImg() {
		if (!confirm('確定刪除？')) {
			return;
		}
		console.log("back to end",_studentID,_deptID,$(this).attr('data-type'),$(this).attr('data-filename'))
		student.delReviewItem({
			student_id: _studentID,
			dept_id: _deptID,
			type_id: $(this).attr('data-type'),
			filename: $(this).attr('data-filename')
		})
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			console.log(json);
			const uploadFileItemIndex = _wishList[_orderIndex].uploaded_file_list.findIndex(i => i.type_id === (+json[0].type_id ));
			_wishList[_orderIndex].uploaded_file_list[uploadFileItemIndex].files = json[0].files;
			$('.img-modal').modal('hide');
			_handleEditForm();
		})
		.catch((err) => {
			console.error(err);
			err.json && err.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
		});
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

})();
