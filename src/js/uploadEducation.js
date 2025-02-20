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
	const dateMap = {0:'2024 年 12 月 15 日（星期日）', 1:'2025 年 1 月 15 日（星期三）', 5:'2025 年 3 月 31 日（星期一）'}

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
			// 已被收件者就隱藏上傳與刪除按鈕
			// if(studentData.student_misc_data.verified_at !== null){
			// 	$deleteFileBtn.hide();
			// 	$('.btn-upload').hide();
			// }
			if(apply_way != null && apply_way!=1){
				const apply_way_data = studentData.student_misc_data.admission_placement_apply_way_data;
				$('.info-date').text(dateMap[apply_way_data.stage]);
				$('.for-admission_placement').show();
				$('.for-admission_placement').html(`
					您選填「聯合分發」志願校系，<br/>
					<ul>
						<li>
							<strong>若報名時已取得會考文憑成績</strong>，請直接前往本系統『登錄及上傳文憑成績』頁面完成該報名步驟。
						</li>
						<li>
						<strong>若報名時尚未取得會考文憑成績，<a class="text-danger">請於會考成績公布5個日曆天內</a></strong>，至本系統『登錄及上傳文憑成績』。<br/>
							※未於各梯次分發作業前完成會考成績上傳提交，則「聯合分發」資格不符，一律不予分發。
						</li>
					</ul>
				`);
			}
			if(studentData.student_misc_data.join_admission_selection == 1 ){
				$('.info-date').text(dateMap[0]);
				$('.deadline').html('您選填「個人申請」志願校系，<br/>'+$('.deadline').html());
				$('.selection-notice').show();
				$('.selection-notice').html(`
					<br/>
					並請於 2025 年 1 月 6 日（星期一）台灣時間下午 5 時前，完成步驟③
				`);
				$('.step-3').show();
				$('.step-3').html(`
					<strong>步驟③ 上傳校系備審資料</strong>：
					請於本系統『上傳備審資料』頁面上傳「個人申請」各志願校系指定審查項目，並按下『確認上傳資料並提交』按鍵。
					<br/>※若未在期限内完成步驟③，則「個人申請」資格不符，建議在確認資料無誤後提早完成上傳提交。
				`);
			} else if(apply_way != null && apply_way!=1){
				const apply_way_data = studentData.student_misc_data.admission_placement_apply_way_data;
				if(apply_way_data.stage == 1){
					$('.deadline').html('您報名「聯合分發」第一梯次，<br/>'+$('.deadline').html());
				} else {
					$('.deadline').html('您報名「聯合分發」第五梯次，<br/>'+$('.deadline').html());
				}
			}

			$('.link-pdf').text(`《馬來西亞地區簡章》`);
			$('.link-pdf').attr('href','https://cmn-hant.overseas.ncnu.edu.tw/wp-content/uploads/2024/10/01_114%E9%A6%AC%E4%BE%86%E8%A5%BF%E4%BA%9E.pdf');
			$('.link-pdf-cut').attr('href','https://drive.google.com/file/d/1wPWXMeUPvGVQbOq285bIJsUT5N4ktqji/view?usp=sharing');
			$('.transcript-info').text(`會考文憑（含成績單）或准考證（若有）`)

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
        await swal({title: `儲存成功`, html: `<strong style="color:red;">請於報名期限內完成紙本繳件</strong>`, type:"success", confirmButtonText: '確定', allowOutsideClick: false});
        await loading.complete();
		location.href = "./downloadDocs.html";
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
					<iframe src="${this.dataset.filelink}" width="550" height="800" type="application/pdf">
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
			cancelButtonColor: '#dc3454',
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