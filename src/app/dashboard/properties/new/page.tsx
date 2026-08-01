import NewPropertyForm from "@/components/NewPropertyForm";

export default function DashboardNewPropertyPage() {
  return (
    <NewPropertyForm
      backHref="/dashboard"
      backLabel="Back to my listings"
      successRedirect="/dashboard?added=1"
      title="Add property"
    />
  );
}
