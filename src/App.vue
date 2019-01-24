<template>
    <div id="app">
        <el-header height="48px">
            <a class="logo" href="/"><img src="./assets/logo.png" alt="logo"></a>
            <a href="/" class="site-title">promodoro</a>
            <a href="/login">
                <el-button class="sign-in" type="primary" size="small">登陆</el-button>
            </a>
        </el-header>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'app'
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

    .sign-in {
        position: absolute;
        top: .5em;
        right: 2em;
    }

    .el-main {
        padding: 0;
    }
</style>
