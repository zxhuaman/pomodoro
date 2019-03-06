<template>
    <el-container>
        <el-aside>
            <el-table
                    ref="projectTable"
                    :data="projects"
                    height="80%"
                    :show-header="false"
                    highlight-current-row
                    @cell-mouse-enter="projectMouseEnter"
                    @cell-mouse-leave="projectMouseLeave"
                    @current-change="handleCurrentChange">
                <el-table-column width="200">
                    <template slot-scope="scope">
                        <i class="el-icon-menu"></i>
                        <span style="margin-left: 10px">{{ scope.row.name}}</span>
                        <el-badge class="mark" :value="scope.row.pending" :hidden="scope.row.pending===0"/>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <i class="el-icon-delete" v-if="scope.row === hoverProject"
                           @click="deleteProject(scope.row)"></i>
                    </template>
                </el-table-column>
            </el-table>
            <el-menu class="create-project">
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
            <el-row class="project-detail" v-if="curProject">
                <el-col :span="6">
                    <div class="grid-content">
                        <p style="font-size: 2.2em;margin: 0;color:#f56c6c;">
                            {{(curProject.totalTime/60).toFixed(1)}}</p>
                        <p style="font-size: .7em;margin: 0">预计用时(h)</p>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content">
                        <p style="font-size: 2.2em;margin: 0;color:#f56c6c;">
                            {{curProject.pending}}</p>
                        <p style="font-size: .7em;margin: 0">待完成任务</p>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content">
                        <p style="font-size: 2.2em;margin: 0;color:#f56c6c;">
                            {{(curProject.usedTime/60).toFixed(1)}}</p>
                        <p style="font-size: .7em;margin: 0">已用时间(h)</p>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content">
                        <p style="font-size: 2.2em;margin: 0;color:#f56c6c;">
                            {{curProject.total-curProject.pending}}</p>
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
                                    :icon-classes="['el-icon-tomato', 'el-icon-tomato', 'el-icon-tomato']"
                                    void-icon-class="el-icon-tomato">
                            </el-rate>
                        </el-input>
                    </el-form-item>
                </el-form>
                <el-table
                        v-if="curProject && curProject.tasks.length > 0"
                        class="tasks"
                        max-height="700"
                        height="550"
                        row-dbclick=""
                        :show-header="false"
                        :data="curProject.tasks">
                    <el-table-column
                            prop="state"
                            align="center"
                            label="">
                        <template slot-scope="scope">
                            <i v-if="scope.row.state!=='processing'" class="el-icon-caret-right"
                               @click="updateTaskState(scope.row, 'processing')"></i>
                            <i v-else class="el-icon-time" @click="updateTaskState(scope.row, 'uncompleted')"></i>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            align="center"
                            label="创建时间">
                        <template slot-scope="scope">
                            {{getDateString(scope.row.createTime)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            align="center"
                            label="任务名"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="totalTime"
                            label="总时间(min)">
                        <template slot-scope="scope">
                            <el-rate
                                    slot="append"
                                    :max="scope.row.totalTime/25"
                                    :value="scope.row.totalTime/25"
                                    :icon-classes="['el-icon-tomato', 'el-icon-tomato', 'el-icon-tomato']"
                                    void-icon-class="el-icon-tomato">
                            </el-rate>
                        </template>
                    </el-table-column>

                    <el-table-column
                            fixed="right"
                            label="操作">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.state !== 'completed'"
                                       @click="completeTask(scope.row)" size="mini"
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
    import Project from '../model/project'
    import Gitee from "../model/gitee"
    import {Task} from "../model/task";

    export default {
        name: "Home",
        beforeMount: function () {
            Gitee.getProjects().then(projects => {
                this.projects = projects
                projects.forEach(project => this.projectMap.set(project.name, project))
            })
        },
        computed: {
            username() {
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
                this.dialogVisible = false
                const project = new Project(name, new Date().getTime())
                Gitee.addProject(project).then(project => {
                    this.projectMap.set(project.name, project)
                    this.projects = Array.from(this.projectMap.values())
                    setTimeout(() => this.curIndex = this.projects.length - 1, 100)
                })
            },
            deleteProject(project) {
                Gitee.deleteProject(project).then(() => {
                    this.projectMap.delete(project.name)
                    this.projects = Array.from(this.projectMap.values())
                }).catch(err => console.log(err))
            },
            addTask(name, tomato) {
                const task = new Task(name, new Date().getTime(), tomato * 25, 0, this.curProject.name)
                Gitee.addTask(task).then(value => {
                    this.projects.forEach((project, index) => {
                        if (project.name === value.project) {
                            this.projects[index].addTask(value)
                        }
                    })
                })
            },
            completeTask(task) {
                this.projectMap.get(task.project).completeTask(task)
                this.projects = Array.from(this.projectMap.values())
            },
            removeTask(task) {
                Gitee.removeTask(task).then(() => {
                    this.projectMap.get(task.project).removeTask(task)
                    this.projects = Array.from(this.projectMap.values())
                }).catch(err => console.log(err))
            },
            updateTaskState(task, state) {
                this.projects.forEach(project => {
                    if (project.name === task.project) {
                        task.state = state
                        project.updateTask(task)
                    }
                })

            },
            submitForm(ref) {
                if (this.addProjectForm.ref === ref) {
                    this.$refs[ref].validate((valid) => {
                        if (valid) {
                            this.addProject(this.addProjectForm.name)
                            this.resetForm(ref)
                        } else {
                            return false
                        }
                    })
                } else if (this.addTaskForm.ref === ref) {
                    this.$refs[ref].validate((valid) => {
                        if (valid) {
                            this.addTask(this.addTaskForm.name, this.addTaskForm.tomato)
                            this.resetForm(ref)
                        } else {
                            return false
                        }
                    })
                }
            },
            resetForm(ref) {
                this.$refs[ref].resetFields()
                if (this.addProjectForm.ref === ref) {
                    this.dialogVisible = false
                } else if (this.addTaskForm.ref === ref) {
                    this.addTaskForm.tomato = 1
                }
            },
            getDateString(time) {
                const date = new Date()
                date.setTime(time)
                return date.toLocaleDateString()
            },
            handleCurrentChange(val) {
                this.currentRow = val
                this.curProject = val
            },
            projectMouseEnter(val) {
                this.hoverProject = val
            },
            projectMouseLeave(val) {
                this.hoverProject = null
            }
        },
        data: function () {
            let checkProject = (rule, value, callback) => {
                if (this.$root.$data.state.projects.filter(v => v.name === value).length > 0) {
                    return callback(new Error('项目已存在'))
                }
                callback()
            }
            let checkTask = (rule, value, callback) => {
                if (this.curProject.tasks.filter(task => task.name === value).length > 0) {
                    return callback(new Error('任务已存在'))
                }
                callback()
            }
            return {
                newProject: new Project('新建项目'),
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
                },
                curIndex: 0,
                projects: [],
                projectMap: new Map(),
                currentRow: 0,
                hoverProject: null,
                curProject: null
            }
        }
    }

</script>

<style scoped>
    @import "../assets/iconfont.css";

    .el-container {
        height: 100%;
    }

    .projects {
        height: 80%;
    }

    .delete-project {
        display: none;
    }

    .mark {
        margin-left: .5em;
        margin-top: .25em;
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

</style>