<template>
    <div class="integral">
        <div class="integral-total">
            <div class="integral-title">我的积分</div>
            <div class="integral-num">{{totalIntegral}}</div>
        </div>
        <div class="integral-record">
            <div class="integral-detail">
                <div class="integral-left">积分明细</div>
                <div class="integral-month" @click="pickerOpen"><span>年月：{{month}}</span><van-icon name="sign" /></div>
            </div>
            <div class="integral-row" v-for="(item,index) in integrals" :key="index">
                <div class="integral-left">
                    <div class="integral-way">{{item.information}}</div>
                    <div class="integral-time">{{item.add_time}}</div>
                </div>
                <div class="integral-change" :class="{'red':item.point>0}">{{item.point | formatIntegral}}</div>       
            </div>
        </div>
        <!-- 选择年月 -->
        <van-popup v-model="pickerShow" position="bottom">
            <van-datetime-picker
                v-model="currentDate"
                type="year-month"
                :max-date="new Date()"
                @confirm="pickerConfirm"
                @cancel="pickerCancel"
                />
        </van-popup>
    </div>
</template>

<script>
import axios from "axios";
export default {
    name:'integral',
    data(){
        return {
            totalIntegral:"",
            integrals:[],
            month:year+'-'+mon,
            pickerShow:false,
            currentDate:new Date()  
        }
    },
    filters:{
        formatIntegral(vaule){
            if(vaule>0){
                return "+"+vaule;
            }else{
                return vaule;
            }
        }
    },
    methods:{
        pickerOpen(){
            this.pickerShow = true;
        },
        pickerCancel(){
            this.pickerShow = false;
        },
        pickerConfirm(value){
            this.month = value.getFullYear()+'-'+(value.getMonth() + 1);
            this.pickerShow = false;
            var that = this;
             axios({
            method: "POST",
            url: baseUrl + "/app/Account/get_point_detail",
            data: {
                token: localStorage['token'],
                user_id:localStorage['userId'],
                year_mounth:that.month,
                type:0
            }
        })
            .then(res => {
                if (res.data.state) {
                    that.integrals = res.data.result.detail;
                } else {
                    that.$toast(res.data.msg)
                }
            })
            .catch(err => {
                console.log(err);
            });
        }
    },
    created(){
        var that = this;
        axios({
            method: "POST",
            url: baseUrl + "/app/Account/get_point_info",
            data: {
                token: localStorage['token'],
                user_id:localStorage['userId']
            }
        })
            .then(res => {
                if (res.data.state) {
                    that.totalIntegral = res.data.result;
                } else {
                    that.$toast(res.data.msg);
                }
            })
            .catch(err => {
                console.log(err);
            });
        //获取积分明细
        axios({
            method: "POST",
            url: baseUrl + "/app/Account/get_point_detail",
            data: {
                token: localStorage['token'],
                user_id:localStorage['userId'],
                type:0
            }
        })
            .then(res => {
                if (res.data.state) {
                    that.integrals = res.data.result.detail;
                } else {
                    that.$toast(res.data.msg)
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
}
</script>

<style scoped>
.integral{
    width: 100%;
    display: flex;
    flex-direction: column;
}
.integral-total{
    width: 100%;
    height: 1.8rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: .3rem;
    color: #fff;
    background: #37acff;  
}
.integral-title{
    margin: 0 0 .3rem 0;
}
.integral-num{
    font-size: .45rem;
    font-weight: bold;
}
.integral-detail{
    width: 100%;
    height: .8rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 .2rem;
    box-sizing: border-box;
    background: #f5f5f5;
    font-size: .28rem;
}
.integral-month{
    display: flex;
    font-size: .28rem;
    color: #37acff;
}
.integral-month>i.van-icon{
    margin: 0 0 0 .1rem;
    font-size: .32rem;
    font-weight: 600;
}
.integral-row{
    width: 100%;
    height: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ededed;
    font-size: .3rem;
    padding: 0 .2rem;
    box-sizing: border-box;
}
.integral-left{
    height: 1.2rem;
    max-width: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.integral-way{
    width: 100%;
    margin: 0 0 .2rem 0;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #333;
}
.integral-time{
    width: 100%;    
    text-align: left;
    color: #999;
    font-size: .24rem;
    white-space: nowrap;
}
.integral-change{
    font-size: .36rem;
    color: #333;
}
.integral-change.red{
    color: red;
}
</style>
