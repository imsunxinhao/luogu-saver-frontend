import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  IconButton,
  Button,
  Alert,
  CircularProgress,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  HourglassEmpty as PendingIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { LuoguApiService } from '../services/api.js';

const TaskMonitor = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState(new Set());

  // 任务状态映射
  const taskStatusMap = {
    'pending': { label: '等待中', color: 'default', icon: <PendingIcon /> },
    'processing': { label: '处理中', color: 'primary', icon: <ScheduleIcon /> },
    'completed': { label: '已完成', color: 'success', icon: <SuccessIcon /> },
    'failed': { label: '失败', color: 'error', icon: <ErrorIcon /> }
  };

  // 获取任务状态（从后端API获取真实数据）
  const loadTaskQueue = async () => {
    setLoading(true);
    try {
      // 从后端API获取真实的任务数据
      const response = await LuoguApiService.getTasks(1, 50);
      if (response.success && response.data && response.data.tasks) {
        setTasks(response.data.tasks);
      } else {
        // 如果后端没有返回任务数据，显示空列表
        setTasks([]);
      }
    } catch (error) {
      console.error('获取任务队列失败:', error);
      // 如果API调用失败，显示空列表而不是假数据
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // 切换任务详情展开状态
  const toggleTaskExpansion = (taskId) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  // 自动刷新
  useEffect(() => {
    let intervalId;
    
    if (autoRefresh) {
      intervalId = setInterval(() => {
        loadTaskQueue();
      }, 5000); // 每5秒刷新一次
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefresh]);

  // 组件挂载时加载任务队列
  useEffect(() => {
    loadTaskQueue();
  }, []);

  // 统计任务状态
  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(task => task.status === 'pending').length,
    processing: tasks.filter(task => task.status === 'processing').length,
    completed: tasks.filter(task => task.status === 'completed').length,
    failed: tasks.filter(task => task.status === 'failed').length
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 标题和操作栏 */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ScheduleIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4" component="h1">
            任务队列监控
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant={autoRefresh ? "contained" : "outlined"}
            startIcon={autoRefresh ? <PauseIcon /> : <PlayIcon />}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? '暂停自动刷新' : '开始自动刷新'}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadTaskQueue}
            disabled={loading}
          >
            {loading ? '刷新中...' : '手动刷新'}
          </Button>
        </Box>
      </Box>

      {/* 统计信息 */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {taskStats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                总任务数
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {taskStats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                等待中
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {taskStats.processing}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                处理中
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color={taskStats.failed > 0 ? "error" : "success"}>
                {taskStats.completed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                已完成
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 进度条 */}
      {taskStats.total > 0 && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress 
            variant="determinate" 
            value={(taskStats.completed / taskStats.total) * 100}
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              完成进度: {((taskStats.completed / taskStats.total) * 100).toFixed(1)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {taskStats.completed} / {taskStats.total}
            </Typography>
          </Box>
        </Box>
      )}

      {/* 任务列表 */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        <Alert severity="info">
          当前没有任务在队列中
        </Alert>
      ) : (
        <List>
          {tasks.map((task, index) => {
            const statusInfo = taskStatusMap[task.status] || taskStatusMap.pending;
            const isExpanded = expandedTasks.has(task.id);
            
            return (
              <React.Fragment key={task.id}>
                <Card sx={{ mb: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* 任务基本信息 */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {statusInfo.icon}
                          <Chip 
                            label={statusInfo.label} 
                            size="small" 
                            color={statusInfo.color}
                            variant="outlined"
                          />
                        </Box>
                        
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle1" noWrap>
                            {task.type === 'article' ? '文章爬取' : '未知任务'} - {task.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {task.url || '无URL信息'}
                          </Typography>
                        </Box>
                      </Box>

                      {/* 操作按钮 */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {task.progress !== undefined && (
                          <Tooltip title={`进度: ${task.progress}%`}>
                            <Box sx={{ width: 60, mr: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={task.progress}
                                sx={{ height: 6, borderRadius: 3 }}
                              />
                            </Box>
                          </Tooltip>
                        )}
                        
                        <Tooltip title={isExpanded ? "收起详情" : "展开详情"}>
                          <IconButton 
                            size="small" 
                            onClick={() => toggleTaskExpansion(task.id)}
                          >
                            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    {/* 任务详情 */}
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Divider sx={{ my: 2 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            任务信息:
                          </Typography>
                          <List dense>
                            <ListItem>
                              <ListItemText 
                                primary="任务ID" 
                                secondary={task.id} 
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="任务类型" 
                                secondary={task.type || '未知'} 
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="创建时间" 
                                secondary={task.created_at ? new Date(task.created_at).toLocaleString() : '未知'} 
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="更新时间" 
                                secondary={task.updated_at ? new Date(task.updated_at).toLocaleString() : '未知'} 
                              />
                            </ListItem>
                          </List>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            执行详情:
                          </Typography>
                          <List dense>
                            {task.message && (
                              <ListItem>
                                <ListItemText 
                                  primary="状态消息" 
                                  secondary={task.message} 
                                />
                              </ListItem>
                            )}
                            {task.error && (
                              <ListItem>
                                <ListItemText 
                                  primary="错误信息" 
                                  secondary={task.error} 
                                  secondaryTypographyProps={{ color: 'error' }}
                                />
                              </ListItem>
                            )}
                            {task.attempts && (
                              <ListItem>
                                <ListItemText 
                                  primary="尝试次数" 
                                  secondary={task.attempts} 
                                />
                              </ListItem>
                            )}
                          </List>
                        </Grid>
                      </Grid>
                    </Collapse>
                  </CardContent>
                </Card>
                
                {index < tasks.length - 1 && <Divider />}
              </React.Fragment>
            );
          })}
        </List>
      )}

      {/* 错误统计 */}
      {taskStats.failed > 0 && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          有 {taskStats.failed} 个任务执行失败，请检查错误日志
        </Alert>
      )}
    </Box>
  );
};

export default TaskMonitor;