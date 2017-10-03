(() => {
	/**
	*	cache DOM
	*/
	const $email = $('#email');
	const $pass = $('#password');
	const $loginBtn = $('#btn-login');
	
	/**
	*	bind event
	*/
	$loginBtn.on('click', _handleLogin);
	$pass.keyup((e) => { e.keyCode == 13 && _handleLogin(); });

	/**
	*	event handlet
	*/
	function _handleLogin() {
		const email = $email.val();
		const pass = $pass.val();

		const loginData = {
			email: email,
			password: pass
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
})();
