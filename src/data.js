import Project from "./project";
import Axios from 'axios';
import {CODE_SUCCESS} from "./mock/constant";

const projects = [
    new Project('今天'),
    new Project('明天'),
    new Project('即将到来'),
]
export const data = {
    debug: true,
    state: {
        projects: projects,
        curProject: projects[0],
        login: false
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
                    resolve(response.data.code);
                })
                .catch(error => {
                    console.log(error);
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