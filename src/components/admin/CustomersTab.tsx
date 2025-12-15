"use client";

import { useState, useMemo } from "react";
import {
  Edit,
  Eye,
  Download,
  Users,
  Mail,
  Calendar,
  Search,
  MoreHorizontal,
  Shield,
  Store,
  User as UserIcon,
  Crown,
  Filter,
  ChevronDown,
  MoreVertical,
  Trash2,
  UserCheck,
  UserX,
  SortAsc,
  SortDesc,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import type { User, Pagination } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { profileImages } from "../Custom/Header";

interface CustomersTabProps {
  customersData: { users: User[]; pagination: Pagination } | undefined;
  customersLoading: boolean;
  handleExport: () => void;
  exportCustomersMutation: { isPending: boolean };
  onUpdateUserRole?: (userId: string, role: string) => void;
  onUpdateUserStatus?: (userId: string, isActive: boolean) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
}

type SortField = "name" | "email" | "role" | "status" | "createdAt";
type SortOrder = "asc" | "desc";

const CustomersTab = ({
  customersData,
  customersLoading,
  handleExport,
  exportCustomersMutation,
  onUpdateUserRole,
  onUpdateUserStatus,
  searchQuery = "",
  setSearchQuery,
  currentPage = 1,
  setCurrentPage,
}: CustomersTabProps) => {
  const navigate = useNavigate();

  // Local state for filtering and sorting
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showFilters, setShowFilters] = useState(false);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return <Crown className="h-4 w-4" />;
      case "ADMIN":
        return <Shield className="h-4 w-4" />;
      case "MERCHANT":
        return <Store className="h-4 w-4" />;
      case "CUSTOMER":
        return <UserIcon className="h-4 w-4" />;
      default:
        return <UserIcon className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-red-50 text-red-700";
      case "ADMIN":
        return "bg-purple-50 text-purple-700";
      case "MERCHANT":
        return "bg-green-50 text-green-700";
      case "CUSTOMER":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-gray-50 text-gray-7000";
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-gray-50 text-gray-500 border-gray-200";
  };

  const getInitials = (firstName: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    if (!customersData?.users) return [];

    let filtered = customersData.users.filter((user) => {
      // Search filter
      const searchLower = localSearchQuery.toLowerCase();
      const matchesSearch =
        !localSearchQuery ||
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower);

      // Role filter
      const matchesRole =
        selectedRoles.length === 0 || selectedRoles.includes(user.role);

      // Status filter
      const userStatus = user.isActive ? "active" : "inactive";
      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(userStatus);

      return matchesSearch && matchesRole && matchesStatus;
    });

    // Sort users
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case "name":
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case "email":
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case "role":
          aValue = a.role.toLowerCase();
          bValue = b.role.toLowerCase();
          break;
        case "status":
          aValue = a.isActive ? "active" : "inactive";
          bValue = b.isActive ? "active" : "inactive";
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    customersData?.users,
    localSearchQuery,
    selectedRoles,
    selectedStatuses,
    sortField,
    sortOrder,
  ]);

  const handleRoleFilter = (role: string, checked: boolean) => {
    if (checked) {
      setSelectedRoles((prev) => [...prev, role]);
    } else {
      setSelectedRoles((prev) => prev.filter((r) => r !== role));
    }
  };

  const handleStatusFilter = (status: string, checked: boolean) => {
    if (checked) {
      setSelectedStatuses((prev) => [...prev, status]);
    } else {
      setSelectedStatuses((prev) => prev.filter((s) => s !== status));
    }
  };

  const clearFilters = () => {
    setLocalSearchQuery("");
    setSelectedRoles([]);
    setSelectedStatuses([]);
    setSortField("createdAt");
    setSortOrder("desc");
  };

  const hasActiveFilters =
    localSearchQuery || selectedRoles.length > 0 || selectedStatuses.length > 0;

  if (customersLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            User Management
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {filteredAndSortedUsers.length} of{" "}
            {customersData?.users?.length || 0} users
          </p>
        </div>
        <Button
          onClick={handleExport}
          disabled={exportCustomersMutation.isPending}
          className="flex items-center gap-2 w-full sm:w-auto"
          size="sm"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export Users</span>
          <span className="sm:hidden">Export</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users by name, email, or role..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="relative">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {selectedRoles.length +
                        selectedStatuses.length +
                        (localSearchQuery ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Filters</h4>
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Role
                    </label>
                    <div className="space-y-2">
                      {["CUSTOMER", "MERCHANT", "ADMIN", "SUPER_ADMIN"].map(
                        (role) => (
                          <div
                            key={role}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`role-${role}`}
                              checked={selectedRoles.includes(role)}
                              onCheckedChange={(checked) =>
                                handleRoleFilter(role, checked as boolean)
                              }
                            />
                            <label htmlFor={`role-${role}`} className="text-sm">
                              {role.replace("_", " ")}
                            </label>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Status
                    </label>
                    <div className="space-y-2">
                      {["active", "inactive"].map((status) => (
                        <div
                          key={status}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`status-${status}`}
                            checked={selectedStatuses.includes(status)}
                            onCheckedChange={(checked) =>
                              handleStatusFilter(status, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`status-${status}`}
                            className="text-sm capitalize"
                          >
                            {status}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Select
              value={`${sortField}-${sortOrder}`}
              onValueChange={(value) => {
                const [field, order] = value.split("-") as [
                  SortField,
                  SortOrder
                ];
                setSortField(field);
                setSortOrder(order);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
                <SelectItem value="email-asc">Email A-Z</SelectItem>
                <SelectItem value="email-desc">Email Z-A</SelectItem>
                <SelectItem value="role-asc">Role A-Z</SelectItem>
                <SelectItem value="role-desc">Role Z-A</SelectItem>
                <SelectItem value="status-asc">Status A-Z</SelectItem>
                <SelectItem value="status-desc">Status Z-A</SelectItem>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {localSearchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {localSearchQuery}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setLocalSearchQuery("")}
                />
              </Badge>
            )}
            {selectedRoles.map((role) => (
              <Badge
                key={role}
                variant="secondary"
                className="flex items-center gap-1"
              >
                Role: {role.replace("_", " ")}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRoleFilter(role, false)}
                />
              </Badge>
            ))}
            {selectedStatuses.map((status) => (
              <Badge
                key={status}
                variant="secondary"
                className="flex items-center gap-1"
              >
                Status: {status}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleStatusFilter(status, false)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Users Table - Desktop View */}
      <div className="hidden lg:block space-y-3">
        {filteredAndSortedUsers.map((user, index) => (
          <Card
            key={user.id}
            className={`rounded-xl border-[1px] max-w-[1000px] transition-all duration-200 hover:shadow-md mx-auto ${"bg-white border-gray-100"}`}
          >
            <CardContent className="p-2">
              <div className="flex items-center justify-between">
                {/* User Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 ring-2 ring-gray-100">
                    <AvatarImage
                      src={
                        user.avatar ||
                        profileImages[index % profileImages.length]
                      }
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <Badge
                      className={`${getRoleColor(
                        user.role
                      )} flex items-center gap-1 px-2 py-1 rounded-full`}
                    >
                      {getRoleIcon(user.role)}
                      {user.role.replace("_", " ").toLowerCase()}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span className="text-xs">
                    Joined {formatDate(user.createdAt)}
                  </span>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>

                {/* Role and Status */}
                <div className="flex items-center gap-3">
                  <Badge
                    className={`${getStatusColor(
                      user.isActive
                    )} px-3 py-1 rounded-full border`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-9 w-9 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => console.log("View user:", user.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => console.log("Edit user:", user.id)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                      {onUpdateUserStatus && (
                        <DropdownMenuItem
                          onClick={() =>
                            onUpdateUserStatus(user.id, !user.isActive)
                          }
                          className={
                            user.isActive ? "text-red-600" : "text-green-600"
                          }
                        >
                          {user.isActive ? (
                            <>
                              <UserX className="h-4 w-4 mr-2" />
                              Deactivate User
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Activate User
                            </>
                          )}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => console.log("Delete user:", user.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedUsers.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No users found
          </h3>
          <p className="text-gray-600 mb-4">
            {hasActiveFilters
              ? "Try adjusting your search criteria or filters."
              : "No users available."}
          </p>
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomersTab;
