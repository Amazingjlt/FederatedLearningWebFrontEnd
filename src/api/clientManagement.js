import request from '@/utils/request'

// 获取客户端列表
export const getClientList = (pageNo, pageSize, params) => {
  return request({
    url: '/client/list',
    method: 'post',
    data: {
      pageNo,
      pageSize,
      ...params
    }
  })
}

// 获取客户端详情
export const getClientDetail = (clientId) => {
  return request({
    url: `/client/detail/${clientId}`,
    method: 'get'
  })
}

// 添加客户端
export const addClient = (data) => {
  return request({
    url: '/client/add',
    method: 'post',
    data
  })
}

// 删除客户端
export const deleteClient = (clientId) => {
  return request({
    url: `/client/delete/${clientId}`,
    method: 'post'
  })
}

// 更新客户端信息
export const updateClient = (clientId, data) => {
  return request({
    url: `/client/update/${clientId}`,
    method: 'post',
    data
  })
}

// 重新连接客户端
export const reconnectClient = (clientId) => {
  return request({
    url: `/client/reconnect/${clientId}`,
    method: 'post'
  })
}