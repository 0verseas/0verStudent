(() => {
	/**
	*	private variable
	*/
	let _emailValid = false;
	let _passValid = false;

	/**
	*	cache DOM
	*/
	const $Register = $('.Register');
	const $email = $Register.find('#Register__inputEmail');
	const $password = $Register.find('#Register__inputPassword');
	const $passwordConfirm = $Register.find('#Register__inputPasswordConfirm');
	const $registerBtn = $Register.find('.Register__btnRegister');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/
	$email.on('blur', _checkEmail);
	$password.on('blur', _checkPassword);
	$passwordConfirm.on('blur', _checkPasswordConfirm);
	$registerBtn.on('click', _handleSubmit);
	
	/**
	*	private method
	*/

	function _init() {
		loading.complete();
	}

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
		oriPass.length >= 6 && $password.removeClass('invalidInput') && (_passValid = true);
		oriPass === passConfirm && $passwordConfirm.removeClass('invalidInput') && (_passValid = true);
		oriPass.length < 6 && $password.addClass('invalidInput') && (_passValid = false);
		oriPass !== passConfirm && $passwordConfirm.addClass('invalidInput') && (_passValid = false);
	}

	function _checkPasswordConfirm() {
		const oriPass = $password.val();
		const passConfirm = $passwordConfirm.val();
		oriPass === passConfirm && $passwordConfirm.removeClass('invalidInput') && (_passValid = true);
		oriPass !== passConfirm && $passwordConfirm.addClass('invalidInput') && (_passValid = false);
	}

	function _handleSubmit() {
		const email = $email.val();
		const oriPass = $password.val();
		const passConfirm = $passwordConfirm.val();
		if (_emailValid && _passValid && !!oriPass && !!passConfirm) {
			const data = {
				email: email,
				password: sha256(oriPass),
				password_confirmation: sha256(passConfirm)
			}
			loading.start();
			student.register(data)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				console.log(json);
				location.href="./systemChoose.html";
				loading.complete();
			})
			.catch((err) => {
				err.json && err.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
				loading.complete();
			})
		} else {
			alert('輸入有誤');
		}
	}
})();
