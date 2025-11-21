import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button
} from '@mui/material';
import {
  BarChart as ChartIcon,
  Article as ArticleIcon,
  Person as PersonIcon,
  Storage as StorageIcon,
  TrendingUp as TrendingUpIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { LuoguApiService } from '../services/api.js';

const StatisticsDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 加载统计信息
  const loadStatistics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const stats = await LuoguApiService.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('加载统计信息失败:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时加载统计信息
  useEffect(() => {
    loadStatistics();
  }, []);

  // 格式化数字
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 计算百分比
  const calculatePercentage = (part, total) => {
    if (!total || total === 0) return 0;
    return ((part / total) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          加载统计信息失败: {error}
        </Alert>
        <Button variant="contained" onClick={loadStatistics}>
          重试
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* 标题 */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <ChartIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          系统统计信息
        </Typography>
      </Box>

      {statistics ? (
        <>
          {/* 主要统计卡片 */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* 文章统计 */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <ArticleIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="h4" color="primary">
                    {formatNumber(statistics.articles?.total)}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    总文章数
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      label={`今日新增: ${formatNumber(statistics.articles?.today)}`} 
                      size="small" 
                      color="success"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* 用户统计 */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <PersonIcon color="secondary" sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="h4" color="secondary">
                    {formatNumber(statistics.users?.total)}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    总用户数
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      label={`活跃: ${formatNumber(statistics.users?.active)}`} 
                      size="small" 
                      color="info"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* 存储统计 */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <StorageIcon color="warning" sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="h4" color="warning.main">
                    {formatNumber(statistics.storage?.total_mb)}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    存储使用(MB)
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      label={`使用率: ${calculatePercentage(statistics.storage?.used_mb, statistics.storage?.total_mb)}%`} 
                      size="small" 
                      color="warning"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* 任务统计 */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TrendingUpIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="h4" color="success.main">
                    {formatNumber(statistics.tasks?.total)}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    总任务数
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      label={`成功率: ${calculatePercentage(statistics.tasks?.success, statistics.tasks?.total)}%`} 
                      size="small" 
                      color="success"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* 详细统计信息 */}
          <Grid container spacing={3}>
            {/* 文章分类统计 */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ArticleIcon />
                    文章分类统计
                  </Typography>
                  
                  <List>
                    {statistics.articles?.by_category?.map((category, index) => (
                      <ListItem key={index} divider={index < statistics.articles.by_category.length - 1}>
                        <ListItemText
                          primary={category.name || `分类 ${category.id}`}
                          secondary={`${formatNumber(category.count)} 篇文章 (${calculatePercentage(category.count, statistics.articles.total)}%)`}
                        />
                        <Chip 
                          label={formatNumber(category.count)} 
                          size="small" 
                          color="primary"
                          variant="outlined"
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* 系统状态 */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StorageIcon />
                    系统状态
                  </Typography>
                  
                  <List>
                    <ListItem divider>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="服务状态"
                        secondary="运行正常"
                      />
                      <Chip label="在线" color="success" size="small" />
                    </ListItem>
                    
                    <ListItem divider>
                      <ListItemIcon>
                        <TrendingUpIcon color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary="今日请求"
                        secondary={formatNumber(statistics.requests?.today) + " 次"}
                      />
                      <Chip 
                        label={formatNumber(statistics.requests?.today)} 
                        color="info" 
                        size="small" 
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <ErrorIcon color={statistics.errors?.today > 0 ? "error" : "success"} />
                      </ListItemIcon>
                      <ListItemText
                        primary="今日错误"
                        secondary={statistics.errors?.today > 0 ? "有错误发生" : "无错误"}
                      />
                      <Chip 
                        label={formatNumber(statistics.errors?.today)} 
                        color={statistics.errors?.today > 0 ? "error" : "success"} 
                        size="small" 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* 性能指标 */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                性能指标
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="primary">
                      {statistics.performance?.response_time || '0'}ms
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      平均响应时间
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="secondary">
                      {formatNumber(statistics.performance?.requests_per_second)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      请求/秒
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="success.main">
                      {calculatePercentage(statistics.performance?.uptime, 100)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      服务可用性
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </>
      ) : (
        <Alert severity="info">
          暂无统计信息可用
        </Alert>
      )}
    </Box>
  );
};

export default StatisticsDashboard;