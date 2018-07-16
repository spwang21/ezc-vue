<template>
    <div class="memberInfo">
        <div class="member-avatar">
            <div class="memberInfo-left">头像</div>
            <div class="user-pic">
                <img v-if="userInfo.head_img!=''" :src="baseUrl+userInfo.head_img">
                <img v-else src="../assets/img/user_pic_m.png">
            </div>
        </div>
        <div class="memberInfo-row">
            <div class="memberInfo-left">昵称</div>
            <div class="memberInfo-right">{{userInfo.nick_name}}</div>
        </div>
        <div class="memberInfo-row">
            <div class="memberInfo-left">真实姓名</div>
            <div class="memberInfo-right">{{userInfo.true_name}}</div>
        </div>
        <div class="memberInfo-row">
            <div class="memberInfo-left">性别</div>
            <div class="memberInfo-right">
                <span v-if="userInfo.sex==1">男</span>
				<span v-if="userInfo.sex==2">女</span>
            </div>
        </div>
        <div class="memberInfo-row">
            <div class="memberInfo-left">手机号</div>
            <div class="memberInfo-right">{{userInfo.phone}}</div>
        </div>
        <div class="memberInfo-row">
            <div class="memberInfo-left">出生年月</div>
            <div class="memberInfo-right">{{userInfo.birthday}}</div>
        </div>
        <div class="memberInfo-row">
            <div class="memberInfo-left">所在地区</div>
            <div class="memberInfo-right">{{userInfo.area}}</div>
        </div>
        <div class="member-address">
            <div class="memberInfo-left">详细地址</div>
            <textarea  cols="24" rows="5" readonly :value="userInfo.detail_address"></textarea>
        </div>
        <a class="edit-btn" href="#/mine/myInfo">编辑</a>
    </div>
</template>

<script>
import axios from "axios";
export default {
    name: "memberInfo",
    data() {
        return {
            baseUrl: baseUrl,
            userInfo: []
        };
    },
    created() {
        var that = this;
        axios({
            method: "POST",
            url: baseUrl + "/app/Mine/list_my_info",
            data: {
                token: localStorage['token']
            }
        })
            .then(res => {
                if (res.data.state) {
                    that.userInfo = res.data.result;
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
.memberInfo {
    width: 100%;
    display: flex;
    flex-direction: column;
    font-size: .3rem;
}
.member-avatar {
    width: 100%;
    height: 1.4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.2rem;
    box-sizing: border-box;
    border-bottom: 1px solid #ededed;
}
.memberInfo-row{
    width: 100%;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.2rem;
    box-sizing: border-box;
    border-bottom: 1px solid #ededed;
}
.user-pic{
    width: 1rem;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    overflow: hidden;
}
.user-pic>img{
    width: 100%;
    height: 100%;
}
.member-address{
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: .35rem .2rem 0 .2rem;
    box-sizing: border-box;
}
.member-address textarea{
    padding: .1rem;
    line-height: .34rem;
    border-color: #ddd;
    border-radius: 4px;
}
.edit-btn{
    display: inline-block;
    width:7.1rem;
    height: .8rem;
    line-height: .8rem;
    text-align: center;
    background: #37acff;
    margin: 1rem 0 0 .2rem;
    border-radius: 4px;
    color: #fff;
    font-size: .32rem;
}
</style>
