(() => {
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
	$passwordConfirm.on('blur', _checkPassword);
	$registerBtn.on('click', _handleSubmit);
	
	/**
	 * private method
	 */
	function _checkPassword() {
		const oriPass = $password.val();
		const passConfirm = $passwordConfirm.val();
		oriPass !== passConfirm && $passwordConfirm.addClass('invalidInput');
		oriPass === passConfirm && $passwordConfirm.removeClass('invalidInput');
	}

	function _handleSubmit() {
		const email = $email.val();
		const oriPass = $password.val();
		const passConfirm = $passwordConfirm.val();
		if (!!email && (oriPass === passConfirm)) {
			location.href="./systemChoose.html";
		} else {
			alert('輸入有誤');
		}
	}
})();
