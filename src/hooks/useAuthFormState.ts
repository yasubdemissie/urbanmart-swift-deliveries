import type React from "react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLogin, useRegister } from "@/hooks/useAuth";
import type { ApiResponse, AuthResponse } from "@/lib/api";

export type AuthFormMode = "signIn" | "signUp";

export interface AuthFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  countryCode: string;
  location: string;
  otp: string;
  profileImageUrl: string;
}

const INITIAL_FORM_STATE: AuthFormData = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phone: "",
  countryCode: "+1",
  location: "",
  otp: "",
  profileImageUrl: "",
};

// Encapsulates Sign In / Sign Up form state and submission side effects.
export const useAuthFormState = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const [mode, setMode] = useState<AuthFormMode>("signIn");
  const [formData, setFormData] = useState<AuthFormData>(INITIAL_FORM_STATE);
  const [showPassword, setShowPassword] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  const [sentOtp, setSentOtp] = useState<string | null>(null);

  const isSignUp = mode === "signUp";
  const isLoading = loginMutation.isPending || registerMutation.isPending;
  const totalSignupSteps = 4;

  const handleChange = useCallback(
    (field: keyof AuthFormData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "signIn" ? "signUp" : "signIn"));
    setFormData(INITIAL_FORM_STATE);
    setSignupStep(1);
    setShowPassword(false);
    setSentOtp(null);
  }, []);

  const togglePassword = useCallback(
    () => setShowPassword((prev) => !prev),
    []
  );

  const reverseGeocode = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Reverse geocoding failed");
        }

        const data = (await response.json()) as {
          address?: Record<string, string>;
        };

        const address = data.address ?? {};
        const city =
          address.city ||
          address.town ||
          address.village ||
          address.hamlet ||
          address.suburb;
        const region = address.state || address.region;
        const country = address.country;

        const readable = [city, region, country]
          .filter(Boolean)
          .join(", ")
          .trim();

        return readable || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
      } catch (error) {
        console.error(error);
        return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
      }
    },
    []
  );

  const handleUseCurrentLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locationLabel = await reverseGeocode(latitude, longitude);

        setFormData((prev) => ({
          ...prev,
          location: locationLabel,
        }));
        toast.success("Location captured from browser");
      },
      () => {
        toast.error("Unable to fetch current location");
      }
    );
  }, [reverseGeocode]);

  const handleSendOtp = useCallback(() => {
    const generated = "123456";
    setSentOtp(generated);
    toast.info(`Simulated OTP sent. Use code ${generated}`);
  }, []);

  const validateStep = useCallback(
    (step: number) => {
      if (step === 1) {
        return (
          !!formData.firstName &&
          !!formData.lastName &&
          !!formData.email &&
          !!formData.password
        );
      }
      if (step === 2) {
        return (
          !!formData.countryCode && !!formData.phone && !!formData.location
        );
      }
      if (step === 3) {
        if (!formData.otp) return false;
        // If OTP was "sent", enforce match; otherwise allow any entry for simulation.
        return sentOtp ? formData.otp === sentOtp : !!formData.otp;
      }
      return true;
    },
    [formData, sentOtp]
  );

  const handleSubmit = useCallback(
    async (event?: React.FormEvent) => {
      event?.preventDefault();

      try {
        if (isSignUp) {
          const isStepValid = validateStep(signupStep);
          if (!isStepValid) {
            toast.error("Please complete the required fields for this step.");
            return;
          }

          if (signupStep < totalSignupSteps) {
            setSignupStep((prev) => Math.min(prev + 1, totalSignupSteps));
            return;
          }

          const {
            email,
            password,
            firstName,
            lastName,
            phone,
            countryCode,
            location,
            profileImageUrl,
          } = formData;

          await registerMutation.mutateAsync({
            email,
            password,
            firstName,
            lastName,
            phone,
            countryCode,
            location,
            avatarUrl: profileImageUrl || undefined,
          });
          toast.success("Account created successfully!");
          navigate("/");
          return;
        }

        const result = await loginMutation.mutateAsync({
          email: formData.email,
          password: formData.password,
        });

        toast.success("Signed in successfully!");

        const apiResult = result as ApiResponse<AuthResponse>;
        const userRole = (
          apiResult.data as { user?: AuthResponse["user"] } | undefined
        )?.user?.role;
        switch (userRole) {
          case "SUPER_ADMIN":
          case "ADMIN":
            navigate("/admin");
            break;
          case "MERCHANT":
            navigate("/merchant-dashboard");
            break;
          default:
            navigate("/");
            break;
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Authentication failed";
        toast.error(message);
      }
    },
    [
      formData,
      isSignUp,
      loginMutation,
      navigate,
      registerMutation,
      signupStep,
      totalSignupSteps,
      validateStep,
    ]
  );

  return {
    formData,
    isSignUp,
    showPassword,
    isLoading,
    signupStep,
    totalSignupSteps,
    handleChange,
    handleUseCurrentLocation,
    handleSendOtp,
    prevStep: () => setSignupStep((prev) => Math.max(1, prev - 1)),
    toggleMode,
    togglePassword,
    handleSubmit,
  };
};
