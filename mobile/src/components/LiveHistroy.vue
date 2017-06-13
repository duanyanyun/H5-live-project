<template>
<transition :name="transitionName">
  <div id="app" class="container child-view">
    <div class="nav"><a class="back" onclick="window.history.go(-1)"></a>历史直播<span>({{created_at}})</span></div>
    <!-- 视频处 -->
    <div class="video" v-show="isVideoShow" ></div>

    <div class="wrappe live-history">
      <div class="tabs channel-info clearfix">
          <a v-on:click="seleteTab(1)" v-bind:class="{ active:isOpinionShow }" >直播<em></em></a>
          <a v-on:click="seleteTab(2)" v-bind:class="{ active:isInteractionShow }" >互动<em></em></a>
          <a v-on:click="seleteTab(3)" v-bind:class="{ active:isQuestionShow }" >问答<em></em></a>
      </div>
      <div id="tabs-container" class="swiper-container">
        <div class="swiper-wrapper">
            <div class="swiper-slide posr">
            <transition name="slide-left">
              <div v-if="docState === 'hisOpinion'" key="hisOpinion" class="content-slide history-opinion child-view" v-bind:style="{height:divHeight-44+'px'}" >
                <ul>
                  <li  v-for="(item, index) in opinions"  class="clearfix">
                    <div class="head-img f-l">
                      <img v-bind:src="item.data.head_img"  />
                    </div>
                    <div class="clearfix history-cont">
                        <em></em>
                        <div class="text-body">
                          <div class="clearfix">
                            <span class="f-l">{{ item.data.nickname }}</span>
                            <span class="f-r">{{ item.data.created_at }}</span>
                          </div>
                          <p v-html="item.data.content"></p>
                        </div>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div v-if="docState === 'hisInteraction'" key="hisInteraction" class="content-slide child-view" v-bind:style="{height:divHeight-44+'px'}">
                  <ul>
                    <li v-for="(item,index) in interactions"  class="clearfix">
                      <div class="head-img f-l">
                        <img v-bind:src="item.data.head_img" />
                        
                      </div>
                      <div  class="slide-cont">
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
              </div>
                
              <div v-if="docState === 'hisQuestion'" key="hisQuestion" class="content-slide ques-cont child-view" v-bind:style="{height:divHeight-44+'px'}">
                <ul>
                   <li v-for="item in allQuestionItem"> 
                      <div class="quesion fn14 color-s444">
                        <em class="f-l q-icon"></em>
                        <div class="ask-cont">
                          <div>
                            <span class="f-l">{{ item.data.question.nickname }}【问】：</span>
                            <p v-html="item.data.question.content" ></p>
                          </div>
                          <div class="reply-menu clearfix">
                            <p class="time f-l">{{ item.data.question.created_at }}</p>
                          </div>
                        </div>
                      </div>
                      <!--答-->
                      <div class="answer fn14 color-s444">
                        <em class="f-l a-icon"></em>
                        <div class="ask-cont">
                          <span class="f-l"><span>{{ item.data.nickname }}</span>【答】：</span>
                          <p v-html="item.data.content" ></p>
                          <div class="reply-menu clearfix">
                            <p class="time f-l">{{ item.data.created_at }}</p>
                          </div>
                        </div>
                      </div>
                  </li>
                </ul>  
              </div>
            </transition>

           </div>

        </div>
      </div>
    </div>
    
  </div>
</transition> 
</template>

<script>

  export default {
    data () {
      return {
        isVideoShow:false,
        divHeight:0,
        isOpinionShow:true,
        isInteractionShow:false,
        isQuestionShow:false,
        opinions:[],
        interactions:[],
        allQuestionItem:[],
        item_id:0,
        live_id:0,
        created_at:'',
        transitionName: 'slide-left',
        docState:'hisOpinion'
      }
    },
    methods:{
      getDetail:function(){
        this.get(this.data.config.api+"/histroy/detail",{"live_id": this.live_id,"item_id":this.item_id}).then(r => {
            
            if(r.data.status==1){
              for (var i = 0; i < r.data.data.opinions.length; i++) {
                r.data.data.opinions[i].data.head_img=this.data.config.img+""+r.data.data.opinions[i].data.head_img;
                r.data.data.opinions[i].data.created_at=this.getDateTime(r.data.data.opinions[i].data.created_at,"MM-dd HH:mm:ss");
              }
 
              for (var i = 0; i < r.data.data.interactions.length; i++) {
                r.data.data.interactions[i].data.head_img=this.data.config.img+""+r.data.data.interactions[i].data.head_img;
                r.data.data.interactions[i].data.created_at=this.getDateTime(r.data.data.interactions[i].data.created_at,"MM-dd HH:mm:ss");
                r.data.data.interactions[i].isMoreOpen=false;
              }

              if(r.data.data.answers!=null){
                for (var i = 0; i < r.data.data.answers.length; i++) {
                  if(r.data.data.answers[i].data.question!=undefined){
                    r.data.data.answers[i].data.question.created_at=this.getDateTime(r.data.data.answers[i].data.question.created_at,"MM-dd HH:mm:ss");
                  }
                  r.data.data.answers[i].data.created_at=this.getDateTime(r.data.data.answers[i].data.created_at,"MM-dd HH:mm:ss");
                }
                this.allQuestionItem=r.data.data.answers;
              }
              this.opinions=r.data.data.opinions;
              this.interactions=r.data.data.interactions;
             
            }
        }, response => {
            console.log(response);
        });

      },
      seleteTab:function(i){
        switch(i){
          case 1:
            this.isOpinionShow=true;
            this.isInteractionShow=false;
            this.isQuestionShow=false;
            this.docState='hisOpinion'
            break;
          case 2:
            this.isOpinionShow=false;
            this.isInteractionShow=true;
            this.isQuestionShow=false;
            this.docState='hisInteraction'
            break;
          case 3:
            this.isOpinionShow=false;
            this.isInteractionShow=false;
            this.isQuestionShow=true;
            this.docState='hisQuestion'
            break;
        }
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
      }

    },
    created:function(){

    },
    mounted:function(){
      this.changeHeight();
      this.item_id= this.$route.params.item_id;
      this.live_id= this.$route.params.live_id;
      this.created_at=this.item_id.toString().substr(2,2)+'/'+this.item_id.toString().substr(4,2)+'/'+this.item_id.toString().substr(6,2);
      this.getDetail();
    }

  }

</script>

<style>
    .fold-enter-active {
        animation-name: fold-in;
        animation-duration: .5s;
    }
    .fold-leave-active {
        animation-name: fold-out;
        animation-duration: .5s;
    }
    @keyframes fold-in {
        0% {
            transform: translate3d(0, 100%, 0);
        }
        50% {
            transform: translate3d(0, 50%, 0);
        }
        100% {
            transform: translate3d(0, 0, 0);
        }
    }
    @keyframes fold-out {
        0% {
            transform: translate3d(0, 0, 0);
        }
        50% {
            transform: translate3d(0, 50%, 0);
        }
        100% {
            transform: translate3d(0, 100%, 0);
        }
    }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->


