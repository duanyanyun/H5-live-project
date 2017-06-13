<template>
	<div class="login-page">
		<div class="nav"><a class="back" onclick="window.history.go(-1)"></a>注册</div>
		<div class="contain pdlr12">
			<form action="" >
				<input type="text" placeholder="用户名" />
				<input type="password" placeholder="设置密码" />
				<input type="password" placeholder="确认密码" />
				<div class="argee clearfix">
					<input class="f-l" id="deal" type="checkbox" checked="checked" />
					<label class="f-l" for="deal">同意<a>《用户协议》</a></label>
				</div>
				<input class="submit" type="button" value="立即注册"/>
			</form>
			<div class="go-login">
				<span>已有账号？</span>
				<a href="#/login">立即登录</a>
			</div>
		</div>
		
		<!--提示框-->
		<div class="toast">
			<img src="../../assets/images/icon_success_06.png" />
			<span>恭喜你注册成功！</span>
		</div>
	</div>
</template>

<style src="../../assets/css/login.css" scoped />