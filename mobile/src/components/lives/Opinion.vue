<template>
  <div class="swiper-slide posr">
    <div class="content-slide " v-bind:class="{ pdb42:isTeacher }"   v-bind:style="{height:divHeight+'px'}" >
    <scroller  :on-refresh="upOpinions" ref="my_scroller">
      <ul >
        <li  v-for="(item, index) in opinions"  class="clearfix">
          <div v-if="item.type==21" >
            <div class="head-img f-l">
              <img v-bind:src="item.data.head_img"  />
            </div>
            <div class="slide-cont">
              <em></em>
              <div class="slide-head">
                <span class="slide-nick">{{ item.data.nickname }}</span>
                <span class="slide-time">{{ item.data.created_at }}</span>
              </div>
              <div class="chat-cont">
                <p v-html="item.data.content" ></p>
              </div>
            </div>
          </div>

          <div v-if="item.type==1" >
            <div class="head-img f-l">
              <img v-bind:src="item.data.head_img"  />
            </div>
            <div class="slide-cont">
              <em></em>
              <div class="slide-head">
                <span class="slide-nick">{{ item.data.nickname }}</span>
                <span class="slide-time">{{ item.data.created_at }}</span>
              </div>
              <div class="chat-cont">
                    <div class="gift-show">
                        <div class="gift-show-text">
                            <p>送<span>{{ item.data.seller.nickname }}</span>老师<span>{{ item.data.item_name }}</span>！</p>
                            <p v-html="item.data.content"></p>
                        </div>
                        <div class="gift-show-cont f-r">
                            <img v-bind:src="commonImgUrl+item.data.item_img" >
                        </div>
                    </div>
              </div>
            </div>
          </div>  

        </li>
      </ul>
      </scroller>
    </div>
    <!-- 发布评论 -->
    <send-box v-on:timer-error="timer" v-on:send-click="sendOpinion"  v-if="isTeacher" v-bind:live_id="live_id"  ></send-box>

 </div>
    
</template>
<script>
import Scroller from 'vue-scroller'
import SendBox from '@/components/lives/SendBox'

export default {
  data () {
    return {
      isScrol:true,
      commonImgUrl:""
    }
  },
  props:["live_id","opinions","isTeacher","divHeight"]
  ,components:{SendBox,Scroller},
  methods:{
    timer:function(msg){
      this.$emit('timer-error',msg);
    },
    sendOpinion:function(content){
        this.post(this.data.config.api+"/live/send-opinion",{
          "live_id": this.live_id,
          "content":content
        }).then(response => {
          //console.log(response.data);
          if(response.data.status==1){
            
          }
        }, response => {
            console.log(response);
        });
    },
    upOpinions:function(){
      if(this.opinions.length<=0){
        return null;
      }
      var sn=this.opinions[0].sn;
      this.get(this.data.config.api+"/message/down-message",{
        "live_id": this.live_id,
        "type":"21,1",
        "sn":sn
      }).then(response => {

        if(response.data.status==1){
            for (var i = response.data.data.messages.length - 1; i >= 0; i--) {
              response.data.data.messages[i].data.head_img=this.data.config.img+""+response.data.data.messages[i].data.head_img;
              response.data.data.messages[i].data.created_at=this.getDateTime(response.data.data.messages[i].data.created_at,"MM-dd HH:mm:ss");
              this.opinions.unshift(response.data.data.messages[i]);
            }

          if (this.$refs.my_scroller){
            var _this=this;
            setTimeout(function(){
              _this.$refs.my_scroller.finishPullToRefresh();
              _this.$refs.my_scroller.resize();
            },100);
              
          }
        }
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
     // console.log("isScrol:"+this.isScrol);  
    }
  },
  beforeDestroy:function(){
    console.log("beforeDestroy");
   
  },
  created:function(){
      this.commonImgUrl=this.data.config.imgQ+"gift/score/";http:
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