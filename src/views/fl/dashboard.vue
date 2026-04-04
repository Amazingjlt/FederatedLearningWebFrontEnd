<template>
  <div class="p-4">
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">仪表盘</h2>
      <div class="flex items-center gap-2">
        <button
          @click="refreshData"
          class="bg-secondary hover:bg-gray-700 text-sm px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
        >
          <i class="fas fa-sync-alt"></i>
          <span>刷新</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- Active Jobs Card -->
      <div
        class="bg-secondary rounded-xl p-5 border border-gray-700 hover:border-accent/50 transition-all duration-300"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-400 text-sm">活跃作业</p>
            <h3 class="text-3xl font-bold mt-1">{{ stats.activeJobs }}</h3>
            <p class="text-accent text-xs mt-2 flex items-center">
              <i class="fas fa-arrow-up mr-1"></i>
              较昨日增加2个
            </p>
          </div>
          <div class="bg-primary/50 p-3 rounded-lg">
            <i class="fas fa-spinner text-accent text-xl"></i>
          </div>
        </div>
      </div>

      <!-- Completed Jobs Card -->
      <div
        class="bg-secondary rounded-xl p-5 border border-gray-700 hover:border-accent/50 transition-all duration-300"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-400 text-sm">已完成作业</p>
            <h3 class="text-3xl font-bold mt-1">{{ stats.completedJobs }}</h3>
            <p class="text-green-400 text-xs mt-2 flex items-center">
              <i class="fas fa-check-circle mr-1"></i>
              成功率 92%
            </p>
          </div>
          <div class="bg-primary/50 p-3 rounded-lg">
            <i class="fas fa-check-square text-green-400 text-xl"></i>
          </div>
        </div>
      </div>

      <!-- Total Clients Card -->
      <div
        class="bg-secondary rounded-xl p-5 border border-gray-700 hover:border-accent/50 transition-all duration-300"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-400 text-sm">总客户端</p>
            <h3 class="text-3xl font-bold mt-1">{{ stats.totalClients }}</h3>
            <p class="text-blue-400 text-xs mt-2 flex items-center">
              <span class="status-indicator status-online"></span>
              {{ stats.onlineClients }}个在线
            </p>
          </div>
          <div class="bg-primary/50 p-3 rounded-lg">
            <i class="fas fa-desktop text-blue-400 text-xl"></i>
          </div>
        </div>
      </div>

      <!-- Server Status Card -->
      <div
        class="bg-secondary rounded-xl p-5 border border-gray-700 hover:border-accent/50 transition-all duration-300"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-400 text-sm">服务器状态</p>
            <h3 class="text-3xl font-bold mt-1">在线</h3>
            <p class="text-accent text-xs mt-2 flex items-center">
              <span class="status-indicator status-online"></span>
              运行中 12天4小时
            </p>
          </div>
          <div class="bg-primary/50 p-3 rounded-lg">
            <i class="fas fa-server text-green-400 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- System Overview Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Left Column: Connected Clients -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-secondary rounded-xl p-5 border border-gray-700">
          <div class="flex justify-between items-center mb-5">
            <h3 class="text-lg font-semibold">已连接客户端</h3>
            <span class="text-xs bg-primary px-3 py-1 rounded-full">
              {{ stats.onlineClients }}/{{ stats.totalClients }} 在线
            </span>
          </div>
          <div class="space-y-4">
            <div
              v-for="client in clients"
              :key="client.id"
              class="bg-primary/50 p-4 rounded-lg hover:bg-primary/70 transition-colors duration-200"
            >
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <div class="bg-accent/20 p-3 rounded-full">
                    <i class="fas fa-desktop text-accent"></i>
                  </div>
                  <div>
                    <h4 class="font-medium">{{ client.name }}</h4>
                    <p class="text-sm text-gray-400">{{ client.gpu }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span
                    :class="[
                      'text-xs px-2 py-1 rounded-full',
                      client.status === 'online'
                        ? 'bg-accent/20 text-accent'
                        : 'bg-red-500/20 text-red-400'
                    ]"
                  >
                    {{ client.status === 'online' ? 'Online' : 'Offline' }}
                  </span>
                  <button class="text-gray-400 hover:text-white">
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Current Job Progress -->
        <div class="bg-secondary rounded-xl p-5 border border-gray-700">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="text-lg font-semibold">当前作业进度</h3>
              <p class="text-sm text-gray-400">作业ID: fl-job-8721</p>
            </div>
            <button class="text-sm text-accent hover:text-accent/80">查看详情</button>
          </div>
          <div class="flex flex-col items-center mb-6">
            <div class="relative w-40 h-40 mb-4">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  class="stroke-current text-gray-700"
                  stroke-width="8"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                ></circle>
                <circle
                  class="stroke-current text-accent progress-ring-circle"
                  stroke-width="8"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="progressOffset"
                ></circle>
              </svg>
              <div class="absolute inset-0 flex items-center justify-center flex-col">
                <span class="text-3xl font-bold">{{ currentJob.progress }}%</span>
                <span class="text-xs text-gray-400">已完成</span>
              </div>
            </div>
            <p class="text-sm">轮次 {{ currentJob.currentRound }} / {{ currentJob.totalRounds }}</p>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between text-sm mb-1">
              <span>训练进度</span>
              <span>{{ currentJob.progress }}%</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div
                class="bg-accent h-2 rounded-full transition-all duration-300"
                :style="{ width: currentJob.progress + '%' }"
              ></div>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-4 mt-6 text-center">
            <div>
              <p class="text-gray-400 text-xs">客户端</p>
              <p class="font-medium">8/10</p>
            </div>
            <div>
              <p class="text-gray-400 text-xs">平均准确率</p>
              <p class="font-medium">89.4%</p>
            </div>
            <div>
              <p class="text-gray-400 text-xs">剩余时间</p>
              <p class="font-medium">1小时24分钟</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Real-time Logs -->
      <div class="bg-secondary rounded-xl p-5 border border-gray-700 h-full flex flex-col">
        <div class="flex justify-between items-center mb-5">
          <h3 class="text-lg font-semibold">实时日志</h3>
          <div class="flex gap-2">
            <button class="text-gray-400 hover:text-white p-1" title="清除日志">
              <i class="fas fa-trash"></i>
            </button>
            <button class="text-gray-400 hover:text-white p-1" title="下载日志">
              <i class="fas fa-download"></i>
            </button>
          </div>
        </div>
        <div class="flex-1 log-viewer overflow-y-auto" ref="logViewer">
          <div v-for="(log, index) in logs" :key="index" class="log-line">
            {{ log }}
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
          <div class="text-xs text-gray-400">最后更新: 刚刚</div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-400">自动滚动</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="autoScroll"
                class="sr-only peer"
              />
              <div
                class="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"
              ></div>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Accuracy Chart -->
      <div class="bg-secondary rounded-xl p-5 border border-gray-700">
        <div class="flex justify-between items-center mb-5">
          <h3 class="text-lg font-semibold">模型准确率</h3>
          <div class="flex gap-3">
            <button class="text-xs bg-primary px-3 py-1 rounded-full">最近10轮</button>
          </div>
        </div>
        <div class="h-80">
          <div ref="accuracyChart" class="w-full h-full"></div>
        </div>
      </div>

      <!-- Loss Chart -->
      <div class="bg-secondary rounded-xl p-5 border border-gray-700">
        <div class="flex justify-between items-center mb-5">
          <h3 class="text-lg font-semibold">训练损失</h3>
          <div class="flex gap-3">
            <button class="text-xs bg-primary px-3 py-1 rounded-full">最近10轮</button>
          </div>
        </div>
        <div class="h-80">
          <div ref="lossChart" class="w-full h-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getDashboardStats } from '@/api/dashboard'

// 数据状态
const stats = ref({
  activeJobs: 3,
  completedJobs: 18,
  totalClients: 12,
  onlineClients: 10
})

const clients = ref([
  { id: 1, name: 'client-01', gpu: 'GPU: NVIDIA RTX A6000', status: 'online' },
  { id: 2, name: 'client-02', gpu: 'GPU: NVIDIA H100 4T', status: 'online' },
  { id: 3, name: 'client-03', gpu: 'GPU: NVIDIA H100 80GB', status: 'online' },
  { id: 4, name: 'client-04', gpu: 'GPU: NVIDIA RTX 3090', status: 'offline' }
])

const currentJob = ref({
  progress: 70,
  currentRound: 7,
  totalRounds: 10
})

const logs = ref([
  '[2023-06-15 14:32:10] INFO: 开始联邦学习第7轮训练',
  '[2023-06-15 14:32:12] INFO: 成功连接8个客户端',
  '[2023-06-15 14:32:15] INFO: 客户端client-01开始训练',
  '[2023-06-15 14:32:17] INFO: 客户端client-02开始训练',
  '[2023-06-15 14:32:20] INFO: 客户端client-03开始训练',
  '[2023-06-15 14:33:45] INFO: 客户端client-01完成训练 - 损失值: 0.245',
  '[2023-06-15 14:33:52] INFO: 客户端client-02完成训练 - 损失值: 0.261',
  '[2023-06-15 14:34:10] INFO: 客户端client-03完成训练 - 损失值: 0.238',
  '[2023-06-15 14:34:15] INFO: 使用FedAvg算法聚合模型更新',
  '[2023-06-15 14:34:22] INFO: 聚合成功完成',
  '[2023-06-15 14:34:25] INFO: 第7轮准确率: 89.4%',
  '[2023-06-15 14:34:28] INFO: 模型已保存至/models/fl-job-8721/round-7.pt',
  '[2023-06-15 14:34:30] INFO: 开始准备第8轮训练'
])

const autoScroll = ref(true)
const logViewer = ref(null)
const accuracyChart = ref(null)
const lossChart = ref(null)

// 计算进度环的周长和偏移
const circumference = 2 * Math.PI * 40
const progressOffset = computed(() => {
  return circumference - (currentJob.value.progress / 100) * circumference
})

// 刷新数据
const refreshData = () => {
  loadDashboardData()
}

// 加载仪表盘数据
const loadDashboardData = () => {
  getDashboardStats().then((res) => {
    if (res.code === 200) {
      stats.value = res.data
    }
  })
}

// 初始化图表
const initCharts = () => {
  if (!accuracyChart.value || !lossChart.value) return

  // 准确率图表
  const accuracyChartInstance = echarts.init(accuracyChart.value)
  const accuracyOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#0B1E39',
      borderColor: '#76B900',
      borderWidth: 1,
      textStyle: { color: '#E2E8F0' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['轮次 1', '轮次 2', '轮次 3', '轮次 4', '轮次 5', '轮次 6', '轮次 7'],
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94A3B8' }
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94A3B8', formatter: '{value}%' },
      splitLine: { lineStyle: { color: '#1E293B' } }
    },
    series: [
      {
        name: '准确率',
        type: 'line',
        data: [72.3, 78.5, 82.1, 84.7, 86.3, 88.2, 89.4],
        smooth: true,
        lineStyle: { width: 3, color: '#76B900' },
        itemStyle: {
          color: '#76B900',
          borderColor: '#0F172A',
          borderWidth: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(118, 185, 0, 0.3)' },
            { offset: 1, color: 'rgba(118, 185, 0, 0)' }
          ])
        }
      }
    ]
  }
  accuracyChartInstance.setOption(accuracyOption)

  // 损失图表
  const lossChartInstance = echarts.init(lossChart.value)
  const lossOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#0B1E39',
      borderColor: '#3B82F6',
      borderWidth: 1,
      textStyle: { color: '#E2E8F0' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5', 'Round 6', 'Round 7'],
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94A3B8' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94A3B8' },
      splitLine: { lineStyle: { color: '#1E293B' } }
    },
    series: [
      {
        name: 'Loss',
        type: 'line',
        data: [0.642, 0.521, 0.438, 0.385, 0.327, 0.276, 0.245],
        smooth: true,
        lineStyle: { width: 3, color: '#3B82F6' },
        itemStyle: {
          color: '#3B82F6',
          borderColor: '#0F172A',
          borderWidth: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0)' }
          ])
        }
      }
    ]
  }
  lossChartInstance.setOption(lossOption)

  // 响应式
  window.addEventListener('resize', () => {
    accuracyChartInstance.resize()
    lossChartInstance.resize()
  })
}

// 自动滚动日志
watch(
  () => logs.value.length,
  () => {
    if (autoScroll.value && logViewer.value) {
      nextTick(() => {
        logViewer.value.scrollTop = logViewer.value.scrollHeight
      })
    }
  }
)

// 生命周期
onMounted(() => {
  loadDashboardData()
  initCharts()

  // 模拟日志更新
  const logInterval = setInterval(() => {
    const newLogs = [
      '[2023-06-15 14:34:35] INFO: 验证第8轮客户端连接',
      '[2023-06-15 14:34:40] INFO: 客户端client-05已连接',
      '[2023-06-15 14:34:45] INFO: 客户端client-06已连接',
      '[2023-06-15 14:34:50] INFO: 8个客户端准备好第8轮训练'
    ]
    if (logs.value.length < 20) {
      logs.value.push(newLogs[Math.floor(Math.random() * newLogs.length)])
    }
  }, 5000)

  return () => {
    clearInterval(logInterval)
  }
})
</script>

<style scoped>
.log-viewer {
  @apply bg-dark-light text-sm p-3 rounded-lg text-gray-300 font-mono;
}

.log-line {
  @apply mb-1;
}

.progress-ring-circle {
  transition: stroke-dashoffset 0.35s;
}

.status-indicator {
  @apply w-2 h-2 rounded-full inline-block mr-2;
}

.status-online {
  @apply bg-accent;
}
</style>