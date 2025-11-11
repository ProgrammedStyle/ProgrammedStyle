import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from '../contexts/LanguageContext';

export default function Hero() {
  const { t, language } = useTranslation();
  const isRTL = language === 'ar';
  
  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToServices = () => {
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box
      id="home"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #0d9488 100%)',
        position: 'relative',
        overflow: 'hidden',
        pt: 8,
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23D0EDE4\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  px: 2,
                  py: 1,
                  borderRadius: 10,
                  mb: 3,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <RocketLaunchIcon sx={{ color: 'white', fontSize: 20 }} />
                <Typography
                  variant="body2"
                  sx={{ color: 'white', fontWeight: 600 }}
                >
                  {t('hero.badge')}
                </Typography>
              </Box>

              <Typography
                variant="h1"
                sx={{
                  color: 'white',
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  lineHeight: 1.2,
                }}
              >
                {t('hero.title')}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  mb: 4,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                {t('hero.description')}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={scrollToContact}
                  {...(isRTL ? { startIcon: <ArrowForwardIcon /> } : { endIcon: <ArrowForwardIcon /> })}
                  sx={{
                    background: 'linear-gradient(135deg, #5ec1a2 0%, #06bf8b 100%)',
                    color: '#ffffff',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 14px rgba(6, 191, 139, 0.3)',
                    '& .MuiButton-endIcon': {
                      color: '#ffffff',
                    },
                    '& .MuiButton-startIcon': {
                      color: '#ffffff',
                      marginLeft: isRTL ? '12px' : '-4px',
                      marginRight: isRTL ? '0px' : '8px',
                    },
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4db398 0%, #05a876 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(6, 191, 139, 0.25)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {t('hero.getStarted')}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={scrollToServices}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {t('hero.ourServices')}
                </Button>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {/* Animated circles */}
                <Box
                  sx={{
                    width: { xs: 300, md: 400 },
                    height: { xs: 300, md: 400 },
                    borderRadius: '50%',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    animation: 'float 6s ease-in-out infinite',
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-20px)' },
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: '80%',
                      height: '80%',
                      borderRadius: '50%',
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        color: 'rgb(208, 237, 228)',
                        fontWeight: 800,
                        textAlign: 'center',
                      }}
                    >
                      &lt;/&gt;
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Grid 
            container 
            spacing={4} 
            sx={{ 
              mt: { xs: 4, md: 8 },
              pt: { xs: 4, md: 6 },
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {[
              { number: '5+', label: t('hero.stats.projects') },
              { number: '4+', label: t('hero.stats.clients') },
              { number: '5+', label: t('hero.stats.experience') },
              { number: '24/7', label: t('hero.stats.support') },
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h3"
                    sx={{
                      color: 'white',
                      fontWeight: 800,
                      mb: 1,
                      fontSize: { xs: '2rem', md: '2.5rem' },
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'white',
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}

