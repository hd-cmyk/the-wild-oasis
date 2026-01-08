import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCurrentUser as updateUserApi } from "../../services/apiAuth.js";
import toast from "react-hot-toast";
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: updateUserApi,
    onSuccess: ({ user }) => {
      queryClient.setQueriesData(["user"], user);
      toast.success("UpdateUser successful");
    },
    onError: (err) => toast.error(err.message),
  });
  return { updateUser, isUpdating };
}
