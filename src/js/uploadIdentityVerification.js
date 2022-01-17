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
	let birth_location;


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

			// 專門只為了取出生地
			const progressResponse2 = await student.getStudentPersonalData();
        	if (!progressResponse2.ok) { throw progressResponse2; }
			const progressJson2 = await progressResponse2.json();

			studentdata = progressJson;
            _userID = progressJson.id;
			birth_location = progressJson2.student_personal_data.birth_location;
            
            //console.log(progressJson);

			if(progressJson.student_qualification_verify.system_id == 1 && !progressJson.student_misc_data.admission_placement_apply_way_data){
				await swal({title: "請先選擇成績採計方式！", type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
				location.href = "./grade.html";
			}

            // 自願申請僑先部
			if(progressJson.student_qualification_verify.system_id == 1 &&  
				progressJson.student_personal_data_detail.resident_location == '香港' &&
				progressJson.student_misc_data.admission_placement_apply_way_data.code ==16 ){
				
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
				if (birth_location == 135){
					sethomeReturnPermit();
				}
				
				// (選填) 改名契
				setChangeOfName();
				
				// (必填) 畢業證書/在學證明/學生證
				setDiploma();

				// (必填) 高中最後三年成績單
				setSchollTranscript();

				// (必填) 學歷屬實及授權查證切結書
				setAuthorizeCheckDiploma();

				// 符合港澳關係條例切結書 港澳生、在台設有戶籍、持外國護照（但不限回歸前葡萄牙護照）
				if ( progressJson.student_qualification_verify.identity == 1 && 
					progressJson.student_qualification_verify.taiwan_census == 1 && 
					progressJson.student_qualification_verify.except_HK_Macao_passport ==1 && 
					(
						progressJson.student_qualification_verify.first_get_portugal_passport_at > '1999/12/19' || 
						progressJson.student_qualification_verify.which_nation_passport != null
					) ){
					sethkmoRelationsOrdinance();
				}
			}
			// 學士班 && 僑居地為香港
			else if(progressJson.student_qualification_verify.system_id == 1 && 
				progressJson.student_personal_data_detail.resident_location == '香港'){
				
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
				if (birth_location == 135){
					sethomeReturnPermit();
				}
				
				// (選填) 改名契
				setChangeOfName();
				
				// (必填) 畢業證書/在學證明/學生證
				setDiploma();

				// (必填) 高中最後三年成績單
				setSchollTranscript();

				// (必填) 學歷屬實及授權查證切結書
				setAuthorizeCheckDiploma();
				
				// 國際數理奧林匹亞競賽或美國國際科展僅像證明
				if (progressJson.student_misc_data.has_olympia_aspiration == true){
					setOlympia();
				}
				
				// 但凡非 不參加聯合分發 或 僅持 DSE 當年度者、中學最後三年成績者，皆需上傳採計文憑成績證書
				if ( ! ((progressJson.student_misc_data.year_of_hk_dse == env.year && 
					progressJson.student_misc_data.year_of_hk_ale == null && 
					progressJson.student_misc_data.year_of_hk_cee == null) || 
					(progressJson.student_misc_data.admission_placement_apply_way_data.code == "26")||
					progressJson.student_misc_data.admission_placement_apply_way == "1"
				)){
					setPlacementTranscript();
				}
				
				// 非 DSE、ALE、CEE 者，需上傳成績採計資料參考表
				if (!(progressJson.student_misc_data.admission_placement_apply_way == '2' || 
					progressJson.student_misc_data.admission_placement_apply_way == '12' || 
					progressJson.student_misc_data.admission_placement_apply_way == '1' || 
					progressJson.student_misc_data.admission_placement_apply_way == '11' ||
					progressJson.student_misc_data.admission_placement_apply_way == '81' ) ){
					setTranscriptReferenceTable();
				}


				// 符合港澳關係條例切結書 港澳生、在台設有戶籍、持外國護照（但不限回歸前葡萄牙護照）
				if ( progressJson.student_qualification_verify.identity == 1 && 
					progressJson.student_qualification_verify.taiwan_census == 1 && 
					progressJson.student_qualification_verify.except_HK_Macao_passport ==1 && 
					(
						progressJson.student_qualification_verify.first_get_portugal_passport_at > '1999/12/19' || 
						progressJson.student_qualification_verify.which_nation_passport != null
					) ){
					sethkmoRelationsOrdinance();
				}
				
				
			}

			// 研究所 && 僑居地為香港
			if(
				(progressJson.student_qualification_verify.system_id == 3 || 
					progressJson.student_qualification_verify.system_id == 4 ) &&
				progressJson.student_personal_data_detail.resident_location == '香港'){
				
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
				if (birth_location == 135){
					sethomeReturnPermit();
				}
				
				// (選填) 改名契
				setChangeOfName();
				
				// (必填) 畢業證書/在學證明/學生證
				setDiploma();

				// (必填) 學士/碩士成績單
				setSchollTranscript();

				// (必填) 學歷屬實及授權查證切結書
				setAuthorizeCheckDiploma();

				// 符合港澳關係條例切結書 港澳生、在台設有戶籍、持外國護照（但不限回歸前葡萄牙護照）
				if ( progressJson.student_qualification_verify.identity == 1 && 
					progressJson.student_qualification_verify.taiwan_census == 1 && 
					progressJson.student_qualification_verify.except_HK_Macao_passport ==1 && 
					(
						progressJson.student_qualification_verify.first_get_portugal_passport_at > '1999/12/19' || 
						progressJson.student_qualification_verify.which_nation_passport != null
					) ){
					sethkmoRelationsOrdinance();
				}
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
				if (birth_location == 135){
					sethomeReturnPermit();
				}
				
				// (選填) 改名契
				setChangeOfName();
				
				// (必填) 畢業證書/在學證明/學生證
				setDiploma();

				// (必填) 經驗證之副學士或高級文憑歷年成績單
				setSchollTranscript();

				// 港二技學歷完成地在香港者需要上傳已通過香港資歷架構第四級(含)以上之證明文件
				if(progressJson2.student_personal_data.school_country == 113){
					setTechCoursePassedProof();
				}

				// (必填) 學歷屬實及授權查證切結書
				setAuthorizeCheckDiploma();

				// 符合港澳關係條例切結書 港澳生、在台設有戶籍、持外國護照（但不限回歸前葡萄牙護照）
				if ( progressJson.student_qualification_verify.identity == 1 && 
					progressJson.student_qualification_verify.taiwan_census == 1 && 
					progressJson.student_qualification_verify.except_HK_Macao_passport ==1 && 
					(
						progressJson.student_qualification_verify.first_get_portugal_passport_at > '1999/12/19' || 
						progressJson.student_qualification_verify.which_nation_passport != null
					) ){
					sethkmoRelationsOrdinance();
				}
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
				僅接受副檔名為 pdf 的<font color="red">單一</font>檔案，檔案大小需<font color="red">小於 8 Mbytes</font>。
                </div>                
                <div class="row fileUpload" style="margin-bottom: 3%; padding-top:3%; padding-left:5%" >
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
					僅接受副檔名為 pdf 的<font color="red">單一</font>檔案，檔案大小需<font color="red">小於 8 Mbytes</font>。
                </div>                
                <div class="row fileUpload" style="margin-bottom: 3%; padding-top:3%; padding-left:5%" >
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
		let description ='';
		let description_detail ='';

		if (studentdata.student_qualification_verify.identity == 1){ // 港澳生
			description = '境外居留年限切結書';
			description_detail = '請下載「<a href="https://drive.google.com/file/d/1_OVM9tPL0dycOVj9M3Qxsu3gldgLI6-5/view" target="_blank">境外居留年限切結書</a>」，列印並填寫後，掃描為 PDF 檔上傳。';
		}

		if (studentdata.student_qualification_verify.identity == 2){ // 港澳生具外國國籍
			description = '海外居留年限切結書';
			description_detail = '請下載「<a href="https://drive.google.com/file/d/1Am6U_RAdio7E0UNY6gFMyccTENJS80Mo/view?usp=sharing" target="_blank">海外居留年限切結書</a>」，列印並填寫後，掃描為 PDF 檔上傳。';
		}
			
		let cardHtml03 = `
        <div class="card border-info" style="border-width: thick; margin-bottom: 3%;">
            <div class="card-header bg-info text-white vertical-align:middle;" style="font-size:150%">
				${description}
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
					${description_detail}
                </div>                
                <div class="row fileUpload" style="margin-bottom: 3%; padding-top:3%; padding-left:5%" >
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
    * 04: Taiwan-stay-dates 在臺停留日期
    */
    async function setTaiwanStayDates(){
		let item_id = '04';
			
		let cardHtml04 = `
        <div class="card border-info" style="border-width: thick; margin-bottom: 3%;">
            <div class="card-header bg-info text-white vertical-align:middle;" style="font-size:150%">
			在臺停留日期
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
					<ol>
						<li>
							報名截止日往前推算僑居地居留期間內，如有某一年來臺停留超過 120 天，請上傳證明文件。
						</li>
						<li>
							僅接受副檔名為 pdf 的<font color="red">單一</font>檔案，檔案大小需<font color="red">小於 8 Mbytes</font>。
						</li>
					</ol>
                </div>                
                <div class="row fileUpload" style="margin-bottom: 3%; padding-top:3%; padding-left:5%" >
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
		let description ='';
		let description_detail ='';

		if (studentdata.student_qualification_verify.identity == 1){ // 港澳生
			description = '港澳生聲明書';
			description_detail = '請下載「<a href="https://drive.google.com/file/d/1acUuHGK4iRYE5E1-y8ZJo4kCEN-AGi4T/view?usp=sharing" target="_blank">港澳生聲明書</a>」，列印並填寫後，掃描為 PDF 檔上傳。';
		}

		if (studentdata.student_qualification_verify.identity == 2){ // 港澳生具外國國籍
			description = '港澳具外國國籍之華裔學生切結書';
			description_detail = '請下載「<a href="https://drive.google.com/file/d/1XPxGDC-KaQRdn7YYWw4kx5z1ZeS-beAH/view?usp=sharing" target="_blank">港澳具外國國籍之華裔學生切結書</a>」，列印並填寫後，掃描為 PDF 檔上傳。';
		}
			
		let cardHtml05 = `
        <div class="card border-info" style="border-width: thick; margin-bottom: 3%;">
            <div class="card-header bg-info text-white vertical-align:middle;" style="font-size:150%">
				${description}
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
					${description_detail}
                </div>                
                <div class="row fileUpload" style="margin-bottom: 3%; padding-top:3%; padding-left:5%" >
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
					請上傳兩吋彩色正面半身脫帽白底近照 pdf 檔案，相片規格請參考<a href="https://reurl.cc/521KVz" target="_blank">香港特別行政區旅行證件規定</a>
                </div>                
                <div class="row fileUpload" style="margin-bottom: 3%; padding-top:3%; padding-left:5%" >
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
			港澳居民來往內地通行證(回鄉證)
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
					僅接受副檔名為 pdf 的<font color="red">單一</font>檔案，檔案大小需<font color="red">小於 8 Mbytes</font>。
                </div>                
                <div class="row fileUpload" style="margin-bottom: 3%; padding-top:3%; padding-left:5%" >
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
					<ol>
						<li>
							非必要文件，曾改名適用。
						</li>
						<li>
							僅接受副檔名為 pdf 的<font color="red">單一</font>檔案，檔案大小需<font color="red">小於 8 Mbytes</font>。
						</li>
					</ol>
                </div>                
                <div class="row fileUpload" style="margin-bottom: 3%; padding-top:3%; padding-left:5%" >
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

		let description ='';
		let description_detail ='';

		if (studentdata.student_qualification_verify.system_id == 1){ // 學士班
			description = '高中畢業證書/在學證明/學生證';
			description_detail = `
				<ol>
					<li>
						請上傳<font color="red">高中</font>畢業證書或修業證明書，如為應屆中六生，可先上傳本學期在學證明書或學生證。
					</li>
					<li>
						香港以外學校之學歷證件應先經學歷取得地之我政府駐外機構（各地駐外機構可至<a href="https://www.boca.gov.tw/" target="_blank">外交部領事事務局</a>查詢）驗證；大陸地區（含設校或分校於大陸地區之外國學校）學歷證件，應先經大陸地區公證處公證，並經行政院設立或指定之機構或委託之民間團體驗證。至於大陸地區臺商學校之學歷同我國同級學校學歷，故無須經公證或驗證。
					</li>
					<li>
						僅接受副檔名為 pdf 的<font color="red">單一</font>檔案，檔案大小需<font color="red">小於 8 Mbytes</font>。
					</li>
				</ol>
			`;
		}else if (studentdata.student_qualification_verify.system_id == 2){ // 港二技
			description = '經驗證之全日制副學士或高級文憑(含)以上學位畢業證書/在學證明/學生證';
			description_detail = `
				<ol>
					<li>
						請上傳<font color="red">經驗證之全日制副學士或高級文憑(含)以上學位</font>畢業證書或修業證明書，如為應屆畢業生，可先上傳本學期在學證明書或學生證。
					</li>
					<li>
						經教育部認可之香港、澳門當地大學或研究所學歷證件應經我政府駐港澳機構（台北經濟文化辦事處）驗證；倘為香港、澳門以外之外國學歷證件須經由學歷完成地之我政府駐外機構驗證；大陸地區（含設校或分校於大陸地區之外國學校）學歷證件，應先經大陸地區公證處公證，並經行政院設立或指定之機構或委託之民間團體驗證。
					</li>
					<li>
						學歷證件應先經台北經濟文化辦事處（香港灣仔港灣道18號中環廣場49樓4907-4908室）驗證。
					</li>
					<li>
						僅接受副檔名為 pdf 的<font color="red">單一</font>檔案，檔案大小需<font color="red">小於 8 Mbytes</font>。
					</li>
				</ol>
			`;
		}else if (studentdata.student_qualification_verify.system_id == 3 || studentdata.student_qualification_verify.system_id == 4){ // 港二技
			description = '經驗證之學士或碩士畢業證書/在學證明/學生證';
			description_detail = `
				<ol>
					<li>
						請上傳<font color="red">經驗證之學士或碩士</font>畢業證書或修業證明書，如為應屆畢業生，可先上傳本學期在學證明書或學生證。
					</li>
					<li>
					經教育部認可之香港、澳門當地大學或研究所學歷證件應經我政府駐港澳機構（台北經濟文化辦事處）驗證；倘為香港、澳門以外之外國學歷證件須經由學歷完成地之我政府駐外機構驗證；大陸地區（含設校或分校於大陸地區之外國學校）學歷證件，應先經大陸地區公證處公證，並經行政院設立或指定之機構或委託之民間團體驗證。
					</li>
					<li>
						僅接受副檔名為 pdf 的<font color="red">單一</font>檔案，檔案大小需<font color="red">小於 8 Mbytes</font>。
					</li>
				</ol>
			`;
		}
			
		let cardHtml09 = `
        <div class="card border-info" style="border-width: thick; margin-bottom: 3%;">
            <div class="card-header bg-info text-white vertical-align:middle;" style="font-size:150%">
				${description}
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
                    ${description_detail}
                </div>                
                <div class="row fileUpload" style="margin-bottom: 3%; padding-top:3%; padding-left:5%" >
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
		let description_detail ='';

		if (studentdata.student_qualification_verify.system_id == 1){
			description = '高中最後三年成績單';
			description_detail = `
				<ol>
					<li>
						請上傳<font color="red">高中</font>最後三年成績單，如為應屆中六生，當學期成績尚未取得，免附該學期成績單。
					</li>
					<li>
						香港以外學校之學歷證件應先經學歷取得地之我政府駐外機構（各地駐外機構可至<a href="https://www.boca.gov.tw/" target="_blank">外交部領事事務局</a>查詢）驗證；大陸地區（含設校或分校於大陸地區之外國學校）學歷證件，應先經大陸地區公證處公證，並經行政院設立或指定之機構或委託之民間團體驗證。至於大陸地區臺商學校之學歷同我國同級學校學歷，故無須經公證或驗證。
					</li>
					<li>
						僅接受副檔名為 pdf 的<font color="red">單一</font>檔案，檔案大小需<font color="red">小於 8 Mbytes</font>。
					</li>
				</ol>
			`;
		}
		else if(studentdata.student_qualification_verify.system_id == 2){
			description = '經驗證之副學士或高級文憑(含)以上學位之歷年成績單';
			description_detail = `
					<ol>
						<li>
							請上傳<font color="red">經驗證之全日制副學士或高級文憑(含)以上學位</font>之歷年成績單，如為應屆畢業生，當學期成績尚未取得，免附該學期成績單。
						</li>
						<li>
							經教育部認可之香港、澳門當地大學或研究所學歷證件應經我政府駐港澳機構（台北經濟文化辦事處）驗證；倘為香港、澳門以外之外國學歷證件須經由學歷完成地之我政府駐外機構驗證；大陸地區（含設校或分校於大陸地區之外國學校）學歷證件，應先經大陸地區公證處公證，並經行政院設立或指定之機構或委託之民間團體驗證。
						</li>
						<li>
							學歷證件應先經台北經濟文化辦事處（香港灣仔港灣道18號中環廣場49樓4907-4908室）驗證。
						</li>
						<li>
							僅接受副檔名為 pdf 的<font color="red">單一</font>檔案，檔案大小需<font color="red">小於 8 Mbytes</font>。
						</li>
				</ol>
			`;
		}
		else if(studentdata.student_qualification_verify.system_id == 3 || 
			studentdata.student_qualification_verify.system_id == 4){
			description = '經驗證之學士或碩士成績單';
			description_detail = `
				<ol>
					<li>請上傳<font color="red">經驗證之學士或碩士</font>成績單，如為應屆畢業生，當學期成績尚未取得，免附該學期成績單。</li>
					<li>經教育部認可之香港、澳門當地大學或研究所學歷證件應經我政府駐港澳機構（台北經濟文化辦事處）驗證；倘為香港、澳門以外之外國學歷證件須經由學歷完成地之我政府駐外機構驗證；大陸地區（含設校或分校於大陸地區之外國學校）學歷證件，應先經大陸地區公證處公證，並經行政院設立或指定之機構或委託之民間團體驗證。</li>
					<li>僅接受副檔名為 pdf 的<font color="red">單一</font>檔案，檔案大小需<font color="red">小於 8 Mbytes</font>。</li>
				</ol>
			`;
		}
			
		let cardHtml10 = `
        <div class="card border-info" style="border-width: thick; margin-bottom: 3%;">
            <div class="card-header bg-info text-white vertical-align:middle;" style="font-size:150%">
			${description}
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
                    ${description_detail}
                </div>                
                <div class="row fileUpload" style="margin-bottom: 3%; padding-top:3%; padding-left:5%" >
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

		let description_detail ='';

		if (studentdata.student_qualification_verify.system_id == 1 || studentdata.student_qualification_verify.system_id == 2){
			description_detail = `
			請下載「<a href='https://drive.google.com/file/d/1Br77VQiBG5MwPDvIBQ4KLfCP77MLoYWg/view?usp=sharing' target='_blank'>學歷屬實及授權查證切結書</a>」，列印並填寫後，掃描為 PDF 檔上傳。
			`;
		}
		else if(studentdata.student_qualification_verify.system_id == 3 ||studentdata.student_qualification_verify.system_id == 4 ){
			description_detail = `
			請下載「<a href='https://drive.google.com/file/d/1cmp6MS6L-ESCH2q_Y1KZ8B7WtUmwvQSu/view?usp=sharing' target='_blank'>學歷屬實及授權查證切結書</a>」，列印並填寫後，掃描為 PDF 檔上傳。
			`;
		}
			
		let cardHtml11 = `
        <div class="card border-info" style="border-width: thick; margin-bottom: 3%;">
            <div class="card-header bg-info text-white vertical-align:middle;" style="font-size:150%">
			學歷屬實及授權查證切結書
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
					${description_detail}
                </div>                
                <div class="row fileUpload" style="margin-bottom: 3%; padding-top:3%; padding-left:5%" >
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
    * 12: olympia: 國際數理奧林匹亞競賽或美國國際科展獎項證明
    */
    async function setOlympia(){
		let item_id = '12';
			
		let cardHtml12 = `
        <div class="card border-info" style="border-width: thick; margin-bottom: 3%;">
            <div class="card-header bg-info text-white vertical-align:middle;" style="font-size:150%">
			國際數理奧林匹亞競賽或美國國際科展獎項證明
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
					僅接受副檔名為 pdf 的<font color="red">單一</font>檔案，檔案大小需<font color="red">小於 8 Mbytes</font>。
                </div>                
                <div class="row fileUpload" style="margin-bottom: 3%; padding-top:3%; padding-left:5%" >
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
		let description_detail ='';

		description_detail = `
			<ol>
				<li>
					請上傳「香港中學文憑考試」或「香港高級程度會考」或「香港中學會考」或「SAT Subject Test測驗」或「海外A Level」或「國際文憑預科課程（IBDP）考試」成績文憑證書。
				</li>
				<li>
					僅接受副檔名為 pdf 的<font color="red">單一</font>檔案，檔案大小需<font color="red">小於 8 Mbytes</font>。
				</li>
			</ol>
		`;
			
		let cardHtml13 = `
        <div class="card border-info" style="border-width: thick; margin-bottom: 3%;">
            <div class="card-header bg-info text-white vertical-align:middle;" style="font-size:150%">
			採計文憑成績證書
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
                    ${description_detail}
                </div>                
                <div class="row fileUpload" style="margin-bottom: 3%; padding-top:3%; padding-left:5%" >
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
					請下載「<a href="https://drive.google.com/file/d/1X3ghIiT6h0j65ISPllcm5Ic77I9h8PFr/view?usp=sharing" target="_blank">成績採計資料參考表</a>」，列印並填寫後，掃描為PDF檔上傳。
                </div>                
                <div class="row fileUpload" style="margin-bottom: 3%; padding-top:3%; padding-left:5%" >
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

	/*
    * 15: hk-mo-relations-ordinance: 符合港澳關係條例切結書
    */
    async function sethkmoRelationsOrdinance(){
		let item_id = '15';
			
		let cardHtml15 = `
        <div class="card border-info" style="border-width: thick; margin-bottom: 3%;">
            <div class="card-header bg-info text-white vertical-align:middle;" style="font-size:150%">
			符合港澳關係條例切結書
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
				請下載「<a href='https://drive.google.com/file/d/18G7eW7x_m84FTaul6x5RN1fufcbc6ucg/view?usp=sharing' target='_blank'>符合港澳關係條例切結書</a>」，列印並填寫後，掃描為 PDF 檔上傳。
                </div>                
                <div class="row fileUpload" style="margin-bottom: 3%; padding-top:3%; padding-left:5%" >
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
			document.getElementById("uploadArea_hkmoRelationsOrdinance").innerHTML=eval("cardHtml"+item_id);
			if( ifhasfile == "true"){
				// 有檔案
                _getFileAreaHTML(item_id,'uploadArea_hkmoRelationsOrdinance');
				$('#uploadArea_hkmoRelationsOrdinance_file').show();
			}
			else{
                // 沒檔案
				$('#uploadArea_hkmoRelationsOrdinance_file').hide();
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
    * 16: tech-course-passed-proof: 就讀全日制副學士或高級文憑課程已通過香港資歷架構第四級之證明文件
    */
    async function setTechCoursePassedProof(){
		let item_id = '16';
			
		let cardHtml16 = `
        <div class="card border-info" style="border-width: thick; margin-bottom: 3%;">
            <div class="card-header bg-info text-white vertical-align:middle;" style="font-size:150%">
				就讀全日制副學士或高級文憑(含)以上學位課程已通過香港資歷架構第四級(含)以上之證明文件
            </div>
            <div class="card-body">
                <div class="row" style="padding-left:5%">
					<ol>
						<li>
							請上傳至<a href="http://www.hkqr.gov.hk/" target="_blank">資歷名冊</a>網站查詢並下載就讀課程之資歷記錄詳情，或經香港當地政府權責機關、專業評鑑團體認可評審通過之證明文件。
						</li>
						<li>
							僅接受副檔名為 pdf 的<font color="red">單一</font>檔案，檔案大小需<font color="red">小於 8 Mbytes</font>。
						</li>
					</ol>
                </div>                
                <div class="row fileUpload" style="margin-bottom: 3%; padding-top:3%; padding-left:5%" >
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
			document.getElementById("uploadArea_techCoursePassedProof").innerHTML=eval("cardHtml"+item_id);
			if( ifhasfile == "true"){
				// 有檔案
                _getFileAreaHTML(item_id,'uploadArea_techCoursePassedProof');
				$('#uploadArea_techCoursePassedProof_file').show();
			}
			else{
                // 沒檔案
				$('#uploadArea_techCoursePassedProof_file').hide();
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

		const data_name_map = [
			'',
            'ID-card', // 香港永久性居民身份證正面
            'quit-school', // 自願退學證明
            'overseas-stay-years', // 海外居留年限切結書
            'Taiwan-stay-dates', //在台停留日期
            'hk-or-mo-guarantee', // 港澳生聲明書 / 港澳具外國國籍之華裔學生切結書
            'head-shot', // 2吋相片
            'home-return-permit', // 回鄉證
            'change-of-name', // 改名契
            'diploma', // 畢業證書/在學證明/學生證
            'scholl-transcript', // 高中最後三年成績單（應屆當學期可免附）
            'authorize-check-diploma', // 學歷屬實及授權查證切結書
            'olympia', // 國際數理奧林匹亞競賽或美國國際科展僅像證明
            'placement-transcript', // 採計文憑成績證書
            'transcript-reference-table', // 成績採計資料參考表
            'hk-mo-relations-ordinance', // 符合港澳關係條例切結書
            'tech-course-passed-proof' // 就讀全日制副學士或高級文憑課程已通過香港資歷架構第四級之證明文件
        ];
		const data_name = _userID+"_"+data_name_map[parseInt(_itemId)];

		const dummy_id = Math.floor(Math.random() * 1000000); + Math.floor(Math.random() * 1111111);

		// pdf 顯示分別做不同處理
        reviewItemHTML = `
        <div class="card">
            <div class="card-body" style="margin: 0 auto">
                <h4 class="card-title"><span>已上傳檔案</span> </h4>
				<embed src="${env.baseUrl}/students/${_userID}/upload-identity-verification/item/${_itemId}/file/${data_name}?dummy=${dummy_id}" width="500" height="375" type="application/pdf">
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

		let item;
		try {
			loading.start();
			item =  $(this).data('item') ;
			
			const response = await student.delIdentityVerificationItem({user_id: _userID, itemId: item});
			if (!response.ok) { throw response; }
			// const fileNameOfSubject = await response.json();
			// var _filename = fileNameOfSubject.files[0];


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
			'14':'setTranscriptReferenceTable()',
			'15':'sethkmoRelationsOrdinance()',
			'16':'setTechCoursePassedProof()'
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
