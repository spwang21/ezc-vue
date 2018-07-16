<template>
    <div class="vehicle-form">
        <div class="vehicle-form-row">
            <div class="from-left">
                车主姓名
            </div>
            <div class="from-right">
                <input type="text" v-model="userName" placeholder="请输入车主姓名">
            </div>
        </div>
        <div class="vehicle-form-row">
            <div class="from-left">
                爱车品牌
            </div>
            <div class="from-right" @click="getBrand">
                <input type="text" v-model="carBrand" placeholder="请选择爱车品牌" readonly>
                <van-icon name="arrow" />
            </div>
        </div>
        <div class="vehicle-form-row">
            <div class="from-left">
                爱车车型
            </div>
            <div class="from-right" @click="getType">
                <input type="text" v-model="carType" placeholder="请选择爱车车型" readonly>
                <van-icon name="arrow" />
            </div>
        </div>
        <div class="vehicle-form-row">
            <div class="from-left">
                爱车配置
            </div>
            <div class="from-right" @click="getConfig">
                <input type="text" style="width:5.4rem;" v-model="carConfig" placeholder="请选择爱车配置" readonly>
                <van-icon name="arrow" />
            </div>
        </div>
        <div class="vehicle-form-row">
            <div class="from-left">
                爱车年款
            </div>
            <div class="from-right">
                <input type="text" v-model="carYear" placeholder="请选择爱车年款" readonly>
                <van-icon name="arrow" />
            </div>
        </div>
        <div class="vehicle-form-row">
            <div class="from-left">
                爱车颜色
            </div>
            <div class="from-right">
                <input type="text" v-model="carColor" placeholder="请输入爱车颜色">
            </div>
        </div>
        <div class="vehicle-form-row">
            <div class="from-left">
                车牌号码
            </div>
            <div class="from-right">
                <input type="text" v-model="carPlate" placeholder="请输入车牌号码">
            </div>
        </div>
        <div class="default-switch">
            <div class="from-left">
                设为默认
            </div>
            <div class="from-right">
                <van-switch v-model="setDefault" />
            </div>
        </div>
        <button class="save-btn" @click="saveCar">保存</button>
        <button class="delete-btn" v-if="vehicleId>0" @click="deleteCar">删除</button>
        <!-- picker -->
        <van-popup v-model="pickerShow" position="bottom">
            <van-picker show-toolbar :columns="columns" @cancel="onCancel" @confirm="onConfirm" />
        </van-popup>
    </div>
</template>

<script>
import axios from "axios";
export default {
    name: "bindCar",
    data() {
        return {
            vehicleId: "",
            userName: "",
            carBrand: "",
            carBrandId: "",
            carType: "",
            carTypeId:"",
            carConfig: "",
            carYear: "",
            carColor: "",
            carPlate: "",
            carLogo: "",
            setDefault: true,
            pickerShow: false,
            pickerState: "",
            columns: []
        };
    },
    methods: {
        onConfirm(value, index) {
            if (this.pickerState == 1) {
                this.carBrand = value.text;
                this.carBrandId = value.value;
                this.carLogo = value.logo;
                this.pickerShow = false;
            }else if(this.pickerState == 2){
                this.carType = value.text;
                this.carTypeId = value.value;
                this.pickerShow = false;
            }else if(this.pickerState == 3){
                this.carConfig = value.text;
                this.carYear = value.value;
                this.pickerShow = false;
            }
        },
        onCancel() {
            this.pickerShow = false;
        },
        getBrand() {
            var that = this;
            axios({
                method: "GET",
                url: baseUrl + "/app/Mine/list_all_brand"
            })
                .then(res => {
                    if (res.data.state) {
                        var carBrand = new Array();
                        res.data.result.forEach((item, index) => {
                            carBrand.push({
                                text: item.name,
                                value: item.id,
                                logo: item.logo
                            });
                            return carBrand;
                        });
                        that.columns = carBrand;
                        that.pickerState = 1;
                        that.pickerShow = true;
                    } else {
                        that.$toast(res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        getType() {
            if (this.carBrand == "") {
                this.$toast("请先选择爱车品牌");
            } else {
                var that = this;
                axios({
                    method: "POST",
                    url: baseUrl + "/app/Mine/list_all_car_type",
                    data: {
                        brand_id: that.carBrandId
                    }
                })
                    .then(res => {
                        if (res.data.state) {
                            var carType = new Array();
                            res.data.result.forEach((item, index) => {
                                carType.push({
                                    text: item.fullname,
                                    value: item.id
                                });
                                return carType;
                            });
                            that.columns = carType;
                            that.pickerState = 2;
                            that.pickerShow = true;
                        } else {
                            that.$toast(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        },
        getConfig() {
            if (this.carType == "") {
                this.$toast("请先选择爱车车型");
            } else {
                var that = this;
                axios({
                    method: "POST",
                    url: baseUrl + "/app/Mine/list_all_car_configuse",
                    data: {
                        cartype_id: that.carTypeId
                    }
                })
                    .then(res => {
                        if (res.data.state) {
                            var configs = new Array();
                            res.data.result.forEach((item, index) => {
                                configs.push({
                                    text: item.name,
                                    value: item.yeartype
                                });
                                return configs;
                            });
                            that.columns = configs;
                            that.pickerState = 3;
                            that.pickerShow = true;
                        } else {
                            that.$toast(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        },
        deleteCar() {
            var that = this;
            this.$dialog
                .confirm({
                    title: "",
                    message: `确定删除这条车辆信息？`
                })
                .then(() => {
                    axios({
                        method: "POST",
                        url: baseUrl + "/app/Mine/delete_my_car_stock",
                        data: {
                            token: localStorage["token"],
                            my_car_id: that.$route.params.id
                        }
                    })
                        .then(res => {
                            if (res.data.state) {
                                that.$toast.success("删除成功");
                                that.$router.push("/mine/vehicle");
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
        saveCar(){
            if(this.userName==''){
                this.$toast('请输入车主姓名');
            }else if(this.carBrand==''){
                this.$toast("请选择爱车品牌")
            }else if(this.carType==''){
                this.$toast("请选择爱车车型")
            }else if(this.carConfig==''){
                this.$toast("请选择爱车配置")
            }else if(this.carColor==''){
                this.$toast("请输入爱车颜色")
            }else if(this.carPlate==''){
                this.$toast("请输入车牌号码")
            }else if(this.vehicleId==0){//新增
                var that = this;
                var isDefault = this.setDefault?1:0;
                axios({
                        method: "POST",
                        url: baseUrl + "/app/Mine/insert_my_car_stock",
                        data: {
                            token: localStorage["token"],
                            nick_name:that.userName,
                            car_num:that.carPlate,
                            brand:that.carBrand,
                            car_type:that.carType,
                            year_model:that.carYear,
                            configuse_name:that.carConfig,
                            color:that.carColor,
                            logo:that.carLogo,
                            is_default:isDefault
                        }
                    })
                        .then(res => {
                            if (res.data.state) {
                                that.$router.push("/mine/vehicle");
                            } else {
                                that.$toast(res.data.msg);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
            }else{//修改
                var that = this;
                var isDefault = this.setDefault?1:0;
                axios({
                        method: "POST",
                        url: baseUrl + "/app/Mine/update_my_car_stock",
                        data: {
                            token: localStorage["token"],
                            my_car_id:that.vehicleId,
                            nick_name:that.userName,
                            car_num:that.carPlate,
                            brand:that.carBrand,
                            car_type:that.carType,
                            year_model:that.carYear,
                            configuse_name:that.carConfig,
                            color:that.carColor,
                            logo:that.carLogo,
                            is_default:isDefault
                        }
                    })
                        .then(res => {
                            if (res.data.state) {
                                that.$router.push("/mine/vehicle");
                            } else {
                                that.$toast(res.data.msg);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
            }
        }
    },
    created() {
        this.vehicleId = this.$route.params.id;
        var that = this;
        if (this.$route.params.id > 0) {
            axios({
                method: "POST",
                url: baseUrl + "/app/Mine/detail_my_car_stock",
                data: {
                    token: localStorage["token"],
                    my_car_id: that.$route.params.id
                }
            })
                .then(res => {
                    console.log(res);
                    if (res.data.state) {
                        that.userName = res.data.result.nick_name;
                        that.carBrand = res.data.result.brand;
                        that.carType = res.data.result.car_type;
                        that.carConfig = res.data.result.configuse_name;
                        that.carYear = res.data.result.year_model;
                        that.carColor = res.data.result.color;
                        that.carPlate = res.data.result.car_num;
                        that.carLogo = res.data.result.logo;
                        that.setDefault = !!res.data.result.is_default;
                    } else {
                        that.$toast(res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
    watch:{
        carPlate: function(val, oldVal) {
            this.carPlate = val.toUpperCase();
        }
    }
};
</script>

<style scoped>
.vehicle-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    font-size: 0.3rem;
}
.vehicle-form-row {
    width: 100%;
    height: 1rem;
    display: flex;
    box-sizing: border-box;
    padding: 0 0.2rem;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ededed;
}
.from-right {
    display: flex;
    height: 1rem;
    align-items: center;
    position: relative;
}
.from-right > input {
    border: 0;
    outline: none;
    background: inherit;
    padding: 0;
    margin: 0;
    font-size: 0.28rem;
    text-align: right;
}
.default-switch {
    width: 100%;
    height: 1rem;
    display: flex;
    box-sizing: border-box;
    padding: 0 0.2rem;
    justify-content: space-between;
    align-items: center;
    border-top: 0.1rem solid #ededed;
    border-bottom: 1px solid #ededed;
}
.save-btn,
.delete-btn {
    width: 7.1rem;
    height: 0.8rem;
    border-radius: 4px;
    outline: none;
    font-size: 0.32rem;
}
.save-btn {
    margin: 1rem 0 0 0.2rem;
    background: #fff;
    color: #37acff;
    border: 1px solid #37acff;
}
.delete-btn {
    margin: 0.5rem 0 0 0.2rem;
    background: #fff;
    color: #ff2222;
    border: 1px solid #ff2222;
}
.van-switch--on {
    background: #37acff;
}
</style>

