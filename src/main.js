import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import '../theme/index.css'
import Home from "./components/Home";
import VueRouter from "vue-router";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import {store} from "./store";

Vue.config.productionTip = false
Vue.use(VueRouter)

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

router.beforeEach((to, from, next) => {
    if (to.path !== '/pomodoro/login' && !store.state.loggedIn) {
        next('/pomodoro/login');
    } else {
        next(true);
    }
});

new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App),
    computed: {
        loggedIn: function () {
            return this.$store.state.loggedIn
        }
    },
    watch: {
        loggedIn: function () {
            if (this.loggedIn) {
                this.$router.push('/pomodoro/home',
                    () => this.$store.dispatch('getProjectMap'));
            }
        }
    }
}).$mount('#app')
