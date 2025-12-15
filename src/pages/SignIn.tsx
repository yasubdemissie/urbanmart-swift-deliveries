import React, { useEffect, useRef, useState } from "react";
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
import { type AuthFormData, useAuthFormState } from "@/hooks/useAuthFormState";

const SignIn = () => {
  const navigate = useNavigate();
  const {
    formData,
    isSignUp,
    showPassword,
    isLoading,
    signupStep,
    totalSignupSteps,
    handleChange,
    handleUseCurrentLocation,
    handleSendOtp,
    prevStep,
    toggleMode,
    togglePassword,
    handleSubmit,
  } = useAuthFormState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <AuthHeader onNavigateHome={() => navigate("/")} />

      <div className="container mx-auto px-4 py-1 sm:px-6 lg:px-8">
        <div className="mx-auto mt-3 flex max-h-screen max-w-6xl flex-col items-center justify-center gap-8 md:grid md:min-h-screen lg:grid-cols-2 lg:gap-12 lg:py-3">
          <MarketingPanel isSignUp={isSignUp} />

          <div className="flex items-center justify-center">
            <div className="w-full max-w-[780px]">
              <div className="w-full rounded-2xl border border-border bg-card p-8 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:shadow-primary/20">
                <FormHeader isSignUp={isSignUp} />
                <AuthForm
                  formData={formData}
                  isSignUp={isSignUp}
                  isLoading={isLoading}
                  showPassword={showPassword}
                  signupStep={signupStep}
                  totalSignupSteps={totalSignupSteps}
                  onSubmit={handleSubmit}
                  onToggleMode={toggleMode}
                  onTogglePassword={togglePassword}
                  onChange={handleChange}
                  onUseCurrentLocation={handleUseCurrentLocation}
                  onSendOtp={handleSendOtp}
                  onBack={prevStep}
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
  signupStep: number;
  totalSignupSteps: number;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (field: keyof AuthFormData, value: string) => void;
  onTogglePassword: () => void;
  onToggleMode: () => void;
  onUseCurrentLocation: () => void;
  onSendOtp: () => void;
  onBack: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  formData,
  isSignUp,
  isLoading,
  showPassword,
  signupStep,
  totalSignupSteps,
  onSubmit,
  onChange,
  onTogglePassword,
  onToggleMode,
  onUseCurrentLocation,
  onSendOtp,
  onBack,
}) => (
  <form onSubmit={onSubmit} className="space-y-5">
    {isSignUp ? (
      <>
        <SignupStepper current={signupStep} total={totalSignupSteps} />
        <SignupSteps
          step={signupStep}
          formData={formData}
          onChange={onChange}
          onTogglePassword={onTogglePassword}
          showPassword={showPassword}
          onUseCurrentLocation={onUseCurrentLocation}
          onSendOtp={onSendOtp}
        />
        <div className="flex items-center gap-3">
          {signupStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isLoading}
              className="w-1/3"
            >
              Back
            </Button>
          )}
          <Button
            type="submit"
            className="flex-1 shadow-lg"
            size="lg"
            disabled={isLoading}
          >
            {isLoading
              ? "Processing..."
              : signupStep === totalSignupSteps
              ? "Create Account"
              : "Next"}
          </Button>
        </div>
        <Divider label="Already have an account?" />
        <Button
          type="button"
          variant="outline"
          onClick={onToggleMode}
          className="w-full transition-all duration-300 hover:border-primary hover:text-primary"
        >
          Sign in instead
        </Button>
      </>
    ) : (
      <>
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
          {isLoading ? "Processing..." : "Sign In"}
        </Button>
        <Divider label="New to UrbanMart?" />
        <Button
          type="button"
          variant="outline"
          onClick={onToggleMode}
          className="w-full transition-all duration-300 hover:border-primary hover:text-primary"
        >
          Create an account
        </Button>
      </>
    )}
  </form>
);

interface NameFieldsProps {
  formData: AuthFormData;
  onChange: (field: keyof AuthFormData, value: string) => void;
}

const NameFields: React.FC<NameFieldsProps> = ({ formData, onChange }) => (
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
          required
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
        required
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

interface SignupStepperProps {
  current: number;
  total: number;
}

const SignupStepper: React.FC<SignupStepperProps> = ({ current, total }) => (
  <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3 text-sm font-medium text-muted-foreground w-[650px] max-w-full">
    {Array.from({ length: total }).map((_, idx) => {
      const stepNumber = idx + 1;
      const isActive = stepNumber === current;
      const isDone = stepNumber < current;
      return (
        <div
          key={stepNumber}
          className="flex flex-1 items-center justify-center gap-2"
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full border ${
              isActive
                ? "border-primary bg-primary/10 text-primary"
                : isDone
                ? "border-green-500 bg-green-500/10 text-green-600"
                : "border-border"
            }`}
          >
            {stepNumber}
          </div>
          {isActive && (
            <span className="text-foreground font-semibold">
              {stepLabels[stepNumber - 1]}
            </span>
          )}
        </div>
      );
    })}
  </div>
);

const stepLabels = ["Details", "Contact", "OTP", "Profile"];

interface SignupStepsProps {
  step: number;
  formData: AuthFormData;
  onChange: (field: keyof AuthFormData, value: string) => void;
  onTogglePassword: () => void;
  showPassword: boolean;
  onUseCurrentLocation: () => void;
  onSendOtp: () => void;
}

const SignupSteps: React.FC<SignupStepsProps> = ({
  step,
  formData,
  onChange,
  onTogglePassword,
  showPassword,
  onUseCurrentLocation,
  onSendOtp,
}) => {
  if (step === 1) {
    return (
      <div className="space-y-4">
        <NameFields formData={formData} onChange={onChange} />
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
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-4">
        <PhoneFields
          countryCode={formData.countryCode}
          phone={formData.phone}
          onChange={onChange}
        />
        <LocationField
          value={formData.location}
          onChange={(value) => onChange("location", value)}
          onUseCurrentLocation={onUseCurrentLocation}
        />
      </div>
    );
  }

  if (step === 3) {
    return (
      <OtpField
        value={formData.otp}
        onChange={(value) => onChange("otp", value)}
        onSendOtp={onSendOtp}
      />
    );
  }

  return (
    <ProfileImageField
      value={formData.profileImageUrl}
      onChange={(value) => onChange("profileImageUrl", value)}
    />
  );
};

const PhoneFields: React.FC<{
  countryCode: string;
  phone: string;
  onChange: (field: keyof AuthFormData, value: string) => void;
}> = ({ countryCode, phone, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor="phone">Phone Number</Label>
    <div className="grid grid-cols-4 gap-3">
      <Input
        id="countryCode"
        name="countryCode"
        type="text"
        value={countryCode}
        onChange={(event) => onChange("countryCode", event.target.value)}
        className="col-span-1"
        placeholder="+1"
        required
      />
      <Input
        id="phone"
        name="phone"
        type="tel"
        value={phone}
        onChange={(event) => onChange("phone", event.target.value)}
        className="col-span-3"
        placeholder="123 456 7890"
        required
      />
    </div>
  </div>
);

const LocationField: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onUseCurrentLocation: () => void;
}> = ({ value, onChange, onUseCurrentLocation }) => (
  <div className="space-y-2">
    <Label htmlFor="location">Location</Label>
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
      <Input
        id="location"
        name="location"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="City, Address or coordinates"
        className="flex-1"
        required
      />
      <Button
        type="button"
        variant="secondary"
        onClick={onUseCurrentLocation}
        className="whitespace-nowrap"
      >
        Use current
      </Button>
    </div>
    <p className="text-xs text-muted-foreground">
      You can allow browser location or enter it manually.
    </p>
  </div>
);

const OtpField: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onSendOtp: () => void;
}> = ({ value, onChange, onSendOtp }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const digits = Array.from({ length: 6 }, (_, index) => value[index] ?? "");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value.replace(/\D/g, "").slice(0, 6);
    onChange(raw);
  };

  const handleBoxClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="otp">OTP Code</Label>
        <Button type="button" variant="outline" size="sm" onClick={onSendOtp}>
          Send code
        </Button>
      </div>

      <div className="space-y-2">
        <div
          className="grid grid-cols-6 gap-2"
          role="group"
          aria-label="Enter 6 digit verification code"
          onClick={handleBoxClick}
        >
          {digits.map((digit, index) => (
            <div
              key={index}
              className="flex h-12 items-center justify-center rounded-lg border bg-muted/50 text-lg font-semibold tracking-widest"
            >
              {digit || <span className="text-muted-foreground">-</span>}
            </div>
          ))}
        </div>

        <Input
          ref={inputRef}
          id="otp"
          name="otp"
          type="text"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          value={value}
          onChange={handleInputChange}
          className="sr-only"
          placeholder="Enter 6-digit code (use 123456)"
          required
        />
      </div>

      <p className="text-xs text-muted-foreground">
        We’re simulating SMS — use code 123456 after tapping “Send code”.
      </p>
    </div>
  );
};

const ProfileImageField: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => (
  <div className="space-y-3">
    <Label htmlFor="profileImageUrl">Avatar image URL</Label>
    <div className="flex items-center gap-4">
      <div className="relative h-16 w-16 overflow-hidden rounded-full border bg-muted">
        {value && (
          <img
            src={value}
            alt="Avatar preview"
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.visibility = "hidden";
            }}
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <User className="h-6 w-6" />
        </div>
      </div>
      <div className="flex-1 space-y-2">
        <Input
          id="profileImageUrl"
          name="profileImageUrl"
          type="url"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://example.com/avatar.jpg"
        />
        <p className="text-xs text-muted-foreground">
          Paste a direct link to your avatar image (square works best).
        </p>
      </div>
    </div>
  </div>
);

const MarketingPanel: React.FC<{ isSignUp: boolean }> = ({ isSignUp }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const totalSlides = marketingSlides.length;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 4200);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [totalSlides]);

  const currentSlide = marketingSlides[activeIndex];

  return (
    <div className="hidden flex-col justify-center space-y-6 lg:pr-8 md:flex">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl shadow-primary/10">
        <div className="relative h-72 w-full sm:h-80">
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end space-y-2 p-6 text-white">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur">
              {isSignUp ? "Join Us" : "Welcome Back"}
            </span>
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
              {currentSlide.title}
            </h1>
            <p className="text-sm text-white/80 sm:text-base">
              {currentSlide.description}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between px-5 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            {marketingSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Show slide ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`h-2 w-8 rounded-full transition-all ${
                  index === activeIndex
                    ? "bg-primary shadow-[0_0_0_4px] shadow-primary/20"
                    : "bg-border/80 hover:bg-border"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(totalSlides).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
};

const marketingSlides = [
  {
    title: "Discover fresh arrivals daily",
    description: "Curated selections from top brands and local favorites.",
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Fast delivery, tracked in real-time",
    description: "Stay updated from checkout to your doorstep.",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Member-only deals every week",
    description: "Unlock exclusive prices and early access to hot drops.",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80",
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
