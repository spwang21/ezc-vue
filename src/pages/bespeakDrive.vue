<template>
    <div class="drive-form">
        <div class="drive-form-content">
            <!-- <div class="drive-row">
                <div class="form-left">试驾类型</div>
                <div class="form-right">
                    <van-radio-group v-model="driveType">
                        <van-radio name="1">预约试驾</van-radio>
                        <van-radio name="2">到店试驾</van-radio>
                    </van-radio-group>
                </div>
            </div>
            <div class="drive-row">
                <div class="form-left">预约4S店</div>
                <div class="form-right">
                    {{shop}}
                </div>
            </div> -->
            <div class="drive-row">
                <div class="form-left">试驾姓名</div>
                <div class="form-right">
                    <input type="text" placeholder="请输入试驾姓名" v-model="driverName">
                </div>
            </div>
            <div class="drive-row">
                <div class="form-left">联系电话</div>
                <div class="form-right">
                    <input type="text" placeholder="请输入联系电话" v-model="mobile">
                </div>
            </div>
            <div class="drive-row">
                <div class="form-left">试驾品牌</div>
                <div class="form-right" @click="getCarBrand">
                    <input type="text" v-model="carBrand" placeholder="请选择试驾品牌" readonly>
                    <van-icon name="arrow" />
                </div>
            </div>
            <div class="drive-row">
                <div class="form-left">试驾车型</div>
                <div class="form-right" @click="getCarType">
                    <input type="text" v-model="carType" placeholder="请选择试驾车型" readonly>
                    <van-icon name="arrow" />
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
                <div class="form-left">上传行驶证</div>
                <div class="form-right" @click="fileToggle(1)">
                    <input type="text" :placeholder="placeholder" readonly>
                    <van-icon name="arrow" />
                    <img class="drive-pic" v-if="driveImg!=''" :src="driveImg" alt="">
                </div>
            </div>
            <div class="drive-protocol">
                <van-checkbox v-model="protocol" @change="protocolCheck">
                    本人已阅读并同意
                    <span class="protocol" @click="alertProtocol">《试乘试驾协议》</span>声明
                </van-checkbox>
            </div>
            <!-- picker选择器 -->
            <van-popup v-model="popupShow" position="bottom">
                <van-picker show-toolbar :columns="columns" @cancel="onCancel" @confirm="onConfirm" />
            </van-popup>
            <!-- 选择时间 -->
            <van-popup v-model="popupRight" position="right" :overlay="false">
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
                                            <div class="plate" v-for="(plate,j) in time.number" :key="j" @click="plateSelect(item,time,plate)" :class="{'optional':plate.value==0,'unoptional':plate.value==1,'checked':plate.checked}">{{plate.car_num}}</div>
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
                            <button class="cancel-btn" @click="closeRightPopup">取消选择</button>
                            <button class="confirm-btn" @click="confirmBespeakTime">确定选择</button>
                        </div>
                    </div>
                </div>
            </van-popup>
            <!-- 上传行驶证 -->
            <van-actionsheet v-model="fileShow">
                <div class="actionsheet-title">请上传行驶证</div>
                <div class="actionsheet-row">
                    <span>从相册中选择</span>
                    <input type="file" accept="image/*" @change="fileChange">
                </div>
                <div class="actionsheet-row">
                    <span>拍照</span>
                    <input type="file" capture="camera" accept="image/*" @change="fileChange">
                </div>
                <div class="actionsheet-close" @click="fileToggle(0)">取消</div>
            </van-actionsheet>
        </div>
        <div class="bottom-btn">
            <button class="bespeak-btn" :disabled="!protocol" @click="submitBespeak">立即预约</button>
        </div>
    </div>

</template>

<script>
import axios from "axios";

export default {
    name: "bespeakDrive",
    data() {
        return {
            fileShow: false,
            driveType: "1",
            driverName: "",
            mobile: "",
            carBrand: "",
            carType: "",
            carTypeId: "",
            protocol: false,
            popupShow: false,
            popupRight: false,
            pickerState: "",
            columns: [],
            bespeakInfo: [
                { bespeakDate: dayOne, timeInfo: "", dateId: 1 },
                { bespeakDate: dayTwo, timeInfo: "", dateId: 2 },
                { bespeakDate: dayThree, timeInfo: "", dateId: 3 }
            ],
            bespeakTime: "",
            bespeakTimeStr: "",
            bespeakIdStr: "",
            willTime: "",
            plateNum: "",
            driveImg: "",
            placeholder: "请上传行驶证"
        };
    },
    methods: {
        fileToggle(state) {
            if (state) {
                this.fileShow = true;
            } else {
                this.fileShow = false;
            }
        },
        protocolCheck() {
            if (this.protocol) {
                this.$dialog.alert({
                    title: title,
                    message: message
                });
            }
        },
        alertProtocol() {
            var that = this;
            if (!this.protocol) {
                this.$dialog.alert({
                    title: title,
                    message: message
                });
            }
        },
        onConfirm(value, index) {
            if (this.pickerState == 1) {
                this.carBrand = value;
                this.popupShow = false;
            } else if (this.pickerState == 2) {
                this.carType = value.text;
                this.carTypeId = value.value;
                this.popupShow = false;
            }
        },
        onCancel() {
            this.popupShow = false;
        },
        getCarBrand() {
            var that = this;
            axios({
                method: "POST",
                url: baseUrl + "/app/Drive/list_drive_brand",
                data: {
                    organize_id: localStorage['shopId']
                }
            })
                .then(res => {
                    if (res.data.state) {
                        var carBrand = new Array();
                        res.data.result.forEach((item, index) => {
                            carBrand.push(item.brand);
                            return carBrand;
                        });
                        that.columns = carBrand;
                        that.pickerState = 1;
                        that.popupShow = true;
                    } else {
                        that.$toast(res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        getCarType() {
            var that = this;
            if (this.carBrand == "") {
                this.$toast("请先选择试驾品牌");
            } else {
                axios({
                    method: "POST",
                    url: baseUrl + "/app/Drive/list_drive_car_type",
                    data: {
                        brand: that.carBrand,
                        organize_id: localStorage['shopId']
                    }
                })
                    .then(res => {
                        if (res.data.state) {
                            var carType = new Array();
                            res.data.result.forEach((item, index) => {
                                carType.push({
                                    text: item.car_type,
                                    value: item.id
                                });
                                return carType;
                            });
                            that.columns = carType;
                            that.pickerState = 2;
                            that.popupShow = true;
                        } else {
                            that.$toast(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        },
        getBespeakTime() {
            if (this.carTypeId == "") {
                this.$toast("请先选择试驾车型");
            } else {
                this.getBespeakInfo(0, dayOne);
                this.getBespeakInfo(1, dayTwo);
                this.getBespeakInfo(2, dayThree);
                this.popupRight = true;
            }
        },
        getBespeakInfo(index, title) {
            var that = this;
            axios({
                method: "POST",
                url: baseUrl + "/app/Drive/list_drive_station",
                data: {
                    organize_id: localStorage['shopId'],
                    car_type_id: that.carTypeId,
                    date_num: index + 1
                }
            })
                .then(res => {
                    if (res.data.state) {
                        that.bespeakInfo[index].timeInfo = res.data.result;
                        that.bespeakInfo[index].timeInfo.forEach((i, n) => {
                            i.number.forEach((j, m) => {
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
        closeRightPopup() {
            this.popupRight = false;
        },
        confirmBespeakTime() {
            if (this.bespeakTime == "") {
                this.$toast("请先选择试驾车牌");
            } else {
                this.bespeakTimeStr = this.bespeakTime + " " + this.plateNum;
                this.popupRight = false;
            }
        },
        plateSelect(item, time, plate) {
            this.bespeakInfo.forEach((x, y) => {
                x.timeInfo.forEach((i, n) => {
                    i.number.forEach((j, m) => {
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
                plate.car_num_id;
            this.bespeakTime = item.bespeakDate + " " + time.will_time;
            this.willTime = time.will_time;
            this.plateNum = plate.car_num;
        },
        fileChange(e) {
            this.fileShow = false;
            var that = this;
            var reader = new FileReader();
            var imgSize = e.target.files[0].size;
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = function(e) {
                var dataURL = e.target.result;
                if (imgSize > 1024 * 1024) {
                    var imaged = new Image();
                    imaged.src = dataURL;
                    imaged.onload = function() {
                        var canvas = document.createElement("canvas");
                        var ctx = canvas.getContext("2d");
                        var w = 0;
                        var h = 0;
                        if (this.width > this.height) {
                            h = 1000;
                            var scale = this.width / this.height;
                            h = h > this.height ? this.height : h;
                            w = h * scale;
                        } else {
                            w = 1000;
                            var scale = this.width / this.height;
                            w = w > this.width ? this.width : w;
                            h = w / scale;
                        }
                        var anw = document.createAttribute("width");
                        var anh = document.createAttribute("height");
                        anw.value = w;
                        anh.value = h;
                        canvas.setAttributeNode(anw);
                        canvas.setAttributeNode(anh);
                        ctx.drawImage(this, 0, 0, w, h);
                        dataURL = canvas.toDataURL("image/jpeg");
                        imgSize = convertToBinary(dataURL).size;
                        if (imgSize < 1024 * 1024) {
                            that.driveImg = dataURL;
                        } else {
                            that.$toast("上传图片过大，请重新上传！");
                        }
                    };
                } else {
                    that.driveImg = dataURL;
                }
            };
        },
        submitBespeak() {
            if (this.driverName == "") {
                this.$toast("请输入试驾人姓名");
            } else if (this.mobile == "") {
                this.$toast("请输入联系电话");
            } else if (this.carTypeId == "") {
                this.$toast("请选择试驾车型");
            } else if (this.bespeakTimeStr == "") {
                this.$toast("请选择试驾时间");
            } else if (this.driveImg == "") {
                this.$toast("请上传行驶证图片");
            } else {
                var that = this;
                axios({
                    method: "POST",
                    url: baseUrl + "/app/Drive/insert_drive",
                    data: {
                        organize_id: localStorage['shopId'],
                        token: localStorage['token'],
                        type: that.driveType,
                        nick_name: that.driverName,
                        phone: that.mobile,
                        car_type_id: that.carTypeId,
                        time_car_num_ids: that.bespeakIdStr,
                        will_time: that.willTime,
                        time_station_name: that.plateNum,
                        drive_pic: that.driveImg
                    }
                })
                    .then(function(res) {
                        if (res.data.state) {
                            that.$router.push("/record/drive");
                        } else {
                            that.$toast(res.data.msg);
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
        driveImg: function(val, oldVal) {
            this.placeholder = "";
        }
    }
};
</script>

<style scoped>
.drive-form {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 0.3rem;
}
.drive-form-content {
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
    height: 1rem;
    align-items: center;
    position: relative;
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
.drive-pic {
    position: absolute;
    top: 0;
    right: 0.3rem;
    width: 1rem;
    height: 1rem;
}
.actionsheet-title {
    width: 100%;
    height: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.24rem;
    color: #999;
    border-bottom: 1px solid #ededed;
}
.actionsheet-row {
    width: 100%;
    height: 0.8rem;
    border-bottom: 1px solid #ededed;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}
.actionsheet-row > span {
    font-size: 0.3rem;
    color: #37acff;
}
.actionsheet-row > input[type="file"] {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    bottom: 0;
    opacity: 0;
}
.actionsheet-close {
    width: 100%;
    height: 0.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.3rem;
    color: #666;
    border-top: 0.1rem solid #ededed;
}
.drive-protocol {
    width: 100%;
    height: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #666;
    font-size: 0.3rem;
}
.protocol {
    color: #37acff;
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
.popup-content {
    width: 100vw;
    height: 100vh;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}
.popup-container {
    width: 100%;
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
</style>
