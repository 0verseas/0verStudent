(() => {
	/**
	*	private variable
	*/
	let _typeOfKangAo = 1;

	/**
	*	cache dom
	*/
	const $signUpForm = $('#form-signUp');
	const $graduatedRadio = $signUpForm.find('.radio-graduated');
	const $idCardRadio = $signUpForm.find('.radio-idCard');
	const $holdpassportRadio = $signUpForm.find('.radio-holdpassport');
	const $taiwanHousehold = $signUpForm.find('.radio-taiwanHousehold');

	/**
	*	bind event
	*/
	$graduatedRadio.on('change', _checkGraduated);
	$idCardRadio.on('change', _cehckIdCardValidation);
	$holdpassportRadio.on('change', _checkHoldpassport);
	$taiwanHousehold.on('change', _checkTaiwanHousehold);

	/**
	*	event handler
	*/
	// 請問您在香港是否修習全日制副學士學位（Associate Degree）或高級文憑（Higher Diploma）課程，並已取得畢業證書（應屆畢業者得檢附在學證明）？
	function _checkGraduated() {
		const $this = $(this);
		const graduated = +$this.val();
		!!graduated && $signUpForm.find('.graduatedAlert.invalid').fadeIn();
		!!graduated || $signUpForm.find('.graduatedAlert.invalid').fadeOut();
	}

	// 是否擁有香港或澳門永久性居民身分證
	function _cehckIdCardValidation() {
		const $this = $(this);
		const idCard = +$this.val();
		!!idCard && $signUpForm.find('.idCardAlert.invalid').fadeOut();
		!!idCard || $signUpForm.find('.idCardAlert.invalid').fadeIn();
	}

	// 是否另持有「香港護照或英國國民（海外）護照」以外之旅行證照，或持有澳門護照以外之旅行證照
	function _checkHoldpassport() {
		const $this = $(this);
		const holdpassport = +$this.val();
		!!holdpassport && $signUpForm.find('.isTaiwanHousehold, .holdpassportThanShow').fadeIn() && _setTypeOfKangAo(null);
		!!holdpassport || $signUpForm.find('.isTaiwanHousehold, .holdpassportThanShow').fadeOut() && _setTypeOfKangAo(1);
	}

	// 是否曾在臺設有戶籍
	function _checkTaiwanHousehold() {
		// $portugalPassportTime.val('').trigger('change');
		_setTypeOfKangAo(null);
	}

	/**
	*	private method
	*/
	function _setTypeOfKangAo(type) {
		console.log(`Kang Ao type changed: ${type}`);
		// $KA_hasBeenTaiwanRadio.last().prop('checked', true).trigger('change');
		switch (type) {
			case 1:
				_typeOfKangAo = 1;
				break;
			case 2:
				_typeOfKangAo = 2;
				break;
			default:
				_typeOfKangAo = null;
				break;
		}
	}
})();
