import { getAllInquiries } from "@/lib/data";
import InquiryActions from "@/components/InquiryActions";

export default async function AdminInquiriesPage() {
  const inquiries = await getAllInquiries();

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
        Property inquiries ({inquiries.length})
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
        Leads submitted from the contact page and property detail pages.
      </p>

      {inquiries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
          <p className="text-slate-600 dark:text-slate-400">No inquiries yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3 font-medium text-slate-900 dark:text-white">Date</th>
                <th className="px-4 py-3 font-medium text-slate-900 dark:text-white">Contact</th>
                <th className="px-4 py-3 font-medium text-slate-900 dark:text-white">Property</th>
                <th className="px-4 py-3 font-medium text-slate-900 dark:text-white">Message</th>
                <th className="px-4 py-3 font-medium text-slate-900 dark:text-white">Status</th>
                <th className="px-4 py-3 font-medium text-slate-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0 align-top">
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900 dark:text-white">{inquiry.name}</p>
                    <a href={`mailto:${inquiry.email}`} className="text-primary-600 dark:text-primary-400 hover:underline text-xs">
                      {inquiry.email}
                    </a>
                    {inquiry.phone && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{inquiry.phone}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-[160px]">
                    {inquiry.propertyTitle ?? "General inquiry"}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-[240px]">
                    <p className="line-clamp-3">{inquiry.message}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize ${
                        inquiry.status === "new"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : inquiry.status === "read"
                            ? "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                      }`}
                    >
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <InquiryActions inquiryId={inquiry.id} status={inquiry.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
