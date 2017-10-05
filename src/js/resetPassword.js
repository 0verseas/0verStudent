(() => {

	/**
	*	private variable
	*/

	let _passValid = false;

	/**
	*	cache DOM
	*/

	const $resetPassword = $('#input-resetPassword');
	const $resetPasswordConfirm = $('#input-resetPasswordConfirm');
	const $resetPasswordSubmitBtn = $('#btn-resetPasswordSubmit');
	
	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$resetPassword.on('blur', _checkPassword);
	$resetPasswordConfirm.on('blur', _checkPasswordConfirm);
	$resetPasswordConfirm.keyup((e) => { e.keyCode == 13 && _handleSubmit(); });
	$resetPasswordSubmitBtn.on('click', _handleSubmit);

	function _init() {
		let email = _getParameterByName('email');
		let token = _getParameterByName('token');
		const data = {
			email,
			token
		}
		// if 無重設密碼需求
		// then 踢走你
	}

	function _getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	function _checkPassword() {
		const oriPass = $resetPassword.val();
		const passConfirm = $resetPasswordConfirm.val();
		oriPass.length >= 6 && $resetPassword.removeClass('invalidInput') && (_passValid = true);
		oriPass === passConfirm && $resetPasswordConfirm.removeClass('invalidInput') && (_passValid = true);
		oriPass.length < 6 && $resetPassword.addClass('invalidInput') && (_passValid = false);
		oriPass !== passConfirm && $resetPasswordConfirm.addClass('invalidInput') && (_passValid = false);
	}

	function _checkPasswordConfirm() {
		const oriPass = $resetPassword.val();
		const passConfirm = $resetPasswordConfirm.val();
		oriPass === passConfirm && $resetPasswordConfirm.removeClass('invalidInput') && (_passValid = true);
		oriPass !== passConfirm && $resetPasswordConfirm.addClass('invalidInput') && (_passValid = false);
	}

	function _handleSubmit() {
		const oriPass = $resetPassword.val();
		const passConfirm = $resetPasswordConfirm.val();
		if (_passValid && !!oriPass && !!passConfirm) {
			const data = {
				password: sha256(oriPass),
				password_confirmation: sha256(passConfirm)
			}
			console.log(data);
			// 更新密碼
			alert("密碼重設成功，請重新登入。");
			location.href="./index.html";
			// 更新成功後，導向到 index
		} else {
			alert('輸入有誤');
		}
	}

})();
