import Axios from 'axios';
import {CODE_SUCCESS, CREATE, DELETE, RETRIEVE, UPDATE} from "./mock/constant";

export const data = {
    debug: true,
    state: {
        projects: [],
        login: false
    },
    getProjects() {
        if (this.debug) {
            console.log('Get projects');
        }
        Axios.post('/project', {
            type: RETRIEVE
        }).then(res => {
            this.state.projects = res.data.projects;
        }).catch(error => {
            console.log(error)
        });
    },
    addProject(project) {
        if (this.debug) {
            console.log('Add projects');
        }
        Axios.post('/project', {
            type: CREATE,
            project: project
        }).then(res => {
            console.log(res.data.projects)
            this.state.projects = res.data.projects;
            this.state.projects.clear()
        }).catch(error => {
            console.log(error)
        });
    },
    removeProject(project) {
        if (this.debug) {
            console.log('Remove projects');
        }
        Axios.post('/project', {
            type: DELETE,
            project: project
        }).then(res => {
            this.state.projects = res.data.projects;
        }).catch(error => {
            console.log(error);
        });
    },
    addTask(task) {
        Axios.post('/task', {
            type: CREATE,
            task: task
        }).then(res => {
            if (res.data.code === CODE_SUCCESS) {
                this.getProjects();
            }
        }).catch(error => console.log(error));
    },
    removeTask(task) {
        Axios.post('/task', {
            type: DELETE,
            task: task
        }).then(res => {
            if (res.data.code === CODE_SUCCESS) {
                this.getProjects();
            }
        }).catch(error => console.log(error));
    },
    completeTask(task) {
        Axios.post('/task', {
            type: UPDATE,
            task: task
        }).then(res => {
            if (res.data.code === CODE_SUCCESS) {
                this.getProjects();
            }
        }).catch(error => console.log(error));
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
                        this.getProjects();
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