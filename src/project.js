import {COMPLETED, UNCOMPLETED} from "./task";

export default class Project {
    createTime;
    name;
    total = 0;//总任务数
    pending = 0;//待完成任务
    totalTime = 0;//任务总时间
    usedTime = 0;//已用时间
    tasks = new Map();

    constructor(name) {
        this.name = name;
        this.createTime = new Date().getTime();
    }

    addTask(task) {
        this.tasks.set(task.name, task);
        this.total += 1;
        this.totalTime += task.totalTime;
        if (task.state === UNCOMPLETED) {
            this.pending += 1;
            this.usedTime += task.usedTime;
        }
    }

    removeTask(task) {
        if (this.tasks.has(task.name)) {
            this.tasks.delete(task.name);
            this.total -= 1;
            this.totalTime -= task.totalTime;
            this.usedTime -= task.usedTime;
            if (task.state === UNCOMPLETED) {
                this.pending -= 1;
            }
        }
    }

    hasTask(name) {
        return this.tasks.has(name);
    }

    getTask(name) {
        return this.tasks.get(name);
    }

    completeTask(name) {
        const task = this.tasks.get(name);
        if (task != null) {
            task.usedTime = task.totalTime;
            task.state = COMPLETED;
            this.pending -= 1;
            this.usedTime += task.usedTime;
        }
    }
    
}