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

	/**
	*	bind event
	*/
	$graduatedRadio.on('change', _checkGraduated);
	$idCardRadio.on('change', _cehckIdCardValidation);

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

})();
