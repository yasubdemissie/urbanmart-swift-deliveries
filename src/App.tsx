import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConfirmProvider } from "@/components/ui/confirm-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Categories from "./pages/Categories";
import Deals from "./pages/Deals";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import TrackOrder from "./pages/TrackOrder";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import Admin from "./pages/Admin";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import { CartProvider } from "./context/cartContext.tsx";
import UserDetails from "./components/admin/userDetails";
// import AdminOrderDetailsPage from "./pages/AdminOrderDetailsPage";
import OrdersPage from "./pages/Orders";
import MerchantDashboard from "./pages/MerchantDashboard";
import AddProductPage from "./pages/AddProductPage";
import Delivery from "./pages/Delivery.tsx";
import MerchantPage from "./components/Merchant/MerchantPage.tsx";
import Merchants from "./pages/Merchants.tsx";

const queryClient = new QueryClient();

const App = () => (
  <CartProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ConfirmProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/delivery" element={<Delivery />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/track" element={<TrackOrder />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/merchants" element={<Merchants />} />
              <Route path="/merchant/:id" element={<MerchantPage />} />

              {/* Merchant Routes - Nested routing */}
              <Route
                path="/merchant-dashboard/*"
                element={<MerchantDashboard />}
              />

              {/* Merchant Product Routes */}
              <Route path="/merchant/products/new" element={<AddProductPage />} />

              {/* Customer Routes */}
              <Route path="/signin" element={<SignIn />} />

              {/* Admin Routes - Nested routing */}
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/admin/users/:id" element={<UserDetails />} />
              {/* <Route
                path="/admin/orders/:id"
                element={<AdminOrdersPage />}
              /> */}
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ConfirmProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </CartProvider>
);

export default App;
