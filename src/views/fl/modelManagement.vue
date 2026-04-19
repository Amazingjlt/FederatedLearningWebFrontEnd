<template>
  <div class="p-4">
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">模型管理</h1>
          <p class="text-gray-400 mt-1">跟踪、比较和管理您的训练模型</p>
        </div>
        <div class="flex gap-3">
          <button
            :disabled="selectedModels.length !== 2"
            @click="showCompareModal = true"
            class="btn-secondary"
            :class="{ 'opacity-50 cursor-not-allowed': selectedModels.length !== 2 }"
          >
            <i class="fas fa-chart-line"></i>
            <span>比较模型</span>
          </button>
          <button @click="openUploadModal" class="btn-primary">
            <i class="fas fa-plus"></i>
            <span>上传模型</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Model Comparison Chart Section -->
    <div class="bg-secondary rounded-lg p-4 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-white">模型性能比较</h2>
        <div class="flex gap-2">
          <button class="text-sm text-gray-400 hover:text-accent transition-colors">
            <i class="fas fa-download"></i>
          </button>
          <button class="text-sm text-gray-400 hover:text-accent transition-colors">
            <i class="fas fa-expand"></i>
          </button>
        </div>
      </div>
      <div ref="modelComparisonChart" class="w-full h-64"></div>
    </div>

    <!-- Model List Controls -->
    <div class="bg-secondary rounded-lg p-4 mb-4">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="搜索模型..."
              class="bg-primary border border-gray-600 rounded-md py-2 pl-10 pr-4 text-sm w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          <select
            v-model="filterType"
            class="bg-primary border border-gray-600 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">所有模型</option>
            <option value="production">生产模型</option>
            <option value="experimental">实验模型</option>
          </select>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-400">视图:</span>
            <button
              @click="viewMode = 'grid'"
              :class="[
                'p-2 rounded-md transition-colors',
                viewMode === 'grid' ? 'bg-primary text-accent' : 'bg-secondary text-gray-400 hover:text-accent'
              ]"
            >
              <i class="fas fa-th-large"></i>
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'p-2 rounded-md transition-colors',
                viewMode === 'list' ? 'bg-primary text-accent' : 'bg-secondary text-gray-400 hover:text-accent'
              ]"
            >
              <i class="fas fa-list"></i>
            </button>
          </div>
          <select class="bg-primary border border-gray-600 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent">
            <option>最近添加</option>
            <option>最高准确率</option>
            <option>最低损失</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Model List - Grid View -->
    <div v-show="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="model in filteredModels"
        :key="model.id"
        class="bg-secondary rounded-lg overflow-hidden model-card-hover border border-gray-700"
      >
        <div class="p-4">
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="text-lg font-semibold text-white">{{ model.name }}</h3>
              <p class="text-sm text-gray-400">任务ID: {{ model.jobId }}</p>
            </div>
            <div class="relative">
              <input
                type="checkbox"
                :value="model.id"
                v-model="selectedModels"
                :disabled="!selectedModels.includes(model.id) && selectedModels.length >= 2"
                class="w-4 h-4 rounded border-gray-600 text-accent focus:ring-accent"
              />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="bg-primary/50 rounded-md p-3">
              <div class="text-sm text-gray-400">准确率</div>
              <div class="text-xl font-bold text-white mt-1">{{ model.accuracy }}%</div>
              <div class="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                <div class="bg-accent h-1.5 rounded-full" :style="{ width: model.accuracy + '%' }"></div>
              </div>
            </div>
            <div class="bg-primary/50 rounded-md p-3">
              <div class="text-sm text-gray-400">损失值</div>
              <div class="text-xl font-bold text-white mt-1">{{ model.loss }}</div>
              <div class="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                <div class="bg-red-500 h-1.5 rounded-full" :style="{ width: (model.loss * 100) + '%' }"></div>
              </div>
            </div>
          </div>
          <div class="text-sm text-gray-400 mb-4">
            <div class="flex justify-between mb-1">
              <span>创建时间:</span>
              <span class="text-gray-300">{{ model.createdAt }}</span>
            </div>
            <div class="flex justify-between">
              <span>框架:</span>
              <span class="text-gray-300">{{ model.framework }}</span>
            </div>
          </div>
          <div class="flex justify-between">
            <button class="btn-outline text-xs py-1.5 px-3">
              <i class="fas fa-download"></i>
              <span>下载</span>
            </button>
            <button class="btn-outline text-xs py-1.5 px-3">
              <i class="fas fa-check-circle"></i>
              <span>验证</span>
            </button>
            <button class="btn-outline text-xs py-1.5 px-3">
              <i class="fas fa-ellipsis-v"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Model List - Table View -->
    <div v-show="viewMode === 'list'" class="bg-secondary rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th class="table-header w-10">
              <input
                type="checkbox"
                @change="toggleSelectAll"
                :checked="selectedModels.length === filteredModels.length && filteredModels.length > 0"
                class="w-4 h-4 rounded border-gray-600 text-accent focus:ring-accent"
              />
            </th>
            <th class="table-header">模型名称</th>
            <th class="table-header">源任务</th>
            <th class="table-header">准确率</th>
            <th class="table-header">损失值</th>
            <th class="table-header">创建时间</th>
            <th class="table-header">框架</th>
            <th class="table-header text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr
            v-for="model in filteredModels"
            :key="model.id"
            class="hover:bg-primary/30 transition-colors"
          >
            <td class="table-cell">
              <input
                type="checkbox"
                :value="model.id"
                v-model="selectedModels"
                :disabled="!selectedModels.includes(model.id) && selectedModels.length >= 2"
                class="w-4 h-4 rounded border-gray-600 text-accent focus:ring-accent"
              />
            </td>
            <td class="table-cell font-medium text-white">{{ model.name }}</td>
            <td class="table-cell">{{ model.jobId }}</td>
            <td class="table-cell">
              <div class="flex items-center gap-2">
                <span>{{ model.accuracy }}%</span>
                <div class="w-24 bg-gray-700 rounded-full h-1.5">
                  <div class="bg-accent h-1.5 rounded-full" :style="{ width: model.accuracy + '%' }"></div>
                </div>
              </div>
            </td>
            <td class="table-cell">{{ model.loss }}</td>
            <td class="table-cell">{{ model.createdAt }}</td>
            <td class="table-cell">{{ model.framework }}</td>
            <td class="table-cell text-right">
              <div class="flex justify-end gap-2">
                <button class="text-gray-400 hover:text-accent transition-colors">
                  <i class="fas fa-chart-line"></i>
                </button>
                <button class="text-gray-400 hover:text-accent transition-colors">
                  <i class="fas fa-download"></i>
                </button>
                <button class="text-gray-400 hover:text-accent transition-colors">
                  <i class="fas fa-check-circle"></i>
                </button>
                <button class="text-gray-400 hover:text-accent transition-colors">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="px-4 py-3 flex items-center justify-between border-t border-gray-700">
        <div class="text-sm text-gray-400">
          显示 <span class="font-medium">1</span> 至 <span class="font-medium">{{ filteredModels.length }}</span> 共
          <span class="font-medium">{{ filteredModels.length }}</span> 个模型
        </div>
        <div class="flex space-x-2">
          <button
            class="px-3 py-1 border border-gray-700 rounded-md text-sm text-gray-400 hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled
          >
            上一页
          </button>
          <button
            class="px-3 py-1 border border-gray-700 rounded-md text-sm text-gray-400 hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled
          >
            下一页
          </button>
        </div>
      </div>
    </div>

    <!-- Compare Models Modal -->
    <div
      v-if="showCompareModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showCompareModal = false"
    >
      <div class="bg-secondary rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="p-5 border-b border-gray-700 flex items-center justify-between">
          <h2 class="text-xl font-bold text-white">比较模型</h2>
          <button @click="showCompareModal = false" class="text-gray-400 hover:text-white">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-5">
          <div ref="comparisonChartContainer" class="w-full h-80 mb-6"></div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-semibold text-white mb-3">性能指标</h3>
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-400">Accuracy</span>
                  </div>
                  <div class="space-y-2">
                    <div class="flex justify-between items-center">
                      <span class="text-sm">ResNet-50 FL Model</span>
                      <span class="font-medium">92.4%</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-2">
                      <div class="bg-accent h-2 rounded-full" style="width: 92.4%"></div>
                    </div>
                  </div>
                  <div class="space-y-2 mt-3">
                    <div class="flex justify-between items-center">
                      <span class="text-sm">Transformer Base Model</span>
                      <span class="font-medium">90.8%</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-2">
                      <div class="bg-blue-500 h-2 rounded-full" style="width: 90.8%"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-400">Loss</span>
                  </div>
                  <div class="space-y-2">
                    <div class="flex justify-between items-center">
                      <span class="text-sm">ResNet-50 FL Model</span>
                      <span class="font-medium">0.28</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-2">
                      <div class="bg-accent h-2 rounded-full" style="width: 28%"></div>
                    </div>
                  </div>
                  <div class="space-y-2 mt-3">
                    <div class="flex justify-between items-center">
                      <span class="text-sm">Transformer Base Model</span>
                      <span class="font-medium">0.31</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-2">
                      <div class="bg-blue-500 h-2 rounded-full" style="width: 31%"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-3">模型详情</h3>
              <div class="space-y-4">
                <div class="bg-primary/50 rounded-md p-4">
                  <h4 class="font-medium text-white mb-2">ResNet-50 FL Model</h4>
                  <div class="grid grid-cols-2 gap-2 text-sm">
                    <div class="text-gray-400">Source Job</div>
                    <div class="text-gray-300">FL-JOB-2023-0589</div>
                    <div class="text-gray-400">Created</div>
                    <div class="text-gray-300">2023-05-15 14:30</div>
                    <div class="text-gray-400">Framework</div>
                    <div class="text-gray-300">PyTorch 1.12.1</div>
                    <div class="text-gray-400">Parameters</div>
                    <div class="text-gray-300">25.6M</div>
                  </div>
                </div>
                <div class="bg-primary/50 rounded-md p-4">
                  <h4 class="font-medium text-white mb-2">Transformer Base Model</h4>
                  <div class="grid grid-cols-2 gap-2 text-sm">
                    <div class="text-gray-400">Source Job</div>
                    <div class="text-gray-300">FL-JOB-2023-0512</div>
                    <div class="text-gray-400">Created</div>
                    <div class="text-gray-300">2023-04-28 11:20</div>
                    <div class="text-gray-400">Framework</div>
                    <div class="text-gray-300">TensorFlow 2.8.0</div>
                    <div class="text-gray-400">Parameters</div>
                    <div class="text-gray-300">86.4M</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="p-5 border-t border-gray-700 flex justify-end gap-3">
          <button @click="showCompareModal = false" class="btn-outline">取消</button>
          <button class="btn-primary">
            <i class="fas fa-download"></i>
            <span>导出比较结果</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Upload Model Modal -->
    <div
      v-if="showUploadModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showUploadModal = false"
    >
      <div class="bg-secondary rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-5 border-b border-gray-700 flex items-center justify-between">
          <h2 class="text-xl font-bold text-white">上传模型</h2>
          <button @click="showUploadModal = false" class="text-gray-400 hover:text-white">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-5 space-y-4">
          <div>
            <label class="block text-sm text-gray-300 mb-1">模型名称</label>
            <input
              v-model="uploadForm.name"
              type="text"
              placeholder="默认使用文件名"
              class="w-full bg-primary border border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-300 mb-1">关联作业ID</label>
              <input
                v-model="uploadForm.job_id"
                type="text"
                placeholder="例如: FL-JOB-2023-0589"
                class="w-full bg-primary border border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-300 mb-1">框架</label>
              <select
                v-model="uploadForm.framework"
                class="w-full bg-primary border border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="PyTorch">PyTorch</option>
                <option value="TensorFlow">TensorFlow</option>
                <option value="ONNX">ONNX</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm text-gray-300 mb-1">模型架构</label>
            <input
              v-model="uploadForm.architecture"
              type="text"
              placeholder="例如: ResNet-50"
              class="w-full bg-primary border border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-300 mb-1">模型文件 *</label>
            <input
              type="file"
              accept=".pth,.pt,.ckpt,.onnx,.h5,.bin"
              @change="handleFileChange"
              class="w-full bg-primary border border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-accent file:text-white"
            />
            <p v-if="uploadFile" class="text-xs text-gray-400 mt-2">
              已选择: {{ uploadFile.name }} ({{ formatFileSize(uploadFile.size) }})
            </p>
          </div>
        </div>
        <div class="p-5 border-t border-gray-700 flex justify-end gap-3">
          <button
            @click="showUploadModal = false"
            class="btn-outline"
            :disabled="uploading"
          >
            取消
          </button>
          <button
            @click="submitUploadModel"
            class="btn-primary"
            :disabled="uploading || !uploadFile"
            :class="{ 'opacity-50 cursor-not-allowed': uploading || !uploadFile }"
          >
            <i class="fas fa-upload"></i>
            <span>{{ uploading ? '上传中...' : '开始上传' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import * as echarts from 'echarts'
import { uploadModel } from '@/api/modelManagement'

const searchQuery = ref('')
const filterType = ref('')
const viewMode = ref('grid')
const selectedModels = ref([])
const showCompareModal = ref(false)
const showUploadModal = ref(false)
const uploading = ref(false)
const uploadFile = ref(null)
const uploadForm = ref({
  name: '',
  job_id: '',
  framework: 'PyTorch',
  architecture: ''
})

const models = ref([
  {
    id: 'model-1',
    name: 'ResNet-50 联邦学习模型',
    jobId: 'FL-JOB-2023-0589',
    accuracy: 92.4,
    loss: 0.28,
    createdAt: '2023-05-15 14:30',
    framework: 'PyTorch 1.12.1'
  },
  {
    id: 'model-2',
    name: 'MobileNetV2 FL Model',
    jobId: 'FL-JOB-2023-0572',
    accuracy: 89.7,
    loss: 0.35,
    createdAt: '2023-05-10 09:15',
    framework: 'TensorFlow 2.9.1'
  },
  {
    id: 'model-3',
    name: 'CNN-LSTM Hybrid Model',
    jobId: 'FL-JOB-2023-0541',
    accuracy: 87.3,
    loss: 0.42,
    createdAt: '2023-05-05 16:45',
    framework: 'PyTorch 1.11.0'
  },
  {
    id: 'model-4',
    name: 'Transformer Base Model',
    jobId: 'FL-JOB-2023-0512',
    accuracy: 90.8,
    loss: 0.31,
    createdAt: '2023-04-28 11:20',
    framework: 'TensorFlow 2.8.0'
  }
])

const modelComparisonChart = ref(null)
const comparisonChartContainer = ref(null)

const filteredModels = computed(() => {
  let filtered = models.value
  if (searchQuery.value) {
    filtered = filtered.filter(
      (m) => m.name.includes(searchQuery.value) || m.jobId.includes(searchQuery.value)
    )
  }
  return filtered
})

const toggleSelectAll = () => {
  if (selectedModels.value.length === filteredModels.value.length) {
    selectedModels.value = []
  } else {
    selectedModels.value = filteredModels.value.slice(0, 2).map((m) => m.id)
  }
}

const openUploadModal = () => {
  uploadForm.value = {
    name: '',
    job_id: '',
    framework: 'PyTorch',
    architecture: ''
  }
  uploadFile.value = null
  showUploadModal.value = true
}

const handleFileChange = (event) => {
  const [file] = event.target.files || []
  uploadFile.value = file || null
}

const formatFileSize = (size) => {
  if (!size && size !== 0) return '-'
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`
  return `${(size / 1024 / 1024 / 1024).toFixed(1)} GB`
}

const submitUploadModel = async () => {
  if (!uploadFile.value) {
    alert('请先选择模型文件')
    return
  }

  const formData = new FormData()
  formData.append('file', uploadFile.value)
  if (uploadForm.value.name) formData.append('name', uploadForm.value.name)
  if (uploadForm.value.job_id) formData.append('job_id', uploadForm.value.job_id)
  if (uploadForm.value.framework) formData.append('framework', uploadForm.value.framework)
  if (uploadForm.value.architecture) formData.append('architecture', uploadForm.value.architecture)

  try {
    uploading.value = true
    const res = await uploadModel(formData)
    const createdModel = {
      id: res.data.modelId,
      name: res.data.name || uploadForm.value.name || uploadFile.value.name,
      jobId: res.data.jobId || uploadForm.value.job_id || '-',
      accuracy: 0,
      loss: 0,
      createdAt: res.data.createdAt || new Date().toLocaleString(),
      framework: res.data.framework || uploadForm.value.framework || '-'
    }

    models.value = [createdModel, ...models.value]
    showUploadModal.value = false
    alert('模型上传成功')
  } catch (error) {
    alert(error?.message || '模型上传失败，请稍后重试')
  } finally {
    uploading.value = false
  }
}

const initCharts = () => {
  if (!modelComparisonChart.value) return

  const chart = echarts.init(modelComparisonChart.value)
  chart.setOption({
    color: ['#76B900', '#3B82F6', '#10B981', '#6366F1'],
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: {
      data: ['准确率', '损失值'],
      textStyle: { color: '#94a3b8' },
      top: 0
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['ResNet-50', 'MobileNetV2', 'CNN-LSTM', 'Transformer'],
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94a3b8' }
    },
    yAxis: [
      {
        type: 'value',
        name: '准确率 (%)',
        min: 85,
        max: 95,
        axisLine: { show: false },
        axisLabel: { color: '#94a3b8', formatter: '{value}%' },
        splitLine: { lineStyle: { color: '#334155' } }
      },
      {
        type: 'value',
        name: '损失值',
        min: 0.2,
        max: 0.5,
        position: 'right',
        axisLine: { show: false },
        axisLabel: { color: '#94a3b8' },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '准确率',
        type: 'bar',
        data: [92.4, 89.7, 87.3, 90.8],
        itemStyle: { borderRadius: [4, 4, 0, 0] }
      },
      {
        name: '损失值',
        type: 'line',
        yAxisIndex: 1,
        data: [0.28, 0.35, 0.42, 0.31],
        symbolSize: 8,
        lineStyle: { width: 2 }
      }
    ]
  })

  window.addEventListener('resize', () => chart.resize())
}

onMounted(() => {
  initCharts()
})
</script>

<style scoped>
.model-card-hover {
  @apply transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1;
}

.btn-primary {
  @apply bg-accent hover:bg-accent/90 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 flex items-center gap-2;
}

.btn-secondary {
  @apply bg-secondary hover:bg-secondary/90 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 flex items-center gap-2;
}

.btn-outline {
  @apply border border-gray-600 hover:border-accent hover:text-accent text-white font-medium py-2 px-4 rounded-md transition-all duration-200 flex items-center gap-2;
}

.table-header {
  @apply px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider;
}

.table-cell {
  @apply px-4 py-4 whitespace-nowrap text-sm text-gray-300;
}
</style>
