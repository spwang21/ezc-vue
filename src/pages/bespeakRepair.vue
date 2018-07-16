<template>
    <div class="maintenance">
        <div class="maintenance-form">
            <div class="drive-row">
                <div class="form-left">维保类型</div>
                <div class="form-right">
                    <van-radio-group v-model="repairType">
                        <van-radio name="1">保养</van-radio>
                        <van-radio name="2">维修</van-radio>
                    </van-radio-group>
                </div>
            </div>
            <!-- <div class="drive-row">
                <div class="form-left">预约4S店</div>
                <div class="form-right">
                    {{shop}}
                </div>
            </div> -->
            <div class="drive-row">
                <div class="form-left">车主姓名</div>
                <div class="form-right">
                    <input type="text" placeholder="请输入车主姓名" v-model="userName">
                </div>
            </div>
            <div class="drive-row">
                <div class="form-left">联系电话</div>
                <div class="form-right">
                    <input type="text" placeholder="请输入联系电话" v-model="mobile">
                </div>
            </div>
            <div class="drive-row">
                <div class="form-left">品牌车型</div>
                <div class="form-right" @click="getCarType">
                    <input type="text" style="width:5.4rem;" v-model="carType" placeholder="请选择品牌车型" readonly>
                    <van-icon name="arrow" />
                </div>
            </div>
            <div class="drive-row">
                <div class="form-left">行驶里程</div>
                <div class="form-right">
                    <input type="text" placeholder="请输入行驶里程" v-model="mileage">
                    <span class="km-unit">公里</span>
                </div>
            </div>
            <div class="drive-row">
                <div class="form-left">车牌号码</div>
                <div class="form-right">
                    <input type="text" placeholder="请输入车牌号码" v-model="plateNum">
                </div>
            </div>
            <div class="drive-row">
                <div class="form-left">预约时间</div>
                <div class="form-right" @click="getBespeakTime">
                    <input type="text" v-model="bespeakTimeStr" placeholder="请选择预约时间" readonly>
                    <van-icon name="arrow" />
                </div>
            </div>
            <div class="drive-row">
                <div class="form-left">{{typeName}}类型</div>
                <div class="form-right" @click="getTypeItems">
                    <input type="text" :placeholder="`请选择${typeName}类型`" style="width:5.4rem;" v-model="selectedTypes" readonly>
                    <van-icon name="arrow" />
                </div>
            </div>
            <div class="textarea-row">
                <div class="form-left">具体描述</div>
                <div class="form-right">
                    <textarea cols="28" rows="5" :placeholder="`请输入车子${typeName}具体情况，以便4S店更好地为您提供服务`" v-model="introduce"></textarea>
                </div>
            </div>
            <!-- 选择车型 -->
            <van-popup v-model="pickerType" position="right" :overlay="false">
                <div class="popup-content">
                    <div class="cell-container">
                        <van-radio-group v-model="carTypeId">
                            <van-cell-group>
                                <van-cell v-for="(x,n) in carTypeList" :title="x.name + x.car_type + x.configuse_name" clickable @click="selectCarType(x)" :key="n">
                                    <van-radio :name="x.id" />
                                </van-cell>
                            </van-cell-group>
                        </van-radio-group>
                    </div>
                    <div class="popup-btn">
                        <button class="cancel-btn" @click="cancelPicker">取消选择</button>
                        <button class="confirm-btn" @click="confirmPickerType">确定选择</button>
                    </div>
                </div>
            </van-popup>
            <!-- 选择预约时间 -->
            <van-popup v-model="pickerTime" position="right" :overlay="false">
                <div class="popup-content">
                    <div class="popup-container">
                        <van-tabs>
                            <van-tab v-for="(item,index) in bespeakInfo" :title="item.bespeakDate" :key="index">
                                <div class="tab-container">
                                    <div class="tab-row" v-for="(time,i) in item.timeInfo" :key="i">
                                        <div class="bespeak-time">
                                            <span>{{time.will_time}}</span>
                                        </div>
                                        <div class="plate-list">
                                            <div class="plate" v-for="(plate,j) in time.station" :key="j" @click="plateSelect(item,time,plate)" :class="{'optional':plate.value==0,'unoptional':plate.value==1,'checked':plate.checked}">{{plate.station_name}}</div>
                                        </div>
                                    </div>
                                </div>
                            </van-tab>
                        </van-tabs>
                    </div>
                    <div class="popup-bottom">
                        <div class="plate-state">
                            <div class="optional">
                                <i></i>可选</div>
                            <div class="unoptional">
                                <i></i>已预约</div>
                            <div class="selected">
                                <i></i>选中</div>
                        </div>
                        <div class="popup-btn">
                            <button class="cancel-btn" @click="cancelPicker">取消选择</button>
                            <button class="confirm-btn" @click="confirmBespeakTime">确定选择</button>
                        </div>
                    </div>
                </div>
            </van-popup>
            <!-- 选择保养、故障类型 -->
            <van-popup v-model="pickerItems" position="right" :overlay="false">
                <div class="popup-content">
                    <div class="cell-container">
                        <van-checkbox-group v-model="checkedItems">
                            <van-cell-group>
                                <van-cell v-for="(y,m) in typeItemsInfo" :title="y.type_name" :key="m" @click="selectTypeItems(y,m)">
                                    <van-checkbox :name="m" />
                                </van-cell>
                            </van-cell-group>
                        </van-checkbox-group>
                    </div>
                    <div class="popup-btn">
                        <button class="cancel-btn" @click="cancelPicker">取消选择</button>
                        <button class="confirm-btn" @click="confirmTypeItems">确定选择</button>
                    </div>
                </div>
            </van-popup>
        </div>
        <div class="bottom-btn">
            <button class="bespeak-btn" @click="submitBespeak">立即预约</button>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "bespeakRepair",
    data() {
        return {
            repairType: "1",
            userName: "",
            mobile: "",
            carType: "",
            carTypeId: "",
            carTypeList: [],
            selectedCarType: "",
            pickerType: false,
            pickerTime: false,
            pickerItems: false,
            mileage: "",
            bespeakInfo: [
                { bespeakDate: dayOne, timeInfo: "", dateId: 1 },
                { bespeakDate: dayTwo, timeInfo: "", dateId: 2 },
                { bespeakDate: dayThree, timeInfo: "", dateId: 3 }
            ],
            bespeakTime: "",
            bespeakTimeStr: "",
            bespeakIdStr: "",
            willTime: "",
            station: "",
            plateNum: "",
            typeName: "保养",
            selectedTypes: "",
            checkedItems: [],
            typeItemsInfo: [],
            introduce: ""
        };
    },
    methods: {
        getCarType() {
            var that = this;
            axios({
                method: "POST",
                url: baseUrl + "/app/Repair/list_car_type",
                data: {
                    organize_id: localStorage['shopId'],
                    page: 1
                }
            })
                .then(res => {
                    console.log(res);
                    if (res.data.state) {
                        that.carTypeList = res.data.result;
                        that.pickerType = true;
                    } else {
                        that.$toast(res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        selectCarType(item) {
            this.carTypeId = item.id;
            this.selectedCarType =
                item.name + item.car_type + item.configuse_name;
        },
        cancelPicker() {
            this.pickerType = false;
            this.pickerTime = false;
            this.pickerItems = false;
        },
        confirmPickerType() {
            if (this.selectedCarType == "") {
                this.$toast("请先选择品牌车型");
            } else {
                this.carType = this.selectedCarType;
                this.pickerType = false;
            }
        },
        getBespeakTime() {
            if (this.carTypeId == "") {
                this.$toast("请先选择试驾车型");
            } else {
                this.getBespeakInfo(0, dayOne);
                this.getBespeakInfo(1, dayTwo);
                this.getBespeakInfo(2, dayThree);
                this.pickerTime = true;
            }
        },
        getBespeakInfo(index, title) {
            var that = this;
            axios({
                method: "POST",
                url: baseUrl + "/app/Repair/list_repair_station",
                data: {
                    organize_id: localStorage['shopId'],
                    is_type: that.repairType,
                    date_num: index + 1
                }
            })
                .then(res => {
                    console.log(res);
                    if (res.data.state) {
                        that.bespeakInfo[index].timeInfo = res.data.result;
                        that.bespeakInfo[index].timeInfo.forEach((i, n) => {
                            i.station.forEach((j, m) => {
                                if (typeof j.checked == "undefined") {
                                    that.$set(j, "checked", false);
                                } else {
                                    j.checked = false;
                                }
                            });
                        });
                    } else {
                        that.$toast(res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        confirmBespeakTime() {
            if (this.bespeakTime == "") {
                this.$toast(`请先选择维保预约工位`);
            } else {
                this.bespeakTimeStr =
                    this.bespeakTime + " " + this.station + "工位";
                this.pickerTime = false;
            }
        },
        plateSelect(item, time, plate) {
            this.bespeakInfo.forEach((x, y) => {
                x.timeInfo.forEach((i, n) => {
                    i.station.forEach((j, m) => {
                        if (typeof j.checked == "undefined") {
                            that.$set(j, "checked", false);
                        } else {
                            j.checked = false;
                        }
                    });
                });
            });
            plate.checked = !plate.checked;
            this.bespeakIdStr =
                item.dateId +
                "," +
                time.time_id +
                "," +
                this.carTypeId +
                "," +
                plate.station_id;
            this.bespeakTime = item.bespeakDate + " " + time.will_time;
            this.willTime = time.will_time;
            this.station = plate.station_name;
        },
        getTypeItems() {
            var that = this;
            axios({
                method: "POST",
                url: baseUrl + "/app/Repair/list_repair_type",
                data: {
                    organize_id: localStorage['shopId'],
                    is_type: that.repairType
                }
            })
                .then(res => {
                    if (res.data.state) {
                        that.typeItemsInfo = res.data.result;
                        that.typeItemsInfo.forEach((item, index) => {
                            if (typeof item.checked == "undefined") {
                                that.$set(item, "checked", false);
                            } else {
                                item.checked = false;
                            }
                        });
                        that.checkedItems = [];
                        that.pickerItems = true;
                    } else {
                        that.$toast(res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        selectTypeItems(item, index) {
            Array.prototype.removeItem = function(val) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] == val) {
                        this.splice(i, 1);
                        break;
                    }
                }
            };
            if (!item.checked) {
                this.checkedItems.push(index);
            } else {
                this.checkedItems.removeItem(index);
            }
            item.checked = !item.checked;
        },
        confirmTypeItems() {
            var that = this;
            this.selectedTypes = "";
            if(this.checkedItems.length>0){               
                this.selectedTypes = "";
                this.typeItemsInfo.forEach((item, index) => {
                    if (item.checked) {
                        if (that.selectedTypes == "") {
                            that.selectedTypes += item.type_name;
                        } else {
                            that.selectedTypes += "," + item.type_name;
                        }
                    }
                });
                this.pickerItems = false;
            }else{
                this.$toast(`请先选择${this.typeName}类型`)
            }       
        },
        submitBespeak(){
            if (this.userName == "") {
                this.$toast("请输入车主姓名");
            } else if (this.mobile == "") {
                this.$toast("请输入联系电话");
            } else if (this.carTypeId == "") {
                this.$toast("请选择品牌车型");
            } else if (this.mileage==""){
                this.$toast("请输入行驶里程");
            }else if(this.plateNum==""){
                this.$toast("请输入车牌号码");
            }else if (this.bespeakTimeStr == "") {
                this.$toast("请选择试驾时间");
            } else if (this.selectedTypes == "") {
                this.$toast(`请选择${typeName}类型`);
            } else {
                var that = this;
                var login_info = isLogin();
                axios({
                    method: "POST",
                    url: baseUrl + "/app/Repair/insert_repair",
                    data: {
                        organize_id: localStorage['shopId'],
						token: localStorage['token'],
						is_type: that.repairType,
						nick_name: that.userName,
						phone: that.mobile,
						car_type_id: that.carTypeId,
						mileage:that.mileage,
						user_car_num:that.plateNum,
						time_station_ids: that.bespeakIdStr,
						will_time: that.willTime,
						time_station_name: that.station,
						rk_type_name:that.selectedTypes,
						introduce:that.introduce
                    }
                })
                    .then(function(res) {
                        console.log(res);
                        if (res.data.state) {
                            that.$router.push("/record/maintenance");
                        } else {
                            this.$toast(res.data.msg);
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }
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
    created(){
        if(this.$route.query.token==undefined){
            this.getUserInfo(localStorage['token']);
        }else{
            localStorage.setItem("token", this.$route.query.token);
            this.getUserInfo(localStorage['token']);
        };
    },
    watch: {
        repairType: function(val, oldVal) {
            this.selectedTypes = "";
            if (val == "1") {
                this.typeName = "保养";
            } else if (val == "2") {
                this.typeName = "故障";
            }
        },
        plateNum: function(val, oldVal) {
            this.plateNum = val.toUpperCase();
        }
    }
};
</script>

<style scoped>
.maintenance {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 0.3rem;
}
.maintenance-form {
    width: 100%;
    display: flex;
    flex-direction: column;
}
.drive-row {
    width: 100%;
    height: 1rem;
    padding: 0 0.2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    box-sizing: border-box;
    border-bottom: 1px solid #ededed;
}
.textarea-row {
    width: 100%;
    padding: 0 0.2rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    box-sizing: border-box;
}
.textarea-row > div {
    margin: 0.35rem 0 0 0;
}
.textarea-row .form-right {
    align-items: flex-start;
    height: auto;
}
.textarea-row textarea {
    font-size: 0.28rem;
    color: #999;
    padding: 0.05rem;
    line-height: 0.32rem;
}
.van-radio-group {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
.van-radio {
    margin-left: 0.25rem;
    font-size: 0.26rem;
    color: #555;
}
.form-right {
    display: flex;
    flex: auto;
    height: 1rem;
    align-items: center;
    justify-content: flex-end;
    position: relative;
}
.form-right .km-unit {
    white-space: nowrap;
}
.form-right > input {
    border: 0;
    outline: none;
    background: inherit;
    padding: 0;
    margin: 0;
    font-size: 0.28rem;
    text-align: right;
}
.popup-content {
    width: 100vw;
    height: 100vh;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}
.van-cell-group {
    width: 100%;
}
.van-cell:not(:last-child)::after {
    left: 0;
}
.popup-content > div,
.popup-container {
    width: 100%;
}
.cell-container {
    width: 100%;
    height: 70vh;
    overflow: auto;
}
.tab-container {
    width: 100%;
    height: 70vh;
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.tab-row {
    width: 100%;
    min-height: 2rem;
    padding: 0.2rem;
    box-sizing: border-box;
    border-bottom: 1px solid #ededed;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.bespeak-time {
    width: 20%;
    border-right: 1px solid #ededed;
    display: flex;
    align-items: center;
    justify-content: center;
}
.bespeak-time > span {
    display: inline-flex;
    width: 80%;
    height: 0.6rem;
    background: #37acff;
    color: #fff;
    font-size: 0.3rem;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
}
.plate-list {
    width: 75%;
    height: auto;
    display: flex;
    flex-wrap: wrap;
}
.plate {
    width: 30%;
    height: 0.6rem;
    margin: 0.1rem 0 0.1rem 3.33%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.26rem;
    color: #666;
    border-radius: 4px;
}
.plate.optional {
    background: #ddd;
}
.plate.optional.checked {
    background: #37acff;
    color: #fff;
}
.plate.unoptional {
    background: red;
}
.popup-bottom {
    width: 100%;
    height: 20vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}
.plate-state {
    width: 100%;
    padding: 0.3rem 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
}
.plate-state > div > i {
    display: inline-block;
    width: 0.5rem;
    height: 0.3rem;
    border-radius: 2px;
    margin: 0 0.1rem 0 0;
}
.optional > i {
    background: #ddd;
}
.unoptional > i {
    background: red;
}
.selected > i {
    background: #37acff;
}
.popup-btn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.popup-btn > button {
    width: 50%;
    height: 0.8rem;
    border: 0;
    outline: none;
    font-size: 0.32rem;
    color: #fff;
}
.confirm-btn {
    background: #37acff;
}
.cancel-btn {
    background: #999;
}
.bespeak-btn {
    width: 100%;
    height: 0.8rem;
    outline: none;
    border: 0;
    background: #37acff;
    color: #fff;
    border-radius: 0;
    font-size: 0.32rem;
}
.bespeak-btn:disabled {
    background: #999;
}
</style>
