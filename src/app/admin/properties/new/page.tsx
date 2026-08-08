import NewPropertyForm from "@/components/NewPropertyForm";

export default function AdminNewPropertyPage() {
  return (
    <NewPropertyForm
      backHref="/admin"
      backLabel="Back to admin"
      successRedirect="/admin?added=1"
      title="Add new property"
    />
  );
}
