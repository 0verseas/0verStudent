(() => {
    /**
     * private variable & constant
     */

    /**
     *	cache DOM
     */
    const $admissionRoster = $('#admission-roster');  // 榜單資訊區
    const $searchBtn = $('#btn-search');  // 查榜按鈕
    const $stage = $('#stage');  // 分發類別
    const $name = $('#name'); // 姓名
    const $userId = $('#userId'); // 報名序號
    const $birthday = $('#birthday');  // YYYY-MM-DD

    /**
     *	bind event
     */
    $searchBtn.on('click', getAdmissionRoster);

    /**
     * init
     */
    loading.complete();

    // 啟用由網址帶參數功能
    var url_string = window.location.href;
    var url = new URL(url_string);
    var url_data = url.searchParams.get("data"); // hash

    // 驗證單位查詢
    if(url_data){
        $('.result').hide();  // 重新點下查詢按鈕就要把之前的結果藏起來

        var data = encodeHtmlCharacters(url_data);

        loading.start();
        student.getAdmissionRoster2(data)
            .then((res) => {
                if (res.ok){
                    return res.json();
                } else {
                    throw res;
                }
            })
            .then((json) => {
                $('#form-studentInfo').hide();
                $('#google-form-for-papper').hide();
                showAdmissionRoster(json);
            })
            .catch((err) => {
                if (err.status && err.status === 404) {  // 找不到QQ or 未獲錄取
                    err.json().then((data) => {
                        if (data.messages[0] == '未獲錄取' ) {
                            $('#form-result').show();
                            $('#no-result-case1').text('未獲此梯次錄取');
                            $('#no-result-case1').show("slow");  // 顯示查詢結果區（未獲錄取）
                        } else if(data.messages == '此梯次尚未放榜。') {
                            $('#form-result').show();
                            $('#no-result-case1').text(data.messages);
                            $('#no-result-case1').show("slow");  // 顯示查詢結果區（尚未放榜）
                        } else {
                            $('#form-result').show();
                            $('#no-result-case1').text('查無結果，請檢查輸入資料是否有誤');
                            $('#no-result-case1').show("slow");  // 顯示查詢結果區（無資料）
                        }
                    })
                } else {
                    err.json && err.json().then((data) => {
                        console.error(data);
                        swal({title:`ERROR`, text: data.messages[0], confirmButtonText:'確定', type:'error'});
                    })
                }
                loading.complete();
            });
    }


    // 找找學生是不是有在榜上
    function getAdmissionRoster(){
        $('.result').hide();  // 重新點下查詢按鈕就要把之前的結果藏起來

        // 檢查有沒有什麼地方不對的
        if ($stage.val() === ""){  // 沒選擇「分發類別」
            swal({title: `請選擇分發類別`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
            return;
        }
        // if ($name.val() === ""){  // 沒填寫姓名
        //     alert('請填寫姓名');
        //     return;
        // }
        var $name1 ='';
        if ($name.val() === ""){  // 姓名選填
            $name1 = 'NONE';
        }else {
            $name1 = $name.val();
        }

        if ($userId.val() === ""){  // 沒填寫報名序號
            swal({title: `請填寫報名序號`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
            return;
        }
        if ($("input[name='gender']:checked").val() === undefined){  // 沒填寫生理性別
            swal({title: `請選擇生理性別`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
            return;
        }
        if ($birthday.val() === ""){  // 沒填寫生日
            swal({title: `請填寫生日`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
            return;
        }

        // 去後端查榜啦
        loading.start();
        student.getAdmissionRoster($stage.val(), $name1, $userId.val(), $birthday.val(), $("input[name='gender']:checked").val())
            .then((res) => {
                if (res.ok){
                    return res.json();
                } else {
                    throw res;
                }
            })
            .then((json) => {
                showAdmissionRoster(json);
            })
            .catch((err) => {
                if (err.status && err.status === 404) {  // 找不到QQ or 未獲錄取
                    err.json().then((data) => {
                        if (data.messages[0] == '未獲錄取' ) {
                            $('#form-result').show();
                            $('#no-result-case1').text('未獲此梯次錄取');
                            $('#no-result-case1').show("slow");  // 顯示查詢結果區（未獲錄取）
                        } else if(data.messages == '此梯次尚未放榜。') {
                            $('#form-result').show();
                            $('#no-result-case1').text(data.messages);
                            $('#no-result-case1').show("slow");  // 顯示查詢結果區（尚未放榜）
                        } else {
                            $('#form-result').show();
                            $('#no-result-case1').text('查無結果，請檢查輸入資料是否有誤');
                            $('#no-result-case1').show("slow");  // 顯示查詢結果區（無資料）
                        }
                    })
                } else {
                    err.json && err.json().then((data) => {
                        console.error(data);
                        swal({title: `ERROR: \n${data.messages[0]}`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                    })
                }
                loading.complete();
            });
    }

    // 恭喜金榜題名！
    function showAdmissionRoster(admissionInfo) {
        // 別忘記蛋蛋說的「別相信任何使用者輸入的東西」，先過濾過濾吧
        let studentName = encodeHtmlCharacters(admissionInfo.name);
        let studentEngName = encodeHtmlCharacters(admissionInfo.eng_name);

        let deptTitle, schoolTitle = '';  // 錄取的學校及系所名
        if (admissionInfo.student_misc_data.department_data !== null){  // 學士班
            deptTitle = admissionInfo.student_misc_data.department_data.title;
            schoolTitle = admissionInfo.student_misc_data.department_data.school.title;
        } else if (admissionInfo.student_misc_data.graduate_department_data !== null){  // 研究所
            deptTitle = admissionInfo.student_misc_data.graduate_department_data.title;
            schoolTitle = admissionInfo.student_misc_data.graduate_department_data.school.title;
        }else if (admissionInfo.student_misc_data.two_year_tech_department_data !== null){  // 港二技
            deptTitle = admissionInfo.student_misc_data.two_year_tech_department_data.title;
            schoolTitle = admissionInfo.student_misc_data.two_year_tech_department_data.school.title;
        }

        // 檢查有無特殊註記
        const distribution_list_memo = admissionInfo.student_misc_data.distribution_list_memo;
        if (/特輔班/.test(distribution_list_memo) && admissionInfo.student_misc_data.department_data.school.id == 'FF'){
            deptTitle += '（特輔班）';  // 特輔班要在系所名稱上註記
        }

        let roster = '';
        roster += `<td class="align-middle" data-th="報名序號">${admissionInfo.id}</td>  <!--報名序號-->
                <td class="align-middle" data-th="僑生編號">${admissionInfo.student_misc_data.overseas_student_id}</td>  <!--僑生編號-->
                <td class="align-middle" data-th="中、英文姓名">${studentName}<br />${studentEngName}</td>  <!--中、英文姓名-->
                <td class="align-middle" data-th="錄取校系">${schoolTitle}<br />${deptTitle}</td>  <!--錄取的學校及系所-->
                <td class="align-middle" data-th="僑居地國別">${admissionInfo.student_personal_data.resident_location_data.country}</td>  <!--僑居地國別-->
                <td class="align-middle" data-th="發文日期">${admissionInfo.student_misc_data.distribution_date}</td>  <!--發文日期-->
                <td class="align-middle" data-th="發文字號">${admissionInfo.student_misc_data.distribution_no}</td>  <!--發文字號-->`;
        $admissionRoster.html(roster);

        $('.accepted').show("normal");  // 顯示查詢結果區（金榜題名）
        loading.complete();
    }

    // 轉換一些敏感字元避免 XSS
    function encodeHtmlCharacters(bareString) {
        if (bareString === null) return '';
        return bareString.replace(/&/g, "&amp;")  // 轉換 &
            .replace(/</g, "&lt;").replace(/>/g, "&gt;")  // 轉換 < 及 >
            .replace(/'/g, "&apos;").replace(/"/g, "&quot;")  // 轉換英文的單雙引號
            .replace(/ /g, " &nbsp;")
            ;
    }

})();
