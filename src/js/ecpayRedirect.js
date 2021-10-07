/**
     * init
     */

 init();

 /**
  *	bind event
  */

 // 初始化事件
 async function init(){
     loading.start();
     const response = await student.getOrderList();
     const data = await response.json();
     if(response.ok){
         if(data.trade_status == "1"){
            const lockResponse = await student.dataConfirmation({"confirmed": true});
            const lockdata = await lockResponse.json();
            if(lockResponse.ok){
                await student.generateAdminssionPaper(); // 鎖定成功就幫學生call API 在server產生報名表件
                await swal({title: `成功完成填報。`, html:`如果需要再修改資料請利用「資料修正表」，或是重新申請一組新的帳號。`,type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                location.href = "./downloadDocs.html";
            } else {
                if(lockResponse.status == 401){
                    await swal({title: "請重新登入", type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                    location.href="./index.html";
                } else {
                    console.error(lockdata);
                    await swal({title: `Error: ${lockdata.messages[0]}`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
                    location.href="./result.html";
                }
            }
         } else {
            await swal({title: `尚未完成付款`, html:`即將跳轉回志願檢視頁面`,type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
            location.href = "./result.html";
         }
     } else {
        if(response.status == 401){
            await swal({title: "請重新登入", type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
            location.href="./index.html";
        } else {
            console.error(data);
            await swal({title: `Error: ${data.messages[0]}`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
            location.href="./result.html";
        }
     }
     await loading.complete();
 }