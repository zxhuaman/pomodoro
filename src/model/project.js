export default class Project {
    name;
    createTime;
    tasks;

    constructor(name, createTime, tasks = []) {
        this.name = name;
        this.createTime = createTime;
        this.tasks = tasks;
    }
}