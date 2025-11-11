import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from '../contexts/LanguageContext';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Contact() {
  const { t, language } = useTranslation();
  const isRTL = language === 'ar';

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      await axios.post(`${API_URL}/contact`, formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 32 }} />,
      title: t('contact.info.email'),
      value: 'programmedstyle@gmail.com',
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 32 }} />,
      title: t('contact.info.phone'),
      value: '00970592067569',
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 32 }} />,
      title: t('contact.info.location'),
      value: 'Nablus Street, Qalqilia, Palestine',
    },
  ];

  return (
    <Box
      id="contact"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: 2,
              }}
            >
              {t('contact.title')}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                mt: 2,
                mb: 3,
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3rem' },
              }}
            >
              {t('contact.heading')} <span className="gradient-text">{t('contact.headingHighlight')}</span>
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: 'auto', lineHeight: 1.6 }}
            >
              {t('contact.description')}
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4}>
          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {contactInfo.map((info, index) => (
                  <Card
                    key={index}
                    sx={{
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                        }}
                      >
                        {info.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, mb: 1 }}
                      >
                        {info.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                      >
                        {info.value}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label={t('contact.form.name')}
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label={t('contact.form.email')}
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label={t('contact.form.phone')}
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label={t('contact.form.subject')}
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label={t('contact.form.message')}
                          name="message"
                          multiline
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        {success && (
                          <Alert severity="success" sx={{ mb: 2 }}>
                            {t('contact.form.success')}
                          </Alert>
                        )}
                        {error && (
                          <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                          </Alert>
                        )}
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          fullWidth
                          disabled={loading}
                          {...(isRTL 
                            ? { startIcon: loading ? <CircularProgress size={20} /> : <SendIcon /> }
                            : { endIcon: loading ? <CircularProgress size={20} /> : <SendIcon /> }
                          )}
                          sx={{ 
                            py: 1.5,
                            '& .MuiButton-startIcon': {
                              marginLeft: isRTL ? '12px' : '-4px',
                              marginRight: isRTL ? '0px' : '8px',
                            },
                          }}
                        >
                          {loading ? t('contact.form.sending') : t('contact.form.send')}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}


