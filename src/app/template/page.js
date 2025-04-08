"use client";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faFileAlt,faClipboardList } from "@fortawesome/free-solid-svg-icons";

import { faBolt } from "@fortawesome/free-solid-svg-icons";
export default function Template() {
  const router = useRouter();

  // Fetch function
  const fetchTemplates = async () => {
    const res = await fetch("/api/templates");
    if (!res.ok) throw new Error("Failed to fetch templates");
    return res.json();
  };

  // React Query for data fetching
  const { data: templates = [], isLoading, error } = useQuery({
    queryKey: ["templates"],
    queryFn: fetchTemplates,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl text-white font-bold mb-6 bg-linear-to-r from-cyan-500 to-blue-500 p-2 rounded-md"><FontAwesomeIcon icon={faHome} /> HR Templates Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-lg font-semibold"><FontAwesomeIcon icon={faFileAlt} style={{ color: "skyblue", fontSize: "24px" ,marginRight:"10px" }} />
            {template.name} </h2>
            <p className="text-gray-600 mb-4"> <FontAwesomeIcon icon={faClipboardList} className="text-green-500 text-xl mr-2" /> {template.category}  </p>
            <button
              onClick={() => router.push(`/templates/${template.id}`)}
              className="bg-linear-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
                 <FontAwesomeIcon icon={faBolt} style={{ marginRight: "8px" }} />
              Generate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
