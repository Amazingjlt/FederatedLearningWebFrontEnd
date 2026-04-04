import request from '@/utils/request'

// 获取所有设置
export const getSettings = () => {
  return request({
    url: '/settings/get',
    method: 'get'
  })
}

// 保存设置
export const saveSettings = (data) => {
  return request({
    url: '/settings/save',
    method: 'post',
    data
  })
}

// 测试连接
export const testConnection = (params) => {
  return request({
    url: '/settings/testConnection',
    method: 'post',
    data: params
  })
}

// 添加用户
export const addUser = (data) => {
  return request({
    url: '/settings/user/add',
    method: 'post',
    data
  })
}

// 更新用户
export const updateUser = (userId, data) => {
  return request({
    url: `/settings/user/update/${userId}`,
    method: 'post',
    data
  })
}

// 删除用户
export const deleteUser = (userId) => {
  return request({
    url: `/settings/user/delete/${userId}`,
    method: 'post'
  })
}

// 重置为默认设置
export const resetToDefaults = () => {
  return request({
    url: '/settings/reset',
    method: 'post'
  })
}