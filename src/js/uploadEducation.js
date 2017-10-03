(() => {

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
		student.setHeader();
		
		$(":file").filestyle({
			htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
			btnClass: "btn-success",
			text: " 選擇圖片",
			input: false
		});
	}

	function _addCertificate() {
		$certificateTitle.html('待上傳學歷證明');
		var fileList = this.files;
		var anyWindow = window.URL || window.webkitURL;
		for(var i = 0; i < fileList.length; i++){
			var objectUrl = anyWindow.createObjectURL(fileList[i]);
			$certificateImgArea.append('<img class="img-thumbnail bg-yellow" src="' + objectUrl + '" data-toggle="modal" data-target=".img-modal">');
			window.URL.revokeObjectURL(fileList[i]);
		}
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
