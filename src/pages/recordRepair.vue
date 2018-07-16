<template>
    <div class="maintenance-record">
        <NoData v-if="records.length<1" prompt="暂无数据"></NoData>
        <div v-else>
            <div class="record-item" v-for="(item,index) in records" :key="index">
                <div class="record-top">
                    <div class="shop-name">
                        <img src="../assets/img/shop_icon.png" alt="">
                        <span>{{item.name}}</span>
                    </div>
                    <div class="record-status">
                        <span v-if="item.status==1">待派单</span>
                        <span v-if="item.status==2">已派单</span>
                        <span v-if="item.status==3">已接单</span>
                        <span v-if="item.status==4">进行中</span>
                        <span v-if="item.status==5">待评价</span>
                        <span v-if="item.status==6">已评价</span>
                        <span v-if="item.status==7">已取消</span>
                    </div>
                </div>
                <div class="record-middle">
                    <div class="shop-img">
                        <img :src="baseUrl+item.logo" alt="">
                    </div>
                    <div class="record-content">
                        <div class="bespeak-info">
                            车主姓名：<span>{{item.nick_name}}</span>
                        </div>
                        <div class="bespeak-info">
                            联系方式：
                            <span>{{item.phone}}</span>
                        </div>
                        <div class="bespeak-info">
                            预约时间：
                            <span>{{item.will_time}}</span>
                        </div>
                        <div class="bespeak-info">
                            品牌车型：<span>{{item.car_name}}{{item.car_type}}{{item.configuse_name}}</span>
                        </div>
                        <div class="bespeak-info">
                            预约工位：<span>{{item.time_station_name}}</span>
                        </div>
                    </div>
                </div>
                <div class="record-bottom" v-if="item.status==5">
                    <a class="evaluate-btn" href="#">立即评价</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import NoData from "../pages/components/noData";
import axios from "axios";
export default {
    name:'recordRepair',
    data(){
        return {
            baseUrl:baseUrl,
            records:[]
        }
    },
    components: {
        NoData
    },
    created() {
        var that = this;
        axios({
            method: "POST",
            url: baseUrl + "/app/Repair/list_his_repair",
            data: {
                page: 1,
                token: localStorage['token']
            }
        })
            .then(res => {
                if (res.data.state) {
                    that.records = res.data.result;
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
.maintenance-record{
    width: 100%;
    font-size: .3rem;
}
.record-item{
    width: 100%;
    display: flex;
    flex-direction: column;
    border-bottom: .1rem solid #ededed;
}
.record-top{
    width: 100%;
    height: .8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 .3rem;
    box-sizing: border-box;
    border-bottom: 1px solid #ededed;
}
.shop-name{
    display: flex;
    align-items: center;
    font-size: .32rem;
    color: #ff2222;
}
.shop-name>img{
    width: .37rem;
    height: .37rem;
    margin: 0 .15rem 0 0;
}
.record-status{
    font-size: .28rem;
    color: #37acff;
}
.record-middle{
    width: 100%;
    display: flex;
    align-items: center;
    padding: .2rem .3rem;
    box-sizing: border-box;
    border-bottom: 1px solid #ededed;
}
.shop-img{
    width: 2.42rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
}
.shop-img>img{
    width: 100%;
    height: 100%;
}
.record-content{
    width: 4.28rem;
    height: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    margin: 0 0 0 .2rem;
    font-size: .24rem;
}
.bespeak-info{
    width: 100%;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #333;
}
.bespeak-info>span{
    color: #999;
}
.record-bottom{
    width: 100%;
    height: 1rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
.evaluate-btn,.cancel-btn{
    width: 1.5rem;
    height: .6rem;
    margin: 0 .3rem 0 0;
    padding: 0;
    outline: none;   
    border-radius: 4px;
}
.cancel-btn{
    border: 1px solid #999;
    background: #fff;
    color: #999;
}
.evaluate-btn{
    line-height: .6rem;
    border: 0;
    background: #37acff;
    color: #fff;
}
</style>
