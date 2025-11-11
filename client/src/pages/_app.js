import * as React from 'react';
import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createEmotionCache from '../utils/createEmotionCache';
import theme from '../theme/theme';
import { LanguageProvider } from '../contexts/LanguageContext';
import '../styles/globals.css';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <LanguageProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </LanguageProvider>
    </CacheProvider>
  );
}

