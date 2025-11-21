import axios from 'axios';

// API基础配置
const API_BASE_URL = 'http://localhost:3001'; // 后端服务地址

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API请求: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API请求错误:', error);
    if (error.response) {
      // 服务器返回错误状态码
      const message = error.response.data?.message || `服务器错误: ${error.response.status}`;
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // 请求已发送但无响应
      return Promise.reject(new Error('网络连接错误，请检查后端服务是否启动'));
    } else {
      // 其他错误
      return Promise.reject(new Error(error.message));
    }
  }
);

// API服务类
export class LuoguApiService {
  /**
   * 获取最近更新的文章列表
   * @param {number} count - 文章数量
   * @returns {Promise<Array>} 文章列表
   */
  static async getRecentArticles(count = 10) {
    try {
      const response = await apiClient.get(`/api/articles/recent?count=${count}`);
      return response;
    } catch (error) {
      console.error('获取最近文章失败:', error);
      throw error;
    }
  }

  /**
   * 根据ID获取文章详情
   * @param {string} id - 文章ID
   * @returns {Promise<Object>} 文章详情
   */
  static async getArticleById(id) {
    try {
      const response = await apiClient.get(`/api/articles/${id}`);
      return response;
    } catch (error) {
      console.error(`获取文章 ${id} 失败:`, error);
      throw error;
    }
  }

  /**
   * 保存文章到后端
   * @param {string} id - 文章ID
   * @returns {Promise<Object>} 保存结果
   */
  static async saveArticle(id) {
    try {
      const response = await apiClient.post('/api/articles/save', {
        articleId: id
      });
      return response;
    } catch (error) {
      console.error(`保存文章 ${id} 失败:`, error);
      throw error;
    }
  }

  /**
   * 使用Cookie保存文章到后端
   * @param {string} id - 文章ID
   * @param {string} cookie - 洛谷登录Cookie
   * @returns {Promise<Object>} 保存结果
   */
  static async saveArticleWithCookie(id, cookie) {
    try {
      const response = await apiClient.post('/api/articles/save', {
        articleId: id,
        cookie: cookie
      });
      return response;
    } catch (error) {
      console.error(`使用Cookie保存文章 ${id} 失败:`, error);
      throw error;
    }
  }

  /**
   * 无需登录直接保存文章（公开接口）
   * @param {string} id - 文章ID
   * @param {string} cookie - 洛谷登录Cookie（可选）
   * @returns {Promise<Object>} 保存结果
   */
  static async saveArticlePublic(id, cookie = '') {
    try {
      const response = await apiClient.post('/api/articles/save-public', {
        articleId: id,
        cookie: cookie
      });
      return response;
    } catch (error) {
      console.error(`公开保存文章 ${id} 失败:`, error);
      throw error;
    }
  }

  /**
   * 搜索文章
   * @param {string} query - 搜索关键词
   * @param {number} page - 页码
   * @param {number} limit - 每页数量
   * @returns {Promise<Object>} 搜索结果
   */
  static async searchArticles(query, page = 1, limit = 20) {
    try {
      const response = await apiClient.get(`/api/articles/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error('搜索文章失败:', error);
      throw error;
    }
  }

  /**
   * 获取统计信息
   * @returns {Promise<Object>} 统计信息
   */
  static async getStatistics() {
    try {
      const response = await apiClient.get('/api/statistics');
      return response;
    } catch (error) {
      console.error('获取统计信息失败:', error);
      throw error;
    }
  }

  /**
   * 根据任务ID查询任务状态
   * @param {string} taskId - 任务ID
   * @returns {Promise<Object>} 任务状态
   */
  static async getTaskById(taskId) {
    try {
      const response = await apiClient.get(`/api/tasks/${taskId}`);
      return response;
    } catch (error) {
      console.error(`获取任务 ${taskId} 状态失败:`, error);
      throw error;
    }
  }

  /**
   * 获取任务列表
   * @param {number} page - 页码
   * @param {number} limit - 每页数量
   * @returns {Promise<Object>} 任务列表
   */
  static async getTasks(page = 1, limit = 20) {
    try {
      const response = await apiClient.get(`/api/tasks?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error('获取任务列表失败:', error);
      throw error;
    }
  }

  /**
   * 根据ID获取剪切板详情
   * @param {string} id - 剪切板ID
   * @returns {Promise<Object>} 剪切板详情
   */
  static async getPasteById(id) {
    try {
      const response = await apiClient.get(`/api/pastes/${id}`);
      return response;
    } catch (error) {
      console.error(`获取剪切板 ${id} 失败:`, error);
      throw error;
    }
  }

  /**
   * 保存剪切板到后端
   * @param {string} id - 剪切板ID
   * @returns {Promise<Object>} 保存结果
   */
  static async savePaste(id) {
    try {
      const response = await apiClient.post('/api/pastes/save', {
        pasteId: id
      });
      return response;
    } catch (error) {
      console.error(`保存剪切板 ${id} 失败:`, error);
      throw error;
    }
  }

  /**
   * 使用Cookie保存剪切板到后端
   * @param {string} id - 剪切板ID
   * @param {string} cookie - 洛谷登录Cookie
   * @returns {Promise<Object>} 保存结果
   */
  static async savePasteWithCookie(id, cookie) {
    try {
      const response = await apiClient.post('/api/pastes/save', {
        pasteId: id,
        cookie: cookie
      });
      return response;
    } catch (error) {
      console.error(`使用Cookie保存剪切板 ${id} 失败:`, error);
      throw error;
    }
  }

  /**
   * 获取剪切板列表
   * @param {number} page - 页码
   * @param {number} limit - 每页数量
   * @param {string} authorUid - 作者UID（可选）
   * @returns {Promise<Object>} 剪切板列表
   */
  static async getPastes(page = 1, limit = 20, authorUid = '') {
    try {
      let url = `/api/pastes?page=${page}&limit=${limit}`;
      if (authorUid) {
        url += `&authorUid=${authorUid}`;
      }
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('获取剪切板列表失败:', error);
      throw error;
    }
  }

  /**
   * 搜索剪切板
   * @param {string} query - 搜索关键词
   * @param {number} page - 页码
   * @param {number} limit - 每页数量
   * @returns {Promise<Object>} 搜索结果
   */
  static async searchPastes(query, page = 1, limit = 20) {
    try {
      const response = await apiClient.get(`/api/pastes/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error('搜索剪切板失败:', error);
      throw error;
    }
  }

  /**
   * 删除剪切板
   * @param {string} id - 剪切板ID
   * @returns {Promise<Object>} 删除结果
   */
  static async deletePaste(id) {
    try {
      const response = await apiClient.delete(`/api/pastes/${id}`);
      return response;
    } catch (error) {
      console.error(`删除剪切板 ${id} 失败:`, error);
      throw error;
    }
  }
}

export default LuoguApiService;