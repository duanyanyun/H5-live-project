<template>
<transition :name="transitionName">
	<div class="login-page child-view">
		<div class="nav"><a class="back" onclick="window.history.go(-1)"></a>登录</div>
		<div class="contain pdlr12">
				<input v-model="userId" type="text" placeholder="用户名/手机号" />
				<input v-model="userPwd" type="password" placeholder="密码" />
				<input class="submit" v-on:click="submit()" type="button" value="登 录"/>
			<div class="go-on">
				<a href="#/register">立即注册</a>
			</div>
			<div class="third">
				<div class="line"></div>
				<h3><span>第三方登录</span></h3>
				<div><a></a></div>
			</div>
		</div>
		
		<!--提示框-->
		<div class="toast" v-show="isToast">
			<span>{{toastText}}</span>
		</div>
	</div>
</transition>
</template>

<script src="../../assets/js/login.js"></script>
<style src="../../assets/css/login.css" scoped />