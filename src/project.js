import {COMPLETED, UNCOMPLETED} from "./task";

export default class Project {
    _name;
    _total = 0;//总任务数
    _pending = 0;//待完成任务
    _totalTime = 0;//任务总时间
    _usedTime = 0;//已用时间
    _icon;
    _tasks = new Map();

    constructor(name, icon) {
        this._name = name;
        this._icon = icon;
    }

    addTask(task) {
        this._tasks.set(task.name, task);
        this._total += 1;
        this._totalTime += task._totalTime;
        if (task.state === UNCOMPLETED) {
            this._pending += 1;
            this._usedTime += task._usedTime;
        }
    }

    removeTask(task) {
        if (this._tasks.has(task.name)) {
            this._tasks.delete(task.name);
            this._total -= 1;
            this._totalTime -= task._totalTime;
            this._usedTime -= task._usedTime;
            if (task.state === UNCOMPLETED) {
                this._pending -= 1;
            }
        }
    }

    hasTask(name) {
        return this._tasks.has(name);
    }

    getTask(name) {
        return this._tasks.get(name);
    }

    completeTask(name) {
        const task = this._tasks.get(name);
        if (task != null) {
            task.usedTime = task._totalTime;
            task.state = COMPLETED;
            this._pending -= 1;
            this._usedTime += task.usedTime;
        }
    }


    get total() {
        return this._total;
    }

    set total(value) {
        this._total = value;
    }

    get pending() {
        return this._pending;
    }

    set pending(value) {
        this._pending = value;
    }

    get totalTime() {
        return this._totalTime;
    }

    set totalTime(value) {
        this._totalTime = value;
    }

    get usedTime() {
        return this._usedTime;
    }

    set usedTime(value) {
        this._usedTime = value;
    }

    get tasks() {
        return this._tasks;
    }

    set tasks(value) {
        this._tasks = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get icon() {
        return this._icon;
    }

    set icon(value) {
        this._icon = value;
    }

}