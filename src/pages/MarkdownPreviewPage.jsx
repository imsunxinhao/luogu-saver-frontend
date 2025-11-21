import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
  AppBar, 
  Toolbar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ArrowBack, Brightness4, Brightness7 } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import MarkdownPreview from '../components/MarkdownPreview';

const MarkdownPreviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [content, setContent] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // 从URL参数或localStorage获取内容
    const searchParams = new URLSearchParams(location.search);
    const contentFromUrl = searchParams.get('content');
    
    if (contentFromUrl) {
      setContent(decodeURIComponent(contentFromUrl));
    } else {
      // 从localStorage获取内容
      const savedContent = localStorage.getItem('markdownPreviewContent');
      if (savedContent) {
        setContent(savedContent);
      }
    }
    
    // 检查深色模式设置
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, [location]);

  const handleBack = () => {
    navigate(-1);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    // 通知父组件主题变化
    window.dispatchEvent(new CustomEvent('themeChange', { 
      detail: { darkMode: newDarkMode } 
    }));
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        backgroundColor: darkMode ? '#121212' : '#f5f5f5',
        transition: 'background-color 0.3s ease'
      }}
    >
      <AppBar 
        position="sticky" 
        sx={{ 
          backgroundColor: darkMode ? '#1e1e1e' : '#1976d2',
          color: darkMode ? '#ffffff' : '#ffffff'
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Markdown 预览
          </Typography>
          
          <IconButton color="inherit" onClick={toggleDarkMode}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: isMobile ? 1 : 3 }}>
        <Paper 
          elevation={3}
          sx={{
            maxWidth: 1200,
            margin: '0 auto',
            backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
            color: darkMode ? '#ffffff' : 'text.primary',
            minHeight: '80vh',
            p: isMobile ? 2 : 4
          }}
        >
          {content ? (
            <MarkdownPreview 
              content={content} 
              sx={{
                '& .markdown-preview': {
                  color: darkMode ? '#ffffff' : 'inherit',
                },
                '& pre': {
                  backgroundColor: darkMode ? '#2d2d2d' : '#f6f8fa',
                  color: darkMode ? '#ffffff' : 'inherit',
                },
                '& code': {
                  backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(175, 184, 193, 0.2)',
                  color: darkMode ? '#ffffff' : 'inherit',
                },
                '& blockquote': {
                  borderLeftColor: darkMode ? '#555' : '#dfe2e5',
                  color: darkMode ? '#ccc' : 'text.secondary',
                },
                '& table': {
                  '& th, & td': {
                    borderColor: darkMode ? '#555' : '#dfe2e5',
                  },
                  '& th': {
                    backgroundColor: darkMode ? '#2d2d2d' : '#f6f8fa',
                  }
                }
              }}
            />
          ) : (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '60vh',
                color: darkMode ? '#ccc' : 'text.secondary'
              }}
            >
              <Typography variant="h6">
                暂无内容可预览
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default MarkdownPreviewPage;