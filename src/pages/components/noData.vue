<template>
    <div class="null-data">
        <img src="../../assets/img/data_null.png" alt="">
        <p>{{prompt}}</p>
    </div>
</template>

<script>
export default {
    props:[
        "prompt"
    ]
}
</script>

<style scoped>
    .null-data{
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: center;
        justify-content: center;
        padding: 1.5rem 0;
    }
    .null-data img{
        width: 62%;
        height: auto;
    }
    .null-data p{
        font-size: .3rem;
        color: #999;
        margin: .5rem 0 0 0;
    }
</style>
