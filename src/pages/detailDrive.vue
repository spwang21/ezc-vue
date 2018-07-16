<template>
    <div class="drive-detail">
        <div class="drive-info">
            
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    name: "driveDetail",
    data() {
        return {
            baseUrl: baseUrl,
            details:[],
            comments:[]
        };
    },
    created() {
        var that = this;
        //试驾详情
        axios({
            method: "POST",
            url: baseUrl + "/app/Drive/detail_his_drive",
            data: {
                drive_id:that.$route.params.id
            }
        })
            .then(res => {
                console.log(res);
                if (res.data.state) {
                    that.details = res.data.result;
                } else {
                    that.$toast(res.data.msg);
                }
            })
            .catch(err => {
                console.log(err);
            });
        //试驾评价
        axios({
            method: "POST",
            url: baseUrl + "/app/Drive/list_get_comments",
            data: {
                drive_id:that.$route.params.id
            }
        })
            .then(res => {
                console.log(res);
                if (res.data.state) {
                    that.comments = res.data.result;
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