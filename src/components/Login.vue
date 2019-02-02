<template>
    <el-form class="login" :model="loginForm" :rules="loginRules" :ref="loginForm.ref" status-icon>
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
    export default {
        name: "Login",
        methods: {
            onSubmit(ref) {
                this.$refs[ref].validate((valid) => {
                    if (valid) {
                        this.resetForm(ref);
                        this.$router.push('/pomodoro/home');
                        this.$root.$data.login();
                    } else {
                        return false;
                    }
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
                    username: '',
                    password: ''
                },
                loginRules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 2, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur'}
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