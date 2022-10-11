(() => {

	/**
	*	cache DOM
	*/

	const $applyWaysFieldSet = $('#apply-ways');
	const $goToFF = $('#go-to-FF');  // 「可以被分發去僑先部」的核取方塊
	
	/**
	*	init
	*/
	_init();

	/**
	*	bind event
	*/

	$applyWaysFieldSet.on('change.chooseOption', '.radio-option', _handleChoose);
	$('.btn-save').on('click', _handleSave);
	$goToFF.on('change',toFFChange);
	$('.DSE-example').html(`請填寫<strong>西元年份</strong>，若多個請用「，」隔開。<br/>EX1：${env.year} <br/>EX2：2013, 2014`);

	/**
	* event handler
	*/

	function _handleChoose() {
		const school_country = $(this).attr('data-school_country');
		if (+$(this).val() === 23) {
			// 以香港中學文憑考試成績 (DSE)、以香港高級程度會考成績 (ALE)、以香港中學會考成績 (CEE)申請
			$('.forCode23').fadeIn();
		} else {
			$('.forCode23').hide();
		}

		if (school_country === '馬來西亞' && (+$(this).val() === 1 || +$(this).val() === 2 || +$(this).val() === 3 || +$(this).val() === 16)) {
			// 馬來西亞地區 第1和5梯次的採計方式要填考生編號
			$('.forCode01').fadeIn();
		} else {
			$('.forCode01').hide();
		}

		if (school_country === '緬甸' && (+$(this).val() === 19)) {
			// 緬甸地區 華校和國際學校採計方式要選學科測驗考區
			$('.forCode19').fadeIn();
		} else {
			$('.forCode19').hide();
		}

		// 如果是申請僑先部（含特輔班）的採計方式或是僑先部結業生，就沒有要不要分發僑先部的問題
		if(+$(this).val() === 16 || +$(this).val() === 17 || +$(this).val() === 18){
			$('#go-to-FF-form').hide();  // 隱藏讓學生選擇去不去僑先部的選項
			$goToFF.prop('checked', true);  // 把選項勾回來
		} else {  // 反之則顯示選項
			$('#go-to-FF-form').show();
			if(+$(this).val() === 23){  // 只有在選擇以香港DSE、ALE、CEE作為聯分成績採計方式時才會顯示
				$('#hk-DSE-ALE-CEE').show();
			} else {
				$("#hk-DSE-ALE-CEE").hide();
			}
		}
	}

	async function _handleSave() {
		const id = $('.radio-option:checked').attr('data-id');
		const code = $('.radio-option:checked').val();
		const school_country = $('.radio-option:checked').attr('data-school_country');

		if (!id || !code) {
			swal({title: `請選擇您的成績採計方式`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
			return;
		}
		const toFForNot = $goToFF.prop('checked');

		// console.log(id);

		let data = {
			apply_way: id
		};

		if (school_country === '馬來西亞' && (+code === 1 || +code === 2 || +code === 3 || +code === 16)) {
			data.my_admission_ticket_no = $('.my_admission_ticket_no').val();
		}

		if (school_country === '緬甸' && (+code === 19)) {
			data.myanmar_test_area = $('.myanmar_test_area:checked').val();
		}

		if (+code === 23) {
			let resYear =_checkYear();
			if (!resYear[0]) {
				await swal({title: resYear[1], type:"error", confirmButtonText: '確定', allowOutsideClick: false});
				return;
			}
			data.year_of_hk_dse = resYear[2];
			data.year_of_hk_ale = resYear[3];
			data.year_of_hk_cee = resYear[4];
		}

		if(+id == 53 || +id == 59){
			await swal({
				title: '選擇此採計方式者不能參加個人申請，點選確認後將清空你的個人申請志願，並儲存你的採計方式。',
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#5cb85c',
				cancelButtonColor: '#d33',
				confirmButtonText: '確定',
				cancelButtonText: '取消',
			})
			.then( (result)	=>{
				//console.log(result);
				if(!result){
					return;
				}
			});
		}

		loading.start();
		try {
			const choseFF = await student.setStudentGoToFForNot(toFForNot);
			if(!choseFF.ok){
				throw choseFF;
			}
		} catch (e) {
			e.json && e.json().then((data) => {
				console.error(data);

				swal({title: `ERROR`, text: data.messages[0], type:"error", confirmButtonText: '確定', allowOutsideClick: false});

				loading.complete();
			});
			return;
		}

		student.setStudentAdmissionPlacementApplyWay(data).then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then(async (json) => {
			// console.log(json);
			await swal({title: `儲存成功`, type:"success", confirmButtonText: '確定', allowOutsideClick: false});
			if (json.student_misc_data.admission_placement_apply_way_data.code === '99999' || +code === 17) { // 不參加聯分，原地 reload
				window.location.reload();
			} else if(+code === 23){
				await swal({
					title: `持DSE、ALE、CEE者，此階段無須選填志願，請按「確定」後接續「上傳簡章規定應繳文件」步驟`,
					html: `即將跳轉至「上傳簡章規定應繳文件」頁面`,
					type:"info",
					confirmButtonText: '確定',
					allowOutsideClick: false
				});
				location.href = "./uploadIdentityVerification.html"
			} else { // 其餘導向下一頁
				location.href = "./placementSelection.html"
			}
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

	function _init() {
		// 取得選項
		student.getStudentAvailableApplyWayList()
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				throw res;
			}
		})
		.then((json) => {
			let fieldSetHTML = '';

			json.forEach((file, index) => {
				let school_country =  (file.last_graduated_school_country)?file.last_graduated_school_country:'無';
				fieldSetHTML += '<div class="form-group form-check"><label class="form-check-label"><input type="radio" class="form-check-input radio-option" name="grade" data-school_country =' + school_country +' data-id="' + file.id + '" value=' + file.code + '>' + file.description + '</label></div>';
			});

			$applyWaysFieldSet.html(fieldSetHTML);
		})
		.then(() => {
			// 取得選擇的選項
			student.getStudentAdmissionPlacementApplyWay()
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else {
					throw res;
				}
			})
			.then((json) => {
				const option = json.student_misc_data.admission_placement_apply_way_data ? json.student_misc_data.admission_placement_apply_way_data.code : null;
				const { year_of_hk_ale, year_of_hk_cee, year_of_hk_dse, my_admission_ticket_no, myanmar_test_area } = json.student_misc_data;
				!!option && $(`.radio-option[value=${option}]`).trigger('click');
				$('.year_of_hk_dse').val(year_of_hk_dse || '');
				$('.year_of_hk_ale').val(year_of_hk_ale || '');
				$('.year_of_hk_cee').val(year_of_hk_cee || '');
				$('.my_admission_ticket_no').val(my_admission_ticket_no || '');
				$(`.myanmar_test_area[value=${myanmar_test_area}]`).trigger('click');
			})
		})
		.then(() => {
			// 取得學生是否參加聯合分發
			student.getStudentAdmissionPlacementApplyWay().then((res) => {
				if(res.ok){
					return res.json();
				} else {
					throw res;
				}
			}).then((placementJson) => {
				const studentApplyWayCode = placementJson.student_misc_data.admission_placement_apply_way_data ? placementJson.student_misc_data.admission_placement_apply_way_data.code : null;
				if(studentApplyWayCode == 99999){  // 不參加聯合分發
					$('#not-join-placement-alert').show();  // 顯示不參加聯合分發的提示框
					$("#choose-placement-apply-way").hide();  // 隱藏儲存按鈕和選擇採計方式的區塊
				}
			})
		})
		.then(() => {
			// 取得學生是否願意去僑先部的資料
			student.getStudentGoToFForNot()
			.then((res) => {
					if (res.ok) {
						return res.json();
					} else {
						throw res;
					}
				})
			.then((FF_or_not_json) => {
				/*
				 * 如果是假，代表願意分發到僑先部 => 打勾；
				 * 反之，為真就代表不願意
				 */
				if(FF_or_not_json.not_to_FF){  // 抵死不想去
					$goToFF.prop('checked', false);
				} else {  // 我都可以
					$goToFF.prop('checked', true);
				}
			})
		})
		.then(() => {
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

	// 去不去僑先部的選項改變
	function toFFChange() {
		if(!$goToFF.prop('checked')){  // 變成沒勾的時候
			swal({
				title: '未勾選者，將視同放棄可能分發至「臺師大僑先部」之機會，且無法選填「臺師大僑先部」志願！<br/>願意分發至臺師大僑先部者<br/>請按「確定」鍵',
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#5cb85c',
				cancelButtonColor: '#d33',
				confirmButtonText: '確定',
				cancelButtonText: '取消',
			})
			.then( (result)	=>{
				//console.log(result);
				if(result){
					$goToFF.prop('checked', true);  // 幫學生勾回去
				} else {
					//取消 學生心意已決
					return;
				}
			});
		}
	}

	function _checkYear() {
		let year = [$('.year_of_hk_dse').val(),$('.year_of_hk_ale').val(),$('.year_of_hk_cee').val()];
		// 檢查結果 錯誤訊息 dse ale cee
		let result = [true, '','','',''];
		for(let j=0; j<year.length; j++) {
			// 檢查格式
			let reg = /^(\d{4}((,|\uff0c)\s*\d{4})*)$/g;
			if(year[j].length > 0 && !reg.test(year[j])) return [false, '年份格式錯誤！'];
			// 檢查年份
			let data = year[j].match(/\d{4}/g);
			if (data) {
				for (let i=0; i<data.length; i++) {
					if (data[i] < env.year - 100 || data[i] > env.year) return [false, '西元年份不合理！'];
				}
				result[j+2] = data.join(',');
			}
		}
		return result;
	}

})();
