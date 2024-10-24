(() => {

	/**
	*	cache DOM
	*/

	const $applyWaysFieldSet = $('#certificate-of-language-proficiency'); // 選擇證明文件類型欄
	const option_description_1_result = $('#description-1-result'); // TOCFL-總成績
	const option_description_1_level = $('#description-1-level'); // TOCFL-證書等級/CEFR等級
	const option_description_3 = $('#description-3'); // 會考類型/名稱
	const option_description_5 = $('#description-5');  // 其他證明文件類型/名稱
	const description_of_certificate = $('.descriptionOfCertificate');
	const description_title = $('#description-title'); // 說明欄標題
	const note = $('#note'); // 說明欄備注

	/**
	*	init
	*/

	_init();

	/**
	*	bind event
	*/

	$applyWaysFieldSet.on('change.chooseOption', '.radio-option', _handleChoose); // 選擇事件
	$('.btn-save').on('click', _handleSave); // 儲存事件

	/**
	* event handler
	*/

	// 選擇類型事件
	function _handleChoose() {
		const option = $('.radio-option:checked').val(); // 選擇的證明文件類型

		// 判斷選擇的選項是否要出現相關的說明欄和項目
		if (+option == 1 || +option == 5 || +option == 3) {
			description_of_certificate.fadeIn();
			if (+option == 1) {
				option_description_1_result.fadeIn();
				option_description_1_level.fadeIn();
				option_description_3.hide();
				option_description_5.hide();
			} else if (+option == 3) {
				option_description_1_result.hide();
				option_description_1_level.hide();
				option_description_3.fadeIn();
				option_description_5.hide();
			} else {
				option_description_1_result.hide();
				option_description_1_level.hide();
				option_description_3.hide();
				option_description_5.fadeIn();
			}
		} else {
			description_of_certificate.hide();
		}

		// 判斷說明欄的標題和備注根據選擇的證明文件類型來顯示
		note.hide();
		switch (+option) {
			case 1:
				description_title.text("請填寫「測驗總成績」和「證書等級/CEFR等級」");
				break;
			case 3:
				description_title.text("請填寫「會考」的類型/名稱");
				note.fadeIn();
				break;
			case 5:
				description_title.text("請填寫「所繳證明文件」的類型/名稱");
				break;
		}
	}


	// 儲存文件類型和說明事件
	async function _handleSave() {
		const option = $('.radio-option:checked').val(); // 選擇的證明文件類型

		let data = {
			certification_of_chinese_option: option
		};

		// 判斷是否有選擇證明文件類型
		if (!option) {
			swal({title: `請選擇您檢附的文件`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
			return;
		} else {
			// 檢查是否有根據選擇的證明文件類型來填寫類型說明
			switch(+option) {
				case 1:
					if (!option_description_1_result.val() || !option_description_1_level.val()) {
						swal({title: `請填寫<br />「測驗總成績」<br />和<br />「證書等級/CEFR等級」`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
						return;
					}
					data.certification_of_chinese_option_description_result = option_description_1_result.val()
					data.certification_of_chinese_option_description_level = option_description_1_level.val()
					break;
				case 3:
					if (!option_description_3.val()) {
						swal({title: `請填寫「會考」的類型/名稱`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
						return;
					}
					data.certification_of_chinese_option_description = option_description_3.val()
					break;
				case 5:
					if (!option_description_5.val()) {
						swal({title: `請填寫<br />「所繳證明文件」的類型/名稱`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
						return;
					}
					data.certification_of_chinese_option_description = option_description_5.val()
					break;
			}
		}

		loading.start();

		// 準備給後端資料
		student.setStudentCertificationOfChineseOption(data).then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then(async () => {
			await swal({title: `儲存成功`, type:"success", confirmButtonText: '確定', allowOutsideClick: false});
			location.href = "./result.html"
			loading.complete();
		})
		.catch((err) => {
			if (err.status && err.status === 401) {
				swal({title: `請重新登入`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=>{
					location.href = "./index.html";
				});
			}
			err.json && err.json().then((data) => {
				console.error(data.messages[0]);
				swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
			});
			loading.complete();
		});
	}

	// 渲染
	function _init() {
		// 取得選擇的選項
		student.getStudentCertificationOfChineseOption()
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			const option_value = json.certification_of_chinese_option ? json.certification_of_chinese_option : null; // 取已存的證明文件類型
			const description = json.certification_of_chinese_option_description ? json.certification_of_chinese_option_description : null; // 取已存的證明文件類型的說明
			// 渲染對應的選擇證明文件類型和類型說明
			!!option_value && $(`.radio-option[value=${option_value}]`).trigger('click');
			if (+option_value == 1) {
				const splitDescription = description.split(';');
				const result = splitDescription[0];
				const level = splitDescription[1];
				option_description_1_result.val(result || '');
				option_description_1_level.val(level || '');
			} else if (+option_value == 3) {
				option_description_3.val(description || '');
			} else {
				option_description_5.val(description || '');
			}
			loading.complete();
		})
		.catch((err) => {
			if (err.status && err.status === 401) {
				swal({title: `請重新登入`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false})
				.then(()=>{
					location.href = "./index.html";
				});
			} else if (err.status && err.status === 403) {
				err.json && err.json().then((data) => {
					swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false})
					.then(()=>{
						if(window.history.length>1){
							window.history.back();
						} else {
							location.href = "./personalInfo.html";
						}
					});
				})
			} else {
				err.json && err.json().then((data) => {
					console.error(data);
					swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
				})
			}
			loading.complete();
		});
	}
})();
