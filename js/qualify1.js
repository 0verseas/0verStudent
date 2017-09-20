(() => {
	/**
	*	private variable
	*/
	let _currentIdentity = 1;
	let _typeOfKangAo = null;

	/**
	*	cache DOM
	*/
	const $signUpForm = $('#form-signUp');
	const $email = $signUpForm.find('#email');
	const $password = $signUpForm.find('#password');
	const $passwordConfirm = $signUpForm.find('#passwordConfirm');
	const $identityRadio = $signUpForm.find('.radio-identity');
	const $isDistribution = $signUpForm.find('.isDistribution');
	const $distributionMoreQuestion = $signUpForm.find('.distributionMoreQuestion');
	const $stayLimitRadio = $signUpForm.find('.radio-stayLimit');
	const $hasBeenTaiwanRadio = $signUpForm.find('.radio-hasBeenTaiwan');
	const $whyHasBeenTaiwanRadio = $signUpForm.find('.radio-whyHasBeenTaiwan');
	const $idCardRadio = $signUpForm.find('.radio-idCard');
	const $holdpassportRadio = $signUpForm.find('.radio-holdpassport');
	const $portugalPassportRadio = $signUpForm.find('.radio-portugalPassport');
	const $portugalPassportTime = $signUpForm.find('.input-portugalPassportTime');

	/**
	*	init
	*/
	$signUpForm.find('.question.kangAo').removeClass('hide');

	/**
	*	bind event
	*/
	$passwordConfirm.on('blur', _handleValidatePassword);
	$identityRadio.on('change', _handleChangeIdentity);
	$isDistribution.on('change', _switchShowDistribution);
	$distributionMoreQuestion.on('change', _checkDistributionValidation);
	$stayLimitRadio.on('change', _checkStayLimitValidation)
	$hasBeenTaiwanRadio.on('change', _checkHasBeenTaiwanValidation);
	$whyHasBeenTaiwanRadio.on('change', _checkWhyHasBeenTaiwanValidation);
	$idCardRadio.on('change', _cehckIdCardValidation);
	$holdpassportRadio.on('change', _checkHoldpassport);
	$portugalPassportRadio.on('change', _checkPortugalPassport);
	$portugalPassportTime.on('change', _checkPortugalPassportTime);

	// 確認兩次密碼輸入相同
	function _handleValidatePassword() {
		const $this = $(this);
		const oriPass = $password.val();
		const currentPass = $this.val();
		if (oriPass !== currentPass) {
			$this.addClass('invalidInput');
		} else {
			$this.removeClass('invalidInput');
		}
	}

	// 選擇身份別
	// 1: 港澳 2: 海外 3: 港澳具外國
	function _handleChangeIdentity () {
		_currentIdentity = $(this).val();
		$signUpForm.find('.question').hide();
		switch(_currentIdentity) {
			case '1':
				$signUpForm.find('.question.kangAo').fadeIn();
				break;
			case '2':
				$signUpForm.find('.question.overseas').fadeIn();
				break;
			case '3':
				$signUpForm.find('.question.kangAoSpecial').fadeIn();
				break;
		}
	}

	// 判斷是否分發來台就學的一推選項是否符合資格
	function _checkDistributionValidation() {
		const $this = $(this);
		const option = +$this.val();
		const validOption = [1, 2, 7];
		$signUpForm.find('.distributionMoreAlert').hide();
		if (validOption.includes(option)) {
			$signUpForm.find('.distributionMoreAlert.valid').fadeIn();
		} else {
			$signUpForm.find('.distributionMoreAlert.invalid').fadeIn();
		}
	}

	// 海外居留年限判斷
	function _checkStayLimitValidation() {
		const $this = $(this);
		const option = +$this.val();
		$signUpForm.find('.stayLimitAlert').hide();
		switch (option) {
			case 1:
				$signUpForm.find('.stayLimitAlert.invalid').fadeIn();
				break;
			case 2:
			case 4:
				$signUpForm.find('.stayLimitAlert.valid').fadeIn();
				break;
			default:
				break;
		}
	}

	// 為何在台超過一百二十天
	function _checkWhyHasBeenTaiwanValidation() {
		const $this = $(this);
		const option = +$this.val();
		$('.whyHasBeenTaiwanAlert').hide();
		if (option === 8) {
			$('.whyHasBeenTaiwanAlert.invalid').fadeIn();
		} else {
			$('.whyHasBeenTaiwanAlert.valid').fadeIn();
		}
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
		!!holdpassport && $signUpForm.find('.isTaiwanHousehold').fadeIn() && (_typeOfKangAo = null);
		!!holdpassport || $signUpForm.find('.isTaiwanHousehold').fadeOut() && (_typeOfKangAo = 1);
	}

	// 是否持有葡萄牙護照
	function _checkPortugalPassport() {
		const $this = $(this);
		const portugalPassport = +$this.val();
		$signUpForm.find('.whichPassportAlert.valid1').fadeOut();
		$signUpForm.find('.whichPassportAlert.valid2').fadeOut();
		if (portugalPassport) {
			_currentIdentity = 1;
			_typeOfKangAo = 1;
			$signUpForm.find('.whichPassport').fadeOut();
			$signUpForm.find('.portugalPassportMore').fadeIn();
		} else {
			$signUpForm.find('.whichPassport').fadeIn();
			$signUpForm.find('.portugalPassportMore').fadeOut();
			const isTaiwanHousehold = !!+$('.radio-holdpassport:checked').val() && +$('.radio-taiwanHousehold:checked').val();
			// 在臺曾設有戶籍者身分確認為港澳生【甲】
			if (isTaiwanHousehold) {
				_currentIdentity = 1;
				_typeOfKangAo = 1;
				$signUpForm.find('.whichPassportAlert.valid1').fadeIn();
			} else {
				_currentIdentity = 3;
				_typeOfKangAo = 2;
				$signUpForm.find('.whichPassportAlert.valid2').fadeIn();
			}
		}
	}

	// 於何時首次取得葡萄牙護照
	function _checkPortugalPassportTime() {
		const $this = $(this);
		const portugalPassportTime = $this.val();
		$signUpForm.find('.portugalPassportTimeAlert.valid1').fadeOut();
		$signUpForm.find('.portugalPassportTimeAlert.valid2').fadeOut();
		$signUpForm.find('.portugalPassportTimeAlert.valid3').fadeOut();
		if (moment(portugalPassportTime).isBefore('1999-12-20')) {
			// 身分確認為港澳生【甲】
			_currentIdentity = 1;
			_typeOfKangAo = 1;
			$signUpForm.find('.portugalPassportTimeAlert.valid1').fadeIn();
		} else {
			const isTaiwanHousehold = !!+$('.radio-holdpassport:checked').val() && +$('.radio-taiwanHousehold:checked').val();
			// 在臺曾設有戶籍者身分確認為港澳生【甲】
			if (isTaiwanHousehold) {
				_currentIdentity = 1;
				_typeOfKangAo = 1;
				$signUpForm.find('.portugalPassportTimeAlert.valid2').fadeIn();
			} else {
				// 身分確認為「港澳具外國國籍之華裔學生」【乙】
				_currentIdentity = 3;
				_typeOfKangAo = 2;
				$signUpForm.find('.portugalPassportTimeAlert.valid3').fadeIn();
			}
		}
	}

	function _switchShowDistribution() {
		const $this = $(this);
		const isDistribution =  +$this.val();
		!!isDistribution && $signUpForm.find('#distributionMore').fadeIn();
		!!isDistribution || $signUpForm.find('#distributionMore').fadeOut();
	}

	function _checkHasBeenTaiwanValidation() {
		const $this = $(this);
		const option = +$this.val();
		!!option && $signUpForm.find('.question.overseas .hasBeenTaiwanQuestion').fadeIn();
		!!option || $signUpForm.find('.question.overseas .hasBeenTaiwanQuestion').fadeOut();
	}
})();
