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

const PastePreviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paste, setPaste] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // 加载剪切板详情
  useEffect(() => {
    const loadPaste = async () => {
      if (!id) {
        setError('剪切板ID不能为空');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await LuoguApiService.getPasteById(id);
        
        if (response.success && response.data) {
          setPaste(response.data);
          setError(null);
        } else {
          setError('剪切板不存在');
        }
      } catch (error) {
        console.error('获取剪切板详情失败:', error);
        
        // 根据错误类型设置不同的错误消息
        if (error.response?.status === 404) {
          setError('剪切板不存在');
        } else if (error.message?.includes('参数验证失败')) {
          setError('剪切板ID格式不正确');
        } else {
          setError('获取剪切板详情失败: ' + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadPaste();
  }, [id]);

  // 保存剪切板
  const handleSavePaste = async () => {
    if (!id) return;

    try {
      setSaving(true);
      const response = await LuoguApiService.savePaste(id);
      
      if (response.success) {
        // 重新加载剪切板详情
        const pasteResponse = await LuoguApiService.getPasteById(id);
        if (pasteResponse.success && pasteResponse.data) {
          setPaste(pasteResponse.data);
          setError(null);
        }
      } else {
        setError('保存失败: ' + response.message);
      }
    } catch (error) {
      console.error('保存剪切板失败:', error);
      setError('保存失败: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // 返回首页
  const handleGoHome = () => {
    navigate('/');
  };

  // 返回剪切板列表
  const handleGoBack = () => {
    navigate('/clipboards');
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
              {error === '剪切板不存在' ? '剪切板还没有保存哟' : error}
            </Typography>
            {error === '剪切板不存在' && (
              <Typography variant="body2">
                这个剪切板尚未保存到数据库中，您可以立即保存它。
              </Typography>
            )}
          </Alert>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {error === '剪切板不存在' && (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSavePaste}
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
              返回剪切板列表
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (!paste) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          无法加载剪切板数据
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* 剪切板标题和信息 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {paste.title || `剪切板 ${paste.id}`}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              剪切板ID: {paste.id}
            </Typography>
            {paste.author && (
              <Typography variant="body2" color="text.secondary">
                作者: {paste.author}
              </Typography>
            )}
            {paste.updated_at && (
              <Typography variant="body2" color="text.secondary">
                更新时间: {new Date(paste.updated_at).toLocaleString()}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
            >
              返回剪切板列表
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
        
        {/* 剪切板内容 */}
        <Box>
          {paste.content ? (
            <MarkdownPreview 
              content={paste.content}
              className="paste-preview-full"
            />
          ) : (
            <Alert severity="info">
              这个剪切板没有内容
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default PastePreviewPage;