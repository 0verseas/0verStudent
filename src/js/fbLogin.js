(() => {
	/**
	*	cache DOM
	*/
	const _code = _getParam('code', window.location.href);
	const _state = _getParam('state', window.location.href);
	const _error_code = _getParam('error_code', window.location.href);
	const _error_message = _getParam('error_message', window.location.href);

	/**
	*	init
	*/

	_init();
	
	/**
	*	bind event
	*/


	/**
	*	event handlet
	*/

	async function _init() {
		loading.start();

		if (_error_code && _error_message){
			console.error(_error_code + ' ' + _error_message)
			alert(_error_message);
			location.href = './index.html';
			return;
		}

		const loginData = {
			code: _code,
			state: _state
		};

		student.fbLoginCallback(loginData)
			.then((res) => {
				if (res.ok){
					return res.json();
				} else {
					throw res.status;
				}
			}).then((json) => {
				// console.log(json);
				if(!json.student_misc_data.agree_privacy_policy){
					swal({
						title: '學生個人資料蒐集、處理及利用告知事項',
						html: "請問是否同意「<a href=\'/treaty.html\' target='_blank')>海外聯合招生委員會報名學生個人資料蒐集、處理及利用告知事項</a>」?",
						type: 'warning',
						showCancelButton: true,
						confirmButtonColor: '#3085d6',
						cancelButtonColor: '#d33',
						confirmButtonText: '同意',
						cancelButtonText: '不同意',
						confirmButtonClass: 'btn btn-success',
						cancelButtonClass: 'btn btn-danger',
						buttonsStyling: false
					}).then(()=>{
						_handleRedirect(json)
					}).catch(()=>{
						loading.start();
						alert('即將登出。');
						student.logout()
						.then((res) => {
							if (res.ok) {
								return ;
							} else {
								throw res;
							}
						})
						.then(() => {
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
					});
				} else {
					_handleRedirect(json)
				}
			}).catch((e) => {
				// TODO: get the response messages from api and show user them
				console.error(e);
				if (e === 401) {
					alert('向 Facebook 取得資料時發生錯誤');
				}else if (e === 403){
					alert('無法取得電子信箱地址，請更新 Facebook 註冊資料或改採一般方式註冊！');
				}else{
					alert('發生未預期的錯誤，請稍候再嘗試');
				}
				location.href = './index.html';
			});
		loading.complete();
	}

	function _getParam(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
		const results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	function _handleRedirect(json){
		if( json.student_qualification_verify === null) {
			location.href = './systemChoose.html';
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
			location.href = './systemChoose.html';
		}
	}

})();
