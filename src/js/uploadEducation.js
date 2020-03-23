(() => {

	const baseUrl = env.baseUrl + '/students';

	let _diplomaFiles = [];
	let _transcriptsFiles = [];
	let _residentCertificateFiles = [];
	let _academicCertificateFiles = [];
	let _othersFiles = [];
	let _modalFiletype = "";
	let _modalFilename = "";

	/**
	*	cache DOM
	*/

	const $uploadEducationForm = $('#form-uploadEducation');
	const $fileUpload = $uploadEducationForm.find('.file-upload');

	// 各項文憑考試
	const $diplomaBlockquote = $('#blockquote-diploma');
	const $diplomaFrom = $('#form-diploma');
	const $diplomaTitle = $('#title-diploma');
	const diplomaImgArea = document.getElementById('diplomaImgArea');

	// 成績單
	const $transcriptsBlockquote = $('#blockquote-transcripts');
	const $transcriptsForm = $('#form-transcripts');
	const $transcriptsTitle = $('#title-transcripts');
	const transcriptsImgArea = document.getElementById('transcriptsImgArea');

	const residentCertificateImgArea = document.getElementById('residentCertificateImgArea');  // 僑居地居留證件
	const academicCertificateImgArea = document.getElementById('academicCertificateImgArea');  // 畢業證書、學歷證明文件
	const othersImgArea = document.getElementById('othersImgArea');  // 其他

	// Modal
	const $imgModal = $('#imgModal');
	const $modalDetailImg = $('#img-modalDetail');
	const $modalDeleteBtn = $('#btn-modalDelete');

	// 重整按鈕
	const $saveBtn = $('#btn-save');

	//已審核按鈕
	const $LockBtn = $('#btn-lock');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$fileUpload.on("change", _addImg);
	$modalDeleteBtn.on("click", _deleteImg);
	$saveBtn.on("click", function() {alert('儲存成功。'); window.location.reload();});
	

	function _init() {
		let files = student.getEducationFile()
		.then((res) => {
			if (res[0].ok && res[1].ok && res[2].ok && res[3].ok && res[4].ok && res[5].ok) {
				return [res[0].json(), res[1].json(), res[2].json(), res[3].json(), res[4].json(), res[5].json()];
			} else {
				throw res[0];
			}
		})
		.then((json) => {
			json[2].then((data) => {
				//有僑編的就是已審核 就把儲存按鈕隱藏
				if(data.student_misc_data.overseas_student_id != null){
					$saveBtn.hide();
					$LockBtn.show();
				}
			});

			json[0].then((data) => {
				_diplomaFiles = data.student_diploma;
			});

			json[1].then((data) => {  
				_transcriptsFiles = data.student_transcripts;
			});

			// 僑居地居留證件
			json[3].then((data) => {
				_residentCertificateFiles = data.student_resident_certificate;
			});

			// 畢業證書
			json[4].then((data) => {
				_academicCertificateFiles = data.student_academic_certificate;
			});

			json[5].then((data) => {
				_othersFiles = data.student_others;
			});

			Promise.all([json[0], json[1], json[3], json[4], json[5]]).then(() => {
				_renderImgArea();
			});

			// json[2].then((data) => {
			// 	if (data.student_qualification_verify.system_id === 2) {
			// 		$diplomaBlockquote.show();
			// 		$transcriptsBlockquote.show();
			// 	}
			// });
		})
		.then(() => {
			loading.complete();
		})
		.catch((err) => {
			if (err.status && err.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			} else {
				err.json && err.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
			}
			loading.complete();
		})
		
		$(":file").filestyle({
			htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
			btnClass: "btn-success",
			text: " 選擇圖片",
			input: false
		});
	}

	function _renderImgArea() {
		// 各類會考文憑
		let diplomaAreaHTML = '';
		_diplomaFiles.forEach((file, index) => {
			diplomaAreaHTML += '<img class="img-thumbnail img-edu" src="' + baseUrl + '/diploma/' + file + '" data-toggle="modal" data-target=".img-modal" data-filetype="diploma" data-filename="' + file + '">';
		})
		diplomaImgArea.innerHTML = diplomaAreaHTML;

		// 成績單
		let transcriptsAreaHTML = '';
		_transcriptsFiles.forEach((file, index) => {
			transcriptsAreaHTML += '<img class="img-thumbnail img-edu" src="' + baseUrl + '/transcripts/' + file + '" data-toggle="modal" data-target=".img-modal" data-filetype="transcripts" data-filename="' + file + '">';
		})
		transcriptsImgArea.innerHTML = transcriptsAreaHTML;

		// 僑居地居留證件
		let residentCertificateAreaHTML = '';
		_residentCertificateFiles.forEach((file, index) => {
			residentCertificateAreaHTML += '<img class="img-thumbnail img-edu" src="' + baseUrl + '/resident-certificate/' + file + '" data-toggle="modal" data-target=".img-modal" data-filetype="resident-certificate" data-filename="' + file + '">';
		});
		residentCertificateImgArea.innerHTML = residentCertificateAreaHTML;

		// 畢業證書、學歷證明等
		let academicCertificateAreaHTML = '';
		_academicCertificateFiles.forEach((file, index) => {
			academicCertificateAreaHTML += '<img class="img-thumbnail img-edu" src="' + baseUrl + '/academic-certificate/' + file + '" data-toggle="modal" data-target=".img-modal" data-filetype="academic-certificate" data-filename="' + file + '">';
		});
		academicCertificateImgArea.innerHTML = academicCertificateAreaHTML;

		let othersAreaHTML = '';
		_othersFiles.forEach((file, index) => {
			othersAreaHTML += '<img class="img-thumbnail img-edu" src="' + baseUrl + '/others/' + file + '" data-toggle="modal" data-target=".img-modal" data-filetype="others" data-filename="' + file + '">';
		});
		othersImgArea.innerHTML = othersAreaHTML;

		const $eduImg = $uploadEducationForm.find('.img-edu');
		$eduImg.on("click", _showDetail);
	}

	function _addImg() {
		const uploadtype = $(this).data('uploadtype');
		const fileList = this.files;
		let sendData = new FormData();
		//偵測是否超過4MB
		if(sizeConversion(fileList[0].size)){
			alert('檔案過大，大小不能超過4MB！')
			return;
		}	

		for (let i = 0; i < fileList.length; i++) {
			sendData.append('files[]', fileList[i]);
		}
		loading.start();
		student.uploadEducationFile(uploadtype, sendData)
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			if (uploadtype == "diploma") {
				_diplomaFiles = _diplomaFiles.concat(json.student_diploma);
			} else if (uploadtype == "transcripts") {
				_transcriptsFiles = _transcriptsFiles.concat(json.student_transcripts);
			} else if (uploadtype == "resident-certificate") {
				_residentCertificateFiles = _residentCertificateFiles.concat(json.student_resident_certificate);
			} else if (uploadtype == "academic-certificate") {
				_academicCertificateFiles = _academicCertificateFiles.concat(json.student_academic_certificate);
			} else if (uploadtype == "others") {
				_othersFiles = _othersFiles.concat(json.student_others);
			}
		})
		.then(() => {
			_renderImgArea();
			loading.complete();
		})
		.catch((err) => {
			if (err.status && err.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			} else if (err.status && err.status === 400) {
				alert("圖片規格不符");
			}
			err.json && err.json().then((data) => {
				console.error(data.messages[0]);
				alert(data.messages[0]);
			})
			loading.complete();
		})
	}

	function _showDetail() {
		_modalFiletype = $(this).data('filetype');
		_modalFilename = $(this).data('filename');
		$modalDetailImg.attr("src", baseUrl + "/" + _modalFiletype + "/" +_modalFilename);
	}

	function _deleteImg() {
		var deleteConfirm = confirm("確定要刪除嗎？");
		if (deleteConfirm === true) {
			$imgModal.modal('hide');
			loading.start();
			student.deleteEducationFile(_modalFiletype, _modalFilename)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				if (_modalFiletype === "diploma") {
					_diplomaFiles = json.student_diploma;
				} else if (_modalFiletype === "transcripts") {
					_transcriptsFiles = json.student_transcripts;
				} else if (_modalFiletype == "resident-certificate") {
					_residentCertificateFiles =  json.student_resident_certificate;
				} else if (_modalFiletype == "academic-certificate") {
					_academicCertificateFiles = json.student_academic_certificate;
				} else if (_modalFiletype == "others") {
					_othersFiles = json.student_others;
				}
			})
			.then(() => {
				_renderImgArea();
				loading.complete();
			})
			.catch((err) => {
				if (err.status && err.status === 401) {
					alert('請登入。');
					location.href = "./index.html";
				} else if (err.status && err.status === 404) {
					alert("沒有這張圖片。");
				}
				err.json && err.json().then((data) => {
					console.error(data.messages[0]);
					alert(data.messages[0]);
				})
				loading.complete();
			})
		}
	}

	//檔案大小計算是否超過4MB
	function sizeConversion(size) {
		let maxSize = 4*1024*1024;

		if(size < maxSize){
			return false;
		} else {
			return true;
		}
	}

})();
