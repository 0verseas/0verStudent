(() => {

	/**
	*	private variable
	*/

	let _currentFatherStatus = 1;
	let _currentMotherStatus = 1;

	/**
	*	cache DOM
	*/

	const $personalInfoForm = $('#form-personalInfo'); // 個人資料表單

	// 申請人資料表
	const $reserveEmail = $('#reserveEmail'); // 備用 E-Mail
	const $name = $('#name'); // 姓名（中）
	const $engName = $('#engName');	// 姓名（英）
	const $gender = $personalInfoForm.find('.personalInfoForm'); // 性別
	const $birthday = $('#birthday'); // 生日
	const $birthState = $('#birthState'); // 出生地（州）
	const $birthCountry = $('#birthCountry'); // 出生地（國）
	const $specail = $personalInfoForm.find('.specail'); // 是否為「身心障礙」或「特殊照護」或「特殊教育」者

	// 僑居地資料
	const $residenceState = $('#residenceState'); // 州
	const $residenceCountry = $('#residenceCountry'); // 國
	const $idNumber = $('#idNumber'); // 身分證號碼（ID no.）
	const $passportId = $('#passportId'); // 護照號碼
	const $telCode = $('telCode'); // 電話國碼
	const $telNumber = $('#telNumber'); // 電話號碼
	const $phoneCode = $('#phoneCode'); // 手機國碼
	const $phoneNumber = $('#phoneNumber'); // 手機號碼
	const $address = $('#address'); // 地址（中 / 英）
	const $otherLangAddress = $('#otherLangAddress'); // 地址（其他語言）

	// 在台資料 (選填)
	const $credentialsType = $('#credentialsType'); // 證件類型
	const $credentialsId = $('#credentialsId'); // 該證件號碼
	const $taiwanPassportId = $('#taiwanPassportId'); // 臺灣護照號碼
	const $taiwanTel = $('#taiwanTel'); // 臺灣電話
	const $taiwanAddress = $('#taiwanAddress'); // 臺灣地址

	// 學歷
	const $educationDescription = $('#educationDescription'); // 學制描述
	const $schoolState = $('#schoolState'); // 學校所在地（州）
	const $schoolCountry = $('#schoolCountry'); // 學校所在地（國）
	const $schoolLocation = $('#schoolLocation'); // 學校所在地
	const $schoolName = $('#schoolName'); // 學校名稱
	const $admissionDate = $('#admissionDate'); // 入學時間
	const $graduationDate = $('#graduationDate'); // 畢業時間

	// 家長資料
	// 父親
	const $fatherStatus = $('.fatherStatus'); // 存歿
	const $fatherDataForm = $('#form-fatherData'); // 資料表單
	const $fatherName = $('#fatherName'); // 姓名（中）
	const $engFatherName = $('#engFatherName'); // 姓名（英）
	const $fatherBirthday = $('#fatherBirthday'); // 生日
	const $fatherNativePlace = $('#fatherNativePlace'); // 籍貫
	const $fatherJob = $('#fatherJob'); // 職業
	// 母親
	const $motherStatus = $('.motherStatus'); // 存歿
	const $motherDataForm = $('#form-motherData'); // 資料表單
	const $motherName = $('#motherName'); // 姓名（中）
	const $engMotherName = $('#engMotherName'); // 姓名（英）
	const $motherBirthday = $('#motherBirthday'); // 生日
	const $motherNativePlace = $('#motherNativePlace'); // 籍貫
	const $motherJob = $('#motherJob'); // 職業
	// 監護人（父母皆不詳才需要填寫）
	const $guardianForm = $('#form-guardian'); // 資料表單
	const $guardianName = $('#guardianName'); // 姓名（中）
	const $engGuardianName = $('#engGuardianName'); // 姓名（英）
	const $guardianBirthday = $('#guardianBirthday'); // 生日
	const $guardianNativePlace = $('#guardianNativePlace'); // 籍貫
	const $guardianJob = $('#guardianJob'); // 職業

	// 在台聯絡人
	const $contactPersonName = $('#contactPersonName'); // 姓名
	const $contactPersonRelation = $('#contactPersonRelation'); // 關係
	const $contactPersonPhone = $('#contactPersonPhone'); // 聯絡電話
	const $contactPersonAddress = $('#contactPersonAddress'); // 地址
	const $serviceName = $('#serviceName'); // 服務機關名稱
	const $servicePhone = $('#servicePhone'); // 服務機關電話
	const $serviceAddress = $('#serviceAddress'); // 服務機關地址
	const $saveBtn = $('#btn-save');



	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$fatherStatus.on('change', _switchFatherDataForm);
	$motherStatus.on('change', _switchMotherDataForm);
	$saveBtn.on('click', _handleSave);

	function _init() {
		student.setHeader();
		_switchGuardianForm();
	}

	function _switchFatherDataForm() {
		_currentFatherStatus = Number($(this).val());
		if (_currentFatherStatus === 3) {
			$fatherDataForm.hide();
		} else {
			$fatherDataForm.fadeIn();
		}
		_switchGuardianForm();
	}

	function _switchMotherDataForm() {
		_currentMotherStatus = Number($(this).val());
		if (_currentMotherStatus === 3) {
			$motherDataForm.hide();
		} else {
			$motherDataForm.fadeIn();
		}
		_switchGuardianForm();
	}

	function _switchGuardianForm() {
		if (_currentFatherStatus === 3 && _currentMotherStatus === 3) {
			$guardianForm.fadeIn();
		} else {
			$guardianForm.hide();
		}
	}

	function _handleSave() {
		location.href = './educationInfo.html'
	}

})();
