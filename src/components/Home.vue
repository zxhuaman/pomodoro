<template>
    <el-container>
        <el-aside width="250px">
            <el-menu :default-active="projects[activeIndex].name">
                <el-menu-item v-for="project in projects" :index="project.name">
                    <i :class="project.icon"></i>
                    <span slot="title">
                        {{project.name}}
                        <el-badge class="mark" :value="project.pending" :hidden="project.pending===0"/>
                    </span>
                </el-menu-item>
                <el-menu-item @click="dialogVisible=true">
                    <i :class="newProject.icon"></i>
                    <span slot="title">
                        {{newProject.name}}
                    </span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-dialog
                title="新建项目"
                :visible.sync="dialogVisible"
                width="35%"
                :before-close="handleClose">
            <!--<el-input v-model="projectName" placeholder="请输入项目名"></el-input>-->
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
                <el-form-item label="项目名称" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">新建</el-button>
                    <el-button @click="resetForm('ruleForm')">取消</el-button>
                </el-form-item>
            </el-form>

            <!--<span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addProject(projectName)">新 建</el-button>
            </span>-->
        </el-dialog>
        <el-main>
            <el-row>
                <el-col :span="6">
                    <div class="grid-content">
                        <p style="font-size: 2.2em;margin: 0">{{projects[activeIndex].totalTime}}</p>
                        <p style="font-size: .7em;margin: 0">预计用时(h)</p>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content">
                        <p style="font-size: 2.2em;margin: 0">{{projects[activeIndex].pending}}</p>
                        <p style="font-size: .7em;margin: 0">待完成任务</p>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content">
                        <p style="font-size: 2.2em;margin: 0">{{projects[activeIndex].usedTime}}</p>
                        <p style="font-size: .7em;margin: 0">已用时间</p>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content">
                        <p style="font-size: 2.2em;margin: 0">
                            {{projects[activeIndex].total-projects[activeIndex].pending}}</p>
                        <p style="font-size: .7em;margin: 0">已完成任务</p>
                    </div>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
    // import Task from '../task';
    import Project from '../project';

    export default {
        name: "Home",
        computed: {
            username() {
                // 我们很快就会看到 `params` 是什么
                return this.$route.params.username
            }
        },
        methods: {
            goBack() {
                window.history.length > 1
                    ? this.$router.go(-1)
                    : this.$router.push('/')
            },
            addProject(name) {
                this.dialogVisible = false;
                this.projects.push(new Project(name, 'el-icon-menu'));
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addProject(this.ruleForm.name);
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.dialogVisible = false;
            }
        },
        data: function () {
            return {
                projects: [
                    new Project('今天', 'el-icon-menu'),
                    new Project('明天', 'el-icon-menu'),
                    new Project('即将到来', 'el-icon-document'),
                ],
                newProject: new Project('新建项目', 'el-icon-plus'),
                activeIndex: 0,
                dialogVisible: false,
                projectName: '',
                ruleForm: {
                    name: ''
                },
                rules: {
                    name: [
                        {required: true, message: '请输入项目名称', trigger: 'blur'},
                        {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ]
                }
            }
        }
    }

</script>

<style scoped>
    .el-container {
        height: 100%;
    }

    .el-menu {
        height: 100%;
    }

    .mark {
        margin-left: .5em;
        margin-bottom: .25em;
    }

    .el-main {
        padding: 0;
    }

    .el-row {
        width: 100%;
        border-bottom: #909399 solid 1px;
    }

    .grid-content {
        height: 60px;
        text-align: center;
    }
</style>