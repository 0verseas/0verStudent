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
     .then(function () {
         loading.complete();
         location.href="./applicationFee.html";
     })
     .catch(function (res) {
         loading.complete();
         if(res.status == 401){
             swal({title: "請重新登入", type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
             location.href="./index.html";
         } else {
             res.json && res.json().then((data) => {
                 console.error(data);
                 swal({title: `Error: ${data.messages[0]}`, type:"warning", confirmButtonText: '確定', allowOutsideClick: false});
             })
             location.href="./result.html";
         }
     });
 }