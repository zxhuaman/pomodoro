<template>
    <div class="statistics">

        <el-card :body-style="{height:'100%',width:'100%',padding:'0'}">
            <div id="overview" ref="overview"></div>
        </el-card>

        <el-card :body-style="{height:'100%',width:'100%',padding:'0'}">
            <div slot="header">
                <el-row>
                    <el-col :span="8">
                        <el-radio-group v-model="type">
                            <el-radio-button label="年"></el-radio-button>
                            <el-radio-button label="月"></el-radio-button>
                            <el-radio-button label="周"></el-radio-button>
                        </el-radio-group>
                    </el-col>
                    <el-col :span="16">
                        <el-date-picker
                                v-if="type==='周'"
                                v-model="date"
                                type="week"
                                format="yyyy 第 WW 周"
                                placeholder="选择周">
                        </el-date-picker>
                        <el-date-picker v-else-if="type==='月'"
                                        v-model="date"
                                        type="month"
                                        format="yyyy 年 M 月"
                                        placeholder="选择月">
                        </el-date-picker>
                        <el-date-picker
                                v-else
                                v-model="date"
                                type="year"
                                format="yyyy年"
                                placeholder="选择年">
                        </el-date-picker>
                    </el-col>
                </el-row>
            </div>
            <div id="details" ref="details"></div>
        </el-card>
    </div>
</template>

<script>

    import ECharts from 'echarts'

    export default {
        name: "Dashboard",
        mounted() {
            this.$root.$store.dispatch('getProjectMap')
        },
        computed: {
            projectMap: function () {
                return this.$root.$store.state.projectMap;
            }
        },
        watch: {
            projectMap: function () {
                console.log(this.projectMap)
                const overviewData = {}
                overviewData.legendData = []
                overviewData.seriesData = []
                this.projectMap.forEach((value, key) => {
                    overviewData.legendData.push(key)
                    overviewData.seriesData.push({name: key, value: (value.totalTime / 3600).toFixed(1)})
                })
                this.renderOverview(overviewData)
            },
            date: function () {
                const endDate = new Date(this.date.getTime())
                switch (this.type) {
                    case '年':
                        endDate.setFullYear(endDate.getFullYear() + 1)
                        break
                    case '月':
                        endDate.setMonth(endDate.getMonth() + 1)
                        break
                    case '周':
                        endDate.setTime(endDate.getTime() + 1000 * 3600 * 24 * 7)
                        break
                    default:
                        break
                }
                this.renderDetails(this.getDetailsData(this.date.getTime(), endDate.getTime()))
            },
        },
        methods: {
            getDetailsData(startTime, endTime) {
                const data = new Object()
                data.legendData = ['已完成', '未完成']
                data.xAxisData = []
                data.usedTimeData = []
                data.pendingTimeData = []

                this.projectMap.forEach((project, key) => {

                    let usedTime = 0
                    let pendingTime = 0;

                    project.tasks
                        .filter(task => task.createTime > startTime && task.createTime < endTime)
                        .forEach(task => {
                            usedTime += task.usedTime
                            pendingTime += task.totalTime - task.usedTime
                        })
                    data.usedTimeData.push((usedTime / 3600).toFixed(1))
                    data.pendingTimeData.push((pendingTime / 3600).toFixed(1))
                    data.xAxisData.push(key)
                })
                return data
            },
            getOverviewOption(title, data) {
                return {
                    title: {
                        text: title,
                        x: 'left'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} : {c}h ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        right: '5%',
                        data: data.legendData
                    },
                    series: [
                        {
                            name: '任务数',
                            type: 'pie',
                            radius: '65%',
                            center: ['50%', '50%'],
                            data: data.seriesData,
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
            getDetailsOption(data) {
                return {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: data.legendData
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '14%',
                        containLabel: true
                    },
                    yAxis: {
                        type: 'value'
                    },
                    xAxis: {
                        type: 'category',
                        data: data.xAxisData
                    },
                    series: [
                        {
                            name: '已完成',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    position: 'insideRight'
                                }
                            },
                            data: data.usedTimeData
                        },
                        {
                            name: '未完成',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    position: 'insideRight'
                                }
                            },
                            data: data.pendingTimeData
                        }
                    ]
                }
            },
            renderOverview(data) {
                if (!this.overviewChart) {
                    this.overviewChart = ECharts.init(this.$refs.overview)
                }
                this.overviewChart.setOption(this.getOverviewOption('总览', data))
            },
            renderDetails(data) {
                if (!this.detailsChart) {
                    this.detailsChart = ECharts.init(this.$refs.details)
                }
                this.detailsChart.setOption(this.getDetailsOption(data))
            }
        },
        data: function () {
            return {
                overviewChart: null,
                detailsChart: null,
                type: '年',
                date: null,
                week: null,
                month: null,
                year: null
            }
        }
    }
</script>

<style scoped>
    .statistics {
        display: flex;
        width: 100%;
        height: 100%;
    }

    .el-card {
        flex: 1;
        margin: .5rem;
    }

    #overview,
    #details {
        height: 100%;
        width: 100%;
    }

</style>