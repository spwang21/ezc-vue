<template>
    <div class="home">
        <div class="home-page">
            <!-- 轮播图 -->
            <van-swipe :autoplay="3000">
                <van-swipe-item v-for="(item, index) in carouselTop" :key="index">
                    <a :href="item.href">
                        <img :src="baseUrl+item.img" />
                    </a>
                </van-swipe-item>
            </van-swipe>
            <!-- menu -->
            <div class="menu">
                <ul class="menu-row">
                    <router-link to="/drive" tag="li">
                        <div class="menu-icon">
                            <img src="../assets/img/home_drive.png" alt="">
                        </div>
                        <span class="menu-text">预约试驾</span>
                    </router-link>
                    <router-link to="/maintenance" tag="li">
                        <div class="menu-icon">
                            <img src="../assets/img/home_repair.png" alt="">
                        </div>
                        <span class="menu-text">预约维保</span>
                    </router-link>
                    <router-link to="/rescue" tag="li">
                        <div class="menu-icon">
                            <img src="../assets/img/home_onekey_rescue.png" alt="">
                        </div>
                        <span class="menu-text">一键救援</span>
                    </router-link>
                    <router-link to="/service" tag="li">
                        <div class="menu-icon">
                            <img src="../assets/img/home_service.png" alt="">
                        </div>
                        <span class="menu-text">专属客服</span>
                    </router-link>
                    <router-link to="/remind" tag="li">
                        <div class="menu-icon">
                            <img src="../assets/img/home_my_tx.png" alt="">
                        </div>
                        <span class="menu-text">我的提醒</span>
                    </router-link>
                </ul>
                <ul class="menu-row">
                    <router-link to="/coupons" tag="li">
                        <div class="menu-icon">
                            <img src="../assets/img/home_lqzx.png" alt="">
                        </div>
                        <span class="menu-text">领券中心</span>
                    </router-link>
                    <router-link to="/package" tag="li">
                        <div class="menu-icon">
                            <img src="../assets/img/home_tc.png" alt="">
                        </div>
                        <span class="menu-text">会员套餐</span>
                    </router-link>
                    <router-link to="/card" tag="li">
                        <div class="menu-icon">
                            <img src="../assets/img/home_kb.png" alt="">
                        </div>
                        <span class="menu-text">会员卡包</span>
                    </router-link>
                    <router-link to="/404" tag="li">
                        <div class="menu-icon">
                            <img src="../assets/img/ic_money.png" alt="">
                        </div>
                        <span class="menu-text">优惠活动</span>
                    </router-link>
                    <router-link to="/qrcode" tag="li">
                        <div class="menu-icon">
                            <img src="../assets/img/home_share.png" alt="">
                        </div>
                        <span class="menu-text">我的分享</span>
                    </router-link>
                </ul>
            </div>
            <!-- 会员 -->
            <div class="member-nav">
                <a href="http://www.yumazu.com.cn/">
                    <img src="../assets/img/home_huodong.png" />
                </a>
                <a href="#/sign">
                    <img src="../assets/img/home_qiandao.png" />
                </a>
            </div>
            <!-- 轮播图 -->
            <div class="bottom-carousel">
                <div>
                    <van-swipe :autoplay="3000">
                        <van-swipe-item v-for="(item, index) in carouselBottom" :key="index">
                            <a :href="item.href">
                                <img :src="baseUrl+item.img" />
                            </a>
                        </van-swipe-item>
                    </van-swipe>
                </div>
            </div>
        </div>
        <Home-Footer></Home-Footer>
    </div>
</template>

<script>
import axios from "axios";
import { Swipe, SwipeItem } from "vant";
import HomeFooter from "../pages/components/footer";
export default {
    name: "home",
    data() {
        return {
            baseUrl: baseUrl,
            carouselTop: [],
            carouselBottom: []
        };
    },
    components: {
        HomeFooter
    },
    methods: {
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
        var that = this;
        axios({
            method: "POST",
            url: baseUrl + "/app/mallitem/carousel_img_get",
            data: {
                type: 4
            }
        })
            .then(res => {
                that.carouselTop = res.data.result;
            })
            .catch(err => {
                console.log(err);
            });
        axios({
            method: "POST",
            url: baseUrl + "/app/mallitem/carousel_img_get",
            data: {
                type: 5
            }
        })
            .then(res => {
                that.carouselBottom = res.data.result;
            })
            .catch(err => {
                console.log(err);
            });
    }
};
</script>
    
<style scoped>
.home {
    padding-bottom: 1.2rem;
}
.van-swipe-item > a {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
}
.van-swipe-item img {
    width: 100%;
}
.menu {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0.1rem 0;
}
.menu-row {
    width: 100%;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
}
.menu-row > li {
    display: flex;
    width: 25%;
    height: 1.5rem;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.menu-icon {
    width: 0.7rem;
    height: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0 0.2rem 0;
}
.menu-icon > img {
    width: 100%;
}
.menu-text {
    font-size: 0.24rem;
    color: #555;
}
.member-nav {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
}
.member-nav > a {
    display: inline-flex;
    width: 46%;
    height: 1.31rem;
    align-items: center;
}
.member-nav > a:first-child {
    margin: 0 0 0 0.2rem;
}
.member-nav > a:last-child {
    margin: 0 0.2rem 0 0;
}
.member-nav img {
    width: 100%;
}
.bottom-carousel {
    width: 100%;
    margin: 0.2rem 0 0 0;
    padding: 0 0.2rem;
    display: flex;
    box-sizing: border-box;
}
.bottom-carousel > div {
    width: 100%;
}
.bottom-carousel .van-swipe-item img {
    max-height: 3rem;
}
</style>


