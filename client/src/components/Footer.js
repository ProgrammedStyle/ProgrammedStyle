import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { Box, Container, Grid, Typography, IconButton, Link } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function Footer() {
  const { t } = useTranslation();

  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 6,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CodeIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Programmed<span className="gradient-text">Style</span>
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('footer.description')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                component="a"
                href="https://www.facebook.com/profile.php?id=61582352101462"
                target="_blank"
                rel="noopener noreferrer"
                size="small" 
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton 
                component="a"
                href="https://www.instagram.com/programmedstyle/"
                target="_blank"
                rel="noopener noreferrer"
                size="small" 
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                <InstagramIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {t('footer.quickLinks')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { label: t('nav.home'), href: '#home' },
                { label: t('nav.services'), href: '#services' },
                { label: t('nav.portfolio'), href: '#portfolio' },
                { label: t('nav.about'), href: '#about' },
                { label: t('nav.contact'), href: '#contact' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {t('footer.contactUs')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  programmedstyle@gmail.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  00970592067569
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  Nablus Street, Qalqilia, Palestine
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            mt: 6,
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} {t('footer.copyright')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}


