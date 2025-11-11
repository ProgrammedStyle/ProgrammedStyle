import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import MessageIcon from '@mui/icons-material/Message';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({ total: 0, unread: 0, replied: 0, pending: 0 });
  const [selectedChat, setSelectedChat] = useState(null);
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Group messages by session/user
  const chatSessions = chatMessages.reduce((acc, msg) => {
    const key = msg.sessionId;
    if (!acc[key]) {
      // Use the first non-admin message to get user info
      const userInfo = msg.isAdminMessage 
        ? chatMessages.find(m => m.sessionId === msg.sessionId && !m.isAdminMessage)
        : msg;
      
      acc[key] = {
        sessionId: key,
        name: userInfo?.name || msg.name,
        email: userInfo?.email || msg.email,
        messages: [],
        lastMessage: msg.timestamp,
        unread: 0,
      };
    }
    acc[key].messages.push(msg);
    if (!msg.read && !msg.isAdminMessage) acc[key].unread++;
    if (new Date(msg.timestamp) > new Date(acc[key].lastMessage)) {
      acc[key].lastMessage = msg.timestamp;
    }
    return acc;
  }, {});
  
  const sortedSessions = Object.values(chatSessions).sort(
    (a, b) => new Date(b.lastMessage) - new Date(a.lastMessage)
  );

  // Scroll to bottom when selectedChat messages change
  useEffect(() => {
    if (selectedChat) {
      scrollToBottom();
    }
  }, [selectedChat?.messages]);

  // Update selected chat when chatMessages changes
  useEffect(() => {
    if (selectedChat && selectedChat.sessionId) {
      // Rebuild the specific session from chatMessages
      const sessionMessages = chatMessages.filter(msg => msg.sessionId === selectedChat.sessionId);
      
      if (sessionMessages.length > 0) {
        // Get user info from first non-admin message
        const userInfo = sessionMessages.find(m => !m.isAdminMessage) || sessionMessages[0];
        
        setSelectedChat({
          sessionId: selectedChat.sessionId,
          name: userInfo.name,
          email: userInfo.email,
          messages: sessionMessages,
          lastMessage: Math.max(...sessionMessages.map(m => new Date(m.timestamp))),
          unread: sessionMessages.filter(m => !m.read && !m.isAdminMessage).length,
        });
      }
    }
  }, [chatMessages]);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    const storedUser = localStorage.getItem('adminUser');

    if (!token || !storedUser) {
      router.push('/admin/login');
      return;
    }

    setUser(JSON.parse(storedUser));
    fetchData(token);

    // Setup Socket.IO
    const socket = io(`${SOCKET_URL}/chat`);
    socket.emit('join', { room: 'admin' });

    socket.on('newMessage', (message) => {
      setChatMessages((prev) => {
        // Check if message already exists to avoid duplicates
        const exists = prev.some(m => m._id === message._id);
        if (exists) return prev;
        return [message, ...prev];
      });
      fetchStats(token);
    });

    socket.on('adminReply', (data) => {
      // Update messages when admin sends a reply (real-time sync across tabs)
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId
            ? {
                ...msg,
                replied: true,
                adminReply: data.reply,
                repliedAt: data.repliedAt,
              }
            : msg
        )
      );
    });

    socket.on('messageSent', (data) => {
      // Handle when a message is successfully sent
      if (data.success && data.message) {
        // Check if message already exists
        setChatMessages((prev) => {
          const exists = prev.some(m => m._id === data.message._id);
          if (!exists) {
            return [data.message, ...prev];
          }
          return prev;
        });
        fetchStats(token);
      }
    });

    return () => {
      if (socket && typeof socket.disconnect === 'function') {
        socket.disconnect();
      }
    };
  }, [router]);

  const fetchData = async (token) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const [messagesRes, contactsRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/chat/messages`, { headers }),
        axios.get(`${API_URL}/contact`, { headers }),
        axios.get(`${API_URL}/chat/stats`, { headers }),
      ]);

      setChatMessages(messagesRes.data.messages || []);
      setContacts(contactsRes.data.contacts || []);
      setStats(statsRes.data.stats || { total: 0, unread: 0, replied: 0, pending: 0 });
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const fetchStats = async (token) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const statsRes = await axios.get(`${API_URL}/chat/stats`, { headers });
      setStats(statsRes.data.stats || { total: 0, unread: 0, replied: 0, pending: 0 });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(`${API_URL}/chat/messages/${id}/read`, {}, { headers });
      
      setChatMessages((prev) =>
        prev.map((msg) => (msg._id === id ? { ...msg, read: true } : msg))
      );
      fetchStats(token);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllMessagesAsRead = async (sessionId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Get all unread messages in this session
      const unreadMessages = chatMessages.filter(
        msg => msg.sessionId === sessionId && !msg.read && !msg.isAdminMessage
      );
      
      // Mark each as read
      await Promise.all(
        unreadMessages.map(msg => 
          axios.put(`${API_URL}/chat/messages/${msg._id}/read`, {}, { headers })
        )
      );
      
      // Update state
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.sessionId === sessionId && !msg.isAdminMessage
            ? { ...msg, read: true }
            : msg
        )
      );
      
      fetchStats(token);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleReply = async (messageId) => {
    if (!replyText.trim()) return;

    const tempReply = replyText; // Save reply text
    setReplyText(''); // Clear input immediately

    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      console.log('Sending reply to message:', messageId);
      
      const response = await axios.post(
        `${API_URL}/chat/messages/${messageId}/reply`,
        { reply: tempReply },
        { headers }
      );

      console.log('Reply response:', response.data);

      // Mark ALL unread messages in this conversation as read
      if (selectedChat) {
        const unreadMessages = chatMessages.filter(
          msg => msg.sessionId === selectedChat.sessionId && !msg.read && !msg.isAdminMessage
        );
        
        // Mark each unread message as read in the backend
        await Promise.all(
          unreadMessages.map(msg => 
            axios.put(`${API_URL}/chat/messages/${msg._id}/read`, {}, { headers })
          )
        );
        
        // Update state - mark all messages in this session as read
        setChatMessages((prev) =>
          prev.map((msg) => 
            msg.sessionId === selectedChat.sessionId && !msg.isAdminMessage
              ? { ...msg, read: true }
              : msg
          )
        );
      }

      // Don't add here - let Socket.IO handle it to avoid duplicates
      // The Socket.IO 'newMessage' event will add it automatically
      
      fetchStats(token);
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Error sending reply: ' + error.message);
    }
  };

  const handleDeleteChat = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this entire conversation? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      await axios.delete(`${API_URL}/chat/session/${sessionId}`, { headers });
      
      // Remove all messages with this sessionId from state
      setChatMessages((prev) => prev.filter(msg => msg.sessionId !== sessionId));
      
      // Close the chat if it was selected
      if (selectedChat?.sessionId === sessionId) {
        setSelectedChat(null);
      }
      
      fetchStats(token);
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('Error deleting chat: ' + error.message);
    }
  };

  const handleUpdateContactStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(`${API_URL}/contact/${id}/status`, { status }, { headers });
      
      setContacts((prev) =>
        prev.map((contact) => (contact._id === id ? { ...contact, status } : contact))
      );
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - ProgrammedStyle</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Header */}
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
              ProgrammedStyle Admin
            </Typography>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user.name}
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 2,
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MessageIcon sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {stats.total}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Messages
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 2,
                        bgcolor: 'error.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MessageIcon sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {stats.unread}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Unread Messages
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 2,
                        bgcolor: 'success.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MessageIcon sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {stats.replied}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Replied
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 2,
                        bgcolor: 'warning.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ContactMailIcon sx={{ color: 'white' }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {contacts.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Contact Forms
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tabs */}
          <Card>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Chat Messages" />
              <Tab label="Contact Forms" />
            </Tabs>

            {/* Chat Messages Tab - WhatsApp Style */}
            {activeTab === 0 && (
              <Box sx={{ display: 'flex', height: '70vh' }}>
                {/* Conversations List (Left Side) */}
                <Box
                  sx={{
                    width: 350,
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    overflow: 'auto',
                  }}
                >
                  {sortedSessions.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <MessageIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        No conversations yet
                      </Typography>
                    </Box>
                  ) : (
                    sortedSessions.map((session) => (
                      <Box
                        key={session.sessionId}
                        onClick={() => {
                          setSelectedChat(session);
                          // Mark all unread messages as read when opening conversation
                          if (session.unread > 0) {
                            markAllMessagesAsRead(session.sessionId);
                          }
                        }}
                        sx={{
                          p: 2,
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          cursor: 'pointer',
                          bgcolor: selectedChat?.sessionId === session.sessionId ? 'action.selected' : 'transparent',
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '1.2rem',
                            }}
                          >
                            {session.name.charAt(0).toUpperCase()}
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
                                {session.name}
                              </Typography>
                              {session.unread > 0 && (
                          <Chip
                                  label={session.unread}
                            size="small"
                              color="primary"
                                  sx={{ height: 20, minWidth: 20 }}
                                />
                              )}
                            </Box>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {session.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.5 }}>
                              {session.messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]?.isAdminMessage 
                                ? `You: ${session.messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]?.message}`
                                : session.messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]?.message
                              }
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))
                  )}
                </Box>

                {/* Chat Window (Right Side) */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {!selectedChat ? (
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <ChatIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                          Select a conversation to start
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <>
                      {/* Chat Header */}
                      <Box
                        sx={{
                          p: 2,
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          bgcolor: 'background.paper',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              width: 45,
                              height: 45,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 700,
                            }}
                          >
                            {selectedChat.name.charAt(0).toUpperCase()}
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                              {selectedChat.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {selectedChat.email}
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton
                          onClick={() => handleDeleteChat(selectedChat.sessionId)}
                          color="error"
                          title="Delete Conversation"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>

                      {/* Messages Area */}
                      <Box
                        sx={{
                          flex: 1,
                          overflow: 'auto',
                          p: 2,
                          bgcolor: '#f5f5f5',
                        }}
                      >
                        {selectedChat.messages
                          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                          .map((msg, index) => (
                            <Box key={msg._id || index}>
                              {/* Check if this is an admin message or user message */}
                              {msg.isAdminMessage ? (
                                /* Admin Message */
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                                  <Paper
                                    sx={{
                                      p: 1.5,
                                      maxWidth: '70%',
                                      bgcolor: 'white',
                                      borderRadius: 2,
                                      borderBottomLeftRadius: 0,
                                    }}
                                  >
                                    <Typography variant="caption" color="primary" sx={{ fontWeight: 700, mb: 0.5, display: 'block' }}>
                                      You
                                    </Typography>
                                    <Typography variant="body1">{msg.message}</Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{
                                        display: 'block',
                                        mt: 0.5,
                                      }}
                                    >
                                      {new Date(msg.timestamp).toLocaleTimeString()}
                                    </Typography>
                                  </Paper>
                                </Box>
                              ) : (
                                /* User Message */
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                  <Paper
                                    sx={{
                                      p: 1.5,
                                      maxWidth: '70%',
                                      bgcolor: 'primary.main',
                                      color: 'white',
                                      borderRadius: 2,
                                      borderBottomRightRadius: 0,
                                    }}
                                  >
                                    <Typography variant="body1">{msg.message}</Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        opacity: 0.8,
                                        display: 'block',
                                        mt: 0.5,
                                        textAlign: 'right',
                                      }}
                                    >
                                      {new Date(msg.timestamp).toLocaleTimeString()}
                                    </Typography>
                                  </Paper>
                                </Box>
                              )}
                            </Box>
                          ))}
                        <div ref={messagesEndRef} />
                      </Box>

                      {/* Reply Input Area */}
                      <Box
                        sx={{
                          p: 2,
                          borderTop: '1px solid',
                          borderColor: 'divider',
                          bgcolor: 'background.paper',
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Type your reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                // Find the last USER message (not admin message) to reply to
                                const lastUserMsg = selectedChat.messages
                                  .filter(m => !m.isAdminMessage)
                                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
                                if (lastUserMsg) {
                                  handleReply(lastUserMsg._id);
                                }
                              }
                            }}
                          />
                          <IconButton
                            color="primary"
                            onClick={() => {
                              // Find the last USER message (not admin message) to reply to
                              const lastUserMsg = selectedChat.messages
                                .filter(m => !m.isAdminMessage)
                                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
                              if (lastUserMsg) {
                                handleReply(lastUserMsg._id);
                              }
                            }}
                            disabled={!replyText.trim()}
                            sx={{
                              bgcolor: 'primary.main',
                              color: 'white',
                              '&:hover': {
                                bgcolor: 'primary.dark',
                              },
                              '&:disabled': {
                                bgcolor: 'action.disabledBackground',
                              },
                            }}
                          >
                            <SendIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            )}

            {/* Contact Forms Tab */}
            {activeTab === 1 && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Message</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact._id}>
                        <TableCell>{contact.name}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.phone || 'N/A'}</TableCell>
                        <TableCell>{contact.subject}</TableCell>
                        <TableCell>{contact.message}</TableCell>
                        <TableCell>
                          {new Date(contact.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={contact.status}
                            color={
                              contact.status === 'new'
                                ? 'error'
                                : contact.status === 'read'
                                ? 'warning'
                                : 'success'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            onClick={() =>
                              handleUpdateContactStatus(contact._id, 'read')
                            }
                            disabled={contact.status !== 'new'}
                          >
                            Mark Read
                          </Button>
                          <Button
                            size="small"
                            onClick={() =>
                              handleUpdateContactStatus(contact._id, 'replied')
                            }
                            disabled={contact.status === 'replied'}
                          >
                            Mark Replied
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </Container>
      </Box>

    </>
  );
}

