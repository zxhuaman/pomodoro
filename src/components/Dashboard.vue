<template>
    <div>
        <el-row class="select">
            <el-col :span="8">
                <el-select placeholder="请选择">
                    <el-option-group
                            v-for="group in projects"
                            :key="group.name"
                            :label="group.name">
                        <el-option
                                v-for="item in group.tasks"
                                :key="item.name"
                                :label="item.name"
                                :value="item.name">
                        </el-option>
                    </el-option-group>
                </el-select>
            </el-col>
            <el-col :span="7">
                <el-date-picker></el-date-picker>
            </el-col>
            <el-col :span="2">_</el-col>
            <el-col :span="7">
                <el-date-picker></el-date-picker>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Project from "../project";
    import Task from "../task";

    export default {
        name: "Dashboard",
        data: function () {
            const today = new Project('今天');
            today.addTask(new Task('做作业'));
            today.addTask(new Task('做作业1'));
            today.addTask(new Task('做作业2'));
            today.addTask(new Task('做作业3'));
            today.addTask(new Task('做作业4'));
            const tomorrow = new Project('明天');
            tomorrow.addTask(new Task('做作业'));
            tomorrow.addTask(new Task('做作业1'));
            tomorrow.addTask(new Task('做作业2'));
            tomorrow.addTask(new Task('做作业3'));
            tomorrow.addTask(new Task('做作业4'));
            return {
                projects: [
                    today,
                    tomorrow
                ]
            }
        }
    }
</script>

<style scoped>
    .select {
        margin: 1em 15%;
    }
</style>