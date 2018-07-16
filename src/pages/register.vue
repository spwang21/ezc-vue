<template>
    <div class="container">
        <!--LOGO-->
        <div class="logo">
            <img src="../assets/img/logo.png" />
        </div>
        <!--注册表单-->
        <div class="register-form">
            <div class="input-row">
                <img src="../assets/img/phone.png" />
                <span class="vertical-line"></span>
                <input type="tel" v-model="userPhone" placeholder="请输入手机号" @blur="checkPhone" />
                <button class="getcode-btn" @click="getCode" :disabled="btnDisable">{{btnText}}</button>
            </div>
            <div class="input-row">
                <img src="../assets/img/code.png" />
                <span class="vertical-line"></span>
                <input type="text" v-model="checkCode" placeholder="请输入验证码" />
            </div>
            <div class="input-row">
                <img src="../assets/img/password.png" />
                <span class="vertical-line"></span>
                <input type="password" v-model="userPassword" placeholder="请设置密码(6-14位数字、字母)" @blur="checkPassword" />
            </div>
            <div class="input-row">
                <img src="../assets/img/password.png" />
                <span class="vertical-line"></span>
                <input type="password" v-model="passwordConfirm" placeholder="请确认设置的密码" @blur="confirmPassword" />
            </div>
            <button class="login-btn">注册</button>
            <div class="go-register">
                <a href="#/login">已有账号，立即登录</a>
            </div>
            <div class="clause">
                登录即代表阅读并同意
                <a href="#/clause">使用条款</a>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "register",
    data() {
        return {
            btnText: "获取验证码",
            btnDisable: false,
            userPhone: "",
            checkCode: "",
            userPassword: "",
            passwordConfirm: ""
        };
    },
    methods: {
        getCode() {
            var that = this;
            if (/^1[345678]\d{9}$/.test(this.userPhone)) {
                console.log(this.userPhone);
                axios({
                    method: "POST",
                    url: baseUrl + "/app/User/send_msg",
                    data: {
                        mobile: that.userPhone,
                        type: 1
                    }
                })
                    .then(res => {
                        console.log(res);
                        if (res.data.state) {
                            var second = 120;
                            that.btnDisable = true;
                            that.btnText = "还剩" + second + "秒";
                            var timer = setInterval(() => {
                                second--;
                                if (second > 0) {
                                    that.btnText = "还剩" + second + "秒";
                                } else {
                                    clearInterval(timer);
                                    that.btnDisable = false;
                                    that.btnText = "获取验证码";
                                    second = 120;
                                }
                            }, 1000);
                        } else {
                            that.$toast(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                this.$toast("请输入正确的手机号");
            }
        },
        checkPhone() {
            if (this.userPhone == "") {
                this.$toast("请输入手机号码");
            } else if (!/^1[345678]\d{9}$/.test(this.userPhone)) {
                this.$toast("手机号输入有误");
            }
        },
        checkPassword() {
            if (this.userPassword == "") {
                this.$toast("密码不能为空！");
            } else if (
                this.userPassword.length < 6 ||
                this.userPassword.length > 14
            ) {
                this.$toast("密码位数不符！");
            } else if (!/^[0-9a-zA-Z]*$/g.test(this.userPassword)) {
                this.$toast("密码只可包含数字和字母");
            }
        },
        confirmPassword() {
            if (this.passwordConfirm == "") {
                this.$toast("密码不能为空！");
            } else if (!(this.passwordConfirm == this.userPassword)) {
                this.$toast("密码输入不一致！");
            }
        },
        goRegister() {
            if (
                this.userPhone == "" ||
                this.checkCode == "" ||
                this.userPassword == "" ||
                this.passwordConfirm == ""
            ) {
                this.$toast("输入项不能为空");
            } else if (!/^1[345678]\d{9}$/.test(this.userPhone)) {
                this.$toast("手机号输入有误");
            } else if (
                this.userPassword.length < 6 ||
                this.userPassword.length > 14
            ) {
                this.$toast("密码位数不符！");
            } else if (!/^[0-9a-zA-Z]*$/g.test(this.userPassword)) {
                this.$toast("密码只可包含数字和字母");
            } else if (!(this.passwordConfirm == this.userPassword)) {
                this.$toast("密码输入不一致！");
            } else {
                var that = this;
                axios({
                    method: "POST",
                    url: baseUrl + "/app/User/register",
                    data: {
                        organize_id: organize_id,
                        mobile: that.userPhone,
                        mobile_code: that.checkCode,
                        password: userPassword,
                        check_password: passwordConfirm
                    }
                })
                    .then(res => {
                        console.log(res);
                        if (res.data.state) {
                            that.$router.push("/login");
                        } else {
                            that.$toast(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }
    }
};
</script>

<style scoped>
.container {
    display: flex;
    width: 100%;
    height: 100vh;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background: url(../assets/img/bg.png) no-repeat;
    background-size: cover;
}
.logo {
    width: 3.62rem;
    height: 1.57rem;
    display: inline-flex;
    align-items: center;
    margin: 1.5rem 0 0 0;
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
    margin: .8rem 0;
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
    width: 4.2rem;
    height: 0.53rem;
    background: inherit;
    outline: none;
    border: 0;
    padding: 0;
    font-size: 0.3rem;
    color: #838383;
}
.getcode-btn {
    width: 1.46rem;
    height: 0.63rem;
    background: #1fa7ec;
    font-size: 0.24rem;
    color: #fff;
    border-radius: 4px;
    outline: none;
    border: 0;
    margin: 0 0 0 0.1rem;
}
button.getcode-btn:disabled {
    background: #a9a9a9;
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
    display: flex;
    justify-content: flex-end;
    margin: .3rem 0 0 0;
}
.go-register > a {
    font-size: 0.3rem;
    color: #1fa7ec;
}
.clause {
    width: 100%;
    margin: 1rem 0 0 0;
    font-size: 0.28rem;
    color: #838383;
    text-align: center;
}

.clause > a {
    font-size: 0.28rem;
    color: #1fa7ec;
}
</style>

