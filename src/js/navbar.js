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
	const $printDistribution = $('#btn-printDistribution');
	let currentIdentity = null;

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
		_checkPrintDistribution(json);
	})
	.then(()=>{
		// 以防萬一 物件初始化事件都成功 且擁有身份別後 再讓 完成填報按鈕有點擊事件
		if(currentIdentity !== null){
			// 港澳（具外國國籍之華裔學）生 要線上付款 其他人是原本的完成填報
			if([1,2].indexOf(currentIdentity) > -1){
				$checkBtn.on('click', _checkPay);
			} else {
				$checkBtn.on('click', _checkAllSet);
			}
		}
	})
	.catch((err) => {
		console.error(err);
        if (err.status && err.status === 401) {
            swal({title: `請重新登入`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false})
			.then(()=>{
				location.href = "./index.html";
			});
        } else {
            err.json && err.json().then((data) => {
                console.error(data);
				swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
            })
        }
	});

	/**
	*	bind event
	*/
	$logoutBtn.on('click', _handleLogout);
	$mailResendBtn.on('click', _handleResendMail);
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
			swal({title: `登出成功。`, type:"success", confirmButtonText: '確定', allowOutsideClick: false})
			.then(()=>{
				location.href = "./index.html";
			});
			loading.complete();
		})
		.catch((err) => {
			err.json && err.json().then((data) => {
				console.error(data);
				swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
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
			swal({title: `已寄出驗證信，請至註冊信箱查看。`, type:"success", confirmButtonText: '確定', allowOutsideClick: false});
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
			confirmButtonText: '確認提交',
			cancelButtonText: '取消',
			confirmButtonClass: 'swal-button btn btn-success',
			cancelButtonClass: 'swal-button btn btn-danger',
			buttonsStyling: false,
			reverseButtons: true
		})
		.then( (result)	=>{
			//console.log(result);
			if(result){
				swal({
					title: '確認提交',
					text: "注意：按下確認提交後，上傳的檔案就無法再做任何變更。",
					type: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#5cb85c',
					cancelButtonColor: '#dc3454',
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
		//console.log(data);
		// 資格驗證
		if (!!data.student_qualification_verify) {
			$('.nav-qualify').addClass('list-group-item-success');
			const systemID = data.student_qualification_verify.system_id;
			if (+systemID === 1) {
				$('.nav-educationInfo, .nav-olympia, .nav-grade, .nav-placementSelection').show();
			}
			currentIdentity = data.student_qualification_verify.identity;
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
			$('.nav-olympia').attr("href", '');
		}

		if(data.student_qualification_verify.identity>5){
			$('.nav-qualify').addClass('disabled');
			$('.nav-qualify').click(function(e){e.preventDefault();});
			$('.nav-qualify').attr("href", '');
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
			$('.nav-admissionSelection').addClass('disabled');
			$('.nav-admissionSelection').addClass('show-personal-info-first');
			$('.nav-admissionSelection').attr("href", '');
			$('.nav-admissionSelection').click(function(e){e.preventDefault();});
			$('.nav-result').addClass('disabled');
			$('.nav-result').addClass('show-personal-info-first');
			$('.nav-result').click(function(e){e.preventDefault();});
			$('.nav-result').attr("href", '');
		} else {
			// 學生有填個人資料，但沒有在可報名期間內時，「個人申請志願」出現提示訊息（個人申請已截止）
			if (!data.can_admission_selection) {
				$('.nav-admissionSelection').addClass('disabled');
				$('.nav-admissionSelection').addClass('show-deadline');
				$('.nav-admissionSelection').attr("href", '');
				$('.nav-admissionSelection').click(function(e){e.preventDefault();});
			}
			// 身份別代號是 1 或 2，因為港澳地區改全線上報名，要開上傳簡章規定文件區
			if(data.student_qualification_verify.identity === 1 || data.student_qualification_verify.identity === 2){
				document.getElementById('uploadIdentityVerification').style.display = 'block';
			}
			// 身份別是 海外僑生（3）緬十畢業且非當地大二畢業者不能參加個人申請
			if( data.student_personal_data_detail.school_country == '緬甸'
				&& data.student_qualification_verify.identity === 3
				&& (
					data.student_personal_data_detail.school_type == '緬校（僅緬十畢業）'
					|| data.student_personal_data_detail.school_type == '緬十畢業且在當地大學一年級修業完成'
				)
			){
				$('.nav-admissionSelection').hide();
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
			$('.nav-placementSelection').attr("href", '');
		} else {
			// 學生有填聯合分發採計方式，但沒有在聯合分發期間期間時，「聯合分發志願」出現提示訊息（聯合分發已截止）
			if( data.student_misc_data.admission_placement_apply_way_data.code == '18' ||
				( data.student_qualification_verify.identity === 7 && data.student_misc_data.admission_placement_apply_way_data.code == '22') ){
					if(!data.can_admission_placement){
						$('.nav-placementSelection').addClass('list-group-item-success');
						$('.nav-placementSelection').addClass('disabled');
						$('.nav-placementSelection').click(function(e){e.preventDefault();});
						$('.nav-placementSelection').attr("href", '');
						$('.nav-placementSelection').addClass('show-placement-deadline');
						$('#placement-deadline-text').text('(非開放填寫志願時間)');
					}
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
						$('#placement-deadline-text').text('(非開放填寫志願時間)');
						$('.nav-placementSelection').click(function(e){e.preventDefault();});
						$('.nav-placementSelection').attr("href", '');
					}else if((data.student_misc_data.stage_of_admit != null  ||  data.student_misc_data.qualification_to_distribute != null || data.student_misc_data.overseas_student_id == null)){
						$('.nav-placementSelection').addClass('disabled');
						$('.nav-placementSelection').click(function(e){e.preventDefault();});
						$('.nav-placementSelection').attr("href", '');
						$('.nav-placementSelection').addClass('show-no-qualified');
					}
				} else { //完成填報前 聯合分發志願 sidebar 直接顯示為綠色打勾狀態
					$('.nav-placementSelection').addClass('list-group-item-success');
					$('.nav-placementSelection').addClass('disabled');
					$('.nav-placementSelection').click(function(e){e.preventDefault();});
					$('.nav-placementSelection').attr("href", '');
				}
			}
			else {
				if (!data.can_admission_placement) {
					$('.nav-placementSelection').addClass('disabled');
					$('.nav-placementSelection').addClass('show-placement-deadline');
					$('.nav-placementSelection').click(function(e){e.preventDefault();});
					$('.nav-placementSelection').attr("href", '');
				}
			}

		}

		// 沒有完成提交且不在上傳備審資料的時間，「上傳備審資料」呈現 disabled 樣式
		(!data.can_upload_papers && (data.student_misc_data.admission_selection_document_lock_at == null)) && $('.nav-uploadReviewItems').addClass('disabled') && $('.nav-uploadReviewItems').click(function(e){e.preventDefault();}) && $('.nav-uploadReviewItems').attr("href", '');

		//僑先部個申後填志願同學，在確認鎖定志願之前，不能印報名表件
		if((data.student_qualification_verify.identity === 6 && data.student_misc_data.join_admission_selection === 1 &&
			data.student_misc_data.confirmed_at != null && data.can_admission_placement == true && data.can_admission_selection != true) ||
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
			$('.nav-lalalalalala').attr("href", '');
		}

		if(data.student_misc_data.admission_placement_apply_way_data){  // 如果沒資料就跑裡面會卡住
			// 只有海外僑生學士班在完成填報後並且只有最高學歷完成地在馬來西亞的學生需要上傳簡章規定文件 然後海外臺校的不需要看到
			if(data.student_personal_data_detail.school_country == '馬來西亞'
			&& data.student_personal_data_detail.school_type !== '海外臺灣學校'
			&& !(data.student_personal_data_detail.school_type == '馬來西亞國際學校（International School）' &&data.student_misc_data.admission_placement_apply_way == 1)
			&& data.student_misc_data.confirmed_at != null
			&& data.student_qualification_verify.system_id == 1
			&& data.student_qualification_verify.identity == 3
			){
				// 聯合分發只有部份採計方式需要上傳文憑成績跟簡章規定文件
				const malaysiaNeedUploadTranscriptApplyWay = [22,23,24,25,26,80,83,88];
				if(
					data.student_misc_data.join_admission_selection == 1
					|| malaysiaNeedUploadTranscriptApplyWay.indexOf(data.student_misc_data.admission_placement_apply_way)!=-1
				){
					$('.nav-uploadEducation').show();
				}
				if( malaysiaNeedUploadTranscriptApplyWay.indexOf(data.student_misc_data.admission_placement_apply_way)!=-1){
					$('.nav-uploadMalaysiaTranscript').show();
				}
			}
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
		if (!qualificationVerifyStatus) {
			if (currentPathName != "/qualify.html") {
				swal({title: `請先完成資格檢視。`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=>{
					location.href = "./qualify.html"
				});
			}
		}
	}
	function _checkPay(){
		// 詢問使用者是否要確認資料並前往付款頁面
		swal({
			title: `確認後就「無法再次更改資料」<br/>您真的確認送出嗎？`,
			html:`按下確認後，即將前往付款頁面繳交報名費`,
			type:"question",
			showCancelButton: true,
			confirmButtonText: '確定',
			cancelButtonText: '取消',
			confirmButtonColor: '#5cb85c',
			cancelButtonColor: '#d9534f',
			allowOutsideClick: false,
			reverseButtons: true
		}).then(()=>{
			student.checkOrderListCanCreate()
			.then(function (res) {
				if (res.ok) {
					// 確認可以就直接呼叫我們的API跳轉到綠界的付款頁面
					location.href = env.baseUrl + `/students/application-fee/create`;
				} else {
					throw res;
				}
			})
			.then(function () {
				loading.complete();
			})
			.catch(function (res) {
				loading.complete();
				if(res.status == 401){
					swal({title: "請重新登入", type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
				} else {
					res.json && res.json().then(async (data) => {
						console.error(data);
						await swal({title: `Error: ${data.messages[0]}`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
						if(data.messages[0] === '已經完成付款'){
							window.location.reload();
						}
					})
				}
			});
        }).catch(()=>{
        });
	}

	function _checkAllSet() {
		swal({
			title: '確認後就「無法再次更改資料」，您真的確認送出嗎？',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#5cb85c',
			cancelButtonColor: '#dc3454',
			confirmButtonText: '確定',
			cancelButtonText: '取消',
			reverseButtons: true
		})
		.then( (result)	=>{
			//console.log(result);
			if(result){
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
					// console.log(json);
					swal({title: `成功確認資料。`, text:"如果需要再修改資料請利用「資料修正表」，或是重新申請一組新的帳號。", type:"success", confirmButtonText: '確定', allowOutsideClick: false})
					.then(()=>{
						location.href = "./downloadDocs.html";
					});
					loading.complete();
				})
				.catch((err) => {
					if (err.status && err.status === 401) {
						swal({title: `請重新登入`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false})
						.then(()=>{
							location.href = "./index.html";
						});
					} else {
						err.json && err.json().then((data) => {
							console.error(data);
							swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
						})
					}
					loading.complete();
				});
			} else { //取消
				return;
			}
		});
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
			$checkBtn.removeClass('btn-danger').addClass('btn-success').prop('disabled', true).text('已確認並鎖定填報資料') && $afterConfirmZone.show();
		} else if (!json.student_qualification_verify) {
			// 沒有輸入資格驗證的狀況下，隱藏提交按鈕
			$checkBtn.addClass('hide');
		} else if (json.student_qualification_verify.system_id === 1 && !json.student_department_admission_placement_apply_way) {
			// 學士班，聯合分發成績採計方式未填寫者，確認提交按鈕消失
			$checkBtn.addClass('hide');
		} else if (json.student_qualification_verify.system_id !== 1 && !json.student_personal_data) {
			// 學士班以外其它學制，個人基本資料未填寫者，確認提交按鈕消失
			$checkBtn.addClass('hide');
		} else if (!json.can_admission_selection && !json.can_admission_placement) {
			// 還沒有填報，且不在報名個人申請、聯合分發的期間，不能點送出填報按鈕
			$checkBtn.prop('disabled', true).text('目前不是可報名時間');
		} else if(json.student_order_list_trade_status === "1"){
			// 還沒有填報，但完成繳費的人自動去跳轉頁面讓它鎖定
			location.href = "./ecpayRedirect.html";
		}
	}

	function _checkDocumentLock(json) {
		if(json.student_qualification_verify.system_id != 1 || json.student_misc_data.admission_placement_apply_way == 1){
			$('.admission-doc-identity').hide();
		}
		if (!!json.student_misc_data.admission_selection_document_lock_at) {
			$('#btn-uploadAndSubmit').removeClass('btn-danger').addClass('btn-success').prop('disabled', true).text('已提交上傳資料') && $('.nav-uploadReviewItems').addClass('list-group-item-success') && $afterConfirmZone.show();
			$('#btn-uploadAndSubmit-hint').text('注意：已提交上傳資料，【上傳備審資料】頁面檔案無法再做變更。');
		} else if (json.student_misc_data.join_admission_selection == 0 ){
			// 僅參加聯合分發者不用上傳備審資料也不用提交
			$('#btn-uploadAndSubmit').prop('disabled', true).text('僅參加個人申請者需要');
			$('#btn-uploadAndSubmit').prop('disabled', true).removeClass('btn-danger').addClass('btn-secondary');
			$('.nav-uploadReviewItems').addClass('disabled') && $('.nav-uploadReviewItems').click(function(e){e.preventDefault();}) && $('.nav-uploadReviewItems').attr("href", '');
			$('#btn-uploadAndSubmit-hint').hide();
		} else if(!json.can_upload_papers){
			// 還沒有提交上傳資料，且不在上傳備審資料的期間，不能點提交按鈕
			$('#btn-uploadAndSubmit').prop('disabled', true).text('目前不是可上傳備審資料時間');
			$('#btn-uploadAndSubmit').prop('disabled', true).removeClass('btn-danger').addClass('btn-secondary');
			$('#btn-uploadAndSubmit-hint').hide();
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
		} else if(json.student_misc_data.admission_placement_apply_way_data.code != '05') {
			$macautranscript.hide();
			$macauTranscriptAlert.hide();
		} else if(!json.can_macau_upload_time) { //確認現在時間是否在開放時間內  不是就改變按鈕狀態
			$macautranscript.show().prop('disabled', true).text('非四校聯考成績登錄開放時間');
			$macauTranscriptAlert.show().text('請於四校聯考成績公佈後，5個日曆天內完成登錄及上傳。');
			//$macauTranscriptAlert.hide();
		} else if( json.student_misc_data.overseas_student_id == null) { //確認是否有僑生編號 沒有就請學生等待審核
			$macautranscript.show().prop('disabled', true).text('目前不能登錄上傳四校聯考成績');
			$macauTranscriptAlert.show().text('請先繳交報名表件並等待審核完畢');
		} else {
			// 都不是 就顯示並讓學生可以上傳
			$macautranscript.show();
			$macauTranscriptAlert.show();
		}
	}

	function _checkPrintDistribution(json) {
		$('.btn-noticeForHKMO').hide();
		// 若有地區列印分發通知書限制，再加條件 目前只要是 在台僑港澳生 或是 港澳（具外國國籍之華裔學）生 都改線上下載分發通知書
		if( json.student_misc_data.stage_of_admit != null && json.student_misc_data.stage_of_deptid != null
			&& (
				json.student_qualification_verify.identity < 3
				|| json.student_qualification_verify.identity == 4
				|| json.student_qualification_verify.identity == 5
			)) {
			$printDistribution.show();
			$('#printDistributionAlert').show();
			$printDistribution.on('click', _printDistribution);
			if(json.student_personal_data_detail.resident_location == '澳門'){
				$('.btn-noticeForHKMO').show();
				$('.btn-noticeForHKMO').text('澳門學生入境注意事項');
				let url = '';
				if(json.student_qualification_verify.system_id == 1){
					if(json.student_qualification_verify.identity == 1){
						url = 'https://drive.google.com/file/d/1sSfHILk1XPvhYkj4-AdDG3GoS8mSLKOM/view?usp=sharing';
					} else {
						url = 'https://drive.google.com/file/d/1zZLVppisJI1H9avl1dCAai11QbWDiLqx/view?usp=sharing';
					}
				} else {
					if(json.student_qualification_verify.identity == 1){
						url = 'https://drive.google.com/file/d/1bRkMGVDJ3d2rcHDKSV8GTRVRlCrnWLYZ/view';
					} else {
						url = 'https://drive.google.com/file/d/1Bffoqt0D8_FfETP8kQUlcJxvQDvWTadP/view';
					}
				}
				$('.btn-noticeForHKMO').on('click', function(){window.open(url)});
			}
		} else {
			$printDistribution.hide();
			$('#printDistributionAlert').hide();
		}
	}

	function _printDistribution(){
		window.open(env.baseUrl + '/students/print-distribution', '_blank');
	}

})();
