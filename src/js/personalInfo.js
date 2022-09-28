(() => {

    /**
     *	private variable
     */

    let _specialStatus = 0;
    let _disabilityCategory = '視覺障礙';
    let _currentDadStatus = 'alive';
    let _currentMomStatus = 'alive';
    let _countryList = [];
    let _systemId = 0;
    let _identityId = 0;

    let _hasEduType = false; // 有無學校類別
    let _hasSchoolLocate = false; // 有無學校所在地列表，true 則採用 $schoolNameSelect，否則採用 $schoolNameText
    let _schoolCountryId = "";
    let _originSchoolCountryId = "";
    let _originSchoolType = ""; // 原本的學校類型
    let _currentSchoolType = "";
    let _currentSchoolLocate = "";
    let _currentSchoolName = "";
    let _schoolList = [];
    let _schoolType = { // 有類別的地區
        "105": ["國際學校", "華校", "參與緬甸師資培育專案之華校", "緬校"], // 緬甸
        "109": ["印尼當地中學", "海外臺灣學校"], // 印尼
        "128": ["馬來西亞華文獨立中學", "國民（型）中學、外文中學", "馬來西亞國際學校（International School）", "海外臺灣學校"], // 馬來西亞
        "133": ["海外臺灣學校", "越南當地中學"], // 越南
        "130": ["泰北未立案之華文中學", "泰國當地中學"] // 泰國
    };
    const _disabilityCategoryList = ["視覺障礙", "聽覺障礙", "肢體障礙", "語言障礙", "腦性麻痺", "自閉症", "學習障礙"];
    let _errormsg = [];
    let applicantInfo_errormsg = [];
    let residentInfo_errormsg = [];
    let inTwInfo_errormsg = [];
    let educationBgInfo_errormsg = [];
    let parentInfo_errormsg = [];
    let twContactInfo_errormsg = [];

    /**
     *	cache DOM
     */

    const $personalInfoForm = $('#form-personalInfo'); // 個人資料表單

    // 申請人資料表
    const $email = $('#email');
    const $backupEmail = $('#backupEmail'); // 備用 E-Mail
    const $name = $('#name'); // 姓名（中）
    const $engName = $('#engName'); // 姓名（英）
    const $gender = $personalInfoForm.find('.gender'); // 性別
    const $birthday = $('#birthday'); // 生日
    const $birthContinent = $('#birthContinent'); // 出生地（州）
    const $birthLocation = $('#birthLocation'); // 出生地（國）
    const $special = $personalInfoForm.find('.special'); // 是否為「身心障礙」或「特殊照護」或「特殊教育」者
    const $specialForm = $('#specialForm'); // 身心障礙表單
    const $disabilityCategory = $('#disabilityCategory'); // 障礙類別
    const $disabilityLevel = $('#disabilityLevel'); // 障礙等級
    const $otherDisabilityCategoryForm = $('#otherDisabilityCategoryForm'); // 其他障礙說明表單
    const $otherDisabilityCategory = $('#otherDisabilityCategory'); // 其他障礙說明
    const $proposeGroup = $('#proposeGroup'); // 協助推薦來臺就學之學校或組織

    // 僑居地資料
    const $residenceContinent = $('#residenceContinent'); // 州
    const $residentLocation = $('#residentLocation'); // 國
    const $residentId = $('#residentId'); // 身分證號碼（ID no.）
    const $residentIdLabel = $('#residentIdLabel'); // 身分證號碼（ID no.）的那個字
    const $residentPassportNo = $('#residentPassportNo'); // 護照號碼
    const $residentPhoneCode = $('#residentPhoneCode'); // 電話國碼
    const $residentPhone = $('#residentPhone'); // 電話號碼
    const $residentCellphoneCode = $('#residentCellphoneCode'); // 手機國碼
    const $residentCellphone = $('#residentCellphone'); // 手機號碼
    const $residentAddress = $('#residentAddress'); // 地址（中 / 英）
    const $residentOtherLangAddress = $('#residentOtherLangAddress'); // 地址（其他語言）

    // 在臺資料 (選填)
    const $taiwanIdType = $('#taiwanIdType'); // 證件類型
    const $taiwanIdNo = $('#taiwanIdNo'); // 該證件號碼
    const $taiwanPassport = $('#taiwanPassport'); // 臺灣護照號碼
    const $taiwanPhone = $('#taiwanPhone'); // 臺灣電話
    const $taiwanAddress = $('#taiwanAddress'); // 臺灣地址

    // 學歷
    const $educationSystemDescriptionDiv = $('#div-educationSystemDescription');
    const $educationSystemDescription = $('#educationSystemDescription'); // 學制描述
    const $schoolContinent = $('#schoolContinent'); // 學校所在地（州）
    const $schoolCountry = $('#schoolCountry'); // 學校所在地（國）

    const $schoolTypeForm = $('#schoolTypeForm'); // 學校類別表單
    const $schoolType = $('#schoolType'); // 學校類別

    const $schoolLocationForm = $('#schoolLocationForm'); // 學校所在地、學校名稱 (select) 表單
    const $schoolLocation = $('#schoolLocation'); // 學校所在地
    const $schoolNameSelect = $('#schoolNameSelect'); // 學校名稱 (select)

    const $schoolNameTextForm = $('#schoolNameTextForm'); // 學校名稱表單
    const $schoolNameText = $('#schoolNameText'); // 學校名稱 (text)

    const $HK_ADorHD = $('input[name="radio-HK-ADorHD"]');  // 是否曾經修讀或正在修習全日制副學士學位（Associate Degree）或高級文憑（Higher Diploma）課程
    const $had_HK_ADorHD = $('input[name="HK-ADorHD-diploma"]');  // 請問您是否已取得全日制副學士學位（Associate Degree）或高級文憑（Higher Diploma）畢業證書？
    const $HK_ADorHD_Diploma = $('#HK_ADorHD_Diploma');  // 文憑類別
    const $HK_ADorHD_SchoolName = $('#HK_ADorHD_SchoolName');  // 學校名稱
    const $HK_ADorHD_ClassName = $('#HK_ADorHD_ClassName');  // 課程名稱

    const $subjectForm = $('#subjectForm'); // 主、輔修表單
    const $majorSubject = $('#majorSubject'); // 主修科目
    const $minorSubject = $('#minorSubject'); // 輔修科目

    const $schoolAdmissionAt = $('#schoolAdmissionAt'); // 入學時間
    const $schoolGraduateAt = $('#schoolGraduateAt'); // 畢業時間

    const $twoYearTechClassFormAlert = $('.twoYearTechClassForm-alert'); // 港二技表單
    const $twoYearTechClassFormInfo = $('.twoYearTechClassForm-info'); // 港二技表單
    const $twoYearTechClassFormDate = $('.twoYearTechClassForm-date'); // 港二技表單
    const $twoYearTechDiploma = $('#twoYearTechDiploma'); // 文憑類別（港二技）
    const $twoYearTechClassName = $('#twoYearTechClassName'); // 課程名稱（港二技）
    const $twoYearTechClassStart = $('#twoYearTechClassStart'); // 課程開始日期（港二技）
    const $twoYearTechClassEnd = $('#twoYearTechClassEnd'); // 課程結束日期（港二技）

    // 家長資料
    // 父親
    const $dadStatus = $('.dadStatus'); // 存歿
    const $dadDataForm = $('#form-dadData'); // 資料表單
    const $dadName = $('#dadName'); // 姓名（中）
    const $dadEngName = $('#dadEngName'); // 姓名（英）
    const $dadBirthday = $('#dadBirthday'); // 生日
    const $dadJobForm = $('.dadJobForm');
    const $dadJob = $('#dadJob'); // 職業
    const $dadPhoneCode = $('#dadPhoneCode'); // 聯絡電話國碼
    const $dadPhone = $('#dadPhone'); // 聯絡電話
    const $dadPhoneForm = $('#dad-phone');// 父親電話欄位
    // 母親
    const $momStatus = $('.momStatus'); // 存歿
    const $momDataForm = $('#form-momData'); // 資料表單
    const $momName = $('#momName'); // 姓名（中）
    const $momEngName = $('#momEngName'); // 姓名（英）
    const $momBirthday = $('#momBirthday'); // 生日
    const $momJobForm = $('.momJobForm');
    const $momJob = $('#momJob'); // 職業
    const $momPhoneCode = $('#momPhoneCode'); // 聯絡電話國碼
    const $momPhone = $('#momPhone'); // 聯絡電話
    const $momPhoneForm = $('#mom-phone');// 母親電話欄位
    // 監護人（父母皆不詳才需要填寫）
    const $guardianForm = $('#form-guardian'); // 資料表單
    const $guardianName = $('#guardianName'); // 姓名（中）
    const $guardianEngName = $('#guardianEngName'); // 姓名（英）
    const $guardianBirthday = $('#guardianBirthday'); // 生日
    const $guardianJob = $('#guardianJob'); // 職業
    const $guardianPhoneCode = $('#guardianPhoneCode'); // 聯絡電話國碼
    const $guardianPhone = $('#guardianPhone'); // 聯絡電話

    // 在臺聯絡人
    const $young = $('.isYoung');
    const $not_young = $('.notYoung');
    const $twContact = $('#twContact'); 
    const $twContactName = $('#twContactName'); // 姓名
    const $twContactRelation = $('#twContactRelation'); // 關係
    const $twContactPhone = $('#twContactPhone'); // 聯絡電話
    const $twContactAddress = $('#twContactAddress'); // 地址
    const $twContactWorkplaceName = $('#twContactWorkplaceName'); // 服務機關名稱
    const $twContactWorkplacePhone = $('#twContactWorkplacePhone'); // 服務機關電話
    const $twContactWorkplaceAddress = $('#twContactWorkplaceAddress'); // 服務機關地址
    const $saveBtn = $('#btn-save');

    /**
     *	init
     */

    _init();

    /**
     *	bind event
     */

    $birthContinent.on('change', _reRenderCountry);
    $special.on('change', _changeSpecial);
    $disabilityCategory.on('change', _switchDisabilityCategory);
    $residenceContinent.on('change', _reRenderResidenceCountry);
    $schoolContinent.on('change', _reRenderSchoolCountry);
    $schoolCountry.on('change', _chSchoolCountry);
    $schoolType.on('change', _chSchoolType);
    $schoolLocation.on('change', _chSchoolLocation);
    $dadStatus.on('change', _chDadStatus);
    $momStatus.on('change', _chMomStatus);
    $saveBtn.on('click', _handleSave);
    $residentLocation.on('change', _showResidentIDExample);
    $taiwanIdType.on('change', _showTaiwanIdExample);
    $HK_ADorHD.on('change', changeHK_ADorHD);
    $had_HK_ADorHD.on('change', changeHadHK_ADorHD);

    function _init() {
        //先初始化國家列表
        student.getCountryList()
            .then((json) => {
                _countryList = json;
                let stateHTML = '<option value="-1" data-continentIndex="-1" hidden disabled selected>Continent</option>';
                json.forEach((obj, index) => {
                    stateHTML += `<option value="${index}" data-continentIndex="${index}">${obj.continent}</option>`
                });
                $birthContinent.html(stateHTML);
                $residenceContinent.html(stateHTML);
                $schoolContinent.html(stateHTML);
                // 總是有人亂填生日 甚至變成未來人 只好設個上限 最年輕就是報名當下剛滿十歲
                $birthday.datepicker({
                    updateViewDate: true, // 會自動避免並修正直接輸入錯誤/無效的月/日，例：不是潤年的時候輸入2月29日，設true會自動跳下一天到3月1日
                    autoclose: true, // 選完會自動關閉選擇器
                    startView: 2, // 以個位數年份單位開始瀏覽
                    maxViewMode: 3, // 最高以10年單位瀏覽年份
                    immediateUpdates: true, // 只要選了其中一個項目，立即刷新欄位的年/月/日的數字
                    startDate: '-121y', // 當前年份-121y
                    endDate: '-9y' // 當前年份-9y
                });
                // 總是有人亂填生日 甚至變成未來人 只好設個上限 父母最年輕就是報名當下剛滿二十二歲
                $dadBirthday.datepicker({
                    updateViewDate: true,
                    autoclose: true,
                    startView: 2,
                    maxViewMode: 3,
                    immediateUpdates: true,
                    startDate: '-121y',
                    endDate: '-21y'
                });
                $momBirthday.datepicker({
                    updateViewDate: true,
                    autoclose: true,
                    startView: 2,
                    maxViewMode: 3,
                    immediateUpdates: true,
                    startDate: '-121y',
                    endDate: '-21y'
                });
                // 總是有人亂填生日 監護人不要變成未來人就好了
                $guardianBirthday.datepicker({
                    updateViewDate: true,
                    autoclose: true,
                    startView: 2,
                    maxViewMode: 3,
                    immediateUpdates: true,
                    startDate: '-121y',
                    endDate: '-9y'
                });
                $schoolAdmissionAt.datepicker({
                    updateViewDate: true,
                    autoclose: true,
                    startView: 2,
                    minViewMode: 1,
                    maxViewMode: 3,
                    immediateUpdates: true,
                    startDate: '-121y',
                    endDate: '-0y'
                });
                let graduateYear = env.year - new Date().getFullYear()+'Y';
                $schoolGraduateAt.datepicker({
                    updateViewDate: true,
                    autoclose: true,
                    startView: 2,
                    minViewMode: 1,
                    maxViewMode: 3,
                    immediateUpdates: true,
                    startDate: '-121y',
                    endDate: '+'+graduateYear
                });
                $twoYearTechClassStart.datepicker({
                    updateViewDate: true,
                    autoclose: true,
                    startView: 2,
                    minViewMode: 1,
                    maxViewMode: 3,
                    immediateUpdates: true,
                    startDate: '-121y',
                    endDate: '-0y'
                });
                $twoYearTechClassEnd.datepicker({
                    updateViewDate: true,
                    autoclose: true,
                    startView: 2,
                    minViewMode: 1,
                    maxViewMode: 3,
                    immediateUpdates: true,
                    startDate: '-121y'
                });
            })
            .then(()=>{
                //再初始化個人資訊
                _initPersonalInfo();
            })
    }

    function _initPersonalInfo() {
        student.getStudentPersonalData()
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw res;
                }
            })
            .then((json) => {
                _systemId = json.student_qualification_verify.system_id;
                _identityId = json.student_qualification_verify.identity;
                let formData = json.student_personal_data;
                if (formData === null) {
                    formData = {
                        "backup_email": "",
                        "gender": "",
                        "birthday": "",
                        "birth_location": "",
                        "special": 0,
                        "propose_group": "",
                        "disability_category": "",
                        "disability_level": "",
                        "resident_location": "",
                        "resident_id": "",
                        "resident_passport_no": "",
                        "resident_phone": "",
                        "resident_cellphone": "",
                        "resident_address": "",
                        "taiwan_id_type": "",
                        "taiwan_id": "",
                        "taiwan_passport": "",
                        "taiwan_phone": "",
                        "taiwan_address": "",
                        "education_system_description": "",
                        "school_country": "",
                        "school_name": "",
                        "school_type": "",
                        "school_locate": "",
                        "school_admission_at": "",
                        "school_graduate_at": "",
                        "major_subject": null,
                        "minor_subject": null,
                        "dad_status": "alive",
                        "dad_name": "",
                        "dad_eng_name": "",
                        "dad_birthday": "",
                        "dad_job": "",
                        "dad_phone": "",
                        "mom_status": "alive",
                        "mom_name": "",
                        "mom_eng_name": "",
                        "mom_birthday": "",
                        "mom_job": "",
                        "mom_phone": "",
                        "guardian_name": "",
                        "guardian_eng_name": "",
                        "guardian_birthday": "",
                        "guardian_job": "",
                        "guardian_phone": "",
                        "tw_contact_name": "",
                        "tw_contact_relation": "",
                        "tw_contact_phone": "",
                        "tw_contact_address": "",
                        "tw_contact_workplace_name": "",
                        "tw_contact_workplace_phone": "",
                        "tw_contact_workplace_address": "",
                        "two_year_tech_diploma": "",
                        "two_year_tech_class_name": "",
                        "two_year_tech_class_start": "",
                        "two_year_tech_class_end": ""
                    }
                }

                // init 申請人資料表
                $email.val(json.email);
                $backupEmail.val(formData.backup_email);
                $name.val(json.name);
                $engName.val(json.eng_name);
                $("input[name=gender][value='" + formData.gender + "']").prop("checked", true);
                $birthday.val(formData.birthday);
                $birthContinent.val(_findContinent(formData.birth_location)).change();
                $birthLocation.val(formData.birth_location);
                $proposeGroup.val(formData.propose_group)

                _specialStatus = formData.special;
                $("input[name=special][value='" + _specialStatus + "']").prop("checked", true).change();
                if (_specialStatus === 1) {
                    if (_disabilityCategoryList.indexOf(formData.disability_category) > -1) {
                        $disabilityCategory.val(formData.disability_category).change();
                    } else {
                        $disabilityCategory.val("-1").change();
                        $otherDisabilityCategory.val(formData.disability_category);
                    }
                    $disabilityLevel.val(formData.disability_level);
                }

                // init 僑居地資料
                $residenceContinent.val(_findContinent(formData.resident_location)).change();
                $residentLocation.val(formData.resident_location);
                $residentId.val(formData.resident_id);
                $residentPassportNo.val(formData.resident_passport_no);
                $residentPhoneCode.val(_splitWithSemicolon(formData.resident_phone)[0]);
                $residentPhone.val(_splitWithSemicolon(formData.resident_phone)[1]);
                $residentCellphoneCode.val(_splitWithSemicolon(formData.resident_cellphone)[0]);
                $residentCellphone.val(_splitWithSemicolon(formData.resident_cellphone)[1]);
                // $residentAddress.val(_splitWithSemicolon(formData.resident_address)[0]);
                $residentAddress.val(formData.resident_address); // 原本僑居地地址有兩欄，如果恢復其他語言地址欄位請記得取消這邊的註解
                $residentOtherLangAddress.val(_splitWithSemicolon(formData.resident_address)[1]);
                _showResidentIDExample();

                // init 在臺資料
                $taiwanIdType.val(formData.taiwan_id_type);
                $taiwanIdNo.val(formData.taiwan_id);
                $taiwanPassport.val(formData.taiwan_passport);
                $taiwanPhone.val(formData.taiwan_phone);
                $taiwanAddress.val(formData.taiwan_address);

                // init 學歷
                if (_systemId === 1 || _systemId === 2) { // 學士班、港二技 需要填寫學制描述
                    $educationSystemDescription.val(formData.education_system_description);
                } else {
                    $educationSystemDescriptionDiv.hide();
                }
                switch(_systemId){
                    case 1:
                        $('#educationLevel').text('高中學歷')
                        break;
                    case 2:
                        $('#educationLevel').text('副學士或高級文憑（含）以上之學位學歷')
                        break;
                    case 3:
                        $('#educationLevel').text('學士學歷')
                        break;
                    case 4:
                        $('#educationLevel').text('碩士學歷')
                        break;
                }
                $schoolContinent.val(_findContinent(formData.school_country)).change();
                $schoolCountry.val(formData.school_country);

                _schoolCountryId = formData.school_country;
                _originSchoolCountryId = formData.school_country;
                _originSchoolType = formData.school_type; // 取得資料庫目前的「學校類型」資料
                _currentSchoolType = (formData.school_type !== null) ? formData.school_type : "";
                _currentSchoolLocate = (formData.school_locate !== null) ? formData.school_locate : "";
                _currentSchoolName = formData.school_name;
                // 香港學生還有副學士和高級文憑的調查
                if(formData.HK_have_associate_degree_or_higher_diploma_graduated != null){  // 有填寫副學士或高級文憑
                    // 把所有題目都顯示出來
                    $('#has-HK-ADorHD-diploma').show();
                    $('#had-HK-ADorHD').show();
                    // 把填寫的答案渲染上來
                    $('input[name="radio-HK-ADorHD"][value="1"]').prop('checked', true);  // 有填寫後面的問題表示前面的問題（有無經驗）一定要是「是」
                    $("input[name='HK-ADorHD-diploma'][value='" + formData.HK_have_associate_degree_or_higher_diploma_graduated + "']").prop('checked', true);
                    $('#HK_ADorHD_Diploma').val(formData.HK_have_AD_or_HD);
                    $HK_ADorHD_SchoolName.val(formData.HK_AD_or_HD_school_name);
                    $HK_ADorHD_ClassName.val(formData.HK_AD_or_HD_class_name);
                }

                _reRenderSchoolType();

                // 主副修欄位渲染、初始化
                if (_systemId === 3 || _systemId === 4) {
                    $subjectForm.show();
                    $majorSubject.val(formData.major_subject);
                    $minorSubject.val(formData.minor_subject);
                }

                // 入學時間、畢業時間初始化
                $schoolAdmissionAt.val(formData.school_admission_at);
                $schoolGraduateAt.val(formData.school_graduate_at);

                // 港二技文憑渲染、初始化
                if (_systemId === 2) {
                    $twoYearTechDiploma.val(formData.two_year_tech_diploma);
                    $twoYearTechClassName.val(formData.two_year_tech_class_name);
                    $twoYearTechClassStart.val(formData.two_year_tech_class_start);
                    $twoYearTechClassEnd.val(formData.two_year_tech_class_end);
                }

                // init 家長資料
                // 父
                _currentDadStatus = formData.dad_status;
                $("input[name=dadStatus][value='" + formData.dad_status + "']").prop("checked", true);
                $dadName.val(formData.dad_name);
                $dadEngName.val(formData.dad_eng_name);
                $dadBirthday.val(formData.dad_birthday);
                $dadJob.val(formData.dad_job);
                // FIXME: 當雙親都是不詳的時候不這樣寫（判斷有無電話）渲染會出錯，懇請大神協助修改讓程式碼好看一點
                if (formData.dad_phone !== null) {
                    $dadPhoneCode.val(_splitWithSemicolon(formData.dad_phone)[0]);
                    $dadPhone.val(_splitWithSemicolon(formData.dad_phone)[1]);
                }
                // 母
                _currentMomStatus = formData.mom_status;
                $("input[name=momStatus][value='" + formData.mom_status + "']").prop("checked", true);
                $momName.val(formData.mom_name);
                $momEngName.val(formData.mom_eng_name);
                $momBirthday.val(formData.mom_birthday);
                $momJob.val(formData.mom_job);
                if (formData.mom_phone !== null) {
                    $momPhoneCode.val(_splitWithSemicolon(formData.mom_phone)[0]);
                    $momPhone.val(_splitWithSemicolon(formData.mom_phone)[1]);
                }
                // 監護人
                $guardianName.val(formData.guardian_name);
                $guardianEngName.val(formData.guardian_eng_name);
                $guardianBirthday.val(formData.guardian_birthday);
                $guardianJob.val(formData.guardian_job);
                if (formData.guardian_phone !== null) {
                    $guardianPhoneCode.val(_splitWithSemicolon(formData.guardian_phone)[0]);
                    $guardianPhone.val(_splitWithSemicolon(formData.guardian_phone)[1]);
                }

                // init 在臺聯絡人
                $twContactName.val(formData.tw_contact_name);
                $twContactRelation.val(formData.tw_contact_relation);
                $twContactPhone.val(formData.tw_contact_phone);
                $twContactAddress.val(formData.tw_contact_address);
                $twContactWorkplaceName.val(formData.tw_contact_workplace_name);
                $twContactWorkplacePhone.val(formData.tw_contact_workplace_phone);
                $twContactWorkplaceAddress.val(formData.tw_contact_workplace_address);
            })
            .then(() => {
                // init selectpicker 如果有值 要渲染要出來 一定要用 refresh 參數
                $birthLocation.selectpicker('refresh');
                $residentLocation.selectpicker('refresh');
                $schoolCountry.selectpicker('refresh');
                _showSpecialForm();
                _handleOtherDisabilityCategoryForm();
                _switchDadDataForm();
                _switchMomDataForm();
                _setResidenceContinent();
            })
            .then(() => {
                // 為了風格統一 去除預設格式
                $birthLocation.parent().find('button').removeClass('bs-placeholder');
                $residentLocation.parent().find('button').removeClass('bs-placeholder');
                $schoolCountry.parent().find('button').removeClass('bs-placeholder');
                loading.complete();
            })
            .catch((err) => {
                if (err.status && err.status === 401) {
                    swal({title: `請重新登入`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false})
                    .then(()=>{
                        location.href = "./index.html";
                    });
                } else {
                    err.json && err.json().then((data) => {
                        console.error(data);
                        swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
                    })
                }
                loading.complete();
            })
    }

    function _findContinent(locationId) { // 找到州別
        let continent = '';
        for (let i = 0; i < _countryList.length; i++) {
            let countryObj = _countryList[i].country.filter((obj) => {
                return obj.id === locationId;
            });
            if (countryObj.length > 0) {
                return '' + i;
            }
        }
        return -1;
    }

    function _splitWithSemicolon(phoneNum) {
        let i = phoneNum.indexOf("-");
        return [phoneNum.slice(0, i), phoneNum.slice(i + 1)];
    }

    function _splitHomeTown(homeTown) {
        let returnArr = [];
        if (homeTown !== null && homeTown !== "") {
            let provinceIndex = homeTown.indexOf("省");
            let cityIndex = homeTown.lastIndexOf("市");
            returnArr[0] = homeTown.slice(0, provinceIndex);
            returnArr[1] = homeTown.slice(provinceIndex + 1, cityIndex);
        }
        return returnArr;
    }

    function _setResidenceContinent() {
        // 兩種港澳生的洲別只能選到「亞洲」
        if ($residenceContinent && (_identityId === 1 || _identityId === 2 || _identityId === 4)) {
            let residenceContinentOptions = $residenceContinent.find('option');
            for (let i = 0; i < residenceContinentOptions.length; i++) {
                if (!(residenceContinentOptions[i].value === "-1" || residenceContinentOptions[i].value === "0")) {
                    residenceContinentOptions[i].remove();
                }
            }
        }
    }

    function _setSchoolContinent() {
        // 港二技的學校洲別只能選到「亞洲」
        if ($schoolContinent && (_systemId === 2)) {
            let schoolContinentOptions = $schoolContinent.find('option');
            for (let i = 0; i < schoolContinentOptions.length; i++) {
                if (!(schoolContinentOptions[i].value === "-1" || schoolContinentOptions[i].value === "0")) {
                    schoolContinentOptions[i].remove();
                }
            }
        }
    }

    function _reRenderCountry() {
        const continent = $(this).find(':selected').data('continentindex');

        let countryHTML = '';
        if (continent !== -1) {
            $birthLocation.selectpicker({title: '請選擇國家'}); // 修改 未選擇選項時的顯示文字
            _countryList[continent]['country'].forEach((obj, index) => {
                countryHTML += `<option value="${obj.id}">${obj.country}</option>`;
            })
            $birthLocation.attr('disabled',false); // enable selector
        } else {
            $birthLocation.selectpicker({title: '請先選擇洲別(Continent)'}); // 修改 未選擇選項時的顯示文字
            $birthLocation.attr('disabled',true); // disable selector
        }
        $birthLocation.html(countryHTML); // reder option
        $birthLocation.selectpicker('refresh'); // refresh selector
        $birthLocation.parent().find('button').removeClass('bs-placeholder'); // 為了風格統一 去除預設格式
    }

    function _reRenderResidenceCountry() {
        const continent = $(this).find(':selected').data('continentindex');
        const identity124Rule = ["113", "127"]; // 港澳生、港澳具外國國籍之華裔學生、在臺港澳生，只能選到香港、澳門
        const identity35Rule = ["113", "127", "134", "135"]; // 海外僑生、在臺僑生不能選到香港、澳門、臺灣跟大陸
        const identity6Rule = ["134"]; // 僑先部結業生不能選到臺灣

        let countryHTML = '';
        if (continent !== -1) {
            $residentLocation.selectpicker({title: '請選擇國家'}); // 修改 未選擇選項時的顯示文字
            _countryList[continent]['country'].forEach((obj, index) => {
                if (_identityId === 1 || _identityId === 2 || _identityId === 4) {
                    if (identity124Rule.indexOf(obj.id) === -1) { return; }
                } else if (_identityId === 3 || _identityId === 5) {
                    if (identity35Rule.indexOf(obj.id) > -1) { return; }
                } else {
                    if (identity6Rule.indexOf(obj.id) > -1) { return; }
                }
                countryHTML += `<option value="${obj.id}">${obj.country}</option>`;
            })
            $residentLocation.attr('disabled',false); // enable selector
        } else {
            $residentLocation.selectpicker({title: '請先選擇洲別(Continent)'}); // 修改 未選擇選項時的顯示文字
            $residentLocation.attr('disabled',true); // disable selector
        }
        $residentLocation.html(countryHTML); // reder option
        $residentLocation.selectpicker('refresh'); // refresh selector
        $residentLocation.parent().find('button').removeClass('bs-placeholder'); // 為了風格統一 去除預設格式
    }

    function _showResidentIDExample() {
        document.getElementById("residentHongKongIdExample").style.display = "none";
        document.getElementById("residentMacauIdExample").style.display = "none";
        if ($residentLocation.val() == 113) {
            document.getElementById("residentHongKongIdExample").style.display = "block";
        }
        if ($residentLocation.val() == 127) {
            document.getElementById("residentMacauIdExample").style.display = "block";
        }
    }

    function _reRenderSchoolCountry() {
        const continent = $(this).find(':selected').data('continentindex');
        // 非在台碩博不能選到臺灣
        const countryFilterRule = ["134"];

        let countryHTML = '';
        if (continent !== -1) {
            $schoolCountry.selectpicker({title: '請選擇國家'}); // 修改 未選擇選項時的顯示文字
            _countryList[continent]['country'].forEach((obj, index) => {
                if ((_systemId === 2 || _systemId === 3 || _systemId ===4)&&(_identityId !== 4 && _identityId !== 5)) {
                    if (countryFilterRule.indexOf(obj.id) !== -1) { return; }
                }
                countryHTML += `<option value="${obj.id}">${obj.country}</option>`;
            });
            $schoolCountry.attr('disabled',false); // enable selector
        } else {
            $schoolCountry.selectpicker({title: '請先選擇洲別(Continent)'}); // 修改 未選擇選項時的顯示文字
            $schoolCountry.attr('disabled',true); // disable selector
        }
        $schoolCountry.html(countryHTML); // reder option
        $schoolCountry.selectpicker('refresh'); // refresh selector
        $schoolCountry.parent().find('button').removeClass('bs-placeholder'); // 為了風格統一 去除預設格式
    }

    function _switchDisabilityCategory() {
        _disabilityCategory = $(this).val();
        _handleOtherDisabilityCategoryForm();
    }

    function _handleOtherDisabilityCategoryForm() {
        if (_disabilityCategory === "-1") {
            $otherDisabilityCategoryForm.fadeIn();
        } else {
            $otherDisabilityCategoryForm.hide();
        }
    }

    function _changeSpecial() {
        _specialStatus = Number($(this).val());
        _showSpecialForm();
    }

    function _showSpecialForm() {
        if (_specialStatus === 1) {
            $specialForm.fadeIn();
        } else {
            $specialForm.hide();
        }
    }

    function _showTaiwanIdExample() {
        document.getElementById("taiwanIdExample1").style.display = "none";
        document.getElementById("taiwanIdExample2").style.display = "none";
        if ($taiwanIdType.val() == '居留證') {
            document.getElementById("taiwanIdExample1").style.display = "block";
        }
        if ($taiwanIdType.val() == '身分證') {
            document.getElementById("taiwanIdExample2").style.display = "block";
        }
    }

    async function _chSchoolCountry() {
        // 更換學校國家時，取得國家 id 作為後續渲染使用
        // 並初始化相關變數，接下去觸發渲染學校類型事件
        _schoolCountryId = $(this).val();
        _currentSchoolType = "";
        _currentSchoolLocate = "";
        _currentSchoolName = "";
        await _reRenderSchoolType();

        if(_hasEduType){
            await $schoolNameTextForm.hide();
        }

        // 香港學士班的話要再問是否曾經有副學士或高級文憑的調查
        if(_schoolCountryId == 113 && _systemId == 1){
            $('#HK-ADorHD').show();
        }else{
            $('#HK-ADorHD').hide();
            // 隱藏之餘也別忘記要清空已經填寫的答案
            $('input[name="HK-ADorHD-diploma"]:checked').prop('checked', false);  // 是否取得副學士或高級文憑畢業證書問題
            $('#HK_ADorHD_Diploma').val('');
            $HK_ADorHD_SchoolName.val(null);
            $HK_ADorHD_ClassName.val(null);
        }

        if(_systemId == 2){
            $twoYearTechClassFormInfo.show();
            if(_schoolCountryId == 113){
                $twoYearTechClassFormAlert.show();
                $twoYearTechClassFormDate.show();
            } else {
                $twoYearTechClassFormAlert.hide();
                $twoYearTechClassFormDate.hide();
            }
        }

        if (_originSchoolCountryId !== '' && _schoolCountryId !== _originSchoolCountryId && _systemId === 1) {
            $('.alert-schoolCountry').show();
        } else {
            $('.alert-schoolCountry').hide();
        }
    }

    async function _reRenderSchoolType() {
        // 處理該國籍是否需要選擇學校類型，以及學校類型 select bar 渲染工作
        // 學士班才需要學校類別
        if (_systemId === 1) {
            if (_schoolCountryId in _schoolType) {
                let typeHTML = '';
                if(_currentSchoolType == ""){
                    typeHTML = '<option value="-1" disabled selected hidden>請選擇</option>';
                }
                await _schoolType[_schoolCountryId].forEach((value, index) => {
                    typeHTML += `<option value="${value}">${value}</option>`;
                });
                await $schoolType.html(typeHTML);
                if (_currentSchoolType !== "") {
                    await $schoolType.val(_currentSchoolType);
                }
                await $schoolTypeForm.fadeIn();
                _hasEduType = true;
            } else {
                await $schoolTypeForm.hide();
                _hasEduType = false;
            }
        } else {
            await $schoolTypeForm.hide();
            _hasEduType = false;
        }
        await _reRenderSchoolLocation();
    }

    function _chSchoolType() {
        // 取得修改後的學校類型，以此判斷是否要渲染學校列表
        // 初始化學校所在地、名稱變數，接下去觸發渲染學校列表事件
        _currentSchoolType = $(this).val();
        _currentSchoolLocate = "";
        _currentSchoolName = "";
        _reRenderSchoolLocation();

        // 如果學校類型改變了就讓善意的提醒浮出水面
        if (_originSchoolType != _currentSchoolType) {
            $('.alert-schoolType').show();
        } else { // 學校類型改回原本的就讓善意的提醒沉到水底
            $('.alert-schoolType').hide();
        }
    }

    async function _reRenderSchoolLocation() {
        await $schoolNameTextForm.hide();
        await $schoolLocationForm.hide();
        // 沒有選國家則不會出現學校名稱欄位
        if (!!_schoolCountryId) {
            // 學士班才需要出現學校所在地、名稱列表
            if (_systemId === 1) {
                const getSchoolListresponse = await student.getSchoolList(_schoolCountryId);
                const data = await getSchoolListresponse.json();
                if(getSchoolListresponse.ok){
                    // schoolWithType: 當前類別的學校列表
                    let schoolWithType = [];
                    if (_schoolCountryId in _schoolType) {
                        schoolWithType = await data.filter((obj) => {
                            return obj.type === _currentSchoolType;
                        })
                    } else {
                        schoolWithType = await data.filter((obj) => {
                            return obj.type === null;
                        })
                    }

                    if (schoolWithType.length > 0) {
                        // 當前類別有學校列表的話，渲染所在地、學校名稱列表
                        let group_to_values = await schoolWithType.reduce(function(obj, item) {
                            obj[item.locate] = obj[item.locate] || [];
                            obj[item.locate].push({ name: item.name });
                            return obj;
                        }, {});

                        // 海外臺校 檳城的好像廢校了
                        if(_currentSchoolType=='海外臺灣學校' && _currentSchoolLocate == '' && _schoolCountryId == 128){
                            _currentSchoolLocate = "雪蘭莪";
                        }

                        // group by 學校所在地
                        let groups = await Object.keys(group_to_values).map(function(key) {
                            return { locate: key, school: group_to_values[key] };
                        });
                        let schoolLocationHTML = '';
                        _schoolList = groups;
                        // 渲染學校所在地、隱藏學校名稱輸入
                        await _schoolList.forEach((value, index) => {
                            schoolLocationHTML += `<option value="${value.locate}">${value.locate}</option>`;
                        });
                        await $schoolLocation.html(schoolLocationHTML);
                        if (_currentSchoolLocate !== "") {
                            await $schoolLocation.val(_currentSchoolLocate);
                        } else {
                            _currentSchoolLocate = _schoolList[0].locate;
                        }
                        await $schoolLocationForm.show();
                        await _reRenderSchoolList();
                        _hasSchoolLocate = true;
                    } else {
                        // 沒有學校列表，則單純顯示學校名稱 text field
                        await $schoolNameTextForm.show();
                        await $schoolNameText.val(_currentSchoolName);
                        _hasSchoolLocate = false;
                    }
                } else {
                    const message = data.messages[0];
                    await swal({
                        title: `ERROR！`,
                        html:`${message}`,
                        type:"error",
                        confirmButtonText: '確定',
                        allowOutsideClick: false
                    });
                }
            } else {
                await $schoolNameTextForm.show();
                await $schoolNameText.val(_currentSchoolName);
                _hasSchoolLocate = false;
            }
        }
    }

    function _chSchoolLocation() {
        _currentSchoolLocate = $(this).val();
        _currentSchoolName = "";
        _reRenderSchoolList();
    }

    function _reRenderSchoolList() {
        if (_systemId === 1 || _systemId === 2) {
            // 重新渲染學士班的學校列表
            let locateIndex = _schoolList.findIndex(order => order.locate === _currentSchoolLocate);

            let schoolListHTML = '';
            _schoolList[locateIndex].school.forEach((value, index) => {
                schoolListHTML += `<option value="${value.name}">${value.name}</option>`;
            });
            $schoolNameSelect.html(schoolListHTML);
            if (_currentSchoolName !== "") {
                $schoolNameSelect.val(_currentSchoolName);
            }

            // 香港學士班的話要再問是否曾經有副學士或高級文憑的調查
            if(_schoolCountryId == 113 && _systemId == 1){
                $('#HK-ADorHD').show();
            }else{
                $('#HK-ADorHD').hide();
            }
        } else {
            // 非學士班，渲染學校名稱 text field
            $schoolNameText.val(_currentSchoolName);
        }
    }

    function _chDadStatus() {
        _currentDadStatus = $(this).val();
        _switchDadDataForm();
    }

    function _switchDadDataForm() {
        if (_currentDadStatus === "undefined") {
            $dadDataForm.hide();
        } else {
            $dadDataForm.fadeIn();
        }
        if(_currentDadStatus === 'alive'){
            $dadPhoneForm.fadeIn();
            $dadJobForm.fadeIn();
        } else {
            $dadPhoneForm.hide();
            $dadJobForm.hide();
            document.getElementById('dadJob').value="";
            document.getElementById('dadPhoneCode').value="";
            document.getElementById('dadPhone').value="";
        }
        _switchGuardianForm();
    }

    function _chMomStatus() {
        _currentMomStatus = $(this).val();
        _switchMomDataForm();
    }

    function _switchMomDataForm() {
        if (_currentMomStatus === "undefined") {
            $momDataForm.hide();
        } else {
            $momDataForm.fadeIn();
        }
        if(_currentMomStatus === 'alive'){
            $momPhoneForm.fadeIn();
            $momJobForm.fadeIn();
        } else {
            $momPhoneForm.hide();
            $momJobForm.hide();
            document.getElementById('momJob').value="";
            document.getElementById('momPhoneCode').value="";
            document.getElementById('momPhone').value="";
        }
        _switchGuardianForm();
    }

    function _switchGuardianForm() {
        if (_currentDadStatus === "undefined" && _currentMomStatus === "undefined") {
            $guardianForm.fadeIn();
        } else {
            $guardianForm.hide();
        }
    }

    // 「是否曾經修讀或正在修習全日制副學士學位（Associate Degree）或高級文憑（Higher Diploma）課程」選擇改變
    function changeHK_ADorHD() {
        if($('input[name="radio-HK-ADorHD"]:checked').val() == 1){  // 有
            $('#has-HK-ADorHD-diploma').fadeIn();  // 詢問是否有畢業證書的問題
        } else {  // 沒有
            // 隱藏所有問題
            $('#had-HK-ADorHD').hide();
            $('#has-HK-ADorHD-diploma').fadeOut();
            // 清空答案
            $('input[name="HK-ADorHD-diploma"]:checked').prop('checked', false);  // 是否取得副學士或高級文憑畢業證書問題
            $('#HK_ADorHD_Diploma').val('');
            $HK_ADorHD_SchoolName.val(null);
            $HK_ADorHD_ClassName.val(null);
        }
    }

    // 「請問您是否已取得全日制副學士學位（Associate Degree）或高級文憑（Higher Diploma）畢業證書」選擇改變
    function changeHadHK_ADorHD() {
        if($('input[name="HK-ADorHD-diploma"]:checked').val() != "undefined"){  // 如果有選擇其中之一
            $('#had-HK-ADorHD').show();
        }
    }

    async function _handleSave() {
        if((_identityId == 4 || _identityId == 5) && $taiwanAddress.val() == ''){
            await swal({title:"在臺學生請注意", html:"如果沒有填寫<a class='text-danger' style='font-weight: bold;'>臺灣地址</a>，<br/>錄取後分發通知書將寄到僑居地地址。", type:"warning", confirmButtonText: '確定'});
        }

        let sendData = {};
        if (sendData = _validateForm()) {
            for (let i in sendData) {
                if (sendData[i] === null) {
                    sendData[i] = "";
                }
            }
            loading.start();
            await student.setStudentPersonalData(sendData)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw res;
                }
            })
            .then(async (json) => {
                // console.log(json);
                await swal({title:"儲存成功", type:"success", confirmButtonText: '確定'});
                window.location.reload();
                loading.complete();
                scroll(0,0);
            })
            .catch((err) => {
                err.json && err.json().then((data) => {
                    console.error(data);
                    swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
                });
                loading.complete();
            })
        } else {
            // console.log('==== validate failed ====');
            swal({
                title: `填寫格式錯誤`,
                html: `請檢查以下表單：<br/>` + _errormsg.join('、<br/>'),
                type:"error",
                confirmButtonText: '確定',
                allowOutsideClick: false
            });
        }
    }

    function _validateForm() {
        // 學生選取的選項和欄位label宣告成變數

        // 申請人資料表
        const inputBackUpEmail = $backupEmail.val(); // 備用郵箱
        const backupEmailText = $backupEmail.parent().find('label').text();
        const inputName = $name.val(); // 中文姓名
        const nameText = $name.parent().find('label').text();
        const inputEngName = $engName.val(); // 英文姓名
        const engNameText = $engName.parent().find('label').text();        
        const choosenGender = $(".gender:checked").val(); // 性別
        const genderFieldSet = $("#Gender_FieldSet");
        const genderText = $('#gender').text();
        const inputBirthday = $birthday.val(); // 出生日期
        const birthdayText = $birthday.parent().find('label').text();
        const choosenBirthLocation = $birthLocation.val(); // 出生地國家
        const birthLocationText = $('#birthPlace').text();
        const inputProposeGroup = $proposeGroup.val(); // 協助推薦來臺就學之學校或組織
        const proposeGroupText = $proposeGroup.parent().find('label').text();
        const choosenSpecial = $(".special:checked").val(); // 身心/特殊者
        const choosenDisabilityCategory = $disabilityCategory.val(); // 身心/特殊者類別
        const choosenDisabilityLevel = $disabilityLevel.val(); // 身心/特殊者類別等級
        const inputOtherDisabilityCategory = $otherDisabilityCategory.val();
        const otherDisabilityCategoryText = $otherDisabilityCategory.parent().find('label').text();

        // 僑居地資料
        const choosenResidenceLocation = $residentLocation.val(); // 僑居地國家
        const residenceLocationText = $('#residentLocationLabel').text();
        const inputResidentID = $residentId.val(); // 僑居地身分證號碼
        const residentIdText = $residentId.parent().find('label').text();
        const inputResidentPassportNo = $residentPassportNo.val(); // 僑居地護照號碼
        const residentPassportNoText = $('#residentYoungPassportNoLabel').text();
        const inputResidentPhoneCode = $residentPhoneCode.val(); // 僑居地電話國碼
        const residentPhoneCodeText = '* 電話國碼';
        const inputResidentPhone = $residentPhone.val(); // 僑居地電話號碼
        const residentPhoneText = $('#residentPhoneLabel').text() + '號碼';
        const inputResidentCellPhoneCode = $residentCellphoneCode.val(); // 僑居地手機國碼
        const residentCellPhoneCodeText = '* 手機國碼';
        const inputResidentCellPhone = $residentCellphone.val(); // 僑居地手機號碼
        const residentCellPhoneText = $('#residentCellPhoneLabel').text() + '號碼';
        const inputResidentAddress = $residentAddress.val(); // 僑居地地址
        const residentAddressText = $residentAddress.parent().find('label').text();

        // 在臺資料
        const choosenTaiwanIdType = $taiwanIdType.val(); // 證件類型
        const inputTaiwanIdNo = $taiwanIdNo.val(); // 證件號碼
        const taiwanIdNoText = $taiwanIdNo.parent().find('label').text();
        const inputTaiwanPassport = $taiwanPassport.val(); // 臺灣證件護照號碼
        const inputTaiwanPhone = $taiwanPhone.val(); // 臺灣點好
        const inputTaiwanAddress = $taiwanAddress.val(); // 臺灣地址

        // 最高學歷
        const inputEducationSystemDescription = $educationSystemDescription.val(); // 學制描述
        const educationSystemDescriptionText = $educationSystemDescription.parent().find('label').text();
        const choosenSchoolCountry = $schoolCountry.val(); // 學校所在地國別
        const schoolCountryText = $('#schoolCountryLabel').text();
        const choosenSchoolType = $schoolType.val(); // 學校類別
        const schoolTypeText = $schoolType.parent().find('label').text();
        const choosenSchoolLocation = $schoolLocation.val(); // 學校所在地
        const choosenSchoolNameSelect = $schoolNameSelect.val(); // 學校名稱 (select)
        const inputSchoolNameText = $schoolNameText.val(); // 學校名稱 (text)
        const schoolNameText = $schoolNameText.parent().find('label').text();
        const choosenHK_ADorHD = $('.radio-HK-ADorHD:checked').val(); // 是否曾經修讀或正在修習全日制副學士學位（Associate Degree）或高級文憑（Higher Diploma）課程
        const choosenHad_HK_ADorHD = $('.radio-HK-ADorHD-diploma:checked').val(); // 請問您是否已取得全日制副學士學位（Associate Degree）或高級文憑（Higher Diploma）畢業證書？
        const Had_HK_ADorHD_Text = $('#Had_HK_ADorHD_Label').text();
        const Had_HK_ADorHD_FieldSet = $('#HK_ADorHD_FieldSet');
        const choosenHK_ADorHD_Diploma = $HK_ADorHD_Diploma.val();  // 文憑類別
        const HK_ADorHD_Diploma_Text = $HK_ADorHD_Diploma.parent().find('label').text();
        const inputHK_ADorHD_SchoolName = $HK_ADorHD_SchoolName.val();  // 學校名稱
        const HK_ADorHD_SchoolName_Text = $HK_ADorHD_SchoolName.parent().find('label').text();
        const inputHK_ADorHD_ClassName = $HK_ADorHD_ClassName.val();  // 課程名稱
        const HK_ADorHD_ClassName_Text = $HK_ADorHD_ClassName.parent().find('label').text();
        const inputMajorSubject = $majorSubject.val(); // 主修科目
        const majorSubjectText = $majorSubject.parent().find('label').text();
        const inputMinorSubject = $minorSubject.val();; // 輔修科目
        const inputSchoolAdmissionAt = $schoolAdmissionAt.val(); // 入學時間
        const schoolAdmissionAtText = $schoolAdmissionAt.parent().find('label').text();
        const inputSchoolGraduateAt = $schoolGraduateAt.val(); // 畢業時間
        const schoolGraduateAtText = $schoolGraduateAt.parent().find('label').text();
        const choosenTwoYearTechDiploma = $twoYearTechDiploma.val(); // 文憑類別（港二技）
        const twoYearTechDiplomaText = $twoYearTechDiploma.parent().find('label').text();
        const inputTwoYearTechClassName = $twoYearTechClassName.val(); // 課程名稱（港二技）
        const twoYearTechClassNameText = $twoYearTechClassName.parent().find('label').text();
        const inputTwoYearTechClassStart = $twoYearTechClassStart.val(); // 課程開始日期（港二技）
        const twoYearTechClassStartText = $twoYearTechClassStart.parent().find('label').text();
        const inputTwoYearTechClassEnd = $twoYearTechClassEnd.val(); // 課程結束日期（港二技）
        
        // 家長資料
        const choosenDadStatus = $(".dadStatus:checked").val(); // 父親存歿
        const inputDadName = $dadName.val(); // 父親中文姓名
        const dadNameText = '父親' + $dadName.parent().find('label').text();
        const inputDadEngName = $dadEngName.val(); // 父親英文姓名
        const dadEngNameText = '父親' + $dadEngName.parent().find('label').text();
        const inputDadBirthday = $dadBirthday.val(); // 父親出生日
        const dadBirthdayText = '父親' + $dadBirthday.parent().find('label').text();
        const inputDadJob = $dadJob.val(); // 父親職業
        const dadJobText = '父親' + $dadJob.parent().find('label').text();
        const inputDadPhoneCode = $dadPhoneCode.val(); // 父親聯絡電話國碼
        const dadPhoneCodeText = '父親* 聯絡電話國碼';
        const inputDadPhone = $dadPhone.val(); // 父親聯絡電話號碼
        const dadPhoneText = '父親' + $('#dadPhoneLabel').text();
        const choosenMomStatus = $(".momStatus:checked").val(); // 父親存歿
        const inputMomName = $momName.val(); // 母親中文姓名
        const momNameText = '母親' + $momName.parent().find('label').text();
        const inputMomEngName = $momEngName.val(); // 母親英文姓名
        const momEngNameText = '母親' + $momEngName.parent().find('label').text();
        const inputMomBirthday = $momBirthday.val(); // 母親出生日
        const momBirthdayText = '母親' + $momBirthday.parent().find('label').text();
        const inputMomJob = $momJob.val(); // 母親職業
        const momJobText = '母親' + $momJob.parent().find('label').text();
        const inputMomPhoneCode = $momPhoneCode.val(); // 母親聯絡電話國碼
        const momPhoneCodeText = '母親* 聯絡電話國碼';
        const inputMomPhone = $momPhone.val(); // 母親聯絡電話號碼
        const momPhoneText = '母親' + $('#momPhoneLabel').text();
        const inputGuardianName = $guardianName.val(); // 監護人中文姓名
        const guardianNameText = '監護人' + $guardianName.parent().find('label').text();
        const inputGuardianEngName = $guardianEngName.val(); // 監護人英文姓名
        const guardianEngNameText = '監護人' + $guardianEngName.parent().find('label').text();
        const inputGuardianBirthday = $guardianBirthday.val(); // 監護人出生日
        const guardianBirthdayText = '監護人' + $guardianBirthday.parent().find('label').text();
        const inputGuardianJob = $guardianJob.val(); // 監護人職業
        const guardianJobText = '監護人' + $guardianJob.parent().find('label').text();
        const inputGuardianPhoneCode = $guardianPhoneCode.val(); // 監護人聯絡電話國碼
        const guardianPhoneCodeText = '監護人* 聯絡電話國碼';
        const inputGuardianPhone = $guardianPhone.val(); // 監護人聯絡電話號碼
        const guardianPhoneText = '監護人' + $('#guardianPhoneLabel').text();

        // 在臺聯絡人
        const inputTwContactName = $twContactName.val();// 姓名
        const twContactNameText = '在臺聯絡人' + $('#twYoungContactNameLabel').text();
        const inputTwContactRelation = $twContactRelation.val(); // 關係
        const twContactRelationText = '在臺聯絡人' + $('#twYoungContactRelationLabel').text();
        const inputTwContactPhone = $twContactPhone.val(); // 聯絡電話
        const twContactPhoneText = '在臺聯絡人' + $('#twYoungContactPhoneLabel').text();
        const inputTwContactAddress = $twContactAddress.val(); // 地址
        const twContactAddressText = '在臺聯絡人' + $('#twYoungContactAddressLabel').text();
        const inputTwContactWorkplaceName = $twContactWorkplaceName.val(); // 服務機關名稱
        const twContactWorkplaceNameText = '在臺聯絡人' + $('#twYoungContactWorkplaceNameLabel').text();
        const inputTwContactWorkplacePhone = $twContactWorkplacePhone.val(); // 服務機關電話
        const twContactWorkplacePhoneText = '在臺聯絡人' + $('#twYoungContactWorkplacePhoneLabel').text();
        const inputTwContactWorkplaceAddress = $twContactWorkplaceAddress.val(); // 服務機關地址
        const twContactWorkplaceAddressText = '在臺聯絡人' + $('#twYoungContactWorkplaceAddressLabel').text();

        /*
        *   3400～4DFF：中日韓認同表意文字擴充A區，總計收容6,582個中日韓漢字。
        *   4E00～9FFF：中日韓認同表意文字區，總計收容20,902個中日韓漢字。 
        *   0023： #
        *   002d： -
        *   0027: '
        *   00b7：半形音界號 ·
        *   2027：全形音界號 ‧
        *   \s ： 空白
        *   \d ： 數字
        *   00c0~33FF：包含大部分國家的文字
        *   0020：空格space
        *   \p{sc=Han}/gu ： 中日韓漢字
        */
        
        //將輸入欄位資料過濾  避免xss攻擊
        function regexChinese(str) {
            //return str.replace(/[^\u3400-\u9fff\u2027\u00b7]/g, "")
            const regexp = /\p{sc=Han}|[\u2027\u00b7]/gu;
            return str.match(regexp).join("");
        }
        function regexEnglish(str) {
            return str.replace(/[\s]/g, "\u0020").replace(/[^\u0020\u0027a-zA-Z.,-]/g, "");
        }
        function regexGeneral(str) {
            return str.replace(/[\s]/g, "\u0020").replace(/[\<\>\"]/g, "");
        }
        function regexIdNumber(str, LocateOrIdType) { // 需求多一個地區或證件類型
            if (LocateOrIdType == 113) { // 香港
                // 香港身份證號驗證格式，1或2位字母+6位數字+(1位數字或字母效驗碼)
                const hk_idRegex = /^[A-z]{1,2}\d{6}[(](\d{1}|[A-z])[)]$/;
                if (str.match(hk_idRegex) == null) { // 不符合上述的格式就回傳格式錯誤
                    return 'formatWrong';
                } else {
                    return str;
                }
            } else if (LocateOrIdType == 127) { // 澳門
                // 澳門身份證號驗證格式，(1位數字爲0/1/5/7)+6位數字+(1位數字效驗碼)
                const macau_idRegex = /^[0157]{1}\d{6}[(]\d{1}[)]$/;
                if (str.match(macau_idRegex) == null) { // 不符合上述的格式就回傳格式錯誤
                    return 'formatWrong';
                } else {
                    return str;
                }
            } else if (LocateOrIdType == "身分證") { // 在臺證件爲身分證
                // 驗證格式，1位字母爲地區+1位數字爲1/2(性別)+8位數字
                const taiwan_idRegex = /^[A-z]{1}[1-2]{1}\d{8}$/;
                if (str.match(taiwan_idRegex) == null) { // 不符合上述的格式就回傳格式錯誤
                    return 'formatWrong';
                } else {
                    return str;
                }
            } else if (LocateOrIdType == "居留證") { // 在臺證件爲居留證
                // 驗證格式，1位字母爲地區(不包括L、S、R、Y)+1位數字爲A/B/C/D/8/9(新式舊式性別區分)+8位數字
                const taiwan_permitRegex = /^[A-KM-QT-YZa-km-qt-yz]{1}([A-Da-d8-9]{1})\d{8}$/;
                if (str.match(taiwan_permitRegex) == null) { // 不符合上述的格式就回傳格式錯誤
                    return 'formatWrong';
                } else {
                    return str;
                }
            } else { // 其餘證件只允許字母數字和-號
                return str.replace(/[^0-9A-z\u002d]/g, "");
            }
        }
        function regexPassportNumber(str) { // 護照允許字母數字
            return str.replace(/[^0-9A-z]/g, "");
        }
        function regexNumber(str) { // 電話與國碼允許數字
            return str.replace(/[^\d]/g, "");
        }
        function _validateEmail(str) { // 驗證 Email 格式是否正確
            if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str.value)) {
                return false;
            } else {
                return true;
            }
        }

        function _idValidator(LocateOrIdType, value, colName, colAlert, key) { // 證件身分證號碼驗證
            if (value == "") { // 輸入式字串欄位判斷有沒有填
                colAlert.addClass('invalidInput');
                _correct = false;
                _errormsg.push(colName + '爲必填，請填寫');
            } else {
                // 不是港澳地區也不是在臺證件，如過濾後少過原本值的長度，則提示檢查欄位，防止是誤打
                if (LocateOrIdType != 113 && LocateOrIdType != 127 && LocateOrIdType != "身分證" && LocateOrIdType != "居留證") {
                    //if (regexIdNumber(value, LocateOrIdType).length != value.length) { 
                    //    colAlert.addClass('invalidInput');
                    //    _errormsg.push(colName + '輸入格式有字元不符，請檢查並重新填寫');
                    //    _correct = false;
                    //} else { // 過濾後長度一致再丟進sendData
                    //    colAlert.removeClass('invalidInput');
                    //    sendData[key] = regexIdNumber(value, LocateOrIdType);
                    //}  

                    // 先不正規過濾
                    colAlert.removeClass('invalidInput');
                    sendData[key] = value;
                } else {  // 港澳地區或在臺證件額外驗證，不符合就回傳錯誤
                    if (regexIdNumber(value, LocateOrIdType) == "formatWrong") {
                        colAlert.addClass('invalidInput');
                        _errormsg.push(colName + '輸入格式錯誤，請檢查並重新填寫');
                        _correct = false;
                    } else { // 過濾後格式符合再丟進sendData
                        colAlert.removeClass('invalidInput');
                        sendData[key] = regexIdNumber(value, LocateOrIdType);
                    }
                }
            }
        }
        function _validator(value, type, colName, colAlert, key) { // 一般欄位驗證
            switch (type) {
                case 'passport':
                    if (value == "") { // 輸入式字串欄位判斷有沒有填
                        colAlert.addClass('invalidInput');
                        _correct = false;
                        _errormsg.push(colName + '爲必填，請填寫');
                        break;
                    } else { // 有填再正規化欄位值
                        //if (regexPassportNumber(value).length != value.length) { // 如過濾後少過原本值的長度，則提示檢查欄位，防止是誤打
                        //    console.log(regexPassportNumber(value).length);
                        //    console.log(value.length);
                        //    colAlert.addClass('invalidInput');
                        //    _errormsg.push(colName + '輸入格式有字元不符，請檢查並重新填寫');
                        //    _correct = false;
                        //    break;
                        //} else if (regexPassportNumber(value) == "") { // 如過濾後是空值則要求重新填寫，防止來亂
                        //    colAlert.addClass('invalidInput');
                        //    _correct = false;
                        //    _errormsg.push(colName + '輸入格式不符，請重新填寫');
                        //    break;
                        //} else {
                        //    colAlert.removeClass('invalidInput');
                        //    sendData[key] = regexPassportNumber(value);
                        //    break;
                        //}

                        //先不正規過濾
                        colAlert.removeClass('invalidInput');
                        sendData[key] = value;
                        break;
                    }
                case 'string':
                    colAlert.addClass('invalidInput');
                    if (value == "") { // 輸入式字串欄位判斷有沒有填
                        _errormsg.push(colName + '爲必填，請填寫');
                        _correct = false;
                    } else if (value == null) { // 下拉式判斷有沒有選
                        _errormsg.push(colName + '爲必選，請選擇');
                        _correct = false;
                    } else { // 有填再正規化欄位值
                        if (regexGeneral(value) == "") { // 如過濾後是空值則要求重新填寫，防止來亂
                            _errormsg.push(colName + '輸入格式不符，請重新填寫');
                            _correct = false;
                        } else { // 都沒問題再丟sendData
                            colAlert.removeClass('invalidInput');
                            sendData[key] = regexGeneral(value);
                        }
                    }
                    break;
                case 'chinese':
                    colAlert.addClass('invalidInput');
                    if (value == "") { // 中文姓名欄位判斷有沒有填
                        _errormsg.push(colName + '爲必填，請填寫');
                        _correct = false;
                    } else { // 有填再正規化欄位值
                        if (regexChinese(value).length != value.length) {  // 如過濾後少過原本值的長度，則提示檢查欄位，防止是誤打造成名字錯誤
                            _errormsg.push(colName + '輸入格式有文字不符，請檢查並重新填寫');
                            _correct = false;
                        } else if (regexChinese(value) == "") { // 如過濾後是空值則要求重新填寫，防止來亂
                            _errormsg.push(colName + '輸入格式完全不符，請檢查並重新填寫');
                            _correct = false;
                        } else { // 都沒問題再丟sendData
                            colAlert.removeClass('invalidInput');
                            sendData[key] = regexChinese(value);
                        }
                    }
                    break;
                case 'english':
                    colAlert.addClass('invalidInput');
                    if (value == "") { // 英文姓名欄位判斷有沒有填
                        _errormsg.push(colName + '爲必填，請填寫');
                        _correct = false;
                    } else { // 有填再正規化欄位值
                        if (regexEnglish(value).length != value.length) { // 如過濾後少過原本值的長度，則提示檢查欄位，防止是誤打造成名字錯誤
                            _errormsg.push(colName + '輸入格式有文字不符，請檢查並重新填寫');
                            _correct = false;
                        } else if (regexEnglish(value) == "") { // 如過濾後是空值則要求重新填寫，防止來亂
                            _errormsg.push(colName + '輸入格式不符，請檢查並重新填寫');
                            _correct = false;
                        } else { // 都沒問題再丟sendData
                            colAlert.removeClass('invalidInput');
                            sendData[key] = regexEnglish(value);
                        }
                    }
                    break;
                case 'radio':
                    if (value != 'M' && value != 'F' && isNaN(value)) { // 判斷默認沒給值的radio（性別和香港是否取得副學士或高級文憑是否有值）
                        colAlert.addClass('invalidFieldSet');
                        _correct = false;
                        _errormsg.push(colName + '爲必選，請點選');
                    } else { // 有點選後再丟sendData
                        colAlert.removeClass('invalidFieldSet');
                        sendData[key] = value;
                    }
                    break;
                case 'phoneCode': // TODO 應該要根據5大洲區分國碼長度？
                    if (regexNumber(value) == "") { // 只能填數字，空的就不給你過
                        colAlert.addClass('invalidInput');
                        _correct = false;
                        _errormsg.push(colName + '爲必填，請填寫數字');
                    } else { // 有填再丟sendData
                        colAlert.removeClass('invalidInput');
                        sendData[key] = regexNumber(value);
                    }
                    break;
                case 'phone': // TODO 應該要加上國家（加拿大和大陸）區分電話號碼長度，加拿大的話最少能填7碼，大陸的話最多能填11碼，其餘皆爲8-10碼？
                    colAlert.addClass('invalidInput');
                    if (regexNumber(value) == "") { // 只能填數字，空的就不給你過
                        _correct = false;
                        _errormsg.push(colName + '爲必填，請填寫數字');
                    } else { // 有填再正規化欄位值
                        if (regexNumber(value).length < 7) { // 過濾後少過7碼，則提示不能少過
                            _correct = false;
                            _errormsg.push(colName + '輸入格式不符，最少要7碼，請重新填寫');
                        } else if (regexNumber(value).length > 11) { // 過濾後超過11碼，則提示不能超過
                            _correct = false;
                            _errormsg.push(colName + '輸入格式不符，不能超過11碼，請重新填寫');
                        } else { // 都沒問題再丟sendData
                            colAlert.removeClass('invalidInput');
                            sendData[key] = regexNumber(value);
                        }
                    }
                    break;
                case 'email':
                    if (!_validateEmail(value)) { // 判斷Email格式，格式不對就不給過
                        colAlert.addClass('invalidInput');
                        _correct = false;
                        _errormsg.push(colName + '輸入格式錯誤，請確認資料是否正確');
                    } else { // 沒問題再丟sendData
                        colAlert.removeClass('invalidInput');
                        sendData[key] = value;
                    }
                    break;
                case 'country':
                    colAlert.parent().find('button').addClass('invalidInput');
                    if (value == "") { // 輸入式字串欄位判斷有沒有填
                        _errormsg.push(colName + '爲必填，請填寫');
                        _correct = false;
                    } else if (value == null) { // 下拉式判斷有沒有選
                        _errormsg.push(colName + '爲必選，請選擇');
                        _correct = false;
                    } else { // 有填再正規化欄位值
                        if (regexGeneral(value) == "") { // 如過濾後是空值則要求重新填寫，防止來亂
                            _errormsg.push(colName + '輸入格式不符，請重新填寫');
                            _correct = false;
                        } else { // 都沒問題再丟sendData
                            colAlert.parent().find('button').removeClass('invalidInput');
                            sendData[key] = regexGeneral(value);
                        }
                    }
                    break;
            }
        }

        let _correct = true; // 格式正確
        let sendData = { // 預設送給後端的資料
            backup_email: inputBackUpEmail, // 選填，有值再檢查
            propose_group: inputProposeGroup, // 選填，有值再檢查
            special: choosenSpecial, // radio類型，預設有值
            resident_passport_no: regexIdNumber(inputResidentPassportNo), // 選填，直接過濾輸入的值
            taiwan_id_type: choosenTaiwanIdType, // 下拉式選單類型，選填，有選再檢查taiwan_id
            taiwan_passport: regexIdNumber(inputTaiwanPassport), // 選填，直接過濾輸入的值
            taiwan_phone: regexNumber(inputTaiwanPhone), // 選填，直接過濾輸入的值
            taiwan_address: regexGeneral(inputTaiwanAddress), // 選填，直接過濾輸入的值
            school_locate: "", // 學校所在地，給默認爲空值
            school_type: "", // 學校類型，給默認爲空值
            HK_have_associate_degree_or_higher_diploma: choosenHK_ADorHD, // radio類型，預設有值
            dad_status: choosenDadStatus, // radio類型，預設有值
            mom_status: choosenMomStatus, // radio類型，預設有值
            tw_contact_name: regexGeneral(inputTwContactName), // 除了海青班學制之外，其他學制選填，直接過濾輸入的值
            tw_contact_relation: regexGeneral(inputTwContactRelation), // 除了海青班學制之外，其他學制選填，直接過濾輸入的值
            tw_contact_phone: regexNumber(inputTwContactPhone), // 除了海青班學制之外，其他學制選填，直接過濾輸入的值
            tw_contact_address: regexGeneral(inputTwContactAddress), // 除了海青班學制之外，其他學制選填，直接過濾輸入的值
            tw_contact_workplace_name: regexGeneral(inputTwContactWorkplaceName), // 除了海青班學制之外，其他學制選填，直接過濾輸入的值
            tw_contact_workplace_phone: regexNumber(inputTwContactWorkplacePhone), // 除了海青班學制之外，其他學制選填，直接過濾輸入的值
            tw_contact_workplace_address: regexGeneral(inputTwContactWorkplaceAddress) // 除了海青班學制之外，其他學制選填，直接過濾輸入的值
        }; 

        _errormsg = []; // 錯誤訊息提示
        applicantInfo_errormsg = [];
        residentInfo_errormsg = [];
        inTwInfo_errormsg = [];
        educationBgInfo_errormsg = [];
        parentInfo_errormsg = [];
        twContactInfo_errormsg = [];

        // -------前端欄位資料驗證---------

        // * 申請人資料
        if (inputBackUpEmail != "") { // 備用email爲選填，但有資料的話需要驗證輸入的email格式正不正確
            _validator(inputBackUpEmail, 'email', backupEmailText, $backupEmail, 'backup_email');
        }

        _validator(inputName, 'chinese', nameText, $name, 'name'); // 檢查姓名
        _validator(inputEngName, 'english', engNameText, $engName, 'eng_name'); // 檢查英文姓名
        _validator(choosenGender, 'radio', genderText, genderFieldSet, 'gender'); // 檢查性別
        _validator(inputBirthday, 'string', birthdayText, $birthday, 'birthday');  // 檢查出生日
        _validator(choosenBirthLocation, 'country', birthLocationText, $birthLocation, 'birth_location'); // 檢查出生地

        if (inputProposeGroup != "") { // 協助推薦來臺就學之學校或組織爲選填，但有資料的話需要驗證輸入格式正不正確
            _validator(inputProposeGroup, 'string', proposeGroupText, $proposeGroup, 'propose_group');
        }
        
        if (choosenSpecial === "1") { // 有身心障礙
            sendData['disability_level'] = choosenDisabilityLevel;
            if (choosenDisabilityCategory === "-1") { // 身心障礙類別選擇“其他”
                _validator(inputOtherDisabilityCategory, 'string', otherDisabilityCategoryText, $otherDisabilityCategory, 'disability_category'); // 檢查其他類別
            } else { // 身心障礙類別不選擇“其他”
                sendData['disability_category'] = choosenDisabilityCategory; // 預設有值，所以不丟_validator檢查，直接丟sendData
            }
        }

        // * 僑居地資料
        _validator(choosenResidenceLocation, 'country', residenceLocationText, $residentLocation, 'resident_location'); // 檢查地區與國別
        _idValidator(choosenResidenceLocation, inputResidentID, residentIdText, $residentId, 'resident_id'); // 檢查身份證號碼
        _validator(inputResidentPhoneCode, 'phoneCode', residentPhoneCodeText, $residentPhoneCode, 'resident_phone_code'); // 檢查電話國碼
        _validator(inputResidentPhone, 'phone', residentPhoneText, $residentPhone, 'resident_phone_number'); // 檢查電話號碼
        _validator(inputResidentCellPhoneCode, 'phoneCode', residentCellPhoneCodeText, $residentCellphoneCode, 'resident_cellphone_code'); // 檢查手機國碼
        _validator(inputResidentCellPhone, 'phone', residentCellPhoneText, $residentCellphone, 'resident_cellphone_number'); // 檢查手機號碼
        _validator(inputResidentAddress, 'string', residentAddressText, $residentAddress, 'resident_address'); // 檢查地址

        // * 在臺資料 
        // TODO 先確認是否有臺灣資料再開放填欄位？
        if (choosenTaiwanIdType !== "") { // 有證件類型再送 taiwan_id
            _idValidator(choosenTaiwanIdType, inputTaiwanIdNo, taiwanIdNoText, $taiwanIdNo, 'taiwan_id'); // 檢查證件號碼
        }
        
        // * 學歷資料
        _validator(choosenSchoolCountry, 'country', schoolCountryText, $schoolCountry, 'school_country'); // 檢查學校所在國別
        if (choosenSchoolCountry != null) { // 學校所在國別有值 ，所以再進一步做以下的判斷
            if (_hasEduType) { // 有學校類型表
                _validator(choosenSchoolType, 'string', schoolTypeText, $schoolType, 'school_type'); // 學校類型丟_validator檢查是否有選
                if (_hasSchoolLocate) { // 也有學校所在地列表，判斷 schoolName 要送 select 的
                    sendData['school_locate'] = choosenSchoolLocation; //預設有值，所以不丟_validator檢查，直接丟sendData
                    sendData['school_name'] = choosenSchoolNameSelect; //預設有值，所以不丟_validator檢查，直接丟sendData
                } else { // 沒有有學校所在地列表，判斷 schoolName 要送 text 的
                    _validator(inputSchoolNameText, 'string', schoolNameText, $schoolNameText, 'school_name'); // 學校所在地丟_validator檢查是否有填
                }
            } else if (_hasSchoolLocate) { // 沒有學校類型表，但有學校所在地列表，判斷 schoolName 要送 select 的
                sendData['school_locate'] = choosenSchoolLocation; //預設有值，所以不丟_validator檢查，直接丟sendData
                sendData['school_name'] = choosenSchoolNameSelect; //預設有值，所以不丟_validator檢查，直接丟sendData
            } else { // 沒有學校類型表，也沒有學校所在地列表，判斷 schoolName 要送 text 的
                _validator(inputSchoolNameText, 'string', schoolNameText, $schoolNameText, 'school_name'); // 學校所在地丟_validator檢查是否有填
            }
        }
        _validator(inputSchoolAdmissionAt, 'string', schoolAdmissionAtText, $schoolAdmissionAt, 'school_admission_at'); // 檢查入學時間
        _validator(inputSchoolGraduateAt, 'string', schoolGraduateAtText, $schoolGraduateAt, 'school_graduate_at'); // 檢查畢業時間

        // * 家長資料
        if (choosenDadStatus !== "undefined") { // 父親不為「不詳」
            _validator(inputDadName, 'chinese', dadNameText, $dadName, 'dad_name'); // 檢查父親中文名字
            _validator(inputDadEngName, 'english', dadEngNameText, $dadEngName, 'dad_eng_name'); // 檢查父親英文名字
            _validator(inputDadBirthday, 'string', dadBirthdayText, $dadBirthday, 'dad_birthday'); // 檢查父親出生日
        }

        if(choosenDadStatus === "alive"){ //父親為「存」
            _validator(inputDadJob, 'string', dadJobText, $dadJob, 'dad_job'); // 檢查父親職業
            _validator(inputDadPhoneCode, 'phoneCode', dadPhoneCodeText, $dadPhoneCode, 'dad_phone_code'); // 檢查父親聯絡電話國碼
            _validator(inputDadPhone, 'phone', dadPhoneText, $dadPhone, 'dad_phone_number'); // 檢查父親聯絡電話號碼
        }

        if (choosenMomStatus !== "undefined") { // 母親不為「不詳」
            _validator(inputMomName, 'chinese', momNameText, $momName, 'mom_name'); // 檢查母親中文名字
            _validator(inputMomEngName, 'english', momEngNameText, $momEngName, 'mom_eng_name'); // 檢查母親英文名字
            _validator(inputMomBirthday, 'string', momBirthdayText, $momBirthday, 'mom_birthday'); // 檢查母親出生日
        }

        if(choosenMomStatus === "alive"){ //母親為「存」
            _validator(inputMomJob, 'string', momJobText, $momJob, 'mom_job'); // 檢查母親職業
            _validator(inputMomPhoneCode, 'phoneCode', momPhoneCodeText, $momPhoneCode, 'mom_phone_code'); // 檢查母親聯絡電話國碼
            _validator(inputMomPhone, 'phone', momPhoneText, $momPhone, 'mom_phone_number'); // 檢查母親聯絡電話號碼
        }

        if (choosenDadStatus === "undefined" && choosenMomStatus === "undefined") { // 父母皆為「不詳」
            _validator(inputGuardianName, 'chinese', guardianNameText, $guardianName, 'guardian_name'); // 檢查監護人中文名字
            _validator(inputGuardianEngName, 'english', guardianEngNameText, $guardianEngName, 'guardian_eng_name'); // 檢查監護人英文文名字
            _validator(inputGuardianBirthday, 'string', guardianBirthdayText, $guardianBirthday, 'guardian_birthday'); // 檢查監護人出生日
            _validator(inputGuardianJob, 'string', guardianJobText, $guardianJob, 'guardian_job'); // 檢查監護人職業
            _validator(inputGuardianPhoneCode, 'phoneCode', guardianPhoneCodeText, $guardianPhoneCode, 'guardian_phone_code'); // 檢查監護人聯絡電話國碼
            _validator(inputGuardianPhone, 'phone', guardianPhoneText, $guardianPhone, 'guardian_phone_number'); // 檢查監護人聯絡電話號碼
        }

        // 以不同學制判斷需要檢查的欄位
        if (_systemId !== 3 && _systemId !== 4) { // 學士班、港二技和海青班
            _validator(inputEducationSystemDescription, 'string', educationSystemDescriptionText, $educationSystemDescription, 'education_system_description'); // 檢查學制描述
            if (_systemId === 1) {
                if (choosenSchoolCountry == 113 && choosenHK_ADorHD == 1) { // 香港報名學士班同學有曾經修讀副學士或高級文憑
                    _validator(choosenHad_HK_ADorHD, 'radio', Had_HK_ADorHD_Text, Had_HK_ADorHD_FieldSet, 'HK_have_associate_degree_or_higher_diploma_graduated'); //檢查是否有取得副學士或高級文憑
                    if (!isNaN(choosenHad_HK_ADorHD)) {
                        _validator(choosenHK_ADorHD_Diploma, 'string', HK_ADorHD_Diploma_Text, $HK_ADorHD_Diploma, 'HK_have_AD_or_HD'); // 檢查文憑類別（香港副學士或高級文憑）
                        _validator(inputHK_ADorHD_SchoolName, 'string', HK_ADorHD_SchoolName_Text, $HK_ADorHD_SchoolName, 'HK_AD_or_HD_school_name'); // 檢查學校名稱（香港副學士或高級文憑）
                        _validator(inputHK_ADorHD_ClassName, 'string', HK_ADorHD_ClassName_Text, $HK_ADorHD_ClassName, 'HK_AD_or_HD_class_name'); // 檢查課程名稱（香港副學士或高級文憑）
                    }
                }
            } else if (_systemId === 2) { // 港二技
                _validator(choosenTwoYearTechDiploma, 'string', twoYearTechDiplomaText, $twoYearTechDiploma, 'two_year_tech_diploma'); // 檢查文憑類別（港二技）
                _validator(inputTwoYearTechClassName, 'string', twoYearTechClassNameText, $twoYearTechClassName, 'two_year_tech_class_name'); // 課程名稱（港二技）
                if (choosenSchoolCountry == 113) { // 學校所在國別是香港
                    _validator(inputTwoYearTechClassStart, 'string', twoYearTechClassStartText, $twoYearTechClassStart, 'two_year_tech_class_start'); // 課程認可開始日期（港二技）
                    sendData['two_year_tech_class_end'] = inputTwoYearTechClassEnd; // 課程認可結束日期（港二技），選填，不丟_validator檢查
                }
            } else if (_systemId === 5) { // 海青班
                _validator(inputResidentPassportNo, 'passport', residentPassportNoText, $residentPassportNo, 'resident_passport_no'); // 檢查僑居地護照號碼
                _validator(inputTwContactName, 'string', twContactNameText, $twContactName, 'tw_contact_name'); // 檢查在臺聯絡人姓名
                _validator(inputTwContactRelation, 'string', twContactRelationText, $twContactRelation, 'tw_contact_relation'); // 檢查在臺聯絡人關係
                _validator(inputTwContactPhone, 'phone', twContactPhoneText, $twContactPhone, 'tw_contact_phone'); // 檢查在臺聯絡人聯絡電話
                _validator(inputTwContactAddress, 'string', twContactAddressText, $twContactAddress, 'tw_contact_address'); // 檢查在臺聯絡人地址
                _validator(inputTwContactWorkplaceName, 'string', twContactWorkplaceNameText, $twContactWorkplaceName, 'tw_contact_workplace_name'); // 檢查在臺聯絡人服務機關名稱
                _validator(inputTwContactWorkplacePhone, 'string', twContactWorkplacePhoneText, $twContactWorkplacePhone, 'tw_contact_workplace_phone'); // 檢查在臺聯絡人服務機關電話
                _validator(inputTwContactWorkplaceAddress, 'string', twContactWorkplaceAddressText, $twContactWorkplaceAddress, 'tw_contact_workplace_address'); // 檢查在臺聯絡人服務機關地址
            }
        } else { // 爲碩博班
            _validator(inputMajorSubject, 'string', majorSubjectText, $majorSubject, 'major_subject'); // 檢查主修科目（碩博班）
            sendData['minor_subject'] = regexGeneral(inputMinorSubject); // 輔修科目（碩博班），選填，直接過濾輸入的值
        }
        //console.log(_errormsg);
        if (_correct) { // 所有欄位都沒問題再回傳sendData對應
            return sendData;
        } else { // 需要檢查的欄位有沒問題就回傳false，再提示哪些欄位有錯
            return false;
        }
    }

})();
