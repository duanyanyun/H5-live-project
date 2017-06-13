<template>
<transition :name="transitionName">
  <div id="app" class="container child-view">
    <!--签到-->
    <div v-show="isUserSign" class="sign-box">
      <span v-on:click="clickUserSign"  class="sign-in">签到</span>
      <span class="sign-person">({{userSignCount}})</span>
    </div>
    <!-- 视频处 -->
    <div class="video" v-show="isVideoShow" ></div>
    <div class="wrapper">
      <div class="tabs channel-info clearfix">
          <router-link :to="{ name: 'opinion'}" active-class="active" >直播<em></em></router-link>
          <router-link :to="{ name: 'interaction'}" active-class="active">互动<em></em></router-link>
          <router-link :to="{ name: 'question'}" active-class="active">问答<em></em></router-link>
          <router-link :to="{ name: 'histroy'}" active-class="active">回顾<em></em></router-link>
          <router-link :to="{ name: 'team'}" active-class="active">我们<em></em></router-link>
      </div>
      <div id="tabs-container" class="swiper-container">
        <div class="swiper-wrapper" >
          <transition name="slide-left">
            <router-view v-bind:live_id="live_id" v-bind:opinions="opinions"  
             v-bind:interactions="interactions" v-bind:is-teacher="isTeacher"
             v-bind:div-height="divHeight" v-on:timer-error="timerError"
             v-on:get-more-msg="upMessages"
             ref="chil" class="child-view" ></router-view>
          </transition>   
        </div>
      </div>
    </div>
    <!--提示框-->
    <div class="toast" v-show="isToast" >
      <span>{{ toastText }}</span>
    </div>
  </div>
</transition>
</template>

<script src="../assets/js/live.js" ></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="../assets/css/live.css"  />

