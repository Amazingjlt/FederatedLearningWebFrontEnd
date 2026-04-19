<template>
  <div class="p-4">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">作业管理</h1>
        <p class="text-gray-400 mt-1">创建、监控和管理您的联邦学习作业</p>
      </div>
      <button
        @click="showNewJobModal = true"
        class="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-200 shadow-lg shadow-accent/20"
      >
        <i class="fas fa-plus"></i>
        <span>新建作业</span>
      </button>
    </div>

    <!-- Job Table Section -->
    <div class="bg-secondary rounded-lg shadow-xl overflow-hidden mb-6" v-show="!showJobDetail">
      <div class="p-4 border-b border-gray-700">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 class="text-lg font-semibold">活跃作业</h2>
          <div class="flex items-center gap-3">
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="搜索作业..."
                class="bg-primary border border-gray-600 rounded-md py-2 pl-10 pr-4 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <select
              v-model="statusFilter"
              class="bg-primary border border-gray-600 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              <option value="">所有状态</option>
              <option value="running">运行中</option>
              <option value="completed">已完成</option>
              <option value="failed">失败</option>
              <option value="pending">待处理</option>
            </select>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-primary/50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                作业ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                名称
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                状态
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                类型
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                轮次
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                创建时间
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-secondary divide-y divide-gray-700">
            <tr
              v-for="job in filteredJobs"
              :key="job.id"
              class="hover:bg-primary/30 transition-colors duration-200 cursor-pointer"
              @click="viewJobDetail(job)"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {{ job.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <i :class="getJobIcon(job.type)"></i>
                  <span>{{ job.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span :class="['status-indicator', getStatusClass(job.status)]"></span>
                  <span :class="['text-sm font-medium', getStatusTextClass(job.status)]">
                    {{ getStatusText(job.status) }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ job.algorithm }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <div class="w-16 bg-primary rounded-full h-2">
                    <div
                      class="bg-accent h-2 rounded-full"
                      :style="{ width: (job.currentRound / job.totalRounds) * 100 + '%' }"
                    ></div>
                  </div>
                  <span class="text-sm">{{ job.currentRound }}/{{ job.totalRounds }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {{ job.createdAt }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end gap-2">
                  <button
                    @click.stop="viewJobDetail(job)"
                    class="text-accent hover:text-accent/80"
                    title="查看详情"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button
                    v-if="job.status === 'running'"
                    @click.stop="abortJob(job.id)"
                    class="text-red-500 hover:text-red-400"
                    title="中止作业"
                  >
                    <i class="fas fa-stop"></i>
                  </button>
                  <button class="text-gray-400 hover:text-gray-300" title="下载日志">
                    <i class="fas fa-download"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-6 py-4 border-t border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="text-sm text-gray-400">
          显示 <span class="text-white font-medium">{{ filteredJobs.length }}</span> 共
          <span class="text-white font-medium">{{ totalJobs }}</span> 个作业
        </div>
        <div class="flex items-center gap-2">
          <button
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="px-3 py-1 rounded border border-gray-600 bg-primary text-gray-400 hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-1 rounded border',
              currentPage === page
                ? 'border-accent bg-accent text-white'
                : 'border-gray-600 bg-primary text-gray-300 hover:bg-primary/80'
            ]"
          >
            {{ page }}
          </button>
          <button
            :disabled="currentPage === totalPages"
            @click="currentPage++"
            class="px-3 py-1 rounded border border-gray-600 bg-primary text-gray-300 hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Job Detail Section -->
    <div v-if="showJobDetail" class="bg-secondary rounded-lg shadow-xl overflow-hidden">
      <div class="p-4 border-b border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center gap-3">
          <button
            @click="showJobDetail = false"
            class="text-gray-400 hover:text-gray-300 p-2 rounded-full hover:bg-primary transition-colors duration-200"
          >
            <i class="fas fa-arrow-left"></i>
          </button>
          <div>
            <h2 class="text-xl font-bold">{{ selectedJob.name }}</h2>
            <div class="flex items-center gap-4 mt-1">
              <span class="text-sm bg-primary/50 px-3 py-1 rounded-full">
                ID: {{ selectedJob.id }}
              </span>
              <div class="flex items-center">
                <span :class="['status-indicator', getStatusClass(selectedJob.status)]"></span>
                <span :class="['text-sm font-medium', getStatusTextClass(selectedJob.status)]">
                  {{ getStatusText(selectedJob.status) }}
                </span>
              </div>
              <span class="text-sm text-gray-400">
                开始时间: {{ selectedJob.createdAt }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex gap-3">
          <button
            v-if="selectedJob.status === 'running'"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-200"
          >
            <i class="fas fa-stop"></i>
            <span>中止作业</span>
          </button>
          <button class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-200">
            <i class="fas fa-download"></i>
            <span>日志</span>
          </button>
        </div>
      </div>

      <div class="p-6">
        <!-- Job Progress Overview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-primary rounded-xl p-6 flex flex-col items-center justify-center">
            <div class="relative w-40 h-40 mb-4">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#1E293B"
                  stroke-width="8"
                ></circle>
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#76B900"
                  stroke-width="8"
                  :stroke-dasharray="283"
                  :stroke-dashoffset="283 - (selectedJob.currentRound / selectedJob.totalRounds) * 283"
                ></circle>
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-3xl font-bold text-white">
                  {{ Math.round((selectedJob.currentRound / selectedJob.totalRounds) * 100) }}%
                </span>
                <span class="text-sm text-gray-400">已完成</span>
              </div>
            </div>
            <div class="text-center">
              <h3 class="text-lg font-semibold mb-1">训练进度</h3>
              <p class="text-sm text-gray-400">
                已完成{{ selectedJob.totalRounds }}轮中的{{ selectedJob.currentRound }}轮
              </p>
            </div>
          </div>

          <div class="bg-primary rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
              <i class="fas fa-cogs text-accent"></i>
              配置
            </h3>
            <ul class="space-y-3">
              <li class="flex justify-between">
                <span class="text-gray-400 text-sm">聚合算法</span>
                <span class="text-sm font-medium">{{ selectedJob.algorithm }}</span>
              </li>
              <li class="flex justify-between">
                <span class="text-gray-400 text-sm">客户端</span>
                <span class="text-sm font-medium">8</span>
              </li>
              <li class="flex justify-between">
                <span class="text-gray-400 text-sm">批次大小</span>
                <span class="text-sm font-medium">32</span>
              </li>
              <li class="flex justify-between">
                <span class="text-gray-400 text-sm">学习率</span>
                <span class="text-sm font-medium">0.001</span>
              </li>
              <li class="flex justify-between">
                <span class="text-gray-400 text-sm">安全通信</span>
                <span class="text-sm font-medium text-accent">已启用</span>
              </li>
            </ul>
          </div>

          <div class="bg-primary rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
              <i class="fas fa-desktop text-accent"></i>
              客户端状态
            </h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="status-indicator status-online"></span>
                  <span class="text-sm">Client-01</span>
                </div>
                <span class="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded-full">
                  已同步
                </span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="status-indicator status-online"></span>
                  <span class="text-sm">Client-02</span>
                </div>
                <span class="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded-full">
                  已同步
                </span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="status-indicator status-online"></span>
                  <span class="text-sm">Client-03</span>
                </div>
                <span class="text-xs bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded-full">
                  训练中
                </span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="status-indicator status-offline"></span>
                  <span class="text-sm">Client-04</span>
                </div>
                <span class="text-xs bg-red-900/30 text-red-400 px-2 py-1 rounded-full">
                  已断开
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="border-b border-gray-700 mb-6">
          <div class="flex">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-3 px-6 border-b-2 font-medium',
                activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Metrics Content -->
        <div v-show="activeTab === 'metrics'">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-primary rounded-xl p-6">
              <h3 class="text-lg font-semibold mb-4">模型准确率</h3>
              <div class="h-64" ref="accuracyChart"></div>
            </div>
            <div class="bg-primary rounded-xl p-6">
              <h3 class="text-lg font-semibold mb-4">训练损失</h3>
              <div class="h-64" ref="lossChart"></div>
            </div>
          </div>
        </div>

        <!-- Logs Content -->
        <div v-show="activeTab === 'logs'" class="bg-primary rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">训练日志</h3>
            <div class="flex gap-2">
              <button class="bg-secondary hover:bg-secondary/80 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1">
                <i class="fas fa-download"></i>
                <span>导出</span>
              </button>
              <button class="bg-secondary hover:bg-secondary/80 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1">
                <i class="fas fa-refresh"></i>
                <span>刷新</span>
              </button>
            </div>
          </div>
          <div class="bg-dark rounded-lg p-4 overflow-y-auto h-96 font-mono text-xs text-gray-300">
            <div class="space-y-1">
              <div v-for="(log, index) in jobLogs" :key="index" :class="getLogClass(log)">
                {{ log }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Job Modal -->
    <div
      v-if="showNewJobModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showNewJobModal = false"
    >
      <div class="bg-secondary rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="p-4 border-b border-gray-700 flex items-center justify-between">
          <h2 class="text-xl font-bold">创建新的联邦学习作业</h2>
          <button
            @click="showNewJobModal = false"
            class="text-gray-400 hover:text-gray-300 p-2 rounded-full hover:bg-primary transition-colors duration-200"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6">
          <form @submit.prevent="submitNewJob">
            <!-- Job Information -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">作业信息</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">作业名称 *</label>
                  <input
                    type="text"
                    v-model="newJob.name"
                    required
                    placeholder="输入作业名称"
                    class="w-full bg-primary border border-gray-600 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">描述</label>
                  <input
                    type="text"
                    v-model="newJob.description"
                    placeholder="输入作业描述"
                    class="w-full bg-primary border border-gray-600 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
              </div>
            </div>

            <!-- Training Parameters -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">训练参数</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">聚合算法 *</label>
                  <select
                    v-model="newJob.algorithm"
                    required
                    class="w-full bg-primary border border-gray-600 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    <option value="">选择算法</option>
                    <option value="FedAvg">FedAvg (联邦平均)</option>
                    <option value="FedProx">FedProx算法</option>
                    <option value="FedOpt">FedOpt算法</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">客户端数量 *</label>
                  <input
                    type="number"
                    v-model="newJob.numClients"
                    required
                    min="2"
                    max="20"
                    class="w-full bg-primary border border-gray-600 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">轮次数量 *</label>
                  <input
                    type="number"
                    v-model="newJob.numRounds"
                    required
                    min="1"
                    max="100"
                    class="w-full bg-primary border border-gray-600 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">批次大小 *</label>
                  <input
                    type="number"
                    v-model="newJob.batchSize"
                    required
                    min="1"
                    max="256"
                    class="w-full bg-primary border border-gray-600 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
              </div>
            </div>

            <!-- Security Options -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">安全选项</h3>
              <div class="bg-primary rounded-lg p-4">
                <div class="flex items-start gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="enableSSL"
                    v-model="newJob.enableSSL"
                    class="mt-1"
                  />
                  <div>
                    <label for="enableSSL" class="block text-sm font-medium text-gray-300 mb-1">
                      启用安全通信 (SSL/TLS)
                    </label>
                    <p class="text-xs text-gray-400">
                      使用TLS 1.3加密服务器与客户端之间的通信
                    </p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="enableSecureAgg"
                    v-model="newJob.enableSecureAgg"
                    class="mt-1"
                  />
                  <div>
                    <label for="enableSecureAgg" class="block text-sm font-medium text-gray-300 mb-1">
                      启用安全聚合
                    </label>
                    <p class="text-xs text-gray-400">
                      使用加密聚合保护模型更新，以保护隐私
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="p-4 border-t border-gray-700 flex justify-end gap-3">
          <button
            @click="showNewJobModal = false"
            class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-all duration-200"
          >
            取消
          </button>
          <button
            @click="submitNewJob"
            class="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-200 shadow-lg shadow-accent/20"
          >
            <i class="fas fa-paper-plane"></i>
            <span>提交作业</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import * as echarts from 'echarts'
import { getJobList, createJob } from '@/api/jobManagement'

// 状态管理
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalJobs = ref(24)
const showJobDetail = ref(false)
const showNewJobModal = ref(false)
const activeTab = ref('metrics')

// 作业列表
const jobs = ref([
  {
    id: 'FL-2023-001',
    name: '医学图像分割',
    status: 'running',
    type: 'medical',
    algorithm: 'FedAvg算法',
    currentRound: 6,
    totalRounds: 10,
    createdAt: '2023-06-15 09:30'
  },
  {
    id: 'FL-2023-002',
    name: '自然语言处理',
    status: 'completed',
    type: 'nlp',
    algorithm: 'FedProx算法',
    currentRound: 15,
    totalRounds: 15,
    createdAt: '2023-06-12 14:15'
  },
  {
    id: 'FL-2023-003',
    name: '金融时间序列',
    status: 'failed',
    type: 'finance',
    algorithm: 'FedOpt算法',
    currentRound: 3,
    totalRounds: 10,
    createdAt: '2023-06-10 16:45'
  },
  {
    id: 'FL-2023-004',
    name: '自动驾驶',
    status: 'pending',
    type: 'autonomous',
    algorithm: 'FedProx算法',
    currentRound: 0,
    totalRounds: 20,
    createdAt: '2023-06-15 14:20'
  }
])

const selectedJob = ref(null)

// 新作业表单
const newJob = ref({
  name: '',
  description: '',
  algorithm: '',
  numClients: 5,
  numRounds: 10,
  batchSize: 32,
  enableSSL: true,
  enableSecureAgg: false
})

// Tabs
const tabs = [
  { id: 'metrics', label: '指标' },
  { id: 'logs', label: '日志' },
  { id: 'details', label: '详情' }
]

// 日志数据
const jobLogs = ref([
  '[2023-06-15 09:30:01] INFO: 启动联邦学习作业: FL-2023-001',
  '[2023-06-15 09:30:05] INFO: 成功连接到8个客户端',
  '[2023-06-15 09:30:10] INFO: 初始化模型参数',
  '[2023-06-15 09:30:15] SUCCESS: 第1轮开始，共8个客户端参与',
  '[2023-06-15 09:35:22] INFO: Client-01 completed training - loss: 1.423, accuracy: 0.65',
  '[2023-06-15 09:36:18] INFO: Client-02 completed training - loss: 1.387, accuracy: 0.67',
  '[2023-06-15 09:42:35] INFO: Aggregating results using FedAvg algorithm',
  '[2023-06-15 09:43:12] SUCCESS: Round 1 completed - loss: 1.245, accuracy: 0.68',
  '[2023-06-15 10:42:10] ERROR: Client-08 disconnected during training',
  '[2023-06-15 10:43:12] SUCCESS: Round 6 completed - loss: 0.587, accuracy: 0.85'
])

// 图表引用
const accuracyChart = ref(null)
const lossChart = ref(null)

// 计算属性
const filteredJobs = computed(() => {
  let filtered = jobs.value

  if (searchQuery.value) {
    filtered = filtered.filter(
      (job) =>
        job.name.includes(searchQuery.value) || job.id.includes(searchQuery.value)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter((job) => job.status === statusFilter.value)
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(totalJobs.value / pageSize.value)
})

// 方法
const getJobIcon = (type) => {
  const icons = {
    medical: 'fas fa-brain text-accent',
    nlp: 'fas fa-robot text-blue-400',
    finance: 'fas fa-chart-line text-purple-400',
    autonomous: 'fas fa-car text-blue-300'
  }
  return icons[type] || 'fas fa-cube'
}

const getStatusClass = (status) => {
  const classes = {
    running: 'status-running',
    completed: 'status-completed',
    failed: 'status-failed',
    pending: 'status-pending'
  }
  return classes[status] || ''
}

const getStatusTextClass = (status) => {
  const classes = {
    running: 'text-accent',
    completed: 'text-blue-400',
    failed: 'text-red-500',
    pending: 'text-yellow-500'
  }
  return classes[status] || ''
}

const getStatusText = (status) => {
  const texts = {
    running: '运行中',
    completed: '已完成',
    failed: '失败',
    pending: '待处理'
  }
  return texts[status] || status
}

const getLogClass = (log) => {
  if (log.includes('ERROR')) return 'text-red-400'
  if (log.includes('WARNING')) return 'text-yellow-400'
  if (log.includes('SUCCESS')) return 'text-green-400'
  return 'text-gray-500'
}

const viewJobDetail = (job) => {
  selectedJob.value = job
  showJobDetail.value = true

  // 初始化图表
  setTimeout(() => {
    initCharts()
  }, 100)
}

const abortJob = (jobId) => {
  if (confirm('确定要中止此作业吗?')) {
    console.log('中止作业:', jobId)
  }
}

const submitNewJob = () => {
  const algorithmMap = {
    FedAvg: 'FedAvg算法',
    FedProx: 'FedProx算法',
    FedOpt: 'FedOpt算法'
  }

  const payload = {
    name: newJob.value.name,
    description: newJob.value.description,
    jobType: 'custom',
    algorithm: algorithmMap[newJob.value.algorithm] || 'FedAvg算法',
    totalRounds: Number(newJob.value.numRounds) || 10,
    config: {
      modelArchitecture: 'ResNet-50',
      framework: 'PyTorch',
      dataset: 'Mock Dataset',
      batchSize: Number(newJob.value.batchSize) || 32,
      learningRate: 0.001,
      optimizer: 'Adam',
      lossFunction: 'CrossEntropy',
      clients: Number(newJob.value.numClients) || 5,
      minClients: 2,
      maxClients: Number(newJob.value.numClients) || 5,
      secureComm: !!newJob.value.enableSSL,
      secureAgg: !!newJob.value.enableSecureAgg,
      differentialPrivacy: false,
      clientFraction: 1.0,
      localEpochs: 5,
      scheduler: 'random',
      compression: null
    },
    clientIds: []
  }

  createJob(payload)
    .then((res) => {
      if (res.code === 200) {
        showNewJobModal.value = false
        loadJobList()
      }
    })
    .catch((error) => {
      alert(error?.message || '创建作业失败，请稍后重试')
    })
}

const initCharts = () => {
  if (!accuracyChart.value || !lossChart.value) return

  // 准确率图表
  const accuracyChartInstance = echarts.init(accuracyChart.value)
  accuracyChartInstance.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5', 'Round 6'],
      axisLine: { lineStyle: { color: '#475569' } },
      axisLabel: { color: '#94a3b8' }
    },
    yAxis: {
      type: 'value',
      min: 0.6,
      max: 1.0,
      axisLine: { lineStyle: { color: '#475569' } },
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#334155' } }
    },
    series: [
      {
        name: 'Accuracy',
        type: 'line',
        data: [0.68, 0.72, 0.76, 0.79, 0.82, 0.85],
        smooth: true,
        lineStyle: { width: 3, color: '#76B900' },
        itemStyle: { color: '#76B900' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(118, 185, 0, 0.3)' },
            { offset: 1, color: 'rgba(118, 185, 0, 0)' }
          ])
        }
      }
    ]
  })

  // 损失图表
  const lossChartInstance = echarts.init(lossChart.value)
  lossChartInstance.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5', 'Round 6'],
      axisLine: { lineStyle: { color: '#475569' } },
      axisLabel: { color: '#94a3b8' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#475569' } },
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#334155' } }
    },
    series: [
      {
        name: 'Loss',
        type: 'line',
        data: [1.245, 1.082, 0.941, 0.835, 0.752, 0.687],
        smooth: true,
        lineStyle: { width: 3, color: '#3b82f6' },
        itemStyle: { color: '#3b82f6' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0)' }
          ])
        }
      }
    ]
  })

  window.addEventListener('resize', () => {
    accuracyChartInstance.resize()
    lossChartInstance.resize()
  })
}

const loadJobList = () => {
  getJobList(currentPage.value, pageSize.value, {
    status: statusFilter.value
  }).then((res) => {
    if (res.code === 200) {
      jobs.value = res.data.records
      totalJobs.value = res.data.total
    }
  })
}

// 生命周期
onMounted(() => {
  // 加载作业列表
  loadJobList()
})
</script>

<style scoped>
.status-indicator {
  @apply w-2 h-2 rounded-full inline-block mr-2;
}

.status-running {
  @apply bg-accent;
}

.status-completed {
  @apply bg-blue-500;
}

.status-failed {
  @apply bg-red-500;
}

.status-pending {
  @apply bg-yellow-500;
}

.status-offline {
  @apply bg-gray-500;
}
</style>
