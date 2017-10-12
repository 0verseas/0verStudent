(() => {

	/**
	*	private variable
	*/

	let _currentDadStatus = 'alive';
	let _currentMomStatus = 'deceased';
	let _countryList = [];

	/**
	*	cache DOM
	*/

	const $personalInfoForm = $('#form-personalInfo'); // 個人資料表單

	// 申請人資料表
	const $backupEmail = $('#backupEmail'); // 備用 E-Mail
	const $name = $('#name'); // 姓名（中）
	const $engName = $('#engName');	// 姓名（英）
	const $gender = $personalInfoForm.find('.gender'); // 性別
	const $birthday = $('#birthday'); // 生日
	const $birthState = $('#birthState'); // 出生地（州）
	const $birthLocation = $('#birthLocation'); // 出生地（國）
	const $specail = $personalInfoForm.find('.specail'); // 是否為「身心障礙」或「特殊照護」或「特殊教育」者

	// 僑居地資料
	const $residenceState = $('#residenceState'); // 州
	const $residentLocation = $('#residentLocation'); // 國
	const $residentId = $('#residentId'); // 身分證號碼（ID no.）
	const $residentPassportNo = $('#residentPassportNo'); // 護照號碼
	const $residentPhoneCode = $('#residentPhoneCode'); // 電話國碼
	const $residentPhone = $('#residentPhone'); // 電話號碼
	const $residentCellphoneCode = $('#residentCellphoneCode'); // 手機國碼
	const $residentCellphone = $('#residentCellphone'); // 手機號碼
	const $residentAddress = $('#residentAddress'); // 地址（中 / 英）
	const $residentOtherLangAddress = $('#residentOtherLangAddress'); // 地址（其他語言）

	// 在台資料 (選填)
	const $taiwanIdType = $('#taiwanIdType'); // 證件類型
	const $taiwanIdNo = $('#taiwanIdNo'); // 該證件號碼
	const $taiwanPassport = $('#taiwanPassport'); // 臺灣護照號碼
	const $taiwanPhone = $('#taiwanPhone'); // 臺灣電話
	const $taiwanAddress = $('#taiwanAddress'); // 臺灣地址

	// 學歷
	const $educationSystemDescription = $('#educationSystemDescription'); // 學制描述
	const $schoolState = $('#schoolState'); // 學校所在地（州）
	const $schoolCountry = $('#schoolCountry'); // 學校所在地（國）
	const $schoolType = $('#schoolType'); // 學校類別
	const $schoolLocation = $('#schoolLocation'); // 學校所在地
	const $schoolName = $('#schoolName'); // 學校名稱
	const $schoolAdmissionAt = $('#schoolAdmissionAt'); // 入學時間
	const $schoolGraduateAt = $('#schoolGraduateAt'); // 畢業時間

	// 家長資料
	// 父親
	const $dadStatus = $('.dadStatus'); // 存歿
	const $dadDataForm = $('#form-dadData'); // 資料表單
	const $dadName = $('#dadName'); // 姓名（中）
	const $dadEngName = $('#dadEngName'); // 姓名（英）
	const $dadBirthday = $('#dadBirthday'); // 生日
	const $dadHometown = $('#dadHometown'); // 籍貫
	const $dadJob = $('#dadJob'); // 職業
	// 母親
	const $momStatus = $('.momStatus'); // 存歿
	const $momDataForm = $('#form-momData'); // 資料表單
	const $momName = $('#momName'); // 姓名（中）
	const $momEngName = $('#momEngName'); // 姓名（英）
	const $momBirthday = $('#momBirthday'); // 生日
	const $momHometown = $('#momHometown'); // 籍貫
	const $momJob = $('#momJob'); // 職業
	// 監護人（父母皆不詳才需要填寫）
	const $guardianForm = $('#form-guardian'); // 資料表單
	const $guardianName = $('#guardianName'); // 姓名（中）
	const $guardianEngName = $('#guardianEngName'); // 姓名（英）
	const $guardianBirthday = $('#guardianBirthday'); // 生日
	const $guardianHometown = $('#guardianHometown'); // 籍貫
	const $guardianJob = $('#guardianJob'); // 職業

	// 在台聯絡人
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

	$birthState.on('change', _reRenderCountry);
	$residenceState.on('change', _reRenderCountry);
	$schoolState.on('change', _reRenderCountry);
	$dadStatus.on('change', _switchDadDataForm);
	$momStatus.on('change', _switchMomStatus);
	$saveBtn.on('click', _handleSave);

	function _init() {
		student.getStudentPersonalData()
		.then((res) => {
			if (res.ok) {
				_initCountryList();

				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			console.log(json);
		})
		.then(() => {
			student.setHeader();
			$("input[name=dadStatus][value='"+ _currentDadStatus +"']").prop("checked",true);
			$("input[name=momStatus][value='"+ _currentMomStatus +"']").prop("checked",true);
			_switchGuardianForm();
		})
		.catch((err) => {
			err.json && err.json().then((data) => {
				console.error(data);
			})
		})
	}

	function _initCountryList() {
		student.getCountryList()
		.then((json) => {
			let stateHTML = '<option data-continentIndex="-1">Continent</option>';
			json.forEach((obj, index) => {
				stateHTML += '<option data-continentIndex="' + index + '">' + obj.continent + '</option>'
			})
			$birthState.html(stateHTML);
			$residenceState.html(stateHTML);
			$schoolState.html(stateHTML);
			_countryList = json;
		})
	}

	function _reRenderCountry() {
		const continent = $(this).find(':selected').data('continentindex');
		const $row = $(this).closest('.row');
		const $countrySelect = $row.find('.country');

		let countryHTML = '';
		if (continent !== -1) {
			_countryList[continent]['country'].forEach((obj, index) => {
				countryHTML += '<option value="' + obj.id + '">' + obj.country + '</option>';
			})
		} else {
			countryHTML = '<option value="">Country</option>'
		}
		$countrySelect.html(countryHTML);
	}

	function _switchDadDataForm() {
		_currentDadStatus = $(this).val();
		if (_currentDadStatus === "undefined") {
			$dadDataForm.hide();
		} else {
			$dadDataForm.fadeIn();
		}
		_switchGuardianForm();
	}

	function _switchMomStatus() {
		_currentMomStatus = $(this).val();
		if (_currentMomStatus === "undefined") {
			$momDataForm.hide();
		} else {
			$momDataForm.fadeIn();
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

	function _handleSave() {
		if (sendData = _validateForm()) {
			console.log(sendData);
			student.setStudentPersonalData(sendData)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				console.log(json);
				// location.href = './educationInfo.html'
			})
			.catch((err) => {
				err.json && err.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
			})
		} else {
			console.log('==== validate failed ====');
		}
	}

	// 驗證是否有值
	function _validateNotEmpty(obj) {
		let _checkValue = (obj.value) ? obj.value : obj.el.val();
		return _checkValue !== "";
	}

	// 驗證 Email 格式是否正確
	function _validateEmail(obj) {
		let _checkValue = (obj.value) ? obj.value : obj.el.val();
		if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(_checkValue)) {
			return false;
		} else {
			return true;
		}
	}

	// 驗證日期
	function _validateDate(obj) {
		let _checkValue = (obj.value) ? obj.value : obj.el.val();
		return Date.parse(_checkValue)
	}

	function _getDBData(obj) {
		let _sendValue = "";
		if (obj.dbData) {
			_sendValue = obj.dbData;
		} else if (obj.value) {
			_sendValue = obj.value;
		} else {
			_sendValue = obj.el.val();
		}
		return _sendValue;
	}

	function _validateForm() {

		/**
		*	formValidateList: 格式設定表，由此表決定如何驗證表單，並產出要送給後端的 json object。
		*	el: DOM 元素。
		*	require: 是否為必填。
		*	type: 輸出值的格式，之後會驗證是否符合該格式。
		*	value: 預設取值方式為 el.val()，如果有特殊需求(像是 radio 要用 class name 取值)，則填寫在 value 中。
		*	dbKey: 資料送往後端的 key，不需送出則不填。
		*	dbData: 送往後端的資料，預設為 value，其次為 el.val()。如果有特殊需求（像是電話要和國碼合併），則填寫在 dbData 中。
		*/
		let formValidateList = [
		{
			el: $backupEmail,
			require: false,
			type: 'email',
			dbKey: 'backup_email'
		},
		{
			el: $name,
			require: true,
			type: 'string',
			dbKey: 'name'
		},
		{
			el: $engName,
			require: true,
			type: 'string',
			dbKey: 'eng_name'
		},
		{
			el: $gender,
			require: true,
			type: 'radio',
			value: $(".gender:checked").val(),
			dbKey: 'gender'
		},
		{
			el: $birthday,
			require: true,
			type: 'date',
			dbKey: 'birthday'
		},
		{
			el: $birthLocation,
			require: true,
			type: 'string',
			dbKey: 'birth_location'
		},
		{
			el: $specail,
			require: true,
			type: 'radio',
			value: $(".specail:checked").val(),
			dbKey:'special'
		},
		{
			el: $residentLocation,
			require: true,
			type: 'string',
			dbKey: 'resident_location'
		},
		{
			el: $residentId,
			require: true,
			type: 'string',
			dbKey: 'resident_id'
		},
		{
			el: $residentPassportNo,
			require: true,
			type: 'string',
			dbKey: 'resident_passport_no'
		},
		{ // 電話國碼，需驗證，合併在電話號碼一起送出。
			el: $residentPhoneCode,
			require: true,
			type: 'string'
		}, 
		{
			el: $residentPhone,
			require: true,
			type: 'string',
			dbKey: 'resident_phone',
			dbData: $residentPhoneCode.val() + $residentPhone.val()
		},
		{ // 手機國碼，需驗證，合併在手機號碼一起送出。
			el: $residentCellphoneCode,
			require: true,
			type: 'string'
		},
		{
			el: $residentCellphone,
			require: true,
			type: 'string',
			dbKey: 'resident_cellphone',
			dbData: $residentCellphoneCode.val() + $residentCellphone.val()
		},
		{
			el: $residentAddress,
			require: true,
			type: 'string',
			dbKey: 'resident_address',
			dbData: $residentAddress.val() + ';' + $residentOtherLangAddress.val()
		},
		{
			el: $residentOtherLangAddress,
			require: false,
			type: 'string'
		},
		{
			el: $taiwanIdType,
			require: false,
			type: 'string',
			dbKey: 'taiwan_id_type'
		},
		{
			el: $taiwanPassport,
			require: false,
			type: 'string',
			dbKey: 'taiwan_passport'
		},
		{
			el: $taiwanPhone,
			require: false,
			type: 'string',
			dbKey: 'taiwan_phone'
		},
		{
			el: $taiwanAddress,
			require: false,
			type: 'string',
			dbKey: 'taiwan_address'
		},
		{
			el: $educationSystemDescription,
			require: true,
			type: 'string',
			dbKey: 'education_system_description'
		},
		{
			el: $schoolCountry,
			require: true,
			type: 'string',
			dbKey: 'school_country'
		},
		{
			el: $schoolType,
			require: true,
			type: 'string',
			dbKey: 'school_type'
		},
		{
			el: $schoolLocation,
			require: true,
			type: 'string',
			dbKey: 'school_locate'
		},
		{
			el: $schoolName,
			require: true,
			type: 'string',
			dbKey: 'school_name'
		},
		{
			el: $schoolAdmissionAt,
			require: true,
			type: 'date',
			dbKey: 'school_admission_at'
		},
		{
			el: $schoolGraduateAt,
			require: true,
			type: 'date',
			dbKey: 'school_graduate_at'
		},
		{
			el: $dadStatus,
			require: true,
			type: 'radio',
			value: _currentDadStatus,
			dbKey: 'dad_status'
		},
		{
			el: $momStatus,
			require: true,
			type: 'radio',
			value: _currentMomStatus,
			dbKey: 'mom_status'
		},
		{
			el: $twContactName,
			require: false,
			type: 'string',
			dbKey: 'tw_contact_name'
		},
		{
			el: $twContactRelation,
			require: false,
			type: 'string',
			dbKey: 'tw_contact_relation'
		},
		{
			el: $twContactPhone,
			require: false,
			type: 'string',
			dbKey: 'tw_contact_phone'
		},
		{
			el: $twContactAddress,
			require: false,
			type: 'string',
			dbKey: 'tw_contact_address'
		},
		{
			el: $twContactWorkplaceName,
			require: false,
			type: 'string',
			dbKey: 'tw_contact_workplace_name'
		},
		{
			el: $twContactWorkplacePhone,
			require: false,
			type: 'string',
			dbKey: 'tw_contact_workplace_phone'
		},
		{
			el: $twContactWorkplaceAddress,
			require: false,
			type: 'string',
			dbKey: 'tw_contact_workplace_address'
		}]

		// 父親不為「不詳」時增加的驗證
		if (_currentDadStatus !== "undefined") {
			formValidateList.push(
				{el: $dadName, require: true, type: 'string', dbKey: 'dad_name'},
				{el: $dadEngName, require: true, type: 'string', dbKey: 'dad_eng_name'},
				{el: $dadBirthday, require: true, type: 'date', dbKey: 'dad_birthday'},
				{el: $dadHometown, require: false, type: 'string', dbKey: 'dad_hometown'},
				{el: $dadJob, require: true, type: 'string', dbKey: 'dad_job'}
				);
		}

		// 母親不為「不詳」時增加的驗證
		if (_currentMomStatus !== "undefined") {
			formValidateList.push(
				{el: $momName, require: true, type: 'string', dbKey: 'mom_name'},
				{el: $momEngName, require: true, type: 'string', dbKey: 'mom_eng_name'},
				{el: $momBirthday, require: true, type: 'date', dbKey: 'mom_birthday'},
				{el: $momHometown, require: false, type: 'string', dbKey: 'mom_hometown'},
				{el: $momJob, require: true, type: 'string', dbKey: 'mom_job'}
				);
		}

		// 父母皆為「不詳」時，增加「監護人」驗證
		if (_currentDadStatus === "undefined" && _currentMomStatus === "undefined") {
			formValidateList.push(
				{el: $guardianName, require: true, type: 'string', dbKey: 'guardian_name'},
				{el: $guardianEngName, require: true, type: 'string', dbKey: 'guardian_eng_name'},
				{el: $guardianBirthday, require: true, type: 'date', dbKey: 'guardian_birthday'},
				{el: $guardianHometown, require: false, type: 'string', dbKey: 'guardian_hometown'},
				{el: $guardianJob, require: true, type: 'string', dbKey: 'guardian_job'}
				);
		}

		// 有證件類型再送 ID
		if ($taiwanIdType.val() !== "") {
			formValidateList.push(
				{el: $taiwanIdNo, require: false, type: 'string', dbKey: 'taiwan_id'}
				);
		}

		// console.log(formValidateList);

		let _correct = true; // 格式正確
		let sendData = {}; // 送給後端的

		formValidateList.forEach((obj, index) => {
			if (obj.require) {
				if (_validateNotEmpty(obj)) {
					switch(obj.type) {
						case 'email':
						if (_validateEmail(obj)) {
							if (obj.dbKey) sendData[obj.dbKey] = _getDBData(obj);
							obj.el.removeClass('invalidInput');
						} else {
							_correct = false;
							obj.el.addClass('invalidInput');
						}
						break;
						case 'date':
						if (_validateDate(obj)) {
							if (obj.dbKey) sendData[obj.dbKey] = _getDBData(obj);
							obj.el.removeClass('invalidInput');
						} else {
							_correct = false;
							obj.el.addClass('invalidInput');
						}
						break;
						default:
						if (obj.dbKey) sendData[obj.dbKey] = _getDBData(obj);
						obj.el.removeClass('invalidInput');
					}
				} else {
					_correct = false;
					obj.el.addClass('invalidInput');
				}
			} else {
				if (_validateNotEmpty(obj)) {
					switch(obj.type) {
						case 'email':
						if (_validateEmail(obj)) {
							if (obj.dbKey) sendData[obj.dbKey] = _getDBData(obj);
							obj.el.removeClass('invalidInput');
						} else {
							_correct = false;
							obj.el.addClass('invalidInput');
						}
						break;
						case 'date':
						if (_validateDate(obj)) {
							if (obj.dbKey) sendData[obj.dbKey] = _getDBData(obj);
							obj.el.removeClass('invalidInput');
						} else {
							_correct = false;
							obj.el.addClass('invalidInput');
						}
						break;
						default:
						if (obj.dbKey) sendData[obj.dbKey] = _getDBData(obj);
						obj.el.removeClass('invalidInput');
					}
				} else {
					if (obj.dbKey) sendData[obj.dbKey] = _getDBData(obj);
					obj.el.removeClass('invalidInput');
				}
			}
		})

		if (_correct) {
			return sendData;
		} else {
			return false;
		}
	}

})();
