(()=>{
    /**
     *	cache DOM
     */

    const $paginationContainer = $('#pagination-container'); // 分頁器區域
    const $transcriptList = $('#transcript-list');
    const $transcriptModal = $('#editTranscriptModal');
    const $diploma = $transcriptModal.find('#diploma');
    const $year = $transcriptModal.find('#year');
    const $uploadedFileArea = document.getElementById('uploadedFileArea');
    const $imgModal = $('#img-modal');
    const $imgModalBody= $('#img-modal-body');
    const $newBtn = $('#btn-transcript-new');
    const $saveBtn = $('#btn-transcript-save');
    const $deleteBtn = $('#btn-transcript-delete');
    const $uploadBtn = $('#file-upload');
    const $deleteFileBtn = $('.btn-delFile');

    // 文憑中文名稱陣列 方便 文憑代碼轉換
    const diploma_array = ['','獨中統考','STPM','A Level','SPM','O Level']
    // 不同文憑需要隱藏不同的成績欄位
    const $diplomaHideArray = {
        0: [],
        1: ['SATChineseForm','TOCFLChineseForm','MUETForm'],
        2: ['MUETForm']
    }
    // 不同類組需要隱藏不同的成績欄位
    const $gruopHideArray = {
        1: ['advancedMath1Form','advancedMath2Form','biologyForm','physicsForm','chemistryForm','basicCircuitTheoryForm','principleElectronicsForm','fundamentalsOfElectricalEngineeringForm','digitalLogicForm'],
        2: ['mathForm','advancedMathForm','historyForm','geographyForm','bookkeepingForm','businessForm','accountingForm','economicsForm','introductionToBusineseForm','artForm','artDesignForm','artDesignPracticalForm']
    }
    // 需要暫存之變數 學生的類組 學生的文憑列表 學生單一文憑的所有已上傳檔案名稱
    let $studentGruop = 0;
    let $transcriptAllList = [];
    let $uploadedFiles = [];
    
    /**
     * init
     */

    init();

    /**
     *	bind event
     */

    $newBtn.on('click',_handleNew);
    $saveBtn.on('click',_handleSave);
    $deleteBtn.on('click',_handleDeleteTranscriptData);
    $deleteFileBtn.on('click',_handleDeleteFile);
    $uploadBtn.on('change',_handleUploadTranscriptFile);
    $('body').on('click', '.img-thumbnail', _showUploadedFile);
    // 如果關閉已上傳檔案modal 依舊保持focus在文憑成績編輯modal上
    $imgModal.on('hidden.bs.modal', function(e){
        $('body').addClass('modal-open');
    });

    // 初始化事件
    function init(){
        student.getMalaysiaTranscriptList()
        .then(function (res) {
            if (res.ok) {
                // loading.start();
                return res.json();
            } else {
                throw res;
            }
        }).then(function (json) {
            // console.log(json);
            // 將回傳的資料拆解儲存
            $transcriptAllList = json[0].student_malaysia_transcript;
            $studentGruop = (json[0].student_department_admission_placement_order[0].department_data.group_code == 1) ?1 :2;

            // 進行文憑列表分頁初始化渲染工作
            $paginationContainer.pagination({
                dataSource: $transcriptAllList,
                pageSize: 10,
                callback: function($transcriptAllList, pagination) {
                    _transcripttListTamplate($transcriptAllList,pagination.pageNumber);
                    const $editTranscriptInfoBtn = $('.btn-editTranscriptInfo'); // 新增學生資料編輯按鈕的觸發事件（開啟 Modal）
                    $editTranscriptInfoBtn.on('click', _handleEditModalShow);
                }
            });
        }).then(function () {
            // 設定時間選擇器 只能選年份 並最大值是當前年度
            $('#exam-year').datepicker({
                minViewMode: 2,
                format: 'yyyy',
                endDate: new Date()
            });
            // 設定顯示的成績欄位 不同類組 看到的不一樣
            $gruopHideArray[$studentGruop].forEach((value) => {
                $('#'+value).hide();
            });
            loading.complete();
        }).catch(function (err) {
            loading.complete();
            if (err.status == 401) {
                swal({title: "請重新登入", type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                window.location.href = './index.html';
            } else {
                err.json && err.json().then((data) => {
                    console.error(data);
                    swal({title: "即將返回上一頁", text: `ERROR：${data.messages[0]}`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false})
                    .then(()=>{
                        window.history.back();
                    });
                })
            }
        });
    }

    // 文憑列表儲存
    function _transcripttListTamplate(datas,page){
        // 渲染 文憑列表
        $transcriptList.html('');
        datas.forEach(function (data, index) {
            let diploma_name = diploma_array[data.diploma];
            let listHtml = `<tr class="btn-editTranscriptInfo" data-diploma="${data.diploma}" data-year="${data.exam_year}">`;
            listHtml += `<td>${index+1+((page-1)*10)}</td>`;
            listHtml += `<td>${(diploma_name)}</td>`;
            listHtml += `<td>${(data.exam_year)}</td>`;
            listHtml += `<td></td><td></td></tr>`;
            $transcriptList.append(listHtml);
        });
    }

    // 處理編輯文憑成績資料模板
    function _handleEditModalShow(){
        // show modal
        $transcriptModal.modal();
        // 取得 點選的文憑類別及年度
        const diploma_code = $(this).data('diploma');
        const exam_year = $(this).data('year');
        // 渲染點選的文憑類別及年度至編輯模板
        $diploma.val(diploma_array[diploma_code]);
        $year.val(exam_year);
        // 呼叫渲染文憑成績資料事件
        _setTranscriptScoreData(diploma_code, exam_year);
    }

    // 渲染文憑成績資料
    function _setTranscriptScoreData(diploma_code, exam_year){
        loading.start();
        let $studentDiplomaHideCode = 0;
        student.getMalaysiaTranscriptInfo({'code':diploma_code+'-'+exam_year})
        .then(function (res) {
            if (res.ok) {
                return res.json();
            } else {
                throw res;
            }
        }).then(function (json) {
            // console.log(json);

            let transcriptInfo = json[0];
            // diploma 1:獨中統考 2%3:STPM or Alevel 4%5:SPM or Olevel
            // 1 4 5 都有需要隱藏的部份
            if(transcriptInfo.diploma == 1){
                $studentDiplomaHideCode = 1
            } else if(transcriptInfo.diploma>3){
                $studentDiplomaHideCode = 2
            }
            // 更新已上傳檔案名稱陣列
            $uploadedFiles = json[0].filenames;
            // 呼叫渲染已上傳檔案事件
            _renderUploadedArea(diploma_code+'-'+exam_year);
            // 成績input欄位 初始化
            $('#SATChineseForm').show();
            $('#TOCFLChineseForm').show();
            $('#MUETForm').show();
            // 成績input欄位 渲染後端回傳的資料
            $('#chinese').val(transcriptInfo.chinese);
            $('#english').val(transcriptInfo.english);
            $('#math').val(transcriptInfo.math);
            $('#advancedMath').val(transcriptInfo.advanced_math);
            $('#advancedMath1').val(transcriptInfo.advanced_math_1);
            $('#advancedMath2').val(transcriptInfo.advanced_math_2);
            $('#history').val(transcriptInfo.history);
            $('#geography').val(transcriptInfo.geography);
            $('#bookkeeping').val(transcriptInfo.bookkeeping);
            $('#business').val(transcriptInfo.business);
            $('#accounting').val(transcriptInfo.accounting);
            $('#economics').val(transcriptInfo.economics);
            $('#introductionToBusinese').val(transcriptInfo.introduction_to_businese);
            $('#art').val(transcriptInfo.art);
            $('#artDesign').val(transcriptInfo.art_design);
            $('#artDesignPractical').val(transcriptInfo.art_design_practical);
            $('#biology').val(transcriptInfo.biology);
            $('#physics').val(transcriptInfo.physics);
            $('#chemistry').val(transcriptInfo.chemistry);
            $('#basicCircuitTheory').val(transcriptInfo.basic_circuit_theory);
            $('#principleElectronics').val(transcriptInfo.principle_electronics);
            $('#fundamentalsOfElectricalEngineering').val(transcriptInfo.fundamentals_of_electrical_engineering);
            $('#digitalLogic').val(transcriptInfo.digital_logic);
            $('#SATChinese').val(transcriptInfo.SAT_chinese);
            $('#TOCFLChinese').val(transcriptInfo.TOCFL_chinese);
            $('#MUET').val(transcriptInfo.MUET);
        }).then(function () {
            // 設定顯示的成績欄位 不同文憑 看到的不一樣
            $diplomaHideArray[$studentDiplomaHideCode].forEach((value) => {
                $('#'+value).hide();
            });
            loading.complete();
        }).catch(function (err) {
            loading.complete();
            if (err.status && err.status === 401) {
                swal({title: "請重新登入", type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                location.href = "./index.html";
            } else {
                err.json && err.json().then((data) => {
                    console.error(data);
                    swal({title: `Error: ${data.messages[0]}`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                })
            }
        });
    }
    // 新增文憑事件
    function _handleNew(){
        // 取得 選取的文憑類別及年度
        const diploma_code = $('#diploma-selector option:selected').val();
        const exam_year = $('#exam-year').val();

        // 沒有選擇文憑類別或考試年度就跳出提醒
        if(diploma_code == 0 || exam_year == ''){
            swal({title:"請先選擇文憑類別及考試年度", type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
        } else{
            // 確認選擇的文憑類別及考試年度是否在列表上
            let is_new = true;
            $transcriptAllList.forEach((value) => {
                if(value.diploma == diploma_code && value.exam_year == exam_year){
                    is_new = false;
                }
            });

            // 選擇的文憑類別及考試年度若已經在列表上 就直接開啟編輯模板
            if(!is_new){
                $diploma.val(diploma_array[diploma_code]);
                $year.val(exam_year);
                $deleteBtn.show();
                _setTranscriptScoreData(diploma_code,exam_year);
                $transcriptModal.modal('show');
            } else {
                // 選擇的文憑類別及考試年度若不在列表上 就新增
                // 準備好要傳遞的資料
                const data = {
                    'diploma': diploma_code,
                    'exam_year': exam_year,
                    'chinese': null,
                    'english': null,
                    'math': null,
                    'advancedMath': null,
                    'advancedMath1': null,
                    'advancedMath2': null,
                    'history': null,
                    'geography': null,
                    'bookkeeping': null,
                    'business': null,
                    'accounting': null,
                    'economics': null,
                    'introductionToBusinese': null,
                    'art': null,
                    'artDesign': null,
                    'artDesignPractical': null,
                    'biology': null,
                    'physics': null,
                    'chemistry': null,
                    'basicCircuitTheory': null,
                    'principleElectronics': null,
                    'fundamentalsOfElectricalEngineering': null,
                    'digitalLogic': null,
                    'SATChinese': null,
                    'TOCFLChinese': null,
                    'MUET': null
                };

                // 使用者確認
                swal({
                    title: '確認是否要新增文憑成績',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: '確認',
                    cancelButtonText: '取消'
                }).then(()=>{
                    // 呼叫儲存事件將資料傳送到後端
                    _saveEvent(data, true);
                }).catch(()=>{
                });
            }
        }
    }

    // 文憑成績儲存事件
    function _handleSave(){
        // 取得目前的文憑類別及年度
        const diploma = diploma_array.indexOf($diploma.val());
        const exam_year = $year.val();
        // 準備好要傳遞的資料
        const data = {
            'diploma': diploma,
            'exam_year': exam_year,
            'chinese': $('#chinese').val(),
            'english': $('#english').val(),
            'math': $('#math').val(),
            'advancedMath': $('#advancedMath').val(),
            'advancedMath1': $('#advancedMath1').val(),
            'advancedMath2': $('#advancedMath2').val(),
            'history': $('#history').val(),
            'geography': $('#geography').val(),
            'bookkeeping': $('#bookkeeping').val(),
            'business': $('#business').val(),
            'accounting': $('#accounting').val(),
            'economics': $('#economics').val(),
            'introductionToBusinese': $('#introductionToBusinese').val(),
            'art': $('#art').val(),
            'artDesign': $('#artDesign').val(),
            'artDesignPractical': $('#artDesignPractical').val(),
            'biology': $('#biology').val(),
            'physics': $('#physics').val(),
            'chemistry': $('#chemistry').val(),
            'basicCircuitTheory': $('#basicCircuitTheory').val(),
            'principleElectronics': $('#principleElectronics').val(),
            'fundamentalsOfElectricalEngineering': $('#fundamentalsOfElectricalEngineering').val(),
            'digitalLogic': $('#digitalLogic').val(),
            'SATChinese': $('#SATChinese').val(),
            'TOCFLChinese': $('#TOCFLChinese').val(),
            'MUET': $('#MUET').val()
        };
        
        // 使用者確認
        swal({
            title: '確認是否要儲存文憑成績',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: '儲存',
            cancelButtonText: '取消'
        }).then(()=>{
            // 呼叫儲存事件將資料傳送到後端
            _saveEvent(data);
        }).catch(()=>{
        });
    }

    // 發送欲儲存文憑成績資料跟請求到後端 flag true: 新增事件沒有開取編輯模板需要reload重新渲染文憑列表
    function _saveEvent(data , flag = false){
        loading.start();
        student.saveMalaysiaTranscriptInfo(data)
        .then((res) => {
            if(res.ok){
                loading.complete();
                swal({title:"儲存成功", type:"success", confirmButtonText: '確定', allowOutsideClick: false})
                .then(()=>{
                    if(flag){
                        location.reload();
                    }
                });
                return ;    
            } else {
                throw res;
            }
        })
        .catch((err) => {
            loading.complete();
            err.json && err.json().then((json) => {
                swal({title:"儲存失敗",text: json.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
            })
        })
    }

    // 刪除文憑確認事件
    function _handleDeleteTranscriptData(){
        swal({
            title: '確要定刪除此文憑資料？',
            type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: '確定',
			cancelButtonText: '取消',
			confirmButtonClass: 'btn btn-success',
			cancelButtonClass: 'btn btn-danger',
			buttonsStyling: false
        })
        .then(()=>{
            // 呼叫刪除事件將目前開啟的文憑刪除
            _deleteTranscriptData()
        })
        .catch(()=>{
            return ;
        })
    }

    // 刪除文憑資料（會一起刪除所有已上傳檔案）
    function _deleteTranscriptData(){
        loading.start();
        // 取得目前的文憑類別及年度
        const diploma_code = diploma_array.indexOf($diploma.val());
        const exam_year = $year.val();
        // 傳送文憑類別+年度的代號到後端進行刪除
        student.deleteMalaysiaTranscript({'code':diploma_code+'-'+exam_year})
        .then((res) => {
            if(res.ok){
                loading.complete();
                swal({title:"刪除成功", type:"success", confirmButtonText: '確定', allowOutsideClick: false})
                .then(()=>{
                    location.reload();
                });
                return ;    
            } else {
                throw res;
            }
        })
        .catch((err) => {
            loading.complete();
            err.json && err.json().then((json) => {
                swal({title:"刪除失敗",text: json.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
            })
        })
    }

    // 上傳檔案事件
    function _handleUploadTranscriptFile() {
        // 可以一次上傳多個檔案 所以先取得遇上傳檔案清單
		const fileList = this.files;
        // 將檔案放到 FormData class中 方便後續request傳送檔案
		let sendData = new FormData();
		for (let i = 0; i < fileList.length; i++) {
			sendData.append('files[]', fileList[i]);
		}
        // 宣告並紀錄文憑類別+年度的代號
        const code = diploma_array.indexOf($diploma.val())+'-'+$year.val();
		loading.start();
        // 將要上傳的檔案清單傳送到後端
		student.updateMalaysiaTranscriptFile({'code':code}, sendData)
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
            // console.log(json);
            // 更新已上傳檔案名稱陣列
            $uploadedFiles = json;
		})
		.then(() => {
            // 重新渲染已上傳檔案區域
			_renderUploadedArea(code);
			loading.complete();
		})
		.catch((err) => {
			if (err.status && err.status === 401) {
                swal({title:"請登入。", type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
				location.href = "./index.html";
			} else if (err.status && err.status === 400) {
                swal({title:"檔案格式不符", type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
			}
			err.json && err.json().then((data) => {
				console.error(data.messages[0]);
                swal({title:data.messages[0], type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
			})
			loading.complete();
		})
	}

    // 渲染已上傳檔案
    function _renderUploadedArea(code) {
        let uploadedAreaHtml = '';
        $uploadedFiles.forEach((file) => {
            const fileType = _getFileType(file.split('.')[1]);
            if(fileType === 'img'){
                uploadedAreaHtml += `
                    <img
                        class="img-thumbnail"
                        src="${env.baseUrl}/students/malaysia-transcript/${code}/${file}"
                        data-toggle="modal"
                        data-filename="${file}"
						data-target=".img-modal"
                        data-filetype="img"
                        data-filelink="${env.baseUrl}/students/malaysia-transcript/${code}/${file}"
                    />
                `
            } else {
                uploadedAreaHtml += `
					<div
						class="img-thumbnail non-img-file-thumbnail"
						data-toggle="modal"
						data-target=".img-modal"
						data-filelink="${env.baseUrl}/students/malaysia-transcript/${code}/${file}"
						data-filename="${file}"
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

    // 顯示檔案 modal
	function _showUploadedFile() {
        // 取得點選的檔案名稱及類別
		const fileName = $(this).data('filename');
		const fileType = $(this).data('filetype');

		// 清空 modal 內容
		$imgModalBody.html('');

		// 是圖放圖，非圖放 icon
		if (fileType === 'img') {
			const src = this.src;

			$imgModalBody.html(`
				<img
					src="${src}"
					class="img-fluid rounded img-ori"
				>
			`);
		} else {
			const icon = this.dataset.icon;
			const fileLink = this.dataset.filelink;

			$imgModalBody.html(`
				<div>
					<i class="fa ${icon} non-img-file-ori" aria-hidden="true"></i>
				</div>

				<a class="btn btn-primary non-img-file-download" href="${fileLink}" target="_blank" >
					<i class="fa fa-download" aria-hidden="true"></i> 下載
				</a>
			`);
		}
        // 刪除檔案按鈕紀錄點選的檔案名稱及類別
		$deleteFileBtn.attr({
			'filetype': fileType,
			'filename': fileName,
		});
	}

    // 確認是否刪除上傳檔案
    function _handleDeleteFile(){
        let fileName = $deleteFileBtn.attr('filename');
        swal({
            title: '確要定刪除已傳的檔案？',
            type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: '確定',
			cancelButtonText: '取消',
			confirmButtonClass: 'btn btn-success',
			cancelButtonClass: 'btn btn-danger',
			buttonsStyling: false
        }).then(()=>{
            _deleteTranscriptFile(fileName);
        }).catch(()=>{
            return;
        });
    }

    // 刪除上傳檔案事件
    function _deleteTranscriptFile(fileName){
        // 宣告並紀錄文憑類別+年度的代號
        const code = diploma_array.indexOf($diploma.val())+'-'+$year.val();
        // 將要刪除的檔案名稱及文憑代號傳送到後端
		student.deleteMalaysiaTranscriptFile({'code':code}, fileName)
        .then((res) => {
			if (res.ok) {
                return res.json();
			} else {
				throw res;
			}
		})
        .then((json)=>{
            // 更新已上傳檔案名稱陣列
            $uploadedFiles = json;
        })
        .then(()=>{
            // 重新渲染已上傳檔案區域
            _renderUploadedArea(code);
            // 關閉已上傳檔案模板
            $imgModal.modal('hide');
            swal({title:"刪除成功！", type:"success", confirmButtonText: '確定', allowOutsideClick: false});
        })
		.catch((err) => {
			err.json && err.json().then((data) => {
				console.error(data.messages[0]);
                swal({title:data.messages[0], type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
			})
		});
    }
})();