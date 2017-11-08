(() => {

	/**
	*	cache DOM
	*/
	const $logoutBtn = $('#btn-logout');
	const $mailResendBtn = $('#btn-mailResend');
	const $checkBtn = $('#btn-all-set');
	const $afterConfirmZone = $('#afterConfirmZone');
	const $uploadAndSubmit = $('#btn-uploadAndSubmit');

	/**
	* init
	*/
	// get progress
	student.getStudentRegistrationProgress()
	.then((res) => {
		if (res.ok) {
			return res.json();
		} else {
			throw res;
		}
	})
	.then((json) => {
		console.log(json);
		!!json.student_misc_data || location.replace('./');
		_setGreet(json.name || json.email);
		_setEmailVerifyAlert(json.student_misc_data);
		_setProgress(json);
		_setHeader(json);
		_checkQualificationVerify(window.location.pathname, json.student_qualification_verify);
		_checkConfirm(!!json.student_misc_data.confirmed_at);
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
	$checkBtn.on('click', _checkAllSet);
	$uploadAndSubmit.on('click', _handleUploadAndSubmit);

	function _handleLogout() {
		loading.start();
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
			loading.complete();
		})
		.catch((err) => {
			err.json && err.json().then((data) => {
				console.error(data);
				alert(`ERROR: \n${data.messages[0]}`);
			})
			loading.complete();
		})
	}

	function _handleResendMail() {
		loading.start();
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
			loading.complete();
		})
		.catch((err) => {
			err.json && err.json().then((data) => {
				console.error(data.messages[0]);
			});
			loading.complete();
		})
	}

	function _handleUploadAndSubmit() {
		swal({
				title: '確認提交',
				text: "注意：按下確認提交後，上傳的檔案就無法再做任何變更。",
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: '確認提交',
				cancelButtonText: '取消',
				confirmButtonClass: 'btn btn-success',
				cancelButtonClass: 'btn btn-danger',
				buttonsStyling: false
		}).
		then(function () {
			student.uploadAndSubmit().then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((data) => {
				/*swal(
					'提交成功！',
					'Your file has been submitted for review!',
					'success!'
				)*/
				var html = ``;
				for (var i = 0; i < data.length; i++) {
					html += `
						<h4>${data[i].name}</h4><br />
					`;
					for (var j = 0; j < data[i].docs_result.length; j++) {
						html += `
							<div style="text-align: left">
							${data[i].docs_result[j].doc_name}
						`;
						if (data[i].docs_result[j].doc_required) {
							html += ` (必繳)`;
						} else {
							html += ` (選繳)`;
						}
						html += `
							, 已上傳 ${data[i].docs_result[j].doc_count} 個檔案。
							</div><br />
						`;
					}
					html += `<br />`;
				}
				swal({
					title: '<i>提交成功！</i>',
					type: 'info',
					html: html,
					showCloseButton: true,
				})
				.then(() => { location.reload() });
			})
			.catch((err) => {
				err.json && err.json().then((data) => {
					console.error(data.messages[0]);
					swal(
						'提交失敗！',
						data.messages[0],
						'error'
					);
				});
				loading.complete();
			})
		}, function (dismiss) {
			return;
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
		// 不得參加個人申請
		+data.student_misc_data.join_admission_selection === 2 && $('.nav-admissionSelection').hide();

		// 個人基本資料
		!!data.student_personal_data && $('.nav-personalInfo').addClass('list-group-item-success');

		// 入學資料
		!!data.student_education_background_data && $('.nav-educationInfo').addClass('list-group-item-success');

		// 奧林匹亞志願
		!!data.student_olympia_aspiration_order && $('.nav-olympia').addClass('list-group-item-success');

		// 上傳學歷證件
		!!data.student_education_document && $('.nav-uploadEducation').addClass('list-group-item-success');

		// 個人申請志願
		+data.student_qualification_verify.system_id === 1 &&
		!!data.student_department_admission_selection_order &&
		$('.nav-admissionSelection').addClass('list-group-item-success');

		+data.student_qualification_verify.system_id === 2 &&
		!!data.student_two_year_tech_department_admission_selection_order &&
		$('.nav-admissionSelection').addClass('list-group-item-success');

		+data.student_qualification_verify.system_id > 2 &&
		!!data.student_graduate_department_admission_selection_order &&
		$('.nav-admissionSelection').addClass('list-group-item-success');

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
			id: (data.id).toString().padStart(6, "0")
		});
	}

	function _checkQualificationVerify(currentPathName, qualificationVerifyStatus) {
		const doNotVerifyPages = [ // 不需檢查資格驗證的頁面
		"/systemChoose.html",
		"/qualify1.html",
		"/qualify2.html",
		"/qualify3.html"
		];
		if (!qualificationVerifyStatus) {
			if (!(doNotVerifyPages.indexOf(currentPathName) > -1)) {
				alert("請先完成資格驗證");
				location.href = "./systemChoose.html"
			}
		}
	}

	function _checkAllSet() {
		var isAllSet = confirm("確認後就「無法再次更改資料」，您真的確認送出嗎？");
		if (isAllSet === true) {
			const data = {
				"confirmed": true
			}
			student.dataConfirmation(data)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				console.log(json);
				alert("成功確認資料。\n如果需要再修改資料請利用「資料修正表」，或是重新申請一組新的帳號。");
				location.href = "./downloadDocs.html";
				loading.complete();
			})
			.catch((err) => {
				if (err.status && err.status === 401) {
					alert('請登入。');
					location.href = "./index.html";
				} else {
					err.json && err.json().then((data) => {
						console.error(data);
						alert(`ERROR: \n${data.messages[0]}`);
					})
				}
				loading.complete();
			});
		}
	}
	
	function _setGreet(name) {
		$('.greet').text(`歡迎 ${name} 登入！`)
	}

	function  _checkConfirm(confirmed) {
		confirmed && $('#btn-all-set').removeClass('btn-danger').addClass('btn-success').prop('disabled', true).text('已填報') && $afterConfirmZone.show();
	}
})();
