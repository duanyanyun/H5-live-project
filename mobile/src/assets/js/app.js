/**
 * Created by hanxiao on 2017/4/7.
 */
var qs = require('qs');
export default{
    install(Vue){
        Vue.prototype.data={config: {
             api: "http://192.168.6.110:8091/api",
             im: "http://192.168.6.110:8091/im",
            // api: "http://www.168csj.com/api",
            // im: "http://www.168csj.com/im",
            img: "http://img.csjimg.com/",
            imgQ: "http://common.csjimg.com/",
        },user_key:'user',user_token:'token',user_invite_code:'user_invite_code'};
        Vue.prototype.getUser = function (){
            var json = window.localStorage.getItem(this.data.user_key);
            if (json != null) {
                return JSON.parse(json);
            }
            return null;
        };
        Vue.prototype.setToken = function (token){
            window.localStorage.setItem(this.data.user_token, token);
        };
        Vue.prototype.getToken = function (){
            var token = window.localStorage.getItem(this.data.user_token);
            return token;
        };
        Vue.prototype.setInviteCode = function (invite_code){
            window.localStorage.setItem(this.data.user_invite_code, invite_code);
        };
        Vue.prototype.getInviteCode = function (){
            var invite_code = window.localStorage.getItem(this.data.user_invite_code);
            return invite_code;
        };
        Vue.prototype.removeToken = function (){
            window.localStorage.removeItem(this.data.user_token);
        };

        Vue.prototype.setUser = function (user){
            window.localStorage.setItem(this.data.user_key, JSON.stringify(user));
        };

        Vue.prototype.setUserHeadImg = function (img){
            var user= this.getUser();
            if(user!=null){
              user.head_img=img;
              this.setUser(user);
              return true;
            }
            return false;
        };


        Vue.prototype.removeUser=function () {
            window.localStorage.removeItem(this.data.user_key);
        };
        Vue.prototype.get=function (url,data) {
           var token=this.getToken();
           if(token!=null) {
               data.token=token;
           }
           return this.axios({
                url: url,
                method: 'get',
                params: data
              });

           //return this.axios.get(url,data);
        };

        Vue.prototype.post=function (url,data) {
            var token=this.getToken();
            if(token!=null) {
                data.token=token;
            }
            return this.axios.post(url,qs.stringify(data));
        };
        Vue.prototype.postFile=function (url,file) {
            var token=this.getToken();
            var form = new FormData(); // FormData 对象
            form.append("filedata", file);
            if(token!=null) {
                form.append('token', token);
            }
            return this.axios.post(url, form, {
                method: 'post',
                headers: {'Content-Type': 'multipart/form-data'}
            })
        };
        Vue.prototype.getDateTime=function (created_at,fmt) {
            var date=new Date(parseInt(created_at+"000"));
            var o = {
               "M+": date.getMonth() + 1, //月份
               "d+": date.getDate(), //日
               "H+": date.getHours(), //小时
               "m+": date.getMinutes(), //分
               "s+": date.getSeconds(), //秒
               "q+": Math.floor((date.getMonth() + 3) / 3), //季度
               "S": date.getMilliseconds() //毫秒
           };
           
           if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
           for (var k in o)
               if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
           return fmt;
        };

        Vue.prototype.getDateToString=function (created_at) {
            var t1=new Date(parseInt(created_at+"000"));
           var m1=(t1.getMonth())+1;
           var day=t1.getDate();
           var minute=t1.getMinutes();
           var hours=t1.getHours();
           var second=t1.getSeconds();
           if(m1<=9){
               if((m1.toString()).indexOf("0")<=-1){
                   m1="0"+m1;
               }
           }
           if(day<=9){
               if((day.toString()).indexOf("0")<=-1){
                   day="0"+day;
               }
           }
           if(hours<=9){
               if((hours.toString()).indexOf("0")<=-1||hours==0){
                   hours="0"+hours;
               }
           }
           if(minute<=9){
               if((minute.toString()).indexOf("0")<=-1||minute==0){
                   minute="0"+minute;
               }
           }
           if(second<=9){
               if((second.toString()).indexOf("0")<=-1||second==0){
                   second="0"+second;
               }
           }
           return (t1.getFullYear().toString()).substring(2,4)+"-"+m1+"-"+day+" "+hours+":"+minute;
        };



    }
}