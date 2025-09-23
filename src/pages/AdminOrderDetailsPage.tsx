// import { useParams, useNavigate } from "react-router-dom";
// import { useAdminOrders } from "@/hooks/useAdmin";
// import OrderDetails from "@/components/Order/OrderDetails";

// const AdminOrderDetailsPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate(); 
//   const { data: order, isLoading, error } = useAdminOrders({ id });

//   if (isLoading) return <div className="p-8 text-center">Loading...</div>;
//   if (error)
//     return <div className="p-8 text-center text-red-500">{error.message}</div>;
//   if (!order) return <div className="p-8 text-center">Order not found</div>;

//   return <OrderDetails order={order} onClose={() => navigate(-1)} />;
// };

// export default AdminOrderDetailsPage;
