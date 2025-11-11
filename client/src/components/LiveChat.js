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
import DeleteIcon from '@mui/icons-material/Delete';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from '../contexts/LanguageContext';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export default function LiveChat() {
  const { t, language } = useTranslation();
  const isRTL = language === 'ar';
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [hasProvidedInfo, setHasProvidedInfo] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
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
  const hasVerifiedWithServer = useRef(false);

  // Load chat data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedUserInfo = localStorage.getItem('chatUserInfo');
        const savedHasProvidedInfo = localStorage.getItem('chatHasProvidedInfo');
        const savedMessages = localStorage.getItem('chatMessages');
        
        if (savedUserInfo) {
          const parsedUserInfo = JSON.parse(savedUserInfo);
          if (parsedUserInfo.name && parsedUserInfo.email) {
            setUserInfo(parsedUserInfo);
          }
        }
        
        // Load messages from localStorage
        if (savedMessages) {
          const parsedMessages = JSON.parse(savedMessages);
          if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
            setMessages(parsedMessages.map(msg => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            })));
          }
        }
        
        if (savedHasProvidedInfo === 'true') {
          setHasProvidedInfo(true);
        }
      } catch (error) {
        console.error('Error loading chat from localStorage:', error);
        localStorage.removeItem('chatUserInfo');
        localStorage.removeItem('chatMessages');
        localStorage.removeItem('chatHasProvidedInfo');
      }
    }
  }, []);

  // Save chat data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && hasProvidedInfo) {
      localStorage.setItem('chatUserInfo', JSON.stringify(userInfo));
      localStorage.setItem('chatMessages', JSON.stringify(messages));
      localStorage.setItem('chatHasProvidedInfo', hasProvidedInfo.toString());
    }
  }, [userInfo, messages, hasProvidedInfo]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!open) return;

    if (!socketRef.current) {
      socketRef.current = io(`${SOCKET_URL}/chat`);

      socketRef.current.on('connect', () => {
        console.log('Connected to chat');
        if (socketRef.current) {
          socketRef.current.emit('join', { room: sessionId });
        }
      });

      socketRef.current.on('messageSent', (data) => {
        if (data.success) {
          setMessages((prev) => [...prev, {
            text: data.message.message,
            sender: 'user',
            timestamp: new Date(),
          }]);
          setInputMessage('');
          
          // First user message sent - now fetch from server to sync
          if (!hasVerifiedWithServer.current) {
            hasVerifiedWithServer.current = true;
            setTimeout(() => {
              fetch(`${SOCKET_URL}/api/chat/messages/session/${sessionId}`)
                .then(res => res.json())
                .then(serverData => {
                  if (serverData.success && serverData.messages && serverData.messages.length > 0) {
                    const formattedMessages = serverData.messages.map(msg => ({
                      text: msg.message,
                      sender: msg.isAdminMessage ? 'admin' : 'user',
                      timestamp: new Date(msg.timestamp),
                    }));
                    setMessages(formattedMessages);
                  }
                })
                .catch(err => console.error('Error syncing with server:', err));
            }, 500);
          }
        }
      });

      socketRef.current.on('adminReply', (data) => {
        // Add admin reply as a new message
        setMessages((prev) => [...prev, {
          text: data.reply,
          sender: 'admin',
          timestamp: new Date(data.repliedAt || new Date()),
        }]);
      });

      socketRef.current.on('messageError', (data) => {
        console.error('Message error:', data.error);
      });
    }

    return () => {
      if (socketRef.current && typeof socketRef.current.disconnect === 'function') {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [open, sessionId, hasProvidedInfo]);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleStartChat = () => {
    if (userInfo.name && userInfo.email) {
      setHasProvidedInfo(true);
      // Set welcome message
      const welcomeMsg = {
        text: t('liveChat.greeting').replace('{{name}}', userInfo.name),
        sender: 'admin',
        timestamp: new Date(),
      };
      setMessages([welcomeMsg]);
      
      // Save to localStorage immediately
      if (typeof window !== 'undefined') {
        localStorage.setItem('chatMessages', JSON.stringify([welcomeMsg]));
        localStorage.setItem('chatUserInfo', JSON.stringify(userInfo));
        localStorage.setItem('chatHasProvidedInfo', 'true');
      }
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() && socketRef.current && userInfo.name && userInfo.email) {
      socketRef.current.emit('sendMessage', {
        name: userInfo.name,
        email: userInfo.email,
        message: inputMessage,
        sessionId,
      });
    } else if (!userInfo.name || !userInfo.email) {
      console.error('User info is missing. Please start a new chat.');
      // Reset to initial state if user info is missing
      setHasProvidedInfo(false);
      setMessages([]);
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

  const handleStartNewChat = () => {
    // Clear all chat data
    setMessages([]);
    setUserInfo({ name: '', email: '' });
    setHasProvidedInfo(false);
    setInputMessage('');
    
    // Generate new sessionId
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    
    // Reset server verification flag for new session
    hasVerifiedWithServer.current = false;
    
    // Clear localStorage INCLUDING sessionId for a fresh start
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chatUserInfo');
      localStorage.removeItem('chatMessages');
      localStorage.removeItem('chatHasProvidedInfo');
      localStorage.setItem('chatSessionId', newSessionId); // Set new session ID
    }
    
    // Disconnect socket
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  const handleDeleteChat = () => {
    if (confirm(t('liveChat.confirmDelete'))) {
      handleStartNewChat();
      setOpen(false);
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
            ...(isRTL ? { left: 24 } : { right: 24 }),
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
                  {t('liveChat.title')}
                </Typography>
                <Typography variant="caption">
                  {t('liveChat.subtitle')}
                </Typography>
              </Box>
            </Box>
            <Box>
              {hasProvidedInfo && (
                <>
                  <IconButton 
                    size="small" 
                    sx={{ color: 'white' }} 
                    onClick={handleStartNewChat}
                    title={t('liveChat.startNewChat')}
                  >
                    <RestartAltIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    sx={{ color: 'white' }} 
                    onClick={handleDeleteChat}
                    title={t('liveChat.deleteChat')}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
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
                  {t('liveChat.welcome')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {t('liveChat.instruction')}
                </Typography>
                <TextField
                  fullWidth
                  label={t('liveChat.yourName')}
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  sx={{ 
                    mb: 2,
                    '& .MuiInputBase-root': {
                      height: '56px',
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label={t('liveChat.emailAddress')}
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                  sx={{ 
                    mb: 2,
                    '& .MuiInputBase-root': {
                      height: '56px',
                    },
                  }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleStartChat}
                  disabled={!userInfo.name || !userInfo.email}
                >
                  {t('liveChat.startChat')}
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
                      <Typography variant="body2" sx={{wordWrap: "break-word"}}>{msg.text}</Typography>
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
                    placeholder={t('liveChat.typePlaceholder')}
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
          ...(isRTL ? { left: 24 } : { right: 24 }),
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

