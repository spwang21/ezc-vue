<template>
    <div class="goods-detail">
        <!-- 轮播图 -->
        <div class="carousel">
            <van-swipe :autoplay="3000">
                <van-swipe-item v-for="(item,index) in carousel" :key="index">
                    <img :src="baseUrl+item" />
                </van-swipe-item>               
            </van-swipe>
        </div>
        <div class="goods-info">
            <div class="goods-name">{{goodsInfo.item_name}}</div>
            <div class="goods-content">
                <div class="goods-price">{{goodsInfo|formatPrice}}</div>
                <div class="goods-sale">已有{{goodsInfo.sells_num}}人购买</div>
            </div>
        </div>       
        <div class="goods-introduce">商品介绍：<br><span>{{detail.aftersales_guarantee}}</span></div>
        <div class="goods-html" v-html="detail.item_detail"></div>
        <a class="buy-btn" href="#/">立即购买</a> 
    </div>
</template>

<script>
import axios from "axios";
export default {
    name:'goodsDetail',
    data(){
        return {
            baseUrl:baseUrl,
            carousel:[],
            goodsInfo:[],
            detail:''
        }
    },
    filters: {
        formatPrice(value) {
            if(value.true_price>0&&value.point>0){
                if(value.point<10000){
                    return "￥" + value.true_price.toFixed(1) + "+" + value.point + "积分";
                }else{
                    return "￥" + value.true_price.toFixed(1) + "+" + value.point/10000 + "万积分";
                }       
            }else if(value.true_price==0){
                return value.point + "积分";
            }else if(value.point==0){
                return "￥" + value.true_price.toFixed(1)
            }
        }
    },
    created() {
        var that = this;
        axios({
            method: "POST",
            url: baseUrl + "/app/mallitem/items_detail",
            data: {
                item_id: that.$route.params.id
            }
        })
            .then(res => {
                if (res.data.state) {
                    that.carousel = res.data.result.imgs_arr;
                    that.detail = res.data.result.detail;
                    that.goodsInfo = res.data.result;
                } else {
                    that.$toast(res.data.msg);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
}
</script>

<style scoped>
.goods-detail{
    padding-bottom: .8rem;
}
.carousel{
    width: 100%;
}
.carousel .van-swipe{
    width: 100%;
    box-sizing: border-box;
}
.carousel .van-swipe-item{
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
}
.carousel .van-swipe-item>img {
    width: 100%;
    height: 7.5rem;
}
.goods-info{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 0 .2rem;
    box-sizing: border-box;
    font-size: .3rem;
    border-bottom: 1px solid #ededed;
}
.goods-name{
    width: 100%;
    text-align: left;
    font-size: .32rem;
    font-weight: 600;
    color: #37acff;
    line-height: .4rem;
    margin: .2rem 0;
    overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}
.goods-content{
    width: 100%;
    height: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.goods-price{
    font-size: .32rem;
    color: #FF2222;
}
.goods-sale{
    font-size: .26rem;
    color: #999;
}
.goods-introduce{
    width: 100%;
    padding: .2rem;
    font-size: .28rem;
    color: #333;
    line-height: .4rem;
    box-sizing: border-box;
    text-align: left;
}
.goods-introduce>span{
    display: block;
    width: 100%;
    color: #999;
    margin: .1rem 0 0 0;
}
.goods-html{
    width: 100%;
    padding: .2rem;
    font-size: .3rem;
    box-sizing: border-box;
}
.buy-btn{
    display: inline-block;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: .8rem;
    line-height: .8rem;
    color: #fff;
    background: #37acff;
    font-size: .36rem;
    text-align: center;
}
</style>
