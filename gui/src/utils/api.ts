/**
 * API 请求工具函数
 * 统一处理认证错误（401）— 清除 token 并跳转登录页
 */

/**
 * 清除本地 token 并触发登出事件（通过 React 状态管理跳转登录页，不刷新页面）
 */
function handleAuthError(): void {
  localStorage.removeItem('boluo_auth_token')
  // 触发全局登出事件，App.tsx 监听后会切换到登录页
  window.dispatchEvent(new CustomEvent('auth-logout'))
}

/**
 * 检查响应状态，如果是 401 则处理认证错误
 * @returns true 表示需要中断后续处理（已触发跳转）
 */
export function checkAuthError(response: Response): boolean {
  if (response.status === 401) {
    handleAuthError()
    return true
  }
  return false
}

/**
 * 统一的 fetch 包装函数，自动处理 401 错误
 */
export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('boluo_auth_token') || ''
  
  const headers = new Headers(options.headers || {})
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  
  const response = await fetch(url, {
    ...options,
    headers
  })
  
  // 检查 401 错误
  if (response.status === 401) {
    handleAuthError()
    // 抛出错误以中断后续处理
    throw new Error('Authentication failed')
  }
  
  return response
}

/**
 * 获取当前 auth token（供外部使用）
 */
export function getAuthToken(): string {
  return localStorage.getItem('boluo_auth_token') || ''
}
