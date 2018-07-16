<template>
    <div class="sign-page">
        <div class="sign-info">
            <div class="sign-btn">
                <a href="javascript:;" v-html="signText" @click="signUp"></a>
            </div>
            <div class="sign-record">
                累计签到
                <span>{{signInfo.sign_num}}天</span>，共获得
                <span>{{signInfo.sign_point}}积分</span>
            </div>
        </div>
        <div class="sign-rule">
            <div class="sign-rule-title">
                <img src="../assets/img/ic_hdgz.png" />
                <span>活动规则</span>
            </div>
            <div class="sign-rule-text">
                <p>会员每日签到一次就能获得5积分，获得的积分可用来进行商品、套餐以及卡券的兑换。</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    name: "memberSign",
    data() {
        return {
            signText: "",
            signInfo: "",
            signStatus: ""
        };
    },
    methods: {
        signUp() {
            if (this.signStatus == 0) {
                this.$toast("已签到，请明天再来");
            } else {
                var that = this;
                //签到状态
                axios({
                    method: "POST",
                    url: baseUrl + "/app/Account/daily_check_in",
                    data: {
                        user_id: localStorage['userId'],
                        token: localStorage['token']
                    }
                })
                    .then(res => {
                        if (res.data.state) {
                            that.$toast("签到成功！");
                            that.signStatus = 0;
                            that.signInfo.sign_num = that.signInfo.sign_num + 1;
                            that.signInfo.sign_point =
                                that.signInfo.sign_point + 10;
                        } else {
                            that.$toast(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        },
        getUserInfo(token) {           
            var _this = this;
            axios({
                method: "POST",
                url: baseUrl + "/app/Mine/list_my_info",
                data: {
                    token:token
                }
            })
                .then(res => {
                    if (res.data.state) {
                        localStorage.setItem("userId", res.data.result.id);
                        localStorage.setItem(
                            "shopId",
                            res.data.result.home_store_id
                        );
                    } else {
                        _this.$toast(res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
    created() {
        if(this.$route.query.token==undefined){
            this.getUserInfo(localStorage['token']);
        }else{
            localStorage.setItem("token", this.$route.query.token);
            this.getUserInfo(localStorage['token']);
        };
        var that = this;
        //签到状态
        axios({
            method: "POST",
            url: baseUrl + "/app/Account/daily_check_state",
            data: {
                user_id: localStorage['userId'],
                token: localStorage['token']
            }
        })
            .then(res => {
                if (res.data.state) {
                    that.signInfo = res.data.result;
                    that.signStatus = res.data.result.can_sign;
                } else {
                    that.$toast(res.data.msg);
                }
            })
            .catch(err => {
                console.log(err);
            });
    },
    watch: {
        signStatus: function(val, oldVal) {
            if (val == 1) {
                this.signText = "立即<br />签到";
            } else {
                this.signText = "<i class='van-icon van-icon-success' style='font-size:0.6rem;margin:0 0 0.1rem 0;'></i><div>已签到</div>";
            }
        }
    }
};
</script>

<style scoped>
.sign-info {
    width: 100%;
    height: 4.2rem;
    background: #37acff;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.sign-btn {
    width: 1.8rem;
    height: 1.8rem;
    margin: 0.6rem 0 0 0;
    overflow: hidden;
    display: flex;
    align-items: center;
    /*box-sizing: content-box;*/
    border-radius: 50%;
    border: 0.1rem solid #fff;
    background: #fff;
    box-shadow: 0 0 0.1rem 0.1rem rgba(225, 225, 225, 0.6);
}
.sign-btn > a {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 1.98rem;
    justify-content: center;
    font-size: 0.36rem;
    color: #37acff;
}
.sign-btn > a >.van-icon.van-icon-success{
    font-size: .5rem;
    margin: 0 0 .1rem 0;
}
.sign-record {
    width: 100%;
    margin: 0.4rem 0 0 0;
    white-space: nowrap;
    text-align: center;
    font-size: 0.34rem;
    color: #fff;
}
.sign-record > span {
    color: #fff000;
}
.sign-rule {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0;
}
.sign-rule-title {
    display: flex;
    width: 100%;
    height: 0.7rem;
    border-bottom: 1px solid #e6e6e6;
    padding: 0 0.2rem;
    box-sizing: border-box;
    font-size: 0.28rem;
    color: #37acff;
    align-items: center;
}
.sign-rule-title > img {
    width: 0.26rem;
    height: 0.29rem;
    margin: 0 0.2rem 0 0;
}
.sign-rule-text {
    width: 100%;
    padding: 0 0.2rem 0 0.66rem;
    box-sizing: border-box;
    font-size: 0.28rem;
    color: #808080;
}
.sign-rule-text > p {
    margin: 0.1rem 0 0 0;
    text-align: left;
    line-height: 0.43rem;
}
</style>

