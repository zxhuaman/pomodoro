<template>
    <div>
        <el-row style="width: 100%;margin: 0;" :gutter="10">
            <el-col :span="6" style="margin: 0">
                <el-card>
                    <div ref="overview" style="width: 220px;height: 90px"></div>
                </el-card>
            </el-col>
            <el-col :span="6" style="margin: 0">
                <el-card>
                    <div ref="nearlyAYear" style="width: 220px;height: 90px"></div>
                </el-card>
            </el-col>
            <el-col :span="6" style="margin: 0">
                <el-card>
                    <div ref="nearlyThreeMonths" style="width: 220px;height: 90px"></div>
                </el-card>
            </el-col>
            <el-col :span="6" style="margin: 0">
                <el-card>
                    <div ref="nearlyAWeek" style="width: 220px;height: 90px"></div>
                </el-card>
            </el-col>
        </el-row>
        <div style="text-align: left;margin: 0;padding-left: 10px">
            <el-button type="text" size="mini">今天</el-button>
            <el-button type="text" size="mini">本周</el-button>
            <el-button type="text" size="mini">本月</el-button>
            <el-button type="text" size="mini">全年</el-button>
            <el-date-picker
                    size="mini"
                    style="margin-left: 10px"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
        </div>

    </div>
</template>

<script>

    import ECharts from 'echarts'
    import {COMPLETED} from "../model/task";

    export default {
        name: "Dashboard",
        mounted() {
            this.$root.$store.dispatch('getProjectMap')
        },
        computed: {
            projects: function () {
                console.log(this.$root.$store.state.projectMap)
                return Array.from(this.$root.$store.state.projectMap.values())
            }
        },
        watch:{
          projects:function () {
              console.log(this.projects)
              let completed = 0;
              let uncompleted = 0;
              [].concat(...this.projects.map(project => project.tasks))
                  .forEach(task => task.state === COMPLETED ? completed += 1 : uncompleted += 1)
              this.setOption(ECharts.init(this.$refs.overview),
                  this.getOption('总览', completed, uncompleted))
              this.setOption(ECharts.init(this.$refs.nearlyAYear),
                  this.getOption('近一年', completed, uncompleted))
              this.setOption(ECharts.init(this.$refs.nearlyThreeMonths),
                  this.getOption('近三个月', completed, uncompleted))
              this.setOption(ECharts.init(this.$refs.nearlyAWeek),
                  this.getOption('近一星期', completed, uncompleted))
          }
        },
        methods: {
            getOption(title, completed, uncompleted) {
                return {
                    title: {
                        text: title,
                        x: 'left'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },

                    series: [
                        {
                            name: '任务数',
                            type: 'pie',
                            radius: '45%',
                            center: ['50%', '65%'],
                            data: [
                                {value: completed, name: '已完成'},
                                {value: uncompleted, name: '未完成'},
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                }
            },
            setOption(chart, option) {
                chart.setOption(option)
            }
        }
    }
</script>

<style scoped>
    div {
        text-align: center;
        margin: 1em auto;
    }

</style>