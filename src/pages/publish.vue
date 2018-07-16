<template>
    <div class="publish-form">
        <div class="publish-text">
            <textarea maxlength="150" rows="8" v-model="publishText" placeholder="请输入要发表的内容"></textarea>
            <div class="text-prompt">
				<span>{{publishText | formatText}}</span>/150字
			</div>
        </div>
        <div class="publish-img">
            <div class="publishImg-item" v-for="(item,index) in publishImgs" :key="index">
                    <img :src="item" @click="previewImg(index)">
                    <img class="delete-icon" @click="deletePic(index)" src="../assets/img/close.png" alt="">
                </div>
            <div class="upload-btn" v-if="publishImgs.length<3" @click="fileToggle(1)"><img src="../assets/img/uploadImg.png" alt=""></div>
        </div>
        <button class="publish-btn" @click="publish">发表</button>
        <!-- 上传图片 -->
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
</template>

<script>
import axios from "axios";
import { ImagePreview } from "vant";
export default {
    name:'publish',
    data(){
        return {
            publishText:'',
            fileShow:false,
            publishImgs:[]
        }
    },
    filters:{
        formatText(value){
            return value.replace(/\n|\r/gi, "").length;
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
                            that.publishImgs.push(dataURL);
                        } else {
                            that.$toast("上传图片过大，请重新上传！");
                        }
                    };
                } else {
                    that.publishImgs.push(dataURL);
                }
            }
        },
        deletePic(index){//删除图片
			this.publishImgs.splice(index,1);
        },
        previewImg(index){
            ImagePreview(this.publishImgs,index);
        },
        publish(){
            if(this.publishText==''){
                this.$toast("请先输入要发布的内容")
            }else{
                var that = this;
                var publishImgStr = '';
                this.publishImgs.forEach((item,index)=>{
                    if(publishImgStr==''){
                        publishImgStr += item;
                    }else{
                        publishImgStr += '@'+item;
                    }
                });
                var userInfo = JSON.parse(localStorage.getItem("loginInfo")).data.result;
                axios({
                    method: "POST",
                    url: baseUrl + "/app/Community/add_community_publish",
                    data: {
                        token: localStorage['token'],
                        user_id:localStorage['userId'],
                        topic_info: that.publishText,
                        slideshow_img: publishImgStr
                    }
                })
                    .then(res => {
                        if (res.data.state) {
                            that.$router.push('/community');
                        } else {
                            that.$toast(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
            
        }
    }
}
</script>

<style scoped>
.publish-form{
    width: 100%;
    font-size: .3rem;
}
.publish-text{
    width: 6.9rem;
    display: flex;
    flex-direction: column;
    padding: 0 0 .2rem 0;
    margin: .3rem auto 0 auto;
    border-radius: 4px;
    border: 1px solid #ededed;
    box-sizing: border-box;
}
.publish-text>textarea{
    width: 100%;
    border: 0;
    color: #666;
    padding: .1rem;
    box-sizing: border-box;
}
.text-prompt{
    width: 100%;
    text-align: right;
    color: #999;
    margin: .2rem 0 0 0;
    padding: 0 .2rem 0 0;
    box-sizing: border-box;
}
.publish-img{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin: .5rem 0 0 0;
}
.upload-btn,.publishImg-item{
    width: 2.1rem;
    height: 1.51rem;
    display: flex;
    align-items: center;
    justify-content: center;    
    margin: 0 0 0 .3rem;
}
.upload-btn>img,.publishImg-item>img{
    width: 100%;
    height: 100%;
}
.publishImg-item{
    position: relative;
}
.publishImg-item>img.delete-icon{
    position: absolute;
    width: .3rem;
    height: .3rem;
    top: -0.1rem;
    right: -0.1rem;
}
.publish-btn{
    width: 6.9rem;
    height: .8rem;
    margin: 1.5rem .3rem 0 0;
    background: #37acff;
    color: #fff;
    border: 0;
    outline: none;
    border-radius: 4px;
    font-size: .34rem;
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
</style>
