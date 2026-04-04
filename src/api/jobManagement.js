import request from '@/utils/request'

// 获取作业列表
export const getJobList = (pageNo, pageSize, params) => {
  return request({
    url: '/job/list',
    method: 'post',
    data: {
      pageNo,
      pageSize,
      ...params
    }
  })
}

// 获取作业详情
export const getJobDetail = (jobId) => {
  return request({
    url: `/job/detail/${jobId}`,
    method: 'get'
  })
}

// 创建新作业
export const createJob = (data) => {
  return request({
    url: '/job/create',
    method: 'post',
    data
  })
}

// 中止作业
export const abortJob = (jobId) => {
  return request({
    url: `/job/abort/${jobId}`,
    method: 'post'
  })
}

// 下载作业日志
export const downloadJobLogs = (jobId) => {
  return request({
    url: `/job/logs/${jobId}`,
    method: 'get',
    responseType: 'blob'
  })
}

// 获取作业指标
export const getJobMetrics = (jobId) => {
  return request({
    url: `/job/metrics/${jobId}`,
    method: 'get'
  })
}