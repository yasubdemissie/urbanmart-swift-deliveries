import type React from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Home,
  Lock,
  Mail,
  ShoppingBag,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type AuthFormData,
  useAuthFormState,
} from "@/hooks/useAuthFormState";

const SignIn = () => {
  const navigate = useNavigate();
  const {
    formData,
    isSignUp,
    showPassword,
    isLoading,
    handleChange,
    toggleMode,
    togglePassword,
    handleSubmit,
  } = useAuthFormState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <AuthHeader onNavigateHome={() => navigate("/")} />

      <div className="container mx-auto px-4 py-1 sm:px-6 lg:px-8">
        <div className="mx-auto mt-20 flex max-h-screen max-w-6xl flex-col items-center justify-center gap-8 md:grid md:min-h-screen lg:grid-cols-2 lg:gap-12 lg:py-12">
          <MarketingPanel isSignUp={isSignUp} />

          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:shadow-primary/20">
                <FormHeader isSignUp={isSignUp} />
                <AuthForm
                  formData={formData}
                  isSignUp={isSignUp}
                  isLoading={isLoading}
                  showPassword={showPassword}
                  onSubmit={handleSubmit}
                  onToggleMode={toggleMode}
                  onTogglePassword={togglePassword}
                  onChange={handleChange}
                />
              </div>
              <FormFooter />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AuthFormProps {
  formData: AuthFormData;
  isSignUp: boolean;
  isLoading: boolean;
  showPassword: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (field: keyof AuthFormData, value: string) => void;
  onTogglePassword: () => void;
  onToggleMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  formData,
  isSignUp,
  isLoading,
  showPassword,
  onSubmit,
  onChange,
  onTogglePassword,
  onToggleMode,
}) => (
  <form onSubmit={onSubmit} className="space-y-5">
    {isSignUp && (
      <NameFields formData={formData} onChange={onChange} isSignUp={isSignUp} />
    )}

    <EmailField
      value={formData.email}
      onChange={(value) => onChange("email", value)}
    />

    <PasswordField
      value={formData.password}
      showPassword={showPassword}
      onChange={(value) => onChange("password", value)}
      onTogglePassword={onTogglePassword}
    />

    <Button
      type="submit"
      className="w-full shadow-lg"
      size="lg"
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
    </Button>

    <Divider label={isSignUp ? "Already have an account?" : "New to UrbanMart?"} />

    <Button
      type="button"
      variant="outline"
      onClick={onToggleMode}
      className="w-full transition-all duration-300 hover:border-primary hover:text-primary"
    >
      {isSignUp ? "Sign in instead" : "Create an account"}
    </Button>
  </form>
);

interface NameFieldsProps {
  formData: AuthFormData;
  isSignUp: boolean;
  onChange: (field: keyof AuthFormData, value: string) => void;
}

const NameFields: React.FC<NameFieldsProps> = ({
  formData,
  isSignUp,
  onChange,
}) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
      <Label htmlFor="firstName">First Name</Label>
      <div className="relative">
        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="firstName"
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={(event) => onChange("firstName", event.target.value)}
          placeholder="John"
          className="pl-10 transition-all duration-300 focus:shadow-lg focus:shadow-primary/20"
          required={isSignUp}
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="lastName">Last Name</Label>
      <Input
        id="lastName"
        name="lastName"
        type="text"
        value={formData.lastName}
        onChange={(event) => onChange("lastName", event.target.value)}
        placeholder="Doe"
        className="transition-all duration-300 focus:shadow-lg focus:shadow-primary/20"
        required={isSignUp}
      />
    </div>
  </div>
);

interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const EmailField: React.FC<EmailFieldProps> = ({ value, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor="email">Email Address</Label>
    <div className="relative">
      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id="email"
        name="email"
        type="email"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        placeholder="you@example.com"
        className="pl-10 transition-all duration-300 focus:shadow-lg focus:shadow-primary/20"
      />
    </div>
  </div>
);

interface PasswordFieldProps {
  value: string;
  showPassword: boolean;
  onChange: (value: string) => void;
  onTogglePassword: () => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  value,
  showPassword,
  onChange,
  onTogglePassword,
}) => (
  <div className="space-y-2">
    <Label htmlFor="password">Password</Label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        placeholder="Enter your password"
        className="pl-10 pr-10 transition-all duration-300 focus:shadow-lg focus:shadow-primary/20"
      />
      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-300 hover:scale-110 hover:text-foreground"
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  </div>
);

const Divider: React.FC<{ label: string }> = ({ label }) => (
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-border"></div>
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-card px-2 text-muted-foreground">{label}</span>
    </div>
  </div>
);

const FormHeader: React.FC<{ isSignUp: boolean }> = ({ isSignUp }) => (
  <div className="mb-8 space-y-2 text-center">
    <h2 className="text-2xl font-bold text-card-foreground">
      {isSignUp ? "Create your account" : "Sign in"}
    </h2>
    <p className="text-sm text-muted-foreground">
      {isSignUp
        ? "Fill in your details to get started"
        : "Enter your credentials to continue"}
    </p>
  </div>
);

const FormFooter = () => (
  <p className="mt-6 text-center text-xs text-muted-foreground">
    By continuing, you agree to UrbanMart's Terms of Service and Privacy Policy
  </p>
);

const MarketingPanel: React.FC<{ isSignUp: boolean }> = ({ isSignUp }) => (
  <div className="hidden flex-col justify-center space-y-8 lg:pr-8 md:flex">
    <div className="space-y-4">
      <div className="inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-500">
        {isSignUp ? "Join Us" : "Welcome Back"}
      </div>
      <h1 className="text-balance text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
        {isSignUp
          ? "Start your shopping journey"
          : "Welcome back to UrbanMart"}
      </h1>
      <p className="text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
        {isSignUp
          ? "Join thousands of satisfied customers and discover amazing products at unbeatable prices."
          : "Sign in to access your account, track orders, and enjoy personalized shopping experiences."}
      </p>
    </div>

    <div className="space-y-4">
      {marketingFeatures.map((feature) => (
        <FeatureItem
          key={feature.title}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  </div>
);

interface FeatureItemProps {
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ title, description }) => (
  <div className="group flex items-start gap-3 rounded-lg p-3 transition-all duration-300 hover:bg-blue-500/5">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 transition-all duration-300 group-hover:bg-blue-500 group-hover:shadow-lg">
      <ArrowRight className="h-5 w-5 text-blue-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-blue-100" />
    </div>
    <div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

const marketingFeatures: FeatureItemProps[] = [
  {
    title: "Fast & Secure Checkout",
    description: "Save your preferences and checkout in seconds",
  },
  {
    title: "Order Tracking",
    description: "Track your orders in real-time from purchase to delivery",
  },
  {
    title: "Exclusive Deals",
    description: "Get access to member-only discounts and early sales",
  },
];

const AuthHeader: React.FC<{ onNavigateHome: () => void }> = ({
  onNavigateHome,
}) => (
  <header className="sticky top-0 left-0 right-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-md">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
        >
          <div className="rounded-lg bg-primary p-2">
            <ShoppingBag className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">UrbanMart</span>
        </button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNavigateHome}
          className="gap-2"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Home</span>
        </Button>
      </div>
    </div>
  </header>
);

export default SignIn;
