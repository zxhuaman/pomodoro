import {COMPLETED, UNCOMPLETED} from "../model/task";

export default class Project {
    name;
    createTime;
    tasks;
    total = 0;//总任务数
    pending = 0;//待完成任务
    totalTime = 0;//任务总时间
    usedTime = 0;//已用时间
    tasksMap = new Map();

    constructor(name, createTime, tasks = []) {
        this.name = name;
        this.createTime = createTime;
        this.tasks = tasks;

        tasks.forEach(task => this.addTask(task))
    }

    addTask(task) {
        this.tasksMap.set(task.name, task);
        this.total += 1;
        this.totalTime += task.totalTime;
        if (task.state !== COMPLETED) {
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
            this.tasks = Array.from(this.tasksMap.values());
        }
    }

    hasTask(name) {
        return this.tasksMap.has(name);
    }

    getTask(name) {
        return this.tasksMap.get(name);
    }

    updateTask(task) {
        const temp = this.tasksMap.get(task.name)
        this.totalTime -= temp.totalTime
        this.usedTime -= temp.usedTime
        this.totalTime += task.totalTime
        this.usedTime += task.usedTime

        if (temp.state != COMPLETED && task.state == COMPLETED) {
            this.total -= 1
        }

        this.tasksMap.set(task.name, task)
    }

    completeTask(name) {
        const task = this.tasksMap.get(name);
        if (task !== null && task.state !== COMPLETED) {
            task.usedTime = task.totalTime;
            task.state = COMPLETED;
            this.pending -= 1;
            this.usedTime += task.usedTime;
        }
        this.tasks = Array.from(this.tasksMap.values());
    }
}