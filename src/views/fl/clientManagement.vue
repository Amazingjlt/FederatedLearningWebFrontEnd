<template>
  <div class="p-4">
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">客户端管理</h1>
        <p class="text-gray-400 mt-1">管理和监控所有联邦学习客户端</p>
      </div>
      <button
        @click="showAddClientModal = true"
        class="bg-accent hover:bg-accent/90 text-white font-medium py-2 px-4 rounded-md flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-accent/20"
      >
        <i class="fas fa-plus"></i>
        <span>添加客户端</span>
      </button>
    </div>

    <!-- Client List Section -->
    <div class="bg-secondary rounded-lg shadow-lg overflow-hidden card-shadow">
      <div class="p-4 border-b border-gray-700">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold">客户端列表</h2>
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="搜索客户端..."
              class="bg-primary border border-gray-600 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 w-full md:w-64"
            />
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-primary/50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                客户端ID
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                名称
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                状态
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                连接时间
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                参与作业数
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-secondary divide-y divide-gray-700">
            <tr
              v-for="client in filteredClients"
              :key="client.id"
              class="hover:bg-primary/30 transition-colors duration-150"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {{ client.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ client.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center">
                  <span :class="['status-indicator', getStatusClass(client.status)]"></span>
                  <span :class="['text-sm font-medium', getStatusTextClass(client.status)]">
                    {{ getStatusText(client.status) }}
                  </span>
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {{ client.connectedAt }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ client.jobCount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="viewClientDetail(client)"
                  class="text-blue-400 hover:text-blue-300 mr-4"
                >
                  查看
                </button>
                <button class="text-gray-400 hover:text-gray-300 mr-4">
                  编辑
                </button>
                <button
                  @click="deleteClient(client.id)"
                  class="text-red-400 hover:text-red-300"
                >
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-6 py-4 border-t border-gray-700 flex justify-between items-center">
        <div class="text-sm text-gray-400">
          显示 <span class="text-white font-medium">1</span> 至
          <span class="text-white font-medium">{{ filteredClients.length }}</span> 共
          <span class="text-white font-medium">{{ totalClients }}</span> 个客户端
        </div>
        <div class="flex space-x-2">
          <button
            class="px-3 py-1 border border-gray-600 rounded-md text-sm bg-primary/30 hover:bg-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled
          >
            上一页
          </button>
          <button
            class="px-3 py-1 border border-gray-600 rounded-md text-sm bg-primary/30 hover:bg-primary/50"
          >
            下一页
          </button>
        </div>
      </div>
    </div>

    <!-- Add Client Modal -->
    <div
      v-if="showAddClientModal"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      @click.self="showAddClientModal = false"
    >
      <div class="bg-secondary rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all">
        <div class="p-5 border-b border-gray-700 flex justify-between items-center">
          <h3 class="text-xl font-semibold">添加新客户端</h3>
          <button
            @click="showAddClientModal = false"
            class="text-gray-400 hover:text-white"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-5">
          <form @submit.prevent="submitAddClient">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Client ID *</label>
                <input
                  type="text"
                  v-model="newClient.id"
                  required
                  class="w-full bg-primary border border-gray-600 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="Enter client ID"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Client Name *</label>
                <input
                  type="text"
                  v-model="newClient.name"
                  required
                  class="w-full bg-primary border border-gray-600 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="Enter client name"
                />
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                v-model="newClient.description"
                class="w-full bg-primary border border-gray-600 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                rows="3"
                placeholder="Enter client description"
              ></textarea>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">IP Address *</label>
                <input
                  type="text"
                  v-model="newClient.ipAddress"
                  required
                  class="w-full bg-primary border border-gray-600 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="Enter IP address"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Port *</label>
                <input
                  type="number"
                  v-model="newClient.port"
                  required
                  class="w-full bg-primary border border-gray-600 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="Enter port number"
                />
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-300 mb-1">Authentication Key</label>
              <input
                type="text"
                v-model="newClient.authKey"
                class="w-full bg-primary border border-gray-600 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                placeholder="Enter authentication key"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-300 mb-2">Permissions</label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="newClient.permissions.training"
                    class="rounded text-accent focus:ring-accent/50 bg-primary border-gray-600"
                  />
                  <span class="ml-2 text-sm">Allow participation in training jobs</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="newClient.permissions.modelDownload"
                    class="rounded text-accent focus:ring-accent/50 bg-primary border-gray-600"
                  />
                  <span class="ml-2 text-sm">Allow model download</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="newClient.permissions.dataSharing"
                    class="rounded text-accent focus:ring-accent/50 bg-primary border-gray-600"
                  />
                  <span class="ml-2 text-sm">Allow data sharing</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="newClient.permissions.monitoring"
                    class="rounded text-accent focus:ring-accent/50 bg-primary border-gray-600"
                  />
                  <span class="ml-2 text-sm">Allow system monitoring</span>
                </label>
              </div>
            </div>
          </form>
        </div>
        <div class="p-5 border-t border-gray-700 flex justify-end space-x-3">
          <button
            @click="showAddClientModal = false"
            class="px-4 py-2 border border-gray-600 rounded-md text-sm hover:bg-primary/50"
          >
            取消
          </button>
          <button
            @click="submitAddClient"
            class="px-4 py-2 bg-accent text-white rounded-md text-sm hover:bg-accent/90"
          >
            添加客户端
          </button>
        </div>
      </div>
    </div>

    <!-- Client Detail Modal -->
    <div
      v-if="showClientDetailModal"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      @click.self="showClientDetailModal = false"
    >
      <div class="bg-secondary rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all">
        <div class="p-5 border-b border-gray-700 flex justify-between items-center">
          <h3 class="text-xl font-semibold">客户端详情</h3>
          <button
            @click="showClientDetailModal = false"
            class="text-gray-400 hover:text-white"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-5" v-if="selectedClient">
          <!-- Client Basic Info -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-primary/30 rounded-lg p-4">
              <div class="text-sm text-gray-400 mb-1">Client ID</div>
              <div class="text-lg font-medium">{{ selectedClient.id }}</div>
            </div>
            <div class="bg-primary/30 rounded-lg p-4">
              <div class="text-sm text-gray-400 mb-1">Status</div>
              <div class="flex items-center">
                <span :class="['status-indicator', getStatusClass(selectedClient.status)]"></span>
                <span :class="['font-medium', getStatusTextClass(selectedClient.status)]">
                  {{ getStatusText(selectedClient.status) }}
                </span>
              </div>
            </div>
            <div class="bg-primary/30 rounded-lg p-4">
              <div class="text-sm text-gray-400 mb-1">Connection Time</div>
              <div class="text-sm font-medium">{{ selectedClient.connectedAt }}</div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Device Information -->
            <div>
              <h4 class="text-lg font-semibold mb-3 flex items-center">
                <i class="fas fa-info-circle text-accent mr-2"></i>
                Device Information
              </h4>
              <div class="bg-primary/30 rounded-lg p-4 space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-400">Name</span>
                  <span class="font-medium">{{ selectedClient.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">IP Address</span>
                  <span class="font-medium">{{ selectedClient.ipAddress }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Port</span>
                  <span class="font-medium">{{ selectedClient.port }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Device Type</span>
                  <span class="font-medium">{{ selectedClient.deviceType }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">OS</span>
                  <span class="font-medium">{{ selectedClient.os }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">CPU</span>
                  <span class="font-medium">{{ selectedClient.cpu }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Memory</span>
                  <span class="font-medium">{{ selectedClient.memory }}</span>
                </div>
              </div>
            </div>

            <!-- System Resource Usage -->
            <div>
              <h4 class="text-lg font-semibold mb-3 flex items-center">
                <i class="fas fa-microchip text-accent mr-2"></i>
                Resource Usage
              </h4>
              <div class="bg-primary/30 rounded-lg p-4 space-y-4">
                <div>
                  <div class="flex justify-between mb-1">
                    <span class="text-sm">CPU Usage</span>
                    <span class="text-sm font-medium">45%</span>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-2">
                    <div class="bg-accent h-2 rounded-full" style="width: 45%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between mb-1">
                    <span class="text-sm">Memory Usage</span>
                    <span class="text-sm font-medium">68%</span>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-2">
                    <div class="bg-yellow-500 h-2 rounded-full" style="width: 68%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between mb-1">
                    <span class="text-sm">Disk Usage</span>
                    <span class="text-sm font-medium">32%</span>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full" style="width: 32%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between mb-1">
                    <span class="text-sm">Network I/O</span>
                    <span class="text-sm font-medium">1.2 GB/s</span>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-2">
                    <div class="bg-purple-500 h-2 rounded-full" style="width: 25%"></div>
                  </div>
                </div>

                <!-- Performance Chart -->
                <div class="mt-6">
                  <h5 class="text-sm font-medium mb-2">Performance Metrics</h5>
                  <div ref="clientPerformanceChart" class="w-full h-40"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Participated Jobs -->
          <div class="mb-6">
            <h4 class="text-lg font-semibold mb-3 flex items-center">
              <i class="fas fa-history text-accent mr-2"></i>
              Participated Jobs
            </h4>
            <div class="bg-primary/30 rounded-lg overflow-hidden">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Job ID
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Accuracy
                      </th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Completion Time
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-700">
                    <tr>
                      <td class="px-4 py-3 whitespace-nowrap text-sm">FL-JOB-042</td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm">Medical Image Classification</td>
                      <td class="px-4 py-3 whitespace-nowrap">
                        <span class="px-2 py-1 text-xs rounded-full bg-green-900/30 text-green-400">
                          已完成
                        </span>
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm">92.4%</td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-400">2023-06-14 18:30</td>
                    </tr>
                    <tr>
                      <td class="px-4 py-3 whitespace-nowrap text-sm">FL-JOB-038</td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm">Anomaly Detection Model</td>
                      <td class="px-4 py-3 whitespace-nowrap">
                        <span class="px-2 py-1 text-xs rounded-full bg-green-900/30 text-green-400">
                          Completed
                        </span>
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm">88.7%</td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-400">2023-06-12 09:15</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="p-5 border-t border-gray-700 flex justify-end space-x-3">
          <button
            @click="showClientDetailModal = false"
            class="px-4 py-2 border border-gray-600 rounded-md text-sm hover:bg-primary/50"
          >
            关闭
          </button>
          <button class="px-4 py-2 bg-accent text-white rounded-md text-sm hover:bg-accent/90">
            重新连接客户端
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import * as echarts from 'echarts'
import { getClientList } from '@/api/clientManagement'

const searchQuery = ref('')
const showAddClientModal = ref(false)
const showClientDetailModal = ref(false)
const selectedClient = ref(null)
const totalClients = ref(24)
const clientPerformanceChart = ref(null)

const clients = ref([
  {
    id: 'FL-CLIENT-001',
    name: '边缘设备 #1',
    status: 'online',
    connectedAt: '2023-06-15 09:23',
    jobCount: 12,
    gpu: 'NVIDIA RTX A6000',
    cpu: 'Intel Core i7-8700K',
    memory: '32 GB',
    os: 'Ubuntu 20.04 LTS',
    ipAddress: '192.168.1.105',
    port: 50051,
    deviceType: 'Edge Server'
  },
  {
    id: 'FL-CLIENT-002',
    name: '边缘设备 #2',
    status: 'online',
    connectedAt: '2023-06-15 10:45',
    jobCount: 8,
    gpu: 'NVIDIA Tesla V100',
    cpu: 'Intel Core i9-9900K',
    memory: '64 GB',
    os: 'Ubuntu 22.04 LTS',
    ipAddress: '192.168.1.106',
    port: 50052,
    deviceType: 'Edge Server'
  },
  {
    id: 'FL-CLIENT-003',
    name: '云服务器 #1',
    status: 'warning',
    connectedAt: '2023-06-14 16:12',
    jobCount: 23,
    gpu: 'NVIDIA A100 80GB',
    cpu: 'AMD EPYC 7763',
    memory: '128 GB',
    os: 'Ubuntu 20.04 LTS',
    ipAddress: '192.168.1.107',
    port: 50053,
    deviceType: 'Cloud Server'
  },
  {
    id: 'FL-CLIENT-004',
    name: '移动设备 #1',
    status: 'offline',
    connectedAt: '2023-06-12 08:55',
    jobCount: 5,
    gpu: 'NVIDIA RTX 3090',
    cpu: 'Intel Core i7-11700K',
    memory: '32 GB',
    os: 'Windows 11',
    ipAddress: '192.168.1.108',
    port: 50054,
    deviceType: 'Desktop'
  },
  {
    id: 'FL-CLIENT-005',
    name: '物联网网关 #1',
    status: 'online',
    connectedAt: '2023-06-15 11:30',
    jobCount: 7,
    gpu: 'NVIDIA Jetson AGX Xavier',
    cpu: 'ARM Cortex-A78',
    memory: '16 GB',
    os: 'Ubuntu 18.04 LTS',
    ipAddress: '192.168.1.109',
    port: 50055,
    deviceType: 'IoT Gateway'
  }
])

const newClient = ref({
  id: '',
  name: '',
  description: '',
  ipAddress: '',
  port: '',
  authKey: '',
  permissions: {
    training: true,
    modelDownload: true,
    dataSharing: false,
    monitoring: true
  }
})

const filteredClients = computed(() => {
  if (!searchQuery.value) return clients.value
  return clients.value.filter(
    (client) =>
      client.name.includes(searchQuery.value) || client.id.includes(searchQuery.value)
  )
})

const getStatusClass = (status) => {
  const classes = {
    online: 'status-online',
    warning: 'status-warning',
    offline: 'status-offline'
  }
  return classes[status] || ''
}

const getStatusTextClass = (status) => {
  const classes = {
    online: 'text-accent',
    warning: 'text-yellow-400',
    offline: 'text-red-400'
  }
  return classes[status] || ''
}

const getStatusText = (status) => {
  const texts = {
    online: '在线',
    warning: '警告',
    offline: '离线'
  }
  return texts[status] || status
}

const viewClientDetail = (client) => {
  selectedClient.value = client
  showClientDetailModal.value = true
  
  // 初始化图表
  setTimeout(() => {
    initPerformanceChart()
  }, 100)
}

const submitAddClient = () => {
  console.log('添加客户端:', newClient.value)
  showAddClientModal.value = false
  // 这里调用API添加客户端
}

const deleteClient = (clientId) => {
  if (confirm('确定要删除此客户端吗？')) {
    console.log('删除客户端:', clientId)
    // 这里调用API删除客户端
  }
}

const initPerformanceChart = () => {
  if (!clientPerformanceChart.value) return

  const chart = echarts.init(clientPerformanceChart.value)
  chart.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: { lineStyle: { color: '#4B5563' } },
      axisLabel: { color: '#9CA3AF' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#4B5563' } },
      axisLabel: { color: '#9CA3AF' },
      splitLine: { lineStyle: { color: '#374151' } }
    },
    series: [
      {
        name: 'Training Time (s)',
        type: 'bar',
        data: [120, 190, 150, 230, 180, 210, 160],
        itemStyle: { color: '#76B900' }
      },
      {
        name: 'Data Transfer (MB)',
        type: 'line',
        data: [35, 42, 38, 55, 48, 52, 40],
        lineStyle: { color: '#3B82F6' },
        itemStyle: { color: '#3B82F6' }
      }
    ],
    legend: {
      data: ['Training Time (s)', 'Data Transfer (MB)'],
      textStyle: { color: '#9CA3AF', fontSize: 10 },
      bottom: 0
    }
  })

  window.addEventListener('resize', () => chart.resize())
}

onMounted(() => {
  // 加载客户端列表
  getClientList(1, 10, {}).then((res) => {
    if (res.code === 200) {
      clients.value = res.data.records
      totalClients.value = res.data.total
    }
  })
})
</script>

<style scoped>
.status-indicator {
  @apply w-2 h-2 rounded-full inline-block mr-2;
}

.status-online {
  @apply bg-accent;
}

.status-warning {
  @apply bg-yellow-500;
}

.status-offline {
  @apply bg-red-500;
}

.card-shadow {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
</style>