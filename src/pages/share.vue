<template>
    <div class="share-page">
        <img :src="baseUrl+qrcode" alt="">
    </div>
</template>

<script>
import axios from "axios";
import wx from "weixin-js-sdk";
export default {
    name: "sharePage",
    data() {
        return {
            baseUrl: baseUrl,
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
.share-page {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url(../assets/img/bg_share.png) no-repeat;
    background-size: 100% 100%;
}
.share-page > img {
    width: 2.6rem;
    margin: 0 0 1rem 0;
}
</style>
