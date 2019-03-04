(() => {
    /**
     * init
     */
    _verify();

    /**
     * private variable
     */


    /**
     *	cache DOM
     */

    const $saveBtn = $('#btn-save');
    const $recommendationLetterUpload = $('#recommendation-letter-upload');
    const $recommendationLetterUploadBtn = $('#recommendation-letter-upload-btn');

    /**
     *	bind event
     */

    $('body').on('change.uploadfile', '.file-certificate', previewFile); //_handleUpload
    $saveBtn.on('click', _handleSave);

    /**
     * private method
     */




    // copy from emailVerify.js

    async function _verify(){
        try {
            const id = _getParam('id', window.location.href);
            //const email = _getParam('email', window.location.href); //teacher's email
            const token = _getParam('token', window.location.href);

            const response = await student.teacherVerify(id, token);
            if (!response.ok) { //http response status code
                throw response;
            }

            //驗證通過後執行剩下的code
            console.log('あのね (≧д≦) あのね');
            loading.complete();
        } catch (e) {
            e.json && e.json().then((data) => {
                console.error(data);

                alert(`${data.messages[0]}`);

                setTimeout(() => {
                    location.href = './index.html';
                }, 0);

                loading.complete();
            });
        }
    }

    function _getParam(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    async function previewFile(){
        const type_id = $(this).data('type'); //上傳文件種類
        const fileList = this.files;
        let data = new FormData();
        for (let i = 0; i < fileList.length; i++) {
            //檢查檔案類型
            if(!checkFile(this)){ //有不可接受的副檔名存在
                break;
            }
            data.append('files[]', fileList[i]);
            console.log(fileList[i]);
        }
        try {
            loading.start();
            //TODO: 等後端驗證

            const response = await student.setReviewItem({data, type_id: _workTypeId, dept_id: _deptID, student_id: _studentID});
            if (!response.ok) { throw response; }
            alert('儲存完成');
            loading.complete();
            window.location.reload();
        } catch(e) {
            e.json && e.json().then((data) => {
                console.error(data);
                alert(`ERROR: \n${data.messages[0]}`);
            });
            loading.complete();
        }
        //TODO: 修改參數及函數等等的
        let fileView = _getFileAreaHTML(fileListItem, fileListKey);  //preview the uploaded files
        document.getElementById("preview").innerHTML = fileView;
    }

    function _getFileAreaHTML(fileListItem, fileListKey) {
        let html = '';
        fileListItem[fileListKey].forEach((fileName, index) => {
            const fileType = _getFileType(fileName.split('.')[1]);
            if (fileType === 'img') {
                html += `<img
					class="img-thumbnail"
					src="${env.baseUrl}/students/${_studentID}/admission-selection-application-document/departments/${fileListItem.dept_id}/types/${fileListItem.type_id}/files/${fileName}"
					data-toggle="modal"
					data-target=".img-modal"
					data-type="${fileListItem.type_id}"
					data-filelink="${env.baseUrl}/students/${_studentID}/admission-selection-application-document/departments/${fileListItem.dept_id}/types/${fileListItem.type_id}/files/${fileName}"
					data-filename="${fileName}"
					data-filetype="img"
				/> `;
            } else {
                html += `
					<div
						class="img-thumbnail non-img-file-thumbnail"
						data-toggle="modal"
						data-target=".img-modal"
						data-type="${fileListItem.type_id}"
						data-filelink="${env.baseUrl}/students/${_studentID}/admission-selection-application-document/departments/${fileListItem.dept_id}/types/${fileListItem.type_id}/files/${fileName}"
						data-filename="${fileName}"
						data-filetype="${fileType}"
						data-icon="fa-file-${fileType}-o"
					>
						<i class="fa fa-file-${fileType}-o" aria-hidden="true"></i>
					</div>
				`;
            }
        });
        return html;
    }

    //按下『確認並上傳按鈕』
    async function _handleSave() {
        loading.start();
        //通知後端 delete/destroy token
        const id = _getParam('id', window.location.href);
        //const email = _getParam('email', window.location.href); //teacher's email
        const token = _getParam('token', window.location.href);
        student.teacherBye(id, token);
        // 如果跑太快看要不要讓它轉圈圈幾秒鐘製造上傳的假象
        // 點下按鈕&後端事情做完後
        alert('儲存完成');
        $recommendationLetterUploadBtn.remove(); //remove upload button
        $recommendationLetterUpload.remove(); //remove recommend letter upload form page
        let html = '<div class="col-12" style="text-align:center;"><br/><h4>您已上傳完成，可關閉此頁面。</h4></div>'; //按下按鈕後要顯示的內容
        document.getElementById("temp").innerHTML = html; //替換畫面上的內容
        loading.complete();
    }

    //檢查檔案類型
    function checkFile(selectfile){
        var extension = new Array(".jpg", ".png", ".pdf",".jpeg");// 可接受的附檔名
        var fileExtension = selectfile.value; //fakepath
        fileExtension = fileExtension.substring(fileExtension.lastIndexOf('.')); //看副檔名是否在可接受名單
        if (extension.indexOf(fileExtension) < 0) {
            alert("非可接受的檔案類型，可接受的副檔名有：" + extension.toString());
            selectfile.value = null;
            return false;
        } else {
            return true;
        }
    }

    //讓程式睡著用
    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
                break;
            }
        }
    }

})();
