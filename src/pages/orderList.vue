<template>
    <div class="order">
        <van-tabs>
            <van-tab v-for="(item,index) in orderList" :title="item.title" :key="index">
                <NoData v-if="item.orders.length<1" prompt="暂无数据"></NoData>
                <div v-else>
                    <div class="order-item" v-for="(x,n) in item.orders" :key="n">
                        <div class="order-top">
                            <div class="order-num">订单号：<span>{{x.order_no}}</span></div>
                            <div class="order-status">
                                <span v-if="x.status==1">待使用</span>
                                <span v-if="x.status==2">交易完成</span>
                            </div>
                        </div>
                        <router-link class="order-middle" to="/404" tag="div">
                            <div class="goods-img">
                                <img :src="baseUrl+x.main_img" alt="">
                            </div>
                            <div class="goods-content">
                                <div class="goods-name">{{x.item_name}}</div>
                                <div class="goods-price">￥{{x.true_price}}+{{x.point}}积分</div>
                            </div>
                        </router-link>
                        <div class="order-bottom">
                            <button class="confirm-btn" v-if="x.status==1">确认领取</button>
                            <button class="cancel-btn" v-if="x.status==2">删除订单</button>
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
    name: "orderList",
    data() {
        return {
            baseUrl:baseUrl,
            orderList: [
                {
                    title: "全部",
                    orders: []
                },
                {
                    title: "已支付",
                    orders: []
                },
                {
                    title: "已使用",
                    orders: []
                }
            ]
        };
    },
    components: {
        NoData
    },
    created() {       
        var that = this;
        axios({
            method: "POST",
            url: baseUrl + "/app/mallitem/show_order",
            data: {
                user_id: localStorage['userId'],
                token: localStorage['token']
            }
        })
            .then(res => {
                if (res.data.state) {
                    that.orderList[0].orders = res.data.result.all;
                    that.orderList[1].orders = res.data.result.has_pay;
                    that.orderList[2].orders = res.data.result.finished;
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
.order{
    width: 100%;
    font-size: .3rem;
}
.order-item{
    width: 100%;
    display: flex;
    flex-direction: column;
    border-top: .15rem solid #ededed;
}
.order-top{
    width: 100%;
    height: .8rem;
    display: flex;
    padding: 0 .3rem;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ededed;
}
.order-num{
    font-size: .26rem;
    color: #333;
}
.order-num>span{
    color: #999;
}
.order-status{
    font-size: .26rem;
    color: #ff9000;
}
.order-middle{
    width: 100%;
    display: flex;
    padding: .2rem .3rem;
    box-sizing: border-box;
    align-items: center;
    border-bottom: 1px solid #ededed;
}
.goods-img{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 1.3rem;
    overflow: hidden;
}
.goods-img>img{
    width: 100%;
    height: 100%;
}
.goods-content{
    height: 1.3rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    margin: 0 0 0 .2rem;
}
.goods-name{
    font-size: .28rem;
    color: #666;
}
.goods-price{
    font-size: .28rem;
    color: #ff2222;
}
.order-bottom{
    width: 100%;
    height: 1rem;
    display: flex;
    box-sizing: border-box;
    justify-content: flex-end;
    align-items: center;
}
.order-bottom>button{
    width: 1.5rem;
    height: .6rem;
    margin: 0 .3rem 0 0;
    padding: 0;
    outline: none;
    background: #fff;
    border-radius: 4px;
}
.confirm-btn{
    border: 1px solid #37acff;
    color: #37acff;
}
.cancel-btn{
    border: 1px solid #999;
    color: #999;
}
</style>

