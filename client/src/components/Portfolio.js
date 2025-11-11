import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function Portfolio() {
  const { t } = useTranslation();

  const projects = [
    {
      title: t('portfolio.projects.ecommerce.title'),
      description: t('portfolio.projects.ecommerce.description'),
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80',
    },
    {
      title: t('portfolio.projects.corporate.title'),
      description: t('portfolio.projects.corporate.description'),
      tags: ['Next.js', 'Material UI', 'SEO'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    },
    {
      title: t('portfolio.projects.realEstate.title'),
      description: t('portfolio.projects.realEstate.description'),
      tags: ['React', 'Express', 'MongoDB'],
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    },
    {
      title: t('portfolio.projects.booking.title'),
      description: t('portfolio.projects.booking.description'),
      tags: ['Next.js', 'Node.js', 'PostgreSQL'],
      image: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=800&q=80',
    },
    {
      title: t('portfolio.projects.socialMedia.title'),
      description: t('portfolio.projects.socialMedia.description'),
      tags: ['React', 'D3.js', 'API Integration'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    },
    {
      title: t('portfolio.projects.restaurant.title'),
      description: t('portfolio.projects.restaurant.description'),
      tags: ['Next.js', 'Material UI', 'MongoDB'],
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    },
  ];

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <Box
      id="portfolio"
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
              {t('portfolio.title')}
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
              {t('portfolio.heading')} <span className="gradient-text">{t('portfolio.headingHighlight')}</span>
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: 'auto', lineHeight: 1.6 }}
            >
              {t('portfolio.description')}
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4}>
          {projects.map((project, index) => (
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
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(16, 185, 129, 0.15)',
                      '& .project-image': {
                        transform: 'scale(1.1)',
                      },
                    },
                  }}
                >
                  <Box sx={{ overflow: 'hidden', height: 240 }}>
                    <CardMedia
                      component="img"
                      height="240"
                      image={project.image}
                      alt={project.title}
                      className="project-image"
                      sx={{
                        transition: 'transform 0.5s ease',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, mb: 2 }}
                    >
                      {project.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, lineHeight: 1.7 }}
                    >
                      {project.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {project.tags.map((tag, tagIndex) => (
                        <Chip
                          key={tagIndex}
                          label={tag}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(16, 185, 129, 0.1)',
                            color: 'primary.main',
                            fontWeight: 600,
                          }}
                        />
                      ))}
                    </Box>
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


