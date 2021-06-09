(() => {

	/**
	*	cache DOM
	*/
	const $logoutBtn = $('#btn-logout');
	const $mailResendBtn = $('#btn-mailResend');
	const $checkBtn = $('#btn-all-set');
	const $afterConfirmZone = $('#afterConfirmZone');
	const $uploadAndSubmit = $('#btn-uploadAndSubmit');
	const $macautranscript = $('#btn-uploadMacauTranscript');
	const $macauTranscriptAlert = $('#macauTranscriptAlert');

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
		!!json.student_misc_data || location.replace('./');
		_setGreet(json.name || json.email, json.student_misc_data.overseas_student_id);
		_setEmailVerifyAlert(json.student_misc_data);
		_setProgress(json);
		_setHeader(json);
		_checkQualificationVerify(window.location.pathname, json.student_qualification_verify);
		_checkConfirm(json);
		_checkDocumentLock(json);
		_checkMacauTranscrip(json);
	})
	.catch((err) => {
		console.error(err);
        if (err.status && err.status === 401) {
            alert('請登入。');
            location.href = "./index.html";
        } else {
            err.json && err.json().then((data) => {
                console.error(data);
                alert(`ERROR: \n${data.messages[0]}`);
            })
        }
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
			title: '提交確認',
			html: "如您有志願校系要求繳交【師長推薦函】，請務必至各志願【上傳備審項目頁面】檢查邀請之師長是否完成上傳。提醒您，若點選【確認上傳資料並提交】後，<span style='color : #FF0000'>師長將無法為您上傳推薦信。</span>",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: '確認提交',
			cancelButtonText: '取消',
			confirmButtonClass: 'btn btn-success',
			cancelButtonClass: 'btn btn-danger',
			buttonsStyling: false
		})
		.then( (result)	=>{
			//console.log(result);
			if(result){
				swal({
					title: '確認提交',
					text: "注意：按下確認提交後，上傳的檔案就無法再做任何變更。",
					type: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: '確認提交',
					cancelButtonText: '取消',
				})
				.then(function () {
					loading.start();
					student.uploadAndSubmit().then((res) => {
						if (res.ok) {
							return res.json();
						} else {
							throw res;
						}
					})
					.then((data) => {
						swal({
							title: '<i>提交成功！</i>',
							type: 'success',
						})
						/*
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
						*/
						.then(() => { loading.complete(); location.href = './uploadReviewItems.html' });
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
		}})
		.catch(swal.noop)
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

		if(!data.can_olympia){
			$('.olympia-deadline').show();
			$('.nav-olympia').addClass('disabled');
			$('.nav-olympia').click(function(e){e.preventDefault();});
		}

		// 上傳學歷證件
		!!data.student_education_document && $('.nav-uploadEducation').addClass('list-group-item-success');
		const malaysiaStage2ApplyWayId = [22, 23, 25, 26, 28, 29, 30, 31, 80, 83, 88];  // 馬來西亞第二或第五梯次聯合分發 apply way id
		// 目前僅馬來西亞第二梯次聯合分發需要
		if (!data.student_department_admission_placement_apply_way ||
			malaysiaStage2ApplyWayId.indexOf(data.student_misc_data.admission_placement_apply_way_data.id) == -1){
			$('.nav-uploadEducation').hide();  // 不是馬來西亞第二梯次聯合分發的學生就隱藏
		} 
		//不在報名期間不能上傳學歷證件
		if(!data.can_admission_placement){
			$('.nav-uploadEducation').hide();
		}
		//若是有僑編就是收件完成 就讓上傳簡章規定文件變綠色完成狀態
		if(data.student_misc_data.overseas_student_id !== null){
			$('.nav-uploadEducation').addClass('list-group-item-success');
		}
		if(data.student_qualification_verify.identity>5){
			$('.nav-systemChoose').addClass('disabled');
			$('.nav-systemChoose').click(function(e){e.preventDefault();});
			$('.overseas-student-tip').show();
		}

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

		if (!data.student_personal_data) {
			// 學生沒有填個人資料時，「個人申請志願」出現提示訊息（請先填寫個人基本資料）
			$('.nav-uploadEducation').addClass('disabled');
			$('.nav-uploadEducation').addClass('show-personal-info-first');
			$('.nav-uploadEducation').click(function(e){e.preventDefault();});

			$('.nav-admissionSelection').addClass('disabled');
			$('.nav-admissionSelection').addClass('show-personal-info-first');
			$('.nav-admissionSelection').click(function(e){e.preventDefault();});
			$('.nav-result').addClass('disabled');
			$('.nav-result').addClass('show-personal-info-first');
			$('.nav-result').click(function(e){e.preventDefault();});
		} else {
			// 學生有填個人資料，但沒有在可報名期間內時，「個人申請志願」出現提示訊息（個人申請已截止）
			if (!data.can_admission_selection) {				
				$('.nav-admissionSelection').addClass('disabled');
				$('.nav-admissionSelection').addClass('show-deadline');
				$('.nav-admissionSelection').click(function(e){e.preventDefault();});
			}
		}

		// 聯合分發成績採計方式
		!!data.student_department_admission_placement_apply_way && $('.nav-grade').addClass('list-group-item-success');

		// 聯合分發志願
		!!data.student_department_admission_placement_order && $('.nav-placementSelection').addClass('list-group-item-success');

		if (!data.student_department_admission_placement_apply_way) {
			// 學生沒有填聯合分發採計方式時，「聯合分發志願」出現提示訊息（請先選擇聯合分發採計方式）
			$('.nav-placementSelection').addClass('disabled');
			$('.nav-placementSelection').addClass('show-grade-first');
			$('.nav-placementSelection').click(function(e){e.preventDefault();});
		} else {
			// 學生有填聯合分發採計方式，但沒有在聯合分發期間期間時，「聯合分發志願」出現提示訊息（聯合分發已截止）
			if( data.student_misc_data.admission_placement_apply_way_data.code == '18' ||
				( data.student_qualification_verify.identity === 7 && data.student_misc_data.admission_placement_apply_way_data.code == '22') ){
				;
			}else if(data.student_misc_data.admission_placement_apply_way_data.code == '23'){
				//如果是DSE後填要confirmed_placement_at 有值才算完成聯合分發志願填寫
				if(data.student_misc_data.confirmed_placement_at ==null && !!data.student_department_admission_placement_order){
					data.student_department_admission_placement_order && $('.nav-placementSelection').removeClass('list-group-item-success');
				}				
				//如果是DSE後填要confirmed_at 有值 才判斷是否在（開放時間）或（有收件或已穫錄取）
				if(data.student_misc_data.confirmed_at != null ){
					if(!data.can_admission_placement){
						$('.nav-placementSelection').addClass('list-group-item-success');
						$('.nav-placementSelection').addClass('disabled');
						$('.nav-placementSelection').addClass('show-placement-deadline');
						$('#placement-deadline-text').text('(目前為報名階段，無須填寫志願)');
						$('.nav-placementSelection').click(function(e){e.preventDefault();});
					}else if((data.student_misc_data.stage_of_admit != null  ||  data.student_misc_data.qualification_to_distribute != null || data.student_misc_data.overseas_student_id == null)){
						$('.nav-placementSelection').addClass('disabled');
						$('.nav-placementSelection').click(function(e){e.preventDefault();});
						$('.nav-placementSelection').addClass('show-no-qualified');
					}
				} else { //完成填報前 聯合分發志願 sidebar 直接顯示為綠色打勾狀態
					$('.nav-placementSelection').addClass('list-group-item-success');
				}
			}
			else {
				if (!data.can_admission_placement) {
					$('.nav-placementSelection').addClass('disabled');
					$('.nav-placementSelection').addClass('show-placement-deadline');
					$('.nav-placementSelection').click(function(e){e.preventDefault();});
				}
			}

		}

		// 不在上傳備審資料的時間，「上傳備審資料」呈現 disabled 樣式
		!data.can_upload_papers && $('.nav-uploadReviewItems').addClass('disabled') && $('.nav-uploadReviewItems').click(function(e){e.preventDefault();});

		//僑先部個申後填志願同學，在確認鎖定志願之前，不能印報名表件
		if((data.student_qualification_verify.identity === 6 && data.student_misc_data.join_admission_selection === 1 &&
			data.student_misc_data.confirmed_at != null && data.can_admission_placement == true) ||
            (data.student_qualification_verify.identity === 7 &&
            data.student_misc_data.confirmed_at != null &&
            data.student_misc_data.confirmed_placement_at === null)
			// ||
			// (data.student_misc_data.admission_placement_apply_way != null &&
			// data.student_misc_data.admission_placement_apply_way_data.code == "23" &&
			// data.student_misc_data.confirmed_at != null &&
			// data.student_misc_data.confirmed_placement_at === null &&
			// data.can_admission_placement == true)
			){
			$('.nav-lalalalalala').addClass('disabled');
			$('.nav-lalalalalala').addClass('show-deadline');
			$('.nav-lalalalalala').click(function(e){e.preventDefault();});
		}

		// 澳門上傳四校聯考成績單  採計方式代碼代訂
		//
		if(data.student_misc_data.admission_placement_apply_way_data){  // 如果沒資料就跑裡面會卡住
			if( data.student_misc_data.admission_placement_apply_way_data.code == '05' &&
				data.student_misc_data.overseas_student_id != null ){
				$macautranscript.show();
				$macauTranscriptAlert.show();
			}
			// 完成填報後且在報名時間並只有符合馬來西亞需上傳並登記文憑成績的 apply_way 選單才會顯示選項
			const malaysiaNeedUploadTranscriptApplyWay = [22,23,/*24,*/25,26,28,83,88];
			if(malaysiaNeedUploadTranscriptApplyWay.indexOf(data.student_misc_data.admission_placement_apply_way)!=1
			&& data.student_misc_data.confirmed_at != null
			&& env.malaysiaCanUploadList.indexOf(data.id) != -1 //今年（2021）直接用user_id當作過濾條件，請記得去env.js設定變數 **臨時功能**
			// && data.can_admission_placement
			){
				$('#btn-uploadMalaysiaTranscript').show();
			}
		}

		// 報名序號不在名單內且當前頁面是上傳登記成績頁面時自動跳轉 **臨時功能**
		if(env.malaysiaCanUploadList.indexOf(data.id) == -1 
		&& location.pathname == '/uploadMalaysiaTranscript.html'){
			location.href="./downloadDocs.html";
		}
	}

	function _setHeader(data) {
		const systemMap = ['學士班', '港二技', '碩士班', '博士班'];
		const identityMap = ['港澳生', '港澳具外國國籍之華裔學生', '海外僑生', '在臺港澳生', '在臺僑生', '僑先部結業生', '印輔班結業生'];
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
				alert("請先完成資格檢視");
				location.href = "./systemChoose.html"
			}
		}
	}

	function _checkAllSet() {
		var isAllSet = confirm("確認後就「無法再次更改資料」，您真的確認送出嗎？");
		if (isAllSet === true) {
			const data = {
				"confirmed": true
			};
			student.dataConfirmation(data)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
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
	
	function _setGreet(name, overseas_student_id) {
		if (overseas_student_id !== null) {
            $('.greet').text(`歡迎 ${name} 登入！您的僑生編號為 ${overseas_student_id} `)
        } else {
            $('.greet').text(`歡迎 ${name} 登入！`)
		}
	}

	function  _checkConfirm(json) {
		if (!!json.student_misc_data.confirmed_at) {
			$('#btn-all-set').removeClass('btn-danger').addClass('btn-success').prop('disabled', true).text('已填報') && $afterConfirmZone.show();
		} else if (!json.student_qualification_verify) {
			// 沒有輸入資格驗證的狀況下，隱藏提交按鈕
			$('#btn-all-set').addClass('hide');
		} else if (json.student_qualification_verify.system_id === 1 && !json.student_department_admission_placement_apply_way) {
			// 學士班，聯合分發成績採計方式未填寫者，確認提交按鈕消失
			$('#btn-all-set').addClass('hide');
		} else if (json.student_qualification_verify.system_id !== 1 && !json.student_personal_data) {
			// 學士班以外其它學制，個人基本資料未填寫者，確認提交按鈕消失
			$('#btn-all-set').addClass('hide');
		} else if (!json.can_admission_selection && !json.can_admission_placement) {
			// 還沒有填報，且不在報名個人申請、聯合分發的期間，不能點送出填報按鈕
			$('#btn-all-set').prop('disabled', true).text('目前不是可報名時間');
		}
	}

	function _checkDocumentLock(json) {
		if(json.student_qualification_verify.system_id != 1 || json.student_misc_data.admission_placement_apply_way == 1){
			$('.admission-doc-identity').hide();
		}
		if (!!json.student_misc_data.admission_selection_document_lock_at) {
			$('#btn-uploadAndSubmit').removeClass('btn-danger').addClass('btn-success').prop('disabled', true).text('已提交上傳資料') && $('.nav-uploadReviewItems').addClass('list-group-item-success') && $afterConfirmZone.show();
		} else if (!json.can_upload_papers || json.student_misc_data.join_admission_selection == 0 ){
			// 還沒有提交上傳資料，且不在上傳備審資料的期間，不能點提交按鈕
			$('#btn-uploadAndSubmit').prop('disabled', true).text('目前不是可上傳備審資料時間');
			$('#btn-uploadAndSubmit').prop('disabled', true).removeClass('btn-danger').addClass('btn-secondary');
			$('#btn-uploadAndSubmit-hint').removeClass('text-danger').addClass('text-secondary');
		}

		if (json.student_misc_data.join_admission_selection == 2) {
            $('#btn-uploadAndSubmit').hide();
            $('#btn-uploadAndSubmit-hint').hide();
            $('.nav-uploadReviewItems').hide();
		}
	}

	function _checkMacauTranscrip(json){
		/* 聯合分發成績採計方式不為參加學科測驗，並登錄及上傳四校聯考成績者 隱藏按鈕 */
		if(json.student_misc_data.admission_placement_apply_way_data == null || json.student_misc_data.confirmed_at == null ){
			$macautranscript.hide();
			$macauTranscriptAlert.hide();
		}else if(json.student_misc_data.admission_placement_apply_way_data.code != '05'){
			$macautranscript.hide();
			$macauTranscriptAlert.hide();
		}else if(!json.can_macau_upload_time){ //確認現在時間是否在開放時間內  不是就改變按鈕狀態
			$macautranscript.show().prop('disabled', true).text('非四校聯考成績登錄開放時間');
			$macauTranscriptAlert.show().text('請於四校聯考成績公佈後，5個日曆天內完成登錄及上傳。');
			//$macauTranscriptAlert.hide();
		}else if( json.student_misc_data.overseas_student_id == null){ //確認是否有僑生編號 沒有就請學生等待審核
			$macautranscript.show().prop('disabled', true).text('目前不能登錄上傳四校聯考成績');
			$macauTranscriptAlert.show().text('請先繳交報名表件並等待審核完畢');
		}
	}

})();
