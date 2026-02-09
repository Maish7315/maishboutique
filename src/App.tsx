import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <WishlistProvider>
          <Toaster />
          <Sonner position="top-center" />
          <BrowserRouter>
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
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
