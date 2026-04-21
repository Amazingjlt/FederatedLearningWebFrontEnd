import Mock from 'mockjs'

const http = import.meta.env.VITE_API_BASE_URL || '/api'

// 数据质量统计响应
const dataQualityStatsResponse = {
  code: 200,
  message: 'success',
  data: {
    totalSamples: 286451,
    missingRate: 2.8,
    imbalanceScore: 1.76,
    noiseLevel: 3.2,
    criticalWarnings: 12,
    warnings: 28,
    infoAlerts: 45
  }
}

// 节点质量数据
const nodeQualityDataResponse = {
  code: 200,
  message: 'success',
  data: [
    {
      nodeId: 'FL-001',
      name: 'Node-001',
      quality: 92.5,
      samples: 5240,
      missingRate: 1.2,
      noiseLevel: 2.1,
      updatedAt: '2026-04-20 09:30:00',
      x: 23.5,
      y: 45.2,
      z: 67.8,
      category: 'high'
    },
    {
      nodeId: 'FL-002',
      name: 'Node-002',
      quality: 88.3,
      samples: 4850,
      missingRate: 2.5,
      noiseLevel: 2.8,
      updatedAt: '2026-04-19 15:10:00',
      x: 56.2,
      y: 34.7,
      z: 78.3,
      category: 'high'
    },
    {
      nodeId: 'FL-003',
      name: 'Node-003',
      quality: 65.7,
      samples: 3920,
      missingRate: 5.8,
      noiseLevel: 4.2,
      updatedAt: '2026-04-16 11:20:00',
      x: 78.9,
      y: 23.4,
      z: 45.6,
      category: 'medium'
    },
    {
      nodeId: 'FL-004',
      name: 'Node-004',
      quality: 35.2,
      samples: 2340,
      missingRate: 15.3,
      noiseLevel: 8.5,
      updatedAt: '2026-03-28 20:05:00',
      x: 12.3,
      y: 67.8,
      z: 34.2,
      category: 'low'
    }
  ]
}

// 数据分布响应
const dataDistributionResponse = {
  code: 200,
  message: 'success',
  data: {
    highQuality: 65,
    mediumQuality: 25,
    lowQuality: 10
  }
}

// 警告列表响应
const warningListResponse = {
  code: 200,
  message: 'success',
  data: {
    records: [
      {
        id: 'warn-001',
        type: 'critical',
        nodeId: 'FL-842',
        title: '节点 #FL-842 严重数据缺失',
        message: '节点数据缺失率超过阈值 (15.8% > 10%)，可能影响模型训练',
        timestamp: '10分钟前'
      },
      {
        id: 'warn-002',
        type: 'warning',
        nodeId: 'FL-319',
        title: '节点 #FL-319 数据不平衡',
        message: '数据类别分布不平衡，最大类别占比达68%',
        timestamp: '35分钟前'
      },
      {
        id: 'warn-003',
        type: 'info',
        nodeId: 'FL-552',
        title: '节点 #FL-552 噪声水平增加',
        message: '数据噪声水平较上次检测增加0.8个百分点',
        timestamp: '2小时前'
      },
      {
        id: 'warn-004',
        type: 'critical',
        nodeId: 'FL-107',
        title: '节点 #FL-107 连接中断',
        message: '节点已超过3小时未发送数据更新，连接可能中断',
        timestamp: '3小时前'
      },
      {
        id: 'warn-005',
        type: 'warning',
        nodeId: 'FL-621',
        title: 'Node #FL-621 Data Drift Detected',
        message: 'Data distribution drift detected, 12.3% difference from baseline distribution',
        timestamp: '5小时前'
      }
    ],
    total: 85,
    pageNo: 1,
    pageSize: 10
  }
}

// Mock接口
Mock.mock(`${http}/dataQuality/stats`, 'get', () => {
  return dataQualityStatsResponse
})

Mock.mock(`${http}/dataQuality/nodes`, 'get', () => {
  return nodeQualityDataResponse
})

Mock.mock(`${http}/dataQuality/distribution`, 'get', () => {
  return dataDistributionResponse
})

Mock.mock(`${http}/dataQuality/warnings`, 'post', (options) => {
  const params = JSON.parse(options.body)
  let records = warningListResponse.data.records

  // 类型过滤
  if (params.type) {
    records = records.filter((warning) => warning.type === params.type)
  }

  return {
    ...warningListResponse,
    data: {
      ...warningListResponse.data,
      records,
      total: records.length
    }
  }
})

export default {
  dataQualityStatsResponse,
  nodeQualityDataResponse,
  dataDistributionResponse,
  warningListResponse
}
