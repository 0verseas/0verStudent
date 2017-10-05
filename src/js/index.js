(() => {
	/**
	*	cache DOM
	*/
	const $email = $('#email');
	const $pass = $('#password');
	const $loginBtn = $('#btn-login');
	const $forgetPasswdBtn = $('#btn-forgetPasswd');
	
	/**
	*	bind event
	*/
	$loginBtn.on('click', _handleLogin);
	$pass.keyup((e) => { e.keyCode == 13 && _handleLogin(); });
	$forgetPasswdBtn.on('click', _handleForgetPasswd);

	/**
	*	event handlet
	*/

	function _handleLogin() {
		const email = $email.val();
		const pass = $pass.val();

		const loginData = {
			email: sha256(email),
			password: sha256(pass)
		}

		student.login(loginData)
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res.status;
			}
		})
		.then((json) => {
			location.href = './systemChoose.html';
		})
		.catch((err) => {
			err === 401 && alert('帳號或密碼輸入錯誤。');
		})
	}

	function _handleForgetPasswd() {
		// 寄送重設密碼信件
		alert("重設密碼確認信已寄出，請至信箱檢查。");
	}
})();
