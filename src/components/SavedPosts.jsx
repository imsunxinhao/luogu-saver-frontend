import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Box,
  TextField,
  InputAdornment,
  Snackbar,
  Alert
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  Bookmark as BookmarkIcon
} from '@mui/icons-material'

const SavedPosts = () => {
  const [posts, setPosts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPosts, setFilteredPosts] = useState([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('info')

  // 模拟数据 - 在实际应用中，这里应该从 API 或本地存储获取数据
  useEffect(() => {
    const mockPosts = [
      {
        id: 1,
        title: '动态规划入门指南',
        author: '算法大师',
        date: '2024-01-15',
        tags: ['动态规划', '算法', '入门'],
        content: '动态规划是一种重要的算法思想，常用于解决最优化问题...',
        url: 'https://www.luogu.com/discuss/123456'
      },
      {
        id: 2,
        title: '图论算法总结',
        author: '图论爱好者',
        date: '2024-01-10',
        tags: ['图论', '算法', '总结'],
        content: '图论是计算机科学中的重要分支，包含多种经典算法...',
        url: 'https://www.luogu.com/discuss/123457'
      },
      {
        id: 3,
        title: '数据结构学习路线',
        author: '数据结构专家',
        date: '2024-01-05',
        tags: ['数据结构', '学习路线', '教程'],
        content: '数据结构是编程的基础，合理的学习路线能事半功倍...',
        url: 'https://www.luogu.com/discuss/123458'
      }
    ]
    setPosts(mockPosts)
    setFilteredPosts(mockPosts)
  }, [])

  useEffect(() => {
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredPosts(filtered)
  }, [searchTerm, posts])

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId))
    setSnackbarMessage('帖子已删除')
    setSnackbarSeverity('success')
    setSnackbarOpen(true)
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <BookmarkIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          已保存帖子
        </Typography>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="搜索已保存的帖子..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {filteredPosts.length === 0 && (
        <Typography 
          variant="body1" 
          color="text.secondary" 
          align="center" 
          sx={{ 
            p: 3, 
            bgcolor: 'grey.50', 
            borderRadius: 1,
            mt: 2
          }}
        >
          {searchTerm ? '没有找到匹配的帖子' : '暂无保存的帖子'}
        </Typography>
      )}

      {filteredPosts.length > 0 && (
        <Grid container spacing={3}>
          {filteredPosts.map((post) => (
            <Grid item xs={12} md={6} lg={4} key={post.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2" sx={{ 
                      fontWeight: 'bold',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {post.title}
                    </Typography>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      作者: {post.author} | 日期: {post.date}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
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

export default SavedPosts