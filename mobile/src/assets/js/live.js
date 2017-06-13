
import screen from '@/assets/js/screen'
export default {
  data () {
    return {
        live_id:10002,
        opinions:[],
        interactions:[],
        isTeacher:true,
        divHeight:0,
        isVideoShow:false,
        isUserSign:true,
        userSignCount:0,
        toastText:"请登录",
        isToast:false,
        transitionName: 'slide-left',
        subWs:null
    }
  },
  methods:{ 
    getLiveData:function(){
      this.get(this.data.config.api+"/live/detail",{"live_id": this.live_id}).then(r => {
          //console.log(r.data);
          if(r.data.status==1){
            if(this.getUser()==null) {
                this.setToken(r.data.token);
            }
            for (var i = 0; i < r.data.data.opinions.length; i++) {
              r.data.data.opinions[i].data.head_img=this.data.config.img+""+r.data.data.opinions[i].data.head_img;
              r.data.data.opinions[i].data.created_at=this.getDateTime(r.data.data.opinions[i].data.created_at,"MM-dd HH:mm:ss");
            }

            for (var i = 0; i < r.data.data.interactions.length; i++) {
              r.data.data.interactions[i].data.head_img=this.data.config.img+""+r.data.data.interactions[i].data.head_img;
              r.data.data.interactions[i].data.created_at=this.getDateTime(r.data.data.interactions[i].data.created_at,"MM-dd HH:mm:ss");
              r.data.data.interactions[i].isMoreOpen=false;
            }
            this.opinions=r.data.data.opinions;
            this.interactions=r.data.data.interactions;
            this.isTeacher=r.data.data.live.authority;
            this.isUserSign=r.data.data.is_sign<=0?true:false;
            this.userSignCount= r.data.data.sign_count;
            this.loadSocket(r.data.data.im_url);
            var _this= this;
            setInterval(function(){
              if(_this.$refs.chil!=undefined&&_this.$refs.chil.resize!=undefined&&typeof(_this.$refs.chil.resize) === "function"){
                  _this.$refs.chil.resize();
              }
            },3000);

          }
      }, response => {
          //console.log(response);
          this.timerError("网络错误");
      });
    },
    loadSocket:function(url){
      var _this=this;
      var opt={};

      if(window.WebSocket || window.MozWebSocket){
          opt = {
              subscriber: 'websocket',
              shared: false
          };
      }else{
          opt = {
              subscriber: 'longpoll',  
              shared: false
          };
      }
      this.subWs = new NchanSubscriber(url, opt);
      this.subWs.on("message", function(message, message_metadata) {
          //console.log(message);
          _this.onTextMessage(message);
      });
      this.subWs.on('connect', function(evt) {
          //console.log("连接成功");
      });
      this.subWs.on('disconnect', function(evt) {
          //console.log("断开连接");
      });
      this.subWs.on('error', function(code, message) {
          //console.log("连接错误");
      });
      this.subWs.start();
    },
    onTextMessage:function(data){
       var message= JSON.parse(data);
       if(message==undefined&&message==null){
          return null;
       }
        switch (message.cmd){
            case "s":
                this.addMessageItem(message);
                break;
            case "d":
                this.removeMessageItem(message);
                break;
        }
    },
    removeMessageItem:function(data){
      switch (data.type){
            case 21:
                for (var i = 0; i < this.opinions.length; i++) {
                   var item= this.opinions[i];
                   if(item.sn==data.sn){
                     this.opinions.splice(i,1);
                     break;
                   }
                }
                break;
            case 1:
                for (var i = 0; i < this.opinions.length; i++) {
                   var item= this.opinions[i];
                   if(item.sn==data.sn){
                     this.opinions.splice(i,1);
                     break;
                   }
                }
                break;
            case 40:
                for (var i = 0; i < this.interactions.length; i++) {
                   var item= this.interactions[i];
                   if(item.sn==data.sn){
                     this.interactions.splice(i,1);
                     break;
                   }
                }
                break;
            case 30:
                
                break;
        }
    },
    addMessageItem:function(data){
      switch (data.type){
            case 21:
                this.addOpinionItem(data);
                break;
            case 1:
                this.addOpinionItem(data);
                break;
            case 40:
                this.addInteractionItem(data);
                break;
            case 30:
                
                if(this.$refs.chil.setQuestionItem!=undefined&&typeof(this.$refs.chil.setQuestionItem) === "function"){
                  this.$refs.chil.setQuestionItem(data);
                }
                break;
        }

        if(this.$refs.chil.resize!=undefined&&typeof(this.$refs.chil.resize) === "function"){
            this.$refs.chil.resize();
        }

    },  
    addOpinionItem: function (data) {
        data.status=1;
        data.data.created_at=this.getDateTime(data.data.created_at,"MM-dd HH:mm:ss");
        data.data.head_img=this.data.config.img+""+data.data.head_img;
        
        this.opinions.push(data);

    },
    addInteractionItem: function (data) {
        data.status=1;
        data.data.created_at=this.getDateTime(data.data.created_at,"MM-dd HH:mm:ss");
        data.data.head_img=this.data.config.img+""+data.data.head_img;
        data.isMoreOpen=false;
        this.interactions.push(data);
    },
    changeHeight:function(){
        var contSlide = document.getElementsByClassName('content-slide');
        var quesSlide = document.getElementsByClassName('ques-slide');
        var tabsHeight = document.getElementsByClassName('tabs')[0].offsetHeight;
        
        if (!this.isVideoShow) {
            var contHeight = document.body.clientHeight-tabsHeight;
            var quesHeight = document.body.clientHeight-tabsHeight-50;
            this.divHeight=contHeight;
        }else{
            var videoHeight = document.getElementsByClassName('video')[0].offsetHeight;
            var contHeight = document.body.clientHeight-tabsHeight-videoHeight*window.screen.width/375;
            var quesHeight = document.body.clientHeight-tabsHeight-50-videoHeight*window.screen.width/375;
            this.divHeight=contHeight;
        }
    },
    timer:function(text,time){
      var _this = this;
      this.toastText=text;
      setTimeout(function(){
        _this.isToast = false;
      },time);
    },
    timerError:function(msg){
      this.isToast=true;
      this.timer(msg,2000);
    },
    clickUserSign:function(){
      var user= this.getUser();
      if(user==null){
        this.$router.push('/login');
        return null;
      }
      
      if(!this.isUserSign){
        this.isToast=true;
        this.timer("你已签到了!",2000);
        return null;
      }
      this.get(this.data.config.api+"/live/sign",{"live_id": this.live_id}).then(r => {
          if(r.data.status==1){
            this.isToast=true;
            this.userSignCount=this.userSignCount+1;
            this.isUserSign=false;
            this.timer("签到成功!",2000);
          }else{
            this.timer("签到失败!",2000);
          }
      }, response => {
          this.removeUser();
          this.removeToken();
          this.timerError("网络错误,请重试!");
      });
    },
    upMessages:function(data){
      for (var i = data.data.length - 1; i >= 0; i--) {
        this.addMessageItem(data.data[i]);
      }
    }

  },
  beforeDestroy:function(){
    console.log("Home beforeDestroy");
    if(this.subWs!=null){
      this.subWs.stop();
    }
   
  },
  created:function(){
    this.getLiveData();
  },
  mounted:function(){
    this.changeHeight();
  }

}

