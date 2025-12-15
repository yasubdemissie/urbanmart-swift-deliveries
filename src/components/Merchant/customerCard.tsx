import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Mail, User, Calendar, Phone } from "lucide-react";
import { User as UserType } from "@/lib/api";
import { profileImages } from "../Custom/Header";

export const CustomerCard = ({ customer }: { customer: UserType }) => {
  const initials = `${customer.firstName[0]}${customer.lastName[0]}`;
  const fullName = `${customer.firstName} ${customer.lastName}`;
  const joinDate = format(new Date(customer.createdAt), "MMM d, yyyy");

  return (
    <Card className="group relative overflow-hidden border border-border/50 bg-gradient-subtle shadow-soft transition-all duration-300 hover:shadow-elegant hover:border-primary/20 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Avatar Section */}
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-primary/10 shadow-sm">
              <AvatarImage
                src={customer.avatar || profileImages[0]}
                alt={fullName}
              />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground font-medium text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-card-foreground truncate">
                {fullName}
              </h3>
              <Badge
                variant="secondary"
                className="ml-2 shrink-0 text-gray-500 font-medium"
              >
                Customer
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <Mail className="h-4 w-4 mr-2 text-purple-500" />
                <span className="truncate">{customer.email}</span>
              </div>

              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                <span>Joined {joinDate}</span>
              </div>

              <div className="flex items-center text-muted-foreground">
                <Phone className="h-4 w-4 mr-2 text-purple-500" />
                <span className="font-mono text-xs">
                  phone: {customer.phone || "0932818278"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Effect Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </CardContent>
    </Card>
  );
};
