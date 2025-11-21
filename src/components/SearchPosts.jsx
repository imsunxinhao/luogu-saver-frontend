import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
  Divider
} from '@mui/material'
import {
  Search as SearchIcon,
  BookmarkAdd as BookmarkAddIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material'

const SearchPosts = () => {
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [savedPosts, setSavedPosts] = useState([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
  
  // 从URL参数获取搜索关键词
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const queryParam = urlParams.get('q')
    
    if (queryParam) {
      const decodedQuery = decodeURIComponent(queryParam)
      setSearchQuery(decodedQuery)
      
      // 如果有关键词，自动执行搜索
      if (decodedQuery.trim()) {
        handleSearch(decodedQuery)
      }
    }
  }, [location.search])

  const handleSearch = async (query = searchQuery) => {
    const searchTerm = query || searchQuery
    if (!searchTerm.trim()) return

    setIsLoading(true)
    
    // 模拟搜索延迟
    setTimeout(() => {
      // 模拟搜索结果
      const mockResults = [
        {
          id: 101,
          title: `关于"${searchTerm}"的详细解析`,
          author: '算法专家',
          date: '2024-01-20',
          tags: [searchTerm, '解析', '教程'],
          content: `这是一篇关于${searchTerm}的详细解析文章，包含了基础概念、应用场景和实际案例...`,
          url: 'https://www.luogu.com/discuss/123459',
          views: 1520,
          likes: 89
        },
        {
          id: 102,
          title: `${searchTerm}算法实战指南`,
          author: '实战派程序员',
          date: '2024-01-18',
          tags: [searchTerm, '实战', '算法'],
          content: `本文通过多个实际案例讲解${searchTerm}算法的应用，帮助读者深入理解...`,
          url: 'https://www.luogu.com/discuss/123460',
          views: 980,
          likes: 45
        },
        {
          id: 103,
          title: `${searchTerm}常见问题解答`,
          author: '社区助手',
          date: '2024-01-16',
          tags: [searchTerm, 'FAQ', '问题解答'],
          content: `收集了关于${searchTerm}的常见问题和解答，适合初学者参考...`,
          url: 'https://www.luogu.com/discuss/123461',
          views: 760,
          likes: 32
        }
      ]
      
      setSearchResults(mockResults)
      setIsLoading(false)
    }, 1000)
  }

  const handleSavePost = (post) => {
    if (savedPosts.find(p => p.id === post.id)) {
      return
    }
    
    const postToSave = {
      ...post,
      savedDate: new Date().toISOString().split('T')[0]
    }
    
    setSavedPosts([...savedPosts, postToSave])
    
    // 显示保存成功的提示
    setSnackbarMessage('帖子已保存成功！')
    setSnackbarSeverity('success')
    setSnackbarOpen(true)
    
    // 在实际应用中，这里应该保存到本地存储或数据库
    console.log('保存帖子:', postToSave)
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  const isPostSaved = (postId) => {
    return savedPosts.some(post => post.id === postId)
  }

  const handleOpenPost = (url) => {
    window.open(url, '_blank')
  }

  return (
    <Box>
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
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
          onClick={handleSearch}
          disabled={isLoading || !searchQuery.trim()}
          sx={{ minWidth: 100 }}
        >
          {isLoading ? <CircularProgress size={24} /> : '搜索'}
        </Button>
      </Box>

      {savedPosts.length > 0 && (
        <Typography 
          variant="body1" 
          color="success.main" 
          sx={{ 
            mb: 3, 
            p: 2, 
            bgcolor: 'success.50', 
            borderRadius: 1,
            fontWeight: 'medium'
          }}
        >
          已保存 {savedPosts.length} 个帖子
        </Typography>
      )}

      {searchResults.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            搜索结果 ({searchResults.length} 条)
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            {searchResults.map((post) => (
              <Grid item xs={12} key={post.id}>
                <Card 
                  sx={{ 
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        {post.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          color={isPostSaved(post.id) ? "primary" : "default"}
                          onClick={() => handleSavePost(post)}
                          disabled={isPostSaved(post.id)}
                        >
                          <BookmarkAddIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleOpenPost(post.url)}
                        >
                          <OpenInNewIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        作者: {post.author} | 日期: {post.date} | 
                        浏览: {post.views} | 点赞: {post.likes}
                      </Typography>
                      <Typography variant="body2">
                        {post.content}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {post.tags.map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={tag} 
                          size="small" 
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {!searchQuery && searchResults.length === 0 && (
        <Typography 
          variant="body1" 
          color="text.secondary" 
          align="center" 
          sx={{ 
            p: 3, 
            bgcolor: 'info.50', 
            borderRadius: 1,
            mt: 2
          }}
        >
          请输入关键词搜索洛谷帖子
        </Typography>
      )}

      {searchQuery && searchResults.length === 0 && !isLoading && (
        <Typography 
          variant="body1" 
          color="warning.main" 
          align="center" 
          sx={{ 
            p: 3, 
            bgcolor: 'warning.50', 
            borderRadius: 1,
            mt: 2
          }}
        >
          没有找到关于"{searchQuery}"的帖子
        </Typography>
      )}

      {/* Snackbar 通知 */}
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

export default SearchPosts