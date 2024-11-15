import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./profile-form";
import { Toaster } from "@/components/ui/toaster";

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
      </div>
      <Separator />
      <ProfileForm />
      {/* <Toaster /> */}
    </div>
  )
}