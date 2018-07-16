<template>
<div class="bottom-tab">
    <ul class="bottom-ul">
        <router-link to="/" tag="li">
            <div class="tab-icon">
                <img src="../../assets/img/home-checked.png" v-if="active ===''">
                <img src="../../assets/img/home.png" v-else>   
            </div>
            <span class="tab-text" :class="{checked:active ===''}">首页</span>
        </router-link>
        <router-link to="/mall" tag="li">
            <div class="tab-icon">
                <img src="../../assets/img/mall-checked.png" v-if="active ==='mall'">
                <img src="../../assets/img/mall.png" v-else>   
            </div>
            <span class="tab-text" :class="{checked:active ==='mall'}">商城</span>
        </router-link>
        <router-link to="/community" tag="li">
            <div class="tab-icon">
                <img src="../../assets/img/find_checked.png" v-if="active ==='community'">
                <img src="../../assets/img/find.png" v-else>   
            </div>
            <span class="tab-text" :class="{checked:active ==='community'}">发现</span>
        </router-link>
        <router-link to="/mine" tag="li">
            <div class="tab-icon">
                <img src="../../assets/img/mine-checked.png" v-if="active ==='mine'">
                <img src="../../assets/img/mine.png" v-else>   
            </div>
            <span class="tab-text" :class="{checked:active ==='mine'}">我的</span>
        </router-link>
    </ul>
</div>
    
</template>

<script>
export default {
    data(){
      return {
        active:'',
      }
    },
    mounted(){
      this.active = this.$route.path.slice(1);
    }
}
</script>

<style scoped>
    .bottom-tab{
        width: 100%;
        position: fixed;
        left: 0;
        bottom: 0;
        background: #fff;
        box-shadow: 0 0 1px rgba(0, 0, 0, .5);
	    -webkit-box-shadow: 0 0 1px rgba(0, 0, 0, .5);
    }
    .bottom-ul{
        width: 100%;
        height: 1.2rem;
        display: flex;
        align-items: center
        /* justify-content:center; */
    }
    .bottom-ul>li{
        width: 25%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        font-size:.28rem;
        color:#999;
    }
    .tab-icon{
        width: .48rem;
        height: .48rem;
        display: flex;
        align-items: center;
        margin: 0 0 .2rem 0;
    }
    .tab-icon>img{
        width: 100%;
    }
    .tab-text.checked{
        color: #37acff;
    }
</style>
