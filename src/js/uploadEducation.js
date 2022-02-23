(() => {
	/**
	*	cache DOM
	*/

	const $saveButton = $('.btn-save'); // 儲存按鈕 安慰用 檔案成功上傳其實就儲存了
	const $imgModal = $('#img-modal'); // 檔案編輯模板
	const $imgModalBody= $('#img-modal-body');// 檔案編輯模板顯示檔案區域
	const $deleteFileBtn = $('.btn-delFile');// 檔案編輯模板刪除按鈕
	let $uploadedFiles = [];// 已上傳檔案名稱陣列
	const $uploadTranscriptStringArray = ['統考','所持會考文憑'];
	const dateMap = {0:'2021年12月15日（星期三）', 1:'2022年1月15日（星期六）', 2:'2022年2月28日（星期一）', 5:'2022年3月31日（星期四）'}

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$saveButton.on('click', _handleSave); // 儲存按鈕事件
	$deleteFileBtn.on('click',_handleDeleteFile);// 刪除按鈕事件
    $('body').on('change.upload', '.file-upload', _handleUpload);// 上傳按鈕事件
	$('body').on('click', '.img-thumbnail', _showUploadedFile);// 點擊檔案呼叫編輯模板事件
	

	async function _init() {
		/* 可能需要按照梯次不同顯示不同的說明文字 */
		const registrationResponse = await student.getStudentRegistrationProgress();
		if(registrationResponse.ok){
			const studentData = await registrationResponse.json();
			const apply_way = studentData.student_misc_data.admission_placement_apply_way;
			const school_type = studentData.student_personal_data_detail.school_type;
			let stepHtml = '';
			if(apply_way != null && apply_way!=1){
				const apply_way_data = studentData.student_misc_data.admission_placement_apply_way_data;
				if(apply_way_data.stage != 2){
					let tempString = (apply_way_data.id == 24)?$uploadTranscriptStringArray[0]:$uploadTranscriptStringArray[1];
					let stageChineseChar = (apply_way_data.stage == 1)?'一':'五';
					stepHtml = `
						如因COVID-19疫情致報名時尚未取得文憑成績，請於
						<b class="text-danger">${tempString}成績公布後5個日曆天內</b>，
						至填報系統『登錄上傳文憑成績』頁面完成此報名步驟。
						<br/>（未於「聯合分發」第${stageChineseChar}梯次分發作業前完成上傳提交者，一律不予分發。）
					`;
				}
				$('.info-date').text(dateMap[apply_way_data.stage]);
			}
			if(studentData.student_misc_data.join_admission_selection == 1){
				$('.info-date').text(dateMap[0]);
				$('.step-4').show();
				$('.step-4').html(`
					<strong>步驟④ 上傳校系備審資料：</strong>至<b class="text-danger">2022年1月6日（星期四）臺灣時間下午5時</b>止，
					請於填報系統的『上傳備審資料』頁面上傳「個人申請」各志願校系指定的審查項目，並按下『確認上傳資料並提交』。
					<br/>（若未在期限内完成步驟④，則「個人申請」資格不符，建議在確認資料無誤後提早完成上傳提交。）
				`);
				if(stepHtml!=''){
					$('.step-5').show();
					$('.step-5').html(`<strong>步驟⑤ 登錄上傳文憑成績<b class="text-danger">（NEW）</b>：</strong>`+stepHtml);
				}
			} else if(studentData.can_admission_placement && stepHtml!=''){
				$('.step-4').show();
				$('.step-4').html(`<strong>步驟④ 登錄上傳文憑成績<b class="text-danger">（NEW）</b>：</strong>`+stepHtml);
			}
			if(school_type == '馬來西亞國際學校（International School）' && [83,88].indexOf(apply_way) == -1){
				$('.link-pdf').text(`《一般地區簡章》`);
				$('.link-pdf').attr('href','https://cmn-hant.overseas.ncnu.edu.tw/sites/default/files/inline-files/02_111%E4%B8%80%E8%88%AC%E5%85%8D%E8%A9%A6.pdf');
				$('.link-pdf-cut').attr('href','https://drive.google.com/file/d/1qBbFmeGlCVBiwIVcfO9_oUDkkgfKsvPL/view?usp=sharing');
				$('.transcript-info').text(`報名「聯合分發」所選『成績採計方式』相關文件（若有）`)
			} else {
				$('.link-pdf').text(`《馬來西亞地區簡章》`);
				$('.link-pdf').attr('href','https://cmn-hant.overseas.ncnu.edu.tw/sites/default/files/inline-files/01_111%E9%A6%AC%E4%BE%86%E8%A5%BF%E4%BA%9E.pdf');
				$('.link-pdf-cut').attr('href','https://drive.google.com/file/d/1wPWXMeUPvGVQbOq285bIJsUT5N4ktqji/view?usp=sharing');
				$('.transcript-info').text(`會考文憑（含成績單）或准考證（若有）`)
			}
		} else {
			const data = await registrationResponse.json();
			const message = data.messages[0];
			await swal({
				title: `ERROR！`,
				html:`${message}`,
				type:"error",
				confirmButtonText: '確定',
				allowOutsideClick: false
			});
		}

		const response = await student.getEducationFile();
		if(response.ok){
			const data = await response.json();
			for (const [type] of Object.entries(data)) {
				// 先取得各類型的以上傳檔案名稱陣列
				$uploadedFiles = data[type];
				// 有檔案才渲染
				if($uploadedFiles.length > 0){
					await _renderUploadedArea(type);
				}
			}
		} else {
			const data = await response.json();
			const message = data.messages[0];
			await swal({
				title: `ERROR！`,
				html:`${message}`,
				type:"error",
				confirmButtonText: '確定',
				allowOutsideClick: false
			});
		}
		await loading.complete();
	}

	// 儲存事件
    async function _handleSave(){
        await loading.start();
        await swal({title: `儲存成功`, type:"success", confirmButtonText: '確定', allowOutsideClick: false});
        await loading.complete();
        await location.reload();
    }

	// 上傳事件
    async function _handleUpload(){
		// 先取得要上傳的檔案類型
        const type = $(this).data('type');
		// 取得學生欲上傳的檔案
		const fileList = this.files;

		// 沒有上傳檔案 直接return
		if(fileList.length <= 0){
			return;
		}

		// 檢查檔案大小 不超過4MB 在放進senData中
		let sendData = new FormData();
		sendData.set('fileType', type);
		for (let i = 0; i < fileList.length; i++) {
			//有不可接受的副檔名存在
			if(! await checkFile(fileList[i])){
                return ;
            }
			if(await student.sizeConversion(fileList[i].size,4)){
				await swal({
					title: `上傳失敗！`,
					html:`${fileList[i].name}檔案過大，檔案大小不能超過4MB。`,
					type:"error",
					confirmButtonText: '確定',
					allowOutsideClick: false
				});
				return;
			}
			await sendData.append('files[]', fileList[i]);
		}

		await loading.start();
		// 將檔案傳送到後端
		const response = await student.uploadEducationFile(sendData);
		if(response.ok){
			await swal({
				title: `上傳成功！`,
				type:"success",
				confirmButtonText: '確定',
				allowOutsideClick: false
			});
			// 後端會回傳上傳後該類型的已上傳檔案名稱陣列
			const data = await response.json();
			$uploadedFiles = data;
			// 重新渲染已上傳檔案區域
			await _renderUploadedArea(type);
		} else {
			const code = response.status;
			const data = await response.json();
			const message = data.messages[0];
			await swal({
				title: `上傳失敗！`,
				html:`${message}`,
				type:"error",
				confirmButtonText: '確定',
				allowOutsideClick: false
			});
		}

		await loading.complete();
		return;
    }

	// 渲染已上傳檔案區域事件
	function _renderUploadedArea(type){
		let uploadedAreaHtml = '';
		const $uploadedFileArea = document.getElementById(`${type}-uploaded-files`)
        $uploadedFiles.forEach((file) => {
            const fileType = _getFileType(file.split('.')[1]);
            if(fileType === 'img'){
                uploadedAreaHtml += `
                    <img
                        class="img-thumbnail"
                        src="${env.baseUrl}/students/upload-education/${type}-${file}"
                        data-toggle="modal"
                        data-filename="${file}"
						data-target=".img-modal"
						data-type="${type}"
                        data-filetype="img"
                        data-filelink="${env.baseUrl}/students/upload-education/${type}-${file}"
                    />
                `
            } else {
                uploadedAreaHtml += `
					<div
						class="img-thumbnail non-img-file-thumbnail"
						data-toggle="modal"
						data-target=".img-modal"
						data-filelink="${env.baseUrl}/students/upload-education/${type}-${file}"
						data-filename="${file}"
						data-type="${type}"
                        data-filetype="${fileType}"
						data-icon="fa-file-${fileType}-o"
					>
						<i class="fa fa-file-${fileType}-o" data-filename="${file}" data-icon="fa-file-${fileType}-o" aria-hidden="true"></i>
					</div>
				`;
            }
        })
        $uploadedFileArea.innerHTML = uploadedAreaHtml;
	}

		// 顯示檔案 modal
	function _showUploadedFile() {
        // 取得點選的檔案名稱及類別
		const type = $(this).data('type');
		const fileName = $(this).data('filename');
		const fileType = $(this).data('filetype');

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
			'type': type,
			'filetype': fileType,
			'filename': fileName,
		});
	}

	// 確認是否刪除上傳檔案
    function _handleDeleteFile(){
        const fileName = $deleteFileBtn.attr('filename');
		const type = $deleteFileBtn.attr('type');
        swal({
            title: '確要定刪除已上傳的檔案？',
            type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#5cb85c',
			cancelButtonColor: '#d33',
			confirmButtonText: '確定',
			cancelButtonText: '取消',
			buttonsStyling: true
        }).then(()=>{
            _deleteFile(type, fileName);
        }).catch(()=>{
            return;
        });
    }

	async function _deleteFile(type, fileName){
		await loading.start();

		const response = await student.deleteEducationFile(type, fileName);

		if(response.ok){
			await swal({
				title: `刪除成功！`,
				type:"success",
				confirmButtonText: '確定',
				allowOutsideClick: false
			});
			const data = await response.json();
			$uploadedFiles = data;
			await $imgModal.modal('hide');
			await _renderUploadedArea(type);
		} else {
			const code = response.status;
			const data = await response.json();
			const message = data.messages[0];
			await swal({
				title: `刪除失敗！`,
				html:`${message}`,
				type:"error",
				confirmButtonText: '確定',
				allowOutsideClick: false
			});
		}

		await loading.complete();
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

	//檢查檔案類型
    function checkFile(selectfile){
        var extension = new Array(".jpg", ".png", ".pdf",".jpeg"); //可接受的附檔名
        var fileExtension = selectfile.name; //fakepath
        //看副檔名是否在可接受名單
        fileExtension = fileExtension.substring(fileExtension.lastIndexOf('.')).toLowerCase();  // 副檔名通通轉小寫
        if (extension.indexOf(fileExtension) < 0) {
			swal({
				title: `上傳失敗`,
				html:`${fileExtension} 非可接受的檔案類型副檔名。`,
				type:"error",
				confirmButtonText: '確定',
				allowOutsideClick: false
			});
            selectfile.value = null;
            return false;
        } else {
            return true;
        }
    }

})();