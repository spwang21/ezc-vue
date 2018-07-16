<template>
  <div class="container">
			<!--LOGO-->
			<div class="logo">
				<img src="../assets/img/logo.png" />
			</div>
			<!--登录表单-->
			<div class="register-form">
				<!--输入手机号-->
				<div class="input-row">
					<img src="../assets/img/phone.png" />
					<span class="vertical-line"></span>
					<input type="tel" v-model="userPhone" placeholder="请输入手机号" />
				</div>
				<!--输入登录密码-->
				<div class="input-row">
					<img src="../assets/img/password.png" />
					<span class="vertical-line"></span>
					<input type="password" v-model="userPassword" placeholder="请输入密码" />
				</div>		
				<!--登录按钮-->
				<button class="login-btn" @click="login">登录</button>
				<!--去注册-->
				<div class="go-register">
					<a href="#/register">没有账号，立即注册</a>				
				</div>
				<!--相关条款-->
				<div class="clause">
					登录即代表阅读并同意
					<a href="#/clause">使用条款</a>
				</div>
			</div>
		</div>
</template>

<script>
import axios from "axios"
import md5 from "js-md5"

export default {
  name: "HelloWorld",
  data() {
    return {
      userPhone:'',
      userPassword:'',
    };
  },
  methods:{
    login(){
      var that = this;
      var mobile = this.userPhone;
      var pswd = this.userPassword;
      var passwordStr = md5(md5(pswd).toLocaleUpperCase()).toLocaleUpperCase();
      if(mobile==''){
        this.$toast('请输入手机号')
      }else if(pswd==''){
        this.$toast('请输入登录密码')
      }else{
        axios({
							method: "POST",
							url: baseUrl+"/app/User/login_h5",
							data: {
								mobile:mobile,
					      password:passwordStr
							}
						}).then(res=> {
							if(res.data.state){
                localStorage.setItem("token",res.data.result.token);
                localStorage.setItem("userId",res.data.result.id);
                that.$router.push('/');
              }else{
                that.$toast(res.data.msg)
              }						
						})
						.catch(err=> {
							console.log(err);
						});
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  background: url(../assets/img/bg.png) no-repeat;
  background-size: cover;
}
.logo {
  width: 3.62rem;
  height: 1.57rem;
  margin: 1.64rem 0 0 0;
  overflow: hidden;
}
.logo > img {
  width: 100%;
}
.register-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 6.87rem;
  margin: 1rem 0 0 0;
}
.input-row {
  display: flex;
  align-items: center;
  width: 100%;
  height: 1.05rem;
  border-bottom: 1px solid #a9a9a9;
}
.input-row > img {
  width: 0.48rem;
  height: 0.48rem;
}
.vertical-line {
  display: inline-block;
  width: 1px;
  height: 0.3rem;
  margin: 0 0.25rem;
  background: #a9a9a9;
}
.input-row > input {
  width: 4.3rem;
  height: 0.53rem;
  background: inherit;
  outline: none;
  border: 0;
  padding: 0;
  font-size: 0.3rem;
  color: #838383;
}
.login-btn {
  width: 100%;
  height: 0.8rem;
  background: #1fa7ec;
  color: #fff;
  font-size: 0.34rem;
  border-radius: 4px;
  margin: 1rem 0 0 0;
  outline: none;
  border: 0;
}
.go-register {
  width: 100%;
  height: 1rem;
  display: flex;
  justify-content: flex-end;
  margin: 0.5rem 0 0 0;
}
.go-register > a {
  font-size: 0.3rem;
  color: #1fa7ec;
}
.clause {
  width: 100%;
  margin: 1.6rem 0 0 0;
  font-size: 0.28rem;
  color: #838383;
  text-align: center;
}

.clause > a {
  font-size: 0.28rem;
  color: #1fa7ec;
}
</style>
