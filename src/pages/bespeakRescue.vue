<template>
    <div class="rescue">
        <div class="rescue-form">
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
                <div class="form-left">上传行驶证</div>
                <div class="form-right" @click="fileToggle(1)">
                    <input type="text" :placeholder="placeholder" readonly>
                    <van-icon name="arrow" />
                    <img class="drive-pic" v-if="driveImg!=''" :src="driveImg" alt="">
                </div>
            </div>
            <div class="drive-row">
                <div class="form-left">故障图片</div>
                <div class="form-right">
                    <input type="text" placeholder="请上传故障图片(最多五张)" readonly>
                </div>
            </div>
            <div class="breakdownImg">
                <div class="breakdownImg-item" v-for="(item,index) in breakdownImgs" :key="index">
                    <img :src="item" @click="previewImg(index)">
                    <img class="delete-icon" @click="deletePic(index)" src="../assets/img/close.png" alt="">
                </div>
                <div class="upload-btn" v-if="breakdownImgs.length<5" @click="openSheet"><img src="../assets/img/addImg.png" alt=""></div>
            </div>
            <div class="drive-row">
                <div class="form-left">所在位置</div>
                <div class="form-right" @click="getLocation">
                    <input type="text" v-model="rescueAddr" placeholder="请获取故障地点位置" readonly>
                    <van-icon name="arrow" />
                </div>
            </div>
            <div class="textarea-row">
                <div class="form-left">故障描述</div>
                <div class="form-right">
                    <textarea cols="28" rows="5" :placeholder="`请输入车子故障具体情况，以便4S店更好地为您提供服务`" v-model="introduce"></textarea>
                </div>
            </div>
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
            <!-- 上传故障图片 -->
            <van-actionsheet v-model="sheetShow">
                <div class="actionsheet-title">请上传故障图片</div>
                <div class="actionsheet-row">
                    <span>拍照</span>
                    <input type="file" capture="camera" accept="image/*" @change="uploadImg">
                </div>
                <div class="actionsheet-close" @click="closeSheet">取消</div>
            </van-actionsheet>
        </div>
        <div class="bottom-btn">
            <button class="bespeak-btn" @click="submitBespeak">一键救援</button>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import wx from "weixin-js-sdk";
import { ImagePreview } from "vant";
export default {
    name:'bespeakRescue',
    data(){
        return{
            userName:"",
            mobile:"",
            mileage:"",
            plateNum:"",
            placeholder:"请上传行驶证",
            driveImg:"",
            fileShow:false,
            introduce:"",
            sheetShow:false,
            breakdownImgs:[],
            rescueAddr:""
        }
    },
    methods:{
        fileToggle(state) {
            if (state) {
                this.fileShow = true;
            } else {
                this.fileShow = false;
            }
        },
        fileChange(e){
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
            }
        },
        openSheet(){
            this.sheetShow = true;
        },
        closeSheet(){
            this.sheetShow = false;
        },
        uploadImg(e){
            this.sheetShow = false;
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
                            that.breakdownImgs.push(dataURL);
                        } else {
                            that.$toast("上传图片过大，请重新上传！");
                        }
                    };
                } else {
                    that.breakdownImgs.push(dataURL);
                }
            }
        },
        deletePic(index){//删除故障图片
			this.breakdownImgs.splice(index,1);
        },
        previewImg(index){
            ImagePreview(this.breakdownImgs,index);
        },
        getLocation(){
            this.$toast('暂时还没实现定位功能')
        },
        submitBespeak(){
            // 一键救援
            this.$toast('暂时还没接通救援功能')
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
        },
        plateNum: function(val, oldVal) {
            this.plateNum = val.toUpperCase();
        }
    }
}
</script>

<style scoped>
.rescue {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 0.3rem;
}
.rescue-form {
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
.breakdownImg{
    width: 100%;
    display: flex;
    height: 1.66rem;
    align-items: center;
    border-bottom: 1px solid #ededed;
}
.breakdownImg>div{
    display: flex;
    width: 1.26rem;
    height: 1.26rem;
    margin: 0 0 0 .2rem;
    align-items: center;
}
.breakdownImg>div>img{
    width: 100%;
    height: 100%;
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
.breakdownImg-item{
    position: relative;
}
.breakdownImg-item>.delete-icon{
    position: absolute;
    width: .3rem;
    height: .3rem;
    top: -0.1rem;
    right: -0.1rem;
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
