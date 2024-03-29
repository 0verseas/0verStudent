(()=>{
    /**
     *	cache DOM
     */

    const $payBtn = $('#btn-pay');
    const $payedBtn = $('#btn-payed');

    $payBtn.on('click', _handlePay);

    /**
     * init
     */

    init();

    /**
     *	bind event
     */

    // 初始化事件
    async function init(){
        const progressResponse = await student.getStudentRegistrationProgress();
        if (!progressResponse.ok) { throw progressResponse; }
			const progressJson = await progressResponse.json();

        if(!progressJson.student_personal_data){
            await swal({title: "請先完成個人基本資料填寫！", type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
            location.href = "./personalInfo.html";
        }

        if(progressJson.student_qualification_verify.system_id == 1 && !progressJson.student_misc_data.admission_placement_apply_way_data){
            await swal({title: "請先選擇成績採計方式！", type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
            location.href = "./grade.html";
        }

        await student.getOrderList()
        .then(function (res) {
            if (res.ok) {
                return res.json();
            } else {
                throw res;
            }
        })
        .then(function (json) {
            if(json.trade_status=="1"){
                $payBtn.hide();
                $payedBtn.show();
            } else {
                $payBtn.show();
                $payedBtn.hide();
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
                res.json && res.json().then((data) => {
                    console.error(data);
                    swal({title: `Error: ${data.messages[0]}`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                })
            }
        });
    }

    async function _handlePay(){
        await loading.start();
        // 詢問使用者是否確認要前往付款頁面
        await swal({
            title: '即將前往付款頁面',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: '確認',
            cancelButtonText: '取消',
            confirmButtonColor: '#5cb85c',
            cancelButtonColor: '#d9534f',
        }).then(()=>{
            // 按下確定後就呼叫我們的API跳轉到綠界的付款頁面
            location.href = env.baseUrl + `/students/application-fee/create`;
        }).catch(()=>{
        });
        await loading.complete();
    }
})();