import React from 'react';
import { Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';

// KaTeX配置
const katexOptions = {
  throwOnError: false,
  strict: false,
  displayMode: true,
  output: 'htmlAndMathml'
};

const MarkdownPreview = ({ content, className = '' }) => {
  // 处理content参数，确保是字符串类型
  const getContentString = () => {
    if (typeof content === 'string') {
      return content;
    } else if (typeof content === 'object' && content !== null) {
      try {
        return JSON.stringify(content, null, 2);
      } catch (error) {
        return content.toString();
      }
    } else {
      return String(content || '');
    }
  };

  const contentStr = getContentString();

  if (!contentStr.trim()) {
    return (
      <Box 
        sx={{ 
          p: 2, 
          border: '1px solid #e0e0e0', 
          borderRadius: 1, 
          backgroundColor: 'grey.50',
          color: 'text.secondary',
          fontStyle: 'italic'
        }}
        className={className}
      >
        暂无内容
      </Box>
    );
  }

  return (
    <Box 
      className={`markdown-preview ${className}`}
      sx={{
        '& h1, & h2, & h3, & h4, & h5, & h6': {
          marginTop: '1.5rem',
          marginBottom: '1rem',
          fontWeight: 'bold',
          lineHeight: 1.25,
        },
        '& h1': { 
          fontSize: '2rem',
          borderBottom: '1px solid #eaecef',
          paddingBottom: '0.3em'
        },
        '& h2': { 
          fontSize: '1.75rem',
          borderBottom: '1px solid #eaecef',
          paddingBottom: '0.3em'
        },
        '& h3': { fontSize: '1.5rem' },
        '& h4': { fontSize: '1.25rem' },
        '& h5': { fontSize: '1.1rem' },
        '& h6': { 
          fontSize: '1rem', 
          color: 'text.secondary' 
        },
        '& p': {
          marginBottom: '1rem',
          lineHeight: 1.6,
        },
        '& blockquote': {
          borderLeft: '4px solid #dfe2e5',
          paddingLeft: '1rem',
          marginLeft: 0,
          marginRight: 0,
          color: 'text.secondary',
          fontStyle: 'italic',
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          padding: '0.5rem 1rem',
          borderRadius: '0 4px 4px 0',
        },
        '& pre': {
          backgroundColor: '#f6f8fa',
          borderRadius: '6px',
          padding: '1rem',
          overflow: 'auto',
          marginBottom: '1rem',
          fontSize: '0.95em',
          lineHeight: 1.6,
        },
        '& code': {
          backgroundColor: 'rgba(175, 184, 193, 0.2)',
          borderRadius: '3px',
          padding: '0.2em 0.4em',
          fontSize: '0.95em',
          fontFamily: 'Monaco, Menlo, Consolas, "Courier New", monospace',
        },
        '& pre code': {
          backgroundColor: 'transparent',
          padding: 0,
        },
        '& ul, & ol': {
          paddingLeft: '2rem',
          marginBottom: '1rem',
        },
        '& li': {
          marginBottom: '0.5rem',
        },
        '& table': {
          borderCollapse: 'collapse',
          width: '100%',
          marginBottom: '1rem',
          border: '1px solid #dfe2e5',
        },
        '& th, & td': {
          border: '1px solid #dfe2e5',
          padding: '0.5rem',
          textAlign: 'left',
        },
        '& th': {
          backgroundColor: '#f6f8fa',
          fontWeight: 'bold',
        },
        '& a': {
          color: '#0366d6',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
        '& img': {
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '4px',
        },
        '& .katex': {
          fontSize: '1.2em',
        },
        '& .katex-display': {
          margin: '1.5rem 0',
          overflowX: 'auto',
          overflowY: 'hidden',
          textAlign: 'center',
          padding: '0.5rem',
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          borderRadius: '4px',
        },
        '& .katex-html': {
          display: 'inline-block',
        },
        '& .hljs': {
          background: 'transparent',
        },
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeKatex, katexOptions], rehypeHighlight]}
        components={{
          // 自定义代码块渲染
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            if (inline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            
            return (
              <pre className={className} {...props}>
                <code>{children}</code>
              </pre>
            );
          },
          // 自定义表格渲染
          table: ({ children }) => (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ minWidth: '100%' }}>{children}</table>
            </div>
          ),
        }}
      >
        {contentStr}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownPreview;