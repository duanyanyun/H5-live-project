export default {
	data (){
		return{
			isToast: false,
			toastText: '',
			userId: '',
            userPwd: '',
            transitionName: 'slide-left'
		}
	},
	methods:{
		timer:function(){
			var that = this;
			setTimeout(function(){
				that.isToast = false;
			},1000);
		},
		// 登录
		submit:function(){
			if (this.userId=='') {
				this.isToast = true;
				this.toastText = '用户名/手机号不能为空';
				this.timer();
				return false;
			}else if(this.userPwd=='') {
				this.isToast = true;
				this.toastText = '密码不能为空';
				this.timer();
				return false;
			};
			this.login();
		},
		login:function(){
			this.get(this.data.config.api+"/user/login",{user_id:this.userId,pwd:this.userPwd}).then(r=>{
				console.log(r.data);
				var that = this;
				if (r.data.status==0) {
					this.isToast = true;
					this.toastText = '用户名或密码错误';
					this.timer();
				}else if(r.data.status==1){
					this.isToast = true;
					this.toastText = '登录成功';
                    this.setToken(r.data.token)
                    this.setUser(r.data.data);
					setTimeout(function(){
						that.isToast = false;
						that.$router.push('/live/opinion');
					},500);
				}
			},response=>{
				console.log(response);
			});
		}
	}
}