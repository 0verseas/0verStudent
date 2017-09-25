(() => {

	/**
	*	cache DOM
	*/

	const $certificateFrom = $('#form-certificate');
	const $addCertificateBtn = $certificateFrom.find('#btn-addCertificate');
	const $certificateTitle = $certificateFrom.find('#title-certificate');
	const $certificateImgArea = $certificateFrom.find('#certificateImgArea');

	const $transcriptForm = $('#form-transcript');
	const $addTranscriptBtn = $transcriptForm.find('#btn-addTranscript');
	const $transcriptTitle = $transcriptForm.find('#title-transcript');
	const $transcriptImgArea = $transcriptForm.find('#transcriptImgArea');
	
	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$addCertificateBtn.on("click", _addCertificate);
	$addTranscriptBtn.on("click", _addTranscript);

	function _init() {
		student.setHeader();
		
		$(":file").filestyle({
			htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
			btnClass: "btn-secondary",
			text: " 選擇圖片"
		});
	}

	function _addCertificate() {
		$certificateTitle.html('待上傳學歷證明');
		let width = Math.floor((Math.random() * 500) + 200);
		let height = Math.floor((Math.random() * 500) + 200);
		$certificateImgArea.append('<img class="img-thumbnail bg-yellow" src="http://via.placeholder.com/' + width + 'x' + height + '" data-toggle="modal" data-target=".img-modal">');
	}

	function _addTranscript() {
		$transcriptTitle.html('待上傳成績單');
		let width = Math.floor((Math.random() * 500) + 200);
		let height = Math.floor((Math.random() * 500) + 200);
		$transcriptImgArea.append('<img class="img-thumbnail bg-yellow" src="http://via.placeholder.com/' + width + 'x' + height + '" data-toggle="modal" data-target=".img-modal">');
	}

})();
