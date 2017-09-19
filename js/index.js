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

	/**
	*	event handlet
	*/
	function _handleLogin() {
		const email = $email.val();
		const pass = $pass.val();

		console.log([email, pass]);
		location.href = './systemChoose.html';
	}
})();
