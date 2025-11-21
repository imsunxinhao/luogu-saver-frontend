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
  OpenInNew as OpenIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import { LuoguApiService } from '../services/api.js';
import PasteIcon from '@mui/icons-material/ContentPaste';

const PasteSaver = () => {
  const [pasteId, setPasteId] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState(null);
  const [recentSaves, setRecentSaves] = useState([]);

  // 验证剪切板ID格式
  const validatePasteId = (id) => {
    return id.length === 8 && /^[a-zA-Z0-9]+$/.test(id);
  };

  // 从剪切板链接中提取ID
  const extractPasteId = (input) => {
    // 如果是8位字母数字组合，直接返回
    if (input.length === 8 && /^[a-zA-Z0-9]+$/.test(input)) {
      return input;
    }
    
    // 尝试从洛谷剪切板链接中提取ID
    const luoguPasteRegex = /luogu\.com\.?cn?\/paste\/([a-zA-Z0-9]{8})/i;
    const match = input.match(luoguPasteRegex);
    if (match) {
      return match[1];
    }
    
    // 如果是其他格式的链接，尝试提取8位ID
    const idMatch = input.match(/([a-zA-Z0-9]{8})/);
    if (idMatch && idMatch[1].length === 8) {
      return idMatch[1];
    }
    
    return null;
  };

  // 保存剪切板
  const handleSavePaste = async () => {
    // 从输入中提取剪切板ID
    const extractedId = extractPasteId(pasteId);
    
    if (!extractedId) {
      setSaveResult({
        success: false,
        message: '剪切板ID格式错误，请输入8位字母数字组合或洛谷剪切板链接'
      });
      return;
    }

    setSaving(true);
    setSaveResult(null);

    try {
      // 使用无需登录的公开保存接口
      const result = await LuoguApiService.savePaste(extractedId);
      
      setSaveResult({
        success: true,
        message: `剪切板 ${extractedId} 保存成功`,
        data: result
      });

      // 添加到最近保存列表
      setRecentSaves(prev => [
        {
          id: extractedId,
          timestamp: new Date().toLocaleString(),
          success: true
        },
        ...prev.slice(0, 9) // 保留最近10条记录
      ]);

      // 清空输入框
      setPasteId('');
    } catch (error) {
      console.error('保存剪切板失败:', error);
      
      setSaveResult({
        success: false,
        message: `保存失败: ${error.message}`
      });

      // 添加到最近保存列表（失败记录）
      setRecentSaves(prev => [
        {
          id: extractedId || pasteId,
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

  // 复制剪切板ID
  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
  };

  // 打开洛谷剪切板链接
  const handleOpenLuogu = (id) => {
    window.open(`https://www.luogu.com/paste/${id}`, '_blank');
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 标题 */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <PasteIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          剪切板保存工具
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* 保存表单 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                保存洛谷剪切板
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                输入洛谷剪切板的8位ID进行保存
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <TextField
                  fullWidth
                  label="剪切板ID或链接"
                  placeholder="例如: tlke2okg 或 https://www.luogu.com/paste/tlke2okg"
                  value={pasteId}
                  onChange={(e) => setPasteId(e.target.value)}
                  error={pasteId && !extractPasteId(pasteId) ? true : false}
                  helperText={
                    pasteId && !extractPasteId(pasteId) 
                      ? '请输入有效的8位剪切板ID或洛谷剪切板链接'
                      : extractPasteId(pasteId) && pasteId !== extractPasteId(pasteId)
                      ? `将使用剪切板ID: ${extractPasteId(pasteId)}`
                      : ''
                  }
                  onKeyPress={(e) => e.key === 'Enter' && handleSavePaste()}
                />
                
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  onClick={handleSavePaste}
                  disabled={saving || !extractPasteId(pasteId)}
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
                  1. 在洛谷剪切板页面找到8位剪切板ID<br/>
                  2. 输入ID并点击保存按钮<br/>
                  3. 系统将自动爬取并保存剪切板内容<br/>
                  4. 可在"剪切板管理"页面查看已保存的剪切板
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

      {/* 示例剪切板ID */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            示例剪切板ID
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
                onClick={() => setPasteId('EXAMPLE1')}
              >
                <Typography variant="h6">EXAMPLE1</Typography>
                <Typography variant="body2">示例剪切板1</Typography>
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
                onClick={() => setPasteId('TEST0001')}
              >
                <Typography variant="h6">TEST0001</Typography>
                <Typography variant="body2">测试剪切板1</Typography>
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
                onClick={() => setPasteId('DEMO1234')}
              >
                <Typography variant="h6">DEMO1234</Typography>
                <Typography variant="body2">演示剪切板</Typography>
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
                onClick={() => setPasteId('SAMPLE99')}
              >
                <Typography variant="h6">SAMPLE99</Typography>
                <Typography variant="body2">样本剪切板</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PasteSaver;