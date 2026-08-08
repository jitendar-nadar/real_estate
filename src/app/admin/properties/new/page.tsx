import NewPropertyForm from "@/components/NewPropertyForm";

export default function AdminNewPropertyPage() {
  return (
    <NewPropertyForm
      backHref="/admin/properties"
      backLabel="Back to properties"
      successRedirect="/admin/properties?added=1"
      title="Add new property"
      showFeatured
    />
  );
}
