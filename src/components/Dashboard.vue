<template>
    <div>
        <el-date-picker v-model="fromDate"></el-date-picker>
        <span> - </span>
        <el-date-picker v-model="toDate"></el-date-picker>
        <div id="chart"></div>
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
            },
            chartData: function () {
                const data = [];
                this.$root.$data.state.projects.forEach(project => {
                    data.push({
                        'name': project.name,
                        'type': '任务总数',
                        'value': project.total
                    });
                });
                this.$root.$data.state.projects.forEach(project => {
                    data.push({
                        'name': project.name,
                        'type': '已完成任务',
                        'value': project.total - project.pending
                    });
                });
                return data;
            }
        },
        mounted: function () {
            this.renderChart();
        },
        methods: {
            renderChart() {
                if (!this.chart) {
                    this.chart = new G2.Chart({
                        container: 'chart',
                        width:window.innerWidth-200,
                        height: window.innerHeight - 200,
                        padding: 'auto'
                    });
                }
                this.chart.source(this.chartData);

                this.chart.axis('name', {
                    label: {
                        textStyle: {
                            fill: '#aaaaaa'
                        }
                    },
                    tickLine: {
                        alignWithLabel: false,
                        length: 0
                    }
                });

                this.chart.axis('value', {
                    label: {
                        textStyle: {
                            fill: '#aaaaaa'
                        }
                    },
                    title: {
                        offset: 50
                    }
                });
                this.chart.legend({
                    position: 'top-center'
                });
                this.chart.interval().position('name*value').color('type').opacity(1).adjust([{
                    type: 'dodge',
                    marginRatio: 1 / 32
                }]);
                this.chart.render();
            }
        },
        data: function () {
            return {
                fromDate: null,
                toDate: null,
                chart: null,
            }
        }
    }
</script>

<style scoped>
    div {
        text-align: center;
        margin: 1em auto;
    }

    #chart {
        margin: 3em auto 0 auto;
        text-align: center;
    }

</style>