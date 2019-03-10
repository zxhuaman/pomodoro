import Vuex from 'vuex'
import Vue from 'vue'
import Gitee from "./model/gitee";
import CookieUtil from "./CookieUtil";

Vue.use(Vuex)

export const store = new Vuex.Store({
    debug: true,
    state: {
        loggedIn: CookieUtil.get('token') !== null && CookieUtil.get('username') !== null,
        projectMap: new Map()
    },
    mutations: {
        setInfo(state, info) {
            if (info && info.token && info.username) {
                state.loggedIn = true;
                CookieUtil.set('token', info.token);
                CookieUtil.set('username', info.username)
            } else {
                state.loggedIn = false
                CookieUtil.unset('token')
                CookieUtil.unset('username')
            }
            Gitee.setInfo(info)
        },
        updateProjectMap(state, map) {
            state.projectMap = map
        }
    },
    actions: {
        login({commit}, {username, password}) {
            Gitee.login(username, password)
                .then(token => {
                    commit('setInfo', {token: token, username: username})
                })
                .catch(() => commit('setInfo', null));
        },
        getProjectMap({commit}) {
            if (this.debug) {
                console.log('getProjectMap')
            }
            Gitee.getProjectTree()
                .then(tree => commit('updateProjectMap', tree.map))
                .catch(err => {
                    console.log(err)
                    Gitee.createProjectTree().catch(err => console.log(err))
                });
        },
        addProject({commit}, project) {
            Gitee.addProject(project)
                .then(() => Gitee.getProjectTree())
                .then(tree => {
                    commit('updateProjectMap', tree.map)
                })
                .catch(err => console.log(err))
        },
        removeProject({commit}, project) {
            Gitee.removeProject(project)
                .then(() => Gitee.getProjectTree())
                .then(tree => commit('updateProjectMap', tree.map))
        },
        addTask({commit}, task) {
            Gitee.addTask(task)
                .then(() => Gitee.getProjectTree())
                .then(tree => commit('updateProjectMap', tree.map))
        },
        removeTask({commit}, task) {
            Gitee.removeTask(task)
                .then(() => Gitee.getProjectTree())
                .then(tree => commit('updateProjectMap', tree.map))
        },
        updateTask({commit}, task) {
            Gitee.updateTask(task)
                .then(() => Gitee.getProjectTree())
                .then(tree => commit('updateProjectMap', tree.map))
        }
    }
})