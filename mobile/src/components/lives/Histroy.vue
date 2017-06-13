<template>
  <div class="swiper-slide">
    <div class="content-slide review" v-bind:style="{height:divHeight+'px'}">
      <ul>
        <li  v-for="(item, index)  in videoList" >

          <router-link :to="{name:'live_detail',params:{live_id:item.liveId,item_id:item.item_id }}" class="formerly clearfix">
            <em class="f-l">{{ index+1 }}</em>
            <p class="f-l omg">{{ item.title}}</p>
            <span class="f-r">{{ item.created_at}}</span>
          </router-link>
        </li>
        
      </ul>
    </div>
  </div>
</template>

<script>
  
export default {
  data () {
    return {
       videoList:[]
    }
  },
  props:["live_id","divHeight"],
  methods:{
    getHistroy:function(){
      this.get(this.data.config.api+"/histroy/list",{"live_id":this.live_id}).then(response => {
          console.log(response.data);
          if(response.data.status==1){
            for(var i=0;i<response.data.data.length;i++){
              response.data.data[i].liveId=this.live_id;
              response.data.data[i].created_at=this.getDateToString(response.data.data[i].created_at,"MM-dd HH:mm:ss");
            }
            this.videoList=response.data.data;
          }
      }, response => {
          console.log(response);
      });
    }
  },
  beforeDestroy:function(){
    
    
  },
  created:function(){
    this.getHistroy();
  }

}

</script>

