(() => {

	/**
	*	cache DOM
	*/

	const $memo = $('#memo');
	const $alertPrint = $('.alert-print');
	const $alertCorrect = $('.alert-correct');
	const $alertSubmit = $('.alert-submit');

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	async function _init() {
		try{
			const personalDataResponse = await student.getStudentPersonalData();
			if(!personalDataResponse.ok){
				throw personalDataResponse;
			}
			const personalData = await personalDataResponse.json();

			const registrationDataResponse = await student.getStudentRegistrationProgress();
			if(!registrationDataResponse.ok){
				throw registrationDataResponse;
			}
			const registrationData = await registrationDataResponse.json();

			// 在香港的同學，需要辦理核驗
			if( personalData.student_personal_data.resident_location === '113' && registrationData.student_qualification_verify.identity < 3 ){
				$('#alert-hk-order').show();
				await $alertPrint.html(`「已鎖定並確認填報資料」後，系統將產生申請表供申請人留存，無須繳交。`);
				await $alertCorrect.html(`如需再修改個人基本資料（不含志願），請填寫「<a href="https://www.surveycake.com/s/YDnoK" target="_blank">資料修正表</a>」或是重新註冊新的帳號（惟報名費一經繳交，概不退還）。`);
				await $alertSubmit.html(`身分及學歷證件正本須至指定地點辦理核驗，始完成報名程序。未完備前開程序者，一律不予分發。`);
			} else if(personalData.student_personal_data.resident_location === '127'  && registrationData.student_qualification_verify.identity < 3 ){
				await $alertPrint.html(`「已鎖定並確認填報資料」後，系統將產生申請表供申請人留存，無須繳交。`);
				await $alertCorrect.html(`如需修改個人基本資料（不含志願），請填寫「<a href="${env.baseUrl+'/admission-data-correction-form'}" target="_blank">資料修正表</a>」並連同身分及學歷證件正本於核驗時間繳交至指定地點，或重新註冊帳號（惟報名費一經繳交，概不退還）。`);
				await $alertSubmit.html(`身分及學歷證件正本須至指定地點辦理核驗，始完成報名程序。未完備前開程序者，一律不予分發。`);
			} else{
				await $alertPrint.html(`完成線上填寫個人資料後，請下載、列印並確認表件資料無誤。`);
				await $alertCorrect.html(`若資料有誤(含無法顯示特殊字)，請填寫「<a href="${env.baseUrl+'/admission-data-correction-form'}" target="_blank">資料修正表</a>」並連同申請資料繳交至受理報名單位，始完成報名程序。`);
				await $alertSubmit.html(`請將系統產生文件全數印出，並備齊簡章規定應繳資料於報名截止日前，至受理報名單位繳件。<a href="https://cmn-hant.overseas.ncnu.edu.tw/node/23" target="_blank">報名日期資訊</a>`);
			}

			if (personalData.student_personal_data.resident_location === '127' && registrationData.student_qualification_verify.identity < 3 ) { 
				// 在澳門的港澳生要看到核驗資訊 研究所跟學士班的核驗地點跟開放時間不一樣
				if(registrationData.student_qualification_verify.system_id < 3){
					await $('.alert-macau-verification').show();
					await $('.alert-macau-verification').html(`
						身分及學歷證件核驗資訊：<br/>
						地點：澳門國父紀念館（文第士街 1 號）<br/>
						開放日期：2022 年 11 月 18 日 - 12 月 18 日 <br/>
						開放時間：每週五的 16:00 - 21:00 及 每週六、日的 10:00 - 13:00 與 14:00 - 16:00
					`);
				} else {
					await $('.alert-macau-verification').show();
					await $('.alert-macau-verification').html(`
						身分及學歷證件核驗資訊：<br/>
						地點：台北經濟文化辦事處（澳門辦事處）<br/>
						地址：澳門新口岸宋玉生廣場 411 - 417 號皇朝廣場 5 樓 J - O 座<br/>
						開放日期：2022 年 11 月 3 日至 12 月 15 日<br/>
						開放時間：週一至週五，上午 9 點至 12 點 30 分；下午 2 點至 5 點 30 分
					`);
				}
			}
			
			// Todo: identity 7 印輔班(S5) 8 僑先部春季班(S5)的條件判斷
			// 嘗試重構後  先判斷 是不是僑先部結業生
			if(registrationData.student_qualification_verify.identity === 6) {
				await $memo.html(`<ol class="text-danger"><li>請在簡章規定之期限內列印並繳交至國立臺灣師範大學僑先部教務組。</li></ol>`);
			} else { // 非僑先部結業生
				let listHtml = ``;
				// 有三種情況 1.在台碩博  2.在香港學生 3.其他
				if ( (registrationData.student_qualification_verify.system_id === 3 || registrationData.student_qualification_verify.system_id === 4)
				&& registrationData.student_qualification_verify.identity > 3 && registrationData.student_qualification_verify.identity < 6) {
					listHtml = `<li>請在簡章規定之期限內列印並繳交或郵寄至海外聯合招生委員會。</li>`;
				} else if(registrationData.student_qualification_verify.identity < 3) {
					// 香港的要先預約才能過去辦理 澳門的直接過去就好了的樣子
					if (personalData.student_personal_data.resident_location === '127'){
						listHtml = `<li>請依開放時間至指定地點辦理「身分及學歷證件正本」核驗。</li>`;
					} else {
						listHtml = `<li>請依預約時間至指定地點辦理「身分及學歷證件正本」核驗。</li>`;
					}
				} else {
					listHtml = `<li>請在簡章規定之期限內列印並繳交至受理報名單位。</li>`;
				}
				// 在個人申請時間內只有deadline有差別，分兩種情況：1.港二技學生  2.其他 
				if(registrationData.can_admission_selection){
					let deadlineString = '';
					let weekString = ['日','一','二','三','四','五','六'];
					if(registrationData.student_qualification_verify.system_id === 2){
						let dayNumber = new Date(env.year+'/03/31').getDay();
						deadlineString = `西元 ${env.year} 年 3 月 31 日（星期${weekString[dayNumber]}）`;
					} else {
						let dayNumber = new Date(env.year+'/01/06').getDay();
						deadlineString = `西元 ${env.year} 年 1 月 6 日（星期${weekString[dayNumber]}）`;
					}
					listHtml += `<li>報名「個人申請」者，務必於${deadlineString}臺灣時間下午 5 時前完成備審資料上傳作業，按下『確認上傳資料並提交』。逾時系統即關閉上傳功能，請預留資料上傳時間，以免上傳失敗。</li>`;
					listHtml += `<li>所填志願校系之「必繳」項目皆須上傳檔案，於系統按下「確認上傳資料並提交」按鍵後，始能成功提交。</li>`;
					listHtml += `<li>如欲放棄上傳部分志願校系審查資料時，可於該志願上傳頁面點選「放棄上傳審查資料」按鍵，惟申請人一旦於系統完成「放棄上傳審查資料」作業並確認提交後，一律不得以任何理由要求撤回或修改，請審慎考量。</li>`;
				}
				// 非個人申請時間只有一行所以用 ul 個人申請時間內用 ol
				if(registrationData.can_admission_selection){
					await $memo.html(`<ol class="text-danger">`+listHtml+`</ol>`);
				} else {
					await $memo.html(`<ul class="text-danger">`+listHtml+`</ul>`);
				}
			}

			await $('#btn-smart').attr('href', env.baseUrl + '/students/print-admission-paper');
		} catch(errorRespone){
			if (errorRespone.status && errorRespone.status === 401) {
				await swal({title: `請重新登入`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false})
				location.href = "./index.html";
			} else {
				const data = await errorRespone.json();
				await swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
			}
		}
		await loading.complete();
	}
})();
