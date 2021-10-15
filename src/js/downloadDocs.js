(() => {

	/**
	*	cache DOM
	*/

	const $memo = $('#memo');
	const $alertPrint = $('.alert-print');
	const $alertCorrect = $('.alert-correct');
	const $alertSubmit = $('.alert-submit');

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
						//在香港的同學，繳件需要跟海華預約
						if( personalData.resident_location === '113' && data.student_qualification_verify.identity < 3 ){
							$('#alert-hk-order').show();
							$alertPrint.html(`「已鎖定並確認填報資料」後，系統將產生申請表供申請人留存，無須繳交。`);
							$alertCorrect.html(`如需再修改個人基本資料（不含志願），請填寫「資料修正表」或是重新註冊新的帳號（惟報名費一經繳交，概不退還）。`);
							$alertSubmit.html(`身分及學歷證件正本須至指定地點辦理核驗，始完成報名程序。未完備前開程序者，一律不予分發。`);
						} else{
							$alertPrint.html(`完成線上填寫個人資料後，請下載、列印並確認表件資料無誤。`);
							$alertCorrect.html(`若資料有誤(含無法顯示特殊字)，請填寫「<a href="" target="_blank">資料修正表</a>」並連同申請資料繳交至受理報名單位，始完成報名程序。`);
							$alertSubmit.html(`請將系統產生文件全數印出，並備齊簡章規定應繳資料於報名截止日前，至受理報名單位繳件。<a href="" target="_blank">報名日期資訊</a>`);
						}

						if ((data.student_qualification_verify.system_id === 1 || data.student_qualification_verify.system_id === 2)
							&& (data.student_misc_data.admission_placement_apply_way === 6 || data.student_misc_data.admission_placement_apply_way === 16)) { // 參加澳門學科測驗
							$('#alert-cost').show();
							$('.alert-downloadMoFile').show();
						}
						
						//Todo: identity 7 印輔班(S5) 8 僑先部春季班(S5)的條件判斷
						//嘗試重構後  先判斷 是不是僑先部結業生
						if(data.student_qualification_verify.identity === 6) {
							$memo.html("請在簡章規定之期限內列印並繳交至國立臺灣師範大學僑先部教務組。");
						} else { //不是就先判斷是否在個人申請時間內
							if(!data.can_admission_selection){ //非個人申請時間內有兩種情況 1. 在台碩博  2. 其他
								if ( (data.student_qualification_verify.system_id === 3 || data.student_qualification_verify.system_id === 4) &&
								data.student_qualification_verify.identity > 3 && data.student_qualification_verify.identity < 6) {
									$memo.html("請在簡章規定之期限內列印並繳交或郵寄至海外聯合招生委員會。<br />");
								} else if( personalData.resident_location === '113' && data.student_qualification_verify.identity < 3 ) {
									$memo.html("請依預約時間至指定地點辦理「身分及學歷證件正本」核驗。<br />");
								} else {
									$memo.html("請在簡章規定之期限內列印並繳交至受理報名單位。<br />");
								}
							} else { //在個人申請時間內有三種情況  1.在台碩博  2.港二技  3.其他
								if ( (data.student_qualification_verify.system_id === 3 || data.student_qualification_verify.system_id === 4) &&
								data.student_qualification_verify.identity > 3 && data.student_qualification_verify.identity < 6) {
									$memo.html("1、 請在簡章規定之期限內列印並繳交或郵寄至海外聯合招生委員會（54561 南投縣埔里鎮大學路1號）。<br />"+
									`2、 請務必於西元 ${env.year} 年 1 月 6 日（星期三）臺灣時間下午 5 時前完成備審資料上傳作業，<br />` +
									"按下『確認上傳資料並提交』。");
								} else if( personalData.resident_location === '113' && data.student_qualification_verify.identity < 3 ) {
									let memoHtml = `1、 請依預約時間至指定地點辦理「身分及學歷證件正本」核驗。<br />`;
									if(data.student_qualification_verify.system_id === 2){
										memoHtml += `2、 報名「個人申請」者，務必於西元 ${env.year} 年 3 月 20 日（星期六）臺灣時間下午 5 時前完成備審資料上傳作業，按下『確認上傳資料並提交』。逾時系統即關閉上傳功能，請預留資料上傳時間，以免上傳失敗。<br />`;
									} else {
										memoHtml += `2、 報名「個人申請」者，務必於西元 ${env.year} 年 1 月 6 日（星期四）臺灣時間下午 5 時前完成備審資料上傳作業，按下『確認上傳資料並提交』。逾時系統即關閉上傳功能，請預留資料上傳時間，以免上傳失敗。<br />`;
									}
									memoHtml += `3、 所填志願校系之「必繳」項目皆須上傳檔案，於系統按下「確認上傳資料並提交」按鍵後，始能成功提交。<br />`;
									memoHtml += `4、 如欲放棄上傳部分志願校系審查資料時，可於該志願上傳頁面點選「放棄上傳審查資料」按鍵，惟申請人一旦於系統完成「放棄上傳審查資料」作業並確認提交後，一律不得以任何理由要求撤回或修改，請審慎考量。`;
									$memo.html(memoHtml);
								} else {
									$memo.html("1、 請在簡章規定之期限內列印並繳交至受理報名單位。<br />"+
									`2、 報名「個人申請」者，務必於西元 ${env.year} 年 1 月 6 日（星期四）臺灣時間下午 5 時前完成備審資料上傳作業，<br />` +
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
