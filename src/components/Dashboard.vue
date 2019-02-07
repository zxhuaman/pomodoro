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
                fromDate: null,
                toDate: null,
                g2: null,
            }
        }
    }
</script>

<style scoped>
    div {
        text-align: center;
        margin: 1em auto;
    }

    .chart {
        margin: 3em auto 0 auto;
        text-align: center;
    }

</style>