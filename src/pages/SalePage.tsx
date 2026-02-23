import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductGrid } from '@/components/product/ProductGrid';
import { getSaleProducts, products } from '@/data/products';
import { PromoBanner } from '@/components/promo/PromoBanner';
import { Button } from '@/components/ui/button';

const SalePage: React.FC = () => {
  const navigate = useNavigate();
  
  // Check if today is a weekend day (Friday=5, Saturday=6, Sunday=0)
  // Kenya is UTC+3, so we need to adjust for that
  const isWeekend = useMemo(() => {
    const now = new Date();
    // Get Kenya time (UTC+3)
    const kenyaTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    const day = kenyaTime.getDay();
    return day === 5 || day === 6 || day === 0; // Friday, Saturday, Sunday
  }, []);

  // Get day name for display
  const getDayName = () => {
    const now = new Date();
    const kenyaTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[kenyaTime.getDay()];
  };

  // If it's not weekend (Monday to Thursday), show no sale page
  if (!isWeekend) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            {/* Icon */}
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <span className="text-5xl">😔</span>
            </div>
            
            {/* Message */}
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              No Weekend Flash Sale Today
            </h1>
            
            <p className="text-lg text-muted-foreground mb-2">
              Today's is <strong>{getDayName()}</strong>
            </p>
            
            <p className="text-muted-foreground mb-8">
              Our weekend flash sales are only available on <strong>Friday, Saturday, and Sunday</strong>. 
              Come back during the weekend for amazing deals up to 75% OFF!
            </p>
            
            {/* Promo info */}
            <div className="bg-muted rounded-xl p-4 mb-8">
              <p className="text-sm text-muted-foreground mb-2">
                💡 <strong>Tip:</strong> Use code <span className="font-mono font-bold text-primary">332211</span> for extra 15% off during the weekend!
              </p>
              <p className="text-xs text-muted-foreground">
                (Valid Friday, Saturday & Sunday only)
              </p>
            </div>
            
            {/* Back to Home Button */}
            <Button 
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-6 py-3 text-lg"
              size="lg"
            >
              ← Click Here to Go Back to Homepage
            </Button>
            
            {/* Weekend countdown hint */}
            <p className="mt-6 text-sm text-muted-foreground">
              🎉 Don't miss out the offers. See you during the weekend! 🎉
            </p>
          </div>
        </div>
      </div>
    );
  }

  // It's weekend (Friday, Saturday, Sunday) - show the sale page
  const saleProducts = getSaleProducts();
  const weekendSaleProducts = products.filter(p => p.id.startsWith('weekend-sale-'));
  const allProducts = [...weekendSaleProducts, ...saleProducts, ...products.slice(0, 6)];

  return (
    <div className="page-transition min-h-screen">
      {/* Sale Banner */}
      <div className="bg-gradient-to-r from-sale to-primary text-white py-8 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
            🔥 WEEKEND FLASH SALE 🔥
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-bold">Weekend Special Deals</h1>
          <p className="text-white/90 mt-3 max-w-lg mx-auto text-lg">
            Amazing savings up to 75% OFF! Use code <strong>332211</strong> for an extra 15% off everything!
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white text-sale rounded-xl">
            <span className="font-bold">Use code:</span>
            <span className="font-mono font-bold text-xl">332211</span>
          </div>
          <p className="text-white/80 mt-3 text-sm">Valid Friday, Saturday & Sunday only!</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <PromoBanner
          title="⚡ Weekend Flash Sale - Best Deals!"
          subtitle="Use code 332211 for EXTRA 15% off - Friday, Saturday & Sunday only!"
          code="332211"
          countdown
        />
      </div>

      {/* Weekend Flash Sale Special Products */}
      {weekendSaleProducts.length > 0 && (
        <div className="container mx-auto px-4 py-6">
          <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-6 text-white text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">🔥 HOT WEEKEND DEALS 🔥</h2>
            <p className="text-white/90 mb-4">Shop these amazing weekend specials and save big!</p>
            <p className="text-sm bg-white/20 inline-block px-4 py-2 rounded-lg">
              Don't forget to use code <strong className="text-xl">332211</strong> at checkout for extra 15% off!
            </p>
          </div>
          <div className="mt-6">
            <ProductGrid
              products={weekendSaleProducts}
              title="🔥 Weekend Flash Sale Best Deals"
              subtitle={`${weekendSaleProducts.length} HOT DEALS - Up to 75% off! Use code 332211 for extra 15% off`}
              columns={2}
            />
          </div>
        </div>
      )}

      <div className="container mx-auto">
        <ProductGrid
          products={allProducts}
          title="Sale Items"
          subtitle={`${allProducts.length} items on sale`}
          columns={2}
        />
      </div>
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg font-semibold">
          🎉 Shop the best weekend deals and use code <span className="text-sale font-bold">332211</span> for extra 15% off!
        </p>
      </div>
    </div>
  );
};

export default SalePage;
