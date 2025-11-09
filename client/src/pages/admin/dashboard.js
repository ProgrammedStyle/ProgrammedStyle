import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import MessageIcon from '@mui/icons-material/Message';
import ContactMailIcon from '@mui/icons-material/ContactMail';
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
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');

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
      setChatMessages((prev) => [message, ...prev]);
      fetchStats(token);
    });

    return () => {
      socket.disconnect();
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

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(
        `${API_URL}/chat/messages/${selectedMessage._id}/reply`,
        { reply: replyText },
        { headers }
      );

      setChatMessages((prev) =>
        prev.map((msg) =>
          msg._id === selectedMessage._id
            ? { ...msg, replied: true, adminReply: replyText }
            : msg
        )
      );
      setSelectedMessage(null);
      setReplyText('');
      fetchStats(token);
    } catch (error) {
      console.error('Error sending reply:', error);
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

            {/* Chat Messages Tab */}
            {activeTab === 0 && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Message</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {chatMessages.map((msg) => (
                      <TableRow key={msg._id}>
                        <TableCell>{msg.name}</TableCell>
                        <TableCell>{msg.email}</TableCell>
                        <TableCell>{msg.message}</TableCell>
                        <TableCell>
                          {new Date(msg.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={msg.read ? 'Read' : 'Unread'}
                            color={msg.read ? 'success' : 'error'}
                            size="small"
                          />
                          {msg.replied && (
                            <Chip
                              label="Replied"
                              color="primary"
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {!msg.read && (
                            <Button
                              size="small"
                              onClick={() => handleMarkAsRead(msg._id)}
                            >
                              Mark Read
                            </Button>
                          )}
                          <Button
                            size="small"
                            onClick={() => {
                              setSelectedMessage(msg);
                              setReplyText(msg.adminReply || '');
                            }}
                          >
                            {msg.replied ? 'View Reply' : 'Reply'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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

      {/* Reply Dialog */}
      <Dialog
        open={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedMessage?.replied ? 'View Reply' : 'Reply to Message'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Original Message:
            </Typography>
            <Typography variant="body1">{selectedMessage?.message}</Typography>
          </Box>
          <TextField
            fullWidth
            label="Your Reply"
            multiline
            rows={4}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            disabled={selectedMessage?.replied}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedMessage(null)}>Cancel</Button>
          {!selectedMessage?.replied && (
            <Button onClick={handleReply} variant="contained">
              Send Reply
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

