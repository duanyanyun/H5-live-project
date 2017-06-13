export default{
	data(){
		return{
			isToast: false,
			toastText: '',
			userPhone:'',
			userName:'',
			userPwd:'',
			verifyPwd:'',
			count:60,
			intervalCode:null,
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
		//注册
		goNext:function(){
			if (this.userPhone=='') {
				this.isToast = true;
				this.toastText = '手机号不能为空';
				this.timer();
				return false;
			};
			if(!(/^13[\d]{9}$|^14[5,7]{1}\d{8}$|^15[^4]{1}\d{8}$|^17[0,6,7,8]{1}\d{8}$|^18[\d]{9}$/.test(this.userPhone))){
		      	this.isToast = true;
				this.toastText = '手机号格式错误';
				this.timer();
				return false;
		    };
			if (this.userName=='') {
				this.isToast = true;
				this.toastText = '用户名不能为空';
				this.timer();
				return false;
			};
			if (this.userPwd=='') {
				this.isToast = true;
				this.toastText = '密码不能为空';
				this.timer();
				return false;
			};
			if (this.userPwd.length <= 5) {
				this.isToast = true;
				this.toastText = '密码不少于6位数';
				this.timer();
				return false;
			};
			if (this.userPwd != this.verifyPwd) {
				this.isToast = true;
				this.toastText = '确认密码不一致';
				this.timer();
				return false;
			};
			/*
			if ( document.getElementById('deal').checked == false) {
				this.isToast = true;
				this.toastText = '请同意';
				this.timer();
				return false;
			};
			*/
			this.register();
		},
		// 验证
		register:function(){
            var invite_code = this.getInviteCode();
			this.get(this.data.config.api+"/user/register",{'nickname':this.userName,'password':this.userPwd,'phone':this.userPhone,'invite_code':invite_code}).then(r=>{
				console.log(r.data);
				var that = this;
				if (r.data.status==1) {
					this.isToast = true;
					this.toastText = '注册成功';
                    this.setUser(r.data.data);
					setTimeout(function(){
						that.isToast = false;
						that.$router.push('/live/opinion');
					},500);
				}else{
					if (r.data.data=='昵称已存在') {
						this.isToast = true;
						this.toastText = '昵称已存在';
						this.timer();
					}else if(r.data.data=='手机已存在'){
						this.isToast = true;
						this.toastText = '手机已存在';
						this.timer();
					}
				}
			},response=>{
				console.log(response);

			});
		}
		
	}
}