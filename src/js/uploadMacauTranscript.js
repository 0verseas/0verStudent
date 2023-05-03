(() => {
	/**
	*	private variable
	*/

    const scoreMax = 1000;
    const scoreMin = 350;
    let user_id; // 報名序號

    /**
	*	cache DOM
	*/
	const $transcriptPage = $('#transcript_page'); // 上傳成績與檔案頁面
	const $confirmPage = $('#confirm_page'); // 確認與鎖定頁面
	const $confiremedText = $('#confirmed_text'); // 已鎖定提示文字
	// 身份證號碼
	const $examResidentIDInput = $('#examResidentID'); // 身份證號碼輸入欄位
	// 中文成績相關物件
    const $chineseScoreRadio = $('.radio-chineseScore'); // 是否考取選項
    const $chineseScoreInputArea = $('.chineseScoreInputArea'); // 上傳成績區域
    const $chineseScoreUploadArea = $('#chineseScoreUploadArea'); // 上傳檔案區域
    const $chineseScoreInput = $('#chineseScoreInput'); // 未加權成績輸入物件
    const $weightedChineseScoreInput = $('#weightedChineseScoreInput'); // 加權後成績輸入物件
	const $chineseScoreFileUploadButton = $('#chineseScoreFileUpload'); // 上傳檔案按鈕
	const $chineseScoreUploadedFileArea = document.getElementById('chineseScoreUploadedFileArea'); // 上傳檔案顯示區域
	// 英文成績相關物件
    const $englishScoreRadio = $('.radio-englishScore'); // 是否考取選項
    const $englishScoreInputArea = $('.englishScoreInputArea'); // 上傳成績區域
    const $englishScoreUploadArea = $('#englishScoreUploadArea');// 上傳檔案區域
    const $englishScoreInput = $('#englishScoreInput'); // 未加權成績輸入物件
    const $weightedEnglishScoreInput = $('#weightedEnglishScoreInput'); // 加權後成績輸入物件
	const $englishScoreFileUploadButton = $('#englishScoreFileUpload'); // 上傳檔案按鈕
	const $englishScoreUploadedFileArea = document.getElementById('englishScoreUploadedFileArea'); // 上傳檔案顯示區域
	// 數學成績相關物件
	const $mathScoreRadio = $('.radio-mathScore'); // 是否考取選項
    const $mathScoreInputArea = $('.mathScoreInputArea'); // 上傳成績區域
    const $mathScoreUploadArea = $('#mathScoreUploadArea');// 上傳檔案區域
    const $mathScoreInput = $('#mathScoreInput'); // 未加權成績輸入物件
    const $weightedMathScoreInput = $('#weightedMathScoreInput'); // 加權後成績輸入物件
	const $mathScoreFileUploadButton = $('#mathScoreFileUpload'); // 上傳檔案按鈕
	const $mathScoreUploadedFileArea = document.getElementById('mathScoreUploadedFileArea'); // 上傳檔案顯示區域
	// 數學（附加卷）成績相關物件
	const $additionalMathScoreRadio = $('.radio-additionalMathScore'); // 是否考取選項
    const $additionalMathScoreInputArea = $('.additionalMathScoreInputArea'); // 上傳成績區域
    const $additionalMathScoreUploadArea = $('#additionalMathScoreUploadArea');// 上傳檔案區域
    const $additionalMathScoreInput = $('#additionalMathScoreInput'); // 未加權成績輸入物件
    const $weightedAdditionalMathScoreInput = $('#weightedAdditionalMathScoreInput'); // 加權後成績輸入物件
	const $additionalMathScoreFileUploadButton = $('#additionalMathScoreFileUpload'); // 上傳檔案按鈕
	const $additionalMathScoreUploadedFileArea = document.getElementById('additionalMathScoreUploadedFileArea'); // 上傳檔案顯示區域
	// 鎖定頁面相關物件
	const $confiremedID = $('#confirmed_exam_resident_ID')
	const $confirmedChineseScore = $('#confirmed_chinese_score'); // 上傳的中文成績
	const $confirmedChineseUploadedFile = $('#confirmed_chinese_uploaded_file'); // 上傳的中文成績檔案
	const $confirmedEnglishScore = $('#confirmed_english_score'); // 上傳的英文成績
	const $confirmedEnglishUploadedFile = $('#confirmed_english_uploaded_file'); // 上傳的英文成績檔案
	const $confirmedMathScore = $('#confirmed_math_score'); // 上傳的數學成績
	const $confirmedMathUploadedFile = $('#confirmed_math_uploaded_file'); // 上傳的數學成績檔案
	const $confirmedAdditionalMathScore = $('#confirmed_additional_math_score'); // 上傳的數學（附加卷）成績
	const $confirmedAdditionalMathUploadedFile = $('#confirmed_additional_math_uploaded_file'); // 上傳的數學（附加卷）成績檔案
	// 其它物件
	const $imgModal = $('#img-modal'); // 放大顯示的上傳檔案 Modal
	const $imgModalBody= $('#img-modal-body'); // 放大顯示的上傳檔案 Modal body
	const $deleteFileBtn = $('.btn-delFile'); // 放大顯示的上傳檔案 刪除按鈕
    const $saveBtn = $('#btn-save'); // 儲存成績按鈕
    const $goConfirmBtn = $('#btn-go-Confirm'); // 切換至鎖定頁面按鈕
	const $backBtn = $('#btn-back');  // 切換至上傳頁面按鈕
	const $confirmBtn = $('#btn-confirm'); // 鎖定按鈕

    /**
	*	bind event
	*/

	$examResidentIDInput.on('change', _validateIDInput); // 身份證號碼輸入檢查事件

    $chineseScoreRadio.on('change',_handleChineseScoreRadioChange); // 是否考取中文成績選項切換事件
    $chineseScoreInput.on('change', _validateScoreInput); // 中文成績輸入檢查事件
    $weightedChineseScoreInput.on('change', _validateScoreInput); // 中文成績輸入檢查事件
	$chineseScoreFileUploadButton.on('change', _handleUpload); // 中文成績檔案上傳事件

    $englishScoreRadio.on('change',_handleEnglishScoreRadioChange); // 是否考取英文成績選項切換事件
    $englishScoreInput.on('change', _validateScoreInput); // 英文成績輸入檢查事件
    $weightedEnglishScoreInput.on('change', _validateScoreInput); // 英文成績輸入檢查事件
	$englishScoreFileUploadButton.on('change', _handleUpload); // 英文成績檔案上傳事件

	$mathScoreRadio.on('change',_handleMathScoreRadioChange); // 是否考取數學成績選項切換事件
    $mathScoreInput.on('change', _validateScoreInput); // 數學成績輸入檢查事件
    $weightedMathScoreInput.on('change', _validateScoreInput); // 數學成績輸入檢查事件
	$mathScoreFileUploadButton.on('change', _handleUpload); // 數學成績檔案上傳事件

	$additionalMathScoreRadio.on('change',_handleAdditionalMathScoreRadioChange); // 是否考取數學（附加卷）成績選項切換事件
    $additionalMathScoreInput.on('change', _validateScoreInput); // 數學（附加卷）成績輸入檢查事件
    $weightedAdditionalMathScoreInput.on('change', _validateScoreInput); // 數學（附加卷）成績輸入檢查事件
	$additionalMathScoreFileUploadButton.on('change', _handleUpload); // 數學（附加卷）成績檔案上傳事件

    $saveBtn.on('click', _handleSave); // 儲存成績事件
    $goConfirmBtn.on('click', _handleSave); // 切換至鎖定頁面事件

	$('body').on('click', '.img-thumbnail', _showUploadedFile); // 放大顯示上傳檔案事件
	$deleteFileBtn.on('click',_handleDeleteFile); // 刪除上傳檔案事件

	$backBtn.on('click',_handleBack); // 切換至上傳頁面事件
	$confirmBtn.on('click', _handleConfirm); // 鎖定成績事件

    /**
	* init
	*/

    _init();

    async function _init(){
        try{
			$('.info-exam-year').text(env.year);
			const progressResponse = await student.getStudentRegistrationProgress();
			if (!progressResponse.ok) { throw progressResponse; }
			const progressJson = await progressResponse.json();
			user_id= progressJson.id;
			let titleText = '';
			//已經錄取了  就不要上傳資料 增加我們的負擔
			if(progressJson.student_misc_data.stage_of_deptid != null
				|| progressJson.student_misc_data.stage_of_admit != null
				|| progressJson.student_misc_data.distribution_date != null
				|| progressJson.student_misc_data.distribution_no != null
				|| progressJson.student_misc_data.code_of_ineligible != null
				|| progressJson.student_misc_data.ineligible_resolution_date != null
			){
				titleText = '已有分發結果，不需上傳登錄成績，即將返回志願檢視。';
			}

			//location.orgin 不支援IE11以下版本  所以用 location.protocol +location.host取代
			if(!progressJson.can_macau_upload_time){
				titleText = '開放時間未到或條件不符，即將返回志願檢視。';
			}

			//沒有僑生編號就返回志願檢視頁面
			if(progressJson.student_misc_data.overseas_student_id == null){
				titleText = '請先繳交報名表件並等待審核完畢，即將返回志願檢視。';
			}

			if(titleText != ''){
				await swal({title: titleText, type:"warning", confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=>{
					location.href  = './result.html';
				});
				return ;
			}
			// 開始抓取學生上傳成績
			const getScoreResponse = await student.getMacauTranscriptScore({student_id: user_id});
			if (!getScoreResponse.ok) {
				throw getScoreResponse;
			}
			const macauTranscriptStatus = await getScoreResponse.json();
			const allScore = macauTranscriptStatus[0];
			const confirmedStatus = macauTranscriptStatus['confirmed_status'];
			// 如果已經鎖定 就直接跳到鎖定畫面並顯示已鎖定文字
			if(confirmedStatus.confirmed_macau_transcript_at != null){
				$confiremedText.show();
				summarize_page();
				$backBtn.hide();
				$confirmBtn.hide();
			} else {
				$deleteFileBtn.show();
				if(allScore.scoreA == -1){
					$transcriptPage.find(`.radio-chineseScore[value=0]`).prop('checked',true).trigger('change');
					$chineseScoreInput.val('');
					$weightedChineseScoreInput.val('');
				} else if(allScore.scoreA != null){
					$transcriptPage.find(`.radio-chineseScore[value=1]`).prop('checked',true).trigger('change');
					$chineseScoreInput.val(allScore.scoreA);
					if(allScore.weightedScoreA == -1){
						$weightedChineseScoreInput.val('');
					} else {
						$weightedChineseScoreInput.val(allScore.weightedScoreA);
					}
					_initUploadedFileArea('01');
				}

				if(allScore.scoreB == -1){
					$transcriptPage.find(`.radio-englishScore[value=0]`).prop('checked',true).trigger('change');
					$englishScoreInput.val('');
					$weightedEnglishScoreInput.val('');
				} else if(allScore.scoreB != null){
					$transcriptPage.find(`.radio-englishScore[value=1]`).prop('checked',true).trigger('change');
					$englishScoreInput.val(allScore.scoreB);
					if(allScore.weightedScoreB == -1){
						$weightedEnglishScoreInput.val('');
					} else {
						$weightedEnglishScoreInput.val(allScore.weightedScoreB);
					}
					_initUploadedFileArea('02');
				}

				if(allScore.scoreC == -1){
					$transcriptPage.find(`.radio-mathScore[value=0]`).prop('checked',true).trigger('change');
					$mathScoreInput.val('');
					$weightedMathScoreInput.val('');
				} else if(allScore.scoreC != null){
					$transcriptPage.find(`.radio-mathScore[value=1]`).prop('checked',true).trigger('change');
					$mathScoreInput.val(allScore.scoreC);
					if(allScore.weightedScoreC == -1){
						$weightedMathScoreInput.val('');
					} else {
						$weightedMathScoreInput.val(allScore.weightedScoreC);
					}
					_initUploadedFileArea('03');
				}

				if(allScore.scoreD == -1){
					$transcriptPage.find(`.radio-additionalMathScore[value=0]`).prop('checked',true).trigger('change');
					$additionalMathScoreInput.val('');
					$weightedAdditionalMathScoreInput.val('');
				} else if(allScore.scoreD != null){
					$transcriptPage.find(`.radio-additionalMathScore[value=1]`).prop('checked',true).trigger('change');
					$additionalMathScoreInput.val(allScore.scoreD);
					if(allScore.weightedScoreD == -1){
						$weightedAdditionalMathScoreInput.val('');
					} else {
						$weightedAdditionalMathScoreInput.val(allScore.weightedScoreD);
					}
					_initUploadedFileArea('04');
				}
			}
		} catch(e) {
			if (e.status && e.status === 401) {
				swal({title: `請重新登入`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=>{
					location.href = "./index.html";
				});
			} else if (e.status && e.status === 403) {
				e.json && e.json().then((data) => {
					swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false})
					.then(()=>{
						if(window.history.length>1){
							window.history.back();
						} else {
							location.href = "./personalInfo.html";
						}
					});
				})
			} else {
				e.json && e.json().then((data) => {
					console.error(data);
					swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
				})
			}
		}
        await loading.complete();
    }

    // 中文成績選項變更事件
    function _handleChineseScoreRadioChange(){
        const choosenRadioValue = $chineseScoreRadio.filter(":checked").val();

        if(choosenRadioValue == 1){
            $chineseScoreInputArea.show();
            $chineseScoreUploadArea.show();
        } else {
            $chineseScoreInputArea.hide();
            $chineseScoreUploadArea.hide();
        }
    }

    // 英文成績選項變更事件
    function _handleEnglishScoreRadioChange(){
        const choosenRadioValue = $englishScoreRadio.filter(":checked").val();

        if(choosenRadioValue == 1){
            $englishScoreInputArea.show();
            $englishScoreUploadArea.show();
        } else {
            $englishScoreInputArea.hide();
            $englishScoreUploadArea.hide();
        }
    }

	// 數學成績選項變更事件
    function _handleMathScoreRadioChange(){
        const choosenRadioValue = $mathScoreRadio.filter(":checked").val();

        if(choosenRadioValue == 1){
            $mathScoreInputArea.show();
            $mathScoreUploadArea.show();
        } else {
            $mathScoreInputArea.hide();
            $mathScoreUploadArea.hide();
        }
    }

	// 數學（附加卷）成績選項變更事件
    function _handleAdditionalMathScoreRadioChange(){
        const choosenRadioValue = $additionalMathScoreRadio.filter(":checked").val();

        if(choosenRadioValue == 1){
            $additionalMathScoreInputArea.show();
            $additionalMathScoreUploadArea.show();
        } else {
            $additionalMathScoreInputArea.hide();
            $additionalMathScoreUploadArea.hide();
        }
    }

	// 身份證號碼輸入檢查
	function _validateIDInput(){
		const IDRegex = /^[0-9A-z().-/]{0,100}$/g;
        let IDNumber = $(this).val().replace(/[\s]/g, "");
		if (IDNumber.match(IDRegex) == null) { // 不符合上述的格式就回傳格式錯誤
			$(this).val('')
		}

        return;
	}

	// 成績輸入檢查
    function _validateScoreInput(){
		const scoreRegex = /^(3[5-9][0-9]|[4-9][0-9][0-9]|1[0][0][0])$/g;
        let score = $(this).val().replace(/[\s]/g, "");
		if (score.match(scoreRegex) == null) { // 不符合上述的格式就回傳格式錯誤
			$(this).val('')
		}

        return;
    }

	// 初始化上傳檔案
    async function _initUploadedFileArea(subject) {
		// 檔名規則 6碼僑編 + "_" + 2碼科目號 + 副檔名 ex: 011001_01.jpg
		try {
			loading.start();
			const response = await student.getMacauTranscriptsetItem({student_id: user_id, subject: subject});
			if (!response.ok) { throw response; }
			const fileNameOfSubject = await response.json();
			_renderUploadedArea(subject, fileNameOfSubject.files);
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
			});
			loading.complete();
		}
	}

	// 處理檔案上傳
	async function _handleUpload(){
		const subject = $(this).data('subject');
		const fileList = this.files;
		// 沒有上傳檔案 直接return
		if(fileList.length <= 0){
			return;
		}
		let data = new FormData();
		for (let i = 0; i < fileList.length; i++) {
			data.append('files[]', fileList[i]);
			//偵測是否超過4MB
			if(student.sizeConversion(fileList[i].size,4)){
				swal({title: `檔案過大`, text: fileList[i].name+' ，檔案大小不能超過4MB！', type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
				$(this).val('');//清除檔案路徑
				return;
			}
		}

		try {
			loading.start();
			const response = await student.MacauTranscriptsetReviewItem({data, student_id: user_id, subject: subject});
			if (!response.ok) { throw response; }
			const responseJson = await response.json();
			_renderUploadedArea(subject, responseJson['files']);
			$(this).val('');//清除檔案路徑
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error("error",data);
				swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
			});
			$(this).val('');//清除檔案路徑
			loading.complete();
		}
		$(this).val('');//清除檔案路徑
	}

	// 渲染已上傳檔案
    function _renderUploadedArea(subject, files) {
		let uploadedAreaHtml = '';
        files.forEach((file) => {
            const fileType = _getFileType(file.split('.')[1]);
			let dummy_id = Math.floor(Math.random() * 1000000) + Math.floor(Math.random() * 1111111);
			const url = `${env.baseUrl}/students/${user_id}/macau-transcript/subject/${subject}/file/${file}?dummy_id=${dummy_id}`;
            if(fileType === 'img'){
                uploadedAreaHtml += `
                    <img
                        class="img-thumbnail"
                        src="${url}"
                        data-toggle="modal"
						data-subject="${subject}"
                        data-filename="${file}"
						data-target=".img-modal"
                        data-filetype="img"
                        data-filelink="${url}"
                    />
                `
            } else {
                uploadedAreaHtml += `
					<div
						class="img-thumbnail non-img-file-thumbnail"
						data-toggle="modal"
						data-target=".img-modal"
						data-filelink="${url}"
						data-subject="${subject}"
						data-filename="${file}"
                        data-filetype="${fileType}"
						data-icon="fa-file-${fileType}-o"
					>
						<i class="fa fa-file-${fileType}-o" data-filename="${file}" data-icon="fa-file-${fileType}-o" aria-hidden="true"></i>
					</div>
				`;
            }
        });
		switch(subject){
			case '01':
				$chineseScoreUploadedFileArea.innerHTML = uploadedAreaHtml;
				break;
			case '02':
				$englishScoreUploadedFileArea.innerHTML = uploadedAreaHtml;
				break;
			case '03':
				$mathScoreUploadedFileArea.innerHTML = uploadedAreaHtml;
				break;
			case '04':
				$additionalMathScoreUploadedFileArea.innerHTML = uploadedAreaHtml;
				break;
		}
		return;
    }

	// 顯示上傳檔案
	function _showUploadedFile() {
        // 取得點選的檔案名稱、類別及subject
		const fileName = $(this).data('filename');
		const fileType = $(this).data('filetype');
		const subject = $(this).data('subject');


		// 清空 modal 內容
		$imgModalBody.html('');

		// 是圖放圖，非圖放 icon
		if (fileType === 'img') {
			$imgModalBody.html(`
				<img
					src="${this.src}"
					class="img-fluid rounded img-ori"
				>
			`);
		} else {
			$imgModalBody.html(`
				<div style="margin: 0 auto">
					<embed src="${this.dataset.filelink}" width="550" height="800" type="application/pdf">
				</div>
			`);
		}
        // 刪除檔案按鈕紀錄點選的檔案名稱及類別
		$deleteFileBtn.attr({
			'filetype': fileType,
			'filename': fileName,
			'subject': subject,
		});
	}

	// 確認是否刪除上傳檔案
    function _handleDeleteFile(){
        const fileName = $deleteFileBtn.attr('filename');
		const subject = $deleteFileBtn.attr('subject');
        swal({
            title: '確定要刪除已上傳的檔案？',
            type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#5cb85c',
            cancelButtonColor: '#d9534f',
            confirmButtonText: '確定',
            cancelButtonText: '取消',
        }).then(()=>{
            _deleteFile(fileName, subject);
        }).catch(()=>{
            return;
        });
    }

	// 刪除上傳檔案事件
    async function _deleteFile(fileName, subject){
		try {
			loading.start();
			const response = await student.delMacauTranscriptItem({
				student_id: user_id,
				subject: subject,
				filename: fileName
			});

			if (!response.ok) { throw response; }
			const responseJson = await response.json();
			_renderUploadedArea(subject, responseJson['files']);
			$imgModal.modal('hide');
            swal({title:"刪除成功！", type:"success", confirmButtonText: '確定', allowOutsideClick: false});
			loading.complete();

		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
			});
			loading.complete();
		}
    }

	// 儲存事件
    function _handleSave() {
		const action = $(this).data('action');
		const scoreRegex = /^(3[5-9][0-9]|[4-9][0-9][0-9]|1[0][0][0])$/g;
		const IDNumber = $examResidentIDInput.val();
        const chineseChoosenRadioValue = $chineseScoreRadio.filter(":checked").val();
        const englishChoosenRadioValue = $englishScoreRadio.filter(":checked").val();
		const mathChoosenRadioValue = $mathScoreRadio.filter(":checked").val();
        const additionalMathChoosenRadioValue = $additionalMathScoreRadio.filter(":checked").val();

        let scoreA = '';
        let weightedScoreA = '';
        let scoreB = '';
        let weightedScoreB = '';
        let scoreC = '';
        let weightedScoreC = '';
        let scoreD = '';
        let weightedScoreD = '';

		if(!IDNumber){
			swal({title: `Warning`, text:`請填寫身分證字號`, confirmButtonText:'確定', type:'warning'});
			return;
		}

		if(chineseChoosenRadioValue == undefined){
			swal({title: `Warning`, text:`請確認是否考取中文科目`, confirmButtonText:'確定', type:'warning'});
			return;
		}
		if(englishChoosenRadioValue == undefined){
			swal({title: `Warning`, text:`請確認是否考取英文科目`, confirmButtonText:'確定', type:'warning'});
			return;
		}
		if(mathChoosenRadioValue == undefined){
			swal({title: `Warning`, text:`請確認是否考取數學科目`, confirmButtonText:'確定', type:'warning'});
			return;
		}
		if(additionalMathChoosenRadioValue == undefined){
			swal({title: `Warning`, text:`請確認是否考取數學（附加卷）科目`, confirmButtonText:'確定', type:'warning'});
			return;
		}

        if(chineseChoosenRadioValue == 1){
            scoreA = $chineseScoreInput.val();
            weightedScoreA = $weightedChineseScoreInput.val();
			if (scoreA.match(scoreRegex) == null) { // 不符合上述的格式就回傳格式錯誤
				swal({title:`成績格式錯誤`, text: '未加權中文成績輸入有誤，未加權成績為必填，且成績需在350～1000區間。', confirmButtonText:'確定', type:'warning'});
				return;
			}
			if($chineseScoreUploadedFileArea.innerHTML == '' && action != 'save'){
				swal({title:`檔案未上傳`, text: '未上傳中文成績的文憑成績單或查詢網頁截圖。', confirmButtonText:'確定', type:'warning'});
				return;
			}
			if (weightedScoreA.match(scoreRegex) == null) {
				weightedScoreA = -1;
				$weightedChineseScoreInput.val('');
			}
        } else {
			scoreA = -1;
			weightedScoreA = -1;
		}

        if(englishChoosenRadioValue == 1){
            scoreB = $englishScoreInput.val();
            weightedScoreB = $weightedEnglishScoreInput.val();
			if (scoreB.match(scoreRegex) == null) { // 不符合上述的格式就回傳格式錯誤
				swal({title:`成績格式錯誤`, text: '未加權英文成績輸入有誤，未加權成績為必填，且成績需在350～1000區間。', confirmButtonText:'確定', type:'warning'});
				return;
			}
			if($englishScoreUploadedFileArea.innerHTML == '' && action != 'save'){
				swal({title:`檔案未上傳`, text: '未上傳英文成績的文憑成績單或查詢網頁截圖。', confirmButtonText:'確定', type:'warning'});
				return;
			}
			if (weightedScoreB.match(scoreRegex) == null) {
				weightedScoreB = -1;
				$weightedEnglishScoreInput.val('');
			}
        } else {
			scoreB = -1;
			weightedScoreB = -1;
		}

		if(mathChoosenRadioValue == 1){
            scoreC = $mathScoreInput.val();
            weightedScoreC = $weightedMathScoreInput.val();
			if (scoreC.match(scoreRegex) == null) { // 不符合上述的格式就回傳格式錯誤
				swal({title:`成績格式錯誤`, text: '未加權數學成績輸入有誤，未加權成績為必填，且成績需在350～1000區間。', confirmButtonText:'確定', type:'warning'});
				return;
			}
			if($mathScoreUploadedFileArea.innerHTML == '' && action != 'save'){
				swal({title:`檔案未上傳`, text: '未上傳數學成績的文憑成績單或查詢網頁截圖。', confirmButtonText:'確定', type:'warning'});
				return;
			}
			if (weightedScoreC.match(scoreRegex) == null) {
				weightedScoreC = -1;
				$weightedMathScoreInput.val('');
			}
        } else {
			scoreC = -1;
			weightedScoreC = -1;
		}

		if(additionalMathChoosenRadioValue == 1){
            scoreD = $additionalMathScoreInput.val();
            weightedScoreD = $weightedAdditionalMathScoreInput.val();
			if (scoreD.match(scoreRegex) == null) { // 不符合上述的格式就回傳格式錯誤
				swal({title:`成績格式錯誤`, text: '未加權數學（附加卷）成績輸入有誤，未加權成績為必填，且成績需在350～1000區間。', confirmButtonText:'確定', type:'warning'});
				return;
			}
			if($additionalMathScoreUploadedFileArea.innerHTML == '' && action != 'save'){
				swal({title:`檔案未上傳`, text: '未上傳數學（附加卷）成績的文憑成績單或查詢網頁截圖。', confirmButtonText:'確定', type:'warning'});
				return;
			}
			if (weightedScoreD.match(scoreRegex) == null) {
				weightedScoreD = -1;
				$weightedAdditionalMathScoreInput.val('');
			}
        } else {
			scoreD = -1;
			weightedScoreD = -1;
		}



        let sendData ={}
		sendData['IDNumber'] = IDNumber;
        sendData['scoreA'] = scoreA;
        sendData['weightedScoreA'] = weightedScoreA;
        sendData['scoreB'] = scoreB;
        sendData['weightedScoreB'] = weightedScoreB;
        sendData['scoreC'] = scoreC;
        sendData['weightedScoreC'] = weightedScoreC;
        sendData['scoreD'] = scoreD;
        sendData['weightedScoreD'] = weightedScoreD;
		sendData["action"] = (action == 'save') ?0 :1;

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
			if(action == 'save'){
				swal({title: `儲存成功`, type:"success", confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=>{
					window.location.reload();
				});
			} else {
				summarize_page();
			}
            loading.complete();
        })
        .catch((err) => {
            err.json && err.json().then((data) => {
                console.error(data);
                swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
            });
            loading.complete();
        })
    }

	// 切換頁面事件
    async function summarize_page(){
		let scoreHtml = '';
		let fileHtml = '';

		const getScoreResponse = await student.getMacauTranscriptScore({student_id: user_id});
		if (!getScoreResponse.ok) {
			throw getScoreResponse;
		}
		const macauTranscriptStatus = await getScoreResponse.json();
		const allScore = macauTranscriptStatus[0];
		const confirmedStatus = macauTranscriptStatus['confirmed_status'];
		let weightedScoreString = '';

		console.log(allScore);

		$confiremedID.html("報考「四校聯考」時所使用之身分證字號："+allScore.resident_id_for_exam);

		if (allScore.scoreA == '-1') {
			$confirmedChineseScore.html("中文：無此成績");
		}else {
			weightedScoreString = (allScore.weightedScoreA == '-1') ?'未填寫' :allScore.weightedScoreA+' 分';
			scoreHtml = `
				中文： 未加權 ${allScore.scoreA} 分 加權後 ${weightedScoreString} <small>(點此展開查看已上傳成績單檔單，點圖可放大)</small>
			`;
			$confirmedChineseScore.html(scoreHtml);
			const response = await student.getMacauTranscriptsetItem({student_id: user_id, subject: "01"});
			if (!response.ok) {
				throw response;
			}
			const fileNameOfSubject = await response.json();
			const fileName = fileNameOfSubject.files[0];
			const subject = '01';
			const fileType = _getFileType(fileName.split('.')[1]);
			let dummy_id = Math.floor(Math.random() * 1000000) + Math.floor(Math.random() * 1111111);
			const url = `${env.baseUrl}/students/${user_id}/macau-transcript/subject/${subject}/file/${fileName}?dummy_id=${dummy_id}`;

            if(fileType === 'img'){
                fileHtml = `
                    <img
                        class="img-thumbnail"
                        src="${url}"
                        data-toggle="modal"
						data-subject="${subject}"
                        data-filename="${fileName}"
						data-target=".img-modal"
                        data-filetype="img"
                        data-filelink="${url}"
                    />
                `;
            } else {
                fileHtml = `
					<div
						class="img-thumbnail non-img-file-thumbnail"
						data-toggle="modal"
						data-target=".img-modal"
						data-filelink="${url}"
						data-subject="${subject}"
						data-filename="${fileName}"
                        data-filetype="${fileType}"
						data-icon="fa-file-${fileType}-o"
					>
						<i class="fa fa-file-${fileType}-o" data-filename="${fileName}" data-icon="fa-file-${fileType}-o" aria-hidden="true"></i>
					</div>
				`;
            }
			$confirmedChineseUploadedFile.html(fileHtml);
		}

		if (allScore.scoreB == '-1') {
			$confirmedEnglishScore.html("英文：無此成績");
		} else {
			weightedScoreString = (allScore.weightedScoreB == '-1') ?'未填寫' :allScore.weightedScoreB+' 分';
			scoreHtml = `
				英文： 未加權 ${allScore.scoreB} 分 加權後 ${weightedScoreString} <small>(點此展開查看已上傳成績單檔單，點圖可放大)</small>
			`;
			$confirmedEnglishScore.html(scoreHtml);
			const response = await student.getMacauTranscriptsetItem({student_id: user_id, subject: "02"});
			if (!response.ok) {
				throw response;
			}
			const fileNameOfSubject = await response.json();
			const fileName = fileNameOfSubject.files[0];
			const subject = '01';
			const fileType = _getFileType(fileName.split('.')[1]);
			let dummy_id = Math.floor(Math.random() * 1000000) + Math.floor(Math.random() * 1111111);
			const url = `${env.baseUrl}/students/${user_id}/macau-transcript/subject/${subject}/file/${fileName}?dummy_id=${dummy_id}`;

            if(fileType === 'img'){
                fileHtml = `
                    <img
                        class="img-thumbnail"
                        src="${url}"
                        data-toggle="modal"
						data-subject="${subject}"
                        data-filename="${fileName}"
						data-target=".img-modal"
                        data-filetype="img"
                        data-filelink="${url}"
                    />
                `;
            } else {
                fileHtml = `
					<div
						class="img-thumbnail non-img-file-thumbnail"
						data-toggle="modal"
						data-target=".img-modal"
						data-filelink="${url}"
						data-subject="${subject}"
						data-filename="${fileName}"
                        data-filetype="${fileType}"
						data-icon="fa-file-${fileType}-o"
					>
						<i class="fa fa-file-${fileType}-o" data-filename="${fileName}" data-icon="fa-file-${fileType}-o" aria-hidden="true"></i>
					</div>
				`;
            }
			$confirmedEnglishUploadedFile.html(fileHtml);
		}

		if (allScore.scoreC == '-1') {
			$confirmedMathScore.html("數學：無此成績");
		}else {
			weightedScoreString = (allScore.weightedScoreC == '-1') ?'未填寫' :allScore.weightedScoreC+' 分';
			scoreHtml = `
				數學： 未加權 ${allScore.scoreC} 分 加權後 ${weightedScoreString} <small>(點此展開查看已上傳成績單檔單，點圖可放大)</small>
			`;
			$confirmedMathScore.html(scoreHtml);
			const response = await student.getMacauTranscriptsetItem({student_id: user_id, subject: "03"});
			if (!response.ok) {
				throw response;
			}
			const fileNameOfSubject = await response.json();
			const fileName = fileNameOfSubject.files[0];
			const subject = '01';
			const fileType = _getFileType(fileName.split('.')[1]);
			let dummy_id = Math.floor(Math.random() * 1000000) + Math.floor(Math.random() * 1111111);
			const url = `${env.baseUrl}/students/${user_id}/macau-transcript/subject/${subject}/file/${fileName}?dummy_id=${dummy_id}`;

            if(fileType === 'img'){
                fileHtml = `
                    <img
                        class="img-thumbnail"
                        src="${url}"
                        data-toggle="modal"
						data-subject="${subject}"
                        data-filename="${fileName}"
						data-target=".img-modal"
                        data-filetype="img"
                        data-filelink="${url}"
                    />
                `;
            } else {
                fileHtml = `
					<div
						class="img-thumbnail non-img-file-thumbnail"
						data-toggle="modal"
						data-target=".img-modal"
						data-filelink="${url}"
						data-subject="${subject}"
						data-filename="${fileName}"
                        data-filetype="${fileType}"
						data-icon="fa-file-${fileType}-o"
					>
						<i class="fa fa-file-${fileType}-o" data-filename="${fileName}" data-icon="fa-file-${fileType}-o" aria-hidden="true"></i>
					</div>
				`;
            }
			$confirmedMathUploadedFile.html(fileHtml);
		}

		if (allScore.scoreD == '-1') {
			$confirmedAdditionalMathScore.html("數學(附加卷)：無此成績");
		}else{
			weightedScoreString = (allScore.weightedScoreD == '-1') ?'未填寫' :allScore.weightedScoreD+' 分';
			scoreHtml = `
				數學(附加卷)： 未加權 ${allScore.scoreD} 分 加權後 ${weightedScoreString} <small>(點此展開查看已上傳成績單檔單，點圖可放大)</small>
			`;
			$confirmedAdditionalMathScore.html(scoreHtml);
			const response = await student.getMacauTranscriptsetItem({student_id: user_id, subject: "04"});
			if (!response.ok) {
				throw response;
			}
			const fileNameOfSubject = await response.json();
			const fileName = fileNameOfSubject.files[0];
			const subject = '01';
			const fileType = _getFileType(fileName.split('.')[1]);
			let dummy_id = Math.floor(Math.random() * 1000000) + Math.floor(Math.random() * 1111111);
			const url = `${env.baseUrl}/students/${user_id}/macau-transcript/subject/${subject}/file/${fileName}?dummy_id=${dummy_id}`;

            if(fileType === 'img'){
                fileHtml = `
                    <img
                        class="img-thumbnail"
                        src="${url}"
                        data-toggle="modal"
						data-subject="${subject}"
                        data-filename="${fileName}"
						data-target=".img-modal"
                        data-filetype="img"
                        data-filelink="${url}"
                    />
                `;
            } else {
                fileHtml = `
					<div
						class="img-thumbnail non-img-file-thumbnail"
						data-toggle="modal"
						data-target=".img-modal"
						data-filelink="${url}"
						data-subject="${subject}"
						data-filename="${fileName}"
                        data-filetype="${fileType}"
						data-icon="fa-file-${fileType}-o"
					>
						<i class="fa fa-file-${fileType}-o" data-filename="${fileName}" data-icon="fa-file-${fileType}-o" aria-hidden="true"></i>
					</div>
				`;
            }
			$confirmedAdditionalMathUploadedFile.html(fileHtml);
		}

		$deleteFileBtn.hide();
		$transcriptPage.hide();
		$confirmPage.show();
	}

	// 回到成績填寫頁面事件
	function _handleBack(){
		$deleteFileBtn.show();
		$transcriptPage.show();
		$confirmPage.hide();
	}

	// 確認是否鎖定
    function _handleConfirm(){
        swal({
            title: '確定要鎖定登錄的四校聯考成績與已上傳的檔案？',
            type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#5cb85c',
            cancelButtonColor: '#d9534f',
            confirmButtonText: '確定',
            cancelButtonText: '我還要再檢查一遍',
        }).then(()=>{
            _confirm();
        }).catch(()=>{
            return;
        });
    }

	// 鎖定事件
	async function _confirm(){
		let sendData = {};
		sendData["action"] = 2;

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
				// console.log(json);
				swal({title: `已鎖定`, type:"success", confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=>{
					loading.complete();
					window.location.reload();
				});
			})
			.catch((err) => {
				err.json && err.json().then((data) => {
					console.error(data);
					swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
				});
				loading.complete();
			})

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