(() => {
	/**
	*	private variable
	*/
	let cardHtml = '';
    let _userID; // 報名序號
	let studentdata;
	let nowUrl;
	let numofpoundsign;
	let redirectUrl;


	/**
	*	cache DOM
	*/

	//const $xxxBtn = $Register.find('.Register__btnRegister');
	//const $passwordWarning = $('#password-warning');


	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/
	$('body').on('change.upload', '.file-certificate', _handleUpload);
	$('body').on('click', '.fileDelBtn', _handleDelImg);


	/**
	*	private method
	*/

	async function _init() {
		try {
            const progressResponse = await student.getStudentRegistrationProgress();
			if (!progressResponse.ok) { throw progressResponse; }
			const progressJson = await progressResponse.json();
			studentdata = progressJson;
            _userID = progressJson.id;
            
            //console.log(progressJson);

            // 自願申請僑先部
			if(progressJson.student_qualification_verify.system_id == 1 &&  
				progressJson.student_misc_data.admission_placement_apply_way_data.code ==16){
				
				// (必填)香港永久居民身份證正面
				setIDCard();

				// 自願退學證明 (曾分發來台 && 經輔導來台就學後因故退學或喪失國籍返回僑居地)
				if (progressJson.student_qualification_verify.reason_selection_of_come_to_taiwan == 2 ){
					setQuitSchool();
				}

				// 海外居留年限：未滿六 or 滿六未滿八
				if (progressJson.student_qualification_verify.overseas_residence_time == 2 || 
					progressJson.student_qualification_verify.overseas_residence_time == 4){
					setOverseasStayYears();
				}

				// 凡在台停留超過 120 天
				if (progressJson.student_qualification_verify.reason_selection_of_stay_over_120_days_in_taiwan != null){
					setTaiwanStayDates();
				}
				
				// (必填)港澳生：聲明書; 港澳具外國國籍：切結書
				if (progressJson.student_qualification_verify.identity == 1 || 
					progressJson.student_qualification_verify.identity == 2){
					setHKorMOGuarantee();
				}
				
				// (必填) 2吋相片
				setheadshot();

				// 回鄉證，出生地為大陸
				if (progressJson.student_personal_data_detail.birth_location == 135){
					sethomeReturnPermit();
				}
				
				// (選填) 改名契
				setChangeOfName();
				
				// (必填) 畢業證書/在學證明/學生證
				setDiploma();

				// (選填) 高中最後三年成績單（應屆當學期可免附）
				setSchollTranscript();

				// (必填) 學歷屬實及授權查證切結書
				setAuthorizeCheckDiploma();
			}
			// 學士班 && 僑居地為香港
			else if(progressJson.student_qualification_verify.system_id == 1 && 
				progressJson.student_personal_data_detail == '香港'){
				
				// (必填)香港永久居民身份證正面
				setIDCard();

				// 自願退學證明 (曾分發來台 && 經輔導來台就學後因故退學或喪失國籍返回僑居地)
				if (progressJson.student_qualification_verify.reason_selection_of_come_to_taiwan == 2 ){
					setQuitSchool();
				}

				// 海外居留年限：未滿六 or 滿六未滿八
				if (progressJson.student_qualification_verify.overseas_residence_time == 2 || 
					progressJson.student_qualification_verify.overseas_residence_time == 4){
					setOverseasStayYears();
				}

				// 凡在台停留超過 120 天
				if (progressJson.student_qualification_verify.reason_selection_of_stay_over_120_days_in_taiwan != null){
					setTaiwanStayDates();
				}
				
				// (必填)港澳生：聲明書; 港澳具外國國籍：切結書
				if (progressJson.student_qualification_verify.identity == 1 || 
					progressJson.student_qualification_verify.identity == 2){
					setHKorMOGuarantee();
				}
				
				// (必填) 2吋相片
				setheadshot();

				// 回鄉證，出生地為大陸
				if (progressJson.student_personal_data_detail.birth_location == 135){
					sethomeReturnPermit();
				}
				
				// (選填) 改名契
				setChangeOfName();
				
				// (必填) 畢業證書/在學證明/學生證
				setDiploma();

				// (選填) 高中最後三年成績單（應屆當學期可免附）
				setSchollTranscript();

				// (必填) 學歷屬實及授權查證切結書
				setAuthorizeCheckDiploma();
				
				// 國際數理奧林匹亞競賽或美國國際科展僅像證明
				if (progressJson.student_misc_data.has_olympia_aspiration == true){
					setOlympia();
				}
				
				// 但凡非僅持 DSE 當年度者，皆需上傳採計文憑成績證書
				if (! (progressJson.student_misc_data.year_of_hk_dse == env.year && 
					progressJson.student_misc_data.year_of_hk_ale == null && 
					progressJson.student_misc_data.year_of_hk_cee == null) ) {
						setPlacementTranscript();
				}
				
				// 非 DSE、ALE、CEE 者，需上傳成績採計資料參考表
				if (progressJson.student_misc_data.admission_placement_apply_way != 2 || 
					progressJson.student_misc_data.admission_placement_apply_way != 12 ){
					setTranscriptReferenceTable();
				}
				
			}

			// 研究所 && 僑居地為香港
			if(
				(progressJson.student_qualification_verify.system_id == 3 || 
					progressJson.student_qualification_verify.system_id == 4 ) &&
				progressJson.student_personal_data_detail == '香港'){
				
				// (必填)香港永久居民身份證正面
				setIDCard();

				// 自願退學證明 (曾分發來台 && 經輔導來台就學後因故退學或喪失國籍返回僑居地)
				if (progressJson.student_qualification_verify.reason_selection_of_come_to_taiwan == 2 ){
					setQuitSchool();
				}

				// 海外居留年限：未滿六 or 滿六未滿八
				if (progressJson.student_qualification_verify.overseas_residence_time == 2 || 
					progressJson.student_qualification_verify.overseas_residence_time == 4){
					setOverseasStayYears();
				}

				// 凡在台停留超過 120 天
				if (progressJson.student_qualification_verify.reason_selection_of_stay_over_120_days_in_taiwan != null){
					setTaiwanStayDates();
				}
				
				// (必填)港澳生：聲明書; 港澳具外國國籍：切結書
				if (progressJson.student_qualification_verify.identity == 1 || 
					progressJson.student_qualification_verify.identity == 2){
					setHKorMOGuarantee();
				}
				
				// (必填) 2吋相片
				setheadshot();

				// 回鄉證，出生地為大陸
				if (progressJson.student_personal_data_detail.birth_location == 135){
					sethomeReturnPermit();
				}
				
				// (選填) 改名契
				setChangeOfName();
				
				// (必填) 畢業證書/在學證明/學生證
				setDiploma();

				// (選填) 學士/碩士成績單（應屆當學期可免附）
				setSchollTranscript();

				// (必填) 學歷屬實及授權查證切結書
				setAuthorizeCheckDiploma();
			}

			// 港二技
			if(progressJson.student_qualification_verify.system_id == 2 ){
				
				// (必填)香港永久居民身份證正面
				setIDCard();

				// 自願退學證明 (曾分發來台 && 經輔導來台就學後因故退學或喪失國籍返回僑居地)
				if (progressJson.student_qualification_verify.reason_selection_of_come_to_taiwan == 2 ){
					setQuitSchool();
				}

				// 海外居留年限：未滿六 or 滿六未滿八
				if (progressJson.student_qualification_verify.overseas_residence_time == 2 || 
					progressJson.student_qualification_verify.overseas_residence_time == 4){
					setOverseasStayYears();
				}

				// 凡在台停留超過 120 天
				if (progressJson.student_qualification_verify.reason_selection_of_stay_over_120_days_in_taiwan != null){
					setTaiwanStayDates();
				}
				
				// (必填)港澳生：聲明書; 港澳具外國國籍：切結書
				if (progressJson.student_qualification_verify.identity == 1 || 
					progressJson.student_qualification_verify.identity == 2){
					setHKorMOGuarantee();
				}
				
				// (必填) 2吋相片
				setheadshot();

				// 回鄉證，出生地為大陸
				if (progressJson.student_personal_data_detail.birth_location == 135){
					sethomeReturnPermit();
				}
				
				// (選填) 改名契
				setChangeOfName();
				
				// (必填) 畢業證書/在學證明/學生證
				setDiploma();

				// (選填) 經驗證之副學士或高級文憑歷年成績單（應屆當學期可免附）
				setSchollTranscript();

				// (必填) 學歷屬實及授權查證切結書
				setAuthorizeCheckDiploma();
			}


            loading.complete();
        } catch(e) {
			if (e.status && e.status === 401) {
				alert('請登入。');
				location.href = "./index.html";
			} else if (e.status && e.status === 403) {
				e.json && e.json().then((data) => {
					alert(`ERROR: \n${data.messages[0]}\n` + '即將返回上一頁');
					window.history.back();
				})
			} else {
				e.json && e.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
			}
			loading.complete();
		}   
	}


    /*
    * 01: ID-card: 香港永久居民身份證正面
    */
    async function setIDCard(){
		let item_id = '01';
        let cardHtml01= `
        <div class="card border-info" style="border-width: thick;margin-bottom: 3%;">
            <div class="card-header bg-info text-white vertical-align:middle;" style="font-size:150%">
                香港永久居民身份證正面
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
                    說明
                </div>                
                <div class="row fileUpload" style="margin-bottom: 15px; padding-left:5%" >
                    <div class="col-12"  >
                        <input type="file" class="fileUploadBtn filestyle file-certificate"  data-item="${item_id}"  >
                    </div>
                </div>
            </div>
        </div>
        `;

        // 有檔案就渲染出來
        try {
			loading.start();
			const response = await student.getIdentityVerificationItem({user_id: _userID, item: item_id});
			if (!response.ok) { throw response; }

            const ifhasfile = await response.json();
			document.getElementById("uploadArea_IDCard").innerHTML=eval("cardHtml"+item_id);;
			if( ifhasfile == "true"){
				// 有檔案
                _getFileAreaHTML('01','uploadArea_IDCard');
				$('#uploadArea_IDCard_file').show();
			}
			else{
                // 沒檔案
				$('#uploadArea_IDCard_file').hide();
			}
			
			// 上傳 button 樣式
			$(".fileUploadBtn").filestyle({ //:file
				htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
				btnClass: "btn-success",
				text: "請上傳",
				input: false
			});
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
			loading.complete();
		}
        
        
    }

	/*
    * 02: quit-school: 自願退學證明
    */
    async function setQuitSchool(){
		let item_id = '02';
			
		let cardHtml02 = `
        <div class="card border-info" style="border-width: thick; margin-bottom: 3%;">
            <div class="card-header bg-info text-white vertical-align:middle;" style="font-size:150%">
				自願退學證明
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
                    說明
                </div>                
                <div class="row fileUpload" style="margin-bottom: 15px; padding-left:5%" >
                    <div class="col-12"  >
                        <input type="file" class="fileUploadBtn filestyle file-certificate"  data-item="${item_id}"  >
                    </div>
                </div>
            </div>
        </div>
        `;

        // 有檔案就渲染出來
        try {
			loading.start();
			const response = await student.getIdentityVerificationItem({user_id: _userID, item: item_id});
			if (!response.ok) { throw response; }

            const ifhasfile = await response.json();
			document.getElementById("uploadArea_quitSchool").innerHTML=eval("cardHtml"+item_id);
			if( ifhasfile == "true"){
				// 有檔案
                _getFileAreaHTML(item_id,'uploadArea_quitSchool');
				$('#uploadArea_quitSchool_file').show();
			}
			else{
                // 沒檔案
				$('#uploadArea_quitSchool_file').hide();
			}

			// 上傳 button 樣式
			$(".fileUploadBtn").filestyle({ //:file
				htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
				btnClass: "btn-success",
				text: "請上傳",
				input: false
			});
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
			loading.complete();
		}
        
        
    }

	/*
    * 03: overseas-stay-years: 海外居留年限切結書
    */
    async function setOverseasStayYears(){
		let item_id = '03';
			
		let cardHtml03 = `
        <div class="card border-info" style="border-width: thick; margin-bottom: 3%;">
            <div class="card-header bg-info text-white vertical-align:middle;" style="font-size:150%">
			海外居留年限切結書
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
                    說明
                </div>                
                <div class="row fileUpload" style="margin-bottom: 15px; padding-left:5%" >
                    <div class="col-12"  >
                        <input type="file" class="fileUploadBtn filestyle file-certificate"  data-item="${item_id}"  >
                    </div>
                </div>
            </div>
        </div>
        `;

        // 有檔案就渲染出來
        try {
			loading.start();
			const response = await student.getIdentityVerificationItem({user_id: _userID, item: item_id});
			if (!response.ok) { throw response; }

            const ifhasfile = await response.json();
			document.getElementById("uploadArea_overseasStayYears").innerHTML=eval("cardHtml"+item_id);
			if( ifhasfile == "true"){
				// 有檔案
                _getFileAreaHTML(item_id,'uploadArea_overseasStayYears');
				$('#uploadArea_overseasStayYears_file').show();
			}
			else{
                // 沒檔案
				$('#uploadArea_overseasStayYears_file').hide();
			}

			// 上傳 button 樣式
			$(".fileUploadBtn").filestyle({ //:file
				htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
				btnClass: "btn-success",
				text: "請上傳",
				input: false
			});
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
			loading.complete();
		}
        
        
    }

	/*
    * 04: Taiwan-stay-dates 在台停留日期
    */
    async function setTaiwanStayDates(){
		let item_id = '04';
			
		let cardHtml04 = `
        <div class="card border-info" style="border-width: thick; margin-bottom: 3%;">
            <div class="card-header bg-info text-white vertical-align:middle;" style="font-size:150%">
			在台停留日期
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
                    說明
                </div>                
                <div class="row fileUpload" style="margin-bottom: 15px; padding-left:5%" >
                    <div class="col-12"  >
                        <input type="file" class="fileUploadBtn filestyle file-certificate"  data-item="${item_id}"  >
                    </div>
                </div>
            </div>
        </div>
        `;

        // 有檔案就渲染出來
        try {
			loading.start();
			const response = await student.getIdentityVerificationItem({user_id: _userID, item: item_id});
			if (!response.ok) { throw response; }

            const ifhasfile = await response.json();
			document.getElementById("uploadArea_TaiwanStayDates").innerHTML=eval("cardHtml"+item_id);
			if( ifhasfile == "true"){
				// 有檔案
                _getFileAreaHTML(item_id,'uploadArea_TaiwanStayDates');
				$('#uploadArea_TaiwanStayDates_file').show();
			}
			else{
                // 沒檔案
				$('#uploadArea_TaiwanStayDates_file').hide();
			}

			// 上傳 button 樣式
			$(".fileUploadBtn").filestyle({ //:file
				htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
				btnClass: "btn-success",
				text: "請上傳",
				input: false
			});
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
			loading.complete();
		}
        
        
    }

	/*
    * 05: hk-or-mo-guarantee: 港澳聲聲明書 / 港澳具外國國籍之華裔學生切結書
    */
    async function setHKorMOGuarantee(){
		let item_id = '05';
			
		let cardHtml05 = `
        <div class="card border-info" style="border-width: thick; margin-bottom: 3%;">
            <div class="card-header bg-info text-white vertical-align:middle;" style="font-size:150%">
			港澳聲聲明書 / 港澳具外國國籍之華裔學生切結書
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
                    說明
                </div>                
                <div class="row fileUpload" style="margin-bottom: 15px; padding-left:5%" >
                    <div class="col-12"  >
                        <input type="file" class="fileUploadBtn filestyle file-certificate"  data-item="${item_id}"  >
                    </div>
                </div>
            </div>
        </div>
        `;

        // 有檔案就渲染出來
        try {
			loading.start();
			const response = await student.getIdentityVerificationItem({user_id: _userID, item: item_id});
			if (!response.ok) { throw response; }

            const ifhasfile = await response.json();
			document.getElementById("uploadArea_HKorMOGuarantee").innerHTML=eval("cardHtml"+item_id);
			if( ifhasfile == "true"){
				// 有檔案
                _getFileAreaHTML(item_id,'uploadArea_HKorMOGuarantee');
				$('#uploadArea_HKorMOGuarantee_file').show();
			}
			else{
                // 沒檔案
				$('#uploadArea_HKorMOGuarantee_file').hide();
			}

			// 上傳 button 樣式
			$(".fileUploadBtn").filestyle({ //:file
				htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
				btnClass: "btn-success",
				text: "請上傳",
				input: false
			});
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
			loading.complete();
		}
        
        
    }

	/*
    * 06: head-shot: 2吋相片
    */
    async function setheadshot(){
		let item_id = '06';
			
		let cardHtml06 = `
        <div class="card border-info" style="border-width: thick; margin-bottom: 3%;">
            <div class="card-header bg-info text-white vertical-align:middle;" style="font-size:150%">
			2吋相片
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
                    說明
                </div>                
                <div class="row fileUpload" style="margin-bottom: 15px; padding-left:5%" >
                    <div class="col-12"  >
                        <input type="file" class="fileUploadBtn filestyle file-certificate"  data-item="${item_id}"  >
                    </div>
                </div>
            </div>
        </div>
        `;

        // 有檔案就渲染出來
        try {
			loading.start();
			const response = await student.getIdentityVerificationItem({user_id: _userID, item: item_id});
			if (!response.ok) { throw response; }

            const ifhasfile = await response.json();
			document.getElementById("uploadArea_headshot").innerHTML=eval("cardHtml"+item_id);
			if( ifhasfile == "true"){
				// 有檔案
                _getFileAreaHTML(item_id,'uploadArea_headshot');
				$('#uploadArea_headshot_file').show();
			}
			else{
                // 沒檔案
				$('#uploadArea_headshot_file').hide();
			}

			// 上傳 button 樣式
			$(".fileUploadBtn").filestyle({ //:file
				htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
				btnClass: "btn-success",
				text: "請上傳",
				input: false
			});
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
			loading.complete();
		}
        
        
    }

	/*
    * 07: home-return-permit: 回鄉證
    */
    async function sethomeReturnPermit(){
		let item_id = '07';
			
		let cardHtml07 = `
        <div class="card border-info" style="border-width: thick; margin-bottom: 3%;">
            <div class="card-header bg-info text-white vertical-align:middle;" style="font-size:150%">
			回鄉證
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
                    說明
                </div>                
                <div class="row fileUpload" style="margin-bottom: 15px; padding-left:5%" >
                    <div class="col-12"  >
                        <input type="file" class="fileUploadBtn filestyle file-certificate"  data-item="${item_id}"  >
                    </div>
                </div>
            </div>
        </div>
        `;

        // 有檔案就渲染出來
        try {
			loading.start();
			const response = await student.getIdentityVerificationItem({user_id: _userID, item: item_id});
			if (!response.ok) { throw response; }

            const ifhasfile = await response.json();
			document.getElementById("uploadArea_homeReturnPermit").innerHTML=eval("cardHtml"+item_id);
			if( ifhasfile == "true"){
				// 有檔案
                _getFileAreaHTML(item_id,'uploadArea_homeReturnPermit');
				$('#uploadArea_homeReturnPermit_file').show();
			}
			else{
                // 沒檔案
				$('#uploadArea_homeReturnPermit_file').hide();
			}

			// 上傳 button 樣式
			$(".fileUploadBtn").filestyle({ //:file
				htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
				btnClass: "btn-success",
				text: "請上傳",
				input: false
			});
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
			loading.complete();
		}
        
        
    }

	/*
    * 08: change-of-name: 改名契
    */
    async function setChangeOfName(){
		let item_id = '08';
			
		let cardHtml08 = `
        <div class="card border-info" style="border-width: thick; margin-bottom: 3%;">
            <div class="card-header bg-info text-white vertical-align:middle;" style="font-size:150%">
			改名契
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
                    說明
                </div>                
                <div class="row fileUpload" style="margin-bottom: 15px; padding-left:5%" >
                    <div class="col-12"  >
                        <input type="file" class="fileUploadBtn filestyle file-certificate"  data-item="${item_id}"  >
                    </div>
                </div>
            </div>
        </div>
        `;

        // 有檔案就渲染出來
        try {
			loading.start();
			const response = await student.getIdentityVerificationItem({user_id: _userID, item: item_id});
			if (!response.ok) { throw response; }

            const ifhasfile = await response.json();
			document.getElementById("uploadArea_changeOfName").innerHTML=eval("cardHtml"+item_id);
			if( ifhasfile == "true"){
				// 有檔案
                _getFileAreaHTML(item_id,'uploadArea_changeOfName');
				$('#uploadArea_changeOfName_file').show();
			}
			else{
                // 沒檔案
				$('#uploadArea_changeOfName_file').hide();
			}

			// 上傳 button 樣式
			$(".fileUploadBtn").filestyle({ //:file
				htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
				btnClass: "btn-success",
				text: "請上傳",
				input: false
			});
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
			loading.complete();
		}
        
        
    }

	/*
    * 09: diploma: 畢業證書/在學證明/學生證
    */
    async function setDiploma(){
		let item_id = '09';
			
		let cardHtml09 = `
        <div class="card border-info" style="border-width: thick; margin-bottom: 3%;">
            <div class="card-header bg-info text-white vertical-align:middle;" style="font-size:150%">
			畢業證書/在學證明/學生證
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
                    說明
                </div>                
                <div class="row fileUpload" style="margin-bottom: 15px; padding-left:5%" >
                    <div class="col-12"  >
                        <input type="file" class="fileUploadBtn filestyle file-certificate"  data-item="${item_id}"  >
                    </div>
                </div>
            </div>
        </div>
        `;

        // 有檔案就渲染出來
        try {
			loading.start();
			const response = await student.getIdentityVerificationItem({user_id: _userID, item: item_id});
			if (!response.ok) { throw response; }

            const ifhasfile = await response.json();
			document.getElementById("uploadArea_diploma").innerHTML=eval("cardHtml"+item_id);
			if( ifhasfile == "true"){
				// 有檔案
                _getFileAreaHTML(item_id,'uploadArea_diploma');
				$('#uploadArea_diploma_file').show();
			}
			else{
                // 沒檔案
				$('#uploadArea_diploma_file').hide();
			}

			// 上傳 button 樣式
			$(".fileUploadBtn").filestyle({ //:file
				htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
				btnClass: "btn-success",
				text: "請上傳",
				input: false
			});
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
			loading.complete();
		}
        
        
    }

	/*
    * 10: scholl-transcript: 高中最後三年成績單（應屆當學期可免附）
    */
    async function setSchollTranscript(){
		let item_id = '10';
		let description ='';

		if (studentdata.student_qualification_verify.system_id == 1){
			description = '高中最後三年成績單（應屆當學期可免附）';
		}
		else if(studentdata.student_qualification_verify.system_id == 2){
			description = '經驗證之副學士或高級文憑歷年成績單（應屆當學期可免附）';
		}
		else if(studentdata.student_qualification_verify.system_id == 3 || 
			studentdata.student_qualification_verify.system_id == 4){
			description = '經驗證之學士/碩士歷年成績單（應屆當學期可免附）';
		}
			
		let cardHtml10 = `
        <div class="card border-info" style="border-width: thick; margin-bottom: 3%;">
            <div class="card-header bg-info text-white vertical-align:middle;" style="font-size:150%">
			${description}
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
                    說明
                </div>                
                <div class="row fileUpload" style="margin-bottom: 15px; padding-left:5%" >
                    <div class="col-12"  >
                        <input type="file" class="fileUploadBtn filestyle file-certificate"  data-item="${item_id}"  >
                    </div>
                </div>
            </div>
        </div>
        `;

        // 有檔案就渲染出來
        try {
			loading.start();
			const response = await student.getIdentityVerificationItem({user_id: _userID, item: item_id});
			if (!response.ok) { throw response; }

            const ifhasfile = await response.json();
			document.getElementById("uploadArea_schollTranscript").innerHTML=eval("cardHtml"+item_id);
			if( ifhasfile == "true"){
				// 有檔案
                _getFileAreaHTML(item_id,'uploadArea_schollTranscript');
				$('#uploadArea_schollTranscript_file').show();
			}
			else{
                // 沒檔案
				$('#uploadArea_schollTranscript_file').hide();
			}

			// 上傳 button 樣式
			$(".fileUploadBtn").filestyle({ //:file
				htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
				btnClass: "btn-success",
				text: "請上傳",
				input: false
			});
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
			loading.complete();
		}
        
        
    }

	/*
    * 11: authorize-check-diploma: 學歷屬實及授權查證切結書
    */
    async function setAuthorizeCheckDiploma(){
		let item_id = '11';
			
		let cardHtml11 = `
        <div class="card border-info" style="border-width: thick; margin-bottom: 3%;">
            <div class="card-header bg-info text-white vertical-align:middle;" style="font-size:150%">
			學歷屬實及授權查證切結書
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
                    說明
                </div>                
                <div class="row fileUpload" style="margin-bottom: 15px; padding-left:5%" >
                    <div class="col-12"  >
                        <input type="file" class="fileUploadBtn filestyle file-certificate"  data-item="${item_id}"  >
                    </div>
                </div>
            </div>
        </div>
        `;

        // 有檔案就渲染出來
        try {
			loading.start();
			const response = await student.getIdentityVerificationItem({user_id: _userID, item: item_id});
			if (!response.ok) { throw response; }

            const ifhasfile = await response.json();
			document.getElementById("uploadArea_authorizeCheckDiploma").innerHTML=eval("cardHtml"+item_id);
			if( ifhasfile == "true"){
				// 有檔案
                _getFileAreaHTML(item_id,'uploadArea_authorizeCheckDiploma');
				$('#uploadArea_authorizeCheckDiploma_file').show();
			}
			else{
                // 沒檔案
				$('#uploadArea_authorizeCheckDiploma_file').hide();
			}

			// 上傳 button 樣式
			$(".fileUploadBtn").filestyle({ //:file
				htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
				btnClass: "btn-success",
				text: "請上傳",
				input: false
			});
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
			loading.complete();
		}
        
        
    }

	/*
    * 12: olympia: 國際數理奧林匹亞競賽或美國國際科展僅像證明
    */
    async function setOlympia(){
		let item_id = '12';
			
		let cardHtml12 = `
        <div class="card border-info" style="border-width: thick; margin-bottom: 3%;">
            <div class="card-header bg-info text-white vertical-align:middle;" style="font-size:150%">
			國際數理奧林匹亞競賽或美國國際科展僅像證明
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
                    說明
                </div>                
                <div class="row fileUpload" style="margin-bottom: 15px; padding-left:5%" >
                    <div class="col-12"  >
                        <input type="file" class="fileUploadBtn filestyle file-certificate"  data-item="${item_id}"  >
                    </div>
                </div>
            </div>
        </div>
        `;

        // 有檔案就渲染出來
        try {
			loading.start();
			const response = await student.getIdentityVerificationItem({user_id: _userID, item: item_id});
			if (!response.ok) { throw response; }

            const ifhasfile = await response.json();
			document.getElementById("uploadArea_olympia").innerHTML=eval("cardHtml"+item_id);
			if( ifhasfile == "true"){
				// 有檔案
                _getFileAreaHTML(item_id,'uploadArea_olympia');
				$('#uploadArea_olympia_file').show();
			}
			else{
                // 沒檔案
				$('#uploadArea_olympia_file').hide();
			}

			// 上傳 button 樣式
			$(".fileUploadBtn").filestyle({ //:file
				htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
				btnClass: "btn-success",
				text: "請上傳",
				input: false
			});
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
			loading.complete();
		}
        
        
    }

	/*
    * 13: placement-transcript: 採計文憑成績證書
    */
    async function setPlacementTranscript(){
		let item_id = '13';
			
		let cardHtml13 = `
        <div class="card border-info" style="border-width: thick; margin-bottom: 3%;">
            <div class="card-header bg-info text-white vertical-align:middle;" style="font-size:150%">
			採計文憑成績證書
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
                    說明
                </div>                
                <div class="row fileUpload" style="margin-bottom: 15px; padding-left:5%" >
                    <div class="col-12"  >
                        <input type="file" class="fileUploadBtn filestyle file-certificate"  data-item="${item_id}"  >
                    </div>
                </div>
            </div>
        </div>
        `;

        // 有檔案就渲染出來
        try {
			loading.start();
			const response = await student.getIdentityVerificationItem({user_id: _userID, item: item_id});
			if (!response.ok) { throw response; }

            const ifhasfile = await response.json();
			document.getElementById("uploadArea_placementTranscript").innerHTML=eval("cardHtml"+item_id);
			if( ifhasfile == "true"){
				// 有檔案
                _getFileAreaHTML(item_id,'uploadArea_placementTranscript');
				$('#uploadArea_placementTranscript_file').show();
			}
			else{
                // 沒檔案
				$('#uploadArea_placementTranscript_file').hide();
			}

			// 上傳 button 樣式
			$(".fileUploadBtn").filestyle({ //:file
				htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
				btnClass: "btn-success",
				text: "請上傳",
				input: false
			});
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
			loading.complete();
		}
        
        
    }

	/*
    * 14: transcript-reference-table: 成績採計資料參考表
    */
    async function setTranscriptReferenceTable(){
		let item_id = '14';
			
		let cardHtml14 = `
        <div class="card border-info" style="border-width: thick; margin-bottom: 3%;">
            <div class="card-header bg-info text-white vertical-align:middle;" style="font-size:150%">
			成績採計資料參考表
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
                    說明
                </div>                
                <div class="row fileUpload" style="margin-bottom: 15px; padding-left:5%" >
                    <div class="col-12"  >
                        <input type="file" class="fileUploadBtn filestyle file-certificate"  data-item="${item_id}"  >
                    </div>
                </div>
            </div>
        </div>
        `;

        // 有檔案就渲染出來
        try {
			loading.start();
			const response = await student.getIdentityVerificationItem({user_id: _userID, item: item_id});
			if (!response.ok) { throw response; }

            const ifhasfile = await response.json();
			document.getElementById("uploadArea_transcriptReferenceTable").innerHTML=eval("cardHtml"+item_id);
			if( ifhasfile == "true"){
				// 有檔案
                _getFileAreaHTML(item_id,'uploadArea_transcriptReferenceTable');
				$('#uploadArea_transcriptReferenceTable_file').show();
			}
			else{
                // 沒檔案
				$('#uploadArea_transcriptReferenceTable_file').hide();
			}

			// 上傳 button 樣式
			$(".fileUploadBtn").filestyle({ //:file
				htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
				btnClass: "btn-success",
				text: "請上傳",
				input: false
			});
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
			loading.complete();
		}
        
        
    }
	



    // 有檔案的就 show 出來
    function  _getFileAreaHTML(_itemId, htmlId) {

		let reviewItemHTML = '';
		let fileUploadHTML = '';

		// pdf 顯示分別做不同處理
        reviewItemHTML = `
        <div class="card">
            <div class="card-body" style="margin: 0 auto">
                <h4 class="card-title"><span>已上傳檔案</span> </h4>
                    <embed src="${env.baseUrl}/students/${_userID}/upload-identity-verification/item/${_itemId}/file/none?=<?=time();?" width="500" height="375" type="application/pdf">
            </div>
            
            <div class="row fileDel" style="margin: 0 auto" >
                <div class="col-12"  >
                    <button type="button" class=" btn fileDelBtn  btn-danger"  data-item="${_itemId}"  >
                        <i class="fa fa-folder-open" aria-hidden="true"></i> 刪除檔案
                    </button>
                </div>
            </div>
        </div>
		<hr>`;

		htmlId += '_file';
        // 兜好的 html 拋到前端渲染囉
        document.getElementById(htmlId).innerHTML=reviewItemHTML;

		cardHtml = '';

	}

    // 上傳檔案囉 (會抓取 data-item 看現在要上傳什麼檔案)
	async function _handleUpload() {
		const item =  $(this).data('item') ;
		const fileList = this.files;
		let data = new FormData();
		
        for (let i = 0; i < fileList.length; i++) {
			data.append('files[]', fileList[i]);
		}

		//偵測是否超過 8 MB 考慮到成績單檔案會比較大
		if(student.sizeConversion(fileList[0].size,8)){
			alert('檔案過大，大小不能超過 8 MB！')
			$(this).val('');//清除檔案路徑
			return;
		}	

		try {
			loading.start();
			const response = await student.uploadIdentityVerificationItem({data, user_id: _userID, item: item});

			if (!response.ok) { throw response; }
			const responseJson = await response.json();
			$(this).val('');//清除檔案路徑
			loading.complete();
		} catch(e) {
            //alert(e);
			e.json && e.json().then((data) => {
				console.error("error",data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
			$(this).val('');//清除檔案路徑
			loading.complete();
		}
		$(this).val('');//清除檔案路徑
		
		
		// nowUrl = window.location.href;
		// numofpoundsign = nowUrl.indexOf("#",1);
		
		/* anchor failed */
		// if(numofpoundsign == '-1'){
		// 	redirectUrl = nowUrl+ '#'+itemIdConvertToBlockName(item);

		// 	//window.location.reload();
		// 	window.location.href = redirectUrl;
		// }
		// else{
		// 	redirectUrl =  nowUrl.substring(0,numofpoundsign) + '#'+itemIdConvertToBlockName(item);
			
		// 	window.location.href = redirectUrl;
		// 	window.location.reload();
		// }

		// 重新渲染
		eval(itemIdConvertTofunctionName(item));
	}

	// 刪除指定成績單檔案 (會抓取 data-item 看現在要刪除什麼檔案)
	async function _handleDelImg() {

		// if (!confirm('確定刪除？')) {
		// 	return;
		// }

		try {
			loading.start();
			item =  $(this).data('item') ;
			
			const response = await student.delIdentityVerificationItem({user_id: _userID, itemId: item});
			if (!response.ok) { throw response; }
			const fileNameOfSubject = await response.json();
			var _filename = fileNameOfSubject.files[0];


			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			});
			loading.complete();
		}
		
		/* anchor failed */
		// nowUrl = window.location.href;
		// numofpoundsign = nowUrl.indexOf("#",1);

		// if(numofpoundsign == '-1'){
		// 	redirectUrl = nowUrl+ '#'+itemIdConvertToBlockName(item);
			
		// 	window.location.href = redirectUrl;
		// 	window.location.reload();
		// }
		// else{
		// 	redirectUrl =  nowUrl.substring(0,numofpoundsign) + '#'+itemIdConvertToBlockName(item);
			
		// 	window.location.href = redirectUrl;
		// 	window.location.reload();
		// }
		//  window.location.reload();
		//  smoothscroll(itemIdConvertToBlockName(item));

		// 重新渲染
		eval(itemIdConvertTofunctionName(item));
	}

	// for re-render use
	function itemIdConvertTofunctionName(itemId){
		// var arrayName = {
		// 	'01':"uploadArea_IDCard",
		// 	'02':"uploadArea_quitSchool",
		// 	"03":"uploadArea_overseasStayYears",
		// 	"04":"uploadArea_TaiwanStayDates",
		// 	"05":"uploadArea_HKorMOGuarantee",
		// 	"06":"uploadArea_headshot",
		// 	"07":"uploadArea_homeReturnPermit",
		// 	"08":"uploadArea_changeOfName",
		// 	"09":"uploadArea_diploma",
		// 	"10":"uploadArea_schollTranscript",
		// 	"11":"uploadArea_authorizeCheckDiploma",
		// 	"12":"uploadArea_olympia",
		// 	"13":"uploadArea_placementTranscript",
		// 	"14":"uploadArea_transcriptReferenceTable"
		// };
		var arrayName = {
			'01':'setIDCard()',
			'02':'setQuitSchool()',
			'03':'setOverseasStayYears()',
			'04':'setTaiwanStayDates()',
			'05':'setHKorMOGuarantee()',
			'06':'setheadshot()',
			'07':'sethomeReturnPermit()',
			'08':'setChangeOfName()',
			'09':'setDiploma()',
			'10':'setSchollTranscript()',
			'11':'setAuthorizeCheckDiploma()',
			'12':'setOlympia()',
			'13':'setPlacementTranscript()',
			'14':'setTranscriptReferenceTable()'
		};
		return arrayName[itemId];
	}

	function smoothscroll(id){
		alert(id);
		$('html, body').animate({
			scrollTop: $('#'+id).offset().top
		}, 2000);
	}



})();
