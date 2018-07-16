<template>
    <div class="details">
        <div class="find-item">
            <div class="user-pic">
                <img src="../assets/img/user_pic_m.png" v-if="details.head_img==''">
                <img :src="baseUrl+details.head_img" v-else>
            </div>
            <div class="content">
                <div class="content-top">
                    <div class="user-name">{{details.nick_name}}</div>
                    <div class="publish-time">{{details.add_time}}</div>
                </div>
                <div class="content-middle">
                    <div class="publish-text">{{details.topic_info}}</div>
                    <div class="publish-img">
                        <img v-for="(pic,n) in details.topic_imgs" :src="baseUrl+pic" :key="n" @click="previewImg(details.topic_imgs,n)">
                    </div>
                </div>
            </div>
        </div>
        <div class="comments">
            <div class="comments-top">共有{{comments.length}}条评论</div>
            <div class="comments-list">
                <div class="comments-item" v-for="(item,index) in comments" :key="index">
                    <div class="user-pic">
                        <img src="../assets/img/user_pic_m.png" v-if="item.head_img==''">
                        <img :src="baseUrl+item.head_img" v-else>
                    </div>
                    <div class="content">
                        <div class="content-top">
                            <div class="user-name">{{item.nick_name}}</div>
                            <div class="publish-time">{{item.add_time}}</div>
                        </div>
                        <div class="content-middle">
                            <div class="publish-text">{{item.comment_info}}</div>
                        </div>
                        <div class="content-bottom">
                            <div class="left-btns"></div>
                            <div class="right-btns">
                                <a class="delete-btn" @click="deleteItem(item,index)" v-if="item.is_self"><img src="../assets/img/delete.png" alt=""></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="publish-comment">
            <a class="like-btn" href="javascript:;" @click="likeToggle">
                <span v-if="isLiked==1" style="color:#ff5d5d"><img src="../assets/img/liked.png">{{details.likes_num}}</span>
                <span v-else><img src="../assets/img/like.png">0</span>
            </a>
            <input class="comment-input" type="text" v-model="commentText" placeholder="请输入评论内容">
            <button class="comment-btn" @click="commentPublish">发表</button>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { ImagePreview } from "vant";
export default {
    name: "communityDetail",
    data() {
        return {
            baseUrl: baseUrl,
            details: {},
            comments: [],
            commentText:'',
            isLiked:''
        };
    },
    methods: {
        renewData() {
            var that = this;
            axios({
                method: "POST",
                url: baseUrl + "/app/Community/show_community_publish_comment",
                data: {
                    user_id: localStorage['userId'],
                    cm_id: that.$route.params.id
                }
            })
                .then(res=> {
                    if (res.data.state) {
                        that.details = res.data.result.publish;
                        that.comments = res.data.result.comment;
                    } else {
                        that.$toast(res.data.msg);
                    }
                })
                .catch(err=>{
                    console.log(err);
                });
        },
        previewImg(imgs, n) {
            var imgSrc = new Array();
            imgs.forEach((item, index) => {
                imgSrc.push(baseUrl + item);
            });
            ImagePreview(imgSrc, n);
        },
        deleteItem(item, index) {
            var that = this;
            this.$dialog
                .confirm({
                    title: "",
                    message: `确定删除这条评论？`
                })
                .then(() => {
                    axios({
                        method: "POST",
                        url:
                            baseUrl + "/app/Community/delete_community_comment",
                        data: {
                            user_id: localStorage['userId'],
                            token: localStorage['token'],
                            id: item.id
                        }
                    })
                        .then(res => {
                            if (res.data.state) {
                                that.$toast.success("删除成功");
                                that.comments.splice(index, 1);
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
        likeToggle() {
            if (this.details.liked_exist) {
                this.$toast("你已经点赞过了");
            } else {
                var that = this;
                axios({
                    method: "POST",
                    url: baseUrl + "/app/Community/add_community_likes",
                    data: {
                        user_id: localStorage['userId'],
                        token: localStorage['token'],
                        cm_id: that.$route.params.id
                    }
                })
                    .then(res => {
                        if (res.data.state) {
                            that.renewData();
                        } else {
                            that.$toast(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        },
        commentPublish(){
            if(this.commentText==''){
                this.$toast("请先输入评论内容")
            }else{
                var that = this;
                axios({
                    method: "POST",
                    url: baseUrl + "/app/Community/add_community_comment",
                    data: {
                        user_id: localStorage['userId'],
                        token: localStorage['token'],
                        cm_id: that.$route.params.id,
                        comment_info:that.commentText
                    }
                })
                    .then(res => {
                        if (res.data.state) {
                            that.$toast.success("评论成功");
                            that.commentText = '';
                            that.renewData();
                        } else {
                            that.$toast(res.data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }
    },
    created() {
        this.renewData();
        this.isLiked = this.$route.query.isliked;
    }
};
</script>
<style scoped>
.details {
    width: 100%;
    padding-bottom: 1rem;
}
.comments {
    display: flex;
    flex-direction: column;
    width: 100%;
}
.comments-top {
    width: 100%;
    height: 0.6rem;
    line-height: 0.6rem;
    padding: 0 0.3rem;
    box-sizing: border-box;
    text-align: right;
    font-size: 0.3rem;
    color: #999;
}
.find-item,
.comments-item {
    width: 100%;
    display: flex;
    padding: 0.2rem 0;
    background: #fff;
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
    color: #555;
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
.like-btn {
    display: inline-flex;
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
.publish-comment{
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 1rem;
    display: flex;
    padding: 0 .2rem;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    border-top: 1px solid #ededed;
}
.comment-input{
    width: 4.8rem;
    height: .66rem;
    padding: 0 .1rem;
    border: 0;
    outline: none;
    background: #f5f5f5;
    border-radius: 4px;
    font-size: .3rem;
    color: #999;
}
.comment-btn{
    width: 1rem;
    height: .66rem;
    padding: 0;
    outline: none;
    border: 0;
    background: #37acff;
    color: #fff;
    font-size: .3rem;
    border-radius: 4px;
}
</style>

