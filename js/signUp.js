var signUp = (function () {
	/**
	 * private variable
	 */
	let _currentIdentity = 1;

	/**
	 * cache DOM
	 */
	const $signUpForm = $('#form-signUp');
	const $email = $signUpForm.find('#email');
	const $password = $signUpForm.find('#password');
	const $passwordConfirm = $signUpForm.find('#passwordConfirm');
	const $identityRadio = $signUpForm.find('.radio-identity');
	var $checkId = $signUpForm.find('.checkId');
	var $checkIdAlert = $signUpForm.find('#checkIdAlert');
	var $holdpassport = $signUpForm.find('.holdpassport');
	var $holdpassportPForm = $signUpForm.find('#holdpassportPForm');
	var $holdpassportP = $signUpForm.find('.holdpassportP');
	var $getPForm = $signUpForm.find('#getPForm');
	var $holdOtherPassportForm = $signUpForm.find('#holdOtherPassportForm');
	var $isDistribution = $signUpForm.find('.isDistribution');
	var $showDistribution = $signUpForm.find('#showDistribution');
	var $hasBeenTaiwan = $signUpForm.find('.hasBeenTaiwan');
	var $showHasBeenTaiwan = $signUpForm.find('#showHasBeenTaiwan');

	/**
	 * init
	 */
	$signUpForm.find('.question.kangAo').removeClass('hide');

	/**
	 * bind event
	 */
	$passwordConfirm.on('blur', _handleValidatePassword);
	$identityRadio.on('change', _handleChangeIdentity);
	$checkId.on('click', _switchCheckIdAlert);
	$holdpassport.on('click', _switchHoldpassportPForm);
	$holdpassportP.on('click', _switchPassportForm);
	$isDistribution.on('change', _switchShowDistribution);
	$hasBeenTaiwan.on('click', _switchShowHasBeenTaiwan);

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
		$signUpForm.find('.question').addClass('hide');
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

	function _switchCheckIdAlert() {
		var status = $(this).data('checkid');
		if (!status) {
			$checkIdAlert.fadeIn();
		} else {
			$checkIdAlert.fadeOut();
		}
	}

	function _switchHoldpassportPForm() { // 是否持有英國國民(海外)護照或香港護照以外之旅行證照，或持有澳門護照以外之旅行證照？(含葡萄牙護照)
		var status = $(this).data('holdpassport');
		if (status) {
			$holdpassportPForm.fadeIn();
			_switchPassportForm();
		} else {
			$holdpassportPForm.fadeOut();
			$getPForm.fadeOut();
			$holdOtherPassportForm.fadeOut();
		}
	}

	function _switchPassportForm() { // 您是否持有葡萄牙護照？
		var status = $(this).data('holdpassportp');
		if (status) {
			$getPForm.fadeIn();
			$holdOtherPassportForm.fadeOut();
		} else {
			$holdOtherPassportForm.fadeIn();
			$getPForm.fadeOut();
		}
	}

	function _switchShowDistribution() {
		const isDistribution =  $(this).val();
		+isDistribution && $signUpForm.find('#distributionMore').fadeIn();
		+isDistribution || $signUpForm.find('#distributionMore').fadeOut();
	}

	function _switchShowHasBeenTaiwan() {
		var status = $(this).data('hasbeentaiwan');
		if (status) {
			$showHasBeenTaiwan.fadeIn();
		} else {
			$showHasBeenTaiwan.fadeOut();
		}
	}

})();
