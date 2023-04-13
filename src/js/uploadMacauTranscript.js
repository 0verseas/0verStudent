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
	const $transcriptPage = $('#transcript_page');
	const $confirmPage = $('#confirm_page');
	const $confiremedText = $('#confirmed_text');

    const $chineseScoreRadio = $('.radio-chineseScore');
    const $chineseScoreInputArea = $('.chineseScoreInputArea');
    const $chineseScoreUploadArea = $('#chineseScoreUploadArea');
    const $chineseScoreInput = $('#chineseScoreInput');
    const $weightedChineseScoreInput = $('#weightedChineseScoreInput');
	const $chineseScoreFileUploadButton = $('#chineseScoreFileUpload');
	const $chineseScoreUploadedFileArea = document.getElementById('chineseScoreUploadedFileArea');

    const $englishScoreRadio = $('.radio-englishScore');
    const $englishScoreInputArea = $('.englishScoreInputArea');
    const $englishScoreUploadArea = $('#englishScoreUploadArea');
    const $englishScoreInput = $('#englishScoreInput');
    const $weightedEnglishScoreInput = $('#weightedEnglishScoreInput');
	const $englishScoreFileUploadButton = $('#englishScoreFileUpload');
	const $englishScoreUploadedFileArea = document.getElementById('englishScoreUploadedFileArea');

	const $mathScoreRadio = $('.radio-mathScore');
    const $mathScoreInputArea = $('.mathScoreInputArea');
    const $mathScoreUploadArea = $('#mathScoreUploadArea');
    const $mathScoreInput = $('#mathScoreInput');
    const $weightedMathScoreInput = $('#weightedMathScoreInput');
	const $mathScoreFileUploadButton = $('#mathScoreFileUpload');
	const $mathScoreUploadedFileArea = document.getElementById('mathScoreUploadedFileArea');

	const $additionalMathScoreRadio = $('.radio-additionalMathScore');
    const $additionalMathScoreInputArea = $('.additionalMathScoreInputArea');
    const $additionalMathScoreUploadArea = $('#additionalMathScoreUploadArea');
    const $additionalMathScoreInput = $('#additionalMathScoreInput');
    const $weightedAdditionalMathScoreInput = $('#weightedAdditionalMathScoreInput');
	const $additionalMathScoreFileUploadButton = $('#additionalMathScoreFileUpload');
	const $additionalMathScoreUploadedFileArea = document.getElementById('additionalMathScoreUploadedFileArea');

	const $confirmedChineseScore = $('#confirmed_chinese_score');
	const $confirmedChineseUploadedFile = $('#confirmed_chinese_uploaded_file');
	const $confirmedEnglishScore = $('#confirmed_english_score');
	const $confirmedEnglishUploadedFile = $('#confirmed_english_uploaded_file');
	const $confirmedMathScore = $('#confirmed_math_score');
	const $confirmedMathUploadedFile = $('#confirmed_math_uploaded_file');
	const $confirmedAdditionalMathScore = $('#confirmed_additional_math_score');
	const $confirmedAdditionalMathUploadedFile = $('#confirmed_additional_math_uploaded_file');

	const $imgModal = $('#img-modal');
	const $imgModalBody= $('#img-modal-body');
	const $deleteFileBtn = $('.btn-delFile');
    const $saveBtn = $('#btn-save');
    const $goConfirmBtn = $('#btn-go-Confirm');
	const $backBtn = $('#btn-back');
	const $confirmBtn = $('#btn-confirm');

    /**
	*	bind event
	*/

    $chineseScoreRadio.on('change',_handleChineseScoreRadioChange);
    $chineseScoreInput.on('change', _validateScoreInput);
    $weightedChineseScoreInput.on('change', _validateScoreInput);
	$chineseScoreFileUploadButton.on('change', _handleUpload);

    $englishScoreRadio.on('change',_handleEnglishScoreRadioChange);
    $englishScoreInput.on('change', _validateScoreInput);
    $weightedEnglishScoreInput.on('change', _validateScoreInput);
	$englishScoreFileUploadButton.on('change', _handleUpload);

	$mathScoreRadio.on('change',_handleMathScoreRadioChange);
    $mathScoreInput.on('change', _validateScoreInput);
    $weightedMathScoreInput.on('change', _validateScoreInput);
	$mathScoreFileUploadButton.on('change', _handleUpload);

	$additionalMathScoreRadio.on('change',_handleAdditionalMathScoreRadioChange);
    $additionalMathScoreInput.on('change', _validateScoreInput);
    $weightedAdditionalMathScoreInput.on('change', _validateScoreInput);
	$additionalMathScoreFileUploadButton.on('change', _handleUpload);

    $saveBtn.on('click', _handleSave);
    $goConfirmBtn.on('click', _handleSave);

	$('body').on('click', '.img-thumbnail', _showUploadedFile);
	$deleteFileBtn.on('click',_handleDeleteFile);

	$backBtn.on('click',_handleBack);
	$confirmBtn.on('click', _handleConfirm);

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
			if(progressJson.student_misc_data.stage_of_deptid != null || progressJson.student_misc_data.stage_of_admit != null || progressJson.student_misc_data.distribution_date != null || progressJson.student_misc_data.distribution_no != null){
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
			}
			// 開始抓取學生上傳成績
			const getScoreResponse = await student.getMacauTranscriptScore({student_id: user_id});
			if (!getScoreResponse.ok) {
				throw getScoreResponse;
			}
			const macauTranscriptStatus = await getScoreResponse.json();
			const allScore = macauTranscriptStatus[0];
			const confirmedStatus = macauTranscriptStatus['confirmed_status'];
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

    function _validateScoreInput(){
		const scoreRegex = /^(3[5-9][0-9]|[4-9][0-9][0-9]|1[0][0][0])$/g;
        let score = $(this).val().replace(/[\s]/g, "");
		if (score.match(scoreRegex) == null) { // 不符合上述的格式就回傳格式錯誤
			$(this).val('')
		}

        return;
    }

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

    function _handleSave() {
		const action = $(this).data('action');
		const scoreRegex = /^(3[5-9][0-9]|[4-9][0-9][0-9]|1[0][0][0])$/g;
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

	function _handleBack(){
		$deleteFileBtn.show();
		$transcriptPage.show();
		$confirmPage.hide();
	}

	// 確認是否刪除上傳檔案
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