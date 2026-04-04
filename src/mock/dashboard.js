import Mock from 'mockjs'

const http = import.meta.env.VITE_API_BASE_URL || '/api'

// 仪表盘统计数据
const dashboardStats = {
  code: 200,
  message: 'success',
  data: {
    activeJobs: 3,
    completedJobs: 18,
    totalClients: 12,
    onlineClients: 10
  }
}

// 客户端列表
const clientList = {
  code: 200,
  message: 'success',
  data: [
    { id: 1, name: 'client-01', gpu: 'GPU: NVIDIA RTX A6000', status: 'online' },
    { id: 2, name: 'client-02', gpu: 'GPU: NVIDIA Tesla V100', status: 'online' },
    { id: 3, name: 'client-03', gpu: 'GPU: NVIDIA A100 80GB', status: 'online' },
    { id: 4, name: 'client-04', gpu: 'GPU: NVIDIA RTX 3090', status: 'offline' },
    { id: 5, name: 'client-05', gpu: 'GPU: NVIDIA RTX 4090', status: 'online' },
    { id: 6, name: 'client-06', gpu: 'GPU: NVIDIA A40', status: 'online' }
  ]
}

// 当前作业进度
const currentJobProgress = {
  code: 200,
  message: 'success',
  data: {
    jobId: 'fl-job-8721',
    jobName: '医学图像分割',
    progress: 70,
    currentRound: 7,
    totalRounds: 10,
    accuracy: 89.4,
    loss: 0.245,
    activeClients: 8,
    totalClients: 10,
    estimatedTimeRemaining: '1小时24分钟'
  }
}

// 实时日志
const realTimeLogs = {
  code: 200,
  message: 'success',
  data: [
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
  ]
}

// 图表数据
const accuracyChartData = {
  code: 200,
  message: 'success',
  data: {
    rounds: ['轮次 1', '轮次 2', '轮次 3', '轮次 4', '轮次 5', '轮次 6', '轮次 7'],
    accuracy: [72.3, 78.5, 82.1, 84.7, 86.3, 88.2, 89.4]
  }
}

const lossChartData = {
  code: 200,
  message: 'success',
  data: {
    rounds: ['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5', 'Round 6', 'Round 7'],
    loss: [0.642, 0.521, 0.438, 0.385, 0.327, 0.276, 0.245]
  }
}

// Mock接口
Mock.mock(`${http}/dashboard/stats`, 'get', () => {
  return dashboardStats
})

Mock.mock(`${http}/dashboard/clients`, 'get', () => {
  return clientList
})

Mock.mock(`${http}/dashboard/currentJob`, 'get', () => {
  return currentJobProgress
})

Mock.mock(`${http}/dashboard/logs`, 'get', () => {
  return realTimeLogs
})

Mock.mock(new RegExp(`${http}/dashboard/chart/accuracy`), 'get', () => {
  return accuracyChartData
})

Mock.mock(new RegExp(`${http}/dashboard/chart/loss`), 'get', () => {
  return lossChartData
})

export default {
  dashboardStats,
  clientList,
  currentJobProgress,
  realTimeLogs,
  accuracyChartData,
  lossChartData
}