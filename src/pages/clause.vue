<template>
    <div class="clause" v-html="clauseText"></div>
</template>

<script>
import axios from "axios";
export default {
    name: "clause",
    data() {
        return {
            clauseText: ""
        };
    },
    created() {
        var that = this;
        axios({
            method: "GET",
            url: baseUrl + "/app/User/get_use_terms"
        })
            .then(res => {
                if (res.data.state) {
                    that.clauseText = res.data.result;
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
.clause {
    width: 100%;
    height: 100vh;
    padding: 0 0.2rem;
    box-sizing: border-box;
    background: url(../assets/img/bg.png) no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    text-align: left;
    text-indent: 0.6rem;
    font-size: 0.3rem !important;
    line-height: 0.4rem;
}
</style>

