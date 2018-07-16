<template>
    <div class="shop-service">
        <div class="advisor-item" v-for="(item,index) in advisor" :key="index">
            <div class="advisor-img">
                <img v-if="item.head_img==''" src="../assets/img/user_pic_m.png">
                <img v-else :src="baseUrl+item.head_img" alt="">
            </div>
            <div class="advisor-content">
                <div class="advisor-name">{{item.title}}:{{item.nick_name}}</div>
                <div class="advisor-tel"><img src="../assets/img/tel.png" alt="">{{item.mobile}}</div>
                <div class="advisor-btns">
                    <a :href="'sms:'+item.mobile"><img src="../assets/img/message.png" alt=""></a>
                    <a :href="'tel:'+item.mobile"><img src="../assets/img/call.png" alt=""></a>
                </div>
            </div>
            <div class="advisor-qrcode"><img :src="baseUrl+item.code_img" alt=""></div>
        </div>
        <div class="shop-info">
            <div class="shop-img">
                <img :src="baseUrl+shop.logo" alt="">
            </div>
            <div class="shop-content">
                <div class="shop-name">{{shop.name}}</div>
                <div class="shop-tel">
                    <a :href="'tel:'+shop.phone"><img src="../assets/img/tel.png" alt="">{{shop.phone}}</a>
                </div>
                <div class="shop-addr">
                    <img src="../assets/img/location.png" alt="">{{shop.address}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    name: "specialService",
    data() {
        return {
            baseUrl: baseUrl,
            advisor: [],
            shop: []
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
            url: baseUrl + "/app/home/list_exclusive_advisor",
            data: {
                token: localStorage['token']
            }
        })
            .then(res => {
                console.log(res);
                if (res.data.state) {
                    that.advisor = res.data.result.advert_info;
                    that.shop = res.data.result.store_info[0];
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
.shop-service{
    width: 100%;
    height: 100vh;
    background: #f5f5f5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: .2rem .3rem;
    box-sizing: border-box;
    font-size: .3rem;
}
.advisor-item{
    width: 100%;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    border: 1px solid #ededed;
    border-radius: 4px;
    margin: .1rem 0;
}
.advisor-img{
    width: 1.3rem;
    height: 1.3rem;
    margin: 0 0 0 .2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    overflow: hidden;
}
.advisor-img>img,
.advisor-qrcode>img,
.shop-img>img{
    width: 100%;
    height: 100%;
}
.advisor-qrcode{
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 .2rem 0 0;
}
.advisor-content{
    width: 2.8rem;
    height: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.advisor-tel{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #5ed451;
}
.advisor-tel>img,
.shop-tel>a>img{
    width: .28rem;
	height: .3rem;
    margin: 0 .1rem 0 0;
}
.advisor-btns{
    width: 100%;
    display: flex;
    justify-content: space-around;
}
.advisor-btns>a{
    display: inline-flex;
    width: .71rem;
    height: .71rem;
    overflow: hidden;
	border-radius: 50%;
    align-items: center;
    justify-content: center;
}
.advisor-btns>a>img{
    width: 100%;
}
.shop-info{
    width: 100%;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    border: 1px solid #ededed;
    border-radius: 4px;
    margin: .1rem 0 0 0;
}
.shop-img{
    width: 2.8rem;
	height: 2rem;
    margin: 0 0 0 .2rem;
}
.shop-content{
    width: 3.5rem;
    height: 2rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
}
.shop-tel{
    width: 100%;
    display: flex;
}
.shop-tel>a{
    display: inline-flex;
    width: 100%;
    align-items: center;
    justify-content:flex-start;
    color: #5ed451;
}
.shop-addr{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content:flex-start;
    color: #37acff;
}
.shop-addr>img{
    width: .28rem;
	height: .36rem;
    margin: 0 .1rem 0 0;
}
</style>
