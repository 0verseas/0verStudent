const student = (() => {

	const baseUrl = env.baseUrl;

	function setHeader() {
		const $studentInfoHeader = $('#header-studentInfo');
		const $headerSystem = $studentInfoHeader.find('#headerSystem');
		const $headerIdentity = $studentInfoHeader.find('#headerIdentity');
		const $headerId = $studentInfoHeader.find('#headerId');

		let headerData = {
			system: "學士班",
			identity: "港澳生",
			id: "200003"
		}

		$headerSystem.html(headerData.system);
		$headerIdentity.html(headerData.identity);
		$headerId.html(headerData.id);
	}

	function register(data) {
		return fetch(baseUrl + `/students/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}, 
			body: JSON.stringify(data),
			credentials: 'include'
		});
	}

	function login(data) {
		return fetch(baseUrl + `/students/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}, 
			body: JSON.stringify(data),
			credentials: 'include'
		});
	}

	function logout() {
		return fetch(baseUrl + `/students/logout`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function verifyEmail(email, token) {
		return fetch(baseUrl + `/students/verify-email/${email}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			}, 
			credentials: 'include',
			body: JSON.stringify({ token })
		})
	}

	function resendEmail() {
		return fetch(baseUrl + `/students/verify-email`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}, 
			credentials: 'include'
		})
	}

	function getDeptApplicationDoc(schoolId, system, deptId) { // 接系所資料（暫時用在「上傳備審資料」上）
		return fetch(baseUrl + `/schools/` + schoolId + `/systems/` + system + `/departments/` + deptId, {
			method: 'GET'
		});
	}

	function sendResetPassword(data) {
		return fetch(baseUrl + `/students/reset-password`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
	}

	function resetPassword(data, email) {
		return fetch(baseUrl + `/students/reset-password/` + email, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
	}

	function checkResetPasswordToken(email, token) {
		return fetch(baseUrl + `/students/reset-password?email=` + email + `&token=` + token, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
	}

	function getOlympiaAspirationOrder() {
		return fetch(baseUrl + `/students/olympia-aspiration-order`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function setOlympiaAspirationOrder(data) {
		return fetch(baseUrl + `/students/olympia-aspiration-order`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
	}

	return {
		setHeader,
		register,
		login,
		logout,
		getDeptApplicationDoc,
		sendResetPassword,
		resetPassword,
		checkResetPasswordToken,
		verifyEmail,
		resendEmail,
		getOlympiaAspirationOrder,
		setOlympiaAspirationOrder
	};

})();
