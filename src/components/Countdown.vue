<template>
    <p>{{timeStr}}</p>
</template>

<script>
    export default {
        name: "Countdown",
        methods: {
            countdown: function () {
                if (this.time > 0) {
                    this.time -= 1;
                }
            }
        },
        computed: {
            timeStr: function () {
                return parseInt(this.time / 60) + ":" + this.time % 60;
            }
        },
        mounted: function () {
            window.setInterval(this.countdown, 1000);
        },
        destroyed: function () {
            window.clearInterval(this.countdown())
        },
        data: function () {
            return {
                time: 60,
            };
        }
    }
</script>

<style scoped>
    p {
        font-size: 5rem;
        text-align: center;
    }
</style>