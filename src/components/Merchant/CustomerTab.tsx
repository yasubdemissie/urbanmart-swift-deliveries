import apiClient, { MerchantCustomer, User } from "@/lib/api";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Link, Loader2, Users } from "lucide-react";
import { Button } from "../ui/button";
import { CustomerCard } from "./customerCard";

// Customers Tab Component
export const CustomersTab = () => {
  const [customers, setCustomers] = useState<MerchantCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await apiClient.getMerchantCustomers({ limit: 20 });
        if (data.success) {
          const customers = data.data.customers || ([] as MerchantCustomer[]);
          console.log("Customers:", customers);
          setCustomers(customers);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Loading Customers...
        </h3>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Customers Found
        </h3>
        <p className="text-gray-600">
          Users will be added to this list as they make their first purchase.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Customers</h3>

      <div className="space-y-4">
        {customers?.map((customer: MerchantCustomer) => {
          console.log("Customer:", customer.customer);
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">
              <CustomerCard
                key={customer.id}
                customer={customer.customer as User}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
