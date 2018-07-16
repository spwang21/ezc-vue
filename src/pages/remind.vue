<template>
    <div class="remind-list">
        <router-link class="user-menu-row" to="/mine/myInfo" tag="div">
            <van-icon name="arrow" />
            <img class="user-menu-icon" src="../assets/img/drive_record.png" />
            <div class="user-menu-title">试驾消息</div>
            <div class="user-menu-badge">99+</div>
        </router-link>
        <router-link class="user-menu-row" to="/mine/myInfo" tag="div">
            <van-icon name="arrow" />
            <img class="user-menu-icon" src="../assets/img/maintence_record.png" />
            <div class="user-menu-title">维保消息</div>
            <div class="user-menu-badge">99+</div>
        </router-link>
        <router-link class="user-menu-row" to="/mine/myInfo" tag="div">
            <van-icon name="arrow" />
            <img class="user-menu-icon" src="../assets/img/rescue_record.png" />
            <div class="user-menu-title">救援消息</div>
            <div class="user-menu-badge">99+</div>
        </router-link>
    </div>
</template>

<script>
export default {
    name: "remind",
    data() {
        return {};
    }
};
</script>

<style scoped>
.remind-list {
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
.user-menu-badge{
    position: absolute;
    right: .5rem;
    font-size: .3rem;
    color: #ff2222;
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
</style>
