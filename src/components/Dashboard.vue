<template>
    <div>
        <el-row class="select">
            <el-col :span="8">
                <el-select placeholder="请选择" v-model="selectProject">
                    <el-option-group
                            v-for="project in $root.$data.state.projects"
                            :key="project.name"
                            :label="project.name">
                        <el-option
                                v-for="task in project.tasks"
                                :key="task.name"
                                :label="task.name"
                                :value="task.name">
                        </el-option>
                    </el-option-group>
                </el-select>
            </el-col>
            <el-col :span="7">
                <el-date-picker v-model="fromDate"></el-date-picker>
            </el-col>
            <el-col :span="2">_</el-col>
            <el-col :span="7">
                <el-date-picker v-model="toDate"></el-date-picker>
            </el-col>
        </el-row>
    </div>
</template>

<script>

    export default {
        name: "Dashboard",
        data: function () {
            return {
                projects: this.$root.$data.state.projects,
                selectProject: null,
                fromDate: null,
                toDate: null
            }
        }
    }
</script>

<style scoped>
    .select {
        margin: 1em 15%;
    }
</style>