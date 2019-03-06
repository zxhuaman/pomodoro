import Axios from 'axios'
import {Base64} from 'js-base64'
import Project from "./project";

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
                .then(() => project)
        }
        return new Promise((resolve, reject) => reject());
    }

    static updateProject(project) {
        if (this.token) {
            return Axios.put(`${base_url}/repos/mdbook/pomodoro/contents/${project.name + '.project'}`,
                {
                    'access_token': this.token,
                    'content': Base64.encode(JSON.stringify(project,
                        ['name', 'createTime', 'tasks', 'totalTime', 'usedTime', 'project', 'state'])),
                    'sha': project.sha,
                    'message': `update ${project.name}`
                })
                .then(() => project)
        }
        return new Promise((resolve, reject) => reject())
    }

    static getTrees() {
        if (this.token) {
            return Axios
                .get(`${base_url}/repos/mdbook/pomodoro/git/gitee/trees/master?access_token=${this.token}`,
                    {headers: {'Content-Type': 'application/json;charset=UTF-8'}})
                .then(res => {
                    const trees = res.data.tree.filter(value => value.path.endsWith('.project'))
                    return trees
                })
        }
    }

    static getProjects() {
        if (this.token) {
            return Gitee.getTrees().then(function (trees) {
                const promises = []
                trees.forEach(value => promises.push(Gitee.getProject(value)))
                return Promise.all(promises)
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

    static deleteProject(project) {
        return Gitee.getTrees().then(trees => {
            const filter = trees.filter(tree => tree.path === (project.name + '.project'))
            if (filter.length = 1) {
                return Axios.delete(`${base_url}/repos/mdbook/pomodoro/contents/${filter[0].path}`,
                    {
                        params: {
                            'access_token': this.token,
                            'sha': filter[0].sha,
                            'message': `delete ${filter[0].path}`
                        }
                    })
                    .then(() => true)
            }
            throw new Error()
        })
    }

    static addTask(task) {
        return Gitee.getTrees().then(trees => {
            const filterProjects = trees.filter(value => value.path === (task.project + '.project'));
            if (filterProjects.length == 1) {
                const tree = filterProjects[0]
                return Gitee.getProject(tree).then(project => {
                    project.sha = tree.sha
                    project.addTask(task)
                    return Gitee.updateProject(project).then(() => task)
                })
            }
            throw new Error()
        })
    }

    static removeTask(task) {
        return Gitee.getTrees().then(trees => {
            const filterProjects = trees.filter(value => value.path === (task.project + '.project'));
            if (filterProjects.length == 1) {
                const tree = filterProjects[0]
                return Gitee.getProject(tree).then(project => {
                    project.sha = tree.sha
                    let i = -1;
                    project.tasks.forEach(((value, index) => {
                        if (value.name === task.name) {
                            i = index;
                        }
                    }))
                    if (i > -1) {
                        project.tasks.splice(i, 1);
                        return Gitee.updateProject(project).then(() => task);
                    } else {
                        throw new Error()
                    }
                })
            }
            throw new Error()
        })
    }
}