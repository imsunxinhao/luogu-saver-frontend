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
  Link
} from '@mui/material';
import {
  Search as SearchIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  ContentCopy as PasteIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenInNewIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { LuoguApiService } from '../services/api.js';
import MarkdownPreview from './MarkdownPreview.jsx';

const PasteManager = () => {
  const [pastes, setPastes] = useState([]);
  const [filteredPastes, setFilteredPastes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedPaste, setSelectedPaste] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [viewTab, setViewTab] = useState(0); // 0: 原始文本, 1: 渲染视图
  const navigate = useNavigate();

  // 加载剪切板列表
  const loadPastes = async () => {
    setLoading(true);
    try {
      const response = await LuoguApiService.getPastes(1, 50);
      console.log('API响应:', response);
      // 后端返回的数据结构是 { success: true, data: [...], pagination: {...} }
      const pastesData = response.data?.data || response.data || [];
      setPastes(pastesData);
      setFilteredPastes(pastesData);
      
      if (pastesData.length === 0) {
        showSnackbar('暂无剪切板数据，请先保存一些洛谷剪切板', 'info');
      }
    } catch (error) {
      console.error('加载剪切板失败:', error);
      showSnackbar('加载剪切板失败: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // 保存剪切板
  const handleSavePaste = async (pasteId) => {
    setSaving(true);
    try {
      const result = await LuoguApiService.savePaste(pasteId);
      
      console.log('保存剪切板API响应:', result);
      
      if (result.success && result.data && result.data.success) {
        showSnackbar(`剪切板 ${pasteId} 保存成功`, 'success');
        // 重新加载剪切板列表
        await loadPastes();
      } else {
        const errorMessage = result.data?.message || result.message || '保存失败，未知错误';
        showSnackbar(`保存失败: ${errorMessage}`, 'error');
      }
    } catch (error) {
      console.error('保存剪切板失败:', error);
      showSnackbar('保存剪切板失败: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // 删除剪切板
  const handleDeletePaste = async (pasteId) => {
    if (!window.confirm(`确定要删除剪切板 ${pasteId} 吗？`)) {
      return;
    }

    setDeleting(true);
    try {
      const result = await LuoguApiService.deletePaste(pasteId);
      
      if (result.success) {
        showSnackbar(`剪切板 ${pasteId} 删除成功`, 'success');
        // 重新加载剪切板列表
        await loadPastes();
      } else {
        const errorMessage = result.message || '删除失败，未知错误';
        showSnackbar(`删除失败: ${errorMessage}`, 'error');
      }
    } catch (error) {
      console.error('删除剪切板失败:', error);
      showSnackbar('删除剪切板失败: ' + error.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  // 查看剪切板详情
  const handleViewPaste = async (pasteId) => {
    try {
      const response = await LuoguApiService.getPasteById(pasteId);
      setSelectedPaste(response.data);
      setViewTab(0); // 重置为原始文本视图
      setDialogOpen(true);
    } catch (error) {
      console.error('获取剪切板详情失败:', error);
      showSnackbar('获取剪切板详情失败: ' + error.message, 'error');
    }
  };

  // 搜索剪切板
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredPastes(pastes);
      return;
    }

    const filtered = pastes.filter(paste =>
      paste.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paste.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paste.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paste.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPastes(filtered);
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
    setSelectedPaste(null);
  };

  // 打开独立预览页面
  const handleOpenPreviewPage = () => {
    if (!selectedPaste) {
      showSnackbar('请先选择一个剪切板', 'warning');
      return;
    }

    // 使用路由导航到独立预览页面
    navigate(`/paste/${selectedPaste.id}`);
  };

  // 复制剪切板ID
  const handleCopyId = (pasteId) => {
    navigator.clipboard.writeText(pasteId);
    showSnackbar('剪切板ID已复制到剪贴板', 'success');
  };

  // 打开洛谷剪切板链接
  const handleOpenLuogu = (pasteId) => {
    window.open(`https://www.luogu.com/paste/${pasteId}`, '_blank');
  };

  // 组件挂载时加载剪切板列表
  useEffect(() => {
    loadPastes();
  }, []);

  // 搜索词变化时自动搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, pastes]);

  return (
    <Box sx={{ p: 3 }}>
      {/* 标题和搜索栏 */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <PasteIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          剪切板管理
        </Typography>
      </Box>

      {/* 搜索和操作栏 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="搜索剪切板标题、内容、作者或ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 400 }}
            />
            
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadPastes}
              disabled={loading}
            >
              {loading ? '刷新中...' : '刷新'}
            </Button>
            
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={() => navigate('/save-paste')}
            >
              保存新剪切板
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 剪切板列表 */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            加载中...
          </Typography>
        </Box>
      ) : filteredPastes.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <PasteIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchTerm ? '没有找到匹配的剪切板' : '暂无剪切板数据'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm ? '请尝试其他搜索关键词' : '请先保存一些洛谷剪切板'}
            </Typography>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={() => navigate('/save-paste')}
            >
              保存新剪切板
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {filteredPastes.map((paste) => (
            <Grid item xs={12} key={paste.luoguId || paste.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Chip 
                          label={paste.luoguId || paste.id} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                        <Typography variant="h6" component="h2">
                          剪切板 {paste.luoguId || paste.id}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                        {paste.authorName && (
                          <Typography variant="body2" color="text.secondary">
                            作者: {paste.authorName}
                          </Typography>
                        )}
                        {paste.createdAt && (
                          <Typography variant="body2" color="text.secondary">
                            创建时间: {new Date(paste.createdAt).toLocaleString('zh-CN')}
                          </Typography>
                        )}
                      </Box>
                      
                      {paste.content && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mb: 2
                          }}
                        >
                          {paste.content}
                        </Typography>
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 0.5, flexDirection: 'column' }}>
                      <Tooltip title="查看详情">
                        <IconButton onClick={() => handleViewPaste(paste.luoguId || paste.id)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="重新保存">
                        <IconButton 
                          onClick={() => handleSavePaste(paste.luoguId || paste.id)}
                          disabled={saving}
                        >
                          <SaveIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="复制ID">
                        <IconButton onClick={() => handleCopyId(paste.luoguId || paste.id)}>
                          <CopyIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="打开洛谷">
                        <IconButton onClick={() => handleOpenLuogu(paste.luoguId || paste.id)}>
                          <OpenInNewIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="删除">
                        <IconButton 
                          onClick={() => handleDeletePaste(paste.luoguId || paste.id)}
                          disabled={deleting}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* 剪切板详情对话框 */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PasteIcon />
            <Typography variant="h6">
              剪切板 {selectedPaste?.luoguId || selectedPaste?.id}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <Chip label={`ID: ${selectedPaste?.luoguId || selectedPaste?.id}`} size="small" />
              {selectedPaste?.authorName && (
                <Chip label={`作者: ${selectedPaste.authorName}`} size="small" />
              )}
              {selectedPaste?.createdAt && (
                <Chip 
                  label={`创建时间: ${new Date(selectedPaste.createdAt).toLocaleString('zh-CN')}`} 
                  size="small" 
                />
              )}
            </Box>
            
            <Tabs value={viewTab} onChange={(e, newValue) => setViewTab(newValue)} sx={{ mb: 2 }}>
              <Tab label="原始文本" />
              <Tab label="渲染视图" />
            </Tabs>
            
            {viewTab === 0 ? (
              <Box
                component="pre"
                sx={{
                  p: 2,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  overflow: 'auto',
                  maxHeight: 400,
                  fontFamily: 'monospace',
                  fontSize: '0.875rem'
                }}
              >
                {selectedPaste?.content || '无内容'}
              </Box>
            ) : (
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                <MarkdownPreview content={selectedPaste?.content || '无内容'} />
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDialog}>关闭</Button>
          <Button 
            variant="contained" 
            onClick={handleOpenPreviewPage}
            startIcon={<OpenInNewIcon />}
          >
            独立预览
          </Button>
        </DialogActions>
      </Dialog>

      {/* 提示消息 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PasteManager;