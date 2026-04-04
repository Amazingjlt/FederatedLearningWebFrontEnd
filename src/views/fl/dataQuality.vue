<template>
  <div class="p-4 min-h-screen">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-[clamp(1.5rem,3vw,2rem)] font-bold text-white flex items-center">
        <i class="fas fa-chart-line text-accent mr-3"></i>
        <span>数据质量分析</span>
      </h1>
      <p class="text-gray-400 mt-1">
        联邦学习节点数据质量的3D热力图可视化与分析
      </p>
    </div>

    <!-- 顶部摘要卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- 总样本数卡片 -->
      <div
        class="bg-secondary rounded-lg p-4 border border-gray-700 hover:border-accent transition-all duration-300 hover:shadow-glow"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-400 text-sm">总样本数</p>
            <h3 class="text-2xl font-bold mt-1 text-white text-shadow-glow">
              {{ formatNumber(stats.totalSamples) }}
            </h3>
            <p class="text-accent text-xs mt-2 flex items-center">
              <i class="fas fa-arrow-up mr-1"></i>4.2%
              <span class="text-gray-400 ml-1">较上月</span>
            </p>
          </div>
          <div class="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
            <i class="fas fa-database"></i>
          </div>
        </div>
      </div>
      <!-- 缺失率卡片 -->
      <div
        class="bg-secondary rounded-lg p-4 border border-gray-700 hover:border-warning transition-all duration-300 hover:shadow-glow-warning"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-400 text-sm">缺失率</p>
            <h3 class="text-2xl font-bold mt-1 text-white text-shadow-glow-warning">
              {{ stats.missingRate }}%
            </h3>
            <p class="text-warning text-xs mt-2 flex items-center">
              <i class="fas fa-arrow-down mr-1"></i>1.5%
              <span class="text-gray-400 ml-1">较上月</span>
            </p>
          </div>
          <div class="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center text-warning">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
        </div>
      </div>
      <!-- 不平衡度卡片 -->
      <div
        class="bg-secondary rounded-lg p-4 border border-gray-700 hover:border-info transition-all duration-300 hover:shadow-glow-blue"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-400 text-sm">不平衡度</p>
            <h3 class="text-2xl font-bold mt-1 text-white text-shadow-glow-blue">
              {{ stats.imbalanceScore }}
            </h3>
            <p class="text-info text-xs mt-2 flex items-center">
              <i class="fas fa-minus mr-1"></i>
              <span class="text-gray-400 ml-1">较上月</span>
              0.12
            </p>
          </div>
          <div class="w-10 h-10 rounded-full bg-info/20 flex items-center justify-center text-info">
            <i class="fas fa-balance-scale"></i>
          </div>
        </div>
      </div>
      <!-- 噪声水平卡片 -->
      <div
        class="bg-secondary rounded-lg p-4 border border-gray-700 hover:border-danger transition-all duration-300 hover:shadow-glow-danger"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-400 text-sm">噪声水平</p>
            <h3 class="text-2xl font-bold mt-1 text-white text-shadow-glow-danger">
              {{ stats.noiseLevel }}%
            </h3>
            <p class="text-danger text-xs mt-2 flex items-center">
              <i class="fas fa-arrow-up mr-1"></i>
              <span class="text-gray-400 ml-1">较上月</span>
              0.8%
            </p>
          </div>
          <div class="w-10 h-10 rounded-full bg-danger/20 flex items-center justify-center text-danger">
            <i class="fas fa-wave-square"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- 左侧控制面板 -->
      <div class="lg:col-span-3 space-y-6">
        <!-- 控制面板标题 -->
        <div class="bg-secondary rounded-lg p-4 border border-gray-700">
          <h2 class="font-bold text-white flex items-center">
            <i class="fas fa-sliders-h text-accent mr-2"></i>
            控制面板
          </h2>
        </div>

        <!-- 时间窗口选择 -->
        <div class="bg-secondary rounded-lg p-4 border border-gray-700">
          <h3 class="font-medium text-white mb-3">时间窗口</h3>
          <div class="space-y-3">
            <div v-for="option in timeOptions" :key="option.value" class="flex items-center">
              <input
                type="radio"
                :id="option.value"
                :value="option.value"
                v-model="selectedTimeWindow"
                class="text-accent focus:ring-accent"
              />
              <label :for="option.value" class="ml-2 text-sm cursor-pointer">{{ option.label }}</label>
            </div>
            <div v-if="selectedTimeWindow === 'custom'" id="custom-date-range" class="mt-3 grid grid-cols-2 gap-2">
              <input type="date" v-model="customStartDate" class="bg-primary border border-gray-700 rounded text-sm p-2 text-gray-200 w-full" />
              <input type="date" v-model="customEndDate" class="bg-primary border border-gray-700 rounded text-sm p-2 text-gray-200 w-full" />
            </div>
          </div>
        </div>

        <!-- 参数范围过滤器 -->
        <div class="bg-secondary rounded-lg p-4 border border-gray-700">
          <h3 class="font-medium text-white mb-3">参数范围</h3>
          <!-- 质量分数范围 -->
          <div class="mb-4">
            <div class="flex justify-between mb-2">
              <label class="text-sm text-gray-300">质量分数</label>
              <span class="text-xs text-accent">0 - {{ qualityRange }}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              v-model.number="qualityRange"
              class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>
          <!-- 缺失率范围 -->
          <div class="mb-4">
            <div class="flex justify-between mb-2">
              <label class="text-sm text-gray-300">缺失率</label>
              <span class="text-xs text-warning">0 - {{ missingRange }}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              v-model.number="missingRange"
              class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-warning"
            />
          </div>
          <!-- 噪声水平范围 -->
          <div class="mb-4">
            <div class="flex justify-between mb-2">
              <label class="text-sm text-gray-300">噪声水平</label>
              <span class="text-xs text-danger">0 - {{ noiseRange }}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              v-model.number="noiseRange"
              class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-danger"
            />
          </div>
          <!-- 应用过滤器按钮 -->
          <button
            class="w-full bg-accent hover:bg-accent/90 text-white py-2 rounded-lg transition-colors duration-300 font-medium text-sm flex items-center justify-center"
            @click="applyFilters"
          >
            <i class="fas fa-filter mr-2"></i>
            应用过滤器
          </button>
        </div>

        <!-- 数据分布统计 -->
        <div class="bg-secondary rounded-lg p-4 border border-gray-700">
          <h3 class="font-medium text-white mb-3">数据分布</h3>
          <div class="h-64" ref="distributionChartRef"></div>
        </div>
      </div>

      <!-- 中间3D热力图 -->
      <div class="lg:col-span-5 space-y-6">
        <!-- 3D热力图容器 -->
        <div class="bg-secondary rounded-lg border border-gray-700 overflow-hidden h-[500px]">
          <div class="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 class="font-bold text-white flex items-center">
              <i class="fas fa-fire-alt text-accent mr-2"></i>
              节点的质量数据3D热力图
            </h2>
            <div class="flex space-x-2">
              <button class="bg-primary hover:bg-primary/80 text-sm p-1.5 rounded border border-gray-700 transition-colors duration-300" title="旋转视图" @click="toggleAutoRotate">
                <i class="fas fa-sync-alt"></i>
              </button>
              <button class="bg-primary hover:bg-primary/80 text-sm p-1.5 rounded border border-gray-700 transition-colors duration-300" title="重置视图" @click="resetView">
                <i class="fas fa-redo"></i>
              </button>
              <button class="bg-primary hover:bg-primary/80 text-sm p-1.5 rounded border border-gray-700 transition-colors duration-300" title="全屏查看" @click="toggleFullscreen">
                <i class="fas fa-expand"></i>
              </button>
            </div>
          </div>
          <div class="p-4 h-[calc(100%-60px)]">
            <div
              id="heatmap-3d"
              class="w-full h-full bg-dark bg-grid relative overflow-hidden"
              ref="heatmap3dRef"
            >
              <!-- 网格背景增强 -->
              <div class="absolute inset-0 bg-[radial-gradient(rgba(118,185,0,0.15)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
            </div>
          </div>
        </div>

        <!-- 节点详情卡片 -->
        <div class="bg-secondary rounded-lg p-4 border border-gray-700" id="node-details-card">
          <h3 class="font-medium text-white mb-3 flex items-center">
            <i class="fas fa-info-circle text-info mr-2"></i>
            节点详情
          </h3>
          <div v-if="!selectedNode" class="text-center py-8 text-gray-400">
            <i class="fas fa-hand-pointer text-3xl mb-2"></i>
            <p>在3D热力图上选择一个节点以查看详情</p>
          </div>
          <div v-else id="node-details-content">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-sm text-gray-400">Node ID</p>
                <p class="font-medium text-white">{{ selectedNode.nodeId }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-400">Quality Score</p>
                <p class="font-medium text-white">{{ selectedNode.quality }}%</p>
              </div>
              <div>
                <p class="text-sm text-gray-400">Sample Count</p>
                <p class="font-medium text-white">{{ formatNumber(selectedNode.samples) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-400">Missing Rate</p>
                <p class="font-medium text-white">{{ selectedNode.missingRate }}%</p>
              </div>
            </div>
            <div class="mt-4">
              <h4 class="text-sm font-medium text-white mb-2">Quality Metrics</h4>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div class="bg-primary/50 p-2 rounded">
                  <p class="text-gray-400">Noise Level</p>
                  <p class="font-medium text-white">{{ selectedNode.noiseLevel }}%</p>
                </div>
                <div class="bg-primary/50 p-2 rounded">
                  <p class="text-gray-400">Category</p>
                  <p
                    class="font-medium"
                    :class="{
                      'text-accent': selectedNode.category === 'high',
                      'text-warning': selectedNode.category === 'medium',
                      'text-danger': selectedNode.category === 'low'
                    }"
                  >
                    {{ getCategoryText(selectedNode.category) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧警告和缺陷面板 -->
      <div class="lg:col-span-4 space-y-6">
        <!-- 警告和缺陷面板标题 -->
        <div class="bg-secondary rounded-lg p-4 border border-gray-700">
          <h2 class="font-bold text-white flex items-center">
            <i class="fas fa-exclamation-circle text-warning mr-2"></i>
            数据质量警告
          </h2>
        </div>

        <!-- 警告统计 -->
        <div class="bg-secondary rounded-lg p-4 border border-gray-700">
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="p-3 bg-danger/20 rounded-lg border border-danger/30">
              <p class="text-danger font-bold text-xl">{{ stats.criticalWarnings }}</p>
              <p class="text-xs text-gray-300 mt-1">严重</p>
            </div>
            <div class="p-3 bg-warning/20 rounded-lg border border-warning/30">
              <p class="text-warning font-bold text-xl">{{ stats.warnings }}</p>
              <p class="text-xs text-gray-300 mt-1">警告</p>
            </div>
            <div class="p-3 bg-info/20 rounded-lg border border-info/30">
              <p class="text-info font-bold text-xl">{{ stats.infoAlerts }}</p>
              <p class="text-xs text-gray-300 mt-1">信息</p>
            </div>
          </div>
        </div>

        <!-- 警告列表 -->
        <div class="bg-secondary rounded-lg border border-gray-700 overflow-hidden">
          <div class="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 class="font-medium text-white">最近警告</h3>
            <select
              v-model="selectedAlertType"
              class="bg-primary border border-gray-700 text-sm rounded p-1 text-gray-200"
              @change="filterWarnings"
            >
              <option value="">所有类型</option>
              <option value="critical">严重</option>
              <option value="warning">警告</option>
              <option value="info">信息</option>
            </select>
          </div>
          <div class="max-h-[400px] overflow-y-auto scrollbar-thin">
            <div class="divide-y divide-gray-700">
              <div
                v-for="warning in filteredWarnings"
                :key="warning.id"
                class="p-4 hover:bg-primary/50 transition-colors duration-200"
              >
                <div class="flex items-start">
                  <!-- 小圆点 - 使用更明显的样式 -->
                  <div class="flex-shrink-0 mr-3" style="min-width: 16px;">
                    <div 
                      class="w-3 h-3 rounded-full shadow-lg mt-1"
                      :style="{
                        backgroundColor: warning.type === 'critical' ? '#EF5350' : 
                                      warning.type === 'warning' ? '#FFB74D' : 
                                      warning.type === 'info' ? '#4FC3F7' : '#9CA3AF'
                      }"
                    ></div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-center">
                      <h4 class="font-medium text-white truncate">{{ warning.title }}</h4>
                      <span class="text-xs text-gray-400 ml-2 flex-shrink-0">{{ warning.timestamp }}</span>
                    </div>
                    <p class="text-sm text-gray-300 mt-1">{{ warning.message }}</p>
                    <div class="mt-2 flex justify-end">
                      <button
                        class="text-xs px-2 py-1 rounded hover:bg-primary/30 transition-colors"
                        :style="{
                          color: warning.type === 'critical' ? '#EF5350' : 
                                 warning.type === 'warning' ? '#FFB74D' : 
                                 warning.type === 'info' ? '#4FC3F7' : '#9CA3AF'
                        }"
                        @click="viewWarningDetail(warning)"
                      >
                        查看详情 <i class="fas fa-chevron-right ml-1" style="font-size: 8px;"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="filteredWarnings.length === 0" class="p-8 text-center text-gray-400">
                <i class="fas fa-bell-slash text-3xl mb-2 opacity-50"></i>
                <p>暂无{{ selectedAlertType ? getAlertTypeText(selectedAlertType) : '' }}警告</p>
              </div>
            </div>
          </div>
          <div class="p-3 border-t border-gray-700 text-center">
            <button class="text-sm text-accent hover:text-accent/80" @click="loadMoreWarnings">
              加载更多
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部生成报告按钮 -->
    <div class="mt-6 flex justify-end">
      <button
        class="bg-accent hover:bg-accent/90 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 flex items-center shadow-glow"
        @click="generateReport"
      >
        <i class="fas fa-file-export mr-2"></i>
        生成报告
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import 'echarts-gl'
import {
  getDataQualityStats,
  getNodeQualityData,
  getDataDistribution,
  getWarningList,
  generateQualityReport
} from '@/api/dataQuality'

// 统计数据
const stats = ref({
  totalSamples: 0,
  missingRate: 0,
  imbalanceScore: 0,
  noiseLevel: 0,
  criticalWarnings: 0,
  warnings: 0,
  infoAlerts: 0
})

// 节点数据
const nodes = ref([])
const selectedNode = ref(null)

// 警告列表
const warnings = ref([])
const filteredWarnings = ref([])
const selectedAlertType = ref('')
const warningPage = ref(1)
const warningTotal = ref(0)
const loadingWarnings = ref(false)

// 过滤条件
const selectedTimeWindow = ref('today')
const customStartDate = ref('')
const customEndDate = ref('')
const qualityRange = ref(100)
const missingRange = ref(20)
const noiseRange = ref(10)

// 图表实例
let heatmap3dChart = null
let distributionChart = null

// 视图控制
const autoRotate = ref(true)

// 时间选项
const timeOptions = [
  { value: 'today', label: '今天' },
  { value: 'yesterday', label: '昨天' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'custom', label: '自定义' }
]

// 辅助函数
const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num)
}

const getCategoryText = (category) => {
  const map = {
    'high': '高质量',
    'medium': '中等质量',
    'low': '低质量'
  }
  return map[category] || category
}

const getAlertTypeText = (type) => {
  const map = {
    'critical': '严重',
    'warning': '警告',
    'info': '信息'
  }
  return map[type] || type
}

// 获取数据质量统计
const fetchStats = async () => {
  try {
    const res = await getDataQualityStats()
    if (res.code === 200) {
      stats.value = res.data
    }
  } catch (error) {
    console.error('获取数据质量统计失败', error)
  }
}

// 获取节点数据
const fetchNodes = async () => {
  try {
    const res = await getNodeQualityData()
    if (res.code === 200) {
      nodes.value = res.data
      await nextTick()
      init3DHeatmap()
    }
  } catch (error) {
    console.error('获取节点数据失败', error)
  }
}

// 获取数据分布
const fetchDistribution = async () => {
  try {
    const res = await getDataDistribution()
    if (res.code === 200) {
      await nextTick()
      initDistributionChart(res.data)
    }
  } catch (error) {
    console.error('获取数据分布失败', error)
  }
}

// 获取警告列表
const fetchWarnings = async (loadMore = false) => {
  if (loadingWarnings.value) return

  loadingWarnings.value = true
  try {
    const page = loadMore ? warningPage.value + 1 : 1
    const res = await getWarningList(page, 10, { type: selectedAlertType.value })

    if (res.code === 200) {
      if (loadMore) {
        warnings.value = [...warnings.value, ...res.data.records]
      } else {
        warnings.value = res.data.records
      }
      warningPage.value = page
      warningTotal.value = res.data.total
      filterWarnings()
    }
  } catch (error) {
    console.error('获取警告列表失败', error)
  } finally {
    loadingWarnings.value = false
  }
}

// 过滤警告
const filterWarnings = () => {
  if (selectedAlertType.value) {
    filteredWarnings.value = warnings.value.filter(w => w.type === selectedAlertType.value)
  } else {
    filteredWarnings.value = warnings.value
  }
}

// 加载更多警告
const loadMoreWarnings = () => {
  if (warnings.value.length < warningTotal.value) {
    fetchWarnings(true)
  }
}

// 查看警告详情
const viewWarningDetail = (warning) => {
  const node = nodes.value.find(n => n.nodeId === warning.nodeId)
  if (node) {
    selectedNode.value = node
  }
}

// 应用过滤器
const applyFilters = () => {
  // 实际项目中这里应该调用API并传递过滤参数
  fetchNodes()
}

// 初始化3D热力图
const init3DHeatmap = () => {
  const dom = document.getElementById('heatmap-3d')
  if (!dom || nodes.value.length === 0) return

  if (heatmap3dChart) heatmap3dChart.dispose()
  heatmap3dChart = echarts.init(dom)

  const data = nodes.value.map(node => ({
    name: node.name || node.nodeId,
    value: [
      Number(node.x) || 0,
      Number(node.y) || 0,
      Number(node.z) || 0,
      Number(node.quality) || 0,
      Number(node.samples) || 0,
      Number(node.missingRate) || 0,
      Number(node.noiseLevel) || 0
    ],
    itemStyle: {
      color: node.category === 'high' ? '#76B900' : 
             node.category === 'medium' ? '#FFB74D' : '#EF5350'
    }
  }))

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      formatter: (params) => {
        const data = params.data
        return `<div style="background: rgba(15, 23, 42, 0.9); border: 1px solid #76B900; border-radius: 6px; padding: 8px; min-width: 200px;">
          <div style="font-weight: bold; color: #fff; margin-bottom: 5px;">节点 ${data.name}</div>
          <div style="color: #ccc; font-size: 12px;">
            <div>质量分数: <span style="color: ${data.itemStyle.color};">${data.value[3]}%</span></div>
            <div>样本数量: ${formatNumber(data.value[4])}</div>
            <div>缺失率: ${data.value[5]}%</div>
            <div>噪声水平: ${data.value[6]}%</div>
          </div>
        </div>`
      }
    },
    legend: {
      show: true,
      data: ['高质量', '中等质量', '低质量'],
      bottom: 10,
      textStyle: { color: '#ccc' },
      itemWidth: 12,
      itemHeight: 12
    },
    grid3D: {
      boxWidth: 200,
      boxHeight: 100,
      boxDepth: 200,
      axisPointer: { show: false },
      axisLine: { lineStyle: { color: '#555' } },
      axisLabel: { textStyle: { color: '#ccc' } },
      splitLine: { lineStyle: { color: '#333' } },
      viewControl: {
        autoRotate: autoRotate.value,
        autoRotateSpeed: 5,
        distance: 300,
        center: [50, 50, 50],
        alpha: 20,
        beta: 30
      },
      light: {
        main: { intensity: 1.2, shadow: true },
        ambient: { intensity: 0.3 }
      }
    },
    xAxis3D: {
      name: 'X轴',
      nameTextStyle: { color: '#ccc' },
      axisLine: { lineStyle: { color: '#555' } }
    },
    yAxis3D: {
      name: 'Y轴',
      nameTextStyle: { color: '#ccc' },
      axisLine: { lineStyle: { color: '#555' } }
    },
    zAxis3D: {
      name: 'Z轴',
      nameTextStyle: { color: '#ccc' },
      axisLine: { lineStyle: { color: '#555' } }
    },
    series: [
      {
        type: 'scatter3D',
        data: data,
        symbol: 'circle',
        symbolSize: 16,
        itemStyle: {
          opacity: 0.8,
          borderWidth: 1,
          borderColor: '#fff'
        },
        emphasis: {
          itemStyle: {
            borderColor: '#76B900',
            borderWidth: 2,
            shadowBlur: 10,
            shadowColor: '#76B900'
          },
          label: {
            show: true,
            formatter: (params) => params.data.name,
            position: 'top',
            textStyle: { 
              color: '#fff', 
              fontSize: 12, 
              backgroundColor: 'rgba(15,23,42,0.8)',
              padding: [4, 8],
              borderRadius: 4
            }
          }
        },
        label: { show: false }
      }
    ]
  }

  heatmap3dChart.setOption(option)

  heatmap3dChart.on('click', (params) => {
    if (params.data) {
      selectedNode.value = nodes.value.find(n => 
        n.name === params.data.name || n.nodeId === params.data.name
      )
    }
  })
}

// 初始化分布图表
const initDistributionChart = (data) => {
  const dom = document.getElementById('distribution-chart')
  if (!dom) return

  if (distributionChart) distributionChart.dispose()
  distributionChart = echarts.init(dom)

  const option = {
    backgroundColor: 'transparent',
    color: ['#76B900', '#FFB74D', '#EF5350'],
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 10,
      textStyle: { color: '#ccc', fontSize: 10 },
      data: ['高质量', '中等质量', '低质量']
    },
    series: [
      {
        name: '节点质量分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#0F172A',
          borderWidth: 2
        },
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: 'bold',
            color: '#fff'
          }
        },
        labelLine: { show: false },
        data: [
          { value: data.highQuality, name: '高质量' },
          { value: data.mediumQuality, name: '中等质量' },
          { value: data.lowQuality, name: '低质量' }
        ]
      }
    ]
  }

  distributionChart.setOption(option)
}

// 切换自动旋转
const toggleAutoRotate = () => {
  autoRotate.value = !autoRotate.value
  if (heatmap3dChart) {
    heatmap3dChart.setOption({
      grid3D: {
        viewControl: { autoRotate: autoRotate.value }
      }
    })
  }
}

// 重置视图
const resetView = () => {
  if (heatmap3dChart) {
    heatmap3dChart.setOption({
      grid3D: {
        viewControl: {
          alpha: 20,
          beta: 30,
          distance: 300,
          center: [50, 50, 50]
        }
      }
    })
  }
}

// 全屏切换
const toggleFullscreen = () => {
  const element = document.getElementById('heatmap-3d')
  if (!element) return

  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    element.requestFullscreen()
  }
}

// 生成报告
const generateReport = async () => {
  try {
    const params = {
      timeWindow: selectedTimeWindow.value,
      startDate: customStartDate.value,
      endDate: customEndDate.value,
      qualityThreshold: qualityRange.value,
      missingThreshold: missingRange.value,
      noiseThreshold: noiseRange.value
    }
    
    const res = await generateQualityReport(params)
    
    // 下载文件
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `数据质量报告_${new Date().toISOString().split('T')[0]}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    console.error('生成报告失败', error)
    alert('生成报告失败，请稍后重试')
  }
}

// 监听窗口大小变化
const handleResize = () => {
  heatmap3dChart?.resize()
  distributionChart?.resize()
}

// 初始化
onMounted(async () => {
  await fetchStats()
  await fetchNodes()
  await fetchDistribution()
  await fetchWarnings()

  window.addEventListener('resize', handleResize)
})

// 清理
onUnmounted(() => {
  if (heatmap3dChart) heatmap3dChart.dispose()
  if (distributionChart) distributionChart.dispose()
  window.removeEventListener('resize', handleResize)
})

// 监听类型选择变化
watch(selectedAlertType, () => {
  filterWarnings()
})

// 监听自定义时间窗口
watch(selectedTimeWindow, (newVal) => {
  if (newVal === 'custom') {
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    customStartDate.value = sevenDaysAgo.toISOString().split('T')[0]
    customEndDate.value = today.toISOString().split('T')[0]
  }
})
</script>

<style scoped>
.text-shadow-glow {
  text-shadow: 0 0 8px rgba(118, 185, 0, 0.7);
}
.text-shadow-glow-warning {
  text-shadow: 0 0 8px rgba(255, 183, 77, 0.7);
}
.text-shadow-glow-blue {
  text-shadow: 0 0 8px rgba(79, 195, 247, 0.7);
}
.text-shadow-glow-danger {
  text-shadow: 0 0 8px rgba(239, 83, 80, 0.7);
}
.bg-grid {
  background-image: radial-gradient(rgba(118, 185, 0, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}
.scrollbar-thin {
  scrollbar-width: thin;
}
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: #1E293B;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #76B900;
  border-radius: 2px;
}
</style>