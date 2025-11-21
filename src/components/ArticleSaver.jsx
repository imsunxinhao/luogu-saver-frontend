import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Save as SaveIcon,
  ContentCopy as CopyIcon,
  OpenInNew as OpenIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { LuoguApiService } from '../services/api.js';

const ArticleSaver = () => {
  const [articleId, setArticleId] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState(null);
  const [recentSaves, setRecentSaves] = useState([]);

  // 验证文章ID格式
  const validateArticleId = (id) => {
    return id.length === 8 && /^[a-zA-Z0-9]+$/.test(id);
  };

  // 保存文章
  const handleSaveArticle = async () => {
    if (!validateArticleId(articleId)) {
      setSaveResult({
        success: false,
        message: '文章ID格式错误，应为8位字母数字组合'
      });
      return;
    }

    setSaving(true);
    setSaveResult(null);

    try {
      // 使用无需登录的公开保存接口
      const result = await LuoguApiService.saveArticlePublic(articleId);
      
      setSaveResult({
        success: true,
        message: `文章 ${articleId} 保存成功`,
        data: result
      });

      // 添加到最近保存列表
      setRecentSaves(prev => [
        {
          id: articleId,
          timestamp: new Date().toLocaleString(),
          success: true
        },
        ...prev.slice(0, 9) // 保留最近10条记录
      ]);

      // 清空输入框
      setArticleId('');
    } catch (error) {
      console.error('保存文章失败:', error);
      
      setSaveResult({
        success: false,
        message: `保存失败: ${error.message}`
      });

      // 添加到最近保存列表（失败记录）
      setRecentSaves(prev => [
        {
          id: articleId,
          timestamp: new Date().toLocaleString(),
          success: false,
          error: error.message
        },
        ...prev.slice(0, 9)
      ]);
    } finally {
      setSaving(false);
    }
  };

  // 复制文章ID
  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
  };

  // 打开洛谷文章链接
  const handleOpenLuogu = (id) => {
    window.open(`https://www.luogu.com/article/${id}`, '_blank');
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 标题 */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <SaveIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          文章保存工具
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* 保存表单 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                保存洛谷文章
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                输入洛谷文章的8位ID进行保存
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <TextField
                  fullWidth
                  label="文章ID"
                  placeholder="例如: l1x5ax71"
                  value={articleId}
                  onChange={(e) => setArticleId(e.target.value.toUpperCase())}
                  error={articleId && !validateArticleId(articleId) ? true : false}
                  helperText={articleId && !validateArticleId(articleId) ? '文章ID应为8位字母数字组合' : ''}
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveArticle()}
                />
                
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  onClick={handleSaveArticle}
                  disabled={saving || !validateArticleId(articleId)}
                  sx={{ minWidth: 100, height: '56px' }}
                >
                  {saving ? '保存中...' : '保存'}
                </Button>
              </Box>

              {/* 保存结果提示 */}
              {saveResult && (
                <Alert 
                  severity={saveResult.success ? 'success' : 'error'} 
                  sx={{ mt: 2 }}
                  icon={saveResult.success ? <SuccessIcon /> : <ErrorIcon />}
                >
                  {saveResult.message}
                </Alert>
              )}

              {/* 使用说明 */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  使用说明:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  1. 在洛谷文章页面找到8位文章ID<br/>
                  2. 输入ID并点击保存按钮<br/>
                  3. 系统将自动爬取并保存文章内容<br/>
                  4. 可在"文章管理"页面查看已保存的文章
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 最近保存记录 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                最近保存记录
              </Typography>
              
              {recentSaves.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  暂无保存记录
                </Typography>
              ) : (
                <List dense>
                  {recentSaves.map((save, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip 
                                label={save.id} 
                                size="small" 
                                color={save.success ? 'success' : 'error'}
                                variant="outlined"
                              />
                              {save.success ? (
                                <SuccessIcon color="success" fontSize="small" />
                              ) : (
                                <ErrorIcon color="error" fontSize="small" />
                              )}
                            </Box>
                          }
                          secondary={`保存时间: ${save.timestamp}`}
                        />
                        
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="复制ID">
                            <IconButton 
                              size="small" 
                              onClick={() => handleCopyId(save.id)}
                            >
                              <CopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="打开洛谷">
                            <IconButton 
                              size="small" 
                              onClick={() => handleOpenLuogu(save.id)}
                            >
                              <OpenIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </ListItem>
                      
                      {index < recentSaves.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 示例文章ID */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            示例文章ID
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box 
                sx={{ 
                  p: 2, 
                  border: '1px solid', 
                  borderColor: 'primary.main', 
                  borderRadius: 1,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'primary.light', color: 'white' }
                }}
                onClick={() => setArticleId('EXAMPLE1')}
              >
                <Typography variant="h6">EXAMPLE1</Typography>
                <Typography variant="body2">示例文章1</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box 
                sx={{ 
                  p: 2, 
                  border: '1px solid', 
                  borderColor: 'primary.main', 
                  borderRadius: 1,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'primary.light', color: 'white' }
                }}
                onClick={() => setArticleId('TEST0001')}
              >
                <Typography variant="h6">TEST0001</Typography>
                <Typography variant="body2">测试文章1</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box 
                sx={{ 
                  p: 2, 
                  border: '1px solid', 
                  borderColor: 'primary.main', 
                  borderRadius: 1,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'primary.light', color: 'white' }
                }}
                onClick={() => setArticleId('DEMO1234')}
              >
                <Typography variant="h6">DEMO1234</Typography>
                <Typography variant="body2">演示文章</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box 
                sx={{ 
                  p: 2, 
                  border: '1px solid', 
                  borderColor: 'primary.main', 
                  borderRadius: 1,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'primary.light', color: 'white' }
                }}
                onClick={() => setArticleId('SAMPLE99')}
              >
                <Typography variant="h6">SAMPLE99</Typography>
                <Typography variant="body2">样本文章</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ArticleSaver;