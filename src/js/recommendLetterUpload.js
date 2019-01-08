(() => {
    /**
     * init
     */
    _verify();

    /**
     *	private variable
     */

    let _hasWorks = false; // 項目中是否有作品集，有的話要儲存作品集文字

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




    async function _verify(){
        loading.complete();
        /*try {
            const email = _getParam('email', window.location.href);
            const token = _getParam('token', window.location.href);

            const response = await student.verifyEmail(email, token);
            if (!response.ok) { throw response; }

            $('#alert-valid').show();
            setTimeout(() => {
                location.href = './index.html';
            }, 3000);
            loading.complete();
        } catch (e) {
            e.json && e.json().then((data) => {
                console.error(data);

                if (e.status && e.status === 400) {
                    $('#alert-invalid').show();

                    setTimeout(() => {
                        location.href = './index.html';
                    }, 3000);
                } else {
                    alert(`${data.messages[0]}`);

                    setTimeout(() => {
                        location.href = './index.html';
                    }, 0);
                }

                loading.complete();
            });
        }*/
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
        const type_id = $(this).data('type');
        const dept_id = $(this).data('deptid');
        const fileList = this.files;
        let data = new FormData();
        for (let i = 0; i < fileList.length; i++) {
            //檢查檔案類型
            if(!checkFile(this)){
                //有不可接受的副檔名存在
                break;
            };
            data.append('files[]', fileList[i]);
            console.log(fileList[i]);
        }
        try {
            loading.start();
            const response = await student.setReviewItem({data, type_id, dept_id, student_id: _studentID});
            if (!response.ok) { throw response; }
            const responseJson = await response.json();

            const uploadFileItemIndex = _wishList[_orderIndex].uploaded_file_list.findIndex(i => i.type_id === (+responseJson.type_id ));
            wishList[_orderIndex].uploaded_file_list[uploadFileItemIndex].files = _wishList[_orderIndex].uploaded_file_list[uploadFileItemIndex].files.concat(responseJson.files);
            handleEditForm();
            loading.complete();
        } catch(e) {
            e.json && e.json().then((data) => {
                console.error(data);
                alert(`ERROR: \n${data.messages[0]}`);
            });
            loading.complete();
        }

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
        //TODO: 通知後端 delete token

        alert('儲存完成');
        $recommendationLetterUploadBtn.remove(); //remove upload button
        $recommendationLetterUpload.remove(); //remove recommend letter upload form page
        let html = '<div class="col-12" style="text-align:center;"><br/><h4>您已經上傳完成，可關閉此頁面。</h4></div>'; //按下按鈕後要顯示的內容
        document.getElementById("temp").innerHTML = html;
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
})();
