import { Pencil, RotateCcw } from "lucide-react";
import { useProfileSettings } from "@/hooks/useProfileSettings";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const ProfileSettings = () => {
  const {
    user,
    isUserLoading,
    isError,
    refetch,
    form,
    t,
    i18n,
    isOpen,
    setIsOpen,
    isSubmitting,
    handleSubmit,
  } = useProfileSettings();

  const {
    register,
    formState: { errors, isDirty },
  } = form;

  const currentDir = i18n.language === "ar" ? "rtl" : "ltr";

  if (isUserLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        {t("common.loading") || "Loading..."}
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="max-w-4xl mx-auto my-6 border-destructive/50">
        <CardContent className="p-8 text-center space-y-4">
          <p className="text-destructive font-medium">
            {t("profile.fetch_error") || "Failed to load profile data."}
          </p>
          <Button variant="outline" onClick={() => refetch()} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            {t("common.retry") || "Retry"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("profile.title")}</CardTitle>
            <CardDescription>{t("profile.description")}</CardDescription>
          </div>
          <Button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            {t("profile.edit_button")}
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="text-sm text-muted-foreground block">
              {t("profile.full_name")}
            </span>
            <p className="text-base font-medium">
              {`${user?.first_name || ""} ${user?.father_name || ""} ${user?.last_name || ""}`.trim() ||
                "-"}
            </p>
          </div>

          <div>
            <span className="text-sm text-muted-foreground block">
              {t("profile.email")}
            </span>
            <p className="text-base font-medium">{user?.email || "-"}</p>
          </div>

          <div>
            <span className="text-sm text-muted-foreground block">
              {t("profile.phone_number")}
            </span>
            <p className="text-base font-medium">{user?.phone_number || "-"}</p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent dir={currentDir} className="sm:max-w-150">
          <DialogHeader>
            <DialogTitle>{t("profile.edit_title")}</DialogTitle>
            <DialogDescription>
              {t("profile.edit_description")}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">{t("profile.first_name")}</Label>
                <Input
                  id="first_name"
                  {...register("first_name")}
                  placeholder={t("profile.first_name_placeholder")}
                />
                {errors.first_name && (
                  <p className="text-xs text-destructive">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="father_name">{t("profile.father_name")}</Label>
                <Input
                  id="father_name"
                  {...register("father_name")}
                  placeholder={t("profile.father_name_placeholder")}
                />
                {errors.father_name && (
                  <p className="text-xs text-destructive">
                    {errors.father_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">{t("profile.last_name")}</Label>
                <Input
                  id="last_name"
                  {...register("last_name")}
                  placeholder={t("profile.last_name_placeholder")}
                />
                {errors.last_name && (
                  <p className="text-xs text-destructive">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">{t("profile.phone_number")}</Label>
              <Input
                id="phone_number"
                dir="ltr"
                {...register("phone_number")}
                placeholder="0912345678"
              />
              {errors.phone_number && (
                <p className="text-xs text-destructive">
                  {errors.phone_number.message}
                </p>
              )}
            </div>

            <DialogFooter className="pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={!isDirty || isSubmitting}>
                {isSubmitting ? t("common.saving") : t("common.save_changes")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSettings;
