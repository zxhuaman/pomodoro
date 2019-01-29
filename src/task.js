export default class Task {
    createTime;
    createTimeString;
    name;
    totalTime;
    usedTime;
    state;


    constructor(name, totalTime = 0, usedTime = 0, state = UNCOMPLETED) {
        this.name = name;
        this.totalTime = totalTime;
        this.usedTime = usedTime;
        this.state = state;
        let date  = new Date();
        this.createTime = date.getTime();
        this.createTimeString = date.toLocaleDateString();
    }
}

export const COMPLETED = 'completed';
export const PROCESSING = 'processing';
export const UNCOMPLETED = 'uncompleted';

