(() => {
	/**
	*	private variable
	*/
    let _userID; // 報名序號
	let studentdata;
	let birth_location;
	let item_block = [
		{},
		{
			element: 'uploadArea_IDCard',
			title: ['香港永久居民身份證正面','澳門永久居民身份證正/反面'],
			description: ['']
		},{
			element: 'uploadArea_quitSchool',
			title: ['自願退學證明'],
			description: ['']
		},{
			element: 'uploadArea_overseasStayYears',
			title: ['境外居留年限切結書','海外居留年限切結書'],
			description: ['請下載「<a href="https://drive.google.com/file/d/1_OVM9tPL0dycOVj9M3Qxsu3gldgLI6-5/view" target="_blank">境外居留年限切結書</a>」，列印並填寫後，掃描為 PDF 檔上傳。',
			'請下載「<a href="https://drive.google.com/file/d/1Am6U_RAdio7E0UNY6gFMyccTENJS80Mo/view?usp=sharing" target="_blank">海外居留年限切結書</a>」，列印並填寫後，掃描為 PDF 檔上傳。']
		},{
			element: 'uploadArea_TaiwanStayDates',
			title: ['在臺停留日期'],
			description: ['報名截止日往前推算僑居地居留期間內，如有某一年來臺停留超過 120 天，請上傳證明文件。']
		},{
			element: 'uploadArea_HKorMOGuarantee',
			title: ['港澳生聲明書','港澳具外國國籍之華裔學生切結書'],
			description: ['請下載「<a href="https://drive.google.com/file/d/1acUuHGK4iRYE5E1-y8ZJo4kCEN-AGi4T/view?usp=sharing" target="_blank">港澳生聲明書</a>」，列印並填寫後，掃描為 PDF 檔上傳。',
			'請下載「<a href="https://drive.google.com/file/d/1XPxGDC-KaQRdn7YYWw4kx5z1ZeS-beAH/view?usp=sharing" target="_blank">港澳具外國國籍之華裔學生切結書</a>」，列印並填寫後，掃描為 PDF 檔上傳。']
		},{
			element: 'uploadArea_headshot',
			title: ['2吋相片'],
			description: ['請上傳兩吋彩色正面半身脫帽白底近照 pdf 檔案，相片規格請參考<a href="https://reurl.cc/521KVz" target="_blank">香港特別行政區旅行證件規定</a>',
			'請上傳兩吋彩色正面半身脫帽白底近照 pdf 檔案，相片規格請參考<a href="https://www.dsi.gov.mo/documents/new_photo_format_c.pdf" target="_blank">澳門特別行政區旅行證件規定</a>']
		},{
			element: 'uploadArea_homeReturnPermit',
			title: ['港澳居民來往內地通行證(回鄉證)'],
			description: ['']
		},{
			element: 'uploadArea_changeOfName',
			title: ['改名契'],
			description: ['非必要文件，曾改名適用。']
		},{
			element: 'uploadArea_diploma',
			title: ['高中畢業證書/在學證明/學生證','經驗證之全日制副學士或高級文憑(含)以上學位畢業證書/在學證明/學生證','經驗證之學士或碩士畢業證書/在學證明/學生證','學士或碩士畢業證書/在學證明/學生證'],
			description: ['<ol><li>請上傳<font color="red">高中</font>畢業證書或修業證明書，如為應屆中六生，可先上傳本學期在學證明書或學生證。</li><li>香港以外學校之學歷證件應先經學歷取得地之我政府駐外機構（各地駐外機構可至<a href="https://www.boca.gov.tw/" target="_blank">外交部領事事務局</a>查詢）驗證；大陸地區（含設校或分校於大陸地區之外國學校）學歷證件，應先經大陸地區公證處公證，並經行政院設立或指定之機構或委託之民間團體驗證。至於大陸地區臺商學校之學歷同我國同級學校學歷，故無須經公證或驗證。</li></ol>',
			'<ol><li>請上傳<font color="red">經驗證之全日制副學士或高級文憑(含)以上學位</font>畢業證書或修業證明書，如為應屆畢業生，可先上傳本學期在學證明書或學生證。</li><li>經教育部認可之香港、澳門當地大學或研究所學歷證件應經我政府駐港澳機構（台北經濟文化辦事處）驗證；倘為香港、澳門以外之外國學歷證件須經由學歷完成地之我政府駐外機構驗證；大陸地區（含設校或分校於大陸地區之外國學校）學歷證件，應先經大陸地區公證處公證，並經行政院設立或指定之機構或委託之民間團體驗證。</li><li>學歷證件應先經台北經濟文化辦事處（香港灣仔港灣道18號中環廣場49樓4907-4908室）驗證。</li></ol>',
			'<ol><li>請上傳<font color="red">經驗證之學士或碩士</font>畢業證書或修業證明書，如為應屆畢業生，可先上傳本學期在學證明書或學生證。</li><li>經教育部認可之香港、澳門當地大學或研究所學歷證件應經我政府駐港澳機構（台北經濟文化辦事處）驗證；倘為香港、澳門以外之外國學歷證件須經由學歷完成地之我政府駐外機構驗證；大陸地區（含設校或分校於大陸地區之外國學校）學歷證件，應先經大陸地區公證處公證，並經行政院設立或指定之機構或委託之民間團體驗證。</li></ol>',
			'<ol><li>請上傳<font color="red">高中</font>畢業證書或修業證明書，如為應屆中六生，可先上傳由<strong class="text-danger">教青局核發</strong>之學生證及學生證二維碼掃描查詢結果文件。</li><li>澳門以外學校之學歷證件應先經學歷取得地之我政府駐外機構（各地駐外機構可至<a href="https://www.boca.gov.tw/" target="_blank">外交部領事事務局</a>查詢）驗證；大陸地區（含設校或分校於大陸地區之外國學校）學歷證件，應先經大陸地區公證處公證，並經行政院設立或指定之機構或委託之民間團體驗證。至於大陸地區臺商學校之學歷同我國同級學校學歷，故無須經公證或驗證。</li></ol>',
			'請上傳學士或碩士畢業證書或修業證明書（應屆畢業生，請上傳本學期在學證明書或學生證）。<br><br><small>註：<ol><li>持澳門學歷者請逕攜帶學歷證件正本至台北經濟文化辦事處 (澳門辦事處)辦理核驗。</li><li>核驗前，如申請人係持香港、澳門以外之外國學歷證件須先經由學歷完成地之我政府駐外機構驗證；大陸地區之學歷證件（畢業證書、學位證書、歷年成績單），應先經大陸地區指定之機構或委託民間團體辦理認證 (學歷採認流程詳見<a href="https://drive.google.com/file/d/1QFdtOnMxLjeFxsvT5AZFg9kj_Rc0EPKa/view?usp=sharing" target="_blank">附檔</a>)。</li></small>']
		},{
			element: 'uploadArea_schollTranscript',
			title: ['高中最後三年成績單','經驗證之副學士或高級文憑(含)以上學位之歷年成績單','經驗證之學士或碩士成績單','學士或碩士歷年成績單'],
			description: ['<ol><li>請上傳<font color="red">高中</font>最後三年成績單，如為應屆中六生，當學期成績尚未取得，免附該學期成績單。</li><li>香港以外學校之學歷證件應先經學歷取得地之我政府駐外機構（各地駐外機構可至<a href="https://www.boca.gov.tw/" target="_blank">外交部領事事務局</a>查詢）驗證；大陸地區（含設校或分校於大陸地區之外國學校）學歷證件，應先經大陸地區公證處公證，並經行政院設立或指定之機構或委託之民間團體驗證。至於大陸地區臺商學校之學歷同我國同級學校學歷，故無須經公證或驗證。</li></ol>',
			'<ol><li>請上傳<font color="red">經驗證之全日制副學士或高級文憑(含)以上學位</font>之歷年成績單，如為應屆畢業生，當學期成績尚未取得，免附該學期成績單。</li><li>經教育部認可之香港、澳門當地大學或研究所學歷證件應經我政府駐港澳機構（台北經濟文化辦事處）驗證；倘為香港、澳門以外之外國學歷證件須經由學歷完成地之我政府駐外機構驗證；大陸地區（含設校或分校於大陸地區之外國學校）學歷證件，應先經大陸地區公證處公證，並經行政院設立或指定之機構或委託之民間團體驗證。</li><li>學歷證件應先經台北經濟文化辦事處（香港灣仔港灣道18號中環廣場49樓4907-4908室）驗證。</li></ol>',
			'<ol><li>請上傳<font color="red">經驗證之學士或碩士</font>成績單，如為應屆畢業生，當學期成績尚未取得，免附該學期成績單。</li><li>經教育部認可之香港、澳門當地大學或研究所學歷證件應經我政府駐港澳機構（台北經濟文化辦事處）驗證；倘為香港、澳門以外之外國學歷證件須經由學歷完成地之我政府駐外機構驗證；大陸地區（含設校或分校於大陸地區之外國學校）學歷證件，應先經大陸地區公證處公證，並經行政院設立或指定之機構或委託之民間團體驗證。</li></ol>',
			'<ol><li>請上傳<font color="red">高中</font>最後三年成績單，如為應屆中六生，當學期成績尚未取得，免附該學期成績單。</li><li>澳門以外學校之學歷證件應先經學歷取得地之我政府駐外機構（各地駐外機構可至<a href="https://www.boca.gov.tw/" target="_blank">外交部領事事務局</a>查詢）驗證；大陸地區（含設校或分校於大陸地區之外國學校）學歷證件，應先經大陸地區公證處公證，並經行政院設立或指定之機構或委託之民間團體驗證。至於大陸地區臺商學校之學歷同我國同級學校學歷，故無須經公證或驗證。</li></ol>',
			'請上傳學士或碩士歷年成績單（應屆畢業生，當學期成績尚未取得，免附該學期成績單）。<br><br><small>註：<ol><li>持澳門學歷者請逕攜帶學歷證件正本至台北經濟文化辦事處 (澳門辦事處)辦理核驗。</li><li>核驗前，如申請人係持香港、澳門以外之外國學歷證件須先經由學歷完成地之我政府駐外機構驗證；大陸地區之學歷證件（畢業證書、學位證書、歷年成績單），應先經大陸地區指定之機構或委託民間團體辦理認證 (學歷採認流程詳見<a href="https://drive.google.com/file/d/1QFdtOnMxLjeFxsvT5AZFg9kj_Rc0EPKa/view?usp=sharing" target="_blank">附檔</a>)。</li></small>']
		},{
			element: 'uploadArea_authorizeCheckDiploma',
			title: ['學歷屬實及授權查證切結書'],
			description: ["請下載「<a href='https://drive.google.com/file/d/1Br77VQiBG5MwPDvIBQ4KLfCP77MLoYWg/view?usp=sharing' target='_blank'>學歷屬實及授權查證切結書</a>」，列印並填寫後，掃描為 PDF 檔上傳。",
			"請下載「<a href='https://drive.google.com/file/d/1cmp6MS6L-ESCH2q_Y1KZ8B7WtUmwvQSu/view?usp=sharing' target='_blank'>學歷屬實及授權查證切結書</a>」，列印並填寫後，掃描為 PDF 檔上傳。"]
		},{
			element: 'uploadArea_olympia',
			title: ['國際數理奧林匹亞競賽或美國國際科展獎項證明'],
			description: ['']
		},{
			element: 'uploadArea_placementTranscript',
			title: ['採計文憑成績證書'],
			description: ['請上傳「香港中學文憑考試」或「香港高級程度會考」或「香港中學會考」或「SAT Subject Test測驗」或「海外A Level」或「國際文憑預科課程（IBDP）考試」成績文憑證書。',
			'<ol><li>持外國學歷者，請上傳「SAT Subject Test測驗」或「海外A Level」或「國際文憑預科課程（IBDP）考試」成績文憑證書。</li></ol>']
		},{
			element: 'uploadArea_transcriptReferenceTable',
			title: ['成績採計資料參考表'],
			description: ['請下載「<a href="https://drive.google.com/file/d/1X3ghIiT6h0j65ISPllcm5Ic77I9h8PFr/view?usp=sharing" target="_blank">成績採計資料參考表</a>」，列印並填寫後，掃描為PDF檔上傳。',
			'請下載「<a href="" target="_blank">成績採計資料參考表</a>」，列印並填寫後，掃描為PDF檔上傳。']
		},{
			element: 'uploadArea_hkmoRelationsOrdinance',
			title: ['符合港澳關係條例切結書'],
			description: ["請下載「<a href='https://drive.google.com/file/d/18G7eW7x_m84FTaul6x5RN1fufcbc6ucg/view?usp=sharing' target='_blank'>符合港澳關係條例切結書</a>」，列印並填寫後，掃描為 PDF 檔上傳。"]
		},{
			element: 'uploadArea_techCoursePassedProof',
			title: ['就讀全日制副學士或高級文憑(含)以上學位課程已通過香港資歷架構第四級(含)以上之證明文件'],
			description: ['<ol><li>請上傳至<a href="http://www.hkqr.gov.hk/" target="_blank">資歷名冊</a>網站查詢並下載就讀課程之資歷記錄詳情，或經香港當地政府權責機關、專業評鑑團體認可評審通過之證明文件。</li></ol>']
		},{
			element: 'uploadArea_passport',
			title: ['外國護照（香港或澳門以外）'],
			description: ['']
		},{
			element: 'uploadArea_languageProficiency',
			title: ['語文能力說明或相關證明文件'],
			description: ['']
		}
	];

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

			// 取得學生上傳簡章規定文件的代號
			const studentItemList = await student.getStudentItemList(_userID, 'all');
			if (!studentItemList.ok) { throw studentItemList; }
			const studentItemListJson = await studentItemList.json();

			if(progressJson.student_qualification_verify.system_id == 1 && !progressJson.student_misc_data.admission_placement_apply_way_data){
				await swal({title: "請先選擇成績採計方式！", type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
				location.href = "./grade.html";
			}

            // 僑居地為港澳
			if(progressJson.student_personal_data_detail.resident_location == '香港' ||
				progressJson.student_personal_data_detail.resident_location == '澳門'
			){
				for (let i=1; i<item_block.length; i++) {
					// 自願退學證明 (曾分發來台 && 經輔導來台就學後因故退學或喪失國籍返回僑居地)
					if (i==2 && progressJson.student_qualification_verify.reason_selection_of_come_to_taiwan != 2 ) {
						continue;
					}
					// 海外居留年限：未滿六 or 滿六未滿八
					if (i==3 && progressJson.student_qualification_verify.overseas_residence_time != 2 &&
						progressJson.student_qualification_verify.overseas_residence_time != 4){
						continue;
					}
					// 凡在台停留超過 120 天
					if (i==4 && progressJson.student_qualification_verify.reason_selection_of_stay_over_120_days_in_taiwan == null) {
						continue;
					}
					// (必填)港澳生：聲明書; 港澳具外國國籍：切結書
					if (i==5 && progressJson.student_qualification_verify.identity != 1 &&
						progressJson.student_qualification_verify.identity != 2) {
							continue;
					}
					// 回鄉證，出生地為大陸 7
					if (i==7 && birth_location != 135) {
						continue;
					}
					// 學士班 不去僑先部(code != 16)
					if (progressJson.student_misc_data.admission_placement_apply_way != null && progressJson.student_misc_data.admission_placement_apply_way_data.code != 16 && progressJson.student_qualification_verify.system_id == 1) {
						// 國際數理奧林匹亞競賽或美國國際科展獎項證明  12
						if (i==12 && !progressJson.student_misc_data.has_olympia_aspiration) {
							continue;
						}
						// 不參加聯合分發/去僑先部/僅持 DSE 當年度成績/中學最後三年成績/持澳門學歷，皆不需上傳採計文憑成績證書 13
						if ( i==13 && (
							(
								progressJson.student_misc_data.admission_placement_apply_way_data.code == '23' &&
								progressJson.student_misc_data.year_of_hk_dse == env.year &&
								progressJson.student_misc_data.year_of_hk_ale == null &&
								progressJson.student_misc_data.year_of_hk_cee == null
							) ||
							progressJson.student_misc_data.admission_placement_apply_way == "1" ||
							progressJson.student_misc_data.admission_placement_apply_way_data.code == "26" ||
							progressJson.student_misc_data.admission_placement_apply_way_data.code == '05'
						)){
							continue;
						}
						if( i==13
							&& progressJson.student_misc_data.admission_placement_apply_way_data.code == '23'
							&& (progressJson.student_misc_data.year_of_hk_dse ? progressJson.student_misc_data.year_of_hk_dse : '').includes(env.year)
						){
							item_block[i].description[0] = `
								<ol>
									<li>${item_block[i].description[0]}</li>
									<li>已報考${env.year}年度香港中學文憑考試者，此階段無需上傳${env.year}香港中學文憑考試成績，海聯會將逕向香港考評局提取；除${env.year}香港中學文憑考試成績外，請務必上傳其他年度採計文憑成績證書。</li>
								</ol>
							`;
						}

						// 為DSE ALE CEE/持澳門學歷，不需上傳成績採計參考表  14
						if (i==14 && (
							progressJson.student_misc_data.admission_placement_apply_way_data.code == '23' ||
							progressJson.student_misc_data.admission_placement_apply_way == '1' ||
							progressJson.student_misc_data.admission_placement_apply_way_data.code == '05'
						)){
							continue;
						}

					} else if (i==12 || i==13 || i==14) {
						continue;
					}
					// 符合港澳關係條例切結書 港澳生 + 在台設有戶籍 + 持外國護照（但不限回歸前葡萄牙護照）
					if (i==15 && !(
						progressJson.student_qualification_verify.identity == 1 &&
						progressJson.student_qualification_verify.taiwan_census == 1 &&
						progressJson.student_qualification_verify.except_HK_Macao_passport == 1 &&
						(
							progressJson.student_qualification_verify.first_get_portugal_passport_at > '1999/12/19' ||
							progressJson.student_qualification_verify.which_nation_passport != null
						)
					)){
						continue;
					}
					// 港二技學歷完成地在香港者需要上傳已通過香港資歷架構第四級(含)以上之證明文件
					if (i==16 && (progressJson.student_qualification_verify.system_id != 2 || progressJson2.student_personal_data.school_country != 113)) {
						continue;
					}
					// 港澳具外國國籍的學生要上傳外國護照
					if (i==17 && progressJson.student_qualification_verify.identity != 2) {
						continue;
					}

					// 根據志願是否有選擇重點產業系所來顯示上傳語言能力證明欄位
					if (i==18 && !studentItemListJson.includes('18')) {
						continue;
					}

					await setBlocks(i);
				}
			}

            loading.complete();
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
			loading.complete();
		}
	}

	// 渲染欄位
	async function setBlocks(item_id) {
        try {
			loading.start();
			let itemId = (item_id < 10)? '0' + item_id.toString(): item_id.toString();
			// 檢查檔案是否存在
			const response = await student.getIdentityVerificationItem({user_id: _userID, item: itemId});
			if (!response.ok) { throw response; }

			// 依條件選擇標題及說明文字
			let title ='';
			let description = '';
			switch (item_id) {
				case 1:
					if (studentdata.student_personal_data_detail.resident_location == '澳門') {
						title = item_block[item_id].title[1];
					} else if (studentdata.student_personal_data_detail.resident_location == '香港') {
						title = item_block[item_id].title[0];
					}
					description = item_block[item_id].description;
					break;
				case 3:
				case 5:
					if (studentdata.student_qualification_verify.identity == 1) {
						title = item_block[item_id].title[0];
						description = item_block[item_id].description[0];
					} else if (studentdata.student_qualification_verify.identity == 2) {
						title = item_block[item_id].title[1];
						description = item_block[item_id].description[1];
					}
					break;
				case 6:
					if (studentdata.student_personal_data_detail.resident_location == '澳門') {
						description = item_block[item_id].description[1];
					} else if (studentdata.student_personal_data_detail.resident_location == '香港') {
						description = item_block[item_id].description[0];
					}
					break;
				case 9:
				case 10:
					if (studentdata.student_qualification_verify.system_id == 1){ // 學士班
						title = item_block[item_id].title[0];
						if (studentdata.student_personal_data_detail.resident_location == '香港') {
							description = item_block[item_id].description[0];
						} else if (studentdata.student_personal_data_detail.resident_location == '澳門') {
							description = item_block[item_id].description[3];
						}
					}else if (studentdata.student_qualification_verify.system_id == 2){ // 港二技
						title = item_block[item_id].title[1];
						description = item_block[item_id].description[1];
					}else if (studentdata.student_qualification_verify.system_id == 3 || studentdata.student_qualification_verify.system_id == 4){ // 碩博
						title = item_block[item_id].title[2];
						description = item_block[item_id].description[2];
						if (studentdata.student_personal_data_detail.resident_location == '香港') {
							title = item_block[item_id].title[2];
							description = item_block[item_id].description[2];
						} else if (studentdata.student_personal_data_detail.resident_location == '澳門') {
							title = item_block[item_id].title[3];
							description = item_block[item_id].description[4];
						}
					}
					break;
				case 11:
					if (studentdata.student_qualification_verify.system_id == 1 || studentdata.student_qualification_verify.system_id == 2){ // 學士班
						description = item_block[item_id].description[0];
					}else if (studentdata.student_qualification_verify.system_id == 3 || studentdata.student_qualification_verify.system_id == 4){ // 碩博
						description = item_block[item_id].description[1];
					}
					break;
				case 13:
					if (studentdata.student_personal_data_detail.school_country == '香港') {
						description = item_block[item_id].description[0];
					} else {
						description = item_block[item_id].description[1];
					}
					break;
				default:
					description = item_block[item_id].description[0];
					break;
			}
			// 若title為空，預設顯示該欄設置的首個標題
			if (!title) title = item_block[item_id].title[0];
			document.getElementById(`${item_block[item_id].element}`).innerHTML=`
				<div class="card" style="thick;margin-bottom:3%;">
					<div class="card-header bg-primary text-white" style="font-size:150%;">
						<span>${title}</span>
					</div>
					<div class="card-body">
						<div>
							${description}
						</div>
						<div class="alert alert-warning"  style="margin:15px 0px 20px 0px;">
							僅接受副檔名為 <strong class="text-danger">pdf</strong> 的<strong class="text-danger">單一</strong>檔案，檔案大小需 <strong class="text-danger">小於 8 Mbytes</strong> 。
						</div>
						<div class="fileUpload" style="margin-bottom:20px;">
							<input type="file" class="fileUploadBtn filestyle file-certificate" data-item="${itemId}">
						</div>
						<div class="card" id="${item_block[item_id].element}_file"></div>
					</div>
				</div>
			`;

            const ifhasfile = await response.json();
			if( ifhasfile == "true"){
				// 有檔案就渲染檔案
                _getFileAreaHTML(itemId, item_block[item_id].element);
				$(`#${item_block[item_id].element}_file`).show();
			}
			else{
                // 沒檔案
				$(`#${item_block[item_id].element}_file`).hide();
			}

			// 上傳 button 樣式
			$(".fileUploadBtn").filestyle({ //:file
				htmlIcon: '<i class="fa fa-folder-open" aria-hidden="true"></i> ',
				btnClass: "btn-success",
				text: "選擇檔案",
				input: false
			});
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
			});
			loading.complete();
		}

	}

    // 有檔案的就 show 出來
    function  _getFileAreaHTML(_itemId, htmlId) {

		let reviewItemHTML = '';

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
            'olympia', // 國際數理奧林匹亞競賽或美國國際科展獎項證明
            'placement-transcript', // 採計文憑成績證書
            'transcript-reference-table', // 成績採計資料參考表
            'hk-mo-relations-ordinance', // 符合港澳關係條例切結書
            'tech-course-passed-proof', // 就讀全日制副學士或高級文憑課程已通過香港資歷架構第四級之證明文件
            'foreign-passport', // 外國護照（香港或澳門以外）
			'language-proficiency' // 語文能力說明或相關證明文件
        ];
		const data_name = _userID+"_"+data_name_map[parseInt(_itemId)];

		const dummy_id = Math.floor(Math.random() * 1000000); + Math.floor(Math.random() * 1111111);

		// pdf 顯示分別做不同處理
        reviewItemHTML = `
            <div class="card-body" >
				<h4 class="card-title"><span>已上傳檔案</span></h4>
				<hr>
				<div class="text-center">
					<embed src="${env.baseUrl}/students/${_userID}/upload-identity-verification/item/${_itemId}/file/${data_name}?dummy=${dummy_id}" width="100%" height="550" type="application/pdf">
				</div>
            </div>
			<hr style="margin:0;">
            <div class="row fileDel" style="margin: 15px auto" >
				<button type="button" class=" btn fileDelBtn  btn-danger"  data-item="${_itemId}"  >
					<i class="fa fa-folder-open" aria-hidden="true"></i> 刪除檔案
				</button>
            </div>
		`;

		htmlId += '_file';
        // 兜好的 html 拋到前端渲染囉
        document.getElementById(htmlId).innerHTML=reviewItemHTML;

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
			swal({title:`檔案過大，大小不能超過 8 MB！`, confirmButtonText:'確定', type:'warning'});
			$(this).val('');//清除檔案路徑
			return;
		}

		try {
			loading.start();
			const response = await student.uploadIdentityVerificationItem({data, user_id: _userID, item: item});

			if (!response.ok) { throw response; }
			$(this).val('');//清除檔案路徑
			loading.complete();
		} catch(e) {
            //alert(e);
			e.json && e.json().then((data) => {
				console.error("error",data);
				swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
			});
			$(this).val('');//清除檔案路徑
			loading.complete();
		}
		$(this).val('');//清除檔案路徑

		// 重新渲染
		eval(setBlocks(parseInt(item)));
	}

	// 刪除指定成績單檔案 (會抓取 data-item 看現在要刪除什麼檔案)
	async function _handleDelImg() {
		let item;
		try {
			loading.start();

			item =  $(this).data('item') ;

			const response = await student.delIdentityVerificationItem({user_id: _userID, itemId: item});
			if (!response.ok) { throw response; }
			loading.complete();
		} catch(e) {
			e.json && e.json().then((data) => {
				console.error(data);
				swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
			});
			loading.complete();
		}

		// 重新渲染
		eval(setBlocks(parseInt(item)));
	}

	function smoothscroll(id){
		alert(id);
		$('html, body').animate({
			scrollTop: $('#'+id).offset().top
		}, 2000);
	}



})();
