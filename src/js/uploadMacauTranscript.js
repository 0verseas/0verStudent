(() => {

	/**
	 *	private variable
	 */

	let _studentID;
	let _subjectofFileName;
	let checkIllegalScore;

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
	const $EnglishRadio = $('#radio3');
	const $MathRadio = $('#radio5');
	const $ViceMathRadio = $('#radio7');
	const $saveBtn = $('#btn-save');
	const $chinsesScore = $('#chineseScore');
	const $englishScore = $('#englishScore');
	const $MathScore = $('#MathScore');
	const $ViceMathScore = $('#ViceMathScore');
	const $GoSummaryBtn = $('#btn-go-summary');
	const $secondConfirm = $('#secondConfirm');
	const $have_confirm_text = $('#have_confirm_text');
	const $haveConfirmedPage = $('#have_confirmed_page');
	const $fillTranscriptPage = $('#fill_transcript_page');

	const $ConfirmedChineseScore = $('#Confirmed_Chinese_score');
	const $ConfirmedChineseFile = $('#Confirmed_Chinese_file');
	const $ConfirmedEnglishScore = $('#Confirmed_English_score');
	const $ConfirmedEnglishFile = $('#Confirmed_English_file');
	const $ConfirmedMathScore = $('#Confirmed_Math_score');
	const $ConfirmedMathFile = $('#Confirmed_Math_file');
	const $ConfirmedViceMathScore = $('#Confirmed_ViceMath_score');
	const $ConfirmedViceMathFile = $('#Confirmed_ViceMath_file');

	const $goBack = $('#goback');
	const $thirdConfirm = $('#thirdConfirm');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$('body').on('change.upload', '.file-certificate', _handleUpload);
	$('body').on('click', '.fileDelBtn', _handleDelImg);
	$saveBtn.on('click', _handleSave);
	$GoSummaryBtn.on('click', _handleConfirm);
	$chinsesScore.on('keyup', _checkScore);
	$englishScore.on('keyup', _checkScore);
	$MathScore.on('keyup', _checkScore);
	$ViceMathScore.on('keyup', _checkScore);
	// $ChineseRadio.on('change',_handleDelImg);
	// $EnglishRadio.on('change',_handleDelImg);
	// $MathRadio.on('change',_handleDelImg);
	// $ViceMathRadio.on('change',_handleDelImg);
	$secondConfirm.on('click',_handleSecondConfirmed);
	$goBack.on('click',_handleGoBack)
	$thirdConfirm.on('click',_handleThirdConfirm)


	async function _init() {
		try{
			loading.complete();
			const progressResponse = await student.getStudentRegistrationProgress();
			if (!progressResponse.ok) { throw progressResponse; }
			const progressJson = await progressResponse.json();
			_studentID= progressJson.id;

		}
		catch(e) {
			// if (e.status && e.status === 401) {
			// 	alert('請登入。');
			// 	location.href = "./index.html";
			// } else if (e.status && e.status === 403) {
			// 	e.json && e.json().then((data) => {
			// 		alert(`ERROR: \n${data.messages[0]}\n` + '即將返回上一頁');
			// 		window.history.back();
			// 	})
			// } else {
			// 	e.json && e.json().then((data) => {
			// 		console.error(data);
			// 		alert(`ERROR: \n${data.messages[0]}`);
			// 	})
			// }
		}
		loading.complete();

        _getSubjectFileName("01");
		_getSubjectFileName("02");
		_getSubjectFileName("03");
		_getSubjectFileName("04");
		_getScore(_studentID);

		//_handleDelImg(2318, '011001_01.pdf');


	}

	// 先確定成績在合理範圍，再出現上傳檔案按鈕
	function _checkScore(para_subject) {

		const data_subject =  $(this).data('subject') ;
		var subject;
		if( typeof(data_subject) == 'undefined')
			subject = para_subject;
		else
			subject = data_subject;

		if(subject == '01'){
			if( $chinsesScore.val() <= 1000 && $chinsesScore.val() >= 300 && typeof($chinsesScore.val()) != 'undefiend'){
				document.getElementById('uploadFileArea_01').style.display ="block";
				document.getElementById('reviewItemsArea_01').style.display ='block';
			}else{
				document.getElementById('uploadFileArea_01').style.display ="none";
			}
		}
		else if(subject == '02'){
			if( $englishScore.val() <= 1000 && $englishScore.val() >= 300){
				document.getElementById('uploadFileArea_02').style.display ="block";
				document.getElementById('reviewItemsArea_02').style.display ='block';
			}else{
				document.getElementById('uploadFileArea_02').style.display ="none";
			}
		}
		else if(subject == '03'){
			if( $MathScore.val() <= 1000 && $MathScore.val() >= 300){
				document.getElementById('uploadFileArea_03').style.display ="block";
				document.getElementById('reviewItemsArea_03').style.display ='block';
			}else{
				document.getElementById('uploadFileArea_03').style.display ="none";
			}
		}
		else if(subject == '04'){
			if( $ViceMathScore.val() <= 1000 && $ViceMathScore.val() >= 300){
				document.getElementById('uploadFileArea_04').style.display ="block";
				document.getElementById('reviewItemsArea_04').style.display ='block';
			}else{
				document.getElementById('uploadFileArea_04').style.display ="none";
			}
		}
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
			<div class="row fileUpload" style="margin-bottom: 15px; padding-left:5%" >
				<div class="col-12"  >
					<input type="file" class="fileUploadBtn filestyle file-certificate"  data-subject="${subjectId}"  >
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
				
				<div class="row fileDel" style="margin: 0 auto" >
					<div class="col-12"  >
						<button type="button" class=" btn fileDelBtn  btn-danger"  data-subject="${subjectId}"  >
							<i class="fa fa-folder-open" aria-hidden="true"></i> 刪除該科成績單
						</button>
					</div>
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
				
				<div class="row fileDel" style="margin: 0 auto" >
					<div class="col-12"  >
						<button type="button" class=" btn fileDelBtn  btn-danger"  data-subject="${subjectId}"  >
							<i class="fa fa-folder-open" aria-hidden="true"></i> 刪除該科成績單
						</button>
					</div>
				</div>
			</div>`;
		}

		document.getElementById("uploadFileArea_" + subjectId).innerHTML=fileUploadHTML;
		document.getElementById("reviewItemsArea_" + subjectId).innerHTML=reviewItemHTML;
		_checkScore(subjectId);

		$(".fileUploadBtn").filestyle({ //:file
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
			<div class="row fileUpload" style="margin-bottom: 15px; padding-left:5%" ">
				<div class="col-12"  >
					<input type="file" class="fileUploadBtn filestyle file-certificate"  data-subject="${subjectId}"  >
				</div>
			</div>
		`;

		document.getElementById("uploadFileArea_" + subjectId).innerHTML=fileUploadHTML;
		//document.getElementById("reviewItemsArea_" + subjectId).innerHTML=reviewItemHTML;
		_checkScore(subjectId);

		$(".fileUploadBtn").filestyle({ //:file
			htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
			btnClass: "btn-success",
			text: " 上傳該科成績單",
			input: false
		});

	}

	// 上傳成績單檔案
	async function _handleUpload() {

		const subject =  $(this).data('subject') ;
		console.log(subject);
		const fileList = this.files;
		let data = new FormData();
		for (let i = 0; i < fileList.length; i++) {
			data.append('files[]', fileList[i]);
		}

		_handleSave();

		try {
			loading.start();
			const response = await student.MacauTranscriptsetReviewItem({data, student_id: _studentID, subject: subject});
			console.log("_handleUpload",subject);
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
		//document.getElementById("badge").src=`${env.baseUrl}` + "/students/2305/macau-transcript/subject/01/file/011002_04.jpg";

		window.location.reload();
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

	// 刪除指定成績單檔案
	async function _handleDelImg() {

		// if (!confirm('確定刪除？')) {
		// 	return;
		// }

		// 用subjectID 取得檔案名
		try {
			loading.start();
			console.log(_studentID);
			console.log($(this).data('subject'));
			const response = await student.getMacauTranscriptsetItem({student_id: _studentID, subject: $(this).data('subject')});
			if (!response.ok) { throw response; }
			const fileNameOfSubject = await response.json();
			var _filename = fileNameOfSubject.files[0];

			//console.log(fileNameOfSubject);

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
			//console.log(_filename);
			const response = await student.delMacauTranscriptItem({
				student_id:_studentID,
				subject: $(this).data('subject'),
				filename: _filename
			});

			if (!response.ok) { throw response; }
			const responseJson = await response.json();


			_getSubjectFileName($(this).data('subject'));
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

	// 取得各科成績及鎖定狀況
	async function _getScore(_studentID) {

		try {
			const progressResponse2 = await student.getMacauTranscriptScore({student_id: _studentID});
			if (!progressResponse2.ok) {
				throw progressResponse2;
			}
			const allScore = await progressResponse2.json();

			if (allScore[0].scoreA == '-1') {
				$('input:radio[name="radio1"]').filter('[value="none_Chinese"]').attr('checked', true);
				document.getElementById('chineseScore').disabled = true;
				document.getElementById('uploadFileArea_01').style.display = "none";
				document.getElementById('reviewItemsArea_01').style.display = "none";

			} else {
				$('input:radio[name="radio1"]').filter('[value="exist_Chinese"]').attr('checked', true);
				document.getElementById('chineseScore').value = allScore[0].scoreA;
				document.getElementById('uploadFileArea_01').style.display = "block";
				document.getElementById('reviewItemsArea_01').style.display = "block";
			}

			if (allScore[0].scoreB == '-1') {
				$('input:radio[name="radio3"]').filter('[value="none_English"]').attr('checked', true);
				document.getElementById('englishScore').disabled = true;
				document.getElementById('uploadFileArea_02').style.display = "none";
				document.getElementById('reviewItemsArea_02').style.display = "none";
			} else {
				$('input:radio[name="radio3"]').filter('[value="exist_English"]').attr('checked', true);
				document.getElementById('englishScore').value = allScore[0].scoreB;
				document.getElementById('uploadFileArea_02').style.display = "block";
				document.getElementById('reviewItemsArea_02').style.display = "block";
			}

			if (allScore[0].scoreC == '-1') {
				$('input:radio[name="radio5"]').filter('[value="none_Math"]').attr('checked', true);
				document.getElementById('MathScore').disabled = true;
				document.getElementById('uploadFileArea_03').style.display = "none";
				document.getElementById('reviewItemsArea_03').style.display = "none";
			} else {
				$('input:radio[name="radio5"]').filter('[value="exist_Math"]').attr('checked', true);
				document.getElementById('MathScore').value = allScore[0].scoreC;
				document.getElementById('uploadFileArea_03').style.display = "block";
				document.getElementById('reviewItemsArea_03').style.display = "block";
			}

			if (allScore[0].scoreD == '-1') {
				$('input:radio[name="radio7"]').filter('[value="none_ViceMath"]').attr('checked', true);
				document.getElementById('ViceMathScore').disabled = true;
				document.getElementById('uploadFileArea_04').style.display = "none";
				document.getElementById('reviewItemsArea_04').style.display = "none";

			} else {
				$('input:radio[name="radio7"]').filter('[value="exist_ViceMath"]').attr('checked', true);
				document.getElementById('ViceMathScore').value = allScore[0].scoreD;
				document.getElementById('uploadFileArea_04').style.display = "block";
				document.getElementById('reviewItemsArea_04').style.display = "block";
			}

			// 如果已經鎖定
			if( allScore['confirmed_macau_transcript_at'].confirmed_macau_transcript_at != null) {
				$have_confirm_text.show();
				//$saveBtn.hide();
				//$confirmBtn.hide();
				//$(".fileUpload").hide();

				summarize_page();
				$fillTranscriptPage.hide();
				$haveConfirmedPage.show();
				$goBack.hide();
				$secondConfirm.hide();
			}
		} catch (e) {
		}

	}

	async function _handleSave() {

		checkIllegalScore = 0;
		if ( ($chinsesScore.val() > 1000 || $chinsesScore.val() < 300) && $("input[name='radio1']:checked").val() == 'exist_Chinese') {
			alert("中文成績輸入有誤");
			checkIllegalScore = 1;
		}
		if (($englishScore.val() > 1000 || $englishScore.val() < 300) && $("input[name='radio3']:checked").val() == 'exist_English' ) {
			alert("英文成績輸入有誤");
			checkIllegalScore = 1;
		}
		if (($MathScore.val() > 1000 || $MathScore.val() < 300) && $("input[name='radio5']:checked").val() == 'exist_Math' ) {
			alert("數學成績輸入有誤");
			checkIllegalScore = 1;
		}
		if ( ($ViceMathScore.val() > 1000 || $ViceMathScore.val() < 300) && $("input[name='radio7']:checked").val() == 'exist_ViceMath') {
			alert("數學附加卷成績輸入有誤");
			checkIllegalScore = 1;
		}

		if (checkIllegalScore != 1) {
			let sendData = {};

			var scoreA = ($("input[name='radio1']:checked").val() == 'none_Chinese') ? -1 : document.getElementById('chineseScore').value;
			var scoreB = ($("input[name='radio3']:checked").val() == 'none_English') ? -1 : document.getElementById('englishScore').value;
			var scoreC = ($("input[name='radio5']:checked").val() == 'none_Math') ? -1 : document.getElementById('MathScore').value;
			var scoreD = ($("input[name='radio7']:checked").val() == 'none_ViceMath') ? -1 : document.getElementById('ViceMathScore').value;


			sendData["user_id"] = _studentID;
			sendData["scoreA"] = scoreA;
			sendData["scoreB"] = scoreB;
			sendData["scoreC"] = scoreC;
			sendData["scoreD"] = scoreD;
			sendData["confirmed_macau_transcript_at"] = 0;
			console.log(sendData);


			if (1) {

				loading.start();
				student.storeMacauTranscriptScore(sendData)
					.then((res) => {
						if (res.ok) {
							return res.json();
						} else {
							throw res;
						}
					})
					.then((json) => {
						console.log(json);
						alert('儲存成功');
						window.location.reload();
						loading.complete();
					})
					.catch((err) => {
						err.json && err.json().then((data) => {
							console.error(data);
							alert(`ERROR: \n${data.messages[0]}`);
						});
						loading.complete();
					})
			} else {
				console.log('==== validate failed ====');
				alert("填寫格式錯誤，請檢查以下表單：\n———————————————\n" + _errormsg.join('、'));
			}
		}
	}

	//檢查成績區間
	async function _handleConfirm() {
		checkIllegalScore = 0;
		if ( ($chinsesScore.val() > 1000 || $chinsesScore.val() < 300) && $("input[name='radio1']:checked").val() == 'exist_Chinese') {
			alert("中文成績輸入有誤");
			checkIllegalScore = 1;
		}
		if (($englishScore.val() > 1000 || $englishScore.val() < 300) && $("input[name='radio3']:checked").val() == 'exist_English' ) {
			alert("英文成績輸入有誤");
			checkIllegalScore = 1;
		}
		if (($MathScore.val() > 1000 || $MathScore.val() < 300) && $("input[name='radio5']:checked").val() == 'exist_Math' ) {
			alert("數學成績輸入有誤");
			checkIllegalScore = 1;
		}
		if ( ($ViceMathScore.val() > 1000 || $ViceMathScore.val() < 300) && $("input[name='radio7']:checked").val() == 'exist_ViceMath') {
			alert("數學附加卷成績輸入有誤");
			checkIllegalScore = 1;
		}

		if (checkIllegalScore != 1) {
			let sendData = {};

			var scoreA = ($("input[name='radio1']:checked").val() == 'none_Chinese') ? -1 : document.getElementById('chineseScore').value;
			var scoreB = ($("input[name='radio3']:checked").val() == 'none_English') ? -1 : document.getElementById('englishScore').value;
			var scoreC = ($("input[name='radio5']:checked").val() == 'none_Math') ? -1 : document.getElementById('MathScore').value;
			var scoreD = ($("input[name='radio7']:checked").val() == 'none_ViceMath') ? -1 : document.getElementById('ViceMathScore').value;


			sendData["user_id"] = _studentID;
			sendData["scoreA"] = scoreA;
			sendData["scoreB"] = scoreB;
			sendData["scoreC"] = scoreC;
			sendData["scoreD"] = scoreD;
			sendData["confirmed_macau_transcript_at"] = 1;
			console.log(sendData);


			if (1) {
				loading.start();
				student.storeMacauTranscriptScore(sendData)
					.then((res) => {
						if (res.ok) {
							return res.json();
						} else {
							throw res;
						}
					})
					.then((json) => {
						console.log(json);
						// alert('已鎖定');
						// window.location.reload();
						summarize_page();
						loading.complete();
					})
					.catch((err) => {
						err.json && err.json().then((data) => {
							console.error(data);
							alert(`ERROR: \n${data.messages[0]}`);
						});
						loading.complete();
					})
			} else {
				console.log('==== validate failed ====');
				alert("填寫格式錯誤，請檢查以下表單：\n———————————————\n" + _errormsg.join('、'));
			}
		}
		summarize_page();
	}

	 function _handleSecondConfirmed(){
		 $("#warningModal").modal();
		 document.getElementById("warningText").innerHTML = "我確認成績及檔案正確，送出鎖定後不得再更改";
	}

	async function summarize_page(){
		var fileHtml=``;
		var scoreHtml=``;

		const progressResponse2 = await student.getMacauTranscriptScore({student_id: _studentID});
		if (!progressResponse2.ok) {
			throw progressResponse2;
		}
		const allScore = await progressResponse2.json();

		if (allScore[0].scoreA == '-1') {
			$ConfirmedChineseScore.html("中文：無此成績");
		}else {
			scoreHtml = `
				中文： ${allScore[0].scoreA} 分 <small>(點此展開已查看成績單)</small>
			`;
			$ConfirmedChineseScore.html(scoreHtml);
			const response = await student.getMacauTranscriptsetItem({student_id: _studentID, subject: "01"});
			if (!response.ok) {
				throw response;
			}
			const fileNameOfSubject = await response.json();
			_subjectofFileName = fileNameOfSubject.files[0];
			const subjectId = _subjectofFileName.substr(7,2);
			const fileType = _getFileType(_subjectofFileName.split('.')[1]);

			if (fileType === 'img') {
				 fileHtml =`<img
							class="img-thumbnail"
							src="${env.baseUrl}/students/${_studentID}/macau-transcript/subject/${subjectId}/file/${_subjectofFileName}"
							data-toggle="modal"
							data-target=".img-modal"
							data-filetype="img"
							/>`;
				$ConfirmedChineseFile.html(fileHtml);
			}
			else if (fileType === 'pdf'){
				fileHtml = `
					<embed src="${env.baseUrl}/students/${_studentID}/macau-transcript/subject/${subjectId}/file/${_subjectofFileName}" 
							width="500" height="375" type="application/pdf">
					`;
				$ConfirmedChineseFile.html(fileHtml);
			}
		}

		if (allScore[0].scoreB == '-1') {
			$ConfirmedEnglishScore.html("英文：無此成績");
		}else {
			scoreHtml = `
				英文： ${allScore[0].scoreB} 分 <small>(點此展開已查看成績單)</small>
			`;
			$ConfirmedEnglishScore.html(scoreHtml);
			const response = await student.getMacauTranscriptsetItem({student_id: _studentID, subject: "02"});
			if (!response.ok) {
				throw response;
			}
			const fileNameOfSubject = await response.json();
			_subjectofFileName = fileNameOfSubject.files[0];
			const subjectId = _subjectofFileName.substr(7,2);
			const fileType = _getFileType(_subjectofFileName.split('.')[1]);

			if (fileType === 'img') {
				fileHtml =`<img
							class="img-thumbnail"
							src="${env.baseUrl}/students/${_studentID}/macau-transcript/subject/${subjectId}/file/${_subjectofFileName}"
							data-toggle="modal"
							data-target=".img-modal"
							data-filetype="img"
							/>`;
				$ConfirmedEnglishFile.html(fileHtml);
			}
			else if (fileType === 'pdf'){
				fileHtml = `
					<embed src="${env.baseUrl}/students/${_studentID}/macau-transcript/subject/${subjectId}/file/${_subjectofFileName}" 
							width="500" height="375" type="application/pdf">
					`;
				$ConfirmedEnglishFile.html(fileHtml);
			}
		}

		if (allScore[0].scoreC == '-1') {
			$ConfirmedMathScore.html("數學：無此成績");
		}else {
			scoreHtml = `
				數學： ${allScore[0].scoreC} 分 <small>(點此展開已查看成績單)</small>
			`;
			$ConfirmedMathScore.html(scoreHtml);
			const response = await student.getMacauTranscriptsetItem({student_id: _studentID, subject: "03"});
			if (!response.ok) {
				throw response;
			}
			const fileNameOfSubject = await response.json();
			_subjectofFileName = fileNameOfSubject.files[0];
			const subjectId = _subjectofFileName.substr(7,2);
			const fileType = _getFileType(_subjectofFileName.split('.')[1]);

			if (fileType === 'img') {
				fileHtml =`<img
							class="img-thumbnail"
							src="${env.baseUrl}/students/${_studentID}/macau-transcript/subject/${subjectId}/file/${_subjectofFileName}"
							data-toggle="modal"
							data-target=".img-modal"
							data-filetype="img"
							/>`;
				$ConfirmedMathFile.html(fileHtml);
			}
			else if (fileType === 'pdf'){
				fileHtml = `
					<embed src="${env.baseUrl}/students/${_studentID}/macau-transcript/subject/${subjectId}/file/${_subjectofFileName}" 
							width="500" height="375" type="application/pdf">
					`;
				$ConfirmedMathFile.html(fileHtml);
			}
		}

		if (allScore[0].scoreD == '-1') {
			$ConfirmedViceMathScore.html("數學(附加卷)：無此成績");
		}else {
			scoreHtml = `
				數學(附加卷)： ${allScore[0].scoreD} 分 <small>(點此展開已查看成績單)</small>
			`;
			$ConfirmedViceMathScore.html(scoreHtml);
			const response = await student.getMacauTranscriptsetItem({student_id: _studentID, subject: "04"});
			if (!response.ok) {
				throw response;
			}
			const fileNameOfSubject = await response.json();
			_subjectofFileName = fileNameOfSubject.files[0];
			const subjectId = _subjectofFileName.substr(7,2);
			const fileType = _getFileType(_subjectofFileName.split('.')[1]);

			if (fileType === 'img') {
				fileHtml =`<img
							class="img-thumbnail"
							src="${env.baseUrl}/students/${_studentID}/macau-transcript/subject/${subjectId}/file/${_subjectofFileName}"
							data-toggle="modal"
							data-target=".img-modal"
							data-filetype="img"
							/>`;
				$ConfirmedViceMathFile.html(fileHtml);
			}
			else if (fileType === 'pdf'){
				fileHtml = `
					<embed src="${env.baseUrl}/students/${_studentID}/macau-transcript/subject/${subjectId}/file/${_subjectofFileName}" 
							width="500" height="375" type="application/pdf">
					`;
				$ConfirmedViceMathFile.html(fileHtml);
			}
		}



		$fillTranscriptPage.hide();
		$haveConfirmedPage.show();


	}

	// 在統整頁面時，回到修改頁面
	function _handleGoBack(){
		$fillTranscriptPage.show();
		$haveConfirmedPage.hide();
	}

	async function _handleThirdConfirm(){
		let sendData = {};
		sendData["confirmed_macau_transcript_at"] = 2;

		loading.start();
		student.storeMacauTranscriptScore(sendData)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				console.log(json);
				 alert('已鎖定');
				// window.location.reload();
				//summarize_page();
				loading.complete();
				window.location.reload();
			})
			.catch((err) => {
				err.json && err.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				});
				loading.complete();
			})

	}






	function _validateForm() {

		/**
		 *    formValidateList: 格式設定表，由此表決定如何驗證表單，並產出要送給後端的 json object。
		 *    el: DOM 元素。
		 *    require: 是否為必填。
		 *    type: 輸出值的格式，之後會驗證是否符合該格式。
		 *    value: 預設取值方式為 el.val()，如果有特殊需求(像是 radio 要用 class name 取值)，則填寫在 value 中。
		 *    dbKey: 資料送往後端的 key，不需送出則不填。
		 *    dbData: 送往後端的資料，預設為 value，其次為 el.val()。如果有特殊需求（像是電話要和國碼合併），則填寫在 dbData 中。
		 */
		let formValidateList = [
			{
				el: $backupEmail,
				require: false,
				type: 'email',
				dbKey: 'backup_email',
				colName: '備用 E-Mail'
			},
		];

		let sendData = {};
	}

})();
