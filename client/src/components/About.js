import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function About() {
  const { t } = useTranslation();
  
  const features = [
    t('about.features.experts'),
    t('about.features.modern'),
    t('about.features.responsive'),
    t('about.features.seo'),
    t('about.features.fast'),
    t('about.features.support'),
    t('about.features.pricing'),
    t('about.features.communication'),
  ];

  const values = [
    {
      icon: <GroupsIcon sx={{ fontSize: 40 }} />,
      title: t('about.values.clientFocused.title'),
      description: t('about.values.clientFocused.description'),
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
      title: t('about.values.quality.title'),
      description: t('about.values.quality.description'),
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 40 }} />,
      title: t('about.values.passionate.title'),
      description: t('about.values.passionate.description'),
    },
  ];

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <Box
      id="about"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Left Side - Info */}
          <Grid item xs={12} md={6}>
            <motion.div
              ref={ref}
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: 'primary.main',
                  fontWeight: 700,
                  fontSize: '1rem',
                  letterSpacing: 2,
                }}
              >
                {t('about.title')}
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
                {t('about.heading')} <span className="gradient-text">{t('about.headingHighlight')}</span>
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4, lineHeight: 1.8, fontSize: '1.1rem' }}
              >
                {t('about.description')}
              </Typography>

              <Box sx={{ mb: 4 }}>
                {features.map((feature, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {/* Right Side - Stats & Values */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                {values.map((value, index) => (
                  <Card
                    key={index}
                    sx={{
                      transition: 'all 0.3s ease',
                      border: '1px solid',
                      borderColor: 'transparent',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateX(8px)',
                        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ display: 'flex', gap: 3, p: 3 }}>
                      <Avatar
                        sx={{
                          width: 70,
                          height: 70,
                          bgcolor: 'rgba(16, 185, 129, 0.1)',
                          color: 'primary.main',
                        }}
                      >
                        {value.icon}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, mb: 1 }}
                        >
                          {value.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.6 }}
                        >
                          {value.description}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}


