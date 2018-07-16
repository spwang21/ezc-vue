<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
    name: "App"
};
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
#app .van-swipe__indicator {
    display: inline-block;
    width: 0.18rem;
    height: 0.18rem;
    border-radius: 50%;
    background: url(assets/img/indicator.png) no-repeat;
    background-size: cover;
}
#app .van-swipe__indicator.van-swipe__indicator--active {
    background: url(assets/img/indicator_blue.png) no-repeat;
    background-size: cover;
}
#app .van-swipe__indicator:not(:last-child) {
    margin-right: 0.2rem;
}
#app .van-radio .van-icon-checked ,
#app .van-tab--active{
    color: #37acff;
}
#app .van-radio__label,
#app .van-checkbox__label {
    margin-left: 0.1rem;
}
#app .van-radio__input {
    height: auto;
}
#app .van-radio .van-icon {
    font-size: 0.32rem;
}
#app .van-checkbox__icon.van-checkbox--checked{
  background: #37acff;
  border-color: #37acff;
}
#app .van-checkbox__icon{
  line-height: 18px;
  background-color: #aaa;
  color: #fff;
}
.van-dialog__message p{
  text-indent: 2em;
}
#app .van-tabs__line{
    background-color: #37acff;
}
#app .van-tab{
    font-size: .3rem;
}
#app .van-tab:active{
    background-color: #fff;
}
#app .van-cell__title{
    flex: auto;
    text-align: left;
}
.van-picker__cancel,.van-picker__confirm{
    color: #37acff;
    font-size: .32rem;
}
.van-dialog .van-dialog__confirm,.van-dialog .van-dialog__confirm:active{
    color: #37acff;
}
</style>
