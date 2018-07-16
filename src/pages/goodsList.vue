<template>
    <div class="goods-list">
        <!-- 搜索框 -->
        <div class="search">
            <div class="search-box">
                <van-icon name="search" />
                <input type="search" placeholder="搜索商品名称" v-model="searchWord" v-on:keydown="search">
            </div>
        </div>
        <div class="filter-btns">
            <div class="filter-btn" :class="{'active':filterState==1||filterState==2}" @click="filterBySales">按销量
                <span v-if="filterState==2">↓</span>
                <span v-if="filterState==1">↑</span>
            </div>
            <div class="filter-btn" :class="{'active':filterState==3||filterState==4}" @click="filterByPrice">按价格
                <span v-if="filterState==4">↓</span>
                <span v-if="filterState==3">↑</span>
            </div>
            <div class="filter-btn" :class="{'active':filterSortId!=''}" @click="openSortList">筛选</div>
        </div>
        <div class="goods-content">
            <div class="goods-item" v-for="(item,index) in goodsList" :key="index">
                <a :href="'#/mall/goods/'+item.id">
                    <img :src="baseUrl+item.img_src" alt="">
                    <div class="goods-name">{{item.item_name}}</div>
                    <div class="goods-price">{{item|formatPrice}}</div>
                </a>
            </div>
        </div>
        <!-- 分类列表 -->
        <van-popup v-model="sortShow" position="right">
            <div class="sort-list">
                <div>
                    <div class="sort-item" v-for="(x,n) in sortList" :key="n">
                        <div class="sort-item-title">{{x.sort_name}}</div>
                        <div class="sort-content">
                            <div class="sort" v-for="(y,m) in x.next" :class="{'active':filterSortId==y.id}" :key="m" @click="filterBySort(y.id)">{{y.sort_name}}</div>
                        </div>
                    </div>
                </div>
                <button class="reset-btn" :disabled="filterSortId==''" @click="resetSort">重置</button>
            </div>
        </van-popup>
    </div>
</template>

<script>
import axios from "axios";
export default {
    name: "goodsList",
    data() {
        return {
            searchWord: "",
            baseUrl: baseUrl,
            filterState: "",
            goodsList: [],
            sortShow: false,
            sortList: [],
            filterSortId:""
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
            this.queryGoods(this.filterState);
        },
        filterByPrice() {
            if (this.filterState == 4) {
                this.filterState = 3;
            } else {
                this.filterState = 4;
            }
            this.queryGoods(this.filterState);
        },
        queryGoods(state) {
            var that = this;
            axios({
                method: "POST",
                url: baseUrl + "/app/mallitem/list_items",
                data: {
                    is_proper: 0,
                    user_id: localStorage['userId'],
                    order_type: state,
                    search: "",
                    sort_id: that.filterSortId
                }
            })
                .then(res => {
                    if (res.data.state) {
                        that.goodsList = res.data.result.info;
                    } else {
                        that.$toast(res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        openSortList() {
            this.filterState = "";
            this.sortShow = true;
        },
        filterBySort(id) {
            var that = this;
            this.filterSortId = id;
            axios({
                method: "POST",
                url: baseUrl + "/app/mallitem/list_items",
                data: {
                    is_proper: 0,
                    user_id: localStorage['userId'],
                    order_type: "",
                    search: "",
                    sort_id: id
                }
            })
                .then(res => {
                    if (res.data.state) {
                        that.goodsList = res.data.result.info;
                        this.sortShow = false;
                    } else {
                        that.$toast(res.data.msg);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        resetSort(){
            this.filterSortId = "";
        }
    },
    created() {
        this.queryGoods();
        var that = this;
        axios({
            method: "POST",
            url: baseUrl + "/app/mallitem/sort_info"
        })
            .then(res => {
                if (res.data.state) {
                    that.sortList = res.data.result;
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
    width: 2.5rem;
    text-align: center;
}
.filter-btn.active {
    color: #37acff;
}
.sort-list {
    width: 80vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.sort-item{
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 .2rem;
    margin: .4rem 0 0 0;
    box-sizing: border-box;
    font-size: .3rem;
}
.sort-item-title{
    width: 100%;
    text-align: left;
    font-size: .3rem;
    color: #333;
    font-weight: 500;
}
.sort-content{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: .3rem 0 0 0;
}
.sort{
    width: 40%;
    height: .6rem;
    line-height: .6rem;
    background: #f5f5f5;
    margin: .1rem;
    border-radius: 4px;
}
.sort.active{
    color: #37acff;
    border: 1px solid #37acff;
}
.reset-btn{
    width: 100%;
    height: .8rem;
    background: #37acff;
    color: #fff;
    font-size: .3rem;
    border: 0;
    outline: none;
}
.reset-btn:disabled{
    background: #999;
}
.goods-content {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.2rem;
    box-sizing: border-box;
}
.goods-name {
    width: 100%;
    font-size: 0.26rem;
    color: #555;
    margin: 0.12rem 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
}
.goods-price {
    width: 100%;
    font-size: 0.24rem;
    color: #ff2222;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
}
.goods-item {
    width: 3.3rem;
    display: flex;
    flex-direction: column;
    margin: 0.1rem 0;
    font-size: 0.3rem;
}
.goods-item > a {
    display: inline-flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
}
.goods-item > a > img {
    width: 100%;
    height: 3.3rem;
    border-radius: 4px;
}
</style>
