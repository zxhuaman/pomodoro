<template>
    <el-form class="login" :model="loginForm" :rules="loginRules" :ref="loginForm.ref">
        <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input v-model="loginForm.password" placeholder="密码" :type="display ? '':'password'">
                <i v-if="loginForm.password && loginForm.password.length>0" slot="suffix"
                   :class="display ? 'el-input__icon el-icon-display':'el-input__icon el-icon-nodisplay'"
                   @click="display = !display"></i>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit(loginForm.ref)">登陆</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {CODE_USERNAME_NONEXISTENT, CODE_WRONG_PASSWORD} from "../mock/constant";

    export default {
        name: "Login",
        methods: {
            onSubmit(ref) {
                this.$refs[ref].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this.$root.$data.login(this.loginForm.username, this.loginForm.password)
                        .then(code => {
                            if (this.$root.$data.state.login) {
                                this.resetForm(ref);
                                this.$router.push('/pomodoro/home');
                                return true;
                            }
                            switch (code) {
                                case CODE_USERNAME_NONEXISTENT:
                                    this.$message({
                                        message: '用户不存在',
                                        type: 'error',
                                        center: true,
                                        duration: 1000
                                    });
                                    break;
                                case CODE_WRONG_PASSWORD:
                                    this.$message({
                                        message: '密码错误',
                                        type: 'error',
                                        center: true,
                                        duration: 1000
                                    });
                                    break;
                                default:
                                    break;
                            }
                        })
                        .catch(error => {
                            this.$message({
                                message: '请求失败',
                                type: 'error',
                                center: true,
                                duration: 1000
                            });
                        });

                });
            },
            resetForm(ref) {
                this.$refs[ref].resetFields();
            }
        },
        data: function () {
            return {
                loginForm: {
                    ref: 'login',
                    username: 'axiao',
                    password: '123456'
                },
                loginRules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 2, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur'}
                    ]
                },
                display: false
            }
        }
    }
</script>

<style scoped>
    @import "../assets/iconfont.css";

    .login {
        text-align: center;
        width: 25%;
        margin: 12% auto;
    }

    .el-input {
        height: 3em;
    }

    .el-button {
        width: 100%;
    }

</style>