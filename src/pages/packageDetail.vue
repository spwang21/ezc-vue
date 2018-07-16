<template>
    <div class="package-detail">
        <!-- 轮播图 -->
        <div class="carousel">
            <van-swipe :autoplay="3000">
                <van-swipe-item v-for="(item,index) in carousel" :key="index">
                    <img :src="baseUrl+item" />
                </van-swipe-item>               
            </van-swipe>
        </div>
        <div class="package-info">
            <div class="package-name">{{packageInfo.package_name+" "+packageInfo.package_contains}}</div>
            <div class="package-content">
                <div class="package-price">{{packageInfo|formatPrice}}</div>
                <div class="package-sale">已有{{packageInfo.sells_num}}人购买</div>
            </div>
        </div>
        <div class="package-info">
            <div class="package-term">有效期：<span v-if="packageInfo.is_deadline">{{packageInfo.start_time}}至{{packageInfo.stop_time}}</span><span v-else>永久有效</span></div>
            <div class="package-contain">套餐详情：{{packageInfo.package_contains}}</div>
        </div>
        <div class="package-introduce">使用说明：<span>{{packageInfo.introduce}}</span></div>
        <div class="package-html" v-html="packageInfo.package_detail"></div>
        <a class="buy-btn" href="#/">立即购买</a>    
    </div>
</template>

<script>
import axios from "axios";
export default {
    name: "packageDetail",
    data() {
        return {
            baseUrl:baseUrl,
            carousel: [],
            packageInfo:[]
        };
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
            url: baseUrl + "/app/mallitem/package_detail",
            data: {
                package_id: that.$route.params.id
            }
        })
            .then(res => {
                console.log(res)
                if (res.data.state) {
                    that.carousel = res.data.result.imgs_arr;
                    that.packageInfo = res.data.result;
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
.package-detail{
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
.package-info{
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
.package-name{
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
.package-content{
    width: 100%;
    height: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.package-price{
    font-size: .32rem;
    color: #FF2222;
}
.package-sale{
    font-size: .26rem;
    color: #999;
}
.package-term,
.package-contain{
    width: 100%;
    text-align: left;
    margin: .2rem 0;
}
.package-introduce{
    width: 100%;
    padding: .2rem;
    font-size: .28rem;
    color: #333;
    line-height: .4rem;
    box-sizing: border-box;
    text-align: left;
}
.package-introduce>span{
    color: #999;
}
.package-html{
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
