<template>
    <div class="find">
        <div class="find-page">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <div class="find-item" v-for="(item,index) in communityList" :key="index">
                    <div class="user-pic">
                        <img src="../assets/img/user_pic_m.png" v-if="item.head_img==''">
                        <img :src="baseUrl+item.head_img" v-else>
                    </div>
                    <div class="content">
                        <router-link :to="'/community/detail/'+item.id+'?isliked='+item.liked_exist">
                            <div class="content-top">
                                <div class="user-name">{{item.nick_name}}</div>
                                <div class="publish-time">{{item.add_time}}</div>
                            </div>
                            <div class="content-middle">
                                <div class="publish-text">{{item.topic_info}}</div>
                                <div class="publish-img">
                                    <img v-for="(pic,n) in item.topic_imgs" :src="baseUrl+pic" :key="n">
                                </div>
                            </div>
                        </router-link>
                        <div class="content-bottom">
                            <div class="left-btns">
                                <a class="delete-btn" @click="deleteItem(item,index)" v-if="item.is_self"><img src="../assets/img/delete.png" alt=""></a>
                            </div>
                            <div class="right-btns">
                                <a class="like-btn" href="javascript:;" @click="likeToggle(item)">
                                    <span v-if="item.liked_exist" style="color:#ff5d5d"><img src="../assets/img/liked.png">{{item.likes_num}}</span>
                                    <span v-else><img src="../assets/img/like.png">0</span>
                                </a>
                                <a class="evaluate-btn" :href="'#/community/detail/'+item.id">
                                    <span v-if="item.comments_num>0" style="color:#37acff"><img src="../assets/img/evaluated.png">{{item.comments_num}}</span>
                                    <span v-else><img src="../assets/img/evaluate1.png">0</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </van-pull-refresh>
            <!-- 去发布 -->
            <div class="publish-btn" v-show="!backTopShow">
                <router-link to="/community/publish">
                    <van-icon name="edit" />
                </router-link>
            </div>
            <!-- 返回顶部 -->
            <div class="backTop-btn" v-show="backTopShow" @click="backTop">
                <van-icon name="upgrade" />
            </div>
        </div>
        <Home-Footer></Home-Footer>
    </div>
</template>

<script>
import { PullRefresh } from "vant";
import axios from "axios";
import HomeFooter from "../pages/components/footer";
export default {
    name: "list",
    data() {
        return {
            baseUrl: baseUrl,
            isLoading: false,
            communityList: [],
            scrollTop: "",
            backTopShow: false
        };
    },
    components: {
        HomeFooter
    },
    methods: {        
        handleScroll() {
            this.scrollTop =
                window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop;
            if (this.scrollTop > 400) {
                this.backTopShow = true;
            }else{
                this.backTopShow = false;
            }
        },
        backTop() {
            var that = this;
            var timer = setInterval(() => {
                if (that.scrollTop > 0) {
                    that.scrollTop -= 200;
                    document.body.scrollTop = document.documentElement.scrollTop = that.scrollTop;
                    if (that.scrollTop < 400) {
                        that.backTopShow = false;
                    }
                } else {
                    document.body.scrollTop = document.documentElement.scrollTop = that.scrollTop = 0;
                    clearInterval(timer);
                    that.backTopShow = false;
                }
            }, 20);
        },
        updateData() {
            var that = this;
            axios({
                method: "POST",
                url: baseUrl + "/app/Community/show_community_publish",
                data: {
                    user_id: localStorage['userId']
                }
            })
                .then(function(res) {
                    if (res.data.state) {
                        that.communityList = res.data.result;
                    } else {
                        that.$toast(res.data.msg);
                    }
                })
                .catch(function(err) {
                    console.log(err);
                });
        },
        onRefresh() {
            this.updateData();
            setTimeout(() => {
                this.$toast("已刷新成功");
                this.isLoading = false;
            }, 1000);
        },
        deleteItem(item, index) {           
            var that = this;
            this.$dialog
                .confirm({
                    title: "",
                    message: `确定删除这条动态？`
                })
                .then(() => {
                    axios({
                        method: "POST",
                        url:
                            baseUrl + "/app/Community/delete_community_publish",
                        data: {
                            user_id: localStorage['userId'],
                            token: localStorage['token'],
                            cm_id: item.id
                        }
                    })
                        .then(res => {
                            if (res.data.state) {
                                that.$toast.success("删除成功");
                                that.communityList.splice(index, 1);
                            } else {
                                that.$toast(res.data.msg);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                })
                .catch(() => {
                    // on cancel
                });
        },
        likeToggle(item) {
            var that = this;
            axios({
                method: "POST",
                url: baseUrl + "/app/Community/add_community_likes",
                data: {
                    user_id: localStorage['userId'],
                    token: localStorage['token'],
                    cm_id: item.id
                }
            })
                .then(res => {
                    if (res.data.state) {
                        that.updateData();
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
        this.updateData();
        window.addEventListener("scroll", this.handleScroll,true);
    },
    mounted() {
        window.addEventListener("scroll", this.handleScroll,true);
    },
    destroyed() {
        window.removeEventListener("scroll", this.handleScroll,true);
    }
};
</script>

<style scoped>
.find {
    padding-bottom: 1.2rem;
}
.find-page {
    width: 100%;
    display: flex;
}
.van-pull-refresh {
    width: 100%;
}
.find-item {
    width: 100%;
    display: flex;
    padding: 0.15rem 0;
    border-bottom: 1px solid #ededed;
    box-sizing: border-box;
}
.user-pic {
    width: 0.77rem;
    height: 0.77rem;
    display: flex;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 0.3rem;
}
.user-pic > img {
    width: 100%;
}
.content {
    width: 5.83rem;
    display: flex;
    flex-direction: column;
    font-size: 0.3rem;
}
.content-top {
    width: 100%;
    height: 0.8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.user-name {
    font-size: 0.3rem;
    color: #37acff;
}
.publish-time {
    font-size: 0.26rem;
    color: #b5b5bb;
}
.content-middle {
    width: 100%;
    display: flex;
    flex-direction: column;
}
.publish-text {
    width: 100%;
    font-size: 0.26rem;
    color: #666;
    line-height: 0.4rem;
    word-break: break-all;
    text-align: left;
}
.publish-img {
    width: 100%;
    display: flex;
    padding: 0.1rem 0;
    justify-content: space-between;
    align-items: center;
}
.publish-img > img {
    width: 31%;
    height: 1.3rem;
}
.content-bottom {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.1rem 0;
}
.delete-btn {
    display: inline-flex;
    width: 0.41rem;
    height: 0.41rem;
    align-items: center;
    overflow: hidden;
}
.delete-btn > img {
    width: 100%;
}
.evaluate-btn {
    display: inline-flex;
}
.evaluate-btn > span {
    display: inline-flex;
    align-items: center;
    font-size: 0.3rem;
    color: #9c9c9c;
}
.evaluate-btn img {
    width: 0.53rem;
    height: 0.46rem;
    margin: 0 0.1rem 0 0;
}
.like-btn {
    display: inline-flex;
    margin: 0 0.3rem 0 0;
}
.like-btn > span {
    display: inline-flex;
    align-items: center;
    color: #9c9c9c;
    font-size: 0.3rem;
}
.like-btn img {
    width: 0.46rem;
    height: 0.46rem;
    margin: 0 0.1rem 0 0;
}
.publish-btn {
    display: flex;
    align-items: center;
    position: fixed;
    right: 0.6rem;
    bottom: 2rem;
    width: 1rem;
    height: 1rem;
    box-sizing: content-box;
    border-radius: 50%;
    border: 2px solid #fff;
    background: #37acff;
    box-shadow: 0 0 3px 3px rgba(55, 172, 255, 0.3);
}
.publish-btn > a {
    display: inline-flex;
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    align-items: center;
    justify-content: center;
    font-size: 0.44rem;
    color: #fff;
    font-weight: normal;
}
.backTop-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content:center;
    position: fixed;
    right: 0.6rem;
    bottom: 2rem;
    /* width: 1rem;
    height: 1rem; */
    box-sizing: content-box;
    border-radius: 50%;
    background:#fff;
    color: #37acff;
    border: 0;
    /* box-shadow: 0 0 3px 3px rgba(55, 172, 255, 0.3); */
}
.backTop-btn>i.van-icon{
    font-size: 1rem;
    /* margin: 0 0 .05rem 0; */
}
.backTop-btn>div{
    font-size: .25rem;
    margin: .05rem 0 0 0;
}
</style>
