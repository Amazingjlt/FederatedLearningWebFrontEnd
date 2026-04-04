import request from '@/utils/request'

// 获取数据质量统计
export const getDataQualityStats = () => {
  return request({
    url: '/dataQuality/stats',
    method: 'get'
  })
}

// 获取节点质量数据
export const getNodeQualityData = () => {
  return request({
    url: '/dataQuality/nodes',
    method: 'get'
  })
}

// 获取数据分布
export const getDataDistribution = () => {
  return request({
    url: '/dataQuality/distribution',
    method: 'get'
  })
}

// 获取警告列表
export const getWarningList = (pageNo, pageSize, params) => {
  return request({
    url: '/dataQuality/warnings',
    method: 'post',
    data: {
      pageNo,
      pageSize,
      ...params
    }
  })
}

// 生成数据质量报告
export const generateQualityReport = (params) => {
  return request({
    url: '/dataQuality/report',
    method: 'post',
    data: params,
    responseType: 'blob'
  })
}