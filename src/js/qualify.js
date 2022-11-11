(() => {
	/**
	*	private variable
	*/
    let _savedSystem = 0;
    let _savedIdentity = 0;
    let _countryList = [];
	let _citizenshipList = [];
    const isDistributionOptionsString = [
        '未曾辦理報到入學，亦未辦理保留入學資格。',
        '經輔導來臺就學後，因故自願退學，且在臺居留未滿二年（得重新報名，以一次為限）（須附證明文件）。',
        '辦理保留入學資格在案。',
        '註冊在學。',
        '辦理休學中。',
        '分發來臺就學後經入學學校以操行成績不及格或因刑事案件判刑確定致遭退學者。',
        '於國立臺灣師範大學僑生先修部結業分發有案，因故自願退學，且在臺居留未滿二年（得重新報名，以一次為限；但不得再入學僑生先修部）。',
        '曾經來臺就讀海外青年技術訓練班。'
    ];

    const hasBeenTaiwanOptionStringMap = {
        1:[
            '就讀僑務主管機關舉辦之海外青年技術訓練班或中央主管教育行政機關認定之技術訓練專班，其訓練期間合計未滿二年。',
            '參加臺灣地區大專校院附設華語文教學機構之研習課程，其研習期間合計未滿二年。',
            '交換學生，其交換期間合計未滿二年。',
            '經中央目的事業主管機關許可來臺實習，實習期間合計未滿二年。',
            '在臺灣地區接受兵役徵召服役。',
            '遭遇天災或其他不可避免之事變。',
            '曾經本會分發或經各大學單獨招生錄取來臺就學，因故自願退學，且在臺灣地區居留未滿二年者。',
            '懷胎七個月以上或生產、流產後未滿二個月。',
            '罹患疾病而強制其出境有生命危險之虞。',
            '在臺灣地區設有戶籍之配偶、直系血親、三親等內之旁系血親、二親等內之姻親在臺灣地區患重病或受重傷而住院或死亡。',
            '因其他不可歸責之事由。',
            '未符合前述1至$temp條件',
            ''
        ],
        2:[
            '就讀僑務主管機關舉辦之海外青年技術訓練班或中央主管教育行政機關認定之技術訓練專班。',
            '參加僑務主管機關主辦或其認定屬政府機關舉辦之活動，或就讀主管機關核准境外招生之華語教育機構開設之華語文研習課程，其活動或研習期間合計未滿二年。',
            '交換學生，其交換期間合計未滿二年。',
            '經中央目的事業主管機關許可來臺實習，實習期間合計未滿二年。',
            '回國接受兵役徵召及服役。',
            '因戰亂、天災或大規模傳染病，致無法返回僑居地。',
            '曾經本會分發或經各大學單獨招生錄取來臺就學，因故退學或喪失學籍，且在臺灣地區停留未滿二年者。',
            '因其他不可歸責於僑生之事由，致無法返回僑居地。',
            '未符合前述1至$temp條件',
            '',
            '',
            '',
            ''
        ]
    };

    /**
	*	cache DOM
	*/
    // 整個資格撿視頁面
    const $qualifyForm = $('.qualify');
    // 學制選項
    const $systemArea = $('#system-area');
    const $systemChooseOption = $('#system-choose');
    // 身份別選項
    const $identityArea = $('.identity-area');
    const $identityOverseasDescription = $('#identity-overseas-description');
    const $identityInTaiwanDescription = $('#identity-in-taiwan-description');
    const $identityRadio = $qualifyForm.find('.radio-identity');
    // 港二技的文憑取得選項
    const $questionKangADHDgraduated = $('.question-ADHDgraduated');
    const $ADHDgraduatedRadio = $('.radio-ADHDgraduated');
    const $alertADHDgraduated = $qualifyForm.find('.alert-ADHDgraduated');
    // 港澳身份證選項
    const $questionKangAoIdCard = $('.question-kangAoIdCard');
    const $idCardRadio = $('.radio-idCard');
    const $alertIdCard = $qualifyForm.find('.alert-idCard');
    // 華裔選項
    const $questionEthnicChinese = $('.question-ethnicChinese');
    const $ethnicChineseRadio = $qualifyForm.find('.radio-ethnicChinese');
    const $alertEthnicChinese = $qualifyForm.find('.alert-ethnicChinese');
    // 國籍調查
    const $questionCitizenship = $('.question-citizenship');
    const $citizenshipContinentSelect = $qualifyForm.find('.select-citizenshipContinent');
	const $citizenshipSelect = $qualifyForm.find('.select-citizenshipCountry');
	const $citizenshipList = $('#citizenshipList');
	const citizenshipList = document.getElementById('citizenshipList');
    // 港澳持外國護照選項
    const $questionHoldpassport = $('.question-holdpassport');
    const $holdpassportRadio = $('.radio-holdpassport');
    const $alertHoldpassport = $qualifyForm.find('.alert-holdpassport');
    const $questionTaiwanHouseHold = $('.question-taiwanHousehold');
    const $taiwanHouseholdRadio = $('.radio-taiwanHousehold');
    const $questionPortugalPassport = $('.question-portugalPassport');
    const $portugalPassportRadio = $('.radio-portugalPassport');
    const $questionPortugalPassportMore = $('.question-portugalPassportMore');
    const $alertHoldPassportAndTaiwanHousehold = $qualifyForm.find('.alert-holdPassportAndTaiwanHousehold');
    const $inputPortugalPassportTime = $qualifyForm.find('.input-portugalPassportTime');
    const $alertPortugalPassportTimeBefore = $qualifyForm.find('.alert-portugalPassportTimeBefore');
    const $alertPortugalPassportTimeAfter = $qualifyForm.find('.alert-portugalPassportTimeAfter');
    const $questionWhichPassport = $('.question-whichPassport');
    const $passportContinentSelect = $qualifyForm.find('.select-passportContinent');
    const $passportCountrySelect = $qualifyForm.find('.select-passportCountry');
    const $alertWhichPassport = $qualifyForm.find('.alert-whichPassport');
    // 在台碩博分發調查
    const $questionInTaiwan = $('.question-inTaiwan');
    const $taiwanUniversityRadio =　$('.radio-taiwanUniversity')
    const $alertInTaiwan = $qualifyForm.find('.alert-inTaiwan');
    const $questionInTaiwanMore = $('.question-inTaiwanMore');
    // 曾分發來臺選項
    const $questionIsDistribution = $('.question-isDistribution');
    const $questionIsDistributionTitle = $('.title-isDistribution');
    const $isDistributionRadio = $qualifyForm.find('.radio-isDistribution');
    const $isDistributionOptionList = $qualifyForm.find('#distributionMore');
    const $isDistributionOption = $qualifyForm.find('.option-isDistribution');
    const $alertIsDistribution = $qualifyForm.find('.alert-isDistribution');
    const $inputDistributionTime = $qualifyForm.find('.input-distributionTime')
    // 海外居留選項
    const $questionStayLimit = $('.question-stayLimit');
    const $questionStayLimitTitle = $('.title-stayLimit');
    const $stayLimitRadio = $qualifyForm.find('.radio-stayLimit');
    const $alertStayLimitWarning = $qualifyForm.find('.alert-stayLimitWarning');
    const $alertStayLimitUnqualified = $qualifyForm.find('.alert-stayLimitUnqualified');
    const $alertStayLimitCertif = $qualifyForm.find('.alert-stayLimiCertif');
    // 在台停留日期選項
    const $questionHasBeenTaiwan = $('.question-hasBeenTaiwan');
    const $hasBeenTaiwanRadio = $('.radio-hasBeenTaiwan');
    const $hasBeenTaiwanOptionList = $qualifyForm.find('#question-hasBeenTaiwan');
    const $hasBeenTaiwanOption = $qualifyForm.find('.option-hasBeenTaiwan');
    const $alertHasBeenTaiwan = $qualifyForm.find('.alert-hasBeenTaiwan');
    // 儲存按鈕
    const $saveBtn = $qualifyForm.find('.btn-save');
    // 滑動動畫事件
    const smoothScroll = (number = 0, time) => {
		if (!time) {
			document.body.scrollTop = document.documentElement.scrollTop = number;
			return number;
		}
		const spacingTime = 20; // 動畫循環間隔
		let spacingInex = time / spacingTime; // 計算動畫次數
		let nowTop = document.body.scrollTop + document.documentElement.scrollTop; // 擷取當前scrollbar位置
		let everTop = (number - nowTop) / spacingInex; // 計算每次動畫的滑動距離
		let scrollTimer = setInterval(() => {
			if (spacingInex > 0) {
				spacingInex--;	
				smoothScroll(nowTop += everTop); //在動畫次數結束前要繼續滑動
			} else {
				clearInterval(scrollTimer); // 結束計時器
			}
		}, spacingTime);
	};

    /**
	* init
	*/
    _init();

    /**
	*	bind event
	*/
    // 學制
    $systemChooseOption.on('change',_handleSystemChoose);
    // 身份別
    $identityRadio.on('change',_handleIdentityChange);
    // 是否有副學士學位或高級文憑
    $ADHDgraduatedRadio.on('change',_handleADHDgraduatedChange);
    // 是否有港澳永久身份證
    $idCardRadio.on('change',_handleIdCardRadioChange);
    // 是否為華裔
    $ethnicChineseRadio.on('change',_handleEthnicChineseChange);
    // 海外僑生調查擁有國籍
    $citizenshipContinentSelect.on('change', _setCitizenshipCountryOption);
	$citizenshipSelect.on('change', _addCitizenship);
    // 港澳是否持外國護照
    $holdpassportRadio.on('change', _handleHoldpassportChange);
    $taiwanHouseholdRadio.on('change', _handleWhichPassportCheck);
    $portugalPassportRadio.on('change', _handleWhichPassportCheck);
    $inputPortugalPassportTime.on('change',_handleWhichPassportCheck);
    // 持有護照的洲變更事件
    $passportContinentSelect.on('change', _setWhichPassportContinentOption);
    // 在台碩博分發選項
    $taiwanUniversityRadio.on('change',_handleTaiwanUniversityChange);
    // 曾分發來台
    $isDistributionRadio.on('change', _handleIsDistributionChange);
    $isDistributionOption.on('change',_handleIsDistributionOptionChange);
    // 海外居留年限
    $stayLimitRadio.on('change', _handleStayLimitChange);
    // 來台停留
    $hasBeenTaiwanRadio.on('change', _handleHasBeenTaiwanChange);
    $hasBeenTaiwanOption.on('change',_handleHasBeenTaiwanOptionChange);
    // 儲存
    $saveBtn.on('click', _handleSave);

    /**
	*	event handler
	*/
    // 初始化事件
    async function _init() {
		try {
			const response = await student.getStudentRegistrationProgress();

			if (!response.ok) {
				throw response;
			}
			const json = await response.json();

            // set Continent & Country select option
            await student.getCountryList().then((data) => {
                _countryList = data;
                $citizenshipContinentSelect.empty();
                $citizenshipContinentSelect.append('<option value="-1" hidden disabled selected>請選擇</option>');
                $passportContinentSelect.empty();
			    $passportContinentSelect.append('<option value="-1" hidden disabled selected>請選擇</option>');
                data.forEach((val, i) => {
                    $citizenshipContinentSelect.append(`<option value="${i}">${val.continent}</option>`);
                    $passportContinentSelect.append(`<option value="${i}">${val.continent}</option>`);
                });

                $citizenshipSelect.attr('disabled',true); // disable selector
                $citizenshipSelect.selectpicker({title: '請先選擇洲別'}); // 修改 未選擇選項時的顯示文字
                $passportCountrySelect.attr('disabled',true); // disable selector
                $passportCountrySelect.selectpicker({title: '請先選擇洲別'}); // 修改 未選擇選項時的顯示文字
            });

			// 只在港二技開放報名時間 顯示港二技相關物件 其餘時間皆隱藏
			if(json.can_choose_two_year_system){
				$('#two-year-systen-depiction').show();
				$('#two-year-systen-option').show();
			}

            // 有資料的話就渲染
            if (json.student_qualification_verify) {
                const data = json.student_qualification_verify;
                // set data
                // 學制
				await $systemChooseOption.val(data.system_id);
                _savedSystem = data.system_id;
                // 身份別
                await $qualifyForm.find(`.radio-identity[value=${data.identity}]`).prop('checked',true);
                _savedIdentity = data.identity;
                // 是否有取得副學士或高級文憑
                await $qualifyForm.find(`.radio-ADHDgraduated[value=${data.associate_degree_or_higher_diploma_graduated}]`).prop('checked',true);
                // 是否持港澳身份證
                if(data.HK_Macao_permanent_residency){
                    await $qualifyForm.find(`.radio-idCard[value=1]`).prop('checked',true);
                }
                // 是否為華裔
                if(data.is_ethnic_Chinese){
                    await $qualifyForm.find(`.radio-ethnicChinese[value=1]`).prop('checked',true);
                }
                // 是否持有港澳外護照
                await $qualifyForm.find(`.radio-holdpassport[value=${data.except_HK_Macao_passport}]`).prop('checked',true);
                if(data.except_HK_Macao_passport){
                    await $qualifyForm.find(`.radio-taiwanHousehold[value=${data.taiwan_census}]`).prop('checked',true);
                    await $qualifyForm.find(`.radio-portugalPassport[value=${data.portugal_passport}]`).prop('checked',true);
                    if(data.portugal_passport){
                        await $qualifyForm.find(`.input-portugalPassportTime`).val(data.first_get_portugal_passport_at);
                    }
                }
                
                // 曾分發來台選項
                let isDistributionRadio;
                let isDistributionOption;
                let isDistributionTime;
                if(data.identity > 0 && data.identity < 4){
                    isDistributionRadio = data.has_come_to_taiwan;
                    isDistributionOption = data.reason_selection_of_come_to_taiwan;
                    isDistributionTime = data.come_to_taiwan_at;
                } else if(data.identity > 3 && data.identity < 6){
                    await $qualifyForm.find(`.radio-taiwanUniversity[value=${data.register_and_admission_at_taiwan}]`).prop('checked',true);
                    await $qualifyForm.find('.input-distributionWay').val(data.admission_way);
                    await $qualifyForm.find('.input-distributionYear').val(data.admission_year);
                    await $qualifyForm.find('.input-distributionSchool').val(data.admission_school);
                    await $qualifyForm.find('.input-distributionDept').val(data.admission_department);
                    await $qualifyForm.find('.input-distributionNo').val(data.admission_document_no);
                    isDistributionRadio = data.same_grade_course;
                    isDistributionOption = data.same_grade_course_selection;
                    isDistributionTime = data.same_grade_course_apply_year;
                }
                await $qualifyForm.find(`.radio-isDistribution[value=${isDistributionRadio}]`).prop('checked',true);
                if(isDistributionRadio){
                    await $qualifyForm.find(`.option-isDistribution[value=${isDistributionOption}]`).prop('checked',true);
                    await $qualifyForm.find(`.input-distributionTime`).val(isDistributionTime);
                }
                // 海外居留年限
                await $qualifyForm.find(`.radio-stayLimit[value=${data.overseas_residence_time}]`).prop('checked',true);
                // 曾在台停留超過120天
                await $qualifyForm.find(`.radio-hasBeenTaiwan[value=${data.stay_over_120_days_in_taiwan}]`).prop('checked',true);
                if(data.stay_over_120_days_in_taiwan){
                    await $qualifyForm.find(`.option-hasBeenTaiwan[value=${data.reason_selection_of_stay_over_120_days_in_taiwan}]`).prop('checked',true);
                }

                // render 請照順序來
                await _handleSystemChoose();
                if(data.citizenship){
                    await _initCitizenshipList(data.citizenship);
                }
                await _handleWhichPassportCheck();
                await _handleHoldpassportChange();
                if(data.which_nation_passport){
                    await _initWhichNationPassport(data.which_nation_passport);
                }
                await _handleIsDistributionChange();
                await _handleIsDistributionOptionChange();
                await _handleStayLimitChange();
                await _handleHasBeenTaiwanChange();
                await _handleHasBeenTaiwanOptionChange();
			}

			if(document.body.scrollWidth<768)  // 判別網頁寬度 少於768會進入單欄模式
			    smoothScroll($systemArea.offset().top,800);  // 用整體長度去做計算  滑動到學制選擇的位置	
		} catch (error) {
			console.log(error);
		}

		loading.complete();
	}
    
    // 學制選擇事件
    function _handleSystemChoose(){
        // 取得所選的學制 還有身份別
        const choosenSystem = $systemChooseOption.val();
        const choosenIdentity = $identityRadio.filter(":checked").val();
        const systemIdentytyMap = {'1':['1','2','3'],'2':['1','2'],'3':['1','2','3','4','5'],'4':['1','2','3','4','5']}
        // 如果選過身份別 需要判斷當前學制是否有這個身份別
        if(choosenIdentity != null){
            // 如果沒有就把已選擇的身份別選項disabled
            if(systemIdentytyMap[choosenSystem].indexOf(choosenIdentity) === -1){
                $qualifyForm.find(`.radio-identity`).prop('checked',false);
            }
        }
        // 只有港二技有這選項 直接先隱藏 選擇身份別時才顯示
        $questionKangADHDgraduated.hide();
        // 不同的學制會顯示不同的身份別說明文字
        $identityOverseasDescription.hide();
        $identityInTaiwanDescription.hide();
        $('.identity-option-overseas').show();
        $('.identity-option-inTaiwan').show();
        // 學制如果是碩博二技海外居留年限不需要 第4項和第5項 海外居留選項跟警示訊息都預設是隱藏 選項3文字預設是非學士班身份別文字
        const $stayLimitOption3Text = $qualifyForm.find(`.radio-stayLimit[value=3]`).parent().find('a');
        const $stayLimitOption4 = $qualifyForm.find(`.radio-stayLimit[value=4]`).parent();
        const $stayLimitOption5 = $qualifyForm.find(`.radio-stayLimit[value=5]`).parent();
        $stayLimitOption4.hide();
        $stayLimitOption5.hide();
        $alertStayLimitWarning.hide();
        $stayLimitOption3Text.text(`報名時已滿六年`)
        // 根據學制要顯示與隱藏不同的物件
        switch(choosenSystem){
            case '1':
                $identityOverseasDescription.show();
                $('.identity-option-inTaiwan').hide();
                $stayLimitOption3Text.text(`報名時已滿六年，但未滿八年`)
                $stayLimitOption4.show();
                $stayLimitOption5.show();
                $alertStayLimitWarning.show();
                break;
            case '2':
                $('.identity-option-overseas').hide();
                $('.identity-option-inTaiwan').hide();
                break;
            case '3':
            case '4':
                $identityOverseasDescription.show();
                $identityInTaiwanDescription.show();
                break;
        }
        // 顯示身份別選項區域
        $identityArea.show();
        // 處理身份別選擇事件
        _handleIdentityChange();
    }

    // 身份別選擇事件
    async function _handleIdentityChange(){
        // 取得目前選擇的學制與身份別
        const choosenSystem = $systemChooseOption.val();
        const choosenIdentity = $identityRadio.filter(":checked").val();

        // 下方問題先全部隱藏
        $questionKangAoIdCard.hide();
        $questionEthnicChinese.hide();
        $questionCitizenship.hide();
        $questionHoldpassport.hide();
        $questionInTaiwan.hide();
        $questionIsDistribution.hide();
        $questionStayLimit.hide();
        $questionHasBeenTaiwan.hide();

        // 不同身份別要選染不同的選項文字
        _renderIsDistributionOptions(choosenIdentity);
        _renderHasBeenTaiwanOptions(choosenIdentity);
        
        // 針對在台碩博的改變先還原
        $questionIsDistributionTitle.removeClass('font-weight-bold');
        $questionIsDistribution.find('dt').show();
        let questionIsDistributionText = '是否曾經本會分發或經各大學單獨招生錄取來臺？';
        let questionStayLimitTitleHtml = '請問自報名截止日往前推算，已在僑居地連續居留多少年？';

        // 在台學生的曾分發來台年份可輸入長度與提示訊息不一樣
        $inputDistributionTime.attr("placeholder", "請填寫西元年份，若多個請用「，」隔開。EX：2013");
        $inputDistributionTime.attr("maxlength", 191);

        if(choosenIdentity == '2'){
            questionStayLimitTitleHtml = `最近連續居留香港、澳門或海外（指除了臺灣、大陸<span class="text-danger"> 以外 </span>之國家或地區）之年限：`;
        } else if(choosenIdentity == '1'){
            questionStayLimitTitleHtml = `最近連續居留境外（指臺灣地區<span class="text-danger"> 以外 </span>之國家或地區）之年限：`;
        }

        // 按照身份別顯示不同的問題選項及文字
        switch(choosenIdentity){
            case '2':
                $questionEthnicChinese.show();
            case '1':
                if(choosenSystem == "2"){
                    $questionKangADHDgraduated.show();
                }
                $questionKangAoIdCard.show();
                $questionHoldpassport.show();
                $questionIsDistribution.show();
                $questionStayLimit.show();
                $questionHasBeenTaiwan.show();
                _handleWhichPassportCheck(); // 切換成港澳生時要檢查持外國護照項目
                break;
            case '3':
                $questionEthnicChinese.show();
                $questionCitizenship.show();
                $questionIsDistribution.show();
                $questionStayLimit.show();
                $questionHasBeenTaiwan.show();
                break;
            case '4':
            case '5':
                $inputDistributionTime.attr("placeholder", "請填寫西元年份。");
                $inputDistributionTime.attr("maxlength", 5);
                questionIsDistributionText = (choosenSystem === '3')?'請問您是否曾經向本會申請碩士班同級學程，並經由本會分發？':'請問您是否曾經向本會申請博士班同級學程，並經由本會分發？';
                $questionInTaiwan.show();
                $questionIsDistribution.show();
                $questionIsDistribution.find('dt').hide();
                $questionIsDistributionTitle.addClass('font-weight-bold');
                _handleTaiwanUniversityChange(); // 切換成在台僑港澳生要檢查分發管道選項
                break;
        }
        $questionIsDistributionTitle.text(questionIsDistributionText);
        $questionStayLimitTitle.html(questionStayLimitTitleHtml);
    }

    // 是否有副學士學位或高級文憑
    function _handleADHDgraduatedChange(){
        const choosenRadioValue = $ADHDgraduatedRadio.filter(":checked").val();
        if(choosenRadioValue !== '1'){
            $alertADHDgraduated.show();
        } else {
            $alertADHDgraduated.hide();
        }
    }

    // 是否持有港澳身份證
    function _handleIdCardRadioChange(){
        const choosenRadioValue = $idCardRadio.filter(":checked").val();
        if(choosenRadioValue !== '1'){
            $alertIdCard.show();
        } else {
            $alertIdCard.hide();
        }
    }

    // 是否為華裔選擇事件
    function _handleEthnicChineseChange(){
        const choosenRadioValue = $ethnicChineseRadio.filter(":checked").val();
        if(choosenRadioValue !== '1'){
            $alertEthnicChinese.show();
        } else {
            $alertEthnicChinese.hide();
        }
    }

    // 初始化時渲染國籍列表
	function _initCitizenshipList(data){
		const citizenshipIdArray = data.split(',');
		citizenshipIdArray.forEach(value=>{
			let keep = true;
			for(let i=0;i<5 && keep;i++){
				for(let j=0;j<_countryList[i].country.length && keep;j++){
					if(_countryList[i].country[j].id == value){
						_citizenshipList.push( {'continent': i,'id' : value} );
						keep=false;
					}
				}
			}
		});
		_generateCitizenshipList();
		return;
	}

	// 選洲，更換國家選項
	function _setCitizenshipCountryOption() {
		// 取得選取的洲代碼
		const order = $(this).val();
		// reset 國籍列表選單
		$citizenshipSelect.empty();
		// 預設選項為 "可選擇" 但設定為不可選且隱藏 讓他不會出現在下拉式選單中
		
		// 防止有人選取預設選項
		if (+order === -1) {
            $citizenshipSelect.selectpicker({title: '請先選擇洲別'}); // 修改 未選擇選項時的顯示文字
            $citizenshipSelect.attr('disabled',true); // disable selector
			return;
		}
        $citizenshipSelect.selectpicker({title: '請選擇國家'}); // 修改 未選擇選項時的顯示文字
        $citizenshipSelect.attr('disabled',false); // enable selector
		// 渲染選取洲別的國家到下拉式選單中
		_countryList[order].country.forEach((val, i) => {
			if(_citizenshipList.findIndex(order => order.id == val.id) === -1){ // 在已選擇國籍名單中 就不渲染避免重複選取
				$citizenshipSelect.append(`<option value="${val.id}">${val.country}</option>`);
			}
		});
        $citizenshipSelect.selectpicker('refresh'); // refresh selecor
        $citizenshipSelect.parent().find('button').removeClass('bs-placeholder'); // 為了風格統一 去除預設格式
	}

	// 選擇國籍選項 新增至已選擇國籍列表
	function _addCitizenship(){
		// 目前暫定可選國籍上限 20 選超過直接出現提示訊息
		if(_citizenshipList.length < 20 && $(this).val() > 0){
			// 將選擇的洲別與國家代碼儲存
			_citizenshipList.push( {'continent': $citizenshipContinentSelect.val(),'id' : $(this).val()} );
			// 重新渲染已選擇國籍列表
			_generateCitizenshipList();
		} else {
			swal({title: `國籍數量已達上限`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
		}
	}

	// 刪除已選擇國籍列表之國籍
	function _removeCitizenship(){
		// 先提取國家代碼
		const id = $(this).data("id");
		// 用國家代碼搜尋已選擇國籍列表找到Index
		const citizenshipIndex = _citizenshipList.findIndex(order => order.id == id)
		// 使用Index和splice來刪除已選擇國籍
		_citizenshipList.splice(citizenshipIndex,1);
		_generateCitizenshipList();
	}

	// 渲染已選擇國籍列表
	function _generateCitizenshipList(){
		// 每次都清空重新渲染
		let rowHtml = '';
		// 從已選擇國籍列表中處理資料渲染到畫面上
		for(let i in _citizenshipList) {
			// 用已選擇國籍列表中儲存的洲別與國家代碼從儲存的國家列表中找到國家名稱
			let country = _countryList[_citizenshipList[i].continent].country.find(list => list.id == _citizenshipList[i].id).country;
			// 將變數編寫成Html格式的字串
			rowHtml = rowHtml + `
			<tr data-wishIndex="${i}">
				<td style="vertical-align:middle;">
					${country}
				</td>
				<td>
					<button type="button" data-continent="${_citizenshipList[i].continent}" data-id="${_citizenshipList[i].id}" class="btn btn-danger btn-sm remove-citizenship"><i class="fa fa-times" aria-hidden="true"></i></button>
				</td>
			</tr>
			`;
		}
		// 將Html字串選染到已選擇國籍table中
		citizenshipList.innerHTML = rowHtml;
		// 宣告已選擇國籍table中的刪除按鈕並新增點選事件
		const $removeCitizenship = $citizenshipList.find('.remove-citizenship');
		$removeCitizenship.on("click", _removeCitizenship);
		// reset 洲別與國家選項 並清空國家列表 避免重複選取到一樣國家
		$citizenshipContinentSelect.append('<option value="-1" hidden disabled selected>請選擇</option>');
        $citizenshipSelect.empty();
        $citizenshipSelect.attr('disabled',true);
        $citizenshipSelect.selectpicker({title: '請先選擇洲別'}); // 修改 未選擇選項時的顯示文字
        $citizenshipSelect.selectpicker('refresh'); // refresh selector
	}

    // 港澳持外國護照
    function _handleHoldpassportChange(){
        const choosenIdentity = $identityRadio.filter(":checked").val();
        const choosenRadioValue = $holdpassportRadio.filter(":checked").val();

        $questionTaiwanHouseHold.hide();
        $questionPortugalPassport.hide();
        $questionPortugalPassportMore.hide();
        $questionWhichPassport.hide();
        $alertHoldpassport.hide();
        $alertHoldPassportAndTaiwanHousehold.hide();
        $alertPortugalPassportTimeBefore.hide();
        $alertPortugalPassportTimeAfter.hide();
        $alertWhichPassport.hide();
        if(choosenRadioValue == "1"){
            $questionTaiwanHouseHold.show();
            $questionPortugalPassport.show();
            _handleWhichPassportCheck();
        } else if(choosenRadioValue == "0"){
            // 港澳具外國國籍學生一定要有港澳外護照
            if(choosenIdentity == "2"){
                _alertForHKAOIdentity(1);
            }
        }
    }
    // 港澳持外國護照細項互相影響所以事件寫一起
    async function _handleWhichPassportCheck(){
        const choosenIdentity = $identityRadio.filter(":checked").val();
        const choosenHoldpassportValue = $holdpassportRadio.filter(":checked").val();
        const choosenTaiwanHousehold = $taiwanHouseholdRadio.filter(":checked").val();
        const choosenPortugalPassport = $portugalPassportRadio.filter(":checked").val();
        let flag = true;

        $alertHoldpassport.hide();
        $alertHoldPassportAndTaiwanHousehold.hide();
        $questionPortugalPassportMore.hide();
        $alertPortugalPassportTimeBefore.hide();
        $alertPortugalPassportTimeAfter.hide();
        $questionWhichPassport.hide();
        $alertWhichPassport.hide();

        // 如果沒有持外國護照就return;
        if(choosenHoldpassportValue !== "1"){
            return flag;
        }

        // 身份別是港澳生的判別
        if(choosenIdentity == "1"){
            // 先判斷是否持葡萄牙護照
            if(choosenPortugalPassport == "1"){
                // 持有葡萄牙護照要判斷是回歸前還是回歸後
                const inputTime= $inputPortugalPassportTime.val();
                const isTimeBefore = moment(inputTime, 'YYYY/MM/DD').isBefore('1999-12-20');
                $questionPortugalPassportMore.show();
                // 還沒輸入取得時間 直接return
                if(!inputTime) return flag;
                // 回歸前沒事 出現提示訊息即可
                if(isTimeBefore){
                    $alertPortugalPassportTimeBefore.show();
                } else {
                    // 回歸後取得 如果在台設有戶籍 出現提示訊息
                    if(choosenTaiwanHousehold == "1"){
                        $alertHoldPassportAndTaiwanHousehold.show();
                    } else if(choosenTaiwanHousehold == "0"){
                        // 回歸後取得 如果未在台設有戶籍 出現提示訊息 並請學生切換身份別
                        flag = _alertForHKAOIdentity(2);
                    }
                }
            } else if(choosenPortugalPassport == "0"){
                $questionWhichPassport.show();
                // 沒有持葡萄牙護照 如果在台設有戶籍 出現提示訊息
                if(choosenTaiwanHousehold == "1"){
                    $alertHoldPassportAndTaiwanHousehold.show();
                } else if(choosenTaiwanHousehold == "0"){
                    // 沒有持葡萄牙護照 在台沒設有戶籍 出現提示訊息 並請學生切換身份別
                    flag = _alertForHKAOIdentity(2);
                }
            }
        } else if(choosenIdentity == "2"){
            // 身份別是港澳具外國國籍學生的判別
            if(choosenTaiwanHousehold == "1"){
                // 在台設有戶籍 有沒有持葡萄牙護照一律請它切換身份別
                if(choosenPortugalPassport == "1"){
                    $questionPortugalPassportMore.show();
                } else if(choosenPortugalPassport == "0"){
                    $questionWhichPassport.show();
                }
                flag = _alertForHKAOIdentity(1);
            } else if(choosenTaiwanHousehold == "0"){
                // 在台設有戶籍 持葡萄牙護照要判斷是回歸前還後
                if(choosenPortugalPassport == "1"){
                    const inputTime= $inputPortugalPassportTime.val();
                    const isTimeBefore = moment(inputTime, 'YYYY/MM/DD').isBefore('1999-12-20');
                    $questionPortugalPassportMore.show();
                    // 還沒輸入取得時間 直接return
                    if(!inputTime) return flag;
                    if(isTimeBefore){
                        // 回歸前取得 出現提示訊息 並請學生切換身份別
                        flag = _alertForHKAOIdentity(1);
                    } else {
                        // 回歸後沒事 出現提示訊息即可
                        $alertPortugalPassportTimeAfter.show();
                    }
                } else if(choosenPortugalPassport == "0"){
                    // 沒有持葡萄牙護照 出現提示訊息即可
                    $questionWhichPassport.show();
                    $alertWhichPassport.show();
                }
            }
        }
        return flag;
    }

    // 港澳生身份別需更換提示訊息 identityID 是需要變更成的ID 1:『港澳生』 2:『港澳具外國國籍之華裔學生』
    async function _alertForHKAOIdentity(identityID){
        $alertHoldpassport.find('i').text('');
        if(identityID === 1)
        {
            await swal({
                title: `提醒您，您的身份別為<br/>『港澳生』!<br/>請至上方「申請身份別」項目<br/>重新選擇身份別。`,
                html: `「港澳具外國國籍之華裔學生」係依據「僑生回國就學及輔導辦法」第23-1條規定：「具外國國籍，兼具香港或澳門永久居留資格，未曾在臺設有戶籍，且最近連續居留香港、澳門或海外六年以上之華裔學生」定義。`,
                type:"warning",
                confirmButtonText: '確定',
                allowOutsideClick: false
            });
            $alertHoldpassport.find('i').text('身份別不符，請切換身份別到『港澳生』。');
        } else {
            await swal({
                title: `提醒您，您的身份別為<br/>『港澳具外國國籍之華裔學生』!<br/>請至上方「申請身份別」項目<br/>重新選擇身份別。`,
                type:"warning",
                confirmButtonText: '確定',
                allowOutsideClick: false
            });
            $alertHoldpassport.find('i').text('身份別不符，請切換身份別到『港澳具外國國籍之華裔學生』。');
        }
        $alertHoldpassport.show();
        return false;
    }
    // 持有護照初始化
	async function _initWhichNationPassport(data){
        // 先渲染持有護照的洲選項才能渲染國家選項
		const whichNationPassport = data;
        let keep = true;
        for(let i=0;i<5 && keep;i++){
            for(let j=0;j<_countryList[i].country.length && keep;j++){
                if(_countryList[i].country[j].id == whichNationPassport){
                    await $qualifyForm.find(`.select-passportContinent option[value=${i}]`).prop('selected', true);
                    keep = false;
                }
            }
        }
		await _setWhichPassportContinentOption();
        await $qualifyForm.find(`.select-passportCountry option[value="${whichNationPassport}"]`).prop('selected', true);
        $passportCountrySelect.selectpicker('refresh');
		return;
	}
    // 持有護照的洲變更事件
	function _setWhichPassportContinentOption() {
		// 取得選取的洲代碼
		const order = $passportContinentSelect.val();
		// 防止有人選取預設選項
		if (+order === -1) {
            $passportCountrySelect.attr('disabled',true); // disable selector
            $passportCountrySelect.selectpicker({title: '請先選擇洲別'}); // 修改 未選擇選項時的顯示文字\
			return;
		}
        $passportCountrySelect.attr('disabled',false); // enable selector
        $passportCountrySelect.selectpicker({title: '請選擇國家'}); // 修改 未選擇選項時的顯示文字\
        const passportCountryRule = ["113", "127", "134", "135"]; // 亞洲國家選項不能出現 臺港澳中
        // 渲染選取洲別的國家到下拉式選單中
		_countryList[order].country.forEach((val, i) => {
            if(passportCountryRule.indexOf(val.id) == -1){
                $passportCountrySelect.append(`<option value="${val.id}">${val.country}</option>`);
            }
		});

        $passportCountrySelect.selectpicker('refresh'); // refresh selecor
        $passportCountrySelect.parent().find('button').removeClass('bs-placeholder'); // 為了風格統一 去除預設格式
        return;
	}

    // 分發來台就學管道
    function _handleTaiwanUniversityChange(){
        const choosenOptionValue = $taiwanUniversityRadio.filter(":checked").val();
        const choosenIdentity = $identityRadio.filter(":checked").val();

        $questionInTaiwanMore.hide();
        $alertInTaiwan.hide();

        // 依照選項顯示接下來的問題或依照身份別顯示不同的提示訊息
        if(choosenOptionValue == "1"){
            $questionInTaiwanMore.show();
        } else if(choosenOptionValue == "0"){
            $alertInTaiwan.find('i').text('');
            if(choosenIdentity == "4"){
                $alertInTaiwan.find('i').text('身份別不符，請切換身份別到『港澳生』或『港澳具外國國籍之華裔學生』。');
            } else if(choosenIdentity == "5"){
                $alertInTaiwan.find('i').text('身份別不符，請切換身份別到『海外僑生』。');
            }
            $alertInTaiwan.show();
        }
    }

    // 曾分發來台選項
    function _handleIsDistributionChange(){
        const choosenRadioValue = $isDistributionRadio.filter(":checked").val();

        if(choosenRadioValue == "1"){
            $isDistributionOptionList.fadeIn();
        } else {
            $isDistributionOptionList.fadeOut();
        }
    }
    // 曾分發來台原因選項渲染
    function _renderIsDistributionOptions(choosenIdentity){
        isDistributionOptionsString.forEach((value,number) =>{
            const order = number + 1; // 選項的value
            const option = $qualifyForm.find(`.option-isDistribution[value=${order}]`); // 現在要渲染的選項
            const optionTextArea = option.parent().find('a'); // 選項文字的網頁物件
            let optionText = value; // 選項的文字

            // 非港澳生的選項文字跟別人不一樣
            if(choosenIdentity !== '1' && (order === 2 || order === 6 || order === 7)){
                optionText = optionText.replace('以操行成績不及格或因刑事案件判刑確定致遭退學者','以操行或學業成績不及格、違反法令或校規情節嚴重致遭退學或喪失學籍者');
                optionText = optionText.replace('因故自願退學，且在臺居留未滿二年','在臺停留未滿二年，因故退學或喪失學籍');
            }
            
            // 文字區域先清空
            optionTextArea.text('');
            // 選項全部先顯示
            option.parent().show();
            // 按照身份別渲染選項文字 及 隱藏不同的問題選項
            switch(choosenIdentity){
                case '1':
                case '2':
                    // 分發來台選項只顯示前七個
                    if(order > 7){
                        option.parent().hide();
                    }
                case '3':
                    optionText = ' '+order+'. '+optionText;
                    break;
                case '4':
                case '5':
                    // 分發來台選項6 文字跟別人不一樣
                    if(order == 6){
                        optionText = '非因故自願退學（如勒令退學）。'
                    }
                    // 分發來台選項只顯示前6個 第2個也不顯示
                    if(order > 6 || order == 2){
                        option.parent().hide();
                    }
                    break;
            }
            optionTextArea.text(optionText);
        });
        _handleIsDistributionOptionChange();
    }
    // 曾分發來台原因
    function _handleIsDistributionOptionChange(){
        const choosenOptionValue = $isDistributionOption.filter(":checked").val();
        const unqualifiedOptionMap = ['3','4','5','6'];

        if(unqualifiedOptionMap.indexOf(choosenOptionValue) !== -1){
            $alertIsDistribution.show();
        } else {
            $alertIsDistribution.hide();
        }
    }

    // 海外居留年限選項
    function _handleStayLimitChange(){
        const choosenRadioValue = $stayLimitRadio.filter(":checked").val();

        $alertStayLimitUnqualified.hide();
        $alertStayLimitCertif.hide();
        let alertStayLimitCertifText = '';

        // 按照海外居留年限選項別顯示不同的alert與文字
        switch(choosenRadioValue){
            default:
                $alertStayLimitUnqualified.show();
                break;
            case '4':
                alertStayLimitCertifText += '欲申請醫牙學系者';
            case '2':
                alertStayLimitCertifText += '需填寫切結書';
                $alertStayLimitCertif.show();
                break;
            case '3':
            case '5':
                break;
        }
        $alertStayLimitCertif.text(alertStayLimitCertifText);
    }

    // 是否來台停留超過120天
    function _handleHasBeenTaiwanChange(){
        const choosenRadioValue = $hasBeenTaiwanRadio.filter(":checked").val();
        
        if(choosenRadioValue == "1"){
            $hasBeenTaiwanOptionList.fadeIn();
        } else {
            $hasBeenTaiwanOptionList.fadeOut();
        }
    }
    // 來台停留超過120天原因選項渲染
    function _renderHasBeenTaiwanOptions(choosenIdentity){
        const mapNumber = (choosenIdentity === '1') ?1:2;
        hasBeenTaiwanOptionStringMap[mapNumber].forEach((value,number) =>{
            const order = number + 1; // 選項的value
            const option = $qualifyForm.find(`.option-hasBeenTaiwan[value=${order}]`); // 現在要渲染的選項
            const optionTextArea = option.parent().find('a'); // 選項文字的網頁物件
            let optionText = value.replace('$temp', number); // 選項的文字 有"$temp"字串在其中就取代為number（前述選項最大數）

            optionTextArea.text(' '+order+'. '+optionText);
            option.parent().show();
            if(value === ''){
                option.parent().hide();
            }
        });
        _handleHasBeenTaiwanOptionChange();
    }
    // 來台停留超過120天原因
    function _handleHasBeenTaiwanOptionChange(){
        const choosenOptionValue = $hasBeenTaiwanOption.filter(":checked").val();
        const choosenIdentity = $identityRadio.filter(":checked").val();
        const unqualifiedOption = (choosenIdentity == '1')?'12':'9';

        if(unqualifiedOption == choosenOptionValue){
            $alertHasBeenTaiwan.show();
        } else {
            $alertHasBeenTaiwan.hide();
        }
    }
    // 儲存
    async function _handleSave() {
        // 處理海外僑生國籍用暫存字串
        let tmpString = '';
        _citizenshipList.forEach(object => {
            tmpString += object.id+',';
        });
        // 先把學生選取的選項宣告成變數
        const choosenSystem = +$systemChooseOption.val(); // 學制
        const choosenIdentity = +$identityRadio.filter(":checked").val(); // 身份別
        const choosenEthnicChinese = +$ethnicChineseRadio.filter(":checked").val(); // 是否為華裔學生
        const choosenADHDgraduated = +$ADHDgraduatedRadio.filter(":checked").val(); // 是否有副學士學位或高級文憑
        const choosenIdCard = +$idCardRadio.filter(":checked").val(); // 是否有港澳永久身份證
		const citizenshipString = tmpString.substr(0,tmpString.length-1); // 國籍字串
        const choosenHoldPassport = +$holdpassportRadio.filter(":checked").val(); // 是否持有除港澳之外的護照
        const choosenTaiwanHousehold = +$taiwanHouseholdRadio.filter(":checked").val(); // 是否在台設有戶籍
        const choosenPortugalPassport = +$portugalPassportRadio.filter(":checked").val(); // 是否持有葡萄牙護照
        const inputPortugalPassportTime = $inputPortugalPassportTime.val();// 獲得葡萄牙護照之時間
        const choosenPassportCountry = $passportCountrySelect.val(); // 持有那一國家的護照
        const choosenIsDistribution = +$isDistributionRadio.filter(":checked").val(); // 是否曾分發來台
        const inputIsDistributionTime = $qualifyForm.find('.input-distributionTime').val(); // 曾分發來台時間
        const choosenIsDistributionOption = +$isDistributionOption.filter(":checked").val(); // 曾分發來台原因
        const choosenStayLimit = +$stayLimitRadio.filter(":checked").val(); // 海外居留年限
        const choosenHasBeenTaiwan = +$hasBeenTaiwanRadio.filter(":checked").val(); // 是否來台停留
        const choosenHasBeenTaiwanOption = +$hasBeenTaiwanOption.filter(":checked").val(); // 來台停留原因
        const choosenTaiwanUniversity = +$taiwanUniversityRadio.filter(":checked").val(); // 是否經由聯招或單招來台註冊入學
        const inputDistributionWay = $qualifyForm.find('.input-distributionWay').val(); // 分發管道
        const inputDistributionYear = $qualifyForm.find('.input-distributionYear').val(); // 分發年份
        const inputDistributionSchool = $qualifyForm.find('.input-distributionSchool').val(); // 分發學校
        const inputDistributionDept = $qualifyForm.find('.input-distributionDept').val(); // 分發系所
        const inputDistributionNo = $qualifyForm.find('.input-distributionNo').val(); // 分發文號

        // 檢查學制代碼
        if([1,2,3,4].indexOf(choosenSystem) == -1){
            await swal({title: `請確認選擇的學制`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
            return;
        }
        // 根據學制檢查身份別代碼
        const systemIdentytyMap = {1:[1,2,3],2:[1,2],3:[1,2,3,4,5],4:[1,2,3,4,5]}
        if(systemIdentytyMap[choosenSystem].indexOf(choosenIdentity) === -1){
            await swal({title: `請確認選擇的身份別`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
            return;
        }
        // 檢查分發來台選項
        if(isNaN(choosenIsDistribution)){
            await swal({title: `請選擇分發來臺選項`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
            return;
        }
        // 檢查分發來台原因選項
        const unqualifiedIsDistributionOptionMap = [3,4,5,6];
        if(choosenIsDistribution == 1){
            if(unqualifiedIsDistributionOptionMap.indexOf(choosenIsDistributionOption) !== -1){
                await swal({title: `分發來臺選項不具報名資格`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            if(inputIsDistributionTime == ''){
                await swal({title: `未填寫分發來臺年份`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            if((choosenIdentity > 3 && choosenIsDistributionOption > 6) || (choosenIdentity < 3 && choosenIsDistributionOption > 7) || !choosenIsDistributionOption){
                await swal({title: `請選擇分發來臺原因選項`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
        }
        // 宣告要傳送到後端的資料物件
        let sendData = {
            system_id: choosenSystem,
            identity: choosenIdentity,
            force_update: true // TODO ?
        };
        // 根據身份別將需要傳遞的資料放進物件當中
        // 是否有副學士學位或高級文憑
        if(choosenSystem === 2){
            if(isNaN(choosenADHDgraduated)){
                await swal({title: `請選擇「在香港是否修習副學士學位或高級文憑課程，並已取得畢業證書」選項`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            if(choosenADHDgraduated !== 1){
                await swal({title: `未在香港修習副學士學位或高級文憑課程並取得畢業證書者不具報名資格`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            sendData["associate_degree_or_higher_diploma_graduated"] = choosenADHDgraduated;
        }
        // 海外僑生與港澳據外國國籍需要是否為華裔選項
        if(choosenIdentity == 2 || choosenIdentity == 3){
            if(isNaN(choosenEthnicChinese)){
                await swal({title: `請選擇是否為華裔選項`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            if(choosenEthnicChinese !== 1){
                await swal({title: `非華裔者不具報名資格`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            sendData["is_ethnic_Chinese"] = choosenEthnicChinese;
        }
        // 港澳生相關
        if(choosenIdentity == 1 || choosenIdentity == 2){
            if(choosenIdCard !== 1){
                await swal({title: `未擁有香港或澳門永久性居民身分證者不具報名資格`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            sendData["HK_Macao_permanent_residency"] = choosenIdCard;
            if(isNaN(choosenHoldPassport)){
                await swal({title: `請選擇是否持有香港或澳門地區外護照`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            // 港澳具外國國籍者需持有外國護照
            if(choosenHoldPassport !== 1 && choosenIdentity == 2){
                await _alertForHKAOIdentity(1);
                return;
            }
            // 持有外國護照直接呼叫函式檢查是否要切換身份別
            sendData["except_HK_Macao_passport"] = choosenHoldPassport;
            if(!await _handleWhichPassportCheck()){
                return;
            }
            // 持有外國護照確認選項數值
            if(choosenHoldPassport === 1){
                if(isNaN(choosenTaiwanHousehold)){
                    await swal({title: `請選擇「是否曾在臺設有戶籍」選項`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                    return;
                }
                if(isNaN(choosenPortugalPassport)){
                    await swal({title: `請選擇「是否持有葡萄牙護照」選項`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                    return;
                }
                if(choosenPortugalPassport === 1 && inputPortugalPassportTime == ''){
                    await swal({title: `未填寫「於何時首次取得葡萄牙護照」`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                    return;
                }
                if(choosenPortugalPassport === 0 && !choosenPassportCountry){
                    await swal({title: `未選擇「持有護照之國家」選項`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                    return;
                }   
            }
            sendData["taiwan_census"] = choosenTaiwanHousehold;
            sendData["portugal_passport"] = choosenPortugalPassport;
            sendData["first_get_portugal_passport_at"] = inputPortugalPassportTime;
            sendData["which_nation_passport"] = choosenPassportCountry;
        }
        // 海外僑生相關
        if(choosenIdentity == 3){
            if(!citizenshipString.length>0){
                await swal({title: `請先選取你擁有的國籍`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            sendData["citizenship"] = citizenshipString;
        }
        // 非在台申請相關
        if(choosenIdentity == 1 || choosenIdentity == 2 || choosenIdentity == 3){
            sendData["has_come_to_taiwan"] = choosenIsDistribution;
            sendData["come_to_taiwan_at"] = inputIsDistributionTime;
            sendData["reason_selection_of_come_to_taiwan"] = choosenIsDistributionOption;
            if(choosenStayLimit == 1){
                await swal({title: `海外居留年限選項不具報名資格`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            // 如果沒有值 或是 原本選了 4 or 5 切到碩博二技沒有重選
            if(!choosenStayLimit || (choosenSystem > 1 && choosenStayLimit > 3)){
                await swal({title: `請選擇海外居留年限選項`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            sendData["overseas_residence_time"] = choosenStayLimit;
            // 檢查在台停留選項
            if(isNaN(choosenHasBeenTaiwan)){
                await swal({title: `請選擇是否在臺停留選項`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            // 檢查在台停留原因
            const unqualifiedHasBeenTaiwanOptionMap = [12,9,9];
            if(choosenHasBeenTaiwan == 1 ){
                if(!choosenHasBeenTaiwanOption){
                    await swal({title: `請選擇在臺停留原因`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                    return;
                }
                if(choosenHasBeenTaiwanOption == unqualifiedHasBeenTaiwanOptionMap[choosenIdentity-1]){
                    await swal({title: `在臺停留選項不具報名資格`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                    return;
                }
            }
            sendData["stay_over_120_days_in_taiwan"] = choosenHasBeenTaiwan;
            sendData["reason_selection_of_stay_over_120_days_in_taiwan"] = choosenHasBeenTaiwanOption;
        }
        // 在台申請相關
        if(choosenIdentity == 4 || choosenIdentity == 5){
            if(choosenTaiwanUniversity !== 1){
                let titleString = (choosenTaiwanUniversity == 0) ?`未曾經由本聯招會或各校單招管道分發在臺就讀大學並註冊入學過，請重選身份別。` : `未選擇「曾經由本聯招會或各校單招管道分發在臺就讀大學並註冊入學過」選項。`
                await swal({title: titleString, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            sendData["register_and_admission_at_taiwan"] = choosenTaiwanUniversity;
            if(inputDistributionWay === "" || inputDistributionWay == null){
                await swal({title: `請選擇「入學管道」`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            sendData["admission_way"] = inputDistributionWay;
            if(inputDistributionYear === ""){
                await swal({title: `請填寫「分發年度」`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            sendData["admission_year"] = inputDistributionYear;
            if(inputDistributionSchool === ""){
                await swal({title: `請填寫「分發學校」`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            sendData["admission_school"] = inputDistributionSchool;
            if(inputDistributionDept === ""){
                await swal({title: `請填寫「分發學系」`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            sendData["admission_department"] = inputDistributionDept;
            sendData["admission_document_no"] = inputDistributionNo;
            sendData["same_grade_course"] = choosenIsDistribution;
            sendData["same_grade_course_apply_year"] = inputIsDistributionTime;
            sendData["same_grade_course_selection"] = choosenIsDistributionOption;
        }

        if(_savedSystem !== 0  && _savedIdentity !== 0){
            if(_savedSystem != choosenSystem || _savedIdentity != choosenIdentity){
                await swal({
                    title: `若要更換身份別，將重填所有資料，是否確定？`,
                    type:"warning",
                    showCancelButton: true,
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    confirmButtonColor: '#5cb85c',
                    cancelButtonColor: '#d9534f',
                    allowOutsideClick: false
                }, function(isConfirm){
                    if(!isConfirm){
                        return;
                    }
                });
            }
        }

        // 開始把處理好的資料傳送到後端
        await loading.start();
        await student.verifyQualification(sendData)
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw res;
            }
        })
        .then(async(json) => {
            // 成功
            swal({title:`儲存成功，即將跳轉。`, type:"success", showConfirmButton: false, allowOutsideClick: false, timer: 900}).catch(() => {
                loading.complete();
                window.location.href = './personalInfo.html';
            });
        })
        .catch((err) => {
            // 失敗
            err.json && err.json().then(async (data) => {
				console.error(data.messages[0]);
                await swal({title:data.messages[0], type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                if(err.status === 401){
                    // 重新登入的部份，跳回登入頁面
                    window.location.href = './index.html';
                }
			})
            loading.complete();
        });
    }
})();