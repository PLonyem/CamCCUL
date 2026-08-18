import { Home } from "lucide-react";
import { AdminComingSoon } from "@/components/admin/AdminComingSoon";

export default function AdminHomepageEditorPage() {
  return (
    <AdminComingSoon
      title="Homepage Editor"
      icon={Home}
      description="Editing for the homepage's hero text, images, statistics, and section visibility is coming soon. The underlying HomepageContent data already exists — this page will read and write it."
    />
  );
}
