import Mock from 'mockjs'
import {CODE_SUCCESS, CODE_USERNAME_NONEXISTENT, CODE_WRONG_PASSWORD} from "./constant";

const USERS = new Map([
    ['xiaodong', '123456'],
    ['xiaoming', '123456'],
    ['xiaoqing', '123456'],
    ['xiaohua', '123456'],
    ['axiao', '123456'],
])


Mock.mock('/login', 'post', function (request) {
    const body = JSON.parse(request.body);
    if (USERS.has(body.username)) {
        return {
            'code': USERS.get(body.username) === body.password ? CODE_SUCCESS : CODE_WRONG_PASSWORD
        };
    } else {
        return {
            'code': CODE_USERNAME_NONEXISTENT
        };
    }
})