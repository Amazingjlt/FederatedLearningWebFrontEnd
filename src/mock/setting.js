import Mock from 'mockjs'

const http = import.meta.env.VITE_API_BASE_URL || '/api'

// 获取设置响应
const getSettingsResponse = {
  code: 200,
  message: 'success',
  data: {
    connection: {
      adminApiEndpoint: 'https://nvflare-api.example.com',
      port: 8443,
      protocol: 'https',
      certificate: null
    },
    workspace: {
      secureWorkspacePath: '/opt/nvflare/secure_workspace',
      pocWorkspacePath: '/opt/nvflare/poc_workspace',
      deploymentMode: 'production'
    },
    security: {
      enableSecureComm: true,
      enableSecureAgg: true,
      enableDiffPrivacy: true,
      noiseLevel: 0.5,
      clippingNorm: 1.0
    },
    users: [
      {
        id: 'user-1',
        username: 'admin',
        role: 'Admin',
        status: 'active',
        email: 'admin@federatedlearning.com',
        fullName: 'Admin User'
      },
      {
        id: 'user-2',
        username: 'researcher1',
        role: 'Researcher',
        status: 'active',
        email: 'researcher1@federatedlearning.com',
        fullName: 'Researcher One'
      },
      {
        id: 'user-3',
        username: 'viewer1',
        role: 'Viewer',
        status: 'inactive',
        email: 'viewer1@federatedlearning.com',
        fullName: 'Viewer One'
      }
    ]
  }
}

// 保存设置响应
const saveSettingsResponse = {
  code: 200,
  message: '设置保存成功',
  data: null
}

// 测试连接响应
const testConnectionResponse = {
  code: 200,
  message: '连接测试成功',
  data: {
    status: 'connected',
    latency: 45,
    version: 'NVFLARE 2.3.0'
  }
}

// 添加用户响应
const addUserResponse = {
  code: 200,
  message: '用户添加成功',
  data: {
    userId: 'user-4',
    username: 'newuser'
  }
}

// 删除用户响应
const deleteUserResponse = {
  code: 200,
  message: '用户删除成功',
  data: null
}

// Mock接口
Mock.mock(`${http}/settings/get`, 'get', () => {
  return getSettingsResponse
})

Mock.mock(`${http}/settings/save`, 'post', () => {
  return saveSettingsResponse
})

Mock.mock(`${http}/settings/testConnection`, 'post', () => {
  // 模拟延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(testConnectionResponse)
    }, 1500)
  })
})

Mock.mock(`${http}/settings/user/add`, 'post', () => {
  return addUserResponse
})

Mock.mock(new RegExp(`${http}/settings/user/delete/.*`), 'post', () => {
  return deleteUserResponse
})

export default {
  getSettingsResponse,
  saveSettingsResponse,
  testConnectionResponse,
  addUserResponse,
  deleteUserResponse
}