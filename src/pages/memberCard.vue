<template>
    <div class="member-card">
        <van-tabs>
            <van-tab v-for="(item,index) in cardInfo" :title="item.title+'('+item.cards.length+')'" :key="index">
                <NoData v-if="item.cards.length==0" prompt="暂无数据"></NoData>
                <div v-else class="card-item" v-for="(x,n) in item.cards" :key="n">
                    <div class="coupons" v-if="index<2"  :class="{'online':x.is_online,'underline':!x.is_online}">
                        <div class="coupons-rule">
                            <span v-if="x.is_requirement">满{{x.true_coupon_requirement_price}}元可抵用{{x.true_coupon_price}}元</span>&nbsp;&nbsp;
                            <span v-if="x.is_online">全场使用</span><span v-else>仅店内使用</span>
                        </div>
                        <div class="coupons-amount">
                            ￥
                            <span class="coupons-price">{{x.true_coupon_price}}</span>&nbsp;&nbsp;
                            <span class="coupons-name">{{x.coupon_name}}</span>
                        </div>
                        <div class="coupons-term">
                            使用期限：
                            <span v-if="x.is_deadline">{{x.start_time}}至{{x.stop_time}}</span>
                            <span v-else>永久有效</span>
                        </div>
                        <div class="card-state" v-if="x.is_used">
                            <img src="../assets/img/used.png" alt="">
                        </div>
                    </div>
                    <!-- 已过期 -->
                    <div class="coupons" v-if="index==2" style="background:url(../assets/img/overdue_card.png) 0% 0% / cover no-repeat">
                        <div class="coupons-rule">
                            <span v-if="x.is_requirement">满{{x.true_coupon_requirement_price}}元可抵用{{x.true_coupon_price}}元</span>&nbsp;&nbsp;
                            <span v-if="x.is_online">全场使用</span><span v-else>线下使用</span>
                        </div>
                        <div class="coupons-amount">
                            ￥
                            <span class="coupons-price">{{x.true_coupon_price}}</span>&nbsp;&nbsp;
                            <span class="coupons-name">{{x.coupon_name}}</span>
                        </div>
                        <div class="coupons-term">
                            使用期限：
                            <span v-if="x.is_deadline">{{x.start_time}}至{{x.stop_time}}</span>
                            <span v-else>永久有效</span>
                        </div>
                        <div class="card-state">
                            <img src="../assets/img/overdue.png" alt="">
                        </div>
                    </div>
                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import axios from 'axios';
import NoData from "../pages/components/noData";
export default {
    name: "memberCard",
    data() {
        return {
            baseUrl:baseUrl,
            cardInfo: [
                {
                    title: "未使用",
                    cards: []
                },
                {
                    title: "已使用",
                    cards: []
                },
                {
                    title: "已过期",
                    cards: []
                }
            ]
        };
    },
    components:{
        NoData
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
            url: baseUrl + "/app/mallitem/my_coupons",
            data: {
                user_id: localStorage['userId'],
                token: localStorage['token']
            }
        })
            .then(res => {
                if (res.data.state) {
                    that.cardInfo[0].cards = res.data.result.can_use;
                    that.cardInfo[1].cards = res.data.result.used;
                    that.cardInfo[2].cards = res.data.result.overdue;
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
.card-item {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: 0.1rem 0;
    padding: .2rem .31rem 0 .31rem;
    box-sizing: border-box;
    font-size: 0.3rem;
}
.coupons {
    width: 100%;
    height: 2.45rem;
    position: relative;
}
.coupons.online{
    background: url(../assets/img/cash_coupon.png) 0% 0% / cover no-repeat;
}
.coupons.underline{
    background: url(../assets/img/wash_car.png) 0% 0% / cover no-repeat
}
.coupons-rule {
    width: 100%;
    padding: 0.3rem 0.2rem 0.3rem 0;
    box-sizing: border-box;
    text-align: right;
    font-size: 0.26rem;
    color: #fff;
}
.coupons-amount {
    width: 100%;
    padding: 0 0.2rem 0.2rem 0;
    box-sizing: border-box;
    text-align: right;
    font-size: 0.34rem;
    color: #fff;
}
.coupons-price {
    font-size: 0.64rem;
}
.coupons-name {
    font-size: 0.35rem;
}
.coupons-term {
    width: 100%;
    padding: 0 0.2rem;
    margin: 0.2rem 0;
    box-sizing: border-box;
    text-align: left;
    font-size: 0.28rem;
    color: #999;
}
.card-state {
	position: absolute;
	width: 1.7rem;
	height: 1.3rem;
	bottom: .2rem;
	right: .2rem;
}

.card-state>img {
	width: 100%;
}
</style>
