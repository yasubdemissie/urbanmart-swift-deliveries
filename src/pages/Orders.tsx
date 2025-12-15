import React from "react";
import { useNavigate } from "react-router-dom";
import { Order } from "@/lib/api";
import OrderCard from "@/components/Order/OrderCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Plus, ArrowLeft } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import Header from "@/components/Custom/Header";

const OrdersPage = () => {
  const navigate = useNavigate();
  const { data: orderWithPage, isLoading, error } = useOrders();
  const { orders = [], pagination } = orderWithPage || {};

  const totalSpent = Array.isArray(orders)
    ? orders.reduce((sum, order) => sum + Number(order.total || 0), 0)
    : 0;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-10">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
          <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                My Orders
              </h1>
              <p className="text-gray-600">
                View your order history and track your purchases.
              </p>
            </div> */}
            <Button
              onClick={() => navigate("/shop")}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Shop More
            </Button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
              <ShoppingCart className="w-10 h-10 text-blue-500" />
              <div>
                <p className="text-lg font-semibold">{orders.length}</p>
                <p className="text-gray-500">Total Orders</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-xl">
                $
              </span>
              <div>
                <p className="text-lg font-semibold">
                  ${totalSpent.toFixed(2)}
                </p>
                <p className="text-gray-500">Total Spent</p>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-12">
              {error.message}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-semibold mb-2">No Orders Yet</h2>
              <p className="text-gray-500 mb-6">
                You haven't placed any orders yet. Start shopping now!
              </p>
              <Button onClick={() => navigate("/shop")}>Go to Shop</Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="cursor-pointer"
                >
                  <OrderCard order={order} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      );
    </>
  );
};

export default OrdersPage;
