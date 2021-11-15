(() => {
	// 引入 reCAPTCHA 的 JS 檔案
    var s = document.createElement('script');
    let src = 'https://www.google.com/recaptcha/api.js?render=' + env.reCAPTCHA_site_key;
    s.setAttribute('src', src);
    document.body.appendChild(s);

	/**
	*	private variable
	*/
	let _emailValid = false;
	let _passValid = false;
	let _identityValid = false;
	let _passwordComplex = false;  // 密碼複雜度檢查

	/**
	*	cache DOM
	*/
	const $Register = $('.Register');
	const $email = $Register.find('#Register__inputEmail');
	const $password = $Register.find('#Register__inputPassword');
	const $passwordConfirm = $Register.find('#Register__inputPasswordConfirm');
	const $registerBtn = $Register.find('.Register__btnRegister');
	const $passwordWarning = $('#password-warning');
	const $identifyingCanvas = $('#identifyingCanvas');
	const $identifyingCode = $('#Register__identifyingCode');
	const $agreePersonalProtectionLaw = $('#agreePersonalProtectionLaw');
	var identifyingCode = '';

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/
	$email.on('blur', _checkEmail);
	$password.on('blur', _checkPassword);
	$passwordConfirm.on('blur', _checkPassword);
	$identifyingCode.on('blur',_checkIdentifyCode);
	$registerBtn.on('click', _handleSubmit);
	$identifyingCanvas.on('click',generateCode);
	$agreePersonalProtectionLaw.on('change',agreeBoxChange);

	/**
	*	private method
	*/

	function _init() {
		generateCode();
		loading.complete();
	}

	function _checkEmail() {
		const email = $email.val();
		if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
			$email.addClass('invalidInput');
			_emailValid = false;
		} else {
			$email.removeClass('invalidInput');
			_emailValid = true;
		}
	}

	function _checkPassword() {
		const oriPass = $password.val();
		const passConfirm = $passwordConfirm.val();

		// 判斷密碼長度和複雜度
		if (oriPass.length >= 8 && checkPasswordComplex(oriPass)) {
			$password.removeClass('invalidInput');
			$passwordWarning.hide();
			_passValid = true;
			_passwordComplex = true;
		} else {
			$password.addClass('invalidInput');
			$passwordWarning.show();
			_passValid = false;
			_passwordComplex = false
		}

		// 判斷確認密碼長度與以及是否與密碼相同
		if ((passConfirm.length >= 8) && (passConfirm === oriPass)) {
			$passwordConfirm.removeClass('invalidInput');
			_passValid = true;
		} else {
			$passwordConfirm.addClass('invalidInput');
			_passValid = false;
		}
	}

	function _checkIdentifyCode(){
		const code = $identifyingCode.val();

		//確認驗證碼是否一致  不區分大小寫
		if(code.toUpperCase() !== identifyingCode){
			$identifyingCode.addClass('invalidInput');
			_identityValid = false;
		} else{
			$identifyingCode.removeClass('invalidInput');
			_identityValid = true;
		}
	}

	function _handleSubmit() {
		const email = $email.val();
		const oriPass = $password.val();
		const passConfirm = $passwordConfirm.val();

		if(!_identityValid){
			alert('驗證碼不正確');
			return;
		}

		if (!_emailValid) {
			alert('信箱格式錯誤。');
			return;
		}

		if (!_passwordComplex){
			alert('密碼複雜度不足');
			return;
		}

		if (!_passValid) {
			alert('密碼格式錯誤，或「確認密碼」與「密碼」內容不符。');
			return;
		}
		let data = {
			email: email,
			password: sha256(oriPass),
			password_confirmation: sha256(passConfirm),
			google_recaptcha_token: ''
		}
		loading.start();
		grecaptcha.ready(function() {
            grecaptcha.execute(env.reCAPTCHA_site_key, {
              action: 'StudentRegister'
            }).then(function(token) {
                data.google_recaptcha_token=token;
            }).then(function(){
				student.register(data)
				.then((res) => {
					if (res.ok) {
						return res.json();
					} else {
						throw res;
					}
				})
				.then((json) => {
					// console.log(json);
					location.href="./qualify.html";
					loading.complete();
				})
				.catch((err) => {
					if (err.status === 429){  // 註冊太多次啦 Too Many Requests
						err.json && err.json().then((data) => {
							console.error(data);
							alert('註冊次數過多！請稍後再試。');
						})
					} else {
						err.json && err.json().then((data) => {
							console.error(data);
							alert(`ERROR: \n${data.messages[0]}`);
						})
					}
					loading.complete();
				});
			});
        });
	}

	// 是否同意個資法
	function agreeBoxChange() {
		if(!$agreePersonalProtectionLaw[0].checked){  // 沒勾選
			$registerBtn[0].disabled = true;
		} else {
			$registerBtn[0].disabled = false;
		}
	}

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

	// 確認密碼複雜度
	function checkPasswordComplex(input) {
		// 至少8碼且大寫、小寫、數字或特殊符號（數字那一排不含反斜線和豎線）至少兩種
		// ^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*()_+\-=]).{8,}$
		const reg = /^((?=.*\d)(?=.*[A-Z])|(?=.*[a-z])(?=.*[A-Z])|(?=.*\d)(?=.*[a-z])|(?=.*\d)(?=.*[~!@#$%^&*()_+\-=])|(?=.*[a-z])(?=.*[~!@#$%^&*()_+\-=])|(?=.*[A-Z])(?=.*[~!@#$%^&*()_+\-=])).{8,}$/;
		return !!reg.test(input);
	}

})();
