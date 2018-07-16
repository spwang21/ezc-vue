<template>
    <div class="about-us">
        <div class="qrcode">
            <img :src="baseUrl+qrcode" alt="">
            <p>(扫描二维码，注册并下载E掌车APP)</p>
        </div>
        <div class="menu-group">
            <router-link class="user-menu-row" to="/clause" tag="div">
                    <van-icon name="arrow" />
                    <div class="user-menu-title">使用条款</div>
            </router-link>
            <router-link class="user-menu-row" to="/404" tag="div">
                    <van-icon name="arrow" />
                    <div class="user-menu-title">意见反馈</div>
                </router-link>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    name: "aboutUs",
    data() {
        return {
            baseUrl:baseUrl,
            qrcode: ""
        };
    },
    methods:{
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
        axios({
            method: "POST",
            url: baseUrl + "/app/Account/user_spread_qrcode",
            data: {
                user_id: localStorage['userId'],
                token: localStorage['token']
            }
        })
            .then(res => {
                console.log(res);
                if (res.data.state) {
                    that.qrcode = res.data.result.img_url;
                } else {
                    that.$toast(res.data.msg);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
};
</script>

<style scoped>
.about-us {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.32rem;
    color: #666;
    background: #f5f5f5;
}
.qrcode{
    width: 100%;
    height: 50vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 0.3rem;
    color: #999;
}
.qrcode>img{
    width: 3rem;
}
.qrcode>p{
    margin: .6rem 0 0 0;
}
.menu-group{
    width: 100%;
    background: #fff;
    display: flex;
    flex-direction: column;
}
.user-menu-row {
    width: 100%;
    height: 1rem;
    border-bottom: 2px solid #f5f5f5;
    position: relative;
    display: flex;
    align-items: center;
    background: #fff;
    box-sizing: border-box;
}
.user-menu-row > i.van-icon.van-icon-arrow {
    position: absolute;
    display: inline-block;
    box-sizing: border-box;
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    text-align: right;
    font-size: 0.3rem;
    color: #999;
    padding: 0 .2rem 0 0;
}
.user-menu-title {
    margin: 0 0 0 0.3rem;
    font-size: 0.3rem;
    color: #999;
}
</style>
