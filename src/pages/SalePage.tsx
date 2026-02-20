import React from 'react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { getSaleProducts, products, formatPrice } from '@/data/products';
import { PromoBanner } from '@/components/promo/PromoBanner';

const SalePage: React.FC = () => {
  const saleProducts = getSaleProducts();
  // Get weekend flash sale products specifically
  const weekendSaleProducts = products.filter(p => p.id.startsWith('weekend-sale-'));
  // Combine weekend sale products with regular sale products
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
