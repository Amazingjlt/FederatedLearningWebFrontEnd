<template>
  <div class="p-4">
    <!-- 页面标题和操作按钮 -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-white">设置</h1>
      <div class="flex gap-3">
        <button @click="resetToDefaults" class="btn-secondary" :disabled="loading">
          <i class="fas fa-undo mr-1"></i>
          <span>恢复默认</span>
        </button>
        <button @click="saveAllSettings" class="btn-primary" :disabled="loading">
          <i class="fas fa-save mr-1"></i>
          <span>{{ loading ? '保存中...' : '保存设置' }}</span>
        </button>
      </div>
    </div>

    <!-- 设置内容区域 -->
    <div class="flex flex-col md:flex-row gap-6">
      <!-- 左侧导航 -->
      <div class="md:w-64 flex-shrink-0">
        <nav class="bg-primary rounded-lg overflow-hidden">
          <div
            v-for="tab in tabs"
            :key="tab.id"
            class="setting-nav-item px-4 py-3 flex items-center cursor-pointer"
            :class="{ 'setting-nav-active': activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            <i :class="[tab.icon, 'w-5 h-5 mr-3']"></i>
            <span>{{ tab.name }}</span>
          </div>
        </nav>
      </div>

      <!-- 右侧内容区 -->
      <div class="flex-1">
        <!-- NVFLARE后端连接设置 -->
        <div v-show="activeTab === 'connection'" class="setting-tab-content">
          <div class="bg-primary rounded-lg p-6 mb-6">
            <h2 class="text-xl font-semibold mb-4 text-white">NVFLARE后端连接</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="form-label">Admin API端点</label>
                <input
                  type="text"
                  v-model="settings.connection.adminApiEndpoint"
                  class="form-input w-full"
                  placeholder="https://nvflare-api.example.com"
                />
              </div>
              <div>
                <label class="form-label">端口</label>
                <input
                  type="number"
                  v-model.number="settings.connection.port"
                  class="form-input w-full"
                  placeholder="8443"
                />
              </div>
              <div>
                <label class="form-label">协议</label>
                <select v-model="settings.connection.protocol" class="form-select w-full">
                  <option value="http">HTTP</option>
                  <option value="https">HTTPS</option>
                </select>
              </div>
              <div>
                <label class="form-label">证书上传</label>
                <input
                  type="file"
                  ref="certificateInput"
                  class="form-input w-full"
                  accept=".pem,.crt,.cer"
                  @change="handleCertificateUpload"
                />
                <p v-if="settings.connection.certificate" class="text-xs text-accent mt-1">
                  已选择: {{ settings.connection.certificate.name }}
                </p>
              </div>
            </div>
            <div class="mt-6 flex justify-end">
              <button
                @click="testConnection"
                class="btn-primary"
                :disabled="testingConnection"
              >
                <i v-if="testingConnection" class="fas fa-spinner fa-spin mr-1"></i>
                <i v-else class="fas fa-check-circle mr-1"></i>
                <span>{{ testingConnection ? '测试中...' : '测试连接' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 用户账户设置 -->
        <div v-show="activeTab === 'users'" class="setting-tab-content">
          <div class="bg-primary rounded-lg p-6 mb-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-white">用户账户</h2>
              <button @click="openAddUserModal" class="btn-primary">
                <i class="fas fa-plus mr-1"></i>
                <span>添加用户</span>
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th class="px-4 py-3 bg-secondary text-left text-xs font-medium text-gray-300 uppercase tracking-wider">用户名</th>
                    <th class="px-4 py-3 bg-secondary text-left text-xs font-medium text-gray-300 uppercase tracking-wider">角色</th>
                    <th class="px-4 py-3 bg-secondary text-left text-xs font-medium text-gray-300 uppercase tracking-wider">状态</th>
                    <th class="px-4 py-3 bg-secondary text-left text-xs font-medium text-gray-300 uppercase tracking-wider">邮箱</th>
                    <th class="px-4 py-3 bg-secondary text-left text-xs font-medium text-gray-300 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody class="bg-primary divide-y divide-gray-700">
                  <tr v-for="user in settings.users" :key="user.id">
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-200">{{ user.username }}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-200">{{ user.role }}</td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span
                        class="px-2 py-1 text-xs rounded-full"
                        :class="user.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'"
                      >
                        {{ user.status === 'active' ? '活跃' : '非活跃' }}
                      </span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-200">{{ user.email }}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <button @click="editUser(user)" class="text-accent hover:text-accent/80 mr-3">
                        <i class="fas fa-edit mr-1"></i>编辑
                      </button>
                      <button @click="deleteUser(user.id)" class="text-red-500 hover:text-red-400">
                        <i class="fas fa-trash mr-1"></i>删除
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 工作区设置 -->
        <div v-show="activeTab === 'workspace'" class="setting-tab-content">
          <div class="bg-primary rounded-lg p-6 mb-6">
            <h2 class="text-xl font-semibold mb-4 text-white">工作区设置</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="form-label">secure_workspace_path</label>
                <input
                  type="text"
                  v-model="settings.workspace.secureWorkspacePath"
                  class="form-input w-full"
                  placeholder="/opt/nvflare/secure_workspace"
                />
              </div>
              <div>
                <label class="form-label">poc_workspace_path</label>
                <input
                  type="text"
                  v-model="settings.workspace.pocWorkspacePath"
                  class="form-input w-full"
                  placeholder="/opt/nvflare/poc_workspace"
                />
              </div>
              <div class="md:col-span-2">
                <label class="form-label">部署模式</label>
                <select v-model="settings.workspace.deploymentMode" class="form-select w-full">
                  <option value="poc">POC</option>
                  <option value="production">Production</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- 加密与安全设置 -->
        <div v-show="activeTab === 'security'" class="setting-tab-content">
          <div class="bg-primary rounded-lg p-6 mb-6">
            <h2 class="text-xl font-semibold mb-4 text-white">加密与安全</h2>
            <div class="space-y-6">
              <div class="space-y-4">
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="enableSecureComm"
                    v-model="settings.security.enableSecureComm"
                    class="form-checkbox"
                  />
                  <label for="enableSecureComm" class="ml-2 text-sm text-gray-300">启用安全通信</label>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="enableSecureAgg"
                    v-model="settings.security.enableSecureAgg"
                    class="form-checkbox"
                  />
                  <label for="enableSecureAgg" class="ml-2 text-sm text-gray-300">安全聚合</label>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="enableDiffPrivacy"
                    v-model="settings.security.enableDiffPrivacy"
                    class="form-checkbox"
                    @change="toggleDpParams"
                  />
                  <label for="enableDiffPrivacy" class="ml-2 text-sm text-gray-300">差分隐私</label>
                </div>
              </div>

              <!-- 差分隐私参数 -->
              <div v-if="settings.security.enableDiffPrivacy" id="dpParams" class="pt-4 border-t border-gray-700">
                <h3 class="text-lg font-medium text-gray-200 mb-4">差分隐私参数</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="form-label">噪声级别</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      v-model.number="settings.security.noiseLevel"
                      class="form-input w-full"
                    />
                  </div>
                  <div>
                    <label class="form-label">裁剪范数</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      v-model.number="settings.security.clippingNorm"
                      class="form-input w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑用户模态框 -->
    <div
      v-if="showUserModal"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      @click.self="closeUserModal"
    >
      <div class="bg-secondary rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all">
        <div class="p-5 border-b border-gray-700 flex justify-between items-center">
          <h3 class="text-xl font-semibold">{{ editingUser ? '编辑用户' : '添加新用户' }}</h3>
          <button @click="closeUserModal" class="text-gray-400 hover:text-white">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="p-5">
          <form @submit.prevent="saveUser">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="form-label">用户名 *</label>
                <input
                  type="text"
                  v-model="userForm.username"
                  class="form-input w-full"
                  :disabled="editingUser"
                  required
                />
              </div>
              <div>
                <label class="form-label">全名 *</label>
                <input
                  type="text"
                  v-model="userForm.fullName"
                  class="form-input w-full"
                  required
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="form-label">邮箱 *</label>
                <input
                  type="email"
                  v-model="userForm.email"
                  class="form-input w-full"
                  required
                />
              </div>
              <div>
                <label class="form-label">角色 *</label>
                <select v-model="userForm.role" class="form-select w-full" required>
                  <option value="Admin">Admin</option>
                  <option value="Researcher">Researcher</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
            </div>

            <div v-if="!editingUser" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="form-label">密码 *</label>
                <input
                  type="password"
                  v-model="userForm.password"
                  class="form-input w-full"
                  :required="!editingUser"
                />
              </div>
              <div>
                <label class="form-label">确认密码 *</label>
                <input
                  type="password"
                  v-model="userForm.confirmPassword"
                  class="form-input w-full"
                  :required="!editingUser"
                />
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label">状态</label>
              <select v-model="userForm.status" class="form-select w-full">
                <option value="active">活跃</option>
                <option value="inactive">非活跃</option>
              </select>
            </div>
          </form>
        </div>

        <div class="p-5 border-t border-gray-700 flex justify-end space-x-3">
          <button @click="closeUserModal" class="btn-outline">取消</button>
          <button
            @click="saveUser"
            class="btn-primary"
            :disabled="userSaving"
          >
            <i v-if="userSaving" class="fas fa-spinner fa-spin mr-2"></i>
            <span>{{ userSaving ? '保存中...' : (editingUser ? '更新用户' : '添加用户') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 通知提示 -->
    <div
      ref="notification"
      class="fixed bottom-5 right-5 bg-accent text-white px-4 py-3 rounded-lg shadow-lg transform translate-y-20 opacity-0 transition-all duration-300 flex items-center"
      :class="{ 'translate-y-0 opacity-100': showNotification }"
    >
      <i class="fas fa-check-circle mr-2"></i>
      <span>{{ notificationMessage }}</span>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import {
  getSettings,
  saveSettings,
  testConnection,
  addUser,
  updateUser,
  deleteUser,
  resetToDefaults
} from '@/api/setting'

export default {
  name: 'Settings',
  setup() {
    // 标签页定义
    const tabs = [
      { id: 'connection', name: 'NVFLARE后端连接', icon: 'fas fa-plug' },
      { id: 'users', name: '用户账户', icon: 'fas fa-users' },
      { id: 'workspace', name: '工作区设置', icon: 'fas fa-folder' },
      { id: 'security', name: '加密与安全', icon: 'fas fa-shield-alt' }
    ]

    // 状态变量
    const activeTab = ref('connection')
    const loading = ref(false)
    const testingConnection = ref(false)
    const showNotification = ref(false)
    const notificationMessage = ref('')
    const certificateInput = ref(null)
    const notification = ref(null)

    // 设置数据
    const settings = ref({
      connection: {
        adminApiEndpoint: '',
        port: 8443,
        protocol: 'https',
        certificate: null
      },
      workspace: {
        secureWorkspacePath: '',
        pocWorkspacePath: '',
        deploymentMode: 'production'
      },
      security: {
        enableSecureComm: true,
        enableSecureAgg: true,
        enableDiffPrivacy: true,
        noiseLevel: 0.5,
        clippingNorm: 1.0
      },
      users: []
    })

    // 用户管理
    const showUserModal = ref(false)
    const editingUser = ref(false)
    const userSaving = ref(false)
    const userForm = reactive({
      id: '',
      username: '',
      fullName: '',
      email: '',
      role: 'Researcher',
      status: 'active',
      password: '',
      confirmPassword: ''
    })

    // 获取设置
    const fetchSettings = async () => {
      loading.value = true
      try {
        const res = await getSettings()
        if (res.code === 200) {
          settings.value = res.data
        }
      } catch (error) {
        console.error('获取设置失败', error)
        showNotificationMessage('获取设置失败')
      } finally {
        loading.value = false
      }
    }

    // 保存所有设置
    const saveAllSettings = async () => {
      loading.value = true
      try {
        const res = await saveSettings(settings.value)
        if (res.code === 200) {
          showNotificationMessage('设置保存成功')
        }
      } catch (error) {
        console.error('保存设置失败', error)
        showNotificationMessage('保存设置失败')
      } finally {
        loading.value = false
      }
    }

    // 测试连接
    const testConnectionHandler = async () => {
      testingConnection.value = true
      try {
        const params = {
          adminApiEndpoint: settings.value.connection.adminApiEndpoint,
          port: settings.value.connection.port,
          protocol: settings.value.connection.protocol
        }
        const res = await testConnection(params)
        if (res.code === 200) {
          showNotificationMessage(`连接成功！延迟: ${res.data.latency}ms, 版本: ${res.data.version}`)
        }
      } catch (error) {
        console.error('测试连接失败', error)
        showNotificationMessage('连接失败，请检查配置')
      } finally {
        testingConnection.value = false
      }
    }

    // 处理证书上传
    const handleCertificateUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        settings.value.connection.certificate = file
      }
    }

    // 切换差分隐私参数显示
    const toggleDpParams = () => {
      // 无需额外操作，v-model已经处理
    }

    // 打开添加用户模态框
    const openAddUserModal = () => {
      editingUser.value = false
      resetUserForm()
      showUserModal.value = true
    }

    // 编辑用户
    const editUser = (user) => {
      editingUser.value = true
      userForm.id = user.id
      userForm.username = user.username
      userForm.fullName = user.fullName
      userForm.email = user.email
      userForm.role = user.role
      userForm.status = user.status
      userForm.password = ''
      userForm.confirmPassword = ''
      showUserModal.value = true
    }

    // 保存用户
    const saveUser = async () => {
      // 表单验证
      if (!userForm.username || !userForm.fullName || !userForm.email || !userForm.role) {
        showNotificationMessage('请填写所有必填字段')
        return
      }

      if (!editingUser.value && (!userForm.password || !userForm.confirmPassword)) {
        showNotificationMessage('请填写密码')
        return
      }

      if (userForm.password !== userForm.confirmPassword) {
        showNotificationMessage('两次输入的密码不一致')
        return
      }

      userSaving.value = true
      try {
        if (editingUser.value) {
          // 更新用户
          const res = await updateUser(userForm.id, {
            fullName: userForm.fullName,
            email: userForm.email,
            role: userForm.role,
            status: userForm.status
          })
          if (res.code === 200) {
            showNotificationMessage('用户更新成功')
            closeUserModal()
            fetchSettings() // 刷新用户列表
          }
        } else {
          // 添加用户
          const res = await addUser({
            username: userForm.username,
            fullName: userForm.fullName,
            email: userForm.email,
            role: userForm.role,
            status: userForm.status,
            password: userForm.password
          })
          if (res.code === 200) {
            showNotificationMessage('用户添加成功')
            closeUserModal()
            fetchSettings() // 刷新用户列表
          }
        }
      } catch (error) {
        console.error('保存用户失败', error)
        showNotificationMessage('保存用户失败')
      } finally {
        userSaving.value = false
      }
    }

    // 删除用户
    const deleteUserHandler = async (userId) => {
      if (!confirm('确定要删除此用户吗？此操作无法撤销。')) return

      try {
        const res = await deleteUser(userId)
        if (res.code === 200) {
          showNotificationMessage('用户删除成功')
          fetchSettings() // 刷新用户列表
        }
      } catch (error) {
        console.error('删除用户失败', error)
        showNotificationMessage('删除用户失败')
      }
    }

    // 重置用户表单
    const resetUserForm = () => {
      userForm.id = ''
      userForm.username = ''
      userForm.fullName = ''
      userForm.email = ''
      userForm.role = 'Researcher'
      userForm.status = 'active'
      userForm.password = ''
      userForm.confirmPassword = ''
    }

    // 关闭用户模态框
    const closeUserModal = () => {
      showUserModal.value = false
      resetUserForm()
    }

    // 重置为默认设置
    const resetToDefaultsHandler = async () => {
      if (!confirm('确定要恢复默认设置吗？此操作无法撤销。')) return

      loading.value = true
      try {
        const res = await resetToDefaults()
        if (res.code === 200) {
          showNotificationMessage('已恢复默认设置')
          fetchSettings() // 重新加载设置
        }
      } catch (error) {
        console.error('恢复默认设置失败', error)
        showNotificationMessage('恢复默认设置失败')
      } finally {
        loading.value = false
      }
    }

    // 显示通知消息
    const showNotificationMessage = (message) => {
      notificationMessage.value = message
      showNotification.value = true

      setTimeout(() => {
        showNotification.value = false
      }, 3000)
    }

    // 初始化
    onMounted(() => {
      fetchSettings()
    })

    return {
      tabs,
      activeTab,
      loading,
      testingConnection,
      settings,
      showUserModal,
      editingUser,
      userSaving,
      userForm,
      showNotification,
      notificationMessage,
      notification,
      certificateInput,
      testConnection: testConnectionHandler,
      handleCertificateUpload,
      toggleDpParams,
      openAddUserModal,
      editUser,
      saveUser,
      deleteUser: deleteUserHandler,
      closeUserModal,
      saveAllSettings,
      resetToDefaults: resetToDefaultsHandler
    }
  }
}
</script>

<style scoped>
.setting-nav-item {
  @apply flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-secondary transition-all duration-200 cursor-pointer;
}

.setting-nav-active {
  @apply bg-secondary text-accent relative;
}

.setting-nav-active::before {
  content: '';
  @apply absolute left-0 top-0 h-full w-1 bg-accent;
}

.btn-primary {
  @apply bg-accent hover:bg-accent/90 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply bg-secondary hover:bg-secondary/80 text-gray-200 font-medium py-2 px-4 rounded-md transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-outline {
  @apply border border-gray-600 hover:border-accent hover:text-accent text-white font-medium py-2 px-4 rounded-md transition-all duration-200 flex items-center gap-2;
}

.form-input {
  @apply bg-primary border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

/* 修复：将背景图片移到单独的类中 */
.form-select {
  @apply bg-primary border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors appearance-none pr-8;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-size: 1em;
  background-repeat: no-repeat;
}

.form-label {
  @apply block text-sm font-medium text-gray-300 mb-1;
}

.form-checkbox {
  @apply w-4 h-4 text-accent bg-secondary border-gray-700 rounded focus:ring-accent/50 transition-colors;
}

.setting-tab-content {
  @apply transition-opacity duration-200;
}
</style>