<template>
    <div class="search-page">
        <!-- 搜索框 -->
        <div class="search">
            <div class="search-box">
                <van-icon name="search" />
                <input type="search" placeholder="搜索商品名称" v-model="searchWord" v-on:keydown="search">
            </div>
        </div>
        <!-- 搜索结果 -->
        <NoData v-if="searchNum<1" prompt="暂无数据"></NoData>
        <div v-else class="search-result">
            <router-link class="search-row" v-for="(item,index) in searchList" :key="index" :to="'/mall/goods/'+item.id" tag="div">
                <div class="goods-img"><img :src="baseUrl+item.img_src"></div>
                <div class="goods-content">
                    <div class="goods-name">{{item.item_name}}</div>
                    <div class="goods-info">
                        <div class="goods-price">￥{{item.price}}+{{item.point}}积分</div>
                        <div class="goods-sale">已有{{item.sells_num}}人购买</div>
                    </div>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import NoData from "../pages/components/noData";
export default {
    name: "search",
    props: ["keyword"],
    data() {
        return {
            baseUrl:baseUrl,
            searchWord: "",
            searchList: [],
            searchNum: ""
        };
    },
    components:{
        NoData
    },
    methods: {
        search() {
            if(this.searchWord==""){
                console.log("请先输入搜索关键字");
            }else{
                this.querySearch(this.searchWord);
            }
        },
        querySearch(word) {
            var that = this;
            axios({
                method: "POST",
                url: baseUrl + "/app/mallitem/list_items",
                data: {
                    search: word,
                    user_id: localStorage['userId'],
                    is_proper: 0
                }
            })
                .then(res=> {
                    if (res.data.state) {
                        that.searchList = res.data.result.info;
                        that.searchNum = res.data.result.total;
                    } else {
                        that.searchNum = 0;
                        that.$toast(res.data.msg);
                    }
                })
                .catch(err=> {
                    console.log(err);
                });
        }
    },
    created() {
        this.searchWord = this.$route.query.keyword;
        this.querySearch(this.searchWord);
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
.search-result{
    width: 100%;
    display: flex;
    flex-direction: column;
}
.search-row{
    width: 100%;
    height: 1.8rem;
    padding: 0 .2rem;
    display: flex;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    font-size: .3rem;
    border-bottom: 1px solid #ededed;
}
.goods-img{
    width: 1.4rem;
    height: 1.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}
.goods-img>img{
    width: 100%;
    height: 100%;
}
.goods-content{
    width: 5.5rem;
    height: 1.4rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.goods-info{
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.goods-name{
    width: 100%;
    text-align: left;
    font-size: .3rem;
    color: #333;
    overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}
.goods-price{
    color: #FF2222;
}
.goods-sale{
    font-size: .24rem;
    color: #999;
}
</style>
