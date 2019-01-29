import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import '../theme/index.css'
import Home from "./components/Home";
import VueRouter from "vue-router";
import Login from "./components/Login";
import Vuex from 'vuex'
import Dashboard from "./components/Dashboard";

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(Vuex)

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        {path: '/pomodoro', component: Home},
        {path: '/pomodoro/home', component: Home},
        {path: '/pomodoro/login', component: Login},
        {path: '/pomodoro/dashboard', component: Dashboard},
    ]
})

const store = new Vuex.Store({
    state: {
        login: false
    },
    mutations: {
        login(state) {
            state.login = true;
        }
    }
})

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
}).$mount('#app')
