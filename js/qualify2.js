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
	const $portugalPassportRadio = $signUpForm.find('.radio-portugalPassport');
	const $portugalPassportTime = $signUpForm.find('.input-portugalPassportTime');
	const $KA_isDistributionRadio = $signUpForm.find('.kangAo_radio-isDistribution');
	const $KA_distributionMoreQuestion = $signUpForm.find('.kangAo_distributionMoreQuestion');
	const $KA_stayLimitRadio = $signUpForm.find('.kangAo_radio-stayLimit');
	const $KA_hasBeenTaiwanRadio = $signUpForm.find('.kangAo_radio-hasBeenTaiwan');
	const $KA1_whyHasBeenTaiwan = $signUpForm.find('.kangAoType1_radio-whyHasBeenTaiwan');
	const $KA2_whyHasBeenTaiwan = $signUpForm.find('.kangAoType2_radio-whyHasBeenTaiwan');

	/**
	*	bind event
	*/
	$graduatedRadio.on('change', _checkGraduated);
	$idCardRadio.on('change', _cehckIdCardValidation);
	$holdpassportRadio.on('change', _checkHoldpassport);
	$taiwanHousehold.on('change', _checkTaiwanHousehold);
	$portugalPassportRadio.on('change', _checkPortugalPassport);
	$portugalPassportTime.on('change', _checkPortugalPassportTime);
	$KA_isDistributionRadio.on('change', _handleKAIsDistribution);
	$KA_distributionMoreQuestion.on('change', _checkKADistributionValidation);
	$KA_stayLimitRadio.on('change', _checkKAStayLimitValidation);
	$KA_hasBeenTaiwanRadio.on('change', _checkKAHasBeenTaiwanValidation);
	$KA1_whyHasBeenTaiwan.on('change', _checkKA1WhyHasBeenTaiwanValidation);
	$KA2_whyHasBeenTaiwan.on('change', _checkKA2WhyHasBeenTaiwanValidation);

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
		$portugalPassportTime.val('').trigger('change');
		$signUpForm.find('.radio-portugalPassport:checked').trigger('change');
		_setTypeOfKangAo(null);
	}

	// 是否持有葡萄牙護照
	function _checkPortugalPassport() {
		const $this = $(this);
		const portugalPassport = +$this.val();
		$signUpForm.find('.whichPassportAlert.valid1').fadeOut();
		$signUpForm.find('.whichPassportAlert.valid2').fadeOut();
		if (portugalPassport) {
			_currentIdentity = 1;
			_setTypeOfKangAo(null);
			$signUpForm.find('.whichPassport').fadeOut();
			$signUpForm.find('.portugalPassportMore').fadeIn();
			$portugalPassportTime.val('').trigger('change');
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
		if (portugalPassportTime === '') {
			return;
		}
		
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

	// 港澳生 是否分發來台
	function _handleKAIsDistribution() {
		const $this = $(this);
		const isDistribution = +$this.val();
		!!isDistribution && $signUpForm.find('.kangAo_distributionMore').fadeIn();
		!!isDistribution || $signUpForm.find('.kangAo_distributionMore').fadeOut();
	}

	// 港澳生 曾分發來台的一堆問題
	function _checkKADistributionValidation() {
		const $this = $(this);
		const option = +$this.val();
		const valid = [1, 2];
		$signUpForm.find('.kangAo_distributionMoreAlert.valid').fadeOut();
		$signUpForm.find('.kangAo_distributionMoreAlert.invalid').fadeOut();
		if (valid.includes(option)) {
			$signUpForm.find('.kangAo_distributionMoreAlert.valid').fadeIn();
		} else {
			$signUpForm.find('.kangAo_distributionMoreAlert.invalid').fadeIn();
		}
	}

	// 港澳生 海外居留年限
	function _checkKAStayLimitValidation() {
		const $this = $(this);
		const option = +$this.val();
		$signUpForm.find('.kangAo_stayLimitAlert').hide();
		switch (option) {
			case 1:
				$signUpForm.find('.kangAo_stayLimitAlert.invalid').fadeIn();
				break;
			case 2:
			case 4:
				$signUpForm.find('.kangAo_stayLimitAlert.valid').fadeIn();
				break;
			default:
				break;
		}
	}

	// 港澳生 在台停留日期
	function _checkKAHasBeenTaiwanValidation() {
		const $this = $(this);
		const has = +$this.val();
		$signUpForm.find('.kangAoType1_hasBeenTaiwanQuestion').fadeOut();
		$signUpForm.find('.kangAoType2_hasBeenTaiwanQuestion').fadeOut();
		if (has) {
			switch (_typeOfKangAo) {
				case 1:
					$signUpForm.find('.kangAoType1_hasBeenTaiwanQuestion').fadeIn();
					break;
				case 2:
					$signUpForm.find('.kangAoType2_hasBeenTaiwanQuestion').fadeIn();
					break;
				default:
					alert('請確保上述問題已正確填答');
					$KA_hasBeenTaiwanRadio.last().prop('checked', true).trigger('change');
					break;
			}
		}
	}


	// 港澳生 甲 為何在台停留一堆問題
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

	// 港澳生 乙 為何在台停留一堆問題
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
		console.log(`Kang Ao type changed: ${type}`);
		$KA_hasBeenTaiwanRadio.last().prop('checked', true).trigger('change');
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
