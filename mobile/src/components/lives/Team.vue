<template>
  <div class="swiper-slide">
    <div class="content-slide team">
      <div class="team-tab">
        <span v-on:click="selectTab(1)" v-bind:class="{ cur: aboutUs }">关于我们</span>
        <span v-on:click="selectTab(2)" v-bind:class="{ cur: teamTab }">团队介绍</span>
      </div>
      <div class="team-contain">
        <!-- 关于我们 -->
        <div class="team-slide" v-show="aboutUs" v-bind:style="{height:divHeight-50+'px'}">
          <div class="about">
            <div>
              <h2>企业介绍</h2>
              <p>约牛财经专注于中国证券投资领域，总部位于北京。云南产业投资管理有限公司（下称云南产投）是约牛财经旗下全资控股的证券投资咨询平台，作为一家专业的互联网投资咨询服务平台，约牛财经致力于为投资者提供专业、合规、高效、实用的一站式证券投资服务。</p>
            </div>
            <div class="team-pro">
              <h2>策略产品</h2>
              <p>《约牛决策分析系统——专业版》打造最幸福的股民家园，尊享专业级体验！</p>
              <p>《约牛决策分析系统——黄金版》打造最幸福的股民家园，尊享黄金级体验！</p> 
              <p>《约牛决策分析系统——至尊版》打造最幸福的股民家园，尊享至尊级体验！</p>
            </div>
            <div>
              <h2>企业资质</h2>
              <div>
                <img src="../../assets/images/about_img_01.jpg"/>
                <img src="../../assets/images/about_img_02.jpg"/>
              </div>
            </div>
          </div>
        </div>
        <!-- 团队介绍 -->
        <div class="team-slide" v-show="teamTab" v-bind:style="{height:divHeight-50+'px'}">
          <ul>
            <li v-for="item in teams" class="clearfix">
              <div class="f-l">
                <img  v-bind:src="item.head_img" />
              </div>
              <div class="team-cont">
                <span>{{ item.nickname }}</span>
                <p>{{ item.introduction }}</p>
              </div>
            </li>
            
          </ul>
        </div>
      </div>
      

    </div>
  </div>
</template>

<script>
  
export default {
  data () {
    return {
      aboutUs:true,
      teamTab:false,
      teams:[]
    }
  },
  props:["live_id","divHeight"],
  methods:{
    getHistroy:function(){
      this.get(this.data.config.api+"/live/teams",{live_id: this.live_id}).then(response => {
          if(response.data.status==1){
             /*
            for(var i=0;i<response.data.data.length;i++){
              response.data.data[i].head_img=this.data.config.img+""+response.data.data[i].head_img;
            }
            */
            this.teams=response.data.data;
          }
      }, response => {
          console.log(response);
      });
    },
    selectTab:function(index){
      if (index==1) {
        this.aboutUs=true;
        this.teamTab=false;
      }else{
        this.aboutUs=false;
        this.teamTab=true;
      }
    }
  },
  beforeDestroy:function(){
    
    
  },
  created:function(){
    this.getHistroy();
  }

}

</script>