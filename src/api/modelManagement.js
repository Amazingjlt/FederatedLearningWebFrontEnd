import request from '@/utils/request'

// 获取模型列表
export const getModelList = (pageNo, pageSize, params) => {
  return request({
    url: '/model/list',
    method: 'post',
    data: {
      pageNo,
      pageSize,
      ...params
    }
  })
}

// 获取模型详情
export const getModelDetail = (modelId) => {
  return request({
    url: `/model/detail/${modelId}`,
    method: 'get'
  })
}

// 上传模型
export const uploadModel = (data) => {
  return request({
    url: '/model/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 下载模型
export const downloadModel = (modelId) => {
  return request({
    url: `/model/download/${modelId}`,
    method: 'get',
    responseType: 'blob'
  })
}

// 验证模型
export const validateModel = (modelId) => {
  return request({
    url: `/model/validate/${modelId}`,
    method: 'post'
  })
}

// 模型比较
export const compareModels = (modelIds) => {
  return request({
    url: '/model/comparison',
    method: 'post',
    data: { modelIds }
  })
}

// 删除模型
export const deleteModel = (modelId) => {
  return request({
    url: `/model/delete/${modelId}`,
    method: 'post'
  })
}