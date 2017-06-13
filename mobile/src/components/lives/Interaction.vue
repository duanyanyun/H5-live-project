<template>
  <div class="swiper-slide posr">
    <div class="content-slide pdb42" v-bind:style="{height:divHeight+'px'}">
    <scroller  :on-refresh="upInteraction" ref="my_scroller"  >
      <ul >
        <li  v-for="(item,index) in interactions"  class="clearfix">
          <div  class="head-img f-l">
            <img v-bind:src="item.data.head_img" />
            <!--禁言···-->
            <span v-on:click="selectItem(index)" v-show="isTeacher" class="th-menu"></span>
          </div>
          <!--禁言等操作框-->
          <div  v-show="item.isMoreOpen" class="reply-box clearfix">
            <span v-on:click="forbiddenClick(item.user_id);item.isMoreOpen=false;" >禁言</span>
            <span v-on:click="replyClick(item.data.nickname,item.sn);item.isMoreOpen=false;">回复</span>
            <span v-on:click="removeClick(item.sn);item.isMoreOpen=false;">删除</span>
            <em class="triangle"></em>
          </div>
          <div v-on:click="replyClick(item.data.nickname,item.sn);" class="slide-cont">
            <em></em>
            <div class="slide-head">
              <span class="slide-nick">{{ item.data.nickname }}</span>
              <span class="slide-time">{{ item.data.created_at }}</span>
            </div>
            <div class="chat-cont">
              <p v-html="item.data.content" ></p>

              <div v-if="item.data.original!=undefined" class="reply clearfix">
                <span>{{ item.data.original.nickname }}：</span>
                <p v-html="item.data.original.content" ></p>
              </div>

            </div>
          </div>
        </li>
        
      </ul>
    </scroller>
    </div>
    
    <send-box   ref="intera"  v-on:timer-error="timer" v-on:send-click="sendInteraction"   v-bind:live_id="live_id" ></send-box>
  </div>
</template>

<script>

import Scroller from 'vue-scroller'
import SendBox from '@/components/lives/SendBox'
  
export default {
  data () {
    return {
       reply:{user_name:"",reply_id:0},
       isScrol:true,
       indexItem:-1
    }
  },
  props:["live_id","interactions","isTeacher","divHeight"],
  methods:{
    timer:function(msg){
      this.$emit('timer-error',msg);
    },
    selectItem:function(index){
      if(this.indexItem>-1&&this.indexItem!=index){
          this.interactions[this.indexItem].isMoreOpen=false;
      }
      this.interactions[index].isMoreOpen=!this.interactions[index].isMoreOpen;
      this.indexItem=index;
    },
    sendInteraction:function(content){

        var isReply=false;
        var url="";
        var model={};
        if(this.reply.reply_id>0){
          if(content.indexOf(this.reply.user_name)>-1){
            content=content.replace(this.reply.user_name,"");
            url=this.data.config.api+"/live/reply";
            model={"live_id": this.live_id,"content":content,"reply_id":this.reply.reply_id};
            isReply=true;
          }else{
            url=this.data.config.api+"/live/send-interaction";
            model={"live_id": this.live_id,"content":content};
            isReply=false;
          }
        }else{
          url=this.data.config.api+"/live/send-interaction";
          model={"live_id": this.live_id,"content":content};
          isReply=false;
        }

        this.post(url,model).then(response => {
          //console.log(response.data);
          if(response.data.status==1){
            this.reply.reply_id=0;
            this.reply.user_name="";
            return null;
          }
          this.timer(response.data.data);
        }, response => {
            console.log(response);
        });

    },
    upInteraction:function(){
      if(this.interactions.length<=0){
        return null;
      }
      var sn=this.interactions[0].sn;
      this.get(this.data.config.api+"/message/down-message",{
        "live_id": this.live_id,
        "type":40,
        "sn":sn
      }).then(response => {
        if(response.data.status==1){
          for (var i = response.data.data.messages.length - 1; i >= 0; i--) {
            response.data.data.messages[i].data.head_img=this.data.config.img+""+response.data.data.messages[i].data.head_img;
            response.data.data.messages[i].data.created_at=this.getDateTime(response.data.data.messages[i].data.created_at,"MM-dd HH:mm:ss");
            response.data.data.messages[i].isMoreOpen=false;
            this.interactions.unshift(response.data.data.messages[i]);
          }
          //this.$emit('send-click',{data:response.data.data.messages,type:40});
          if (this.$refs.my_scroller){
            var _this=this;
            setTimeout(function(){
              _this.$refs.my_scroller.finishPullToRefresh();
              _this.$refs.my_scroller.resize();
            },100);
            
          }
        }
      },response => {
          console.log(response);
      });
    },
    replyClick:function(name,sn){
        if(this.indexItem>-1){
            this.interactions[this.indexItem].isMoreOpen=false;
        }
        //console.log("replyClick:"+name+"  sn:"+sn);
        if(typeof(this.$refs.intera.replyContent) === "function"){
            this.$refs.intera.replyContent("[回复"+name+"]:");
            this.reply.user_name="[回复"+name+"]:";
            this.reply.reply_id=sn;
        }
    },
    removeClick:function(sn){
        this.post(this.data.config.api+"/live/delete-msg",{
          "sn": sn
        }).then(response => {
          //console.log(response.data);
          if(response.data.status==1){
            this.$emit('timer-error',"删除成功");
            return null;
          }
          this.$emit('timer-error',"删除失败");
        }, response => {
            console.log(response);
        });
    },
    forbiddenClick:function(userId){
      //console.log("userId:"+userId);
        this.post(this.data.config.api+"/live/forbidden",{
          "user_id": userId,"live_id": this.live_id
        }).then(response => {
          //console.log(response.data);
          if(response.data.status==1){
            this.$emit('timer-error',"禁言成功");
            return null;
          }
          this.$emit('timer-error',"禁言失败");
        }, response => {
            console.log(response);
        });
    },
    resize:function(){
      
      var _this=this;
      setTimeout(function(){
        _this.$refs.my_scroller.resize();
        if(_this.isScrol){
          var position= _this.$refs.my_scroller.scroller.getScrollMax();
          _this.$refs.my_scroller.scrollTo(0,position.top,true);
        }
      },100);
      
    },
    touchMove:function(e){
      e.preventDefault();
      this.$refs.my_scroller.scroller.doTouchMove(e.touches, e.timeStamp);
      var max= this.$refs.my_scroller.scroller.getScrollMax();
      var top= this.$refs.my_scroller.getPosition();
      
      if((top.top+50)>=max.top){
        this.isScrol=true;

      }else{
        this.isScrol=false;
      }
      
    }
    
  },
  components:{
    SendBox,Scroller
  },
  beforeDestroy:function(){
    console.log("beforeDestroy");
    
  },
  created:function(){
      if(this.$route.params.invite_code!=undefined){
          this.setInviteCode(this.$route.params.invite_code);
      }
  },
  mounted:function() {
     var _this=this;
     setTimeout(function(){
              _this.$refs.my_scroller.resize();
     },100);
      this.$refs.my_scroller.touchMove=this.touchMove;
  }

}

</script>

