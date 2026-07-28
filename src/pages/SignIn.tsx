import React, { useRef } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShoppingBag,
  Truck,
  User,
  ShieldCheck,
  Package,
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
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Lifestyle panel */}
      <aside className="relative hidden overflow-hidden bg-stone-900 lg:block">
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80"
          alt="Customer shopping at checkout"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/55 to-stone-950/20" />
        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 self-start transition-opacity hover:opacity-80"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <span className="font-display text-2xl font-semibold">UrbanMart</span>
          </button>

          <div className="max-w-md space-y-6">
            <h1 className="font-display text-4xl font-semibold leading-tight xl:text-5xl">
              {isSignUp
                ? "Join thousands shopping local every day"
                : "Welcome back to faster, smarter shopping"}
            </h1>
            <p className="text-lg text-stone-300 leading-relaxed">
              Access exclusive deals, save favorites, track deliveries, and
              checkout in seconds.
            </p>
            <ul className="space-y-4 text-sm text-stone-200">
              <li className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-emerald-400" />
                Same-day delivery in select areas
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                Secure payments on every order
              </li>
              <li className="flex items-center gap-3">
                <Package className="h-5 w-5 text-emerald-400" />
                Live tracking from store to door
              </li>
            </ul>
          </div>

          <p className="text-sm text-stone-400">
            Trusted by shoppers across the city
          </p>
        </div>
      </aside>

      {/* Auth form panel */}
      <main className="flex flex-col bg-[#f7f4ef]">
        <header className="flex items-center justify-between border-b border-stone-200 px-5 py-4 sm:px-8 lg:hidden">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-white">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <span className="font-display text-xl font-semibold">UrbanMart</span>
          </button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            Back
          </Button>
        </header>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                {isSignUp ? "Create account" : "Member sign in"}
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-stone-900">
                {isSignUp ? "Start shopping with us" : "Sign in to continue"}
              </h2>
              <p className="mt-2 text-stone-500">
                {isSignUp
                  ? "A few details and you’re ready to order."
                  : "Enter your email and password to access your account."}
              </p>
            </div>

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

            <p className="mt-8 text-center text-xs text-stone-500">
              By continuing, you agree to UrbanMart&apos;s Terms of Service and
              Privacy Policy.
            </p>
          </div>
        </div>
      </main>
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
              className="w-1/3 border-stone-300"
            >
              Back
            </Button>
          )}
          <Button
            type="submit"
            className="flex-1 bg-emerald-700 hover:bg-emerald-600"
            size="lg"
            disabled={isLoading}
          >
            {isLoading
              ? "Processing..."
              : signupStep === totalSignupSteps
                ? "Create account"
                : "Continue"}
          </Button>
        </div>
        <p className="text-center text-sm text-stone-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onToggleMode}
            className="font-semibold text-emerald-700 hover:underline"
          >
            Sign in
          </button>
        </p>
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
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-stone-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-stone-300 text-emerald-700 focus:ring-emerald-600"
            />
            Keep me signed in
          </label>
          <span className="cursor-default text-stone-400">Forgot password?</span>
        </div>
        <Button
          type="submit"
          className="w-full bg-emerald-700 hover:bg-emerald-600"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#f7f4ef] px-3 text-stone-400">or</span>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onToggleMode}
          className="w-full border-stone-300 bg-white hover:bg-stone-50"
          size="lg"
        >
          Create your UrbanMart account
        </Button>
      </>
    )}
  </form>
);

const NameFields: React.FC<{
  formData: AuthFormData;
  onChange: (field: keyof AuthFormData, value: string) => void;
}> = ({ formData, onChange }) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
      <Label htmlFor="firstName">First name</Label>
      <div className="relative">
        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <Input
          id="firstName"
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={(event) => onChange("firstName", event.target.value)}
          placeholder="John"
          className="border-stone-300 bg-white pl-10"
          required
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="lastName">Last name</Label>
      <Input
        id="lastName"
        name="lastName"
        type="text"
        value={formData.lastName}
        onChange={(event) => onChange("lastName", event.target.value)}
        placeholder="Doe"
        className="border-stone-300 bg-white"
        required
      />
    </div>
  </div>
);

const EmailField: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <div className="relative">
      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
      <Input
        id="email"
        name="email"
        type="email"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        placeholder="you@example.com"
        className="border-stone-300 bg-white pl-10"
        autoComplete="email"
      />
    </div>
  </div>
);

const PasswordField: React.FC<{
  value: string;
  showPassword: boolean;
  onChange: (value: string) => void;
  onTogglePassword: () => void;
}> = ({ value, showPassword, onChange, onTogglePassword }) => (
  <div className="space-y-2">
    <Label htmlFor="password">Password</Label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
      <Input
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        placeholder="Enter your password"
        className="border-stone-300 bg-white pl-10 pr-10"
        autoComplete="current-password"
      />
      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
        aria-label={showPassword ? "Hide password" : "Show password"}
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

const stepLabels = ["Details", "Contact", "OTP", "Profile"];

const SignupStepper: React.FC<{ current: number; total: number }> = ({
  current,
  total,
}) => (
  <div className="rounded-xl border border-stone-200 bg-white p-3">
    <div className="mb-2 flex items-center justify-between text-xs font-medium text-stone-500">
      <span>
        Step {current} of {total}
      </span>
      <span>{stepLabels[current - 1]}</span>
    </div>
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, idx) => (
        <div
          key={idx}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            idx < current ? "bg-emerald-600" : "bg-stone-200"
          }`}
        />
      ))}
    </div>
  </div>
);

const SignupSteps: React.FC<{
  step: number;
  formData: AuthFormData;
  onChange: (field: keyof AuthFormData, value: string) => void;
  onTogglePassword: () => void;
  showPassword: boolean;
  onUseCurrentLocation: () => void;
  onSendOtp: () => void;
}> = ({
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
        <div className="space-y-2">
          <Label htmlFor="phone">Phone number</Label>
          <div className="grid grid-cols-4 gap-3">
            <Input
              id="countryCode"
              name="countryCode"
              type="text"
              value={formData.countryCode}
              onChange={(event) => onChange("countryCode", event.target.value)}
              className="col-span-1 border-stone-300 bg-white"
              placeholder="+1"
              required
            />
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(event) => onChange("phone", event.target.value)}
              className="col-span-3 border-stone-300 bg-white"
              placeholder="123 456 7890"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Delivery location</Label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={(event) => onChange("location", event.target.value)}
              placeholder="City, address, or area"
              className="flex-1 border-stone-300 bg-white"
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
        </div>
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
    <div className="space-y-3">
      <Label htmlFor="profileImageUrl">Avatar image URL (optional)</Label>
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full border border-stone-200 bg-white">
          {formData.profileImageUrl && (
            <img
              src={formData.profileImageUrl}
              alt="Avatar preview"
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.visibility = "hidden";
              }}
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center text-stone-400">
            <User className="h-6 w-6" />
          </div>
        </div>
        <Input
          id="profileImageUrl"
          name="profileImageUrl"
          type="url"
          value={formData.profileImageUrl}
          onChange={(event) => onChange("profileImageUrl", event.target.value)}
          placeholder="https://example.com/avatar.jpg"
          className="border-stone-300 bg-white"
        />
      </div>
    </div>
  );
};

const OtpField: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onSendOtp: () => void;
}> = ({ value, onChange, onSendOtp }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const digits = Array.from({ length: 6 }, (_, index) => value[index] ?? "");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="otp">Verification code</Label>
        <Button type="button" variant="outline" size="sm" onClick={onSendOtp}>
          Send code
        </Button>
      </div>
      <div
        className="grid grid-cols-6 gap-2"
        role="group"
        aria-label="Enter 6 digit verification code"
        onClick={() => inputRef.current?.focus()}
      >
        {digits.map((digit, index) => (
          <div
            key={index}
            className="flex h-12 items-center justify-center rounded-lg border border-stone-300 bg-white text-lg font-semibold"
          >
            {digit || <span className="text-stone-300">·</span>}
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
        onChange={(event) =>
          onChange(event.target.value.replace(/\D/g, "").slice(0, 6))
        }
        className="sr-only"
        required
      />
      <p className="text-xs text-stone-500">
        Simulated SMS — tap Send code, then enter 123456.
      </p>
    </div>
  );
};

export default SignIn;
