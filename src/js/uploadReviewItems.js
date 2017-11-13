(() => {

	/**
	*	private variable
	*/

	let _system = 1;
	let _studentID;
	let _isDocumentLock = true; // 備審資料是否已提交
	let _wishList = [];
	let _schoolID;
	let _deptID;

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
						<button type="button" class="btn btn-info btn-wishEdit" data-orderindex="${index}">
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
		const orderIndex = $(this).data('orderindex');
		console.log(orderIndex);

		if (_system === 1) {
			$deptId.text(_wishList[orderIndex].department_data.card_code);
		} else {
			$deptId.text(_wishList[orderIndex].department_data.id);
		}
		$schoolName.text(_wishList[orderIndex].department_data.school.title);
		$deptName.text(_wishList[orderIndex].department_data.title);

		let reviewItemHTML = '';
		let requiredBadge = '';

		_wishList[orderIndex].uploaded_file_list.forEach((value, index) => {
			// console.log(value);
			requiredBadge = (value.required === true) ? '<span class="badge badge-danger">必繳</span>' : '<span class="badge badge-warning">選繳</span>'
			if (!!value.paper) {
				console.log('paper');
				reviewItemHTML += `
					<div class="row">
						<div class="col-12">
							<div class="card">
								<div class="card-header bg-primary text-white">
									${value.type.name} ${requiredBadge}
								</div>
								<div class="card-block">
									<blockquote class="blockquote">
										說明：${value.description}
									</blockquote>

									<div class="card">
										<div class="card-block">
											<p>只接受紙本，請於 <span class="text-danger">${value.paper.deadline}</span> 前逕行寄送到下列地址</p>
											<dl class="row">
												<dt class="col-md-3 col-lg-2">收件人：</dt>
												<dd class="col-md-9 col-lg-10">${value.paper.recipient}</dd>
												<dt class="col-md-3 col-lg-2">地址：</dt>
												<dd class="col-md-9 col-lg-10">${value.paper.address}</dd>
												<dt class="col-md-3 col-lg-2">聯絡電話：</dt>
												<dd class="col-md-9 col-lg-10">${value.paper.phone}</dd>
												<dt class="col-md-3 col-lg-2">E-mail：</dt>
												<dd class="col-md-9 col-lg-10">${value.paper.email}</dd>
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
				let filesHtml = '';
				// console.log(_wishList[orderIndex].uploaded_file_list.files);
				_wishList[orderIndex].uploaded_file_list.forEach((fileListItem, index) => {
					filesHtml = '';
					fileListItem.files.forEach((fileName, index) => {
						const fileType = _getFileType(fileName.split('.')[1]);
						if (fileType === 'img') {
							filesHtml += `<img
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
							filesHtml += `
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
				})
			}
		})

		$reviewItemsArea.html(reviewItemHTML);


		$(":file").filestyle({
			htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
			btnClass: "btn-success",
			text: " 選擇檔案",
			input: false
		});
		$wishListWrap.hide();
		$uploadForm.fadeIn();
		$('html')[0].scrollIntoView(); // 畫面置頂
		const r = Math.floor(Math.random() * 1000);
		setTimeout(loading.complete, 200 + r);

		loading.complete();
	}

	function _handleSave() {
		$uploadForm.hide();
		$wishListWrap.fadeIn();
	}
	
	function _handleExit() {
		$uploadForm.hide();
		$wishListWrap.fadeIn();
	}

	function _handleUpload() {
		const type_id = $(this).data('type');
		const dept_id = $(this).data('deptid');
		const fileList = this.files;
		let data = new FormData();
		for (let i = 0; i < fileList.length; i++) {
			data.append('files[]', fileList[i]);
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
