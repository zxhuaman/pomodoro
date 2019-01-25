export default class Task {
    name;
    totalTime;
    usedTime;
    state;


    constructor(name, totalTime = 0, usedTime = 0, state = UNCOMPLETED) {
        this.name = name;
        this.totalTime = totalTime;
        this.usedTime = usedTime;
        this.state = state;
    }
}

export const COMPLETED = 'completed';
export const UNCOMPLETED = 'uncompleted';

