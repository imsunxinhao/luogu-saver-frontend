import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Settings from './components/Settings.jsx'
import SearchPosts from './components/SearchPosts.jsx'
import ArticleManager from './components/ArticleManager.jsx'
import TaskMonitor from './components/TaskMonitor.jsx'
import StatisticsDashboard from './components/StatisticsDashboard.jsx'
import ArticleSaver from './components/ArticleSaver.jsx'
import PasteSaver from './components/PasteSaver.jsx'
import PasteManager from './components/PasteManager.jsx'
import PasteDetail from './components/PasteDetail.jsx'
import PlaceholderPage from './components/PlaceholderPage.jsx'
import ArticlePreviewPage from './pages/ArticlePreviewPage.jsx'
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Container,
  TextField,
  InputAdornment,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse
} from '@mui/material'
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Home as HomeIcon,
  Archive as ArchiveIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Article as ArticleIcon,
  Schedule as ScheduleIcon,
  BarChart as ChartIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Category as CategoryIcon,
  ContentCopy as ContentCopyIcon,
  Folder as FolderIcon
} from '@mui/icons-material'



// 页面组件
const HomePage = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      欢迎来到洛谷帖子保存站
    </Typography>
    <Typography variant="body1" sx={{ mb: 3 }}>
      这是一个用于保存和管理洛谷讨论帖子的工具。
    </Typography>
    
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <Card sx={{ minWidth: 200, flex: 1 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            快速开始
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            选择以下功能开始使用：
          </Typography>
          <Button 
            variant="contained" 
            component={Link} 
            to="/save-article"
            startIcon={<SaveIcon />}
            fullWidth
            sx={{ mb: 1 }}
          >
            保存文章
          </Button>
          <Button 
            variant="outlined" 
            component={Link} 
            to="/articles"
            startIcon={<ArticleIcon />}
            fullWidth
          >
            管理文章
          </Button>
        </CardContent>
      </Card>
      
      <Card sx={{ minWidth: 200, flex: 1 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            系统状态
          </Typography>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">后端服务：</Typography>
            <Chip label="运行中" color="success" size="small" />
          </Box>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">数据库：</Typography>
            <Chip label="已连接" color="success" size="small" />
          </Box>
          <Button 
            variant="outlined" 
            component={Link} 
            to="/statistics"
            startIcon={<ChartIcon />}
            fullWidth
          >
            查看统计
          </Button>
        </CardContent>
      </Card>
    </Box>
  </Box>
)

const ArchivePage = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      帖子存档
    </Typography>
    <Typography variant="body1">
      这里将显示所有已保存的洛谷帖子。
    </Typography>
  </Box>
)

const SearchPage = ({ searchQuery, searchResults, isSearching, onSearch }) => (
  <Box sx={{ p: 3 }}>
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
      <SearchIcon color="primary" sx={{ fontSize: 32 }} />
      <Typography variant="h4" component="h1">
        搜索帖子
      </Typography>
    </Box>

    <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="输入关键词搜索洛谷帖子..."
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSearch()}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Button
        variant="contained"
        onClick={onSearch}
        disabled={isSearching || !searchQuery.trim()}
        sx={{ minWidth: 100 }}
      >
        {isSearching ? '搜索中...' : '搜索'}
      </Button>
    </Box>

    {searchResults.length > 0 && (
      <Box>
        <Typography variant="h6" gutterBottom>
          搜索结果 ({searchResults.length} 条)
        </Typography>
        {searchResults.map((post) => (
          <Card key={post.id} sx={{ mb: 2, p: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {post.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                作者: {post.author} | 日期: {post.date} | 浏览: {post.views} | 点赞: {post.likes}
              </Typography>
              <Typography variant="body2">
                {post.content}
              </Typography>
              <Box sx={{ mt: 1 }}>
                {post.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    )}
  </Box>
)

const SettingsPage = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      设置
    </Typography>
    <Typography variant="body1">
      配置应用设置和偏好。
    </Typography>
  </Box>
)

const drawerWidth = 240
const collapsedDrawerWidth = 64

function App({ darkMode, onToggleDarkMode }) {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopOpen, setDesktopOpen] = useState(true) // 控制桌面端抽屉展开状态
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600) // 检测是否为移动设备
  
  // 搜索频率限制相关状态
  const [searchTimestamps, setSearchTimestamps] = useState([])
  const [rateLimitDialogOpen, setRateLimitDialogOpen] = useState(false)
  const [rateLimitRemainingTime, setRateLimitRemainingTime] = useState(0)
  
   // 监听窗口大小变化
   useEffect(() => {
     const handleResize = () => {
       setIsMobile(window.innerWidth < 600)
     }
     
     window.addEventListener('resize', handleResize)
     return () => window.removeEventListener('resize', handleResize)
   }, [])
   
   // 频率限制倒计时
   useEffect(() => {
     if (rateLimitRemainingTime > 0) {
       const timer = setTimeout(() => {
         setRateLimitRemainingTime(rateLimitRemainingTime - 1)
       }, 1000)
       return () => clearTimeout(timer)
     } else if (rateLimitRemainingTime === 0 && rateLimitDialogOpen) {
       setRateLimitDialogOpen(false)
     }
   }, [rateLimitRemainingTime, rateLimitDialogOpen])
   
   const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleDesktopDrawerToggle = () => {
    setDesktopOpen(!desktopOpen)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    // 检查频率限制
    const now = Date.now()
    const tenSecondsAgo = now - 10000
    
    // 过滤出最近10秒内的搜索记录
    const recentSearches = searchTimestamps.filter(timestamp => timestamp > tenSecondsAgo)
    
    // 如果10秒内搜索超过10次，显示频率限制提示
    if (recentSearches.length >= 10) {
      setRateLimitRemainingTime(15)
      setRateLimitDialogOpen(true)
      return
    }
    
    // 更新搜索时间戳记录
    setSearchTimestamps([...recentSearches, now])

    setIsSearching(true)
    
    // 模拟搜索延迟
    setTimeout(() => {
      // 模拟搜索结果
      const mockResults = [
        {
          id: 101,
          title: `关于"${searchQuery}"的详细解析`,
          author: '算法专家',
          date: '2024-01-20',
          tags: [searchQuery, '解析', '教程'],
          content: `这是一篇关于${searchQuery}的详细解析文章，包含了基础概念、应用场景和实际案例...`,
          url: 'https://www.luogu.com/discuss/123459',
          views: 1520,
          likes: 89
        },
        {
          id: 102,
          title: `${searchQuery}算法实战指南`,
          author: '实战派程序员',
          date: '2024-01-18',
          tags: [searchQuery, '实战', '算法'],
          content: `本文通过多个实际案例讲解${searchQuery}算法的应用，帮助读者深入理解...`,
          url: 'https://www.luogu.com/discuss/123460',
          views: 980,
          likes: 45
        },
        {
          id: 103,
          title: `${searchQuery}常见问题解答`,
          author: '社区助手',
          date: '2024-01-16',
          tags: [searchQuery, 'FAQ', '问题解答'],
          content: `收集了关于${searchQuery}的常见问题和解答，适合初学者参考...`,
          url: 'https://www.luogu.com/discuss/123461',
          views: 760,
          likes: 32
        }
      ]
      
      setSearchResults(mockResults)
      setIsSearching(false)
      
      // 搜索完成后自动跳转到搜索页面，使用GET参数传递搜索关键词
      const encodedQuery = encodeURIComponent(searchQuery.trim())
      navigate(`/search?q=${encodedQuery}`)
    }, 1000)
  }

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // 菜单项状态
  const [articleMenuOpen, setArticleMenuOpen] = useState(true);
  const [clipboardMenuOpen, setClipboardMenuOpen] = useState(true);
  const [systemMenuOpen, setSystemMenuOpen] = useState(true);

  const menuItems = [
    { 
      type: 'category', 
      text: '文章管理', 
      icon: <ArticleIcon />, 
      open: articleMenuOpen,
      toggle: () => setArticleMenuOpen(!articleMenuOpen),
      children: [
        { text: '保存文章', icon: <SaveIcon />, path: '/save-article' },
        { text: '文章列表', icon: <ArticleIcon />, path: '/articles' },
        { text: '文章分类', icon: <CategoryIcon />, path: '/article-categories' }
      ]
    },
    { 
      type: 'category', 
      text: '剪切板管理', 
      icon: <ContentCopyIcon />, 
      open: clipboardMenuOpen,
      toggle: () => setClipboardMenuOpen(!clipboardMenuOpen),
      children: [
        { text: '保存剪切板', icon: <SaveIcon />, path: '/save-paste' },
        { text: '剪切板列表', icon: <ContentCopyIcon />, path: '/clipboards' },
        { text: '剪切板分类', icon: <FolderIcon />, path: '/clipboard-categories' }
      ]
    },
    { 
      type: 'category', 
      text: '系统管理', 
      icon: <SettingsIcon />, 
      open: systemMenuOpen,
      toggle: () => setSystemMenuOpen(!systemMenuOpen),
      children: [
        { text: '任务监控', icon: <ScheduleIcon />, path: '/tasks' },
        { text: '统计信息', icon: <ChartIcon />, path: '/statistics' },
        { text: '系统设置', icon: <SettingsIcon />, path: '/settings' }
      ]
    },
    { text: '首页', icon: <HomeIcon />, path: '/' },
    { text: '搜索帖子', icon: <SearchIcon />, path: '/search' }
  ]

  const drawer = (
    <div>
      {desktopOpen && (
        <Toolbar
          className="MuiToolbar-gutters"
          sx={{
            height: '64px',
            minHeight: '64px',
            transition: 'all 0.3s ease',
            overflow: 'hidden',
          }}
        >
          <Typography variant="h6" noWrap component="div">
            洛谷保存站
          </Typography>
        </Toolbar>
      )}
      <List>
        {menuItems.map((item) => {
          if (item.type === 'category') {
            return (
              <React.Fragment key={item.text}>
                <ListItem disablePadding>
                  <ListItemButton 
                    onClick={item.toggle}
                    sx={{ 
                      px: desktopOpen ? 3 : 2,
                      minHeight: '48px',
                      height: '48px',
                      alignItems: 'center',
                      justifyContent: desktopOpen ? 'flex-start' : 'center',
                      transition: 'all 0.3s ease',
                      width: '100%',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: desktopOpen ? 3 : 0,
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        width: 24,
                        height: 24,
                        opacity: desktopOpen ? 1 : 0.7,
                        transform: desktopOpen ? 'scale(1)' : 'scale(0.9)',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {desktopOpen && (
                      <>
                        <ListItemText 
                          primary={item.text} 
                          sx={{ 
                            margin: 0,
                            '& .MuiTypography-root': {
                              fontSize: '0.875rem',
                              lineHeight: 1.5
                            }
                          }} 
                        />
                        {item.open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </>
                    )}
                  </ListItemButton>
                </ListItem>
                <Collapse in={item.open && desktopOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItem key={child.text} disablePadding>
                        <ListItemButton 
                          component={Link} 
                          to={child.path}
                          sx={{ 
                            pl: desktopOpen ? 6 : 2,
                            minHeight: '40px',
                            height: '40px',
                            alignItems: 'center',
                            justifyContent: desktopOpen ? 'flex-start' : 'center',
                            transition: 'all 0.3s ease',
                            width: '100%',
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: desktopOpen ? 3 : 0,
                              justifyContent: 'center',
                              transition: 'all 0.3s ease',
                              display: 'flex',
                              alignItems: 'center',
                              width: 20,
                              height: 20,
                              opacity: desktopOpen ? 1 : 0.7,
                              transform: desktopOpen ? 'scale(0.9)' : 'scale(0.8)',
                            }}
                          >
                            {child.icon}
                          </ListItemIcon>
                          {desktopOpen && (
                            <ListItemText 
                              primary={child.text} 
                              sx={{ 
                                margin: 0,
                                '& .MuiTypography-root': {
                                  fontSize: '0.8rem',
                                  lineHeight: 1.5
                                }
                              }} 
                            />
                          )}
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          } else {
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  component={Link} 
                  to={item.path}
                  sx={{ 
                    px: desktopOpen ? 3 : 2,
                    minHeight: '48px',
                    height: '48px',
                    alignItems: 'center',
                    justifyContent: desktopOpen ? 'flex-start' : 'center',
                    transition: 'all 0.3s ease',
                    width: '100%',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: desktopOpen ? 3 : 0,
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      width: 24,
                      height: 24,
                      opacity: desktopOpen ? 1 : 0.7,
                      transform: desktopOpen ? 'scale(1)' : 'scale(0.9)',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {desktopOpen && (
                    <ListItemText 
                      primary={item.text} 
                      sx={{ 
                        margin: 0,
                        '& .MuiTypography-root': {
                          fontSize: '0.875rem',
                          lineHeight: 1.5
                        }
                      }} 
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          }
        })}
      </List>
    </div>
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', transition: 'all 0.3s ease' }}>
      <CssBaseline />
      <AppBar 
           position="static" 
           sx={{ 
             zIndex: (theme) => theme.zIndex.drawer + 1,
           }}
         >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              edge="start"
              onClick={handleDesktopDrawerToggle}
              sx={{ mr: 2, display: { xs: 'none', sm: 'flex' } }}
            >
              {desktopOpen ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ mr: 3 }}>
              洛谷帖子保存站
            </Typography>
            
            {/* 搜索框 */}
            <TextField
              variant="outlined"
              size="small"
              placeholder="搜索洛谷帖子..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              sx={{ 
                ml: 'auto', // 自动左外边距，将搜索框推到右侧
                maxWidth: 400,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  },
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Toolbar>
        </AppBar>
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Box
          component="nav"
          sx={{ width: { sm: desktopOpen ? drawerWidth : collapsedDrawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: '100%', // 移动设备下覆盖整个页面宽度
                height: '100%', // 移动设备下覆盖整个页面高度
                top: 0,
                left: 0,
                zIndex: 1300, // 确保在顶栏上方
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: desktopOpen ? drawerWidth : collapsedDrawerWidth,
              top: '64px',
              height: 'calc(100vh - 64px)',
              transition: 'all 0.3s ease',
              transform: desktopOpen ? 'translateX(0)' : 'translateX(-8px)',
              opacity: desktopOpen ? 1 : 0.95,
              '& .MuiToolbar-gutters': {
                transition: 'all 0.3s ease',
                opacity: desktopOpen ? 1 : 0,
                transform: desktopOpen ? 'scale(1)' : 'scale(0.95)',
              }
            },
          }}
          open
        >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{ 
            flexGrow: 1, 
            p: 3,
            width: { sm: `calc(100% - ${desktopOpen ? drawerWidth : collapsedDrawerWidth}px)` },
            height: 'calc(100vh - 64px)',
            overflow: 'auto',
            transition: 'all 0.3s ease',
            transform: desktopOpen ? 'translateX(0)' : 'translateX(-8px)',
            opacity: desktopOpen ? 1 : 0.95
          }}
        >
          <Container maxWidth="lg" sx={{ transition: 'all 0.3s ease' }}>
            <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/save-article" element={<ArticleSaver />} />
        <Route path="/save-paste" element={<PasteSaver />} />
        <Route path="/articles" element={<ArticleManager />} />
        <Route path="/article-categories" element={<PlaceholderPage title="文章分类管理" description="管理文章分类和标签" />} />
        <Route path="/clipboards" element={<PasteManager />} />
        <Route path="/paste/:id" element={<PasteDetail />} />
        <Route path="/article/:id" element={<ArticlePreviewPage />} />
        <Route path="/clipboard-categories" element={<PlaceholderPage title="剪切板分类" description="管理剪切板分类和标签" />} />
        <Route path="/tasks" element={<TaskMonitor />} />
        <Route path="/statistics" element={<StatisticsDashboard />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/search" element={<SearchPosts />} />
        <Route path="/settings" element={<Settings darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} />} />
      </Routes>
          </Container>
        </Box>
      </Box>
      
      {/* 频率限制提示对话框 */}
      <Dialog
        open={rateLimitDialogOpen}
        onClose={() => {}}
        aria-labelledby="rate-limit-dialog-title"
      >
        <DialogTitle id="rate-limit-dialog-title">
          搜索频率过快
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            您在十秒内搜索了太多次，请等待 {rateLimitRemainingTime} 秒后再试。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setRateLimitDialogOpen(false)}
            disabled={rateLimitRemainingTime > 0}
          >
            {rateLimitRemainingTime > 0 ? `等待 ${rateLimitRemainingTime} 秒` : '确定'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default App