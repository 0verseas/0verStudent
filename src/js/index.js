(() => {
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
	const $identifyingCanvas = $('#identifyingCanvas')
	const $identifyingCode = $('#identifyingCode')
	var identifyingCode = '';

	/**
	*	init
	*/

	_init();
	
	/**
	*	bind event
	*/
	$identifyingCanvas.on('click',generateCode);
	$loginBtn.on('click', _handleLogin);
	$fbLoginBtn.on('click', _handleFbLogin);
	// $pass.keyup((e) => { e.keyCode == 13 && _handleLogin(); }); //原本沒驗證碼 所以就密碼輸入欄位判斷是否有按enter的鍵盤事件
	$identifyingCode.keydown((e) => { e.keyCode == 13 && _handleLogin(); }); //驗證碼輸入欄位  判斷是否有按enter的鍵盤事件

	/**
	*	event handlet
	*/

	async function _init() {
		try {
            $downloadLinks.append(
            	// '<a href="' + env.baseUrl + '/forms/2019志願選填說明書(香港DSE、CEE、ALE學生適用)_2.pdf" target="_blank" class="list-group-item list-group-item-action">2019志願選填說明書(香港DSE、CEE、ALE學生適用)</a>' +
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
		generateCode();
		loading.complete();
	}

	function _handleLogin() {
		const email = $email.val();
		const pass = $pass.val();
		const code = $identifyingCode.val();

		//確認驗證碼是否一致  不區分大小寫
		if(code.toUpperCase() !== identifyingCode){
			alert('驗證碼不正確');
			generateCode();
			return;
		}
		generateCode();

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
			if( json.student_qualification_verify === null) {
                location.href = './systemChoose.html';
            } else if(json.student_misc_data.admission_placement_apply_way_data && 
				json.student_misc_data.admission_placement_apply_way_data.stage == 2 &&
				json.student_misc_data.admission_placement_apply_way_data.last_graduated_school_country == '馬來西亞' &&
				json.student_misc_data.overseas_student_id === null){
				// 因應武漢肺炎，馬來西亞第二梯次學生改採線上上傳簡章規定文件
				location.href = './uploadEducation.html';
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
			loading.complete();
		})
		.catch((err) => {
			err === 401 && alert('帳號或密碼輸入錯誤。');
			err === 429 && alert('登入錯誤次數太多，請稍後再試。');
			loading.complete();
		})
	}

	//產生圖形驗證碼
	function generateCode(){

		//隨機產生數字
		function randomNumber(min, max){
			return Math.floor(Math.random()*(max-min)+min);  //隨機產生一個在min~max之間的整數
		}
	
		//隨機顏色色碼
		function randomColor(min, max){
			
			let r = randomNumber(min, max);
			let g = randomNumber(min, max);
			let b = randomNumber(min, max);
	
			return "rgb("+r+","+g+","+b+")";
		}

		//取得畫布物件屬性
		let canvas = document.getElementById('identifyingCanvas');
		let width = canvas.width;
		let height = canvas.height;
		let context = canvas.getContext('2d');

		//基礎設定 設置文本基線在底部  背景顏色  方形繪製
		context.textBaseline = 'bottom';
		context.fillStyle = randomColor(200,240);
		context.fillRect(0,0,width,height);

		//隨機字母表   去除相似的 1 I   0 O   
		let codeList = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

		let codeString = '';

		//雖機產生4個字母
		for(let i = 0; i<4 ; i++){
			let code = codeList[randomNumber(0,codeList.length)];
			codeString += code;

			context.fillStyle = randomColor(50,160);
			context.font = randomNumber(25,30)+ 'px Arial';  //字體大小25~30隨機

			let x = 10+i*25;
			let y = randomNumber(30,35);  //隨機高度
			let angle = randomNumber(-30,30);  //隨機旋轉角度

			context.translate(x,y);  //移動繪製初始位置
			context.rotate(angle*Math.PI/180);  //旋轉繪製初始位置

			context.fillText(code,0,0);

			context.rotate(-angle*Math.PI/180);  //返回繪製初始位置
			context.translate(-x,-y);  //返回繪製初始位置
		}

		//產生干擾線
		for(let i =0;i<2;i++){
			context.strokeStyle = randomColor(40,180);

			context.beginPath();

			context.moveTo( randomNumber(0,width), randomNumber(0,height));

			context.lineTo( randomNumber(0,width), randomNumber(0,height));

			context.stroke();
		}

		//產生干擾點
		for(let i=0 ; i<50 ; i++){
			context.fillStyle = randomColor(0,255);

			context.beginPath();
			
			context.arc( randomNumber(0,width), randomNumber(0,height),1,0,2*Math.PI);

			context.fill();
		}

		//紀錄驗證碼
		identifyingCode = codeString;
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
				err === 401 && alert('帳號或密碼輸入錯誤。');
				err === 429 && alert('登入錯誤次數太多，請稍後再試。');
				loading.complete();
			})
	}

})();
