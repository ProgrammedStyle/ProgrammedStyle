import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Fab,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Badge,
  Collapse,
  Divider,
  Button,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MinimizeIcon from '@mui/icons-material/Minimize';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export default function LiveChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [hasProvidedInfo, setHasProvidedInfo] = useState(false);
  const [sessionId] = useState(() => {
    // Get or create session ID
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('chatSessionId');
      if (!id) {
        id = uuidv4();
        localStorage.setItem('chatSessionId', id);
      }
      return id;
    }
    return uuidv4();
  });

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open && !socketRef.current) {
      socketRef.current = io(`${SOCKET_URL}/chat`);

      socketRef.current.on('connect', () => {
        console.log('Connected to chat');
        socketRef.current.emit('join', { room: sessionId });
      });

      socketRef.current.on('messageSent', (data) => {
        if (data.success) {
          setMessages((prev) => [...prev, {
            text: data.message.message,
            sender: 'user',
            timestamp: new Date(),
          }]);
          setInputMessage('');
        }
      });

      socketRef.current.on('adminReply', (data) => {
        setMessages((prev) => [...prev, {
          text: data.reply,
          sender: 'admin',
          timestamp: new Date(data.repliedAt),
        }]);
      });

      socketRef.current.on('messageError', (data) => {
        console.error('Message error:', data.error);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [open, sessionId]);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleStartChat = () => {
    if (userInfo.name && userInfo.email) {
      setHasProvidedInfo(true);
      setMessages([
        {
          text: `Hello ${userInfo.name}! How can we help you today?`,
          sender: 'admin',
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() && socketRef.current) {
      socketRef.current.emit('sendMessage', {
        name: userInfo.name,
        email: userInfo.email,
        message: inputMessage,
        sessionId,
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (hasProvidedInfo) {
        handleSendMessage();
      } else {
        handleStartChat();
      }
    }
  };

  return (
    <>
      {/* Chat Window */}
      <Collapse in={open}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            width: { xs: 'calc(100vw - 48px)', sm: 380 },
            height: 500,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1300,
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Badge
                color="success"
                variant="dot"
                overlap="circular"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
              >
                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)' }}>
                  <ChatIcon />
                </Avatar>
              </Badge>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Live Chat
                </Typography>
                <Typography variant="caption">
                  We're here to help!
                </Typography>
              </Box>
            </Box>
            <Box>
              <IconButton size="small" sx={{ color: 'white' }} onClick={handleToggle}>
                <MinimizeIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white' }} onClick={handleToggle}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 2,
              bgcolor: 'background.default',
            }}
          >
            {!hasProvidedInfo ? (
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                  Welcome! 👋
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Please provide your information to start chatting with us.
                </Typography>
                <TextField
                  fullWidth
                  label="Your Name"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  sx={{ mb: 2 }}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                  sx={{ mb: 2 }}
                  size="small"
                />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleStartChat}
                  disabled={!userInfo.name || !userInfo.email}
                >
                  Start Chat
                </Button>
              </Box>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Paper
                      sx={{
                        p: 1.5,
                        maxWidth: '75%',
                        bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper',
                        color: msg.sender === 'user' ? 'white' : 'text.primary',
                      }}
                    >
                      <Typography variant="body2">{msg.text}</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          opacity: 0.7,
                          display: 'block',
                          mt: 0.5,
                        }}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </Box>

          {/* Input Area */}
          {hasProvidedInfo && (
            <>
              <Divider />
              <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </Box>
            </>
          )}
        </Paper>
      </Collapse>

      {/* Chat Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          },
        }}
        onClick={handleToggle}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </Fab>
    </>
  );
}

