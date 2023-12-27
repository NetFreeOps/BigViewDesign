<template>
    <div>
        <div class="main" id="main"></div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echart from 'echarts'


onMounted(() => {
    var mychart = echart.init(document.getElementById('main'))

    mychart.setOption({
        title: {
            text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
            data: ['销量']
        },
        xAxis: {
            data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
            
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    })
})



</script>
<style scoped>
.main{
    width:100px;
    height: 100px;
}
</style>