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
	const $identityRadio = $signUpForm.find('.radio-identity');

	// 海外僑生
	const $isDistribution = $signUpForm.find('.isDistribution');
	const $distributionMoreQuestion = $signUpForm.find('.distributionMoreQuestion');
	const $stayLimitRadio = $signUpForm.find('.radio-stayLimit');
	const $hasBeenTaiwanRadio = $signUpForm.find('.radio-hasBeenTaiwan');
	const $whyHasBeenTaiwanRadio = $signUpForm.find('.radio-whyHasBeenTaiwan');

	// 港澳生
	const $idCardRadio = $signUpForm.find('.radio-idCard');
	const $holdpassportRadio = $signUpForm.find('.radio-holdpassport');
	const $portugalPassportRadio = $signUpForm.find('.radio-portugalPassport');
	const $portugalPassportTime = $signUpForm.find('.input-portugalPassportTime');

	// 港澳生-甲
	const $KA1_isDistributionRadio = $signUpForm.find('.question.kangAo .kangAoType.type1 .kangAoType1_radio-isDistribution');
	const $KA1_distributionMoreQuestion = $signUpForm.find('.question.kangAo .kangAoType.type1 .kangAoType1_distributionMoreQuestion');
	const $KA1_stayLimitRadio = $signUpForm.find('.question.kangAo .kangAoType.type1 .kangAoType1_radio-stayLimit');
	const $KA1_hasBeenTaiwanRadio = $signUpForm.find('.question.kangAo .kangAoType.type1 .kangAoType1_radio-hasBeenTaiwan');
	const $KA1_whyHasBeenTaiwan = $signUpForm.find('.question.kangAo .kangAoType.type1 .kangAoType1_radio-whyHasBeenTaiwan');

	// 港澳生-乙
	const $KA2_isDistributionRadio = $signUpForm.find('.question.kangAo .kangAoType.type2 .kangAoType2_radio-isDistribution');
	const $KA2_distributionMoreQuestion = $signUpForm.find('.question.kangAo .kangAoType.type2 .kangAoType2_distributionMoreQuestion');
	const $KA2_stayLimitRadio = $signUpForm.find('.question.kangAo .kangAoType.type2 .kangAoType2_radio-stayLimit');
	const $KA2_hasBeenTaiwanRadio = $signUpForm.find('.question.kangAo .kangAoType.type2 .kangAoType2_radio-hasBeenTaiwan');
	const $KA2_whyHasBeenTaiwan = $signUpForm.find('.question.kangAo .kangAoType.type2 .kangAoType2_radio-whyHasBeenTaiwan');

	/**
	*	init
	*/
	$signUpForm.find('.question.kangAo').removeClass('hide');

	/**
	*	bind event
	*/
	$identityRadio.on('change', _handleChangeIdentity);

	// 海外僑生
	$isDistribution.on('change', _switchShowDistribution);
	$distributionMoreQuestion.on('change', _checkDistributionValidation);
	$stayLimitRadio.on('change', _checkStayLimitValidation)
	$hasBeenTaiwanRadio.on('change', _checkHasBeenTaiwanValidation);
	$whyHasBeenTaiwanRadio.on('change', _checkWhyHasBeenTaiwanValidation);

	// 港澳生
	$idCardRadio.on('change', _cehckIdCardValidation);
	$holdpassportRadio.on('change', _checkHoldpassport);
	$portugalPassportRadio.on('change', _checkPortugalPassport);
	$portugalPassportTime.on('change', _checkPortugalPassportTime);

	// 港澳生-甲
	$KA1_isDistributionRadio.on('change', _handleKA1IsDistribution);
	$KA1_distributionMoreQuestion.on('change', _checkKA1DistributionValidation);
	$KA1_stayLimitRadio.on('change', _checkKA1StayLimitValidation);
	$KA1_hasBeenTaiwanRadio.on('change', _checkKA1HasBeenTaiwanValidation);
	$KA1_whyHasBeenTaiwan.on('change', _checkKA1WhyHasBeenTaiwanValidation);

	// 港澳生-乙
	$KA2_isDistributionRadio.on('change', _handleKA2IsDistribution);
	$KA2_distributionMoreQuestion.on('change', _checkKA2DistributionValidation);
	$KA2_stayLimitRadio.on('change', _checkKA2StayLimitValidation);
	$KA2_hasBeenTaiwanRadio.on('change', _checkKA2HasBeenTaiwanValidation);
	$KA2_whyHasBeenTaiwan.on('change', _checkKA2WhyHasBeenTaiwanValidation);

	/**
	*	event handler
	*/
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
			case '3':
				$signUpForm.find('.question.overseas').fadeIn();
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
		!!holdpassport && $signUpForm.find('.isTaiwanHousehold').fadeIn() && _setTypeOfKangAo(null);
		!!holdpassport || $signUpForm.find('.isTaiwanHousehold').fadeOut() && _setTypeOfKangAo(1);
	}

	// 是否持有葡萄牙護照
	function _checkPortugalPassport() {
		const $this = $(this);
		const portugalPassport = +$this.val();
		$signUpForm.find('.whichPassportAlert.valid1').fadeOut();
		$signUpForm.find('.whichPassportAlert.valid2').fadeOut();
		if (portugalPassport) {
			_currentIdentity = 1;
			_setTypeOfKangAo(1);
			$signUpForm.find('.whichPassport').fadeOut();
			$signUpForm.find('.portugalPassportMore').fadeIn();
		} else {
			$signUpForm.find('.whichPassport').fadeIn();
			$signUpForm.find('.portugalPassportMore').fadeOut();
			const isTaiwanHousehold = !!+$('.radio-holdpassport:checked').val() && +$('.radio-taiwanHousehold:checked').val();
			// 在臺曾設有戶籍者身分確認為港澳生【甲】
			if (isTaiwanHousehold) {
				_currentIdentity = 1;
				_setTypeOfKangAo(1);
				$signUpForm.find('.whichPassportAlert.valid1').fadeIn();
			} else {
				_currentIdentity = 3;
				_setTypeOfKangAo(2);
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
			_setTypeOfKangAo(1);
			$signUpForm.find('.portugalPassportTimeAlert.valid1').fadeIn();
		} else {
			const isTaiwanHousehold = !!+$('.radio-holdpassport:checked').val() && +$('.radio-taiwanHousehold:checked').val();
			// 在臺曾設有戶籍者身分確認為港澳生【甲】
			if (isTaiwanHousehold) {
				_currentIdentity = 1;
				_setTypeOfKangAo(1);
				$signUpForm.find('.portugalPassportTimeAlert.valid2').fadeIn();
			} else {
				// 身分確認為「港澳具外國國籍之華裔學生」【乙】
				_currentIdentity = 3;
				_setTypeOfKangAo(2);
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

	// 港澳生-甲 是否分發來台
	function _handleKA1IsDistribution() {
		const $this = $(this);
		const isDistribution = +$this.val();
		!!isDistribution && $signUpForm.find('.kangAoType1_distributionMore').fadeIn();
		!!isDistribution || $signUpForm.find('.kangAoType1_distributionMore').fadeOut();
	}

	// 港澳生-甲 曾分發來台的一堆問題
	function _checkKA1DistributionValidation() {
		const $this = $(this);
		const option = +$this.val();
		const valid = [1, 2];
		if (valid.includes(option)) {
			$signUpForm.find('.kangAoType1_distributionMoreAlert.valid').fadeIn();
		} else {
			$signUpForm.find('.kangAoType1_distributionMoreAlert.valid').fadeOut();
		}
	}

	// 港澳生-甲 海外居留年限
	function _checkKA1StayLimitValidation() {
		const $this = $(this);
		const option = +$this.val();
		$signUpForm.find('.kangAoType1_stayLimitAlert').hide();
		switch (option) {
			case 1:
				$signUpForm.find('.kangAoType1_stayLimitAlert.invalid').fadeIn();
				break;
			case 2:
			case 4:
				$signUpForm.find('.kangAoType1_stayLimitAlert.valid').fadeIn();
				break;
			default:
				break;
		}
	}

	// 港澳生-甲 在台停留日期
	function _checkKA1HasBeenTaiwanValidation() {
		const $this = $(this);
		const has = +$this.val();
		!!has && $signUpForm.find('.kangAoType1_hasBeenTaiwanQuestion').fadeIn();
		!!has || $signUpForm.find('.kangAoType1_hasBeenTaiwanQuestion').fadeOut();
	}


	// 港澳生-甲 為何在台停留一堆問題
	function _checkKA1WhyHasBeenTaiwanValidation() {
		const $this = $(this);
		const option = +$this.val();
		$signUpForm.find('.kangAoType1_whyHasBeenTaiwanAlert.invalid').hide();
		$signUpForm.find('.kangAoType1_whyHasBeenTaiwanAlert.valid').hide();
		if (option === 11) {
			$signUpForm.find('.kangAoType1_whyHasBeenTaiwanAlert.invalid').fadeIn();
		} else {
			$signUpForm.find('.kangAoType1_whyHasBeenTaiwanAlert.valid').fadeIn();
		}
	}

	// 港澳生-乙 是否分發來台
	function _handleKA2IsDistribution() {
		const $this = $(this);
		const isDistribution = +$this.val();
		!!isDistribution && $signUpForm.find('.kangAoType2_distributionMore').fadeIn();
		!!isDistribution || $signUpForm.find('.kangAoType2_distributionMore').fadeOut();
	}

	// 港澳生-乙 曾分發來台的一堆問題
	function _checkKA2DistributionValidation() {
		const $this = $(this);
		const option = +$this.val();
		const valid = [1, 2];
		if (valid.includes(option)) {
			$signUpForm.find('.kangAoType2_distributionMoreAlert.valid').fadeIn();
		} else {
			$signUpForm.find('.kangAoType2_distributionMoreAlert.valid').fadeOut();
		}
	}

	// 港澳生-乙 海外居留年限
	function _checkKA2StayLimitValidation() {
		const $this = $(this);
		const option = +$this.val();
		$signUpForm.find('.kangAoType2_stayLimitAlert').hide();
		switch (option) {
			case 1:
				$signUpForm.find('.kangAoType2_stayLimitAlert.invalid').fadeIn();
				break;
			case 2:
			case 4:
				$signUpForm.find('.kangAoType2_stayLimitAlert.valid').fadeIn();
				break;
			default:
				break;
		}
	}

	// 港澳生-乙 在台停留日期
	function _checkKA2HasBeenTaiwanValidation() {
		const $this = $(this);
		const has = +$this.val();
		!!has && $signUpForm.find('.kangAoType2_hasBeenTaiwanQuestion').fadeIn();
		!!has || $signUpForm.find('.kangAoType2_hasBeenTaiwanQuestion').fadeOut();
	}


	// 港澳生-乙 為何在台停留一堆問題
	function _checkKA2WhyHasBeenTaiwanValidation() {
		const $this = $(this);
		const option = +$this.val();
		$signUpForm.find('.kangAoType2_whyHasBeenTaiwanAlert.invalid').hide();
		$signUpForm.find('.kangAoType2_whyHasBeenTaiwanAlert.valid').hide();
		if (option === 8) {
			$signUpForm.find('.kangAoType2_whyHasBeenTaiwanAlert.invalid').fadeIn();
		} else {
			$signUpForm.find('.kangAoType2_whyHasBeenTaiwanAlert.valid').fadeIn();
		}
	}

	/**
	*	private method
	*/
	function _setTypeOfKangAo(type) {
		$signUpForm.find('.question.kangAo .kangAoType').fadeOut();
		switch (type) {
			case 1:
				_typeOfKangAo = 1;
				$signUpForm.find('.question.kangAo .kangAoType.type1').fadeIn();
				break;
			case 2:
				_typeOfKangAo = 2;
				$signUpForm.find('.question.kangAo .kangAoType.type2').fadeIn();
				break;
		}
	}
})();
