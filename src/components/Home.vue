<template>
    <el-container>
        <el-aside width="250px">
            <el-menu :default-active="activeProject.name">
                <el-menu-item v-for="project in projects" :index="project.name" @click="activeProject=project">
                    <i class="el-icon-menu"></i>
                    <span slot="title">
                        {{project.name}}
                        <el-badge class="mark" :value="project.pending" :hidden="project.pending===0"/>
                    </span>
                </el-menu-item>
                <el-menu-item @click="dialogVisible=true" :index="newProject.name">
                    <i class="el-icon-plus"></i>
                    <span slot="title">
                        {{newProject.name}}
                    </span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-dialog
                title="新建项目"
                :visible.sync="dialogVisible"
                width="35%">
            <el-form :model="addProjectForm"
                     :rules="addProjectRules"
                     :ref="addProjectForm.ref"
                     label-width="80px"
                     @submit.native.prevent>
                <el-form-item label="项目名称" prop="name">
                    <el-input v-model="addProjectForm.name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(addProjectForm.ref)">新建</el-button>
                    <el-button @click="resetForm(addProjectForm.ref)">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-main>
            <el-row class="project-detail">
                <el-col :span="6">
                    <div class="grid-content">
                        <p style="font-size: 2.2em;margin: 0;color:#f56c6c;">
                            {{(activeProject.totalTime/60).toFixed(1)}}</p>
                        <p style="font-size: .7em;margin: 0">预计用时(h)</p>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content">
                        <p style="font-size: 2.2em;margin: 0;color:#f56c6c;">{{activeProject.pending}}</p>
                        <p style="font-size: .7em;margin: 0">待完成任务</p>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content">
                        <p style="font-size: 2.2em;margin: 0;color:#f56c6c;">
                            {{(activeProject.usedTime/60).toFixed(1)}}</p>
                        <p style="font-size: .7em;margin: 0">已用时间(h)</p>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content">
                        <p style="font-size: 2.2em;margin: 0;color:#f56c6c;">
                            {{activeProject.total-activeProject.pending}}</p>
                        <p style="font-size: .7em;margin: 0">已完成任务</p>
                    </div>
                </el-col>
            </el-row>
            <div class="task-panel">
                <el-form :model="addTaskForm"
                         :rules="addTaskRules"
                         :ref="addTaskForm.ref"
                         @submit.native.prevent>

                    <el-form-item prop="name">
                        <el-input v-model="addTaskForm.name"
                                  placeholder="请输入任务名称"
                                  @keyup.enter.native="submitForm(addTaskForm.ref)">
                            <el-rate
                                    slot="append"
                                    v-model="addTaskForm.tomato"
                                    :icon-classes="['el-icon-fanqie', 'el-icon-fanqie', 'el-icon-fanqie']"
                                    void-icon-class="el-icon-fanqie">
                            </el-rate>
                        </el-input>
                    </el-form-item>
                </el-form>
                <el-table
                        v-if="activeProject.tasks.length > 0"
                        class="tasks"
                        max-height="700"
                        height="550"
                        :data="activeProject.tasks"
                >
                    <el-table-column
                            prop="name"
                            label="任务名">
                    </el-table-column>
                    <el-table-column
                            prop="totalTime"
                            label="总时间(min)">
                    </el-table-column>
                    <el-table-column
                            label="已用时间(min)"
                            prop="usedTime">
                    </el-table-column>

                    <el-table-column
                            fixed="right"
                            label="操作">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.state === 'uncompleted'"
                                       @click="completeTask(scope.row.name)" size="mini"
                                       icon="el-icon-check" title="完成"
                                       circle>
                            </el-button>
                            <el-button @click="removeTask(scope.row)"
                                       size="mini" icon="el-icon-delete" title="删除" circle></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    // import Task from '../task';
    import Project from '../project';
    import Task, {COMPLETED} from "../task";

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
                const project = new Project(name);
                this.projects.push(project);
                setTimeout(() => this.activeProject = project, 100);
            },
            addTask(name, tomato) {
                const task = new Task(name, tomato * 25);
                this.activeProject.addTask(task);
            },
            submitForm(ref) {
                if (this.addProjectForm.ref === ref) {
                    this.$refs[ref].validate((valid) => {
                        if (valid) {
                            this.addProject(this.addProjectForm.name);
                            this.resetForm(ref);
                        } else {
                            return false;
                        }
                    });
                } else if (this.addTaskForm.ref === ref) {
                    this.$refs[ref].validate((valid) => {
                        if (valid) {
                            this.addTask(this.addTaskForm.name, this.addTaskForm.tomato);
                            this.resetForm(ref);
                        } else {
                            return false;
                        }
                    });
                }
            },
            resetForm(ref) {
                this.$refs[ref].resetFields();
                if (this.addProjectForm.ref === ref) {
                    this.dialogVisible = false;
                } else if (this.addTaskForm.ref === ref) {
                    this.addTaskForm.tomato = 1;
                }
            },
            completeTask(taskName) {
                this.activeProject.completeTask(taskName);
            },
            removeTask(task) {
                this.activeProject.removeTask(task);
            }
        },
        data: function () {
            let checkProject = (rule, value, callback) => {
                if (this.projects.filter(v => v.name === value).length > 0) {
                    return callback(new Error('项目已存在'));
                }
                callback();
            };
            let checkTask = (rule, value, callback) => {
                if (this.activeProject.hasTask(value)) {
                    return callback(new Error('任务已存在'));
                }
                callback();
            };
            const today = new Project('今天');
            const tomorrow = new Project('明天');
            const feature = new Project('即将到来');
            return {
                projects: [today, tomorrow, feature],
                newProject: new Project('新建项目'),
                activeProject: today,
                dialogVisible: false,
                addProjectForm: {
                    ref: 'add-project',
                    name: ''
                },
                addProjectRules: {
                    name: [
                        {validator: checkProject, trigger: 'blur'},
                        {required: true, message: '请输入项目名称', trigger: 'blur'},
                        {min: 2, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur'}
                    ]
                },
                addTaskForm: {
                    ref: 'add-task',
                    name: '',
                    tomato: 1
                },
                addTaskRules: {
                    name: [
                        {validator: checkTask, trigger: 'focus'},
                        {required: true, message: '请输入任务名称', trigger: 'focus'},
                        {min: 2, max: 8, message: '长度在 3 到 8 个字符', trigger: 'focus'}
                    ]
                }
            }
        }
    }

</script>

<style scoped>
    @import "../assets/iconfont.css";

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
        overflow-y: hidden;
        padding: 0;
    }

    .project-detail {
        width: 100%;
        border-bottom: #909399 solid 1px;
    }

    .grid-content {
        height: 60px;
        text-align: center;
    }

    .task-panel {
        padding: .8em;
    }

    .tasks {
    }

    .task-name {
        height: 1em;
    }

    .operation {
        float: right;
    }

    .operation {
        float: right;
        margin-bottom: .5em;
    }
</style>