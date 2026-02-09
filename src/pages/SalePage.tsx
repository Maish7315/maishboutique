import React from 'react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { getSaleProducts, products } from '@/data/products';
import { PromoBanner } from '@/components/promo/PromoBanner';

const SalePage: React.FC = () => {
  const saleProducts = getSaleProducts();
  // Add more products for demo
  const allProducts = [...saleProducts, ...products.slice(0, 6)];

  return (
    <div className="page-transition min-h-screen">
      {/* Sale Banner */}
      <div className="bg-gradient-to-r from-sale to-primary text-white py-8 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
            Limited Time Only
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-bold">Weekend Flash Sale</h1>
          <p className="text-white/90 mt-3 max-w-md mx-auto">
            Up to 40% off on selected items. Don't miss out on these amazing deals!
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl">
            <span>Use code:</span>
            <span className="font-mono font-bold text-lg">MAISH40</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <PromoBanner
          title="Extra 10% Off"
          subtitle="On orders over KES 10,000"
          code="EXTRA10"
          countdown
        />
      </div>

      <div className="container mx-auto">
        <ProductGrid
          products={allProducts}
          title="Sale Items"
          subtitle={`${allProducts.length} items on sale`}
          columns={2}
        />
      </div>
    </div>
  );
};

export default SalePage;
