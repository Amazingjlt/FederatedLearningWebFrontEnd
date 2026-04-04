import Mock from 'mockjs'

const http = import.meta.env.VITE_API_BASE_URL || '/api'

// 客户端列表响应
const clientListResponse = {
  code: 200,
  message: 'success',
  data: {
    records: [
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
    ],
    total: 24,
    pageNo: 1,
    pageSize: 10
  }
}

// 客户端详情响应
const clientDetailResponse = {
  code: 200,
  message: 'success',
  data: {
    id: 'FL-CLIENT-001',
    name: '边缘设备 #1',
    status: 'online',
    connectedAt: '2023-06-15 09:23',
    deviceInfo: {
      type: 'Edge Server',
      ipAddress: '192.168.1.105',
      port: 50051,
      os: 'Ubuntu 20.04 LTS',
      cpu: 'Intel Core i7-8700K',
      memory: '32 GB',
      gpu: 'NVIDIA RTX A6000'
    },
    resourceUsage: {
      cpuUsage: 45,
      memoryUsage: 68,
      diskUsage: 32,
      networkIO: 1.2
    },
    participatedJobs: [
      {
        jobId: 'FL-JOB-042',
        jobName: 'Medical Image Classification',
        status: 'completed',
        accuracy: 92.4,
        completedAt: '2023-06-14 18:30'
      },
      {
        jobId: 'FL-JOB-038',
        jobName: 'Anomaly Detection Model',
        status: 'completed',
        accuracy: 88.7,
        completedAt: '2023-06-12 09:15'
      },
      {
        jobId: 'FL-JOB-035',
        jobName: 'Natural Language Processing',
        status: 'completed',
        accuracy: 85.2,
        completedAt: '2023-06-10 14:45'
      }
    ],
    performanceMetrics: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      trainingTime: [120, 190, 150, 230, 180, 210, 160],
      dataTransfer: [35, 42, 38, 55, 48, 52, 40]
    }
  }
}

// 添加客户端响应
const addClientResponse = {
  code: 200,
  message: '客户端添加成功',
  data: {
    clientId: 'FL-CLIENT-006',
    status: 'pending'
  }
}

// 删除客户端响应
const deleteClientResponse = {
  code: 200,
  message: '客户端删除成功',
  data: null
}

// Mock接口
Mock.mock(`${http}/client/list`, 'post', (options) => {
  const params = JSON.parse(options.body)
  let records = clientListResponse.data.records

  // 状态过滤
  if (params.status) {
    records = records.filter((client) => client.status === params.status)
  }

  // 搜索过滤
  if (params.keyword) {
    records = records.filter(
      (client) =>
        client.name.includes(params.keyword) || client.id.includes(params.keyword)
    )
  }

  return {
    ...clientListResponse,
    data: {
      ...clientListResponse.data,
      records,
      total: records.length
    }
  }
})

Mock.mock(new RegExp(`${http}/client/detail/.*`), 'get', () => {
  return clientDetailResponse
})

Mock.mock(`${http}/client/add`, 'post', () => {
  return addClientResponse
})

Mock.mock(new RegExp(`${http}/client/delete/.*`), 'post', () => {
  return deleteClientResponse
})

export default {
  clientListResponse,
  clientDetailResponse,
  addClientResponse,
  deleteClientResponse
}