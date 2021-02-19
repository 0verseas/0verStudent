(() => {
	/**
	*	cache DOM
	*/
	const _code = _getParam('code', window.location.href);
	const _state = _getParam('state', window.location.href);

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
		student.fbLoginCallback(_code,_state)
			.then((res) => {
				if (res.ok){
					return res.json();
				} else {
					throw res.status;
				}
			}).then((json) => {
				// console.log(json);
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
			}).catch((e) => {
				// TODO: get the response messages from api and show user them
				console.error(e);
				e === 401 ? alert('向 Facebook 取得資料時發生錯誤') : alert('發生未預期的錯誤，請稍候再嘗試');
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

})();
