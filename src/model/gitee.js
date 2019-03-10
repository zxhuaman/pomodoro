import Axios from 'axios'
import {Base64} from 'js-base64'
import Project from "./project";

const base_url = 'https://Gitee.com/api/v5';

export default class Gitee {
    static debug = true;
    static info;

    static login(username, password) {
        if (this.debug) {
            console.log('login', username, password)
        }
        return new Promise((resolve, reject) => {
            if (username === 'xiaogege' && password === '123456') {
                resolve('30766817b6d14cbc125ec605077d1687')
            } else {
                reject()
            }
        });
    }

    static setInfo(info) {
        this.info = info
    }

    static encodeTreeContent(tree) {
        if (this.debug) {
            console.log('encodeTreeContent', tree)
        }
        const projects = tree.map ? Array.from(tree.map.values()) : [];
        const content = Base64.encode(JSON.stringify({projects: projects},
            ['projects', 'name', 'createTime', 'tasks', 'totalTime', 'usedTime', 'project', 'state']))
        return content
    }

    static createProjectTree(tree = {path: this.info.username + '.json'}) {
        if (this.debug) {
            console.log('createProjectTree', tree)
        }
        if (!this.info) {
            return new Promise((resolve, reject) => reject())
        }
        return Axios.post(`${base_url}/repos/mdbook/pomodoro/contents/${tree.path}`,
            {
                'access_token': this.info.token,
                'content': this.encodeTreeContent(tree),
                'message': `add project ${tree.path}`
            },
            {headers: {'Content-Type': 'application/json;charset=UTF-8'}})
    }

    static getProjectTree(tree = {path: this.info.username + '.json'}) {
        if (this.debug) {
            console.log('getProjectTree', tree)
        }
        if (!this.info) {
            return new Promise((resolve, reject) => reject());
        }
        return Axios
            .get(`${base_url}/repos/mdbook/pomodoro/git/gitee/trees/master?access_token=${this.info.token}`,
                {headers: {'Content-Type': 'application/json;charset=UTF-8'}})
            .then(res => {
                return res.data.tree.filter(value => value.path === tree.path).pop()
            })
            .then(res => Axios.get(
                `${base_url}/repos/mdbook/pomodoro/git/blobs/${res.sha}?access_token=${this.info.token}`,
                {headers: {'Content-Type': 'application/json;charset=UTF-8'}}))
            .then(res => {
                tree.sha = res.data.sha
                return JSON.parse(Base64.decode(res.data.content))
            })
            .then(content => {
                console.log(content)
                const map = new Map()
                content.projects.forEach(project => {
                    if (project && project.name) {
                        map.set(project.name, new Project(project.name, project.createTime, project.tasks));
                    }
                })
                tree.map = map
                return tree
            });
    }

    static updateProjectTree(tree) {
        if (this.debug) {
            console.log('updateProjectTree', tree)
        }
        if (!this.info) {
            return new Promise((resolve, reject) => reject())
        }
        return Axios.put(`${base_url}/repos/mdbook/pomodoro/contents/${tree.path}`,
            {
                'access_token': this.info.token,
                'content': this.encodeTreeContent(tree),
                'sha': tree.sha,
                'message': `update ${tree.path}`
            },
            {headers: {'Content-Type': 'application/json;charset=UTF-8'}}
        )
    }

    static getProjects() {
        if (this.debug) {
            console.log('getProjects')
        }
        if (!this.info) {
            return new Promise((resolve, reject) => reject())
        }
        return this.getProjectTree().then(tree => Array.from(tree.map.values()))
    }

    static addProject(project) {
        if (this.debug) {
            console.log('addProject', project)
        }
        if (!this.info) {
            return new Promise((resolve, reject) => reject())
        }
        return this.getProjectTree()
            .then(tree => {
                tree.map.set(project.name, project)
                console.log(tree.map, project.name)
                return this.updateProjectTree(tree)
            })
    }

    static removeProject(project) {
        if (this.debug) {
            console.log('removeProject', project)
        }
        if (!this.info) {
            return new Promise((resolve, reject) => reject())
        }
        return this.getProjectTree()
            .then(tree => {
                tree.map.delete(project.name);
                return this.updateProjectTree(tree)
            })
    }

    static updasteProject(project) {
        if (this.debug) {
            console.log('updasteProject', project)
        }
        if (!this.info) {
            return new Promise((resolve, reject) => reject())
        }
        return this.getProjectTree()
            .then(tree => {
                tree.map.set(project.name, project);
                return this.updateProjectTree(tree)
            })
    }

    static addTask(task) {
        if (!this.info) {
            return new Promise((resolve, reject) => reject())
        }
        return this.getProjectTree()
            .then(tree => {
                tree.map.get(task.project).addTask(task)
                return this.updateProjectTree(tree)
            })
    }

    static removeTask(task) {
        if (!this.info) {
            return new Promise((resolve, reject) => reject())
        }
        return this.getProjectTree()
            .then(tree => {
                tree.map.get(task.project).removeTask(task)
                return this.updateProjectTree(tree)
            })
    }

    static updateTask(task) {
        if (!this.info) {
            return new Promise((resolve, reject) => reject())
        }
        return this.getProjectTree()
            .then(tree => {
                tree.map.get(task.project).updateTask(task)
                return this.updateProjectTree(tree)
            })
    }
}