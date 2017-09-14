var signUp = (function () {

	/**
	 * cache DOM
	 */

	 const $signUpForm = $('#form-signUp');
	 const $email = $('#email');
	 const $password = $('#password');
	 const $passwordConfirm = $('#passwordConfirm');
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

	/**
	 * bind event
	 */
	$passwordConfirm.on('blur', _handleValidatePassword);
	$checkId.on("click", _switchCheckIdAlert);
	$holdpassport.on("click", _switchHoldpassportPForm);
	$holdpassportP.on("click", _switchPassportForm);
	$isDistribution.on("click", _switchShowDistribution);
	$hasBeenTaiwan.on("click", _switchShowHasBeenTaiwan);
	
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
		var status = $(this).data('isdistribution');
		if (status) {
			$showDistribution.fadeIn();
		} else {
			$showDistribution.fadeOut();
		}
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
