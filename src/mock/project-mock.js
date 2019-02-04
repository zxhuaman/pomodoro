import Mock from 'mockjs';
import Project from "../project";
import Task from "../task";
import {CODE_FAILED, CODE_REQUEST_NOT_SUPPORTED, CODE_SUCCESS, CREATE, DELETE, RETRIEVE, UPDATE} from "./constant";

const TEST_PROJECT = new Project('测试项目');
for (let i = 1; i < 10; i++) {
    TEST_PROJECT.addTask(new Task('测试任务' + i, 25 * (i % 5 + 1)));
}
const PROJECTS = new Map([
    ['今天', new Project('今天')],
    ['明天', new Project('明天')],
    ['即将到来', new Project('即将到来')],
    [TEST_PROJECT.name, TEST_PROJECT]
])

Mock.mock('/project', 'post', function (request) {
    const body = JSON.parse(request.body);
    const type = body.type;
    switch (type) {
        case CREATE:
            return {
                'code': createProject(body.project) ? CODE_SUCCESS : CODE_FAILED,
                'projects': [...PROJECTS.values()]
            };
        case
        RETRIEVE:
            return {
                'code': CODE_SUCCESS,
                'projects': retrieveProject(body.project)
            };
        case
        UPDATE:
            return {
                'code': updateProject(body.project) ? CODE_SUCCESS : CODE_FAILED,
                'projects': [...PROJECTS.values()]
            };
        case
        DELETE:
            return {
                'code': deleteProject(body.project) ? CODE_SUCCESS : CODE_FAILED,
                'projects': [...PROJECTS.values()]
            };
        default:
            return {
                'code': CODE_REQUEST_NOT_SUPPORTED
            };
    }
});

function createProject(project) {
    if (PROJECTS.has(project.name)) {
        return false;
    }
    PROJECTS.set(project.name, project);
}

function retrieveProject(project) {
    if (!project) {
        return [...PROJECTS.values()];
    }
    if (PROJECTS.has(project.name)) {
        return [PROJECTS.get([project.name])];
    }
    return [];
}

function updateProject(project) {
    if (PROJECTS.has(project.name)) {
        PROJECTS.set(project.name, project);
        return true;
    }
    return false;
}

function deleteProject(project) {
    return PROJECTS.delete(project);
}


