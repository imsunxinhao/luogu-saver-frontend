import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { LuoguApiService } from '../services/api.js';
import MarkdownPreview from './MarkdownPreview.jsx';

const PasteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paste, setPaste] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewTab, setViewTab] = useState(0); // 0: 原始文本, 1: 渲染视图

  // 加载剪切板详情
  const loadPasteDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await LuoguApiService.getPasteById(id);
      setPaste(response.data);
    } catch (err) {
      console.error('获取剪切板详情失败:', err);
      setError('获取剪切板详情失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 打开洛谷剪切板链接
  const handleOpenLuogu = () => {
    window.open(`https://www.luogu.com/paste/${id}`, '_blank');
  };

  // 返回剪切板列表
  const handleBack = () => {
    navigate('/clipboards');
  };

  useEffect(() => {
    if (id) {
      loadPasteDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          加载中...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
          返回剪切板列表
        </Button>
      </Box>
    );
  }

  if (!paste) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          未找到剪切板数据
        </Alert>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
          返回剪切板列表
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* 头部操作栏 */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
          返回
        </Button>
        <Chip 
          label={paste.id} 
          size="medium" 
          color="primary" 
          variant="outlined"
        />
        <Typography variant="h4" component="h1">
          {paste.title || `剪切板 ${paste.id}`}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<OpenInNewIcon />}
          onClick={handleOpenLuogu}
          sx={{ ml: 'auto' }}
        >
          打开洛谷
        </Button>
      </Box>

      {/* 基本信息 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 2 }}>
            {paste.author && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  作者
                </Typography>
                <Typography variant="body1">
                  {paste.author}
                </Typography>
              </Box>
            )}
            {paste.created_at && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  创建时间
                </Typography>
                <Typography variant="body1">
                  {new Date(paste.created_at).toLocaleString('zh-CN')}
                </Typography>
              </Box>
            )}
            {paste.updated_at && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  更新时间
                </Typography>
                <Typography variant="body1">
                  {new Date(paste.updated_at).toLocaleString('zh-CN')}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* 内容显示 */}
      <Card>
        <CardContent>
          <Tabs value={viewTab} onChange={(e, newValue) => setViewTab(newValue)} sx={{ mb: 2 }}>
            <Tab label="原始文本" />
            <Tab label="渲染视图" />
          </Tabs>
          
          <Divider sx={{ mb: 2 }} />
          
          {viewTab === 0 ? (
            <Box
              component="pre"
              sx={{
                p: 2,
                backgroundColor: 'grey.100',
                borderRadius: 1,
                overflow: 'auto',
                maxHeight: 600,
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                whiteSpace: 'pre-wrap'
              }}
            >
              {paste.content}
            </Box>
          ) : (
            <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
              <MarkdownPreview content={paste.content} />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PasteDetail;