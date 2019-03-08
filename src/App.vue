<template>
    <el-container id="app">
        <el-header>
            <router-link to="home" class="logo"><img src="./assets/logo.png" alt="logo"></router-link>
            <router-link to="home" class="site-title">pomodoro</router-link>
            <router-link to="login" class="sign-in">
                <img src="./assets/login.png" alt="登陆" title="登陆">
            </router-link>
            <router-link to="dashboard" class="dashboard">
                <img src="./assets/dashboard.png" alt="统计" title="统计">
            </router-link>
        </el-header>
        <el-container>
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: 'app',
        methods:{
        }
    }
</script>

<style>
    html {
        height: 100%;
    }

    body {
        height: 100%;
        margin: 0;
        overflow-y: hidden;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }

    .el-header {
        border-bottom: 1px solid #2c2c2c;
    }

    .logo img {
        position: absolute;
        height: 1.8em;
        margin-top: .6em;
    }

    .site-title {
        font-size: 1.2rem;
        color: #2c2c2c;
        font-weight: bold;
        margin-left: 2em;
        line-height: 48px;
        text-decoration: none;
    }

    .dashboard {
        position: absolute;
        top: .5em;
        right: 4.5em;
    }

    .sign-in {
        position: absolute;
        top: .5em;
        right: 2em;
    }

    .dashboard img,
    .sign-in img {
        height: 1.8em;
    }

    .el-main {
        padding: 0;
    }
</style>
