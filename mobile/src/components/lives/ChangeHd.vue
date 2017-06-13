<template>
<transition :name="transitionName">
	<div class="change-page child-view">
		<div class="nav">
			<a class="back" onclick="window.history.go(-1)"></a>更换头像
			<span class="uploading">上传<input v-on:change="uploadHeadImg" type="file" /></span>
		</div>
		<div class="contain">
			<div class="show-cont">
				<img class="show-img" v-bind:src="imgUrl+headImg" />
				<div class="choose-box">
					<ul class="clearfix" v-bind:style="{width:widthValue}" >
						<li v-on:click="clickHeadImg(item,index)" v-bind:class="{ cur:imgIndex==index }"  v-for="(item,index) in imgs"  ><img v-bind:src="imgUrl+item" /></li>
					</ul>
				</div>
			</div>
		</div>
		<input v-on:click="updateUserHeadImg" class="save-btn" type="button" value="保存" />
		<!--提示框-->
	    <div class="toast" v-show="isToast" >
	      <span>{{ toastText }}</span>
	    </div>
	</div>
</transition>
</template>

<script>
	export default {
	  data () {  
	    return {
	     	widthValue:"100%",
	     	imgs:[],
	     	imgUrl:"",
	     	headImg:"",
	     	imgIndex:-1,
	     	isToast:false,
	     	toastText:"上传失败",
	     	transitionName: 'slide-left'
	    }
	  },
	  methods:{
	  	getUserHeadImg:function() {
	  		this.get(this.data.config.api+"/user/head-imgs",{}).then(r => {
		        if(r.data.status==1){
		          var count=r.data.data.length*85;
		          this.widthValue=count+"px";
		          this.imgs=r.data.data;
		        }
		    }, response => {
		          console.log(response);
		    });
	  	},
	    timer:function(text,time){
	      var _this = this;
	      if(text!=null){
	      	 this.toastText=text;
	      }
	      setTimeout(function(){
	        _this.isToast = false;
	      },time);
	    },
	  	clickHeadImg:function(img,index){
	  		this.imgIndex=index;
	  		this.headImg=img;
	  	},
		uploadHeadImg:function(event){
			let  file=event.target.files[0];
			this.postFile(this.data.config.api+"/upload/img",file).then(response => {
		        if(response.data.status==1){
		          this.imgIndex=-1;
	  			  this.headImg=response.data.data;
		        }
		    }, response => {
		          console.log(response);
		    });
		},
	  	updateUserHeadImg:function(){
	  		this.post(this.data.config.api+"/user/update-headimg",{
		        "headimg":this.headImg
		    }).then(response => {
		        console.log(response.data);
		        if(response.data.status==1){
		          this.setUserHeadImg(this.headImg);
		          this.isToast=true;
		          this.timer("更改成功",2000);
		          return null;
		        }
		        this.isToast=true;
		        this.timer(null,2000);
		    }, response => {
		          console.log(response);
		    });
	  	}

	  },
	  created:function(){
	    this.getUserHeadImg();
	    this.imgUrl=this.data.config.img;
	    var user= this.getUser();
	    this.headImg=user.head_img;
	  }

	}
</script>

<style src="../../assets/css/change-hd.css" scoped />