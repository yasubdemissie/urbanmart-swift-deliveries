import { useQuery } from "@tanstack/react-query";
import { apiClient, User } from "../lib/api";

export function useCustomer(id?: string) {
  return useQuery<User, Error>({
    queryKey: ["customer", id],
    queryFn: () => {
      if (!id) throw new Error("No user ID provided");
      const data = apiClient.getCustomer(id).then((data) => {
        console.log("Customer data in the query: ", data);
        return data;
      });
      return data;
    },
    enabled: !!id,
  });
}
