import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import '../theme/index.css'
import Home from "./components/Home";
import VueRouter from "vue-router";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import {data} from "./data";
import Gitee from "./model/gitee";

Vue.config.productionTip = false
Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        {path: '/pomodoro/home', component: Home},
        {path: '/pomodoro/login', component: Login},
        {path: '/pomodoro/dashboard', component: Dashboard},
    ]
})

router.beforeEach((to, from, next) => {
    if (to.path !== '/pomodoro/login' && !Gitee.token) {
        next('/pomodoro/login');
    } else {
        next(true);
    }
});

new Vue({
    el: '#app',
    router,
    data: data,
    render: h => h(App),
}).$mount('#app')
