<template>
    <div>
        <el-row class="select">
            <el-col :span="8">
                <el-select placeholder="请选择" v-model="selectProject" @focus="fromDate=null;toDate=null">
                    <el-option
                            v-for="project in $root.$data.state.projects"
                            :key="project.name"
                            :label="project.name"
                            :value="project.name">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="7">
                <el-date-picker v-model="fromDate" @focus="selectProject=''"></el-date-picker>
            </el-col>
            <el-col :span="2">_</el-col>
            <el-col :span="7">
                <el-date-picker v-model="toDate" @focus="selectProject=''"></el-date-picker>
            </el-col>
        </el-row>
        <div class="chart-panel">
            <div id="chart"></div>
        </div>
    </div>
</template>

<script>
    import G2 from '@antv/g2';

    export default {
        name: "Dashboard",
        watch: {
            projects: function () {
                this.renderChart();
            }
        },
        computed: {
            projects: function () {
                return this.$root.$data.state.projects;
            }
        },
        mounted: function () {
            this.renderChart();
        },
        methods: {
            renderChart() {
                if (!this.g2) {
                    this.g2 = new G2.Chart({
                        container: 'chart',
                        width: 1000,
                        height: 500
                    })
                }
                this.g2.source(this.projects);
                this.g2.interval().position('name*total').color('total');
                this.g2.render();
            }
        },
        data: function () {
            return {
                // projects: this.$root.$data.state.projects,
                selectProject: '',
                fromDate: null,
                toDate: null,
                g2: null,
            }
        }
    }
</script>

<style scoped>
    .select {
        margin: 1em 15%;
    }

    .chart-panel {
        width: 100%;

        margin: 3em auto;
        text-align: center;
    }

</style>