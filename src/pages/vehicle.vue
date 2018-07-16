<template>
    <div class="vehicle">
        <div v-if="carList.length>0">
            <router-link class="vehicle-item" :to="'/mine/vehicle/'+item.id" tag="div" v-for="(item,index) in carList" :key="index">
                <div class="car-info">
                    <div class="user-name">{{item.car_num}}&nbsp;&nbsp;{{item.nick_name}}</div>
                    <div class="car-brand">{{item.brand}}&nbsp;&nbsp;{{item.car_type}}</div>
                    <div class="car-type">{{item.configuse_name}}</div>
                    <div class="car-color">({{item.color}})</div>
                    <div class="default-car" @click="defaultCar(item)">
                        <van-checkbox v-model="item.is_default" :disabled="!!item.is_default">默认爱车</van-checkbox>                        
                    </div>
                </div>
                <div class="car-logo">
                    <img :src="item.logo" alt="">
                </div>
                <div class="right-icon">
                    <van-icon name="arrow" />
                </div>
            </router-link>
            <a class="bind-car" href="#/mine/vehicle/0">绑定车辆</a> 
        </div>
        <div v-else>
            <NoData prompt="暂无车辆，请先绑定"></NoData>
            <a class="bind-car" href="#/mine/vehicle/0">绑定车辆</a>       
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import NoData from "../pages/components/noData";
export default {
    name:'vehicle',
    data(){
        return {
            carList:[],
            defaultChecked:'1'
        }
    },
    components:{
        NoData
    },
    methods:{
        updateData(){
            var that = this;
            axios({
                method: "POST",
                url: baseUrl + "/app/Mine/list_my_car_stock",
                data: {
                    token: localStorage['token']
                }
            })
                .then(res => {
                    if (res.data.state) {
                        that.carList = res.data.result;                 
                    }else{
                        that.$toast(res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        defaultCar(item){
            var that = this;
            var car_id = item.id;
            axios({
                method: "POST",
                url: baseUrl + "/app/Mine/my_default_car",
                data: {
                    token: localStorage['token'],
                    my_car_id:car_id
                }
            })
                .then(res => {                  
                    if (res.data.state) {
                        that.updateData();          
                    }else{
                        that.$toast(res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
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
        this.updateData();
    }
}
</script>

<style scoped>
    .vehicle{
        width: 100%;
        font-size: .3rem;
    }
    .vehicle-item{
        width: 7.1rem;
        display: flex;
        margin: .2rem .2rem 0 .2rem;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #ededed;
        border-radius: 4px;
        padding: .2rem .1rem .2rem .2rem;
        box-sizing: border-box;
    }
    .car-info{
        width: 4.8rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    .car-info>div{
        width: 100%;
        margin: .1rem 0;
        text-align: left;
        font-size: .28rem;
        color: #666;
    }
    .car-logo{
        width: 1rem;
        height: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .car-logo>img{
        width: 100%;
    }
    .car-info>.user-name{
        font-size: .32rem;
        color: #333;
        font-weight: bold;
    }
    .right-icon{
        font-size: .4rem;
        color: #999;
    }
    .bind-car{
        width: 7.1rem;
        height: .8rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #37acff;
        color: #fff;
        font-size: .32rem;
        margin: .5rem 0 0 0;
        border-radius: 4px;
    }
</style>
