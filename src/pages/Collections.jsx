import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid,
  Chip,
  Paper,
  Fade,
  Zoom,
  Divider,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api.js';

const Collections = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);


  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const products = await productAPI.getProducts();
        
        // Create curated collections with proper category mapping
        const collectionsData = [
          {
            id: 1,
            name: "Luxury Jewelry",
            description: "Exquisite pieces that tell your story",
            image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop",
            products: products.filter(p => p.category === "jewelery").slice(0, 4), // Note: API uses "jewelery" not "jewelry"
            featured: true,
          },
          {
            id: 2,
            name: "Premium Clothing",
            description: "Timeless fashion for the modern individual",
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
            products: products.filter(p => p.category === "women's clothing" || p.category === "men's clothing").slice(0, 4),
            featured: true,
          },
          {
            id: 3,
            name: "Electronics & Tech",
            description: "Cutting-edge technology for your lifestyle",
            image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=600&fit=crop",
            products: products.filter(p => p.category === "electronics").slice(0, 4),
            featured: false,
          },
          {
            id: 4,
            name: "Home & Living",
            description: "Transform your space with elegance",
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
            products: products.filter(p => p.category === "home").slice(0, 4),
            featured: false,
          },
        ];
        
        // Add fallback collections for categories that might be empty
        const fallbackCollections = [
          {
            id: 5,
            name: "All Products",
            description: "Browse our complete collection",
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
            products: products.slice(0, 4),
            featured: false,
          }
        ];
        
        // Filter out collections with no products and add fallback if needed
        const validCollections = collectionsData.filter(collection => collection.products.length > 0);
        
        // If we have no valid collections, use fallback
        if (validCollections.length === 0) {
          setCollections(fallbackCollections);
        } else {
          setCollections(validCollections);
        }
        
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchCollections();
  }, []);


  const handleViewCollection = (collection) => {
    navigate('/products', { state: { category: collection.name.toLowerCase() } });
  };

  const CollectionCard = ({ collection }) => (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.15)',
        '& .collection-image': {
          transform: 'scale(1.1)',
        },
        '& .collection-overlay': {
          opacity: 1,
        },
      },
    }}>
        {/* Collection Image */}
        <Box sx={{ position: 'relative', overflow: 'hidden', height: 280 }}>
          <CardMedia
            component="img"
            height="280"
            image={collection.image}
            alt={collection.name}
            className="collection-image"
            sx={{ 
              objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          
          {/* Overlay */}
          <Box 
            className="collection-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(212, 175, 55, 0.8) 100%)',
              opacity: 0,
              transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleViewCollection(collection);
              }}
              sx={{
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#1a1a1a',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1rem',
                position: 'relative',
                zIndex: 10,
                cursor: 'pointer',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 1)',
                  transform: 'scale(1.05)',
                  boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
                },
                '&:active': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              Explore Collection
            </Button>
          </Box>

          {/* Featured Badge */}
          {collection.featured && (
            <Chip
              label="Featured"
              size="small"
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                background: 'linear-gradient(135deg, #d4af37 0%, #e6c866 100%)',
                color: '#1a1a1a',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography 
            variant="h5" 
            component="h3" 
            sx={{ 
              fontWeight: 700,
              mb: 1,
              background: 'linear-gradient(135deg, #1a1a1a 0%, #d4af37 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {collection.name}
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            {collection.description}
          </Typography>

          {/* Sample Products */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
              Featured Items
            </Typography>
            {collection.products.length > 0 ? (
              <Grid container spacing={1}>
                {collection.products.slice(0, 3).map((product) => (
                  <Grid item xs={4} key={product.id}>
                    <Box sx={{ 
                      position: 'relative',
                      borderRadius: 2,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}>
                      <img
                        src={product.image}
                        alt={product.title}
                        style={{
                          width: '100%',
                          height: '60px',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                No items available in this collection yet.
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1a1a1a 0%, #404040 100%)',
        color: 'white',
        py: 8,
        mb: 6,
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 800,
                mb: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #d4af37 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
              }}
            >
              Curated Collections
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 400,
                opacity: 0.9,
                lineHeight: 1.6,
                fontSize: { xs: '1rem', md: '1.25rem' },
              }}
            >
              Discover our carefully curated collections, each telling a unique story of luxury and sophistication
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        {/* Featured Collections */}
        {collections.filter(c => c.featured && c.products.length > 0).length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                mb: 4,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #1a1a1a 0%, #d4af37 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Featured Collections
            </Typography>
            
            <Grid container spacing={4}>
              {collections.filter(c => c.featured && c.products.length > 0).map((collection) => (
                <Grid item xs={12} md={4} key={collection.id}>
                  <CollectionCard collection={collection} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Divider sx={{ my: 6, opacity: 0.3 }} />

        {/* All Collections */}
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              mb: 4,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #d4af37 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            All Collections
          </Typography>
          
          <Grid container spacing={4}>
            {collections.filter(c => c.products.length > 0).map((collection) => (
              <Grid item xs={12} sm={6} md={4} key={collection.id}>
                <CollectionCard collection={collection} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>


    </Box>
  );
};

export default Collections;
