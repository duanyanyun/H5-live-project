<template>
<transition :name="transitionName">
	<div class="login-page child-view">
		<div class="nav"><a class="back" onclick="window.history.go(-1)"></a>注册</div>
		<div class="contain pdlr12">
			<form>
				<input v-model="userPhone" type="text" placeholder="手机号" maxlength="11" />
				<input v-model="userName" type="text" placeholder="用户名" />
				<input v-model="userPwd" type="password" placeholder="设置密码" />
				<input v-model="verifyPwd" type="password" placeholder="确认密码" />
				<div class="argee clearfix">
				
				</div>
				<input v-on:click="goNext()" class="submit" type="button" value="注册"/>
			</form>
			<div class="go-login">
				<span>已有账号？</span>
				<a onclick="window.history.go(-1)">立即登录</a>
			</div>
		</div>
		<!--提示框-->
		<div class="toast" v-show="isToast">
			<span>{{toastText}}</span>
		</div>
	</div>
</transition>
</template>

<script src="../../assets/js/register.js"></script>
<style src="../../assets/css/login.css" scoped />