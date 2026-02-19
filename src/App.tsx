import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { OrderProvider } from "@/context/OrderContext";
import { AuthProvider } from "@/context/AuthContext";
import { Layout } from "@/components/layout/Layout";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import CategoriesPage from "./pages/CategoriesPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import SearchPage from "./pages/SearchPage";
import CartPage from "./pages/CartPage";
import AccountPage from "./pages/AccountPage";
import SalePage from "./pages/SalePage";
import NewArrivalsPage from "./pages/NewArrivalsPage";
import WishlistPage from "./pages/WishlistPage";
import NotFound from "./pages/NotFound";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import AboutPage from "./pages/AboutPage";
import ShippingInfoPage from "./pages/ShippingInfoPage";
import FAQPage from "./pages/FAQPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>
              <Toaster />
              <Sonner position="top-center" />
              <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/category/:categoryId" element={<CategoryPage />} />
                    <Route path="/product/:productId" element={<ProductDetailPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/sale" element={<SalePage />} />
                    <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms" element={<TermsOfServicePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/shipping" element={<ShippingInfoPage />} />
                    <Route path="/faqs" element={<FAQPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
