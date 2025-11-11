import React from 'react';
import { IconButton, Menu, MenuItem, Box, Typography } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from '../contexts/LanguageContext';

export default function LanguageSwitcher({ scrolled }) {
  const { language, changeLanguage } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    handleClose();
  };

  const languages = [
    { code: 'en', label: 'English', nativeLabel: 'English' },
    { code: 'ar', label: 'Arabic', nativeLabel: 'العربية' },
  ];

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: scrolled ? 'text.primary' : 'white',
          ml: 1,
        }}
        aria-label="change language"
      >
        <LanguageIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={lang.code === language}
            sx={{
              minWidth: 150,
            }}
          >
            <Box>
              <Typography 
                variant="body1" 
                sx={{ fontWeight: lang.code === language ? 700 : 400 }}
              >
                {lang.nativeLabel}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {lang.label}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
