"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  Mail,
  Phone,
  Calendar,
  Shield,
  Camera,
  Save,
  Edit3,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { User } from "@/lib/api";
import { useCurrentUser, useUpdateProfile, useRequestRoleChange } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/Custom/BackButon";

const ProfilePage = () => {
  const navigate = useNavigate();
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser();
  const updateProfileMutation = useUpdateProfile();
  const requestRoleChangeMutation = useRequestRoleChange();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [avatarUrlInput, setAvatarUrlInput] = useState("");
  const [roleChoice, setRoleChoice] = useState<"MERCHANT" | "DELIVERY">(
    "MERCHANT"
  );
  const [merchantForm, setMerchantForm] = useState({
    shopName: "",
    businessType: "",
    description: "",
  });
  const [deliveryForm, setDeliveryForm] = useState({
    fullName: "",
    capacity: "",
    capacityUnit: "per hour",
    vehicleType: "",
    notes: "",
  });
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || "",
      });
      setAvatarUrlInput(user.avatar || "");
      setSelectedImage(user.avatar || null);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Only send allowed fields and filter out undefined/empty
      const payload: Partial<User> = {};
      if (formData.firstName) payload.firstName = formData.firstName;
      if (formData.lastName) payload.lastName = formData.lastName;
      if (formData.phone) payload.phone = formData.phone;
      if (avatarUrlInput) payload.avatar = avatarUrlInput;

      await updateProfileMutation.mutateAsync(payload);
      setIsEditing(false);
      setSelectedImage(avatarUrlInput || null);
      toast.success("Profile updated successfully!");
    } catch (error) {
      // Log the error for debugging
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || "",
      });
      setAvatarUrlInput(user.avatar || "");
      setSelectedImage(user.avatar || null);
    }
    setIsEditing(false);
  };

  const simulatePayment = async () => {
    setIsPaying(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsPaying(false);
    toast.success(
      `${roleChoice === "MERCHANT" ? "1500" : "600"} birr payment simulated`
    );
  };

  const handleRoleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (roleChoice === "MERCHANT") {
      if (!merchantForm.shopName || !merchantForm.businessType) {
        toast.error("Please fill shop name and business type");
        return;
      }
    } else {
      if (
        !deliveryForm.fullName ||
        !deliveryForm.capacity ||
        !deliveryForm.vehicleType
      ) {
        toast.error("Please fill name, capacity, and vehicle type");
        return;
      }
    }

    try {
      await simulatePayment();

      await requestRoleChangeMutation.mutateAsync({
        role: roleChoice,
        merchantData: roleChoice === "MERCHANT" ? merchantForm : undefined,
        deliveryData: roleChoice === "DELIVERY" ? deliveryForm : undefined,
      });

      toast.success(
        `Role change request submitted and approved as ${roleChoice}.`
      );
    } catch (error) {
      console.error("Role change error:", error);
      toast.error("Failed to change role. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial =
      firstName && firstName.length > 0 ? firstName.charAt(0) : "";
    const lastInitial =
      lastName && lastName.length > 0 ? lastName.charAt(0) : "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  // Show loading state
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Profile Settings
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your account information and preferences
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (userError || !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Profile Settings
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your account information and preferences
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 mb-4">
                Sorry, there is no user to look.
              </p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-16 md:pt-8">
      <BackButton />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Overview Card */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center pb-4">
              <div className="relative mx-auto">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage
                    src={selectedImage || user.avatar || "/placeholder.svg"}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                  <AvatarFallback className="text-xl">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="mt-4">
                {user.firstName} {user.lastName}
              </CardTitle>
              <p className="text-sm text-gray-600">{user.email}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Role</span>
                <Badge
                  variant={user.role === "ADMIN" ? "default" : "secondary"}
                >
                  <Shield className="w-3 h-3 mr-1" />
                  {user.role}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant={user.isActive ? "default" : "destructive"}>
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Last updated: {formatDate(user.updatedAt)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details Card */}
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Personal Information</CardTitle>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      value={user.email}
                      disabled
                      className="pl-10 bg-gray-50"
                    />
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      First Name
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`pl-10 ${!isEditing ? "bg-gray-50" : ""}`}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                      required
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter your phone number"
                      className={`pl-10 ${!isEditing ? "bg-gray-50" : ""}`}
                    />
                  </div>
                </div>

                {/* Avatar URL input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Profile picture URL
                  </label>
                  <Input
                    type="url"
                    name="avatarUrl"
                    placeholder="https://example.com/avatar.jpg"
                    value={avatarUrlInput}
                    onChange={(e) => {
                      setAvatarUrlInput(e.target.value);
                      setSelectedImage(e.target.value || null);
                      setIsEditing(true);
                    }}
                    disabled={!isEditing}
                  />
                  <p className="text-xs text-gray-500">
                    Paste a direct image link (we don’t store files).
                  </p>
                  {isEditing && selectedImage && (
                    <div className="flex items-center gap-4 pt-2">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={selectedImage} alt="Preview" />
                        <AvatarFallback>Preview</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-sm text-gray-600">
                        Preview of the image URL you entered.
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {updateProfileMutation.isPending
                        ? "Saving..."
                        : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={updateProfileMutation.isPending}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Role change request */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Request Role Change</CardTitle>
              <CardDescription>
                Switch to Merchant or Delivery. Payments are simulated for now.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleRoleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={roleChoice === "MERCHANT" ? "default" : "outline"}
                    onClick={() => setRoleChoice("MERCHANT")}
                  >
                    Merchant (1500 birr)
                  </Button>
                  <Button
                    type="button"
                    variant={roleChoice === "DELIVERY" ? "default" : "outline"}
                    onClick={() => setRoleChoice("DELIVERY")}
                  >
                    Delivery (600 birr)
                  </Button>
                </div>

                {roleChoice === "MERCHANT" ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shop name
                      </label>
                      <Input
                        value={merchantForm.shopName}
                        onChange={(e) =>
                          setMerchantForm((prev) => ({
                            ...prev,
                            shopName: e.target.value,
                          }))
                        }
                        placeholder="e.g. UrbanMart Store"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business type
                      </label>
                      <Input
                        value={merchantForm.businessType}
                        onChange={(e) =>
                          setMerchantForm((prev) => ({
                            ...prev,
                            businessType: e.target.value,
                          }))
                        }
                        placeholder="e.g. Groceries, Electronics"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description (optional)
                      </label>
                      <Input
                        value={merchantForm.description}
                        onChange={(e) =>
                          setMerchantForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Short store overview"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full name
                      </label>
                      <Input
                        value={deliveryForm.fullName}
                        onChange={(e) =>
                          setDeliveryForm((prev) => ({
                            ...prev,
                            fullName: e.target.value,
                          }))
                        }
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Capacity you can deliver
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={deliveryForm.capacity}
                          onChange={(e) =>
                            setDeliveryForm((prev) => ({
                              ...prev,
                              capacity: e.target.value,
                            }))
                          }
                          placeholder="e.g. 20"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Per
                        </label>
                        <select
                          aria-label="Capacity unit"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={deliveryForm.capacityUnit}
                          onChange={(e) =>
                            setDeliveryForm((prev) => ({
                              ...prev,
                              capacityUnit: e.target.value,
                            }))
                          }
                        >
                          <option value="per hour">Per hour</option>
                          <option value="per day">Per day</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vehicle type
                      </label>
                      <Input
                        value={deliveryForm.vehicleType}
                        onChange={(e) =>
                          setDeliveryForm((prev) => ({
                            ...prev,
                            vehicleType: e.target.value,
                          }))
                        }
                        placeholder="e.g. Bike, Scooter, Car"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes (optional)
                      </label>
                      <Input
                        value={deliveryForm.notes}
                        onChange={(e) =>
                          setDeliveryForm((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        placeholder="Extra details about your delivery preferences"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm text-gray-600">
                    Payment (simulated):{" "}
                    <span className="font-semibold">
                      {roleChoice === "MERCHANT" ? "1500 birr" : "600 birr"}
                    </span>
                  </div>
                  <Button type="submit" disabled={isPaying || requestRoleChangeMutation.isPending}>
                    {isPaying || requestRoleChangeMutation.isPending ? "Processing..." : "Submit & Pay"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
