<template>
    <div id="app">
        <el-header height="48px">
            <router-link to="home" class="logo"><img src="./assets/logo.png" alt="logo"></router-link>
            <router-link to="home" class="site-title">pomodoro</router-link>
            <router-link to="login" class="sign-in" v-if="!loginState">
                <el-button type="primary" size="small">登陆</el-button>
            </router-link>
            <router-link to="dashboard" class="dashboard" v-if="loginState">
                <el-button type="primary" size="small">统计</el-button>
            </router-link>
        </el-header>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>

<script>
    export default {
        name: 'app',
        computed: {
            loginState() {
                return this.$store.state.login;
            }
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

    .dashboard,
    .sign-in {
        position: absolute;
        top: .5em;
        right: 2em;
    }

    .el-main {
        padding: 0;
    }
</style>
