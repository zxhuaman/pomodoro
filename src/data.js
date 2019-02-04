import Project from "./project";
import Axios from 'axios';
import {CODE_SUCCESS, RETRIEVE} from "./mock/constant";

export const data = {
    debug: true,
    state: {
        projects: [],
        curProject: new Project('今天'),
        login: false
    },
    retrieveProject() {
        Axios.post('/project', {
            type: RETRIEVE
        }).then(res => {
            this.state.projects = res.data.projects;
        }).catch(error => {
            console.log(error)
        });
    },
    addProject(project) {
        this.state.projects.push(project)
        this.state.projects = this.state.projects.slice(0)
    },
    removeProject(project) {
        this.state.projects = this.state.projects.filter(value => value.name !== project.name)
    },
    addTask(task) {
        this.state.curProject.addTask(task)
        this.state.projects = this.state.projects.slice(0)
    },
    removeTask(task) {
        this.state.curProject.removeTask(task)
        this.state.projects = this.state.projects.slice(0)
    },
    completeTask(task) {
        this.state.curProject.completeTask(task)
        this.state.projects = this.state.projects.slice(0)
    },
    setCurrentProject(project) {
        this.state.curProject = project
        this.state.projects = this.state.projects
    },
    login(username, password) {
        if (this.debug) {
            console.log('Login')
        }
        return new Promise((resolve, reject) => {
            Axios
                .post('/login', {
                    username: username,
                    password: password
                })
                .then(response => {
                    this.state.login = response.data.code === CODE_SUCCESS ? true : false;
                    if (this.state.login) {
                        this.retrieveProject();
                    }
                    resolve(response.data.code);
                })
                .catch(error => {
                    this.state.login = false;
                    reject(error);
                });
        })
    },
    logout() {
        if (this.debug) {
            console.log('Logout');
        }
        this.state.login = false;
    }
}