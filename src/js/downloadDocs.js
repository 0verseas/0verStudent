(() => {

	/**
	*	cache DOM
	*/

	const $memo = $('#memo');

	let personalData='';

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	async function _init() {
		student.getStudentPersonalData()
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((data1) => {
				personalData=data1.student_personal_data;
				student.getStudentRegistrationProgress()
					.then((res) => {
						if (res.ok) {
							return res.json();
						} else {
							throw res;
						}
					})
					.then((data) => {
						if(data.student_misc_data.admission_placement_apply_way_data != null) {
							if( personalData.resident_location === '113' && data.student_qualification_verify.identity < 3 ){
								$('#alert-hk-order').show();
							}
						}

						if ((data.student_qualification_verify.system_id === 1 || data.student_qualification_verify.system_id === 2)
							&& (data.student_misc_data.admission_placement_apply_way === 6 || data.student_misc_data.admission_placement_apply_way === 16)) { // 參加澳門學科測驗
							$('#alert-cost').show();
							$('.alert-downloadMoFile').show();
						}
						
						//Todo: identity 7 印輔班(S5) 8 僑先部春季班(S5)的條件判斷
						//嘗試重構後  先判斷 是不是僑先部結業生
						if(data.student_qualification_verify.identity === 6) {
							$memo.html("請在簡章規定之期限內列印並繳交至國立台灣師範大學僑先部教務組。");
						} else { //不是就先判斷是否在個人申請時間內
							if(!data.can_admission_selection){ //非個人申請時間內有兩種情況 1. 在台碩博  2. 其他
								if ( (data.student_qualification_verify.system_id === 3 || data.student_qualification_verify.system_id === 4) &&
								data.student_qualification_verify.identity > 3 && data.student_qualification_verify.identity < 6) {
									$memo.html("請在簡章規定之期限內列印並繳交或郵寄至海外聯合招生委員會。<br />");
								} else {
									$memo.html("請在簡章規定之期限內列印並繳交至受理報名單位。<br />");
								}
							} else { //在個人申請時間內有三種情況  1.在台碩博  2.港二技  3.其他
								if ( (data.student_qualification_verify.system_id === 3 || data.student_qualification_verify.system_id === 4) &&
								data.student_qualification_verify.identity > 3 && data.student_qualification_verify.identity < 6) {
									$memo.html("1、 請在簡章規定之期限內列印並繳交或郵寄至海外聯合招生委員會。<br />"+
									"2、 報名「個人申請」者，務必於西元 2021 年 1 月 6 日（星期三）臺灣時間下午 5 時前完成備審資料上傳作業，<br />" +
									"按下『確認上傳資料並提交』。");
								} else if (data.student_qualification_verify.system_id === 2) {
									$memo.html("1、 請在簡章規定之期限內列印並繳交至受理報名單位。<br />" +
									"2、 報名「港二技」者，務必於西元 2021 年 3 月 20 日（星期六）臺灣時間下午 5 時前完成備審資料上傳作業，<br />" +
									"按下『確認上傳資料並提交』。");
								} else {
									$memo.html("1、 請在簡章規定之期限內列印並繳交至受理報名單位。<br />"+
									"2、 報名「個人申請」者，務必於西元 2021 年 1 月 6 日（星期三）臺灣時間下午 5 時前完成備審資料上傳作業，<br />" +
									"按下『確認上傳資料並提交』。");
								}
							}
						}
					})
					.then(() => {
						$('#btn-smart').attr('href', env.baseUrl + '/students/print-admission-paper');
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

			});


	}

})();
