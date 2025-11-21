import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  Tooltip,
  Tabs,
  Tab,
  Collapse,
  FormControlLabel,
  Switch,
  Link
} from '@mui/material';
import {
  Search as SearchIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Article as ArticleIcon,
  Visibility as ViewIcon,
  Bookmark as BookmarkIcon,
  Code as CodeIcon,
  TextFields as TextIcon,
  Cookie as CookieIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LuoguApiService from '../services/api';
import MarkdownPreview from './MarkdownPreview.jsx';

const ArticleManager = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [viewTab, setViewTab] = useState(0); // 0: 原始文本, 1: 渲染视图
  const [useCookie, setUseCookie] = useState(false); // 是否使用Cookie
  const [cookieValue, setCookieValue] = useState(''); // Cookie值
  const [cookieExpanded, setCookieExpanded] = useState(false); // Cookie输入框展开状态

  // 加载最近文章
  const loadRecentArticles = async () => {
    setLoading(true);
    try {
      const response = await LuoguApiService.getRecentArticles(20);
      // 后端返回包含data字段的对象结构
      console.log('API响应:', response);
      const articlesData = response.data || [];
      setArticles(articlesData);
      setFilteredArticles(articlesData);
      
      if (articlesData.length === 0) {
        showSnackbar('暂无文章数据，请先保存一些洛谷文章', 'info');
      }
    } catch (error) {
      console.error('加载文章失败:', error);
      showSnackbar('加载文章失败: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // 保存文章
  const handleSaveArticle = async (articleId) => {
    setSaving(true);
    try {
      let result;
      
      if (useCookie && cookieValue.trim()) {
        // 使用Cookie保存
        console.log('使用Cookie保存文章:', articleId);
        result = await LuoguApiService.saveArticleWithCookie(articleId, cookieValue.trim());
      } else {
        // 普通保存
        result = await LuoguApiService.saveArticle(articleId);
      }
      
      console.log('保存文章API响应:', result);
      
      // 检查后端返回的实际保存结果
      if (result.success && result.data && result.data.success) {
        showSnackbar(`文章 ${articleId} 保存成功`, 'success');
        // 重新加载文章列表
        await loadRecentArticles();
      } else {
        // 后端API调用成功，但实际保存失败
        const errorMessage = result.data?.message || result.message || '保存失败，未知错误';
        showSnackbar(`保存失败: ${errorMessage}`, 'error');
        
      }
    } catch (error) {
      console.error('保存文章失败:', error);
      showSnackbar('保存文章失败: ' + error.message, 'error');
      
      // 如果是重定向问题，建议使用Cookie
      if (error.message.includes('重定向') || error.message.includes('登录')) {
        showSnackbar('建议：尝试使用Cookie进行身份验证', 'info');
      }
    } finally {
      setSaving(false);
    }
  };

  // 查看文章详情
  const handleViewArticle = async (articleId) => {
    try {
      const response = await LuoguApiService.getArticleById(articleId);
      setSelectedArticle(response.data);
      setViewTab(0); // 重置为原始文本视图
      setDialogOpen(true);
    } catch (error) {
      console.error('获取文章详情失败:', error);
      showSnackbar('获取文章详情失败: ' + error.message, 'error');
    }
  };

  // 搜索文章
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredArticles(articles);
      return;
    }

    const filtered = articles.filter(article =>
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArticles(filtered);
  };

  // 显示提示消息
  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // 关闭提示消息
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // 关闭详情对话框
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedArticle(null);
  };

  // 打开独立预览页面
  const handleOpenPreviewPage = () => {
    if (!selectedArticle) {
      showSnackbar('请先选择一篇文章', 'warning');
      return;
    }

    // 使用路由导航到独立预览页面
    navigate(`/article/${selectedArticle.luoguId || selectedArticle.id}`);
  };

  // 显示Cookie获取帮助
  const showCookieHelp = () => {
    console.log("该功能已被废弃。");
  };

  // 组件挂载时加载文章
  useEffect(() => {
    loadRecentArticles();
  }, []);

  // 搜索词变化时自动搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, articles]);

  return (
    <Box sx={{ p: 3 }}>
      {/* 标题和操作栏 */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ArticleIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4" component="h1">
            洛谷文章管理
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadRecentArticles}
            disabled={loading}
          >
            {loading ? '加载中...' : '刷新'}
          </Button>
          
          <TextField
            variant="outlined"
            size="small"
            placeholder="搜索文章..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      {/* Cookie设置区域 */}

      {/* 统计信息和问题提示 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" color="text.secondary">
          共找到 {filteredArticles.length} 篇文章
        </Typography>
      </Box>

      {/* 文章列表 */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredArticles.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          {searchTerm ? '没有找到匹配的文章' : '暂无文章数据'}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredArticles.map((article) => (
            <Grid item xs={12} md={6} lg={4} key={article.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  {/* 文章标题 */}
                  <Typography 
                    variant="h6" 
                    component="h2" 
                    sx={{ 
                      fontWeight: 'bold',
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {article.title || `文章 ${article.id}`}
                  </Typography>

                  {/* 文章信息 */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      文章ID: {article.luoguId || article.id}
                    </Typography>
                    {article.author && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        作者: {article.author}
                      </Typography>
                    )}
                    {article.updated_at && (
                      <Typography variant="body2" color="text.secondary">
                        更新时间: {new Date(article.updated_at).toLocaleString()}
                      </Typography>
                    )}
                  </Box>

                  {/* 文章内容预览 */}
                  {article.content && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        color: 'text.secondary'
                      }}
                    >
                      {article.content}
                    </Typography>
                  )}

                  <Divider sx={{ my: 1 }} />

                  {/* 操作按钮 */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="查看详情">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => window.open(`/article/${article.luoguId}`)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="保存文章">
                        <IconButton 
                          size="small" 
                          color="secondary"
                          onClick={() => handleSaveArticle(article.luoguId || article.id)}
                          disabled={saving}
                        >
                          {saving ? <CircularProgress size={20} /> : <SaveIcon />}
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {/* 标签 */}
                    {article.category && (
                      <Chip 
                        label={`分类 ${article.category}`} 
                        size="small" 
                        variant="outlined"
                        color="primary"
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* 文章详情对话框 */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BookmarkIcon color="primary" />
            {selectedArticle?.title || `文章 ${selectedArticle?.id}`}
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {selectedArticle && (
            <Box>
              {/* 文章基本信息 */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  文章ID: {selectedArticle.luoguId || selectedArticle.id}
                </Typography>
                {selectedArticle.author && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    作者: {selectedArticle.author}
                  </Typography>
                )}
                {selectedArticle.updated_at && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    更新时间: {new Date(selectedArticle.updated_at).toLocaleString()}
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* 内容视图切换标签页 */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Tabs 
                  value={viewTab} 
                  onChange={(e, newValue) => setViewTab(newValue)}
                >
                  <Tab 
                    icon={<TextIcon />} 
                    label="原始文本" 
                    iconPosition="start" 
                  />
                  <Tab 
                    icon={<CodeIcon />} 
                    label="渲染视图" 
                    iconPosition="start" 
                  />
                </Tabs>
                
                {viewTab === 1 && (
                  <Button
                    variant="outlined"
                    startIcon={<OpenInNewIcon />}
                    onClick={() => handleOpenPreviewPage(selectedArticle.content)}
                    size="small"
                  >
                    独立预览
                  </Button>
                )}
              </Box>

              {/* 文章内容 */}
              {viewTab === 0 ? (
                // 原始文本视图
                <Typography 
                  variant="body1" 
                  component="div" 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'Monaco, Menlo, Consolas, "Courier New", monospace',
                    fontSize: '0.9rem',
                    backgroundColor: '#f6f8fa',
                    borderRadius: 1,
                    p: 2,
                    maxHeight: '400px',
                    overflow: 'auto'
                  }}
                >
                  {selectedArticle.content || '暂无内容'}
                </Typography>
              ) : (
                // 渲染视图
                <MarkdownPreview 
                  content={selectedArticle.content}
                  className="article-preview"
                />
              )}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDialog}>关闭</Button>
          {selectedArticle && (
            <Button 
              variant="contained" 
              startIcon={<SaveIcon />}
              onClick={() => handleSaveArticle(selectedArticle.id)}
              disabled={saving}
            >
              保存文章
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* 提示消息 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ArticleManager;