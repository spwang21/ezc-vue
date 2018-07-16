<template>
    <div class="mall">
        <div class="mall-page">
            <!-- 搜索框 -->
            <div class="search">
                <div class="search-box">
                    <van-icon name="search" />
                    <input type="search" placeholder="搜索商品名称" v-model="searchWord" v-on:keydown="search">
                </div>
            </div>
            <!-- 商城轮播 -->
            <van-swipe :autoplay="3000">
                <van-swipe-item v-for="(item,index) in carousel" :key="index">
                    <a href="#">
                        <img :src="baseUrl+item" />
                    </a>
                </van-swipe-item>
            </van-swipe>
            <!-- 套餐推荐 -->
            <div class="package">
                <div class="package-top">
                    <div class="package-title">套餐推荐</div>
                    <router-link to="/mall/package">
                        <span>更多</span>
                        <van-icon name="arrow" />
                    </router-link>
                </div>
                <div class="package-content">
                    <div class="package-banner">
                        <a href="#/mall"><img :src="baseUrl+packageBanner"></a>
                    </div>
                    <div class="package-list">
                        <div class="package-item" v-for="(item,index) in packageList" :key="index">
                            <a :href="'#/mall/package/'+item.id">
                                <img :src="baseUrl+item.img_src" alt="">
                                <div class="package-name">{{item.package_name}}</div>
                                <div class="package-price">{{item|formatPrice}}</div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 商品推荐 -->
            <div class="package">
                <div class="package-top">
                    <div class="package-title">精品推荐</div>
                    <router-link to="/mall/goods">
                        <span>更多</span>
                        <van-icon name="arrow" />
                    </router-link>
                </div>
                <div class="package-content">
                    <div class="package-list">
                        <div class="goods-item" v-for="(item,index) in commodity" :key="index">
                            <a :href="'#/mall/goods/'+item.id">
                                <img :src="baseUrl+item.img_src" alt="">
                                <div class="package-name">{{item.item_name}}</div>
                                <div class="package-price">{{item|formatPrice}}</div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Home-Footer></Home-Footer>
    </div>
</template>

<script>
import axios from "axios";
import HomeFooter from "../pages/components/footer";
export default {
    name: "mall",
    data() {
        return {
            baseUrl: baseUrl,
            searchWord: "",
            carousel: [],
            packageList: [],
            packageBanner: "",
            commodity: []
        };
    },
    components: {
        HomeFooter
    },
    filters: {
        formatPrice(value) {
            if(value.true_price>0&&value.point>0){
                if(value.point<10000){
                    return "￥" + value.true_price.toFixed(1) + "+" + value.point + "积分";
                }else{
                    return "￥" + value.true_price.toFixed(1) + "+" + value.point/10000 + "万积分";
                }       
            }else if(value.true_price==0){
                return value.point + "积分";
            }else if(value.point==0){
                return "￥" + value.true_price.toFixed(1)
            }    
        }
    },
    methods: {
        search(e) {
            var keyWord = this.searchWord;
            if(e.keyCode == "13"){
				if(!this.searchWord==''){
					this.$router.push({ path: '/search', query: { keyword: keyWord }})
				}else{
                    this.$toast("请输入搜索关键字")
                }
			}
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
                type: 2
            }
        })
            .then(res => {
                that.carousel = res.data.result;
            })
            .catch(err => {
                console.log(err);
            });
        //套餐推荐banner
        axios({
            method: "POST",
            url: baseUrl + "/app/mallitem/carousel_img_get",
            data: {
                type: 3
            }
        })
            .then(res => {
                that.packageBanner = res.data.result.img1;
            })
            .catch(err => {
                console.log(err);
            });
        //套餐推荐
        axios({
            method: "POST",
            url: baseUrl + "/app/mallitem/package_list",
            data: {
                user_id: localStorage.getItem('userId'),
                is_proper: 1
            }
        })
            .then(res=>{
                if (res.data.state) {
                    that.packageList = res.data.result.info;
                } else {
                    that.$toast(res.data.msg)
                }
            })
            .catch(err=>{
                console.log(err);
            });
        //商品推荐
        axios({
            method: "POST",
            url: baseUrl + "/app/mallitem/list_items",
            data: {
                user_id: localStorage.getItem('userId'),
                is_proper: 1
            }
        })
            .then(res=>{
                that.commodity = res.data.result.info;
            })
            .catch(err=>{
                console.log(err);
            });
    }
};
</script>

<style scoped>
.mall {
    padding-bottom: 1.2rem;
}
.search {
    width: 100%;
    padding: 0.15rem 0.2rem;
    box-sizing: border-box;
}
.search-box {
    width: 100%;
    height: 0.62rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #c1c1c1;
    border-radius: 4px;
    box-sizing: border-box;
}
.search-box .van-icon {
    font-size: 0.38rem;
    color: #999;
    margin: 0 0 0 0.15rem;
}
.search-box > input {
    width: 6.2rem;
    height: 0.62rem;
    font-size: 0.28rem;
    color: #999;
    padding: 0;
    margin: 0 0.15rem 0 0;
    outline: none;
    border: 0;
    background: inherit;
}
.mall .van-swipe{
    width: 100%;
    box-sizing: border-box;
}
.mall .van-swipe-item > a {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
}
.mall .van-swipe-item>a>img {
    width: 100%;
    height: 3.45rem;
}
.package {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.package-top {
    width: 100%;
    height: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.package-title {
    max-width: 50%;
    margin: 0 0 0 0.2rem;
    padding: 0 0 0 0.2rem;
    font-size: 0.3rem;
    color: #37acff;
    border-left: 0.04rem solid #37acff;
}
.package-top > a {
    display: inline-flex;
    max-width: 40%;
    color: #37acff;
    align-items: center;
    margin: 0 .2rem 0 0;
}
.package-top > a > span {
    font-size: 0.26rem;
}
.package-top > a > .van-icon {
    font-size: 0.26rem;
}
.package-content{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    /* padding: 0 .2rem; */
    box-sizing: border-box;
}
.package-banner{
    width: 7.1rem;
    height: 2.8rem;
    display: flex;
    align-items: center;
    border-radius: 4px;
    overflow: hidden;
}
.package-banner>a{
    display: inline-flex;
    width: 100%;
    height: 2.8rem;
    align-items: center;
}
.package-banner>a>img{
    width: 100%;
    height: 2.8rem;
}
.package-list{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.package-item{
    width: 2.23rem;
    display: flex;
    flex-direction: column;
    margin: .2rem 0 0 .2rem;
    font-size: .3rem;
}
.package-item>a{
    display: inline-flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
}
.package-item>a>img{
    width: 100%;
    height: 2.23rem;
    border-radius: 4px;
}
.package-name{
    width: 100%;
    font-size: .26rem;
    color: #555;
    margin: .12rem 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
}
.package-price{
    width: 100%;
    font-size: .24rem;
    color: #ff2222;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
}
.goods-item{
    width: 3.3rem;
    display: flex;
    flex-direction: column;
    margin:.1rem 0 .1rem .3rem;
    font-size: .3rem;
}
.goods-item>a{
    display: inline-flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
}
.goods-item>a>img{
    width: 100%;
    height: 3.3rem;
    border-radius: 4px;
}
</style>
