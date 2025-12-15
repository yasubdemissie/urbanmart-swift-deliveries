import type React from "react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLogin, useRegister } from "@/hooks/useAuth";

export type AuthFormMode = "signIn" | "signUp";

export interface AuthFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const INITIAL_FORM_STATE: AuthFormData = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
};

// Encapsulates Sign In / Sign Up form state and submission side effects.
export const useAuthFormState = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const [mode, setMode] = useState<AuthFormMode>("signIn");
  const [formData, setFormData] = useState<AuthFormData>(INITIAL_FORM_STATE);
  const [showPassword, setShowPassword] = useState(false);

  const isSignUp = mode === "signUp";
  const isLoading = loginMutation.isPending || registerMutation.isPending;

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
  }, []);

  const togglePassword = useCallback(
    () => setShowPassword((prev) => !prev),
    []
  );

  const handleSubmit = useCallback(
    async (event?: React.FormEvent) => {
      event?.preventDefault();

      try {
        if (isSignUp) {
          const { email, password, firstName, lastName } = formData;
          await registerMutation.mutateAsync({
            email,
            password,
            firstName,
            lastName,
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

        const userRole = (result as any)?.data?.user?.role;
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
    [formData, isSignUp, loginMutation, navigate, registerMutation]
  );

  return {
    formData,
    isSignUp,
    showPassword,
    isLoading,
    handleChange,
    toggleMode,
    togglePassword,
    handleSubmit,
  };
};

