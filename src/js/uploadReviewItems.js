(() => {

	/**
	*	private variable
	*/

	let _system = 1;
	let _wishList = [];
	let _studentID;
	let _deptID;
	let _schoolID;
	let _isDocumentLock = true;

	/**
	*	cache DOM
	*/

	const $wishListWrap = $('#wrap-wishList');
	const $wishList = $('#wishList');
	const wishList = document.getElementById('wishList');
	const $uploadForm = $('#form-upload'); // 點下「上傳」按鈕後出現的表單
	const $deptId = $('#deptId');
	const $schoolName = $('#schoolName');
	const $deptName = $('#deptName');
	const $reviewItemsArea = $('#reviewItemsArea');
	const reviewItemsArea = document.getElementById('reviewItemsArea');
	const $saveBtn = $('#btn-save');
	const $exitBtn = $('#btn-exit');
	const $downloadBtn = $('#btn-download');
	const $imgModalBody= $('#img-modal-body');

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
		// set header
		new Promise((resolve, reject) => {
			student.getStudentRegistrationProgress()
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				_setHeader(json);
				_setGreet(json.name || json.email);
				_system = json.student_qualification_verify.system_id;
				_isDocumentLock = !!json.student_misc_data.admission_selection_document_lock_at;
				resolve();
			})
			.catch((err) => {
				if (err.status && err.status === 401) {
					alert('請登入。');
					location.href = "./index.html";
				} else {
					err.json && err.json().then((data) => {
						console.error(data.messages[0]);
						alert(data.messages[0]);
					})
				}
				loading.complete();
			});
		})
		.then(async function () {
			// get wish list
			let key;
			switch (_system) {
				case 1:
					key = 'student_department_admission_selection_order';
					break;
				case 2:
					key = 'student_two_year_tech_department_admission_selection_order';
					break;
				case 3:
				case 4:
					key = 'student_graduate_department_admission_selection_order';
					break;
			}

			const result = await student.getAdmissionSelectionWishOrder();
			_wishList = result[key].map((val, i) => {
				const uploadedFileList = (!!val.uploaded_file_list) ? val.uploaded_file_list : [];
				return {
					id: val.department_data.id,
					cardCode: val.department_data.card_code,
					school: val.department_data.school.title,
					schoolID: val.department_data.school.id,
					dept: val.department_data.title,
					uploadedFileList: uploadedFileList
				}
			});
		})
		.then(() => {
			_renderWishList();
			loading.complete();
		});
	}

	function _renderWishList() {
		let wishHTML = '';
		console.log(_wishList);
		_wishList.forEach((value, index) => {
			let showId = (_system !== 1) ? value.id : value.cardCode;
			wishHTML += `
				<tr class="table-warning">
					<td>${index + 1}</td>
					<td>` + showId + `</td>
					<td>${value.school} ${value.dept}</td>
					<td class="text-right">
						<button type="button" class="btn btn-info btn-wishEdit"
							data-deptid="${value.id}" data-schoolid="${value.schoolID}"">
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
				value.uploadedFileList.forEach((doc, docIndex) => {
					console.log(doc);
					const requiredBadge = (doc.required) ? '<span class="badge badge-danger">必繳</span>' : '<span class="badge badge-warning">選繳</span>';
					let filesNum = '';

					if (doc.paper === null && doc.type.name === "作品集") { // 作品集檔案
						filesNum = (doc.work_files.length + ' 份檔案');
					} else if (doc.paper === null) { // 非紙本資料
						filesNum = (doc.files.length + ' 份檔案');
					} else { // 紙本資料
						filesNum = '請於期限內寄紙本資料至指定收件處';
					}

					wishHTML += `
						${requiredBadge} ${doc.type.name}： ${filesNum}<br />
					`
				});

				wishHTML += `
							</blockquote>
						</td>
					</tr>
					`
			}
		});
		wishList.innerHTML = wishHTML;
	}

	async function _handleEditForm() {
		loading.start();
		const deptId = _deptID = $(this).data('deptid') || _deptID;
		const schoolID = _schoolID = $(this).data('schoolid') || _schoolID;
		const uploadedFile = await student.getReviewItem({
			student_id: _studentID,
			dept_id: deptId,
			type_id: 'all'
		});
		
		const parsedUploadedFile = [];
		Object.values(uploadedFile).forEach((val, i) => {
			parsedUploadedFile[+val.type_id] = val.files;
		});

		let applicationDoc = {};
		student.getDeptApplicationDoc(schoolID, _system, deptId)
		.then((res) => { return res.json(); })
		.then((json) => {
			// 整理資料
			console.log(json);
			let deptObjName = '';
			switch (_system) {
				case 1:
					deptObjName = 'departments';
					break;
				case 2:
					deptObjName = 'two_year_tech_departments';
					break;
				case 3:
				case 4:
					deptObjName = 'graduate_departments';
					break;
			}
			applicationDoc["schoolId"] = json.id;
			applicationDoc["schoolCardCode"] = (_system === 1) ? json[deptObjName][0].card_code : ''; // 學士班才需要 cardCode
			applicationDoc["schoolName"] = json.title;
			applicationDoc["deptId"] = json[deptObjName][0].id;
			applicationDoc["deptNmae"] = json[deptObjName][0].title;
			applicationDoc["applicationDocFiles"] = [];
			json[deptObjName][0].application_docs.forEach((value, index) => {
				applicationDoc["applicationDocFiles"][index] = {};
				applicationDoc["applicationDocFiles"][index]["typeId"] = value.type_id;
				applicationDoc["applicationDocFiles"][index]["name"] = value.type.name;
				applicationDoc["applicationDocFiles"][index]["description"] = value.description;
				applicationDoc["applicationDocFiles"][index]["engDescription"] = value.eng_description;
				applicationDoc["applicationDocFiles"][index]["required"] = value.required;
				applicationDoc["applicationDocFiles"][index]["paper"] = value.paper;
				applicationDoc["applicationDocFiles"][index]["files"] = []

			})
		})
		.then(() => {
			if (_system === 1) {
				$deptId.text(applicationDoc.schoolCardCode);
			} else {
				$deptId.text(applicationDoc.deptId);
			}
			$schoolName.text(applicationDoc.schoolName);
			$deptName.text(applicationDoc.deptNmae);

			let reviewItemHTML = '';
			let requiredBadge = '';
			applicationDoc['applicationDocFiles'].forEach((value, index) => {
				value.required === true ? requiredBadge = '<span class="badge badge-danger">必繳</span>' : requiredBadge = '<span class="badge badge-warning">選繳</span>'
				if (!!value.paper) { // 如果有 paper
					//console.log(value);
					reviewItemHTML += `
						<div class="row">
							<div class="col-12">
								<div class="card">
									<div class="card-header bg-primary text-white">
										${value.name} ${requiredBadge}
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

					// 依照備審項目，設定檔案縮圖
					parsedUploadedFile[value.typeId].map((file, i) => {
						// 取得檔案的類型
						const fileType = _getFileType(file.split('.')[1]);

						// 圖檔用本身，非圖檔用 icon
						if (fileType === 'img') {
							filesHtml += `<img
								class="img-thumbnail"
								src="${env.baseUrl}/students/${_studentID}/admission-selection-application-document/departments/${deptId}/types/${value.typeId}/files/${file}"
								data-toggle="modal"
								data-target=".img-modal"
								data-type="${value.typeId}"
								data-filelink="${env.baseUrl}/students/${_studentID}/admission-selection-application-document/departments/${deptId}/types/${value.typeId}/files/${file}"
								data-filename="${file}"
								data-filetype="img"
							/> `;
						} else {
							filesHtml += `
								<div
									class="img-thumbnail non-img-file-thumbnail"
									data-toggle="modal"
									data-target=".img-modal"
									data-type="${value.typeId}"
									data-filelink="${env.baseUrl}/students/${_studentID}/admission-selection-application-document/departments/${deptId}/types/${value.typeId}/files/${file}"
									data-filename="${file}"
									data-filetype="${fileType}"
									data-icon="fa-file-${fileType}-o"
								>
									<i class="fa fa-file-${fileType}-o" aria-hidden="true"></i>
								</div>
							`;
						}
					}).join('').replace(/,/g, '');

					reviewItemHTML += `
						<div class="row">
							<div class="col-12">
								<div class="card">
									<div class="card-header bg-primary text-white">
										${value.name} ${requiredBadge}
									</div>
									<div class="card-block">
										<blockquote class="blockquote">
											說明：${value.description}
										</blockquote>

										<div class="row" style="margin-bottom: 15px;">
											<div class="col-12">
												<input type="file" class="filestyle file-certificate" data-type="${value.typeId}" data-deptid="${applicationDoc["deptId"]}" multiple>
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
				
			});

			reviewItemsArea.innerHTML = reviewItemHTML;
		})
		.then(() => {
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
		})
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

	function _setHeader(data) {
		_studentID = data.id;
		const systemMap = ['學士班', '港二技', '碩士班', '博士班'];
		const identityMap = ['港澳生', '港澳具外國國籍之華裔學生', '海外僑生', '在臺港澳生', '在臺僑生'];
		student.setHeader({
			system: systemMap[data.student_qualification_verify.system_id - 1],
			identity: identityMap[data.student_qualification_verify.identity - 1],
			id: (data.id).toString().padStart(6, "0")
		});
	}

	function _setGreet(name) {
		$('.greet').text(`歡迎 ${name} 登入！`)
	}

})();
