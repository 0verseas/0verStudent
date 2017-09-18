(() => {
	/**
	 * private variable
	 */
	let _emailValid = false;
	let _passValid = false;

	/**
	 *  cache DOM
	 */
	const $Register = $('.Register');
	const $email = $Register.find('#Register__inputEmail');
	const $password = $Register.find('#Register__inputPassword');
	const $passwordConfirm = $Register.find('#Register__inputPasswordConfirm');
	const $registerBtn = $Register.find('.Register__btnRegister');

	/**
	 * bind event
	 */
	$email.on('blur', _checkEmail);
	$passwordConfirm.on('blur', _checkPassword);
	$registerBtn.on('click', _handleSubmit);
	
	/**
	 * private method
	 */
	function _checkEmail() {
		const email = $email.val();
		if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
			$email.addClass('invalidInput');
			_emailValid = false;
		} else {
			$email.removeClass('invalidInput');
			_emailValid = true;
		}
	}

	function _checkPassword() {
		const oriPass = $password.val();
		const passConfirm = $passwordConfirm.val();
		oriPass !== passConfirm && $passwordConfirm.addClass('invalidInput') && (_passValid = false);
		oriPass === passConfirm && $passwordConfirm.removeClass('invalidInput') && (_passValid = true);
	}

	function _handleSubmit() {
		const oriPass = $password.val();
		const passConfirm = $passwordConfirm.val();
		if (_emailValid && _passValid && !!oriPass && !!passConfirm) {
			location.href="./";
		} else {
			alert('輸入有誤');
		}
	}
})();
