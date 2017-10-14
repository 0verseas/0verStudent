(() => {

	const baseUrl = env.baseUrl + '/students';

	let _diplomaFiles = [];
	let _transcriptsFiles = [];
	let _modalFiletype = ""
	let _modalFilename = ""

	/**
	*	cache DOM
	*/

	const $uploadEducationForm = $('#form-uploadEducation');

	// 學歷證明
	const $diplomaFrom = $('#form-diploma');
	const $diplomaFile = $('#file-diploma');
	const $diplomaTitle = $('#title-diploma');
	const diplomaImgArea = document.getElementById('diplomaImgArea');

	// 成績單
	const $transcriptForm = $('#form-transcript');
	const $transcriptFile = $('#file-transcript');
	const $transcriptTitle = $('#title-transcript');
	const transcriptImgArea = document.getElementById('transcriptImgArea');

	// Modal
	const $imgModal = $('#imgModal');
	const $modalDetailImg = $('#img-modalDetail');
	const $modalDeleteBtn = $('#btn-modalDelete');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$diplomaFile.on("change", _addDiploma);
	$transcriptFile.on("change", _addTranscript);
	$modalDeleteBtn.on("click", _deleteImg);
	

	function _init() {
		let files = student.getDiplomaAndTranscripts()
		.then((res) => {
			if (res[0].ok) {
				return res;
			} else {
				throw res[0];
			}
		})
		.then(res => {
			res[0].json().then((data) => {  
				_diplomaFiles = data.uploaded_files;
			});
			res[1].json().then((data) => {  
				_transcriptsFiles = data.uploaded_files;
			}); 
		})
		.then(() => {
			renderDiplomaArea();
			renderTranscriptsArea();
			student.setHeader();
			_bindImgEvent();
		})
		.catch((err) => {
			if (err.status && err.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			}
			err.json && err.json().then((data) => {
				console.error(data);
			})
		})
		
		$(":file").filestyle({
			htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
			btnClass: "btn-success",
			text: " 選擇圖片",
			input: false
		});
	}

	function renderDiplomaArea() {
		let diplomaAreaHTML = '';
		_diplomaFiles.forEach((file, index) => {
			diplomaAreaHTML += '<img class="img-thumbnail img-edu" src="' + baseUrl + '/diploma/' + file + '" data-toggle="modal" data-target=".img-modal" data-filetype="diploma" data-filename="' + file + '">';
		})
		diplomaImgArea.innerHTML = diplomaAreaHTML;
	}

	function renderTranscriptsArea() {
		let transcriptAreaHTML = '';
		_transcriptsFiles.forEach((file, index) => {
			transcriptAreaHTML += '<img class="img-thumbnail img-edu" src="' + baseUrl + '/transcripts/' + file + '" data-toggle="modal" data-target=".img-modal" data-filetype="transcripts" data-filename="' + file + '">';
		})
		transcriptImgArea.innerHTML = transcriptAreaHTML;
	}

	function _bindImgEvent() {
		const $eduImg = $uploadEducationForm.find('.img-edu');
		$eduImg.on("click", _showDetail);
	}

	function _showDetail() {
		// console.log("asd");
		_modalFiletype = $(this).data('filetype');
		_modalFilename = $(this).data('filename');
		$modalDetailImg.attr("src", baseUrl + "/" + _modalFiletype + "/" +_modalFilename);
	}

	function _deleteImg() {
		var deleteConfirm = confirm("確定要刪除嗎？");
		if (deleteConfirm === true) {
			$imgModal.modal('hide');
			student.deleteEducationImg(_modalFiletype, _modalFilename)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				if (_modalFiletype === "diploma") {
					_diplomaFiles = json.uploaded_files;
				} else if (_modalFiletype === "transcripts") {
					_transcriptsFiles = json.uploaded_files;
				}
			})
			.then(() => {
				renderDiplomaArea();
				renderTranscriptsArea();
				_bindImgEvent();
			})
			.catch((err) => {
				if (err.status && err.status === 401) {
					alert('請登入。');
					location.href = "./index.html";
				} else if (err.status && err.status === 400) {
					alert("圖片規格不符");
				}
				err.json && err.json().then((data) => {
					console.error(data);
				})
			})
		}
	}

	function _addDiploma() {
		const fileList = this.files;
		let sendData = new FormData();
		for (let i = 0; i < fileList.length; i++) {
			sendData.append('files[]', fileList[i]);
		}
		student.uploadDiploma(sendData)
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			_diplomaFiles = _diplomaFiles.concat(json.uploaded_files);
		})
		.then(() => {
			renderDiplomaArea();
			renderTranscriptsArea();
			_bindImgEvent();
		})
		.catch((err) => {
			if (err.status && err.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			} else if (err.status && err.status === 400) {
				alert("圖片規格不符");
			}
			err.json && err.json().then((data) => {
				console.error(data);
			})
		})
	}

	function _addTranscript() {
		const fileList = this.files;
		let sendData = new FormData();
		for (let i = 0; i < fileList.length; i++) {
			sendData.append('files[]', fileList[i]);
		}
		student.uploadTranscripts(sendData)
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			_transcriptsFiles = _transcriptsFiles.concat(json.uploaded_files);
		})
		.then(() => {
			renderDiplomaArea();
			renderTranscriptsArea();
			_bindImgEvent();
		})
		.catch((err) => {
			if (err.status && err.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			} else if (err.status && err.status === 400) {
				alert("圖片規格不符");
			}
			err.json && err.json().then((data) => {
				console.error(data);
			})
		})
	}
})();
