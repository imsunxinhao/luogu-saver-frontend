import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Snackbar,
  Alert,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tabs,
  Tab,
  Modal,
  Backdrop,
  Fade
} from '@mui/material'
import {
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Info as InfoIcon
} from '@mui/icons-material'

const Settings = ({ darkMode, onToggleDarkMode }) => {
  const [settings, setSettings] = useState({
    theme: 'light',
    autoSave: true,
    notifications: true,
    searchHistory: true,
    itemsPerPage: 10
  })

  const [keywords, setKeywords] = useState(['算法', '动态规划', '图论', '数据结构'])
  const [newKeyword, setNewKeyword] = useState('')
  const [currentTab, setCurrentTab] = useState(0)
  const [buildInfo, setBuildInfo] = useState({
    buildTime: '2024-01-20 15:30:00',
    buildId: '00000000',
    version: 'beta.0.1'
  })
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
  const [donationModalOpen, setDonationModalOpen] = useState(false)
  const [donationBlurred, setDonationBlurred] = useState(true)

  useEffect(() => {
    // 尝试从public目录读取构建信息
    fetch('/build-info.json')
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('构建信息文件不存在')
      })
      .then(data => {
        setBuildInfo(data)
      })
      .catch(error => {
        console.warn('无法加载构建信息:', error.message)
        // 使用默认值
      })
  }, [])

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  const handleOpenDonation = () => {
    setDonationModalOpen(true)
    setDonationBlurred(true)
  }

  const handleCloseDonation = () => {
    setDonationModalOpen(false)
    setDonationBlurred(true)
  }

  const handleRemoveBlur = () => {
    setDonationBlurred(false)
  }

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue)
  }

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()])
      setNewKeyword('')
    }
  }

  const handleDeleteKeyword = (keywordToDelete) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToDelete))
  }

  const handleSaveSettings = () => {
    // 在实际应用中，这里应该保存设置到本地存储或数据库
    console.log('保存设置:', settings)
    console.log('保存关键词:', keywords)
    
    // 显示保存成功的提示
    showSnackbar('设置已保存成功！', 'success')
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <SettingsIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          设置
        </Typography>
      </Box>

      <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab icon={<SettingsIcon />} label="基本设置" />
        <Tab icon={<InfoIcon />} label="关于" />
      </Tabs>

      {currentTab === 0 && (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    显示设置
                  </Typography>
                  
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LightModeIcon color={darkMode ? "disabled" : "primary"} />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={darkMode}
                          onChange={onToggleDarkMode}
                          color="primary"
                        />
                      }
                      label={darkMode ? "深色模式" : "浅色模式"}
                    />
                    <DarkModeIcon color={darkMode ? "primary" : "disabled"} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {darkMode ? "当前使用深色主题，适合夜间使用" : "当前使用浅色主题，适合白天使用"}
                  </Typography>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>每页显示数量</InputLabel>
                    <Select
                      value={settings.itemsPerPage}
                      label="每页显示数量"
                      onChange={(e) => handleSettingChange('itemsPerPage', e.target.value)}
                    >
                      <MenuItem value={5}>5 条</MenuItem>
                      <MenuItem value={10}>10 条</MenuItem>
                      <MenuItem value={20}>20 条</MenuItem>
                      <MenuItem value={50}>50 条</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoSave}
                        onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                      />
                    }
                    label="自动保存搜索结果"
                    sx={{ mb: 1 }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications}
                        onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                      />
                    }
                    label="启用通知"
                    sx={{ mb: 1 }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.searchHistory}
                        onChange={(e) => handleSettingChange('searchHistory', e.target.checked)}
                      />
                    }
                    label="保存搜索历史"
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    关注关键词
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, p: 1, bgcolor: 'info.50', borderRadius: 1 }}>
                    添加您感兴趣的关键词，系统会自动为您推荐相关帖子
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="输入关键词..."
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddKeyword}
                      startIcon={<AddIcon />}
                    >
                      添加
                    </Button>
                  </Box>

                  <List dense>
                    {keywords.map((keyword, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={keyword} />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDeleteKeyword(keyword)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>

                  {keywords.length === 0 && (
                    <Typography variant="body2" color="text.secondary" align="center">
                      暂无关注的关键词
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                数据管理
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button variant="outlined" fullWidth>
                    导出已保存帖子
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button variant="outlined" fullWidth color="error">
                    清空所有数据
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleSaveSettings}
              sx={{ minWidth: 120 }}
            >
              保存设置
            </Button>
          </Box>
        </>
      )}

      {currentTab === 1 && (
        <Box>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <InfoIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h5" component="h2">
                    luogu-saver
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    洛谷帖子保存工具
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                   <Typography variant="h6" gutterBottom>
                     版本信息
                   </Typography>
                   <Box sx={{ pl: 2 }}>
                     <Typography variant="body2" sx={{ mb: 1 }}>
                       <strong>版本:</strong> {buildInfo.version}-{buildInfo.buildId}
                     </Typography>
                     <Typography variant="body2" sx={{ mb: 1 }}>
                       <strong>构建ID:</strong> {buildInfo.buildId}
                     </Typography>
                     <Typography variant="body2" sx={{ mb: 1 }}>
                       <strong>构建时间:</strong> {new Date(buildInfo.buildTime).toLocaleString('zh-CN')}
                     </Typography>
                   </Box>
                 </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    技术栈
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>前端框架:</strong> React 18
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>UI 组件库:</strong> Material-UI (MUI)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>构建工具:</strong> Vite
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    开发者信息
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>开发者:</strong> <Typography component="a" href="https://www.luogu.com/user/1188071" target="_blank" rel="noopener noreferrer" color="primary" underline="hover">imsunxinhao</Typography>
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>项目类型:</strong> 开源项目
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>许可证:</strong> MIT License
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>GitHub:</strong> https://github.com/example/luogu-saver
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>反馈邮箱:</strong> support@luogu-saver.com
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  支持项目
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    如果您觉得这个项目对您有帮助，可以考虑支持一下开发者的工作。
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleOpenDonation}
                    sx={{ mt: 1 }}
                  >
                    支持开发者
                  </Button>
                </Box>
              </Grid>
              </Grid>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                感谢您使用 luogu-saver！如果您在使用过程中遇到任何问题或有改进建议，
                欢迎通过 GitHub 或邮箱联系我们。
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
      {/* 捐助模态框 */}
      <Modal
        open={donationModalOpen}
        onClose={handleCloseDonation}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={donationModalOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" gutterBottom>
              支持开发者
            </Typography>
            
            {/* 捐助图片容器 */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: 300,
                mb: 2,
                borderRadius: 1,
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {/* 捐助图片 */}
              <Box
                sx={{
                  width: 300,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
                }}
              >
                <img 
                  src="/pay.png" 
                  alt="捐助二维码"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </Box>
              
              {/* 模糊遮罩 */}
              {donationBlurred && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    请理性捐助
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    不要大额捐助
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRemoveBlur}
                    sx={{
                      backgroundColor: 'white',
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'grey.100',
                      },
                    }}
                  >
                    确认查看
                  </Button>
                </Box>
              )}
            </Box>
            
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              感谢您的支持！您的捐助将帮助项目持续发展。
            </Typography>
            
            <Button
              variant="outlined"
              onClick={handleCloseDonation}
              sx={{ mt: 1 }}
            >
              关闭
            </Button>
          </Box>
        </Fade>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Settings