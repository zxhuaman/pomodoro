<template>
    <el-container>
        <el-aside>
            <el-table
                    ref="projectTable"
                    :data="projects"
                    height="90%"
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
        <el-container>
            <el-main>
                <el-card class="task-panel">
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
                            ref="taskTable"
                            v-if="curProject && curProject.tasks.length > 0"
                            size="mini"
                            height="100%"
                            row-dbclick=""
                            :show-header="false"
                            highlight-current-row
                            @current-change="handleTaskChange"
                            :data="curProject.tasks">

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
                                        :max="scope.row.totalTime/60/25"
                                        :value="scope.row.totalTime/60/25"
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
                                           type="text"
                                >
                                    完成
                                </el-button>
                                <el-button @click="removeTask(scope.row)"
                                           size="mini" type="text">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
                <el-card class="current-task">
                    <div slot="header" class="task-title">
                        <span>{{curTask?curTask.name:''}}</span>
                    </div>
                    <div v-if="curTask">
                        <span>总时间{{(curTask.totalTime/3600).toFixed(1)}}小时</span>
                        <span class="countdown">{{formatTime(remainingTime)}}</span>
                        <el-button class="task-operation" type="primary" v-if="curTask.state !== 'complete'" round>
                            {{curTask.state === 'uncompleted' ? '开始':'暂停'}}
                        </el-button>
                    </div>
                </el-card>
            </el-main>
        </el-container>
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
    </el-container>
</template>

<script>
    import Project from '../model/project'
    import {COMPLETED, PROCESSING, Task, UNCOMPLETED} from "../model/task";

    export default {
        name: "Home",
        computed: {
            projectMap: function () {
                return this.$root.$store.state.projectMap
            },
            username() {
                return this.$route.params.username
            }
        },
        watch: {
            projectMap: function () {
                this.projects = Array.from(this.projectMap.values())
                if (this.curProject) {
                    this.curProject = this.projectMap.get(this.curProject.name)
                } else {
                    this.curProject = this.projects[0]
                }
                this.$refs.projectTable.setCurrentRow(this.curProject)
            },
            curProject: function () {
                this.curTask = this.curProject.tasks[0]
            },
            curTask: function () {
                this.$refs.taskTable.setCurrentRow(this.curTask)
                this.remainingTime = this.curTask.totalTime - this.curTask.usedTime
            }
        },
        methods: {
            addProject(name) {
                this.dialogVisible = false
                const project = new Project(name, new Date().getTime())
                this.$root.$store.dispatch('addProject', project)
                this.curProject = project
            },
            deleteProject(project) {
                this.$root.$store.dispatch('deleteProject', project)
            },
            addTask(name, tomato) {
                const task = new Task(name, new Date().getTime(), tomato * 25 * 60, 0, this.curProject.name)
                this.$root.$store.dispatch('addTask', task)
            },
            completeTask(task) {
                if (this.curTask) {
                    this.stopCountdown(this.curTask)
                }
                task.state = COMPLETED;
                task.usedTime = task.totalTime
                this.$root.$store.dispatch('updateTask', task)
            },
            removeTask(task) {
                this.$root.$store.dispatch('removeTask', task)
            },
            updateTaskState(task, state) {
                if (this.curTask) {
                    this.curTask.state = this.curTask.totalTime - this.curTask.usedTime > 0 ? UNCOMPLETED : COMPLETED
                    this.stopCountdown(this.curTask)
                }
                task.state = state
                this.curTask = task
                this.projects.forEach(project => {
                    if (project.name === task.project) {
                        task.state = state
                        project.updateTask(task)
                    }
                })
                if (state === PROCESSING) {
                    this.countdown(task)
                }
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
            handleTaskChange(val) {
                this.curTask = val
            },
            projectMouseEnter(val) {
                this.hoverProject = val
            },
            projectMouseLeave() {
                this.hoverProject = null
            },
            countdown(task) {
                this.showCountdown = true
                this.countdownTime = task.totalTime - task.usedTime
                this.countdownId = setInterval(this.decrement, 1000)
            },
            stopCountdown(task) {
                this.showCountdown = false
                clearInterval(this.countdownId)
                this.$root.$store.dispatch('updateTask', task)
            },
            decrement() {
                if (this.countdownTime == 0) {
                    this.stopCountdown(this.curTask)
                } else {
                    this.curTask.usedTime += 1
                    this.countdownTime -= 1
                }
            },
            formatTime(time) {
                const hours = parseInt(time / 3600)
                const minutes = parseInt(time / 60)
                const seconds = time % 60
                return (Array(2).join('0') + hours).slice(-2) + ':'
                    + (Array(2).join('0') + minutes).slice(-2) + ':'
                    + (Array(2).join('0') + seconds).slice(-2)
            },
            toggleTaskState(state) {
                this.curTask = state
            }
        },
        data: function () {
            let checkProject = (rule, value, callback) => {
                if (this.projectMap.has(value)) {
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
                currentRow: 0,
                hoverProject: null,
                projects: null,
                curProject: null,
                curTask: new Task('测试', new Date().getTime(), 25 * 4 * 60, 0, ''),
                showCountdown: false,
                countdownTime: 0,
                countdownId: undefined,
                remainingTime: 0
            }
        }
    }

</script>

<style scoped>
    @import "../assets/iconfont.css";

    .el-aside {
        border-right: #909399 solid 1px;
    }

    .mark {
        margin-left: .5em;
        margin-top: .25em;
    }

    .el-main {
        overflow-y: hidden;
        display: flex;
    }

    .grid-content {
        height: 60px;
        text-align: center;
    }

    .task-panel,
    .current-task {
        flex: 1;
        margin: 0 .5rem;
        height: 100%;
    }

    .task-title {
        text-align: center;
        font-size: xx-large;
    }

    .countdown {
        display: block;
        width: 100%;
        height: 60%;
        margin-top: 20%;
        text-align: center;
        font-size: 5rem;
    }

    .task-operation {
        width: 100%;
        margin-top: 40%;
    }

</style>