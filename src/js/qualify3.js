(() => {
	/**
	* private variable
	*/
	let _identity = 1;
	let _typeOfKangAo = 1;

	/**
	* cache dom
	*/
	const $signUpForm = $('#form-signUp');
	const $identityRadio = $signUpForm.find('.radio-identity');
	const $saveBtn = $signUpForm.find('.btn-save');

	// 在台僑生、在台港澳生
	const $taiwanUniversityRadio = $signUpForm.find('.radio-taiwanUniversity');
	const $applyPeerRadio = $signUpForm.find('.radio-applyPeer');
	const $applyPeerYearInput = $signUpForm.find('.input-applyPeerYear');
	const $applyPeerStatusPadio = $signUpForm.find('.radio-applyPeerStatus');
	// 海外僑生
	const $isDistribution = $signUpForm.find('.isDistribution');
	const $distributionMoreQuestion = $signUpForm.find('.distributionMoreQuestion');
	const $stayLimitRadio = $signUpForm.find('.radio-stayLimit');
	const $hasBeenTaiwanRadio = $signUpForm.find('.radio-hasBeenTaiwan');
	const $whyHasBeenTaiwanRadio = $signUpForm.find('.radio-whyHasBeenTaiwan');
	// 港澳生
	const $idCardRadio = $signUpForm.find('.radio-idCard');
	const $holdpassportRadio = $signUpForm.find('.radio-holdpassport');
	const $taiwanHousehold = $signUpForm.find('.radio-taiwanHousehold');
	const $portugalPassportRadio = $signUpForm.find('.radio-portugalPassport');
	const $portugalPassportTime = $signUpForm.find('.input-portugalPassportTime');
	const $KA_isDistributionRadio = $signUpForm.find('.question.kangAo .kangAo_radio-isDistribution');
	const $KA_distributionMoreQuestion = $signUpForm.find('.question.kangAo .kangAo_distributionMoreQuestion');
	const $KA_stayLimitRadio = $signUpForm.find('.question.kangAo .kangAo_radio-stayLimit');
	const $KA_hasBeenTaiwanRadio = $signUpForm.find('.question.kangAo .kangAo_radio-hasBeenTaiwan');
	const $KA1_whyHasBeenTaiwan = $signUpForm.find('.question.kangAo .kangAoType1_radio-whyHasBeenTaiwan');
	const $KA2_whyHasBeenTaiwan = $signUpForm.find('.question.kangAo .kangAoType2_radio-whyHasBeenTaiwan');

	/**
	* bind event
	*/
	$identityRadio.on('change', _handleChangeIdentity);
	$saveBtn.on('click', _handleSave);
	$taiwanUniversityRadio.on('change', _checkTaiwanUniversity);
	$applyPeerRadio.on('change', _checkApplyPeer);
	$applyPeerYearInput.on('blur', _checkApplyPeerYear);
	$applyPeerStatusPadio.on('change', _checkApplyPeerStatus);
	$isDistribution.on('change', _switchShowDistribution);
	$distributionMoreQuestion.on('change', _checkDistributionValidation);
	$stayLimitRadio.on('change', _checkStayLimitValidation);
	$hasBeenTaiwanRadio.on('change', _checkHasBeenTaiwanValidation);
	$whyHasBeenTaiwanRadio.on('change', _checkWhyHasBeenTaiwanValidation);
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
	* event handler
	*/
	function _handleChangeIdentity() {
		const identity = _identity = +$(this).val();
		$signUpForm.find('.question').hide();
		switch (identity) {
			case 1:
			case 2:
				_setTypeOfKangAo(1);
				$signUpForm.find('.question.kangAo').fadeIn()[0].reset();
				$signUpForm.find('.question.kangAo .hide').hide();
				break;
			case 3:
				$signUpForm.find('.question.overseas').fadeIn()[0].reset();
				$signUpForm.find('.question.overseas input[type=radio]:checked').trigger('change');
				break;
			case 4:
			case 5:
				$signUpForm.find('.question.inTaiwan').fadeIn()[0].reset();
				$signUpForm.find('.question.inTaiwan input[type=radio]:checked').trigger('change');
				break;
		}
	}

	// 儲存
	function _handleSave() {
		if (_identity < 3) {
			// 港澳生
			const idCard = +$signUpForm.find('.radio-idCard:checked').val();
			const holdpassport = +$signUpForm.find('.radio-holdpassport:checked').val();
			const taiwanHousehold = +$signUpForm.find('.radio-taiwanHousehold:checked').val();
			const portugalPassport = +$signUpForm.find('.radio-portugalPassport:checked').val();
			const portugalPassportTime = $signUpForm.find('.input-portugalPassportTime').val();
			console.error('洲別、過別還沒弄');
			const isDistribution = +$signUpForm.find('.kangAo_radio-isDistribution:checked').val();
			const distributionTime = $signUpForm.find('.kangAo_input-distributionTime').val();
			const distributionOption = +$signUpForm.find('.kangAo_distributionMoreQuestion:checked').val();
			const stayLimitOption = +$signUpForm.find('.kangAo_radio-stayLimit:checked').val();
			const hasBeenTaiwan = +$signUpForm.find('.kangAo_radio-hasBeenTaiwan:checked').val();
			const KA1_whyHasBeenTaiwan = +$signUpForm.find('.kangAoType1_radio-whyHasBeenTaiwan:checked').val();
			const KA2_whyHasBeenTaiwan = +$signUpForm.find('.kangAoType2_radio-whyHasBeenTaiwan:checked').val();
			let valid = true;	
			if (!idCard ||
				!!isDistribution && distributionTime === '' ||
				!!isDistribution && distributionOption > 2 ||
				stayLimitOption === 1 ||
				_typeOfKangAo === null ||
				!!hasBeenTaiwan && _typeOfKangAo === 1 && KA1_whyHasBeenTaiwan === 11 ||
				!!hasBeenTaiwan && _typeOfKangAo === 2 && KA2_whyHasBeenTaiwan === 8
				) {
				valid = false;
			}

			if (!valid) {
				alert('資料未正確填寫，或身份不具報名資格')
			} else {
				console.log('API 還沒接 RRR');
			}
		} else if (_identity === 3) {
			// 海外僑生
		} else {
			// 在台港澳生、僑生
		}
	}

	// 請問您是否曾經由本聯招會或各校單招管道分發在臺就讀大學並註冊入學過？
	function _checkTaiwanUniversity() {
		const has = +$(this).val();
		if (!has) {
			const theReallyIdentity = _identity === 4 ? 1 : 3;
			const identityName = { 1: '港澳生', 3: '海外僑生' };
			alert(`身份別應為 ${identityName[theReallyIdentity]}`);
			$signUpForm.find(`.radio-identity[value="${theReallyIdentity}"]`).prop('checked', true).trigger('change');
		}
	}

	// 請問您是否曾經向本會申請同級學程（【帶入報名學生選定之申請類別】），並經由本會分發？
	function _checkApplyPeer() {
		const has = +$(this).val();
		!!has && $signUpForm.find('.applyPeerMore').fadeIn();
		!!has || $signUpForm.find('.applyPeerMore').fadeOut();
	}

	// 哪一年曾經向本會申請同級學程
	function _checkApplyPeerYear() {
		const $this = $(this);
		!!$this[0].checkValidity() && $this.removeClass('invalidInput');
		!!$this[0].checkValidity() || $this.addClass('invalidInput');
	}

	// 曾經向本會申請同級學程，擇一
	function _checkApplyPeerStatus() {
		const option = +$(this).val();
		$signUpForm.find('.applyPeerStatusAlert').hide();
		if (option === 1) {
			$signUpForm.find('.applyPeerStatusAlert.valid').fadeIn();
		} else {
			$signUpForm.find('.applyPeerStatusAlert.invalid').fadeIn();
		}
	}

	// 海外僑生 曾分發與否
	function _switchShowDistribution() {
		const $this = $(this);
		const isDistribution =  +$this.val();
		!!isDistribution && $signUpForm.find('#distributionMore').fadeIn();
		!!isDistribution || $signUpForm.find('#distributionMore').fadeOut();
	}

	// 海外僑生 曾分發與否 7選1
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

	// 海外僑生 海外居留年限
	function _checkStayLimitValidation() {
		const $this = $(this);
		const option = +$this.val();
		$signUpForm.find('.stayLimitAlert').hide();
		switch (option) {
			case 1:
				$signUpForm.find('.stayLimitAlert.invalid').fadeIn();
				break;
			case 2:
				$signUpForm.find('.stayLimitAlert.valid').fadeIn();
				break;
		}
	}

	// 海外僑生 來台超過120天
	function _checkHasBeenTaiwanValidation() {
		const $this = $(this);
		const option = +$this.val();
		!!option && $signUpForm.find('.question.overseas .hasBeenTaiwanQuestion').fadeIn();
		!!option || $signUpForm.find('.question.overseas .hasBeenTaiwanQuestion').fadeOut();
	}

	// 海外僑生 為何來台超過120天
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
				$signUpForm.find('.kangAo_stayLimitAlert.valid').fadeIn();
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
