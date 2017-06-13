<template>
	<div class="operate-area">
		<!-- 发布评论 -->
	    <div class="dms-send-container">
	      <div class="clearfix">
	        <div class="dms-button-container">
	          <input v-on:click="sendBut()" type="button"  value="发送">
	        </div>
	        <div class="dms-textarea-container">
	          <div class="dms-textarea-box">
	            <input v-on:keyup="changeContent" type="text" v-model="content"   >
	          </div>
	        </div>
	      </div>
	      
	      <div class="dms-le-container clearfix">
	        <span v-on:click="qqEmots=!qqEmots" class="expression dms-login-button f-l"></span>
	        <span v-on:click="clickFile" class="input-file f-l">
	          <input  v-show="userLogin" v-on:change="updateHeadImg"  type="file" />
	        </span>
	        <span v-on:click="clickHeadImg" class="set-hd f-l"></span>

	        <span v-on:click="clickShare()" class="share f-l"></span>
	        <span v-on:click="clickLogin()" class="user-operate f-r"><img  v-show="userLogin" v-bind:src="head_img" /> </span>
	      </div>
	    </div>
	    <!--分享框-->
	    <div v-show="isShare" class="share-box clearfix">
	      <span data-clipboard-action="copy" :data-clipboard-text="'http://m.168csj.com/#/live/opinion/'+user_id"  class="copyLiveUrlBtn share-copy f-l">复制</span>
	      <span class="share-line f-l"></span>
	      <p class=" f-r"  >http://m.168csj.com/#/live/opinion/{{ user_id }}</p>
	      <em class="triangle"></em>
	    </div>
	    <!-- 表情 -->
	    <div v-show="qqEmots" class="qqFace" >
	      <div class="swiper-wrapper">
	        <div class="swiper-slide">
	          <ul class="clearfix">
	            <li v-for="(value, index) in qqFace"><i v-on:click="chooseFace(value,index)"><img v-bind:src="qqImg+'emot/qq/'+value[1]"></i></li>
	          </ul>
	        </div>
	      </div>
	      <div class="pagination"></div>
	    </div>
	    <!-- 表情 -->
	    <!--退出框-->
        <div v-show="isLogout" class="exit-box">
        	<p v-on:click="clickLogout" >退出</p>
        	<p class="clearfix">
        		<img class="f-l"  v-bind:src="head_img" />
        		<span class="f-l">{{user_name}}</span>
        	</p>
        	<em class="triangle"></em>
        </div>
	</div>
</template>



<script>
import Vue from 'vue'
import face from '@/assets/js/face'
Vue.use(face)

export default {
  data () {
    return {
       user_id:0,
       qqEmots:false,
       isShare:false,
       content:"",
       userLogin:false,
       head_img:"",
       user_name:"",
       reply:"",
       uploadImg:"",
       qqFace:[],
       qqImg:"",
       setImg:"",
       isLogout:false,

    }
  },
  props:["live_id"],
  methods:{
  	replyContent:function(text){
  		this.reply=text;
		  this.content=text;
  	},
  	timers:function(msg){
      this.$emit('timer-error',msg);
    },
    sendBut:function(){
    	var user= this.getUser();
	    if(user==null){
	        this.$router.push('/login');
	        return null;
	    }
	    var imgs= this.setImg.split(",");
	    for (var i = 0; i < imgs.length; i++) {
	    	if(imgs[i].length>0){
	    		var item=imgs[i].split(":");
	    		this.content=this.content.replace(new RegExp('\\['+item[0]+'\\]', 'g'),"<img class='face-img' src='"+this.data.config.imgQ+'emot/qq/'+item[1]+"' >");
	    	}
	    }
      if(this.content==''||this.content.length<=0){
        this.timers("请输入内容");
        return null;
      }

    	this.$emit('send-click',this.content);
    	this.content="";
    	this.reply="";
    },
    clickShare:function(){
    	var user= this.getUser();
	    if(user==null){
	        this.$router.push('/login');
	        return null;
	    }
    	this.isShare=!this.isShare;
    },
    clickHeadImg:function(){
    	var user= this.getUser();
	    if(user==null){
	       this.$router.push('/login');
	       return null;
	    }
	    this.$router.push('/changeHd');
    },
    clickFile:function(){
    	var user= this.getUser();
	    if(user==null){
	       this.$router.push('/login');
	       return false;
	    }
	    return true;
    },
	updateHeadImg:function(event){
		let  file=event.target.files[0];
		this.postFile(this.data.config.api+"/upload/img",file).then(response => {
	        if(response.data.status==1){
	          this.$emit('send-click',"<img src='"+this.data.config.img+"/"+response.data.data+"' />");
	        }else{
            this.timers("上传失败");
          }
	    }, response => {
	          this.timers("网络错误");
	    });
	}
    ,
    clickLogin:function(){
    	var user= this.getUser();
	    if(user==null){
	       this.$router.push('/login');
	       return null;
	    }
	    this.isLogout=!this.isLogout;
    },
    changeContent:function(){
    	if(this.reply.length>0&&this.content.indexOf(this.reply)<=-1){
    		this.reply="";
    		this.content="";
    	}
    },
    //表情选中
    chooseFace:function(e,index){
    	var key=e[0]+":"+e[1]+",";
    	if(this.setImg.indexOf(key)<=-1){
    		this.setImg=this.setImg+key;
    	}
    	this.content = this.content+ '['+e[0]+']';
    },
    clickLogout:function(){
    	this.isLogout=false;
    	this.removeUser();
        this.removeToken();
        window.location.reload();
    	//this.$router.go(0);  
    }
  },
  created:function(){
    
  	var _this=this;
  	this.qqFace = this.qqData.qq;
  	this.qqImg=this.data.config.imgQ;
    if(window.Clipboard!=undefined){
        var clipboard = new Clipboard('.copyLiveUrlBtn');
        clipboard.on('success', function(e) {
            _this.isShare=false;
            _this.timers("复制成功");
        });
        clipboard.on('error', function(e) {
            _this.timers("复制失败:请长按链接‘复制’");
        });
    }
    var user= this.getUser();
    if(user==null){
       this.userLogin=false;
    }else{
    	this.head_img=this.data.config.img+"/"+user.head_img;
    	this.user_id=user.user_id;
    	this.user_name=user.nickname;
    	this.userLogin=true;
    }

  }

}
</script>