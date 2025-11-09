import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import WebIcon from '@mui/icons-material/Web';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';

const services = [
  {
    icon: <WebIcon sx={{ fontSize: 48 }} />,
    title: 'Custom Web Development',
    description: 'Tailored websites built with the latest technologies like React, Next.js, and Node.js to meet your unique business needs.',
  },
  {
    icon: <PhoneAndroidIcon sx={{ fontSize: 48 }} />,
    title: 'Responsive Design',
    description: 'Mobile-first designs that look perfect on any device, from smartphones to desktop computers.',
  },
  {
    icon: <ShoppingCartIcon sx={{ fontSize: 48 }} />,
    title: 'E-Commerce Solutions',
    description: 'Full-featured online stores with secure payment integration, inventory management, and user-friendly shopping experiences.',
  },
  {
    icon: <SearchIcon sx={{ fontSize: 48 }} />,
    title: 'SEO Optimization',
    description: 'Search engine optimization to help your website rank higher and attract more organic traffic.',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 48 }} />,
    title: 'Performance Optimization',
    description: 'Lightning-fast loading times and optimal performance to keep your visitors engaged.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 48 }} />,
    title: 'Security & Maintenance',
    description: 'Regular updates, security patches, and ongoing support to keep your website safe and running smoothly.',
  },
];

export default function Services() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <Box
      id="services"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: 'background.default',
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
              OUR SERVICES
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
              What We <span className="gradient-text">Offer</span>
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: 'auto', lineHeight: 1.6 }}
            >
              Comprehensive web development services designed to bring your 
              digital vision to life
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    border: '1px solid',
                    borderColor: 'transparent',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(16, 185, 129, 0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4, flexGrow: 1 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                      }}
                    >
                      {service.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, mb: 2 }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ lineHeight: 1.7 }}
                    >
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

