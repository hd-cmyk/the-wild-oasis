import { useMutation } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth.js";
import toast from "react-hot-toast";
export function useSignUp() {
  const {
    mutate: signup,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: signupApi,
    onSuccess: () => {
      toast.success(
        "Signup successful! Please check your email to confirm your account."
      );
    },
    onError: (err) => {
      console.log("Signup error: ", err);
    },
  });
  return { signup, isLoading, error };
}
