import request from '@/utils/request'

// 获取仪表盘统计数据
export const getDashboardStats = () => {
  return request({
    url: '/dashboard/stats',
    method: 'get'
  })
}

// 获取客户端列表
export const getClientList = () => {
  return request({
    url: '/dashboard/clients',
    method: 'get'
  })
}

// 获取当前作业进度
export const getCurrentJobProgress = () => {
  return request({
    url: '/dashboard/currentJob',
    method: 'get'
  })
}

// 获取实时日志
export const getRealTimeLogs = () => {
  return request({
    url: '/dashboard/logs',
    method: 'get'
  })
}

// 获取图表数据
export const getChartData = (type) => {
  return request({
    url: `/dashboard/chart/${type}`,
    method: 'get'
  })
}