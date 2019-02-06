import Mock from 'mockjs';
import {PROJECTS} from './project-mock'
import {CODE_FAILED, CODE_REQUEST_NOT_SUPPORTED, CODE_SUCCESS, CREATE, DELETE, RETRIEVE, UPDATE} from "./constant";

Mock.mock('/task', 'post', request => {
    const body = JSON.parse(request.body);
    switch (body.type) {
        case CREATE:
            return {
                'code': createTask(body.task) ? CODE_SUCCESS : CODE_FAILED,
                'project': PROJECTS.get(body.task.project)
            };
        case
        RETRIEVE:
            return {
                'code': CODE_SUCCESS,
                'project': retrieveTask(body.task)
            };
        case
        UPDATE:
            return {
                'code': updateTask(body.task) ? CODE_SUCCESS : CODE_FAILED,
                'project': PROJECTS.get(body.task.project)
            };
        case
        DELETE:
            return {
                'code': deleteTask(body.task) ? CODE_SUCCESS : CODE_FAILED,
                'project': PROJECTS.get(body.task.project)
            }
        default:
            return {
                'code': CODE_REQUEST_NOT_SUPPORTED
            }
    }
});

function createTask(task) {
    if (PROJECTS.has(task.project) && !PROJECTS.get(task.project).hasTask(task.name)) {
        PROJECTS.get(task.project).addTask(task);
        return true;
    }
    return false;
}

function retrieveTask(task) {
    return PROJECTS.get(task.project);
}

function deleteTask(task) {
    if (PROJECTS.has(task.project) && PROJECTS.get(task.project).hasTask(task.name)) {
        PROJECTS.get(task.project).removeTask(task);
        return true;
    }
    return false;
}

function updateTask(task) {
    if (PROJECTS.has(task.project) && PROJECTS.get(task.project).hasTask(task.name)) {
        PROJECTS.get(task.project).completeTask(task);
        return true;
    }
    return false;
}

