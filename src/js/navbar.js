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
		_setEmailVerifyAlert(json.student_misc_data);
		_setProgress(json);
		_setHeader(json);
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

	function _setProgress(data) {
		// 資格驗證
		if (!!data.student_qualification_verify) {
			$('.nav-systemChoose').addClass('list-group-item-success');
			const systemID = data.student_qualification_verify.system_id;
			if (+systemID === 1) {
				$('.nav-educationInfo, .nav-olympia, .nav-grade, .nav-placementSelection').show();
			}
		}

		// 個人基本資料
		!!data.student_personal_data && $('.nav-personalInfo').addClass('list-group-item-success');

		// 入學資料
		!!data.student_education_background_data && $('.nav-educationInfo').addClass('list-group-item-success');

		// 奧林匹亞志願
		!!data.student_olympia_aspiration_order && $('.nav-olympia').addClass('list-group-item-success');

		// 上傳學歷證件
		!!data.student_education_document && $('.nav-uploadEducation').addClass('list-group-item-success');

		// 個人申請志願
		!!data.student_department_admission_selection_order && $('.nav-admissionSelection').addClass('list-group-item-success');

		// 聯合分發成績採計方式
		!!data.student_department_admission_placement_apply_way && $('.nav-grade').addClass('list-group-item-success');

		// 聯合分發志願
		!!data.student_department_admission_placement_order && $('.nav-placementSelection').addClass('list-group-item-success');
	}

	function _setHeader(data) {
		const systemMap = ['學士班', '港二技', '碩士班', '博士班'];
		const identityMap = ['港澳生', '港澳具外國國籍之華裔學生', '海外僑生', '在臺港澳生', '在臺僑生'];
		student.setHeader({
			system: systemMap[data.student_qualification_verify.system_id - 1],
			identity: identityMap[data.student_qualification_verify.identity - 1],
			id: data.id
		});
	}
})();
