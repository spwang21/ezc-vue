<template>
    <div class="mine">
        <div class="mine-page">
            <div class="user-info">
                <div class="user-pic">
                    <img :src="baseUrl+userInfo.head_img" />
                </div>
                <div class="user-info-content">
                    <div class="user-nickname">
                        <span>{{userInfo.nick_name}}</span>
                    </div>
                    <div class="user-mobile">
                        {{userInfo.phone}}
                    </div>
                </div>
                <div class="user-rights">
                    <a class="rights-btn" href="#/mine/integral">会员积分</a>
                </div>
            </div>
            <!-- <div class="member-menu">
                <a href="javascript:;">
                    <img src="../assets/img/my_balance.png" />
                    <span>余额</span>
                </a>
                <a href="javascript:;">
                    <img src="../assets/img/my_integral.png" />
                    <span>积分</span>
                </a>
                <a href="member_package.html">
                    <img src="../assets/img/my_package.png" />
                    <span>套餐</span>
                </a>
                <a href="member_card.html">
                    <img src="../assets/img/my_coupon.png" />
                    <span>卡包</span>
                </a>
            </div> -->
            <div class="user-menu">
                <router-link class="user-menu-row" to="/mine/order" tag="div">
                    <van-icon name="arrow" />
                    <img class="user-menu-icon" src="../assets/img/user_order.png" />
                    <div class="user-menu-title">我的订单</div>
                </router-link>
                <router-link class="user-menu-row" to="/mine/myInfo" tag="div">
                    <van-icon name="arrow" />
                    <img class="user-menu-icon" src="../assets/img/user_info.png" />
                    <div class="user-menu-title">会员信息</div>
                </router-link>
                <!-- <div class="user-menu-row">
                    <van-icon name="arrow" />
                    <img class="user-menu-icon" src="../assets/img/user_notice.png" />
                    <div class="user-menu-title">我的提醒</div>
                </div> -->
                <router-link class="user-menu-row" to="/mine/vehicle" tag="div">
                    <van-icon name="arrow" />
                    <img class="user-menu-icon" src="../assets/img/user_lovecar.png" />
                    <div class="user-menu-title">车辆信息</div>
                </router-link>
                <router-link class="user-menu-row" to="/record/drive" tag="div">
                    <van-icon name="arrow" />
                    <img class="user-menu-icon" src="../assets/img/drive_record.png" />
                    <div class="user-menu-title">试驾记录</div>
                </router-link>
                <router-link class="user-menu-row" to="/record/maintenance" tag="div">
                    <van-icon name="arrow" />
                    <img class="user-menu-icon" src="../assets/img/maintence_record.png" />
                    <div class="user-menu-title">维保记录</div>
                </router-link>
                <router-link class="user-menu-row" to="/record/rescue" tag="div">
                    <van-icon name="arrow" />
                    <img class="user-menu-icon" src="../assets/img/rescue_record.png" />
                    <div class="user-menu-title">救援记录</div>
                </router-link>
                <router-link class="user-menu-row" to="/mine/about" tag="div">
                    <van-icon name="arrow" />
                    <img class="user-menu-icon" src="../assets/img/about_ezc.png" />
                    <div class="user-menu-title">关于我们</div>
                </router-link>
                <!-- <div class="exit-btn">
                    <a href="javascript:;" @click="exit">退出登录</a>
                </div> -->
            </div>
        </div>
        <Home-Footer></Home-Footer>
    </div>
</template>

<script>
import axios from "axios";
import jsonp from "jsonp";
import HomeFooter from "../pages/components/footer";

export default {
    name: "mine",
    data() {
        return {
            baseUrl: baseUrl,
            userInfo: ""
        };
    },
    components: {
        HomeFooter
    },
    created() {
        if (this.$route.query.token == undefined) {
            this.getUserInfo(localStorage["token"]);
        } else {
            localStorage.setItem("token", this.$route.query.token);
            this.getUserInfo(localStorage["token"]);
        }
        var that = this;
        axios({
            method: "POST",
            url: baseUrl + "/app/Mine/list_my_info",
            data: {
                token: localStorage["token"]
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
        // jsonp(
        //     "http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=24.534982,118.192418&output=json&pois=1&ak=Rqu7qLFEKGEGEK2ZcGUUM2HG4PkkjMdl",
        //     null,
        //     (err, data) => {
        //         if (err) {
        //             console.error(err.message);
        //         } else {
        //             console.log(data);
        //         }
        //     }
        // );
    },
    methods: {
        exit() {
            this.$router.push("/login");
        },
        getUserInfo(token) {
            var _this = this;
            axios({
                method: "POST",
                url: baseUrl + "/app/Mine/list_my_info",
                data: {
                    token: token
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
    }
};
</script>

<style scoped>
.mine {
    padding-bottom: 1.2rem;
}
.user-info {
    width: 100%;
    height: 3.6rem;
    border-bottom: 0.2rem solid #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: url(../assets/img/bg.png) 0 88% no-repeat;
    background-size: 100% auto;
}
.user-pic {
    display: flex;
    align-items: center;
    width: 1.32rem;
    height: 1.32rem;
    margin: 0 0 0 0.3rem;
    border-radius: 50%;
    overflow: hidden;
}
.user-pic > img {
    width: 100%;
    height: 100%;
}
.user-info-content {
    width: 3.5rem;
    height: 2rem;
    margin: 0.1rem 0 0.1rem 0.3rem;
    display: flex;
    flex-direction: column;
}
.user-nickname {
    width: 100%;
    height: 1rem;
    margin: 0.1rem 0;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    font-size: 0.32rem;
}
.user-nickname > span {
    width: 100%;
    color: #37acff;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
}
.user-mobile {
    width: 100%;
    height: 1rem;
    margin: 0.1rem 0;
    display: flex;
    align-items: flex-start;
    font-size: 0.28rem;
    color: #333;
}
.user-rights {
    width: 1.68rem;
    height: 2.3rem;
    margin: 0 0 0 0.4rem;
    display: flex;
    align-items: center;
}
.rights-btn {
    width: 100%;
    height: 0.6rem;
    line-height: 0.6rem;
    text-align: center;
    background: rgb(55, 172, 255);
    font-size: 0.3rem;
    color: #fff;
    border-radius: 0.3rem 0 0 0.3rem;
    box-shadow: 0 0.1rem 0.1rem #0062cc;
}
.user-menu {
    width: 100%;
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
}
.user-menu-row {
    width: 100%;
    height: 1rem;
    border-bottom: 1px solid #ededed;
    position: relative;
    display: flex;
    align-items: center;
    background: #fff;
    box-sizing: border-box;
}
.user-menu-row > i.van-icon.van-icon-arrow {
    position: absolute;
    display: inline-block;
    box-sizing: border-box;
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    text-align: right;
    font-size: 0.32rem;
    color: #999;
    padding: 0 0.2rem 0 0;
}
.user-menu-icon {
    width: 0.6rem;
    height: 0.6rem;
    margin: 0 0 0 0.3rem;
}
.user-menu-title {
    margin: 0 0 0 0.3rem;
    font-size: 0.3rem;
    color: #333;
}
.member-menu {
    display: flex;
    width: 100%;
    padding: 0.2rem 0;
    border-bottom: 0.2rem solid #f5f5f5;
}
.member-menu > a {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 25%;
}
.member-menu > a > img {
    width: 0.82rem;
    height: 0.82rem;
    margin: 0 0 0.2rem 0;
}
.member-menu > a > span {
    font-size: 0.3rem;
    color: #333;
}
.exit-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem 0;
}
.exit-btn > a {
    display: inline-block;
    width: 6rem;
    height: 0.8rem;
    line-height: 0.8rem;
    border-radius: 0.1rem;
    text-align: center;
    background: #37acff;
    color: #fff;
    font-size: 0.32rem;
}
</style>
