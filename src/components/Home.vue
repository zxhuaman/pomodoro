<template>
    <el-container>
        <el-aside width="200px">

        </el-aside>
        <el-main>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "Home",
        computed: {
            username() {
                // 我们很快就会看到 `params` 是什么
                return this.$route.params.username
            }
        },
        methods: {
            goBack() {
                window.history.length > 1
                    ? this.$router.go(-1)
                    : this.$router.push('/')
            }
        }
    }

</script>

<style scoped>
    .el-container {
        padding: 0;
        margin: 0;
    }

    .el-col {
        width: 100%;
    }
</style>