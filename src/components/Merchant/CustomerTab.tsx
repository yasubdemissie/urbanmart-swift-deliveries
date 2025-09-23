import apiClient, { User } from "@/lib/api";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

// Customers Tab Component
export const CustomersTab = () => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await apiClient.getMerchantCustomers({ limit: 20 });
        setCustomers(data.customers);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-4">Loading customers...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Customers</h3>

      <div className="space-y-4">
        {customers?.map((customer) => (
          <Card key={customer.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">
                    {customer.firstName} {customer.lastName}
                  </h4>
                  <p className="text-sm text-gray-600">{customer.email}</p>
                  <p className="text-sm text-gray-600">
                    Customer since{" "}
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">Customer</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
