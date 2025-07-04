import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useAuth";

const Profile = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useCurrentUser();
  const user = data?.data?.user;

  useEffect(() => {
    if (!isLoading && (!user || error)) {
      navigate("/SignIn", { replace: true });
    }
  }, [user, isLoading, error, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return null; // Redirect handled in useEffect
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>
        <div className="mb-2">
          <span className="font-semibold">Name:</span> {user.firstName}{" "}
          {user.lastName}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Email:</span> {user.email}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Role:</span> {user.role}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Joined:</span>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
