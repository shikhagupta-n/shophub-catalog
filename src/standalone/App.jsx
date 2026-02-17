import React, { Suspense, useCallback, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, CircularProgress, CssBaseline } from '@mui/material';

import Products from '../pages/Products.jsx';
import ProductDetail from '../pages/ProductDetail.jsx';
import Collections from '../pages/Collections.jsx';
import About from '../pages/About.jsx';

function FullPageLoader() {
  return (
    <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  );
}

function AppLayout() {
  const [cartItems, setCartItems] = useState([]);
  const theme = useMemo(() => createTheme(), []);

  const addToCart = useCallback(async (product, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + qty } : i));
      return [...prev, { ...product, quantity: qty }];
    });
    return true;
  }, []);

  const showError = useCallback((msg) => console.error(msg), []);
  const showSuccess = useCallback((msg) => console.log(msg), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          <Route path="/products" element={<Products addToCart={addToCart} showError={showError} />} />
          <Route
            path="/product/:id"
            element={
              <ProductDetail
                addToCart={addToCart}
                cartItems={cartItems}
                showError={showError}
                showSuccess={showSuccess}
              />
            }
          />
          <Route path="/collections" element={<Collections />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/checkout"
            element={
              <Box sx={{ p: 4 }}>
                {/* Reason: in standalone mode, the shell + checkout MFE are not mounted. */}
                <Box sx={{ maxWidth: 720, mx: 'auto' }}>
                  <Box sx={{ mb: 2, fontSize: 18, fontWeight: 600 }}>Checkout is not available here.</Box>
                  <Box style={{ color: '#666' }}>
                    The <code>/checkout</code> route is owned by the shell + checkout microfrontend. Run the shell to test
                    the full purchase flow.
                  </Box>
                </Box>
              </Box>
            }
          />
          <Route path="/cart" element={<Navigate to="/products" replace />} />
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default function StandaloneCatalogApp() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

