(() => {

	/**
	*	private variable
	*/

	let _currentFatherStatus = 1;
	let _currentMotherStatus = 1;

	/**
	*	cache DOM
	*/

	const $personalInfoForm = $('#form-personalInfo');
	// 家長資料
	const $fatherStatus = $personalInfoForm.find('.fatherStatus');
	const $motherStatus = $personalInfoForm.find('.motherStatus');
	const $fatherDataForm = $personalInfoForm.find('#form-fatherData');
	const $motherDataForm = $personalInfoForm.find('#form-motherData');
	const $guardianForm = $personalInfoForm.find('#form-guardian');
	

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$fatherStatus.on('change', _switchFatherDataForm);
	$motherStatus.on('change', _switchMotherDataForm);
	

	function _init() {
		_switchGuardianForm();
	}

	function _switchFatherDataForm() {
		_currentFatherStatus = Number($(this).val());
		if (_currentFatherStatus === 3) {
			$fatherDataForm.fadeOut();
		} else {
			$fatherDataForm.fadeIn();
		}
		_switchGuardianForm();
	}

	function _switchMotherDataForm() {
		_currentMotherStatus = Number($(this).val());
		if (_currentMotherStatus === 3) {
			$motherDataForm.fadeOut();
		} else {
			$motherDataForm.fadeIn();
		}
		_switchGuardianForm();
	}

	function _switchGuardianForm() {
		if (_currentFatherStatus === 3 && _currentMotherStatus === 3) {
			$guardianForm.fadeIn();
		} else {
			$guardianForm.fadeOut();
		}
	}

})();
