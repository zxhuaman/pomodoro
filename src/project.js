import {COMPLETED, UNCOMPLETED} from "./task";

export default class Project {
    createTime;
    name;
    total = 0;//总任务数
    pending = 0;//待完成任务
    totalTime = 0;//任务总时间
    usedTime = 0;//已用时间
    tasksMap = new Map();
    tasks = [...this.tasksMap.values()];

    constructor(name) {
        this.name = name;
        this.createTime = new Date().getTime();
    }

    addTask(task) {
        this.tasksMap.set(task.name, task);
        this.total += 1;
        this.totalTime += task.totalTime;
        if (task.state === UNCOMPLETED) {
            this.pending += 1;
            this.usedTime += task.usedTime;
        }
        this.tasks = [...this.tasksMap.values()];
    }

    removeTask(task) {
        if (this.tasksMap.has(task.name)) {
            this.tasksMap.delete(task.name);
            this.total -= 1;
            this.totalTime -= task.totalTime;
            this.usedTime -= task.usedTime;
            if (task.state === UNCOMPLETED) {
                this.pending -= 1;
            }
            this.tasks = [...this.tasksMap.values()];
        }
    }

    hasTask(name) {
        return this.tasksMap.has(name);
    }

    getTask(name) {
        return this.tasksMap.get(name);
    }

    completeTask(name) {
        const task = this.tasksMap.get(name);
        if (task != null) {
            task.usedTime = task.totalTime;
            task.state = COMPLETED;
            this.pending -= 1;
            this.usedTime += task.usedTime;
        }
        this.tasks = [...this.tasksMap.values()];
    }
}