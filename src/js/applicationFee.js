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
    function init(){
        student.getOrderList()
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

    function _handlePay(){
        // 使用者確認
        swal({
            title: '即將前往付款頁面',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: '確認',
            cancelButtonText: '取消'
        }).then(()=>{
            // 
            location.href = env.baseUrl + `/students/application-fee/create`;
        }).catch(()=>{
        });
    }
})();