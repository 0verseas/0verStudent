(() => {

	/**
	*	private variable
	*/

	let _system = 1;
	let _wishList = [];
	let _studentID;

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
	$('body').on('change.upload', '.file-certificate', _handleUpload)

	async function _init() {
		// set header
		new Promise((resolve, reject) => {
			student.getStudentRegistrationProgress().then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				_setHeader(json);
				_system = json.student_qualification_verify.system_id;
				resolve();
			})
			.catch((err) => {
				console.error(err);
				err.json && err.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
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
				return {
					id: val.department_data.id,
					school: val.department_data.school.title,
					schoolID: val.department_data.school.id,
					dept: val.department_data.title
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
		_wishList.forEach((value, index) => {
			wishHTML += `
				<tr class="table-warning">
					<td>${index + 1}</td>
					<td>${value.id}</td>
					<td>${value.school} ${value.dept}</td>
					<td class="text-right">
						<button type="button" class="btn btn-info btn-wishEdit" data-toggle="modal" data-target="#modal-applicationDoc" data-deptid="${value.id}" data-schoolid="${value.schoolID}"">
							<i class="fa fa-upload" aria-hidden="true"></i>
							<span class="hidden-sm-down"> 上傳</span>
						</button>
					</td>
				</tr>
			`
		});
		wishList.innerHTML = wishHTML;
	}

	async function _handleEditForm() {
		const deptId = $(this).data('deptid');
		const schoolID = $(this).data('schoolid');
		const uploadedFile = await student.getReviewItem({
			student_id: _studentID,
			dept_id: deptId,
			type_id: 'all'
		});

		const parsedUploadedFile = [];
		Object.values(uploadedFile).forEach((val, i) => {
			parsedUploadedFile[+val.type_id] = val.files;
		});

		console.log(parsedUploadedFile)

		let applicationDoc = {};
		student.getDeptApplicationDoc(schoolID, _system, deptId)
		.then((res) => { return res.json(); })
		.then((json) => {
			// 整理資料
			console.log(json)
			applicationDoc["schoolId"] = json.id;
			applicationDoc["schoolName"] = json.title;
			applicationDoc["deptId"] = json.departments[0].id;
			applicationDoc["deptNmae"] = json.departments[0].title;
			applicationDoc["applicationDocFiles"] = [];
			json.departments[0].application_docs.forEach((value, index) => {
				applicationDoc["applicationDocFiles"][index] = {};
				applicationDoc["applicationDocFiles"][index]["typeId"] = value.type_id;
				applicationDoc["applicationDocFiles"][index]["name"] = value.type.name;
				applicationDoc["applicationDocFiles"][index]["description"] = value.description;
				applicationDoc["applicationDocFiles"][index]["engDescription"] = value.eng_description;
				applicationDoc["applicationDocFiles"][index]["required"] = value.required;
				applicationDoc["applicationDocFiles"][index]["files"] = []

			})
			console.log(applicationDoc);
		})
		.then(() => {
			$deptId.text(applicationDoc.deptId)
			$schoolName.text(applicationDoc.schoolName);
			$deptName.text(applicationDoc.deptNmae);

			let reviewItemHTML = '';
			let requiredBadge = '';
			applicationDoc['applicationDocFiles'].forEach((value, index) => {
				value.required === true ? requiredBadge = '<span class="badge badge-danger">必填</span>' : requiredBadge = '<span class="badge badge-warning">選填</span>'
				reviewItemHTML += `
					<div class="row">
						<div class="col-12">
							<div class="card">
								<div class="card-header bg-primary text-white">
									${value.name} ${requiredBadge}
								</div>
								<div class="card-block">
									<blockquote class="blockquote">
										${value.description}
									</blockquote>

									<div class="row" style="margin-bottom: 15px;">
										<div class="col-12">
											<input type="file" class="filestyle file-certificate" data-type="${value.typeId}" data-deptid="${applicationDoc["deptId"]}" multiple>
										</div>
									</div>

									<div class="card">
										<div class="card-block">
											<h4 class="card-title"><span>已上傳檔案</span> <small class="text-muted">(點圖可放大或刪除)</small></h4>
											<div id="">
												${
													parsedUploadedFile[value.typeId].map((file, i) => {
														return `<img src="${env.baseUrl}/students/${_studentID}/admission-selection-application-document/departments/${deptId}/types/${value.typeId}/files/${file}" />`
													}).join('').replace(/,/g, '')
												}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<hr>
				`
			});

			// image HTML: '<img class="img-thumbnail" src="http://via.placeholder.com/970x1100" data-toggle="modal" data-target=".img-modal">'

			reviewItemsArea.innerHTML = reviewItemHTML;
		})
		.then(() => {
			$(":file").filestyle({
				htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
				btnClass: "btn-success",
				text: " 選擇圖片",
				input: false
			});
			$wishListWrap.hide();
			$uploadForm.fadeIn();
			$('html')[0].scrollIntoView(); // 畫面置頂
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
		})
		.catch((err) => {
			console.error(err);
			err.json && err.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
		});
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
})();
