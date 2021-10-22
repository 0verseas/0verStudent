(() => {

    /**
     * private variable & constant
     */

    const _id = dropZero(_getParam('id', window.location.href)); //student_id
    const _email = _getParam('email', window.location.href); //teacher's email
    const _token = _getParam('token', window.location.href);
    let _dept_id;
    let _system_id;
    let count = 0; //已上傳的檔案數
    let sid; // 後端傳送回來的報名序號
    let _type_id;
    let uploaded_files = [];

    /**
     * init
     */

    _verify();

    /**
     *	cache DOM
     */

    const $saveBtn = $('#btn-save');
    const $recommendationLetterUpload = $('#recommendation-letter-upload');
    const $recommendationLetterUploadBtn = $('#recommendation-letter-upload-btn');
    const $imgModalBody= $('#img-modal-body'); //  modal 本體

    /**
     *	bind event
     */

    $('body').on('change.uploadfile', '.file-certificate', previewFile); //_handleUpload
    $saveBtn.on('click', _handleSave);
    $('body').on('click.showOriImg', '.img-thumbnail', _showOriImg);
    $('.btn-delImg').on('click', _handleDelImg);

    /**
     * private method
     */




    // copy from emailVerify.js

    async function _verify(){
        try {
            // 身份驗證（透過 token）
            const response = await student.teacherVerify(_id, _token);
            if (!response.ok) { //http response status code
                throw response;
            }
            const tokenJson = await response.json();
            _system_id = tokenJson.system_id;
            _dept_id = tokenJson.dept_id;
            console.log('あのね (≧д≦) あのね');
            const sid = paddingLeft(tokenJson.sid, 6);  // 後端送回來的報名序號，驗證資料正確性使用
            const stu_name = tokenJson.s_name;  // 後端依據網址的報名序號抓出使用者姓名，驗證資料用
            const stu_eng_name = tokenJson.eng_s_name;  // 學生英文姓名
            const dept_title = tokenJson.dept_title;  // 系所名稱
            const school_title = tokenJson.school_title;  // 學校名稱
            const dept_eng_title = tokenJson.dept_eng_title;
            const school_eng_title = tokenJson.school_eng_title;
            const dept_code = tokenJson.dept_code;  // card_code of department
            document.getElementById("sid").innerHTML = sid;
            document.getElementById("eng-sid").innerHTML = sid;
            document.getElementById("stu-name").innerHTML = encodeHTML(stu_name);
            document.getElementById("eng-stu-name").innerHTML = encodeHTML(stu_eng_name);
            document.getElementById("admission-school").innerHTML = school_title;
            document.getElementById("eng-admission-school").innerHTML = school_eng_title;
            document.getElementById("admission-department").innerHTML = dept_title;
            document.getElementById("eng-admission-department").innerHTML = dept_eng_title;
            document.getElementById("dept-code").innerHTML = dept_code;
            document.getElementById("eng-dept-code").innerHTML = dept_code;

            //前端顯示已經上傳幾個檔案
            const fileResponse = await student.getTeacherSetReviewItem(_id, _dept_id, _token);
            if(!fileResponse.ok){
                throw fileResponse;
            }
            const numJson = await fileResponse.json();
            count = numJson.count;
            _type_id = numJson.type_id;
            document.getElementById("file-count").innerHTML = count;
            document.getElementById("eng-file-count").innerHTML = count;
            document.getElementById("file-view").innerHTML = _getFileAreaHTML(fileNameObjectToArray(numJson.filename));
            loading.complete();
        } catch (e) {
            e.json && e.json().then((data) => {
                console.error(data);

                alert(`${data.messages[0]}`);

                // 分類帽會依情況決定使用者去什麼地方
                if (e.status !== 423){
                    setTimeout(() => {
                        location.replace('https://cmn-hant.overseas.ncnu.edu.tw/');
                    }, 0);
                } else {
                    // 上傳過了就去只能看不能摸的頁面
                    setTimeout(() => {
                        location.replace('./recommendLetterReader.html?id=' + _id + '&email=' + _email + '&token=' + _token);
                    }, 0);
                }

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

    // 上傳檔案
    async function previewFile(){
        const type_id = $(this).data('type'); //上傳文件種類
        const fileList = this.files;
        let data = new FormData();
        for (let i = 0; i < fileList.length; i++) {
            //檢查檔案類型
            if(!checkFile(this)){ //有不可接受的副檔名存在
                return ;
            }
            //偵測是否超過4MB
            if(student.sizeConversion(fileList[i].size,4)){
                alert(fileList[i].name+' 檔案過大，大小不能超過4MB！')
                $(this).val('');//清除檔案路徑
                return;
            }	
            data.append('files[]', fileList[i]);
            // console.log(fileList[i]);
        }

        try {
            loading.start();
            const response = await student.teacherSetReviewItem({data, token: _token, dept_id: _dept_id, student_id: _id});
            if (!response.ok) {
                throw response;
            }
            alert('檔案確認');
            loading.complete();
            window.location.reload();
        } catch(e) {
            e.json && e.json().then((data) => {
                console.error(data);
                alert(`ERROR: \n${data.messages[0]}`);
            });
            loading.complete();
        }
    }

    function _getFileAreaHTML(fileNameArray) {
        let html = '';
        fileNameArray.forEach(function (fileName) {
            const fileType = _getFileType(fileName.split('.')[1]);
            if (fileType === 'img') {  // 有圖放圖
                html += `<img
					class="img-thumbnail"
					src="${env.baseUrl}/teachers/${_id}/${_dept_id}/${_token}/recommendation-letters/${fileName}"
					data-toggle="modal"
					data-target=".img-modal"
					data-type="${_type_id}"
					data-filelink="${env.baseUrl}/teachers/${_id}/${_dept_id}/${_token}/recommendation-letters/${fileName}"
					data-filename="${fileName}"
					data-filetype="img"
					title="${fileName}"
				/> `;
            } else {
                html += `
					<div
						class="img-thumbnail non-img-file-thumbnail"
						data-toggle="modal"
						data-target=".img-modal"
						data-type="${_type_id}"
						data-filelink="${env.baseUrl}/teachers/${_id}/${_dept_id}/${_token}/recommendation-letters/${fileName}"
						data-filename="${fileName}"
						data-filetype="${fileType}"
						data-icon="fa-file-${fileType}-o"
						title="${fileName}"
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
        if (!confirm('鎖定後如欲上傳其他檔案須請學生重新邀請，您確定要鎖定了嗎？\nA re-invitation from your student is required if you intend to upload other files after clicking on Confirm.')) {
            return;
        }
        loading.start();
        const token_bye = await student.teacherBye(_id, _token); //通知後端 delete token
        if (!token_bye.ok) { //http response status code
            throw token_bye;
        }
        const notify_stu = student.notifyStudentRecommendationLetterHadUploaded(_id, _dept_id, _token);  // 寄信通知學生
        //『你什麼時候產生了我沒使用鏡花水月的錯覺』(X)「你什麼時候產生了點了『上傳』卻沒上傳的錯覺」(O)
        alert('感謝您的使用！');
        setTimeout(function() {
            loading.complete();
            $recommendationLetterUploadBtn.remove(); //remove upload button
            $recommendationLetterUpload.remove(); //remove recommend letter upload form page
            let html = '<div class="col-12" style="text-align:center;"><br/><h4>您已上傳完成，可關閉此頁面。　Upload is completed, please close this page.</h4></div>'; //按下按鈕後要顯示的內容
            document.getElementById("final-page").innerHTML = html; //替換畫面上的內容
        },500); //『幫我撐50 0秒』
    }

    //檢查檔案類型
    function checkFile(selectfile){
        var extension = new Array(".jpg", ".png", ".pdf",".jpeg"); //可接受的附檔名
        var fileExtension = selectfile.value; //fakepath
        //看副檔名是否在可接受名單
        fileExtension = fileExtension.substring(fileExtension.lastIndexOf('.')).toLowerCase();  // 副檔名通通轉小寫
        if (extension.indexOf(fileExtension) < 0) {
            alert("非可接受的檔案類型，可接受的副檔名有：" + extension.toString());
            selectfile.value = null;
            return false;
        } else {
            return true;
        }
    }

    //去零
    function dropZero(number){
        let num = number;
        var reg = new RegExp("([0]*)([1-9]+[0-9]+)", "g");
        return num.replace(reg,"$2");
    }

    // 補零
    function paddingLeft(str,lenght){
        if(str.length >= lenght){
            return str;
        } else {
            return paddingLeft("0" +str,lenght);
        }
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

    function fileNameObjectToArray(fileNameObject) {
        let fileNameArray = [];
        for(let key in fileNameObject){
            fileNameArray.push(fileNameObject[key].filename);
        }
        return fileNameArray;
    }

    // 顯示檔案 modal
    function _showOriImg() {
        const type = this.dataset.type;
        const fileName = this.dataset.filename;
        const fileType = this.dataset.filetype;

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

            let client_height = document.body.clientHeight * 0.8 ;  // 網頁可見區域高 * 0.8

            $imgModalBody.html(`
				<div id="pdf-container">
<!--					<i class="fa ${icon} non-img-file-ori" aria-hidden="true"></i>-->
                    <iframe src="${fileLink}" width="100%" height="${client_height}"> 您的瀏覽器不支援預覽，請點選並以「下載」的方式來檢視原始檔案。 </iframe>
				</div>

				<a class="btn btn-primary non-img-file-download" href="${fileLink}" target="_blank" >
					<i class="fa fa-download" aria-hidden="true"></i> 下載　Download
				</a>
			`);
        }

        $('.btn-delImg').attr({
            'data-type': type,
            'data-filename': fileName,
            'data-iswork': false
        });
    }

    async function _handleDelImg() {
        if (!confirm('確定刪除？')) {
            return;
        }

        try {
            loading.start();
            const response = await student.teacherDeleteItem({
                student_id: _id,
                dept_id: _dept_id,
                // type_id: $(this).attr('data-type'),
                token: _token,
                filename: $(this).attr('data-filename')
            });
            if (!response.ok) {
                throw response;
            }
            _verify();
            $('.img-modal').modal('hide');
            loading.complete();
        } catch(e) {
            e.json && e.json().then((data) => {
                console.error(data);
                alert(`ERROR: \n${data.messages[0]}`);
            });
            loading.complete();
        }
    }

    // 轉換一些敏感符號避免 XSS
    function encodeHTML(bareString) {
        return bareString.replace(/&/g, "&amp;")  // 轉換 &
            .replace(/</g, "&lt;").replace(/>/g, "&gt;")  // 轉換 < 及 >
            .replace(/'/g, "&apos;").replace(/"/g, "&quot;")  // 轉換英文的單雙引號
            .replace(/ /g, " &nbsp;")
            ;
    }

})();
