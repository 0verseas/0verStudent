const student = (() => {

	const baseUrl = env.baseUrl;

	function setHeader(headerData) {
		const $studentInfoHeader = $('#header-studentInfo');
		const $headerSystem = $studentInfoHeader.find('#headerSystem');
		const $headerIdentity = $studentInfoHeader.find('#headerIdentity');
		const $headerId = $studentInfoHeader.find('#headerId');

		headerData = headerData || {
			system: "",
			identity: "請重新整理。",
			id: ""
		}

		$headerSystem.html(headerData.system);
		$headerIdentity.html(headerData.identity);
		$headerId.html(headerData.id);
	}

	function getAdmissionCount () {
		return fetch(baseUrl + `/students/admission-count`, {
			method: 'GET'
		});
	}

	function getAdmissionCountDetail() {
		return fetch(baseUrl + `/students/admission-count/detail`, {
			method: 'GET'
		});
	}

	async function getCountryList() {
		if (localStorage.countryList
			&& localStorage.countryList !== ""
			&& localStorage.countryListExpiration
			&& localStorage.countryListExpiration
			&& localStorage.countryListExpiration > new Date().getTime()) {
			return JSON.parse(localStorage.countryList);
		} else {
			try {
				const response = await fetch(baseUrl + `/country-lists`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: 'include'
				});
				if (!response.ok) { throw response; }
				const json = await response.json();

				let group_to_values = await json.reduce(function (obj, item) {
					obj[item.continent] = obj[item.continent] || [];
					obj[item.continent].push({id: item.id, country: item.country});
					return obj;
				}, {});

				let groups = await Object.keys(group_to_values).map(function (key) {
					return {continent: key, country: group_to_values[key]};
				});

				localStorage.countryList = JSON.stringify(groups);
                localStorage.countryListExpiration = new Date().getTime() + (1440 * 60 * 1000);
				return groups;
			} catch (e) {
				console.log('Boooom!!');
				console.log(e);
			}
		}
	}

	function getSchoolList(countryId) {
		return fetch(baseUrl + `/overseas-school-lists?country_id=` + countryId, {
			method: 'GET'
		});
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

	function isLogin() {
		return fetch(baseUrl + `/students/login`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
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

	function getStudentPersonalData() {
		return fetch(baseUrl + `/students/personal-data`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function setStudentPersonalData(data) {
		return fetch(baseUrl + `/students/personal-data`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
	}

	function getStudentEducationInfoData() {
		return fetch(baseUrl + `/students/education-background`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function setStudentEducationInfoData(data) {
		return fetch(baseUrl + `/students/education-background`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
	}

	function getOrderList(type) {
		return fetch(baseUrl + `/students/admission-order-list?type=` + type, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function getOlympiaAspirationOrder() {
		var urls = [
		baseUrl + '/students/olympia-aspiration-order',
		baseUrl + '/students/admission-order-list?type=olympia'
		]
		const grabContent = url => fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		return Promise.all(urls.map(grabContent))
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

	function getEducationFile() {
		var urls = [
		baseUrl + '/students/diploma',
		baseUrl + '/students/transcripts',
		baseUrl + '/students/registration-progress'
		]
		const grabContent = url => fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		return Promise.all(urls.map(grabContent))
	}

	function uploadEducationFile(type, data) {
		return fetch(baseUrl + `/students/` + type, {
			method: 'POST',
			body: data,
			credentials: 'include'
		});
	}

	function deleteEducationFile(type, fileName) {
		return fetch(baseUrl + `/students/` + type + `/` + fileName, {
			method: 'DELETE',
			credentials: 'include'
		});
	}

	function getAdmissionSelectionOrder() {
		var urls = [
		baseUrl + '/students/admission-selection-order',
		baseUrl + '/students/admission-order-list?type=selection'
		]
		const grabContent = url => fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		return Promise.all(urls.map(grabContent))
	}

	function getAdmissionSelectionWishOrder() {
		return fetch(baseUrl + `/students/admission-selection-order`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function setAdmissionSelectionOrder(data) {
		return fetch(baseUrl + `/students/admission-selection-order`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
	}

	// POST /students/verify-qualification
	function verifyQualification(data) {
		return fetch(`${baseUrl}/students/verify-qualification`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		});
	}

	function getVerifyQualification() {
		return fetch(`${baseUrl}/students/verify-qualification`, {
			method: 'get',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		});
	}

	function getStudentAvailableApplyWayList() {
		return fetch(baseUrl + `/students/available-apply-way`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function getStudentAdmissionPlacementApplyWay() {
		return fetch(baseUrl + `/students/admission-placement-apply-way`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function setStudentAdmissionPlacementApplyWay(data) {
		return fetch(baseUrl + `/students/admission-placement-apply-way`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
	}

	function getPlacementSelectionOrder() {
		var urls = [
		baseUrl + '/students/admission-placement-order',
		baseUrl + '/students/admission-order-list?type=placement'
		]
		const grabContent = url => fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		return Promise.all(urls.map(grabContent))
	}

	function setPlacementSelectionOrder(data) {
		return fetch(baseUrl + `/students/admission-placement-order`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
	}

	function SecondPlacementSelectionOrder(data) {
		return fetch(baseUrl + `/students/storeConfirm`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
	}

	function getOrderResultList(url) {
		return fetch(baseUrl + url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function getStudentRegistrationProgress() {
		return fetch(baseUrl + `/students/registration-progress`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
	}

	function setReviewItem({ student_id, dept_id, type_id, data }) {
		return fetch(`${baseUrl}/students/${student_id}/admission-selection-application-document/departments/${dept_id}/types/${type_id}/files`, {
			method: 'POST',
			body: data,
			credentials: 'include'
		})
	}

	function getReviewItem({ student_id, dept_id, type_id }) {
		return new Promise((resolve, reject) => {
			fetch(`${baseUrl}/students/${student_id}/admission-selection-application-document/departments/${dept_id}/types/${type_id}/files`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			})
			.then((res) => {
				if (res.ok) {
					resolve(res.json());
				} else {
					reject(res);
				}
			})
		})
	}

	function delReviewItem({ student_id, dept_id, type_id, filename }) {
		return fetch(`${baseUrl}/students/${student_id}/admission-selection-application-document/departments/${dept_id}/types/${type_id}/files/${filename}`, {
			method: 'Delete',
			credentials: 'include'
		})
	}

	function dataConfirmation(data) {
		return fetch(baseUrl + `/students/data-confirmation`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
	}

	function uploadAndSubmit() {
		return fetch(baseUrl + `/students/admission-selection-application-document-lock`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				confirmed: true
			}),
			credentials: 'include'
		})
	}

	//驗證老師的 token
	function teacherVerify(id, token) {
		return fetch(baseUrl + `/teachers/invitation-token/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({ token })
		})
	}

	//老師上傳完成囉
	function teacherBye(id, token) {
		return fetch(baseUrl + `/teachers/invitation-token/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({ token })
		})
	}

	//老師上傳推薦函
	function teacherSetReviewItem({ student_id, dept_id, token, data }) {
		return fetch(`${baseUrl}/teachers/${student_id}/${dept_id}/${token}/recommendation-letters`, {
			method: 'POST',
			body: data,
			credentials: 'include'
		})
	}

	//學生邀請老師上傳推薦函
	function studentInviteTeacher(department_id, teacherName, teacherMail, studentMessage) {
		let teacherContactInfo  = {teacher_name:teacherName, teacher_mail:teacherMail, student_message:studentMessage};
		return fetch(baseUrl + `/students/departments/${department_id}/recommendation-letter-invitations`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(teacherContactInfo),
			credentials: 'include'
		})
	}

	//取得老師上傳的推薦函
	function getTeacherSetReviewItem(student_id, dept_id, token) {
		return fetch(`${baseUrl}/teachers/${student_id}/${dept_id}/${token}/recommendation-letters`, {
			method: 'GET',
			credentials: 'include'
		})
	}

	// 寄信通知學生老師上傳囉
	function notifyStudentRecommendationLetterHadUploaded(student_id, dept_id, token) {
		return fetch(`${baseUrl}/students/teacher-recommendation-letter/notification/${student_id}/${token}/had-uploaded`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({dept_id}),
			credentials: 'include'
		})
	}

	// 老師可以刪除自己上傳的推薦函檔案
	function teacherDeleteItem({student_id, dept_id, token, filename}) {
		return fetch(`${baseUrl}/teachers/${student_id}/${dept_id}/${token}/recommendation-letters/${filename}`, {
			method: 'DELETE',
			credentials: 'include'
		})
	}

	// 老師想看看之前自己上傳的東西，但還是要驗證 token
	function teacherWantReview(student_id, token) {
		return fetch(`${baseUrl}/teachers/${student_id}/${token}/uploaded-review`, {
			method: 'GET',
			credentials: 'include'
		})
	}

	//學生上傳澳門四校成績單
	function MacauTranscriptsetReviewItem({ student_id, data, subject }) {
		return fetch(`${baseUrl}/students/${student_id}/macau-transcript/subject/${subject}/file`, {
			method: 'POST',
			body: data,
			credentials: 'include'
		})
	}

	//撈出學生傳澳門四校聯考成績檔案名
	function getMacauTranscriptsetItem({student_id, subject}) {
		return fetch(`${baseUrl}/students/${student_id}/macau-transcript/subject/${subject}/file`, {
			method: 'GET',
			credentials: 'include'
		})
	}

	// 刪除澳門四校聯考成績單檔案
	function delMacauTranscriptItem({ student_id, subject, filename }) {
		return fetch(`${baseUrl}/students/${student_id}/macau-transcript/subject/${subject}/file/${filename}`, {
			method: 'Delete',
			credentials: 'include'
		})
	}

	//撈出學生登打澳門四校聯考成績
	function getMacauTranscriptScore({student_id}) {
		return fetch(`${baseUrl}/students/${student_id}/macau-transcript-all-score`, {
			method: 'GET',
			credentials: 'include'
		})
	}

	//儲存學生登打澳門四校聯考成績
	function storeMacauTranscriptScore(sendData) {
		return fetch(`${baseUrl}/students/store-macau-transcript-all-score`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body:  JSON.stringify(sendData),
			credentials: 'include'
		})
	}


	// 取得學生是否願意去僑先部的資料
	function getStudentGoToFForNot(){
		return fetch(`${baseUrl}/students/FF-or-not`,{
			method: 'GET',
			credentials: "include"
		})
	}

	// 更新學生是否願意去僑先部
	function setStudentGoToFForNot(data) {
		return fetch(baseUrl + `/students/FF-or-not/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(data),
		})
	}

	return {
		setHeader,
		getAdmissionCount,
		getAdmissionCountDetail,
		getCountryList,
		getSchoolList,
		register,
		isLogin,
		login,
		logout,
		verifyEmail,
		resendEmail,
		getDeptApplicationDoc,
		sendResetPassword,
		resetPassword,
		checkResetPasswordToken,
		getStudentPersonalData,
		setStudentPersonalData,
		getStudentEducationInfoData,
		setStudentEducationInfoData,
		getOrderList,
		getOlympiaAspirationOrder,
		setOlympiaAspirationOrder,
		getEducationFile,
		uploadEducationFile,
		deleteEducationFile,
		getAdmissionSelectionOrder,
		getAdmissionSelectionWishOrder,
		setAdmissionSelectionOrder,
		verifyQualification,
		getVerifyQualification,
		getStudentAvailableApplyWayList,
		getStudentAdmissionPlacementApplyWay,
		setStudentAdmissionPlacementApplyWay,
		getStudentRegistrationProgress,
		getPlacementSelectionOrder,
		setPlacementSelectionOrder,
		getOrderResultList,
		dataConfirmation,
		setReviewItem,
		getReviewItem,
		delReviewItem,
		uploadAndSubmit,
		SecondPlacementSelectionOrder,
		teacherVerify,
		teacherBye,
		teacherSetReviewItem,
		studentInviteTeacher,
		getTeacherSetReviewItem,
		notifyStudentRecommendationLetterHadUploaded,
		teacherDeleteItem,
		teacherWantReview,
		MacauTranscriptsetReviewItem,
		getMacauTranscriptsetItem,
		delMacauTranscriptItem,
		getStudentGoToFForNot,
		setStudentGoToFForNot,
		getMacauTranscriptScore,
		storeMacauTranscriptScore
	};

})();
