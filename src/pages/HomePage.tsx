import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, Shield, RefreshCw, Sparkles, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { CategoryGrid } from '@/components/category/CategoryCard';
import { ReviewsSlider } from '@/components/reviews/ReviewCard';
import { PromoBannerSlider } from '@/components/promo/PromoBanner';
import { categories, products, googleReviews, weekendOffers, getNewArrivals, getSaleProducts, isWeekendSaleActive } from '@/data/products';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const HomePage: React.FC = () => {
  const newArrivals = getNewArrivals();
  const saleProducts = getSaleProducts();
  const popularProducts = products.slice(0, 8);
  const accessoriesProducts = products.filter(p => p.category === 'accessories').slice(0, 8);
  const isWeekend = isWeekendSaleActive();

  // Newsletter state
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle newsletter subscription
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setSubscribeStatus('error');
      setErrorMessage('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubscribeStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setSubscribeStatus('loading');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: email.toLowerCase().trim(), status: 'subscribed' }]);

      if (error) {
        if (error.code === '23505') {
          // Unique violation - email already exists
          setSubscribeStatus('error');
          setErrorMessage('This email is already subscribed!');
        } else {
          throw error;
        }
      } else {
        setSubscribeStatus('success');
        setEmail('');
        
        // Send confirmation email via Edge Function
        try {
          await supabase.functions.invoke('send-newsletter-confirmation', {
            body: { email: email.toLowerCase().trim() }
          });
        } catch (edgeError) {
          console.log('Edge Function not available or failed:', edgeError);
          // Continue anyway - subscription was successful
        }
        
        // Reset to idle after 5 seconds
        setTimeout(() => setSubscribeStatus('idle'), 5000);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscribeStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="hero-section relative overflow-hidden">
        <div className="container mx-auto px-4 py-6 md:py-12">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium mb-3 md:mb-4">
                <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
                New Collection 2026
              </span>
              <h1 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Style That Speaks
                <span className="text-gradient block mt-1">Maish Boutique outfits.</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base mt-3 md:mt-4 max-w-lg">
                Discover authentic African fashion meets modern elegance. From traditional Ankara to contemporary workwear, find your perfect style.
              </p>
              
              <div className="flex flex-wrap gap-2.5 md:gap-3 mt-4 md:mt-6">
                <Button size="lg" className="h-11 md:h-12" asChild>
                  <Link to="/category/women-wear">
                    Shop Women
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-11 md:h-12" asChild>
                  <Link to="/category/men-wear">
                    Shop Men
                  </Link>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 md:gap-6 mt-5 md:mt-8 text-xs md:text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Truck className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  <span>Free Delivery Over KES 25K</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Shield className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  <span>Secure Payments</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <RefreshCw className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  <span>Easy Returns between 72hrs</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative hidden md:block"
            >
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5]">
                <img
                  src="/images/hero-fashion.webp"
                  alt="Fashion model wearing elegant dress"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
              </div>
              
              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute -bottom-4 -left-4 bg-card p-4 rounded-2xl shadow-card-hover"
              >
                <p className="text-sm font-medium">Weekend Sale</p>
                <p className="text-2xl font-display font-bold text-primary">40% OFF</p>
                <p className="text-xs text-muted-foreground">On the image above</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Promo Banners - Only show on Friday, Saturday, Sunday */}
      {isWeekend && (
        <section className="container mx-auto px-4 py-6">
          <PromoBannerSlider banners={weekendOffers} />
        </section>
      )}

      {/* Categories Scroll */}
      <section className="py-6 md:py-10">
        <div className="flex items-end justify-between mb-4 px-4 md:px-0 container mx-auto">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-semibold">Shop by Category</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Find what you're looking for</p>
          </div>
          <Link to="/categories" className="text-sm font-medium text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="container mx-auto">
          <CategoryGrid categories={categories} variant="scroll" />
        </div>
      </section>

      {/* New Arrivals */}
      <div className="container mx-auto">
        <ProductGrid
          products={newArrivals}
          title="New Arrivals"
          subtitle="Fresh styles just dropped"
          viewAllLink="/new-arrivals"
        />
      </div>

      {/* Weekend Sale Banner - Only show on Friday, Saturday, Sunday */}
      {isWeekend && (
        <section className="container mx-auto px-4 py-6">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-sale to-primary p-6 md:p-10">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
                backgroundSize: '30px 30px'
              }} />
            </div>
            
            <div className="relative z-10 text-white">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-3">
                Limited Time Offer
              </span>
              <h2 className="font-display text-2xl md:text-4xl font-bold">Weekend Flash Sale</h2>
              <p className="text-white/90 mt-2 max-w-md">
                Get up to 40% off on selected items. Don't miss out on these amazing deals!
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="mt-6 bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link to="/sale">
                  Shop Sale Items
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Accessories Section */}
      <div className="container mx-auto">
        <ProductGrid
          products={accessoriesProducts}
          title="Accessories"
          subtitle="Complete your look"
          viewAllLink="/category/accessories"
        />
      </div>

      {/* Sale Products - Only show on Friday, Saturday, Sunday */}
      {isWeekend && saleProducts.length > 0 && (
        <div className="container mx-auto">
          <ProductGrid
            products={saleProducts}
            title="On Sale 🔥"
            subtitle="Grab them before they're gone"
            viewAllLink="/sale"
          />
        </div>
      )}

      {/* Non-Weekend Message */}
      {!isWeekend && (
        <section className="container mx-auto px-4 py-6">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-muted to-secondary p-6 md:p-10">
            <div className="flex items-center justify-center gap-3">
              <Clock className="w-8 h-8 text-primary" />
              <div className="text-center">
                <h2 className="font-display text-2xl md:text-3xl font-bold">Weekend Flash Sale Coming Soon!</h2>
                <p className="text-muted-foreground mt-2">
                  Our amazing deals will be back on <span className="font-semibold text-primary">Friday</span>. Mark your calendar!
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Popular Products */}
      <div className="container mx-auto">
        <ProductGrid
          products={popularProducts}
          title="Trending Now"
          subtitle="Customer favorites"
        />
      </div>

      {/* Google Reviews */}
      <div className="container mx-auto">
        <ReviewsSlider reviews={googleReviews} title="What Our Customers Say" />
      </div>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { icon: Truck, title: 'Fast Delivery', desc: 'Countrywide shipping' },
            { icon: Shield, title: 'Secure Payment', desc: 'M-Pesa & Cards accepted' },
            { icon: RefreshCw, title: 'Easy Returns', desc: '7-day return policy' },
            { icon: Sparkles, title: 'Quality Assured', desc: 'Handpicked products' },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-3 md:p-4 rounded-xl bg-card border border-border"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center mb-2 md:mb-3">
                <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xs md:text-sm">{feature.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container mx-auto px-4 pb-10">
        <div className="bg-secondary rounded-3xl p-6 md:p-10 text-center">
          <h2 className="font-display text-xl md:text-2xl font-semibold">Stay in Style</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Subscribe to get exclusive offers, new arrivals, and style tips delivered to your inbox.
          </p>
          
          {subscribeStatus === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center max-w-md mx-auto mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl"
            >
              <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
              <p className="font-medium text-green-700 dark:text-green-300">
                You're subscribed! Check your email for confirmation.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-6">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (subscribeStatus === 'error') setSubscribeStatus('idle');
                  }}
                  placeholder="Enter your email"
                  disabled={subscribeStatus === 'loading'}
                  className={`w-full h-12 px-4 rounded-xl bg-background border transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                    subscribeStatus === 'error' ? 'border-red-500 focus:border-red-500' : 'border-border'
                  }`}
                />
                {subscribeStatus === 'error' && (
                  <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-red-500 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>
              <Button 
                size="lg" 
                type="submit"
                disabled={subscribeStatus === 'loading'}
                className="h-12 min-w-[120px]"
              >
                {subscribeStatus === 'loading' ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Subscribing...
                  </span>
                ) : (
                  'Subscribe'
                )}
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
