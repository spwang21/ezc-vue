<template>
    <div class="package-list">
        <!-- 搜索框 -->
        <div class="search">
            <div class="search-box">
                <van-icon name="search" />
                <input type="search" placeholder="搜索商品名称" v-model="searchWord" v-on:keydown="search">
            </div>
        </div>
        <div class="filter-btns">
            <div class="filter-btn" :class="{'active':filterState==1||filterState==2}" @click="filterBySales">按销量<span v-if="filterState==2">↓</span><span v-if="filterState==1">↑</span></div>
            <div class="filter-btn" :class="{'active':filterState==3||filterState==4}" @click="filterByPrice">按价格<span v-if="filterState==4">↓</span><span v-if="filterState==3">↑</span></div>
        </div>
        <div class="package-content">
            <div class="package-item" v-for="(item,index) in packageList" :key="index">
                <a :href="'#/mall/package/'+item.id">
                    <img :src="baseUrl+item.img_src" alt="">
                    <div class="package-name">{{item.package_name}}</div>
                    <div class="package-price">{{item|formatPrice}}</div>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    name: "packageList",
    data() {
        return {
            searchWord: "",
            baseUrl: baseUrl,
            filterState: "",
            packageList: []
        };
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
            if (e.keyCode == "13") {
                if (!this.searchWord == "") {
                    this.$router.push({
                        path: "/search",
                        query: { keyword: keyWord }
                    });
                } else {
                    this.$toast("请输入搜索关键字");
                }
            }
        },
        filterBySales() {
            if (this.filterState == 2) {
                this.filterState = 1;
            } else {
                this.filterState = 2;
            }
            this.queryPackage(this.filterState);
        },
        filterByPrice() {
            if (this.filterState == 4) {
                this.filterState = 3;
            } else {
                this.filterState = 4;
            }
            this.queryPackage(this.filterState);
        },
        queryPackage(state) {
            var that = this;
            axios({
                method: "POST",
                url: baseUrl + "/app/mallitem/package_list",
                data: {
                    is_proper: 0,
                    user_id: localStorage['userId'],
                    order_type: state
                }
            })
                .then(res => {                  
                    if (res.data.state) {
                        that.packageList = res.data.result.info;
                    } else {
                        that.$toast(res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
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
        this.queryPackage();
    }
};
</script>

<style scoped>
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
.filter-btns {
    width: 100%;
    height: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f5f5f5;
    font-size: 0.3rem;
}
.filter-btn {
    width: 50%;
    text-align: center;
}
.filter-btn.active{
    color: #37acff;
}
.filter-btn>span{
    font-size: .32rem;
    margin: 0 0 0.1rem .1rem;
}
.package-content{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 .2rem;
    box-sizing: border-box;
}
.package-item{
    width: 3.45rem;
    display: flex;
    flex-direction: column;
    margin: .2rem 0 0 0;
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
    height: 3.45rem;
    border-radius: 4px;
}
.package-name{
    width: 100%;
    font-size: .3rem;
    color: #555;
    margin: .12rem 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
}
.package-price{
    width: 100%;
    font-size: .28rem;
    color: #ff2222;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
}
</style>
