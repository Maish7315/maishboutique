import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Share2, Minus, Plus, ShoppingBag, Check, Star, Truck, RefreshCw, Shield } from 'lucide-react';
import { products, formatPrice, calculateDiscount, categories } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ProductColor, Size } from '@/types';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/product/ProductGrid';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();

  const product = products.find(p => p.id === productId);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    product?.colors.find(c => c.available) || null
  );
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const discount = product.originalPrice 
    ? calculateDiscount(product.originalPrice, product.price) 
    : 0;
  const category = categories.find(c => c.id === product.category);

  // Related products
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      toast.error('Please select a size');
      return;
    }
    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }

    addItem(product, selectedSize, selectedColor, quantity);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: `Check out ${product.name} at Maish Fashion Boutique`,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div className="page-transition">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`} className="hover:text-foreground">
            {category?.name}
          </Link>
          <span>/</span>
          <span className="text-foreground line-clamp-1">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          {/* Image Gallery */}
          <div className="relative">
            {/* Back Button - Mobile */}
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center md:hidden"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Wishlist & Share - Mobile */}
            <div className="absolute top-4 right-4 z-10 flex gap-2 md:hidden">
              <button
                onClick={() => toggleItem(product)}
                className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
              >
                <Heart className={cn('w-5 h-5', isWishlisted && 'fill-primary text-primary')} />
              </button>
              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]?.src}
                  alt={product.images[selectedImage]?.alt || product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>

              {/* Badges */}
              {product.isSale && discount > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-sale text-white text-sm font-semibold rounded-lg">
                  -{discount}% OFF
                </span>
              )}
              {product.isNew && !product.isSale && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-foreground text-background text-sm font-semibold rounded-lg">
                  NEW
                </span>
              )}

              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      'w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all',
                      i === selectedImage ? 'border-primary' : 'border-transparent opacity-60'
                    )}
                  >
                    <img src={img.src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="md:py-4">
            {/* Title & Actions */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="font-display text-xl md:text-3xl font-bold">
                  {product.name}
                </h1>
                <p className="text-muted-foreground mt-1">{product.subcategory}</p>
              </div>
              
              {/* Desktop Actions */}
              <div className="hidden md:flex gap-2">
                <button
                  onClick={() => toggleItem(product)}
                  className="w-11 h-11 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Heart className={cn('w-5 h-5', isWishlisted && 'fill-primary text-primary')} />
                </button>
                <button
                  onClick={handleShare}
                  className="w-11 h-11 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-4 h-4',
                      i < Math.floor(product.rating) ? 'fill-accent text-accent' : 'text-muted-foreground/30'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className={cn(
                'text-2xl md:text-3xl font-bold',
                product.isSale && 'text-sale'
              )}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Color Selection */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Color</span>
                <span className="text-sm text-muted-foreground">{selectedColor?.name || 'Select color'}</span>
              </div>
              <div className="flex gap-2">
                {product.colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => color.available && setSelectedColor(color)}
                    disabled={!color.available}
                    className={cn(
                      'color-btn',
                      !color.available && 'opacity-30 cursor-not-allowed',
                      selectedColor?.name === color.name && 'selected'
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor?.name === color.name && (
                      <Check className={cn(
                        'w-4 h-4 mx-auto',
                        color.hex === '#ffffff' ? 'text-foreground' : 'text-white'
                      )} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Size</span>
                <button className="text-sm text-primary hover:underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeError(false);
                    }}
                    className={cn(
                      'size-btn',
                      selectedSize === size && 'selected',
                      sizeError && !selectedSize && 'border-destructive'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {sizeError && (
                <p className="text-destructive text-sm mt-2">Please select a size</p>
              )}
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <span className="font-medium block mb-3">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="quantity-btn"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="quantity-btn"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-sm text-muted-foreground ml-2">
                  {product.stock} in stock
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="mt-8 flex gap-3">
              <Button
                size="lg"
                className="flex-1 h-14 text-base"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart - {formatPrice(product.price * quantity)}
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: Truck, label: 'Free delivery over KES 5K' },
                { icon: RefreshCw, label: '7-day returns' },
                { icon: Shield, label: 'Secure checkout' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="text-center p-3 rounded-xl bg-secondary">
                  <Icon className="w-5 h-5 mx-auto text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="font-medium mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              
              {product.features && (
                <ul className="mt-4 space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* SKU */}
            <p className="text-xs text-muted-foreground mt-6">SKU: {product.sku}</p>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <ProductGrid
            products={relatedProducts}
            title="You May Also Like"
            viewAllLink={`/category/${product.category}`}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
