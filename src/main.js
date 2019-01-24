import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import '../theme/index.css'
import Home from "./components/Home";
import VueRouter from "vue-router";
import Login from "./components/Login";

Vue.config.productionTip = false
Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        {path: '/', component: Home},
        {path: '/home', component: Home},
        {path: '/login', component: Login}
    ]
})

new Vue({
    el: '#app',
    router,
    render: h => h(App),
}).$mount('#app')
