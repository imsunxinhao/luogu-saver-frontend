import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import MarkdownPreview from './MarkdownPreview.jsx';

const MathTest = () => {
  const testContent = `# 数学公式渲染测试

## 行内数学公式

这是一个行内公式：$E = mc^2$，这是另一个行内公式：$\\sin^2\\theta + \\cos^2\\theta = 1$。

## 块级数学公式

这是一个块级公式：

$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

另一个块级公式：

$$
\\begin{bmatrix}
1 & 2 \\\\
3 & 4
\\end{bmatrix}
\\begin{bmatrix}
x \\\\
y
\\end{bmatrix}
=
\\begin{bmatrix}
5 \\\\
6
\\end{bmatrix}
$$

## 混合内容

代码块和数学公式混合：

\`\`\`python
import math

# 计算圆的面积
def circle_area(radius):
    return math.pi * radius ** 2
\`\`\`

圆的面积公式：$A = \\pi r^2$

## 复杂公式

薛定谔方程：

$$i\\hbar\\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r},t) = \\left[ -\\frac{\\hbar^2}{2m}\\nabla^2 + V(\\mathbf{r},t) \\right] \\Psi(\\mathbf{r},t)$$

麦克斯韦方程组：

$$
\\begin{aligned}
\\nabla \\cdot \\mathbf{E} &= \\frac{\\rho}{\\varepsilon_0} \\\\\n\\nabla \\cdot \\mathbf{B} &= 0 \\\\\n\\nabla \\times \\mathbf{E} &= -\\frac{\\partial \\mathbf{B}}{\\partial t} \\\\\n\\nabla \\times \\mathbf{B} &= \\mu_0\\left(\\mathbf{J} + \\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}\\right)
\\end{aligned}
$$

---

测试结束。`;

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          数学公式渲染测试页面
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          这个页面用于测试MarkdownPreview组件对数学公式的渲染功能。
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <MarkdownPreview content={testContent} />
        </Box>
      </Paper>
    </Box>
  );
};

export default MathTest;