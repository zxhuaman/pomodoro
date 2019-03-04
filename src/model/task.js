export default class Task {
    name;
    createTime;
    totalTime;
    usedTime;
    project;

    constructor(name, createTime, totalTime, usedTime, project) {
        this.name = name;
        this.createTime = createTime;
        this.totalTime = totalTime;
        this.usedTime = usedTime;
        this.project = project;
    }
}