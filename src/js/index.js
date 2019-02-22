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
		serverTime();
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
					json.student_misc_data.confirmed_placement_at === null) ||
				(json.student_misc_data.admission_placement_apply_way != null &&
					json.student_misc_data.admission_placement_apply_way_data.code == "23" &&
					json.student_misc_data.confirmed_at != null &&
					json.student_misc_data.confirmed_placement_at === null &&
					json.can_admission_placement == true) ){
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
		});
	}

	//補零
	function fillZero(i){
		if(i < 10) {
			i = "0" + i;
		}
		return i;
	}

	//聽說是伺服器時間
	function serverTime(){
		var xhr = null;
		if(window.XMLHttpRequest){
			xhr = new window.XMLHttpRequest();
		}else{ // ie
			xhr = new ActiveObject("Microsoft")
		}
		// 通過get的方式請求
		xhr.open("get","/");
		xhr.send(null);
		// 監聽請求狀態變化
		xhr.onreadystatechange = function(){
			var time = null,
				curDate = null;
			if(xhr.readyState===2){
				/**
				 * XMLHttpRequest.readyState值->說明
				 *
				 * 0->XMLHttpRequest請求物件已建立但尚未初始化
				 * 1->已與伺服器連線，準備好傳送一個request但還沒傳送
				 * 2->傳送request至伺服器且伺服器已接收，並可讀取回應的header
				 * 3->請求處理中，正在接收回應（已經接收完header但訊息部份尚未接收完成）
				 * 4->請求載入完成，回應已經被完全接收並就緒
				 * ==以下為失敗狀態==
				 * 200->"OK"
				 * 404->page not found
				 */
				// 抓出回應頭裡的時間戳記
				time = xhr.getResponseHeader("Date");
				console.log(xhr.getAllResponseHeaders());
				curDate = new Date(time);
				document.getElementById("clock").innerHTML = "臺灣當地時間(<strong>UTC+8</strong>)現在是"+curDate.getFullYear()+" / "+(curDate.getMonth()+1)+" / "+curDate.getDate()+"&nbsp;&nbsp;&nbsp;"+fillZero(curDate.getHours())+" : "+fillZero(curDate.getMinutes())/*+" : "+curDate.getSeconds()*/+"<br/><small>(僅供參考，可能因網路延遲等因素產生誤差)</small>";
				timeS(time); //讓前端自己算時間
			}
		}
	}

	//前端自己算＋更新時間
	function timeS(time) {
		var curDate = new Date(time);
		var year = curDate.getFullYear();
		var month = curDate.getMonth()+1; //陣列的月份是以數列的方式表示，只有月份會使用 0~11 的方式顯示
		var day = curDate.getDate();
		var hour = curDate.getHours();
		var min = curDate.getMinutes();
		var sec = curDate.getSeconds();
		setInterval(timeGo,1000); //定時1秒
		function timeGo(){ //as time go by
			sec = sec + 1;
			if(sec == 60){ //在非洲，每60秒就有一分鐘過去
				sec = 0;
				min++;
				if(min == 60){ //靜止的時針，刻下了時間  ──山崎エリイ〈Starlight〉
					min = 0;
					hour++;
					if(hour == 24){ //大學畢業後就很少看到的時刻（活力的一天，從睡覺開始）
						hour = 0;
						day++;
						if(day >= 29){ //孟仲季+春夏秋冬
							if(month == 2){
								/**
								 * 〔格里曆閏年規則〕
								 *
								 * 西元年份除以4不可整除，為平年。
								 * 西元年份除以4可整除，且除以100不可整除，為閏年。
								 * 西元年份除以100可整除，且除以400不可整除，為平年。
								 * 西元年份除以400可整除，為閏年。
								 */
								if((year%4==0 && year%100!=0) || year%400==0){ //閏年 leap year
									if(day == 30){ //閏年的2月有29天
										day = 1;
										month++;
									}
								}else { //平年
									day = 1;
									month++;
								}
							}else if(month==4 || month==6 || month==9 || month==11){ //小月
								if(day == 31){
									day = 1;
									month++;
								}
							}else{ //大月
								if(day == 32){
									day = 1;
									month++;
								}
							}

							if(month == 13){ //一元復始，萬象更新。Happy New Year!
								month = 1;
								year++;
							}
						}
					}
				}
			}
			document.getElementById("clock").innerHTML = "臺灣當地時間(<strong>UTC+8</strong>)現在是"+year+" / "+month+" / "+day+"&nbsp;&nbsp;&nbsp;"+fillZero(hour)+" : "+fillZero(min)+" : "+fillZero(sec)+"<br/><small>(僅供參考，可能因網路延遲等因素產生誤差)</small>";
		}

	}

})();
