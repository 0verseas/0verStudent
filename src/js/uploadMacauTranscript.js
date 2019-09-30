(() => {

	/**
	 *	private variable
	 */

	let _studentID;
	let _subjectofFileName;

	/**
	*	cache DOM
	*/
	const $reviewItemsArea_01 = $('#reviewItemsArea_01');
	const $reviewItemsArea_02 = $('#reviewItemsArea_02');
	const $reviewItemsArea_03 = $('#reviewItemsArea_03');
	const $reviewItemsArea_04 = $('#reviewItemsArea_04');

	const uploadFileArea_01 = $('#uploadFileArea_01');
	const uploadFileArea_02 = $('#uploadFileArea_02');
	const uploadFileArea_03 = $('#uploadFileArea_03');
	const uploadFileArea_04 = $('#uploadFileArea_04');

	const $ChineseRadio = $('#radio1');
	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$('body').on('change.upload', '.file-certificate', _handleUpload);
	$ChineseRadio.on('change',_handleDelImg);

	function _init() {
		loading.complete();
		_studentID= '2318';


        _getSubjectFileName("01");
		_getSubjectFileName("02");
		_getSubjectFileName("03");
		_getSubjectFileName("04");
		//_handleDelImg(2318, '011001_01.pdf');


	}

	// 上傳成績單檔案
	async function _handleUpload() {
		const subject =  $(this).data('subject') ;
		const fileList = this.files;
		let data = new FormData();
		for (let i = 0; i < fileList.length; i++) {
			data.append('files[]', fileList[i]);
		}

		try {
			loading.start();
			const response = await student.MacauTranscriptsetReviewItem({data, student_id: _studentID, subject: subject});
			if (!response.ok) { throw response; }
			const responseJson = await response.json();
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
			loading.complete();
		}
		window.location.reload();
	}

	async function _getSubjectFileName(subject) {
		// 取得檔案名稱，丟到_getFileAreaHTML 準備做顯示
		// 檔案取名規則 6碼僑編 + "_" + 2碼科目號 + 副檔名 ex: 011001_01.jpg
		try {
			loading.start();
			const response = await student.getMacauTranscriptsetItem({student_id: _studentID, subject: subject});
			if (!response.ok) { throw response; }
			const fileNameOfSubject = await response.json();
			_subjectofFileName = fileNameOfSubject.files[0];
			if( typeof(_subjectofFileName) == "undefined"){
				_noFileAreaHtml(subject);
			}
			else{
				_getFileAreaHTML(_subjectofFileName);
			}


			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
			loading.complete();
		}
	}


	function  _getFileAreaHTML(_subjectofFileName) {

		// 利用檔案名來做該科目的顯示
		// _subjectofFileName  011001_01.jpg

		let reviewItemHTML = '';
		let fileUploadHTML = '';
		// 取得檔案類別，pdf 和 img 顯示要分作不同處理
		const fileType = _getFileType(_subjectofFileName.split('.')[1]);
		// 取得科目代號
		const subjectId = _subjectofFileName.substr(7,2);
		// 顯示選擇檔案部份 帶入 data-subject 參數
		fileUploadHTML = `
			<div class="row" style="margin-bottom: 15px; padding-left:5%" >
				<div class="col-12"  >
					<input type="file" class="filestyle file-certificate"  data-subject="${subjectId}" id="content">
				</div>
			</div>
		`;
		// img 和 pdf 顯示分別做不同處理
// todo : data-toggle="modal"
		if (fileType === 'img') {
			reviewItemHTML = `
			<div class="card">
				<div class="card-body" style="margin: 0 auto; text-align:left">
					<h4 class="card-title" style="text-align:left"><span>已上傳檔案</span> </h4>
                       <img
							class="img-thumbnail"
							src="${env.baseUrl}/students/${_studentID}/macau-transcript/subject/${subjectId}/file/${_subjectofFileName}"
							data-toggle="modal"
							data-target=".img-modal"
							data-filetype="img"
							
							/> 
				</div>
			</div>`;
		}
		else{
			reviewItemHTML = `
			<div class="card">
				<div class="card-body" style="margin: 0 auto">
					<h4 class="card-title"><span>已上傳檔案</span> </h4>
						<embed src="${env.baseUrl}/students/${_studentID}/macau-transcript/subject/${subjectId}/file/${_subjectofFileName}" width="500" height="375" type="application/pdf">
				</div>
			</div>`;
		}

		document.getElementById("uploadFileArea_" + subjectId).innerHTML=fileUploadHTML;
		document.getElementById("reviewItemsArea_" + subjectId).innerHTML=reviewItemHTML;

		$(":file").filestyle({
			htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
			btnClass: "btn-success",
			text: " 上傳該科成績單",
			input: false
		});

	}

	function  _noFileAreaHtml(subjectId) {
		let reviewItemHTML = '';
		let fileUploadHTML = '';

		fileUploadHTML = `
			<div class="row" style="margin-bottom: 15px; padding-left:5%" >
				<div class="col-12"  >
					<input type="file" class="filestyle file-certificate"  data-subject="${subjectId}" id="content">
				</div>
			</div>
		`;

		document.getElementById("uploadFileArea_" + subjectId).innerHTML=fileUploadHTML;
		document.getElementById("reviewItemsArea_" + subjectId).innerHTML=reviewItemHTML;

		$(":file").filestyle({
			htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
			btnClass: "btn-success",
			text: "上傳該科成績單",
			input: false
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

	async function test(){
		//alert($(this).data('subject'));




	}
	// 刪除指定成績單檔案
	async function _handleDelImg() {

		// if (!confirm('確定刪除？')) {
		// 	return;
		// }

		// 用subjectID 取得檔案名
		try {
			loading.start();
			const response = await student.getMacauTranscriptsetItem({student_id: _studentID, subject: $(this).data('subject')});
			if (!response.ok) { throw response; }
			const fileNameOfSubject = await response.json();
			_filename = fileNameOfSubject.files[0];

			console.log(_subjectofFileName);

			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
			loading.complete();
		}
		try {
			loading.start();
			const response = await student.delMacauTranscriptItem({
				student_id:_studentID,
				subject: $(this).data('subject'),
				filename: _filename
			});

			if (!response.ok) { throw response; }
			const responseJson = await response.json();

			loading.complete();

		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
			loading.complete();
		}
	}

})();
