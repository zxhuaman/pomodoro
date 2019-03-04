import Axios from 'axios'
import {Base64} from 'js-base64'
import Project from "../project";

const base_url = 'https://Gitee.com/api/v5'

export default class Gitee {
    static token;

    static login(username, password) {
        return new Promise((resolve, reject) => {
            if (username === 'xiaogege' && password === '123456') {
                resolve('30766817b6d14cbc125ec605077d1687')
            } else {
                reject()
            }
        })
    }

    static setToken(token) {
        this.token = token;
    }

    static addProject(project) {
        if (this.token) {
            return Axios.post(`${base_url}/repos/mdbook/pomodoro/contents/${project.name + '.project'}`,
                {
                    'access_token': this.token,
                    'content': Base64.encode(JSON.stringify(project, ['name', 'createTime', 'tasks'])),
                    'message': `add project ${project.name}`
                },
                {headers: {'Content-Type': 'application/json;charset=UTF-8'}})
                .then(function (res) {
                    project.sha = res.data.content.sha
                    return project
                })
        }
        return new Promise((resolve, reject) => reject());
    }

    static updateProject(project) {
        if (this.token) {
            return Axios.put(`${base_url}/repos/mdbook/pomodoro/contents/${project.name + '.project'}`, {
                'access_token': this.token,
                'content': Base64.encode(JSON.stringify(project)),
                'sha': project.sha,
                'message': `update ${project.name}`
            }).then(res => this.getProject(new Project(res.data.content.name.split('.')[0], 0, res.data.content.sha)))
        }
        return new Promise((resolve, reject) => reject())
    }

    static getProjects() {
        if (this.token) {
            return Axios.get(`${base_url}/repos/mdbook/pomodoro/git/gitee/trees/master?access_token=${this.token}`,
                {headers: {'Content-Type': 'application/json;charset=UTF-8'}})
                .then(function (res) {
                    const projects = []
                    res.data.tree.filter(value => value.path.endsWith('.project'))
                        .forEach(value =>
                            Gitee.getProject({sha: value.sha}).then(project => projects.push(project))
                    return projects
                })
        }
        return new Promise((resolve, reject) => reject)
    }

    static getProject(project) {
        if (this.token) {
            return Axios
                .get(`${base_url}/repos/mdbook/pomodoro/git/blobs/${project.sha}?access_token=${this.token}`,
                    {headers: {'Content-Type': 'application/json;charset=UTF-8'}})
                .then(res => {
                    const result = JSON.parse(Base64.decode(res.data.content))
                    return new Project(result.name, result.createTime, result.tasks)
                })
        }
        return new Promise((resolve, reject) => reject())
    }

    static removeProject(project) {
        //todo
    }

    static addTask(task) {
        this.getProjects().then(function (res) {
            const projects = res.filter(value => value.name === task.project);
            if (projects.length == 1) {
                const project = projects[0];
                project.tasks.push(task);
                return Gitee.updateProject(project);
            }
        })

    }

    static removeTask(task) {
        //todo
    }
}