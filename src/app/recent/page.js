"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RecentTemplates() {
    const router = useRouter();
  const [recentTemplates, setRecentTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRecentTemplates();
  }, []);

  async function fetchRecentTemplates() {
    try {
      const response = await fetch("/api/template-hist"); // API Route
      if (!response.ok) throw new Error("Failed to fetch recent templates");

      const data = await response.json();
      setRecentTemplates(data);
      setFilteredTemplates(data); // Initialize filtered data
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (!query) {
      setFilteredTemplates(recentTemplates);
    } else {
      const filtered = recentTemplates.filter((template) => {
        const formData = JSON.parse(template.form_data);
        const employeeName = Object.entries(formData).find(([key]) =>
          [
            "Employee",
            "Intern’s Name",
            "Name",
            "Employee’s Name",
            "Participant’s Name",
          ].some((validKey) => key.toLowerCase().includes(validKey.toLowerCase()))
        )?.[1] || "";

        return (
          template.template_name.toLowerCase().includes(query) ||
          employeeName.toLowerCase().includes(query)
        );
      });
      setFilteredTemplates(filtered);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 p-2 text-center rounded-md text-white bg-linear-to-r from-cyan-500 to-blue-600">Recent Templates</h1>
      <button
        onClick={() => router.push("/admin")}
        className="bg-red-500 text-white m-4 px-4 py-2  rounded-md"
      >
        Admin Panel
      </button>

      <input
        type="text"
        placeholder="Search by name or template..."
        value={searchQuery}
        onChange={handleSearch}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      {loading && <p className="text-center">Loading recent templates...</p>}
      {error && <p className="text-red-500 text-center">Error: {error}</p>}
      {!loading && !error && filteredTemplates.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-center">ID</th>
              <th className="border p-2 text-center">Template Name</th>
              <th className="border p-2 text-center">Employee</th>
              <th className="border p-2 text-center">Date/Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredTemplates.map((template) => {
              const formData = JSON.parse(template.form_data);
              return (
                <tr key={template.id}>
                  <td className="border p-2 text-center">{template.id}</td>
                  <td className="border p-2 text-center">{template.template_name}</td>
                  <td className="border p-2 text-center">
                    {Object.entries(formData).find(([key]) =>
                      [
                        "Employee",
                        "Intern’s Name",
                        "Name",
                        "Employee’s Name",
                        "Participant’s Name",
                      ].some((validKey) => key.toLowerCase().includes(validKey.toLowerCase()))
                    )?.[1] || "N/A"}
                  </td>
                  <td className="border p-2 text-center">
                    {new Date(template.created_at).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        !loading && <p className="text-center">No recent templates found.</p>
      )}
    </div>
  );
}
