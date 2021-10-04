(() => {
	/**
	*	private variable
	*/
    let _countryList = [];
	let _citizenshipList = [];
    const isDistributionOptionsString = [
        '未曾辦理報到入學，亦未辦理保留入學資格。',
        '經輔導來臺就學後，未在國立臺灣師範大學僑生先修部結業，且在臺停留未滿二年，因故退學或喪失學籍（得重新報名，以一次為限）（須附證明文件）。',
        '辦理保留入學資格在案。',
        '註冊在學。',
        '辦理休學中。',
        '分發來臺就學後經入學學校以學業或操行成績不及格、違反校規情節嚴重或因刑事案件判刑確定，依學生獎懲規定致遭退學或喪失學籍者。',
        '於國立臺灣師範大學僑生先修部結業分發有案，且在臺停留未滿二年（得重新報名，以一次為限：但不得再入學僑生先修部）',
        '曾經來臺就讀海外青年技術訓練班。'
    ];

    const hasBeenTaiwanOptionStringMap = {
        1:[
            '就讀僑務主管機關舉辦之海外青年技術訓練班或中央主管教育行政機關認定之技術訓練專班，其訓練期間合計未滿二年。',
            '參加臺灣地區大專校院附設華語文教學機構之研習課程，其研習期間合計未滿二年。',
            '交換學生，其交換期間合計未滿二年。',
            '經中央目的事業主管機關許可來臺實習，實習期間合計未滿二年。',
            '就在臺灣地區接受兵役徵召服役。',
            '遭遇天災或其他不可避免之事變。',
            '曾經分發註冊入學，惟分發在臺期間因故自願退學且在臺停留未滿一年。',
            '於國立臺灣師範大學僑生先修部結業，在臺停留未滿一年。',
            '懷胎七個月以上或生產、流產後未滿二個月。',
            '罹患疾病而強制其出境有生命危險之虞。',
            '在臺灣地區設有戶籍之配偶、直系血親、三親等內之旁系血親、二親等內之姻親在臺灣地區患重病或受重傷而住院或死亡。',
            '因其他不可歸責於僑生之事由，致無法返回僑居地。',
            '未符合前述1至13條件'
        ],
        2:[
            '就讀僑務主管機關舉辦之海外青年技術訓練班或中央主管教育行政機關認定之技術訓練專班。',
            '參加僑務主管機關主辦或其認定屬政府機關舉辦之活動，或就讀主管機關核准境外招生之華語教育機構開設之華語文研習課程，其活動或研習期間合計未滿二年。',
            '交換學生，其交換期間合計未滿二年。',
            '經中央目的事業主管機關許可來臺實習，實習期間合計未滿二年。',
            '回國接受兵役徵召及服役。',
            '因戰亂、天災或大規模傳染病，致無法返回僑居地。',
            '曾經分發註冊入學，惟分發在臺期間因故自願退學且在臺停留未滿二年。',
            '於國立臺灣師範大學僑生先修部結業，在臺停留未滿二年。',
            '因其他不可歸責之事由。',
            '未符合前述1至10條件',
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
    const $identityAreaHr = $('#identity-area-hr');
    const $identityArea = $('#identity-area');
    const $identityOverseasDescription = $('#identity-overseas-description');
    const $identityInTaiwanDescription = $('#identity-in-taiwan-description');
    const $identityRadio = $qualifyForm.find('.radio-identity');
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

                $citizenshipSelect.empty();
                $citizenshipSelect.append('<option value="-1" hidden disabled selected>請先選擇洲別</option>');
                $passportCountrySelect.empty();
			    $passportCountrySelect.append('<option value="-1" hidden disabled selected>請先選擇洲別</option>');
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
                // 身份別
                await $qualifyForm.find(`.radio-identity[value=${data.identity}]`).prop('checked',true);
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
                if(data.citizenship)
                {
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
        const choosenSystem = $systemChooseOption.val();
        const choosenIdentity = $identityRadio.filter(":checked").val();
        const systemIdentytyMap = {'1':['1','2','3'],'2':['1','2'],'3':['1','2','3','4','5'],'4':['1','2','3','4','5']}
        if(choosenIdentity != null){
            if(systemIdentytyMap[choosenSystem].indexOf(choosenIdentity) === -1){
                $qualifyForm.find(`.radio-identity`).prop('checked',false);
            }
        }
        const $stayLimitOption4 = $qualifyForm.find(`.radio-stayLimit[value=4]`).parent();
        const $stayLimitOption5 = $qualifyForm.find(`.radio-stayLimit[value=5]`).parent();

        $identityOverseasDescription.hide();
        $identityInTaiwanDescription.hide();
        $('.identity-option-overseas').show();
        $('.identity-option-inTaiwan').show();

        $alertStayLimitWarning.show();
        $stayLimitOption4.show();
        $stayLimitOption5.show();

        switch(choosenSystem){
            case '1':
                $identityOverseasDescription.show();
                $('.identity-option-inTaiwan').hide();
                break;
            case '2':
                $('.identity-option-overseas').hide();
                $('.identity-option-inTaiwan').hide();
                break;
            case '3':
            case '4':
                $stayLimitOption4.hide();
                $stayLimitOption5.hide();
                $identityOverseasDescription.show();
                $identityInTaiwanDescription.show();
                $alertStayLimitWarning.hide();
                break;
        }
        document.getElementById('identity-overseas-description').style.display ="none";
        document.getElementById('identity-in-taiwan-description').style.display ="none";
        if(choosenSystem != 2){
            document.getElementById('identity-overseas-description').style.display ="";
            if(choosenSystem != 1){
                document.getElementById('identity-in-taiwan-description').style.display ="";
            }
        }
        $identityAreaHr.show();
        $identityArea.removeClass('hide');
        _handleIdentityChange();
    }

    // 身份別選擇事件
    async function _handleIdentityChange(){
        const choosenSystem = $systemChooseOption.val();
        const choosenIdentity = $identityRadio.filter(":checked").val();

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
        
        $questionIsDistributionTitle.removeClass('font-weight-bold');
        $questionIsDistribution.find('dt').show();
        let questionIsDistributionText = '是否曾經分發來臺就學過？';
        let questionStayLimitTitleHtml = '請問自報名截止日往前推算，已在僑居地連續居留多少年？';

        // 按照身份別顯示不同的問題選項
        switch(choosenIdentity){
            case '2':
                $questionEthnicChinese.show();
            case '1':
                $questionKangAoIdCard.show();
                $questionHoldpassport.show();
                $questionIsDistribution.show();
                $questionStayLimit.show();
                $questionHasBeenTaiwan.show();
                questionStayLimitTitleHtml = `最近連續居留境外（指臺灣地區<span class="text-danger"> 以外 </span>之國家或地區）之年限：`;
                _handleWhichPassportCheck();
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
                questionIsDistributionText = (choosenSystem === '3')?'請問您是否曾經向本會申請碩士班同級學程，並經由本會分發？':'請問您是否曾經向本會申請博士班同級學程，並經由本會分發？';
                $questionInTaiwan.show();
                $questionIsDistribution.show();
                $questionIsDistribution.find('dt').hide();
                $questionIsDistributionTitle.addClass('font-weight-bold');
                _handleTaiwanUniversityChange();
                break;
        }
        $questionIsDistributionTitle.text(questionIsDistributionText);
        $questionStayLimitTitle.html(questionStayLimitTitleHtml);
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
		$citizenshipSelect.append('<option value="-1" disabled selected hidden>請選擇</option>');
		// 防止有人選取預設選項
		if (+order === -1) {
			return;
		}
		// 渲染選取洲別的國家到下拉式選單中
		_countryList[order].country.forEach((val, i) => {
			if(_citizenshipList.findIndex(order => order.id == val.id) === -1){ // 在已選擇國籍名單中 就不渲染避免重複選取
				$citizenshipSelect.append(`<option value="${val.id}">${val.country}</option>`);
			}
		});
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
		$citizenshipSelect.append('<option value="-1" hidden disabled selected>請先選擇洲別</option>');
	}

    // 港澳持外國護照
    function _handleHoldpassportChange(){
        const choosenIdentity = $identityRadio.filter(":checked").val();
        const choosenRadioValue = $holdpassportRadio.filter(":checked").val();

        $questionTaiwanHouseHold.hide();
        $questionPortugalPassport.hide();
        $questionPortugalPassportMore.hide();
        $questionWhichPassport.hide();
        if(choosenRadioValue == "1"){
            _handleWhichPassportCheck();
        } else if(choosenRadioValue == "0"){
            if(choosenIdentity == "2"){
                _alertForHKAOIdentity(1);
            }
        }
    }
    // 港澳持外國護照細項互相影響所以事件寫一起
    async function _handleWhichPassportCheck(){
        const choosenIdentity = $identityRadio.filter(":checked").val();
        const choosenTaiwanHousehold = $taiwanHouseholdRadio.filter(":checked").val();
        const choosenPortugalPassport = $portugalPassportRadio.filter(":checked").val();
        let flag = true;

        $alertHoldpassport.hide();
        $questionTaiwanHouseHold.show();
        $questionPortugalPassport.show();
        $alertHoldPassportAndTaiwanHousehold.hide();
        $questionPortugalPassportMore.hide();
        $alertPortugalPassportTimeBefore.hide();
        $alertPortugalPassportTimeAfter.hide();
        $questionWhichPassport.hide();
        $alertWhichPassport.hide();

        if(choosenIdentity == "1"){
            if(choosenPortugalPassport == "1"){
                const inputTime= $inputPortugalPassportTime.val();
                const isTimeBefore = moment(inputTime).isBefore('1999-12-20')

                $questionPortugalPassportMore.show();
                if(!inputTime) return;
                if(isTimeBefore){
                    $alertPortugalPassportTimeBefore.show();
                } else {
                    if(choosenTaiwanHousehold == "1"){
                        $alertPortugalPassportTimeAfter.show();
                    } else if(choosenTaiwanHousehold == "0"){
                        
                        flag = _alertForHKAOIdentity(2);
                    }
                }
            } else if(choosenPortugalPassport == "0"){
                $questionWhichPassport.show();
                if(choosenTaiwanHousehold == "1"){
                    $alertHoldPassportAndTaiwanHousehold.show();
                } else if(choosenTaiwanHousehold == "0"){
                    
                    flag = _alertForHKAOIdentity(2);
                }
            }
        } else if(choosenIdentity == "2"){
            if(choosenTaiwanHousehold == "1"){
                
                if(choosenPortugalPassport == "1"){
                    $questionPortugalPassportMore.show();
                } else if(choosenPortugalPassport == "0"){
                    $questionWhichPassport.show();
                }
                flag = _alertForHKAOIdentity(1);
            } else if(choosenTaiwanHousehold == "0"){
                if(choosenPortugalPassport == "1"){
                    const inputTime= $inputPortugalPassportTime.val();
                    const isTimeBefore = moment(inputTime).isBefore('1999-12-20')

                    $questionPortugalPassportMore.show();
                    if(!inputTime) return;
                    if(isTimeBefore){
                        
                        flag = _alertForHKAOIdentity(1);   
                    } else {
                        $alertPortugalPassportTimeAfter.show();
                    }
                } else if(choosenPortugalPassport == "0"){
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
                html: `提醒您，「港澳具外國國籍之華裔學生」係依據「僑生回國就學及輔導辦法」第23-1條規定：「具外國國籍，兼具香港或澳門永久居留資格，未曾在臺設有戶籍，且最近連續居留香港、澳門或海外六年以上之華裔學生」定義。`,
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
		return;
	}
    // 持有護照的洲變更事件
	function _setWhichPassportContinentOption() {
		// 取得選取的洲代碼
		const order = $passportContinentSelect.val();
		// 防止有人選取預設選項
		if (+order === -1) {
			return;
		}
        // reset 國家列表選單
		$passportCountrySelect.empty();
		// 預設選項為 "請選擇" 但設定為不可選且隱藏 讓他不會出現在下拉式選單中
		$passportCountrySelect.append('<option value="-1" disabled selected hidden>請選擇</option>');
        // 渲染選取洲別的國家到下拉式選單中
		_countryList[order].country.forEach((val, i) => {
			$passportCountrySelect.append(`<option value="${val.id}">${val.country}</option>`);
		});
        return;
	}

    // 分發來台就學管道
    function _handleTaiwanUniversityChange(){
        const choosenOptionValue = $taiwanUniversityRadio.filter(":checked").val();
        const choosenIdentity = $identityRadio.filter(":checked").val();

        $questionInTaiwanMore.hide();
        $alertInTaiwan.hide();
        console.log($alertInTaiwan);
        if(choosenOptionValue == "1"){
            $questionInTaiwanMore.show();
        } else if(choosenOptionValue == "0"){
            console.log(choosenIdentity);
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

            // 單純的港澳生選項的時間跟別人不一樣
            if(choosenIdentity === '1' && (order === 2 || order === 7)){
                optionText = optionText.replace('二年','一年');
            }
            
            // 文字區域先清空
            optionTextArea.text('');
            // 選項全部先隱藏
            option.parent().hide();
            // 按照身份別渲染選項文字 及 顯示不同的問題選項
            switch(choosenIdentity){
                case '1':
                case '2':
                    // 分發來台選項只顯示前七個
                    if(order < 8){
                        optionTextArea.text(' '+order+'. '+optionText);
                        option.parent().show()
                    }                        
                    break;
                case '3':
                    optionTextArea.text(' '+order+'. '+optionText);
                    option.parent().show()
                    break;
                case '4':
                case '5':
                    // 分發來台選項只顯示前6個 第2個也不顯示
                    if(order < 7 && order != 2){
                        if(order == 6){
                            optionText = '非因故自願退學（如勒令退學）。'
                        }
                        optionTextArea.text(optionText);
                        option.parent().show()
                    }
                    break;
            }
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

        // 按照海外居留年限選項別顯示不同的alert
        switch(choosenRadioValue){
            default:
                $alertStayLimitUnqualified.show();
                break;
            case '2':
                $alertStayLimitCertif.show()
                alertStayLimitCertifText = '需填寫切結書';
                break;
            case '4':
                $alertStayLimitCertif.show()
                alertStayLimitCertifText = '欲申請醫牙學系者需填寫切結書';
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
            let optionText = value; // 選項的文字

            optionTextArea.text(' '+order+'. '+optionText);
            option.parent().show();
            if(mapNumber == 2 && order > 10){
                option.parent().hide();
            }
        });
        _handleHasBeenTaiwanOptionChange();
    }
    // 來台停留超過120天原因
    function _handleHasBeenTaiwanOptionChange(){
        const choosenOptionValue = $hasBeenTaiwanOption.filter(":checked").val();
        const choosenIdentity = $identityRadio.filter(":checked").val();
        const unqualifiedOption = (choosenIdentity == '1')?'13':'10';

        if(unqualifiedOption == choosenOptionValue){
            $alertHasBeenTaiwan.show();
        } else {
            $alertHasBeenTaiwan.hide();
        }
    }
    // 儲存
    async function _handleSave() {
        let tmpString = '';
        _citizenshipList.forEach(object => {
            tmpString += object.id+',';
        });
        const choosenSystem = +$systemChooseOption.val();
        const choosenIdentity = +$identityRadio.filter(":checked").val();
        const choosenEthnicChinese = +$ethnicChineseRadio.filter(":checked").val();
        const choosenIdCard = +$idCardRadio.filter(":checked").val();
		const citizenshipString = tmpString.substr(0,tmpString.length-1);
        const choosenHoldPassport = +$holdpassportRadio.filter(":checked").val();
        const choosenTaiwanHousehold = +$taiwanHouseholdRadio.filter(":checked").val();
        const choosenPortugalPassport = +$portugalPassportRadio.filter(":checked").val();
        const inputPortugalPassportTime = $inputPortugalPassportTime.val();
        const choosenPassportCountry = $passportCountrySelect.val();
        const choosenIsDistribution = +$isDistributionRadio.filter(":checked").val();
        const inputIsDistributionTime = $qualifyForm.find('.input-distributionTime').val();
        const choosenIsDistributionOption = +$isDistributionOption.filter(":checked").val();
        const choosenStayLimit = +$stayLimitRadio.filter(":checked").val();
        const choosenHasBeenTaiwan = +$hasBeenTaiwanRadio.filter(":checked").val();
        const choosenHasBeenTaiwanOption = +$hasBeenTaiwanOption.filter(":checked").val();
        const choosenTaiwanUniversity = +$taiwanUniversityRadio.filter(":checked").val();
        const inputDistributionWay = $qualifyForm.find('.input-distributionWay').val();
        const inputDistributionYear = $qualifyForm.find('.input-distributionYear').val();
        const inputDistributionSchool = $qualifyForm.find('.input-distributionSchool').val();
        const inputDistributionDept = $qualifyForm.find('.input-distributionDept').val();
        const inputDistributionNo = $qualifyForm.find('.input-distributionNo').val();

        if([1,2,3,4].indexOf(choosenSystem) == -1){
            swal({title: `請確認選擇的學制`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
            return;
        }

        const systemIdentytyMap = {1:[1,2,3],2:[1,2],3:[1,2,3,4,5],4:[1,2,3,4,5]}
        if(systemIdentytyMap[choosenSystem].indexOf(choosenIdentity) === -1){
            swal({title: `請確認選擇的身份別`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
            return;
        }

        if(choosenEthnicChinese == 0){
            swal({title: `非華裔者不具報名資格`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
            return;
        }

        const unqualifiedIsDistributionOptionMap = [3,4,5,6];
        if(choosenIsDistribution == 1){
            if(unqualifiedIsDistributionOptionMap.indexOf(choosenIsDistributionOption) !== -1){
                swal({title: `分發來臺選項不具報名資格`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return
            }
            if(inputIsDistributionTime == ''){
                swal({title: `未填寫分發來臺年份`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return
            }
        }

        let sendData = {
            system_id: choosenSystem,
            identity: choosenIdentity,
            force_update: true // TODO ?
        };

        if(choosenIdentity == 2 || choosenIdentity == 3){
            if(choosenEthnicChinese !== 1){
                await swal({title: `非華裔者不具報名資格`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            sendData["is_ethnic_Chinese"] = choosenEthnicChinese;
        }

        if(choosenIdentity == 1 || choosenIdentity == 2){
            if(choosenIdCard == 0){
                await swal({title: `未擁有香港或澳門永久性居民身分證者不具報名資格`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            sendData["HK_Macao_permanent_residency"] = choosenIdCard;
            if(choosenHoldPassport !== 1 && choosenIdentity == 2){
                await _alertForHKAOIdentity(1);
                return;
            }
            sendData["except_HK_Macao_passport"] = choosenHoldPassport;
            if(!await _handleWhichPassportCheck()){
                return;
            }
            sendData["taiwan_census"] = choosenTaiwanHousehold;
            sendData["portugal_passport"] = choosenPortugalPassport;
            sendData["first_get_portugal_passport_at"] = inputPortugalPassportTime;
            sendData["which_nation_passport"] = choosenPassportCountry;
        }

        if(choosenIdentity == 3){
            if(!citizenshipString.length>0){
                await swal({title: `請先選取你擁有的國籍`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            sendData["citizenship"] = citizenshipString;
        }

        if(choosenIdentity == 1 || choosenIdentity == 2 || choosenIdentity == 3){
            sendData["has_come_to_taiwan"] = choosenIsDistribution;
            sendData["come_to_taiwan_at"] = inputIsDistributionTime;
            sendData["reason_selection_of_come_to_taiwan"] = choosenIsDistributionOption;
            if(choosenStayLimit == 1){
                await swal({title: `海外居留年限選項不具報名資格`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            sendData["overseas_residence_time"] = choosenStayLimit;
            const unqualifiedHasBeenTaiwanOptionMap = [13,10,10];
            if(choosenHasBeenTaiwan == 1 && choosenHasBeenTaiwanOption == unqualifiedHasBeenTaiwanOptionMap[choosenIdentity-1]){
                await swal({title: `在臺停留選項不具報名資格`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            sendData["stay_over_120_days_in_taiwan"] = choosenHasBeenTaiwan;
            sendData["reason_selection_of_stay_over_120_days_in_taiwan"] = choosenHasBeenTaiwanOption;
        }

        if(choosenIdentity == 4 || choosenIdentity == 5){
            if(choosenTaiwanUniversity !== 1){
                let titleString = (choosenTaiwanUniversity == 0) ?`未曾經由本聯招會或各校單招管道分發在臺就讀大學並註冊入學過，請重選身份別。` : `未選擇曾經由本聯招會或各校單招管道分發在臺就讀大學並註冊入學過選項。`
                await swal({title: titleString, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            sendData["register_and_admission_at_taiwan"] = choosenTaiwanUniversity;
            console.log(inputDistributionWay);
            if(inputDistributionWay === "" || inputDistributionWay == null){
                await swal({title: `請選擇入學管道`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            sendData["admission_way"] = inputDistributionWay;
            if(inputDistributionYear === ""){
                await swal({title: `請填寫分發年度`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            sendData["admission_year"] = inputDistributionYear;
            if(inputDistributionSchool === ""){
                await swal({title: `請填寫分發學校`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            sendData["admission_school"] = inputDistributionSchool;
            if(inputDistributionDept === ""){
                await swal({title: `請填寫分發學系`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                return;
            }
            sendData["admission_department"] = inputDistributionDept;
            sendData["admission_document_no"] = inputDistributionNo;
            sendData["same_grade_course"] = choosenIsDistribution;
            sendData["same_grade_course_apply_year"] = inputIsDistributionTime;
            sendData["same_grade_course_selection"] = choosenIsDistributionOption;
        }
        
        await loading.start();
        await student.verifyQualification(sendData)
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw res;
            }
        })
        .then((json) => {
            // console.log(json);
            window.location.href = './personalInfo.html';
            loading.complete();
        })
        .catch((err) => {
            err.json && err.json().then((data) => {
                console.error(data);
                alert(`ERROR: \n${data.messages[0]}`);
            })
            loading.complete();
        });
    }
})();