(() => {
	/**
	*	cache DOM
	*/
	const $HK_MacaoNum = $('#HK_MacaoNum');
	const $otherNum = $('#otherNum');
	const $email = $('#email');
	const $pass = $('#password');
	const $loginBtn = $('#btn-login');
	const $downloadLinks = $('#download-links');

	/**
	*	init
	*/

	_init();
	
	/**
	*	bind event
	*/
	$loginBtn.on('click', _handleLogin);
	$pass.keyup((e) => { e.keyCode == 13 && _handleLogin(); });

	/**
	*	event handlet
	*/

	async function _init() {
		try {
            $downloadLinks.append(
            	'<a href="' + env.baseUrl + '/forms/2018志願選填系統操作說明書(香港DSE、CEE、ALE學生適用).pdf" target="_blank" class="list-group-item list-group-item-action">2018志願選填系統操作說明書(香港DSE、CEE、ALE學生適用)</a>' +
				'<a href="' + env.baseUrl + '/forms/香港各會考文憑成績核計方式及分數換算對照表.pdf" target="_blank" class="list-group-item list-group-item-action">香港各會考文憑成績核計方式及分數換算對照表</a>\n' +
                '<a href="' + env.baseUrl + '/hk-quit-admission-placement-declaration-form" target="_blank" class="list-group-item list-group-item-action">放棄聯合分發聲明書（香港專用）</a>\n' +
                '<a href="http://get.adobe.com/tw/reader/" target="_blank" class="list-group-item list-group-item-action">觀看中文PDF軟體</a>\n' +
                '<a href="http://www.7-zip.org/" target="_blank" class="list-group-item list-group-item-action">解壓縮軟體</a>\n' +
                '<a href="' + env.baseUrl + '/admission-data-correction-form" target="_blank" class="list-group-item list-group-item-action">報名資料修正表</a>\n' +
                '<a href="http://www.gov.hk/tc/about/helpdesk/softwarerequirement/hkscs.htm" target="_blank" class="list-group-item list-group-item-action">香港字庫(For win2000/XP OR Linux)</a>\n' +
                '<a href="http://www.ccli.gov.hk/tc_chi/faq/faq_win7-hkscs.html" target="_blank" class="list-group-item list-group-item-action">香港字庫(FOR Win7)</a>'
			);
			const response = await student.getAdmissionCount();
			if (!response.ok) { throw response; }
			const admissionCount = await response.json();
			$HK_MacaoNum.text(admissionCount.HK_Macao);
			$otherNum.text(admissionCount.other);
		} catch (e) {
			console.log(e);
		}

		loading.complete();
	}

	function _handleLogin() {
		const email = $email.val();
		const pass = $pass.val();

		const loginData = {
			email: email,
			password: sha256(pass)
		};

		loading.start();
		student.login(loginData)
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res.status;
			}
		})
		.then((json) => {
			console.log(json);
			if( json.student_qualification_verify === null) {
                location.href = './systemChoose.html';
            } else if( (json.student_qualification_verify.identity=== 6 &&
					json.student_misc_data.join_admission_selection=== 1 &&
					json.student_misc_data.confirmed_at !=null &&
					json.can_admission_placement == true) ||
				(json.student_qualification_verify.identity === 7 &&
					json.student_misc_data.confirmed_at != null &&
					json.student_misc_data.confirmed_placement_at === null)
				// ||
				// (json.student_misc_data.admission_placement_apply_way != null &&
				// 	json.student_misc_data.admission_placement_apply_way_data.code == "23" &&
				// 	json.student_misc_data.confirmed_at != null &&
				// 	json.student_misc_data.confirmed_placement_at === null &&
				// 	json.can_admission_placement == true)
				){
				location.href = './placementSelection.html';
			} else if (!!json.student_misc_data.confirmed_at) {
				location.href = './downloadDocs.html';
			} else {
				location.href = './systemChoose.html';
			}
			loading.complete();
		})
		.catch((err) => {
			err === 401 && alert('帳號或密碼輸入錯誤。');
			loading.complete();
		})
	}

})();
