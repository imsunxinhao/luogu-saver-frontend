import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Container,
  Divider
} from '@mui/material';
import {
  Home as HomeIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import LuoguApiService from '../services/api';
import MarkdownPreview from '../components/MarkdownPreview.jsx';

const ArticlePreviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // 加载文章详情
  useEffect(() => {
    const loadArticle = async () => {
      if (!id) {
        setError('文章ID不能为空');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await LuoguApiService.getArticleById(id);
        
        if (response.success && response.data) {
          setArticle(response.data);
          setError(null);
        } else {
          setError('文章不存在');
        }
      } catch (error) {
        console.error('获取文章详情失败:', error);
        
        // 根据错误类型设置不同的错误消息
        if (error.response?.status === 404) {
          setError('文章不存在');
        } else if (error.message?.includes('参数验证失败')) {
          setError('文章ID格式不正确');
        } else {
          setError('获取文章详情失败: ' + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  // 保存文章
  const handleSaveArticle = async () => {
    if (!id) return;

    setSaving(true);
    try {
      const result = await LuoguApiService.saveArticle(id);
      
      if (result.success && result.data && result.data.success) {
        // 重新加载文章详情
        const response = await LuoguApiService.getArticleById(id);
        if (response.success && response.data) {
          setArticle(response.data);
        }
        setError(null);
      } else {
        const errorMessage = result.data?.message || result.message || '保存失败，未知错误';
        setError(`保存失败: ${errorMessage}`);
      }
    } catch (error) {
      console.error('保存文章失败:', error);
      setError('保存文章失败: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // 返回首页
  const handleGoHome = () => {
    navigate('/');
  };

  // 返回文章列表
  const handleGoBack = () => {
    navigate('/articles');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            加载中...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {error === '文章不存在' ? '文章还没有保存哟' : error}
            </Typography>
            {error === '文章不存在' && (
              <Typography variant="body2">
                这篇文章尚未保存到数据库中，您可以立即保存它。
              </Typography>
            )}
          </Alert>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {error === '文章不存在' && (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveArticle}
                disabled={saving}
                size="large"
              >
                {saving ? '保存中...' : '立即保存'}
              </Button>
            )}
            
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              size="large"
            >
              返回首页
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              size="large"
            >
              返回文章列表
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (!article) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          无法加载文章数据
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* 文章标题和信息 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {article.title || `文章 ${article.luoguId || article.id}`}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              文章ID: {article.luoguId || article.id}
            </Typography>
            {article.author && (
              <Typography variant="body2" color="text.secondary">
                作者: {article.author}
              </Typography>
            )}
            {article.updated_at && (
              <Typography variant="body2" color="text.secondary">
                更新时间: {new Date(article.updated_at).toLocaleString()}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
            >
              返回文章列表
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
            >
              返回首页
            </Button>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        {/* 文章内容 */}
        <Box>
          {article.content ? (
            <MarkdownPreview 
              content={article.content}
              className="article-preview-full"
            />
          ) : (
            <Alert severity="info">
              这篇文章没有内容
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ArticlePreviewPage;