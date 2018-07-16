<template>
    <div class="exchange-card">
        <div class="card-item" v-for="(item,index) in cardList" :key="index">
            <div class="coupons" :class="{'online':item.is_online,'underline':!item.is_online}">
                <div class="coupons-rule">
                    <span v-if="item.is_requirement">满{{item.true_requirement_price}}元可抵用{{item.true_coupon_price}}元</span>&nbsp;&nbsp;
                    <span v-if="item.is_online">全场使用</span><span v-else>仅店内使用</span>
                </div>
                <div class="coupons-amount">
                    ￥
                    <span class="coupons-price">{{item.true_coupon_price}}</span>&nbsp;&nbsp;
                    <span class="coupons-name">{{item.coupon_name}}</span>
                </div>
                <div class="coupons-term">
                    使用期限：
                    <span v-if="item.is_deadline">{{item.start_time}}至{{item.stop_time}}</span>
                    <span v-else>永久有效</span>
                </div>
            </div>
            <div class="exchange-info">
                <div class="exchang-condition">
                    消耗
                    <span class="integral-num">{{item.cost_point}}积分</span>可兑换
                </div>
                <div class="exchange-btn" @click="getCard(item)">领取</div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    name: "exchangeCard",
    data() {
        return {
            baseUrl: baseUrl,
            cardList: []
        };
    },
    methods: {
        getCard(item) {
            var that = this;
            var userInfo = isLogin();
            this.$dialog
                .confirm({
                    title: "",
                    message: `确定消耗${item.cost_point}积分领取？`
                })
                .then(() => {
                    axios({
                        method: "POST",
                        url: baseUrl + "/app/mallitem/coupon_get",
                        data: {
                            user_id: userInfo.id,
                            token: userInfo.token,
                            coupon_id: item.id
                        }
                    })
                        .then(res => {
                            if (res.data.state) {
                                that.$toast("领取成功！");
                            } else {
                                that.$toast(res.data.msg);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                })
                .catch(() => {
                    // on cancel
                });
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
        axios({
            method: "POST",
            url: baseUrl + "/app/mallitem/coupons_list",
            data: {
                user_id: localStorage['userId']
            }
        })
            .then(res => {
                if (res.data.state) {
                    that.cardList = res.data.result.info;
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
.exchange-card {
    width: 100%;
    padding: 0.1rem 0.31rem 0 0.31rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.card-item {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: 0.1rem 0;
    font-size: 0.3rem;
}
.coupons {
    width: 100%;
    height: 2.45rem;
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
.exchange-info {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: 0.2rem 0;
}
.exchang-condition {
    padding: 0 0 0 0.2rem;
    font-size: 0.28rem;
    color: #999;
}
.integral-num {
    font-size: 0.3rem;
    color: #37acff;
}
.exchange-btn {
    padding: 0.1rem 0.25rem;
    margin: 0 0.1rem 0 0;
    border: 1px solid #37acff;
    font-size: 0.28rem;
    color: #37acff;
    border-radius: 4px;
}
</style>

