import Mock from 'mockjs'

const http = import.meta.env.VITE_API_BASE_URL || '/api'

// 作业列表响应
const jobListResponse = {
  code: 200,
  message: 'success',
  data: {
    records: [
      {
        id: 'FL-2023-001',
        name: '医学图像分割',
        status: 'running',
        type: 'medical',
        algorithm: 'FedAvg算法',
        currentRound: 6,
        totalRounds: 10,
        accuracy: 89.4,
        loss: 0.245,
        createdAt: '2023-06-15 09:30',
        description: '使用3D CNN架构的医学图像分割联邦学习模型'
      },
      {
        id: 'FL-2023-002',
        name: '自然语言处理',
        status: 'completed',
        type: 'nlp',
        algorithm: 'FedProx算法',
        currentRound: 15,
        totalRounds: 15,
        accuracy: 92.1,
        loss: 0.189,
        createdAt: '2023-06-12 14:15',
        description: 'BERT模型的联邦学习微调'
      },
      {
        id: 'FL-2023-003',
        name: '金融时间序列',
        status: 'failed',
        type: 'finance',
        algorithm: 'FedOpt算法',
        currentRound: 3,
        totalRounds: 10,
        accuracy: 0,
        loss: 0,
        createdAt: '2023-06-10 16:45',
        description: '金融市场时间序列预测模型'
      },
      {
        id: 'FL-2023-004',
        name: '自动驾驶',
        status: 'pending',
        type: 'autonomous',
        algorithm: 'FedProx算法',
        currentRound: 0,
        totalRounds: 20,
        accuracy: 0,
        loss: 0,
        createdAt: '2023-06-15 14:20',
        description: '自动驾驶场景识别模型'
      },
      {
        id: 'FL-2023-005',
        name: '零售推荐',
        status: 'aborted',
        type: 'retail',
        algorithm: 'FedAvg算法',
        currentRound: 4,
        totalRounds: 10,
        accuracy: 0,
        loss: 0,
        createdAt: '2023-06-08 11:10',
        description: '零售商品推荐系统'
      }
    ],
    total: 24,
    pageNo: 1,
    pageSize: 10
  }
}

// 作业详情响应
const jobDetailResponse = {
  code: 200,
  message: 'success',
  data: {
    id: 'FL-2023-001',
    name: '医学图像分割',
    status: 'running',
    type: 'medical',
    algorithm: 'FedAvg算法',
    currentRound: 6,
    totalRounds: 10,
    accuracy: 89.4,
    loss: 0.245,
    createdAt: '2023-06-15 09:30',
    description: '使用3D CNN架构的医学图像分割联邦学习模型',
    config: {
      modelArchitecture: '3D U-Net',
      framework: 'PyTorch 1.13.1',
      dataset: 'Medical Imaging Dataset v2.1',
      batchSize: 32,
      learningRate: 0.001,
      optimizer: 'Adam',
      lossFunction: 'DiceLoss',
      clients: 8,
      minClients: 5,
      maxClients: 8,
      secureComm: true,
      secureAgg: true,
      differentialPrivacy: true
    },
    clients: [
      { id: 'client-01', name: 'Client-01', status: 'synced', gpu: 'NVIDIA A100' },
      { id: 'client-02', name: 'Client-02', status: 'synced', gpu: 'NVIDIA A100' },
      { id: 'client-03', name: 'Client-03', status: 'training', gpu: 'NVIDIA V100' },
      { id: 'client-04', name: 'Client-04', status: 'disconnected', gpu: 'NVIDIA RTX 3090' }
    ],
    metrics: {
      accuracy: [0.68, 0.72, 0.76, 0.79, 0.82, 0.85],
      loss: [1.245, 1.082, 0.941, 0.835, 0.752, 0.687],
      precision: [0.65, 0.69, 0.73, 0.76, 0.79, 0.82],
      recall: [0.62, 0.67, 0.71, 0.75, 0.78, 0.81],
      f1Score: [0.63, 0.68, 0.72, 0.75, 0.78, 0.81]
    }
  }
}

// 创建作业响应
const createJobResponse = {
  code: 200,
  message: '作业创建成功',
  data: {
    jobId: 'FL-2023-006',
    status: 'pending'
  }
}

// 中止作业响应
const abortJobResponse = {
  code: 200,
  message: '作业已中止',
  data: {
    jobId: 'FL-2023-001',
    status: 'aborted'
  }
}

// 作业指标响应
const jobMetricsResponse = {
  code: 200,
  message: 'success',
  data: {
    rounds: [1, 2, 3, 4, 5, 6],
    accuracy: [0.68, 0.72, 0.76, 0.79, 0.82, 0.85],
    loss: [1.245, 1.082, 0.941, 0.835, 0.752, 0.687],
    precision: [0.65, 0.69, 0.73, 0.76, 0.79, 0.82],
    recall: [0.62, 0.67, 0.71, 0.75, 0.78, 0.81],
    f1Score: [0.63, 0.68, 0.72, 0.75, 0.78, 0.81],
    trainingTime: ['12m 34s', '11m 56s', '13m 12s', '12m 45s', '13m 02s', '12m 51s']
  }
}

// Mock接口
Mock.mock(`${http}/job/list`, 'post', (options) => {
  // 可以根据请求参数过滤数据
  const params = JSON.parse(options.body)
  let records = jobListResponse.data.records

  // 状态过滤
  if (params.status) {
    records = records.filter((job) => job.status === params.status)
  }

  return {
    ...jobListResponse,
    data: {
      ...jobListResponse.data,
      records,
      total: records.length
    }
  }
})

Mock.mock(new RegExp(`${http}/job/detail/.*`), 'get', () => {
  return jobDetailResponse
})

Mock.mock(`${http}/job/create`, 'post', () => {
  return createJobResponse
})

Mock.mock(new RegExp(`${http}/job/abort/.*`), 'post', () => {
  return abortJobResponse
})

Mock.mock(new RegExp(`${http}/job/metrics/.*`), 'get', () => {
  return jobMetricsResponse
})

export default {
  jobListResponse,
  jobDetailResponse,
  createJobResponse,
  abortJobResponse,
  jobMetricsResponse
}