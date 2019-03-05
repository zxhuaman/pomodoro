export class Task {
    name;
    createTime;
    totalTime;
    usedTime;
    project;
    state;

    constructor(name, createTime, totalTime, usedTime, project, state = 'uncompleted') {
        this.name = name;
        this.createTime = createTime;
        this.totalTime = totalTime;
        this.usedTime = usedTime;
        this.project = project;
        this.state = state
    }
}

export const COMPLETED = 'completed';
export const PROCESSING = 'processing';
export const UNCOMPLETED = 'uncompleted';
