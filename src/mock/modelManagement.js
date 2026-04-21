import Mock from 'mockjs'

const http = import.meta.env.VITE_API_BASE_URL || '/api'

// 模型列表响应
const modelListResponse = {
  code: 200,
  message: 'success',
  data: {
    records: [
      {
        id: 'model-1',
        name: 'ResNet-50 联邦学习模型',
        jobId: 'FL-JOB-2023-0589',
        accuracy: 92.4,
        loss: 0.28,
        createdAt: '2023-05-15 14:30',
        framework: 'PyTorch 1.12.1',
        parameters: '25.6M',
        size: '98.2 MB'
      },
      {
        id: 'model-2',
        name: 'MobileNetV2 FL Model',
        jobId: 'FL-JOB-2023-0572',
        accuracy: 89.7,
        loss: 0.35,
        createdAt: '2023-05-10 09:15',
        framework: 'TensorFlow 2.9.1',
        parameters: '3.5M',
        size: '14.2 MB'
      },
      {
        id: 'model-3',
        name: 'CNN-LSTM Hybrid Model',
        jobId: 'FL-JOB-2023-0541',
        accuracy: 87.3,
        loss: 0.42,
        createdAt: '2023-05-05 16:45',
        framework: 'PyTorch 1.11.0',
        parameters: '12.8M',
        size: '49.6 MB'
      },
      {
        id: 'model-4',
        name: 'Transformer Base Model',
        jobId: 'FL-JOB-2023-0512',
        accuracy: 90.8,
        loss: 0.31,
        createdAt: '2023-04-28 11:20',
        framework: 'TensorFlow 2.8.0',
        parameters: '86.4M',
        size: '340.5 MB'
      }
    ],
    total: 24,
    pageNo: 1,
    pageSize: 10
  }
}

// 模型详情响应
const modelDetailResponse = {
  code: 200,
  message: 'success',
  data: {
    id: 'model-1',
    name: 'ResNet-50 联邦学习模型',
    jobId: 'FL-JOB-2023-0589',
    accuracy: 92.4,
    loss: 0.28,
    createdAt: '2023-05-15 14:30',
    framework: 'PyTorch 1.12.1',
    parameters: '25.6M',
    size: '98.2 MB',
    architecture: 'ResNet-50',
    dataset: 'ImageNet-1K',
    rounds: 10,
    clients: 8,
    metrics: {
      accuracy: [72, 78, 82, 85, 87, 89, 90, 91, 91.8, 92.4],
      loss: [0.85, 0.72, 0.63, 0.55, 0.48, 0.42, 0.38, 0.34, 0.30, 0.28],
      precision: [0.70, 0.76, 0.80, 0.83, 0.85, 0.87, 0.88, 0.89, 0.90, 0.91],
      recall: [0.68, 0.74, 0.79, 0.82, 0.84, 0.86, 0.87, 0.88, 0.89, 0.90]
    }
  }
}

// 模型比较数据
const modelComparisonResponse = {
  code: 200,
  message: 'success',
  data: {
    models: ['ResNet-50', 'MobileNetV2', 'CNN-LSTM', 'Transformer'],
    accuracy: [92.4, 89.7, 87.3, 90.8],
    loss: [0.28, 0.35, 0.42, 0.31],
    rounds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    model1: {
      name: 'ResNet-50 FL Model',
      accuracy: [72, 78, 82, 85, 87, 89, 90, 91, 91.8, 92.4],
      loss: [0.85, 0.72, 0.63, 0.55, 0.48, 0.42, 0.38, 0.34, 0.30, 0.28]
    },
    model2: {
      name: 'Transformer Base Model',
      accuracy: [70, 75, 80, 83, 86, 88, 89.5, 90.2, 90.5, 90.8],
      loss: [0.92, 0.80, 0.70, 0.62, 0.55, 0.48, 0.42, 0.38, 0.34, 0.31]
    }
  }
}

// 上传模型响应
const uploadModelResponse = {
  code: 200,
  message: '模型上传成功',
  data: {
    modelId: 'model-5',
    status: 'uploaded',
    name: 'New Uploaded Model',
    jobId: 'FL-JOB-2023-0601',
    framework: 'PyTorch',
    architecture: 'ResNet-50',
    fileName: 'uploaded_model.pth',
    createdAt: '2023-06-20 10:30'
  }
}

// Mock接口
Mock.mock(`${http}/model/list`, 'post', (options) => {
  const params = JSON.parse(options.body)
  let records = modelListResponse.data.records

  // 搜索过滤
  if (params.keyword) {
    records = records.filter(
      (model) =>
        model.name.includes(params.keyword) || model.jobId.includes(params.keyword)
    )
  }

  return {
    ...modelListResponse,
    data: {
      ...modelListResponse.data,
      records,
      total: records.length
    }
  }
})

Mock.mock(new RegExp(`${http}/model/detail/.*`), 'get', () => {
  return modelDetailResponse
})

Mock.mock(`${http}/model/comparison`, 'post', () => {
  return modelComparisonResponse
})

Mock.mock(`${http}/model/upload`, 'post', (options) => {
  let formData = {}
  if (options.body && typeof options.body.get === 'function') {
    formData = {
      name: options.body.get('name'),
      job_id: options.body.get('job_id'),
      framework: options.body.get('framework'),
      architecture: options.body.get('architecture'),
      file: options.body.get('file')
    }
  } else if (typeof options.body === 'string') {
    try {
      formData = JSON.parse(options.body)
    } catch (e) {
      formData = {}
    }
  }

  if (!formData.file) {
    return {
      code: 400,
      message: '缺少模型文件，请上传 file 字段',
      data: null
    }
  }

  const modelId = `model-${modelListResponse.data.records.length + 1}`
  const createdAt = Mock.Random.datetime('yyyy-MM-dd HH:mm')
  const newRecord = {
    id: modelId,
    name: formData.name || uploadModelResponse.data.name,
    jobId: formData.job_id || '',
    accuracy: 0,
    loss: 0,
    createdAt,
    framework: formData.framework || 'PyTorch',
    parameters: '-',
    size: `${(((formData.file && formData.file.size) || 0) / (1024 * 1024)).toFixed(1)} MB`
  }

  modelListResponse.data.records.unshift(newRecord)
  modelListResponse.data.total = modelListResponse.data.records.length

  return {
    ...uploadModelResponse,
    data: {
      ...uploadModelResponse.data,
      modelId,
      name: newRecord.name,
      jobId: formData.job_id || '',
      framework: formData.framework || 'PyTorch',
      architecture: formData.architecture || 'ResNet-50',
      fileName: formData.file?.name || uploadModelResponse.data.fileName,
      createdAt
    }
  }
})

Mock.mock(new RegExp(`${http}/model/validate/.*`), 'post', (options) => {
  const id = options.url.split('/').pop()
  const model = modelListResponse.data.records.find((m) => String(m.id) === String(id))

  if (!model) {
    return {
      code: 404,
      message: '模型不存在',
      data: null
    }
  }

  const accuracy = Number(model.accuracy || 0)
  const loss = Number(model.loss || 0)
  const precision = Number((Math.max(0, accuracy - 1.2)).toFixed(2))
  const recall = Number((Math.max(0, accuracy - 1.8)).toFixed(2))
  const f1 = Number(((2 * precision * recall) / Math.max(precision + recall, 1e-6)).toFixed(2))
  const thresholds = {
    minAccuracy: 85,
    maxLoss: 0.5,
    minPrecision: 84,
    minRecall: 83,
    minF1: 83.5
  }
  const checks = {
    loadable: true,
    inferenceOk: true,
    ioShapeOk: true,
    noNaN: true,
    noCrash: true
  }

  const metricPass = {
    accuracy: accuracy >= thresholds.minAccuracy,
    loss: loss <= thresholds.maxLoss,
    precision: precision >= thresholds.minPrecision,
    recall: recall >= thresholds.minRecall,
    f1: f1 >= thresholds.minF1
  }

  const passed = Object.values(checks).every(Boolean) && Object.values(metricPass).every(Boolean)

  return {
    code: 200,
    message: '验证完成',
    data: {
      modelId: model.id,
      modelName: model.name,
      status: passed ? 'passed' : 'failed',
      score: accuracy,
      validatedAt: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
      checks,
      metrics: {
        accuracy,
        loss,
        precision,
        recall,
        f1,
        latencyMs: Mock.Random.integer(18, 65),
        throughputQps: Mock.Random.integer(42, 120)
      },
      thresholds,
      metricPass,
      decision: passed ? 'can_deploy' : 'need_retrain',
      summary: passed
        ? '模型可用且指标达标，允许部署或下载。'
        : '模型可加载，但部分指标未达阈值，建议继续训练。'
    }
  }
})

Mock.mock(new RegExp(`${http}/model/delete/.*`), 'post', (options) => {
  const id = options.url.split('/').pop()
  const before = modelListResponse.data.records.length
  modelListResponse.data.records = modelListResponse.data.records.filter(
    (m) => String(m.id) !== String(id)
  )
  const after = modelListResponse.data.records.length
  modelListResponse.data.total = after

  if (after === before) {
    return {
      code: 404,
      message: '模型不存在',
      data: null
    }
  }

  return {
    code: 200,
    message: '模型删除成功',
    data: { id }
  }
})

Mock.mock(new RegExp(`${http}/model/download/.*`), 'get', (options) => {
  const id = options.url.split('/').pop()
  const model = modelListResponse.data.records.find((m) => String(m.id) === String(id))

  if (!model) {
    return {
      code: 404,
      message: '模型不存在',
      data: null
    }
  }

  return `Mock model file for ${model.id} - ${model.name}`
})

export default {
  modelListResponse,
  modelDetailResponse,
  modelComparisonResponse,
  uploadModelResponse
}
