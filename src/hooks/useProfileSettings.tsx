import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import api from "@/lib/api";
import type { ProfileFormValues, ProfileUpdateResponse } from "@/types/Profile";
import type { User } from "@/types/User";

export const useProfileSettings = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: userData,
    isLoading: isUserLoading,
    isError,
    refetch,
  } = useQuery<{ user: User }>({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await api.get("/profile");
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const user = userData?.user;

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      first_name: "",
      father_name: "",
      last_name: "",
      phone_number: "",
      email: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.first_name || "",
        father_name: user.father_name || "",
        last_name: user.last_name || "",
        phone_number: user.phone_number || "",
        email: user.email || "",
      });
    }
  }, [user, isOpen, form]);

  const updateProfileMutation = useMutation({
    mutationFn: async (payload: Partial<ProfileFormValues>) => {
      const response = await api.put<ProfileUpdateResponse>(
        "/profile",
        payload,
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || t("profile.update_success"));

      if (data.user) {
        queryClient.setQueryData(["profile"], { user: data.user });
      } else {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      }

      setIsOpen(false);
    },
    onError: (error: any) => {
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;

        Object.keys(validationErrors).forEach((key) => {
          if (key === "payload") {
            toast.error(validationErrors[key][0]);
          } else {
            form.setError(key as keyof ProfileFormValues, {
              type: "server",
              message: validationErrors[key][0],
            });
          }
        });
      } else {
        toast.error(t("profile.update_error"));
      }
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    const dirtyFieldsPayload: Partial<ProfileFormValues> = {};

    (Object.keys(data) as Array<keyof ProfileFormValues>).forEach((key) => {
      if (key !== "email" && data[key] !== "") {
        dirtyFieldsPayload[key] = data[key];
      }
    });

    updateProfileMutation.mutate(dirtyFieldsPayload);
  };

  return {
    user,
    isUserLoading,
    isError,
    refetch,
    form,
    t,
    i18n,
    isOpen,
    setIsOpen,
    isSubmitting: updateProfileMutation.isPending,
    handleSubmit: form.handleSubmit(onSubmit),
  };
};
