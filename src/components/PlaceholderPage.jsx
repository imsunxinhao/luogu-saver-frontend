import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const PlaceholderPage = ({ title, description }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
          此功能正在开发中...
        </Typography>
      </Paper>
    </Box>
  );
};

export default PlaceholderPage;