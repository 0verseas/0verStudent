(() => {

	let _diplomaFiles = [];
	let _transcriptsFiles = [];

	/**
	*	cache DOM
	*/

	// 學歷證明
	const $certificateFrom = $('#form-certificate');
	const $certificateFile = $('#file-certificate');
	const $certificateTitle = $('#title-certificate');
	const $certificateImgArea = $('#certificateImgArea');

	// 成績單
	const $transcriptForm = $('#form-transcript');
	const $transcriptFile = $('#file-transcript');
	const $transcriptTitle = $('#title-transcript');
	const $transcriptImgArea = $('#transcriptImgArea');
	
	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$certificateFile.on("change", _addCertificate);
	$transcriptFile.on("change", _addTranscript);

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
			console.log(_diplomaFiles);
			console.log(_transcriptsFiles);
		})
		.then(() => {
			student.setHeader();
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

	function _addCertificate() {

		let filesArr = []
		for (let i = 0; i < fileList.length; i++) {
			filesArr.push(fileList[i]);
		}

		let sendData = new FormData();
		sendData.append('files[]', filesArr);

		student.uploadDiploma(sendData)
		.then((res) => {
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

		// var anyWindow = window.URL || window.webkitURL;
		// for(var i = 0; i < fileList.length; i++){
		// 	var objectUrl = anyWindow.createObjectURL(fileList[i]);
		// 	$certificateImgArea.append('<img class="img-thumbnail bg-yellow" src="' + objectUrl + '" data-toggle="modal" data-target=".img-modal">');
		// 	window.URL.revokeObjectURL(fileList[i]);
		// }
	}

	function _addTranscript() {
		$transcriptTitle.html('待上傳成績單');
		var fileList = this.files;
		var anyWindow = window.URL || window.webkitURL;
		for(var i = 0; i < fileList.length; i++){
			var objectUrl = anyWindow.createObjectURL(fileList[i]);
			$transcriptImgArea.append('<img class="img-thumbnail bg-yellow" src="' + objectUrl + '" data-toggle="modal" data-target=".img-modal">');
			window.URL.revokeObjectURL(fileList[i]);
		}
	}

})();
