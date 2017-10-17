(() => {

	/**
	*	cache DOM
	*/
	const $logoutBtn = $('#btn-logout');
	const $mailResendBtn = $('#btn-mailResend');

	/**
	* init
	*/
	// get progress
	student.getStudentRegistrationProgress().then((res) => {
	if (res.ok) {
			return res.json();
		} else {
			throw res;
		}
	})
	.then((json) => {
		console.log(json);
		_setEmailVerifyAlert(json.student_misc_data);
	})
	.catch((err) => {
		console.error(err);
		err.json && err.json().then((data) => {
			console.error(data);
			alert(`ERROR: \n${data.messages[0]}`);
		})
	});

	/**
	*	bind event
	*/
	$logoutBtn.on('click', _handleLogout);
	$mailResendBtn.on('click', _handleResendMail);

	function _handleLogout() {
		student.logout()
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			alert('登出成功。');
			location.href="./index.html";
		})
		.catch((err) => {
			err.json && err.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			})
		})
	}

	function _handleResendMail() {
		student.resendEmail()
		.then((res) => {
			if(res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((data) => {
			alert('已寄出驗證信，請至填寫信箱查看。');
		})
		.catch((err) => {
			err.json && err.json().then((data) => {
				console.error(data.messages[0]);
			});
		})
	}
	
	function _setEmailVerifyAlert(miscData) {
		if (!miscData.email_verified) {
			$('.alert-emailVerify').show();
		}
	}
})();
