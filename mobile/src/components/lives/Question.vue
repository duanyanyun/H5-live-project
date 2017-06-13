<template>
  <div class="swiper-slide posr">
    <div class="content-slide ques-ask">
      <div class="ques-tab">
        <span v-on:click="selectTab(1)" v-bind:class="{ cur: allQuestion }" >所有问答</span>
        <span v-on:click="selectTab(2)" v-bind:class="{ cur: myQuestion }" >我的问答</span>
      </div>
      <div class="ques-contain">
        <!--所有问答-->
        <div v-show="allQuestion" class="ques-slide" v-bind:style="{height:(divHeight-50) +'px'}">
          <div class="ques-cont">
            <ul>
              <li v-for="item in allQuestionItem">
                    <!--问-->  
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

        </div>
        <!--所有问答-->
        <!--我的问答-->
        <div v-show="myQuestion" class="ques-slide pdb42" v-bind:style="{height:(divHeight-50) +'px'}">
          <div class="ques-cont">
            <ul>
              <li  v-for="item in myQuestionItem">
                <!--问-->
                <div v-if="item.data.question==undefined" class="quesion fn14 color-s444">
                  <em class="f-l q-icon"></em>
                  <div class="ask-cont">
                    <div>
                      <span class="f-l">{{ item.data.nickname }}【问】：</span>
                      <p v-html="item.data.content"></p>
                    </div>
                    <div class="reply-menu clearfix">
                      <p class="time f-l">{{  item.data.created_at }}</p>
                      <a v-if="isTeacher" v-on:click="replyClick(item.data.nickname,item.sn)" class="f-r">回复</a>
                    </div>
                  </div>
                </div>

                <div v-else >
                    <!--问-->  
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
                </div>

              </li>
            </ul>
          </div>
          
        </div>
        <!--我的问答-->

      </div>

    </div>


    <!-- 发布评论 -->
    <send-box ref="quest" v-show="myQuestion" v-on:timer-error="timer" v-on:send-click="sendQuestion"   v-bind:live_id="live_id" ></send-box>
  </div>
</template>


<script>
import SendBox from '@/components/lives/SendBox'
  
export default {
  data () {  
    return {
       allQuestion:true,
       myQuestion:false,
       myQuestionItem:[],
       allQuestionItem:[],
       reply:{user_name:"",reply_id:0}
    }
  },
  props:["live_id","divHeight","isTeacher"],
  components:{
    SendBox
  },
  methods:{
    timer:function(msg){
      this.$emit('timer-error',msg);
    },
    getQuestion:function(){
      //console.log("this.live_id:"+this.live_id);
      this.get(this.data.config.api+"/live/answers",{"live_id":this.live_id}).then(response => {
        //console.log(response.data);
        if(response.data.status==1){
          if(response.data.data.all!=null){
            for (var i = 0; i < response.data.data.all.length; i++) {
              if(response.data.data.all[i].data.question!=undefined){
                response.data.data.all[i].data.question.created_at=this.getDateTime(response.data.data.all[i].data.question.created_at,"MM-dd HH:mm:ss");
              }
              response.data.data.all[i].data.created_at=this.getDateTime(response.data.data.all[i].data.created_at,"MM-dd HH:mm:ss");
            }
            this.allQuestionItem=response.data.data.all;
          }
          if(response.data.data.my!=null){
            for (var i = 0; i < response.data.data.my.length; i++) {
              if(response.data.data.my[i].data.question!=undefined){
                response.data.data.my[i].data.question.created_at=this.getDateTime(response.data.data.my[i].data.question.created_at,"MM-dd HH:mm:ss");
              }
              response.data.data.my[i].data.created_at=this.getDateTime(response.data.data.my[i].data.created_at,"MM-dd HH:mm:ss");
            }
            this.myQuestionItem=response.data.data.my;
          }
        }
      }, response => {
          console.log(response);
      });
    },
    selectTab:function(index){
      if(index==1){
        this.allQuestion=true;
        this.myQuestion=false;
      }else{
        this.allQuestion=false;
        this.myQuestion=true;
      }
    },
    setQuestionItem:function(data){
      var user= this.getUser();
      data.data.created_at=this.getDateTime(data.data.created_at,"MM-dd HH:mm:ss");
      if(data.data.question!=undefined){
        this.removeAnswerItem(data);
        data.data.question.created_at=this.getDateTime(data.data.question.created_at,"MM-dd HH:mm:ss");
        this.allQuestionItem.push(data);
        if(user!=null){
          if(user.user_id==data.data.question.user_id){
            this.myQuestionItem.push(data);
          }
        }
      }else{
        
        if(user!=null){
          if(this.isTeacher||user.user_id==data.user_id){
            this.myQuestionItem.push(data);
          }
        }
      }
    },
    removeAnswerItem:function(data){
      for (var i = 0; i < this.myQuestionItem.length; i++) {
         var item= this.myQuestionItem[i];
         if(item.sn==data.data.question.sn){
           this.myQuestionItem.splice(i,1);
           break;
         }
      }
    },
    sendQuestion:function(content){
      
      var model;
      var url="";
      var isReply=false;
      if(this.reply.reply_id>0){
        if(content.indexOf(this.reply.user_name)>-1){
          content=content.replace(this.reply.user_name,"");
          url=this.data.config.api+"/live/answer";
          model={"live_id": this.live_id,"content":content,"question_id":this.reply.reply_id};
          isReply=true;
        }else{
          url=this.data.config.api+"/live/ask";
          model={"live_id": this.live_id,"content":content};
          isReply=false;
        }
      }else{
        url=this.data.config.api+"/live/ask";
        model={"live_id": this.live_id,"content":content};
        isReply=false;
      }
      this.post(url,model).then(response => {
        if(response.data.status==1){
          this.reply.reply_id=0;
          this.reply.user_name="";
        }
      }, response => {
          console.log(response);
      });
      
    },
    replyClick:function(name,sn){
        //console.log("replyClick:"+name+"  sn:"+sn);
        if(typeof(this.$refs.quest.replyContent) === "function"){
            this.$refs.quest.replyContent("[回复"+name+"]:");
            this.reply.user_name="[回复"+name+"]:";
            this.reply.reply_id=sn;
        }
    }

  },
  created:function(){
    this.getQuestion();
  }

}
</script>
