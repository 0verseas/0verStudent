(() => {
	// 引入 reCAPTCHA 的 JS 檔案
    var s = document.createElement('script');
    let src = 'https://www.google.com/recaptcha/api.js?render=' + env.reCAPTCHA_site_key;
    s.setAttribute('src', src);
    document.body.appendChild(s);

	/**
	*	cache DOM
	*/
	const $HK_MacaoNum = $('#HK_MacaoNum');
	const $otherNum = $('#otherNum');
	const $email = $('#email');
	const $pass = $('#password');
	const $loginBtn = $('#btn-login');
	const $fbLoginBtn = $('#btn-fb-login');
	const $downloadLinks = $('#download-links');

	/**
	*	init
	*/

	_init();
	
	/**
	*	bind event
	*/
	$loginBtn.on('click', _handleLogin);
	$fbLoginBtn.on('click', _handleFbLogin);
	$pass.keyup((e) => { e.keyCode == 13 && _handleLogin(); }); //原本沒驗證碼 所以就密碼輸入欄位判斷是否有按enter的鍵盤事件

	/**
	*	event handlet
	*/

	async function _init() {
		let isSafari = navigator.userAgent.search("Safari") > -1;
		let isChrome = navigator.userAgent.indexOf("Chrome") != -1;
		if(isSafari && !isChrome){
			swal({title: "建議使用 Chrome 瀏覽器操作本會系統，以免部分功能無法正常執行。", type:"info", confirmButtonText: '確定', allowOutsideClick: false});
		}
		try {
            $downloadLinks.append(
            	// '<a href="' + env.baseUrl + '/forms/2019志願選填說明書(香港DSE、CEE、ALE學生適用)_2.pdf" target="_blank" class="list-group-item list-group-item-action">2019志願選填說明書(香港DSE、CEE、ALE學生適用)</a>' +
				'<a href="' + env.baseUrl + '/forms/香港各會考文憑成績核計方式及分數換算對照表.pdf" target="_blank" class="list-group-item list-group-item-action">香港各會考文憑成績核計方式及分數換算對照表</a>\n' +
                '<a href="https://drive.google.com/file/d/1r46gAX82HCFd5j2v_v8xtfa5q3Oy0Frj/view?usp=sharing" target="_blank" class="list-group-item list-group-item-action">放棄聯合分發聲明書（香港專用）</a>\n' +
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

		var loginData = {
			email: email,
			password: sha256(pass),
			google_recaptcha_token: ''
		}

		grecaptcha.ready(function() {
            grecaptcha.execute(env.reCAPTCHA_site_key, {
              action: 'StudentLogin'
            }).then(function(token) {
                // token = document.getElementById('btn-login').value
                loginData.google_recaptcha_token=token;
            }).then(function(){
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
					// console.log(json);
					if( json.student_qualification_verify === null) {
						location.href = './qualify.html';
					} else if( (json.student_qualification_verify.identity=== 6 &&
							json.student_misc_data.join_admission_selection=== 1 &&
							json.student_misc_data.confirmed_at !=null &&
							json.can_admission_placement == true) ||
						(json.student_qualification_verify.identity === 7 &&
							json.student_misc_data.confirmed_at != null &&
							json.student_misc_data.confirmed_placement_at === null)
						||
						(json.student_misc_data.admission_placement_apply_way != null &&
							json.student_misc_data.admission_placement_apply_way_data.code == "23" &&
							json.student_misc_data.confirmed_at != null &&
							json.student_misc_data.confirmed_placement_at === null &&
							json.can_placement_order == true  &&
							json.student_misc_data.stage_of_admit === null &&
							json.student_misc_data.qualification_to_distribute === null &&
							json.student_misc_data.overseas_student_id !== null
						)
						) {
						location.href = './placementSelection.html';
					} else if (!!json.student_misc_data.confirmed_at) {
						location.href = './downloadDocs.html';
					} else if(json.student_qualification_verify.identity=== 6){
						location.href = './personalInfo.html';
					}else {
						location.href = './qualify.html';
					}
					loading.complete();
				})
				.catch((err) => {
					err === 401 && swal({title:`帳號或密碼輸入錯誤。`, confirmButtonText:'確定', type:'error'});
					err === 403 && swal({title:`Google reCaptcha Failed，請稍等五分鐘後再嘗試或寄信到海外聯招會信箱詢問。`, confirmButtonText:'確定', type:'error'});
					err === 429 && swal({title:`登入錯誤次數太多，請稍後再試。`, confirmButtonText:'確定', type:'error'});
					loading.complete();
				})
			});
        });
	}

	function _handleFbLogin() {
		loading.start();
		student.fbLogin()
			.then((res) => {
				if (res.status === 302) {
					return res.json();
				} else {
					throw res.status;
				}
			})
			.then((json) => {
				location.href = json.target[0];

				loading.complete();
			})
			.catch((err) => {
				err === 401 && swal({title:`帳號或密碼輸入錯誤。`, confirmButtonText:'確定', type:'error'});
				err === 429 && swal({title:`登入錯誤次數太多，請稍後再試。`, confirmButtonText:'確定', type:'error'});
				loading.complete();
			})
	}

})();
