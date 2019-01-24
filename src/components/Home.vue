<template>
    <el-container>
        <el-aside width="250px">
            <el-menu default-active="1">
                <el-menu-item index="1">
                    <i class="el-icon-menu"></i>
                    <span slot="title">今天</span>
                </el-menu-item>
                <el-menu-item index="2">
                    <i class="el-icon-menu"></i>
                    <span slot="title">明天</span>
                </el-menu-item>
                <el-menu-item index="3">
                    <i class="el-icon-document"></i>
                    <span slot="title">即将到来</span>
                </el-menu-item>
                <el-menu-item index="4">
                    <i class="el-icon-plus"></i>
                    <span slot="title">新建项目</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-main>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "Home",
        project: [
            {icon: 'el-icon-menu', name: '今天', time: '0.4h', count: 2},
            {icon: 'el-icon-menu', name: '明天', time: '0.4h', count: 2},
            {icon: 'el-icon-document', name: '即将到来', time: '0.4h', count: 2},
            {icon: 'el-icon-plus', name: '新建项目', time: '0.4h', count: 2},
        ],
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
        height: 100%;
    }

    .el-menu {
        height: 100%;
    }
</style>