<template>
  <div class="min-h-screen bg-slate-950 flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl">
      <h1 class="text-2xl font-bold text-white mb-1">联邦学习平台</h1>
      <p class="text-slate-400 text-sm mb-6">请输入账号密码登录</p>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <div>
          <label class="block text-sm text-slate-300 mb-1">用户名</label>
          <input
            v-model.trim="username"
            type="text"
            placeholder="请输入用户名"
            class="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 outline-none focus:border-lime-500"
          />
        </div>
        <div>
          <label class="block text-sm text-slate-300 mb-1">密码</label>
          <input
            v-model="password"
            type="password"
            placeholder="请输入密码"
            class="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 outline-none focus:border-lime-500"
          />
        </div>

        <p v-if="errorMsg" class="text-sm text-red-400">{{ errorMsg }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-lime-600 hover:bg-lime-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2 rounded-md transition"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <p class="text-xs text-slate-500 mt-4">
        测试账号：admin / 123456
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  errorMsg.value = ''
  if (!username.value || !password.value) {
    errorMsg.value = '请输入用户名和密码'
    return
  }

  loading.value = true
  try {
    if (username.value === 'admin' && password.value === '123456') {
      localStorage.setItem('token', 'mock-admin-token')
      localStorage.setItem('username', 'admin')
      await router.replace('/fl/dashboard')
      return
    }
    errorMsg.value = '用户名或密码错误'
  } finally {
    loading.value = false
  }
}
</script>

