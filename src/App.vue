<template>
    <div id="app">
        <nav id="nav">
            <a href="#"><img src="./assets/logo.png" alt="logo"></a>
            <p class="site-title">promodoro</p>
            <el-button class="sign-in" type="primary" size="small">登陆</el-button>
        </nav>
        <HelloWorld msg="Welcome to Your Vue.js App"/>
    </div>
</template>

<script>
    import HelloWorld from './components/HelloWorld.vue'

    export default {
        name: 'app',
        components: {
            HelloWorld
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
    }

    #nav {
        margin-top: 1.5em;
        text-align: left;
    }

    #nav img {
        width: 2em;
        margin-left: 2em;
    }

    .site-title {
        position: absolute;
        top: 0;
        left: 3.5em;
        height: 100%;
        font-size: 1.5rem;
        color: #2c2c2c;
        text-align: center;
        padding-bottom: 2em;
        font-weight: bold;
    }

    .sign-in {
        position: absolute;
        right: 2em;
    }
</style>
