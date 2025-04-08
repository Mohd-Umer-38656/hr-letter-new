"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [templates, setTemplates] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState({
    name: "",
    category: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ Added missing loading state

  useEffect(() => {
    checkAuth();
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      const res = await fetch("/api/templates");
      if (!res.ok) throw new Error("Failed to fetch templates");
      const data = await res.json();
      setTemplates(data);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  }

  async function saveTemplate() {
    const method = isEditing ? "PUT" : "POST";
    await fetch("/api/templates", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentTemplate),
    });
    setModalOpen(false);
    fetchTemplates();
  }

  async function deleteTemplate(id) {
    await fetch("/api/templates", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchTemplates();
  }

  function openModal(
    template = { name: "", category: "", content: "", placeholders: "" }
  ) {
    setCurrentTemplate(template);
    setIsEditing(Boolean(template.name)); // ✅ Fixed incorrect isEditing logic
    setModalOpen(true);
  }

  // ✅ Authentication Check
  async function checkAuth() {
    try {
      console.log("Checking authentication...");
      const res = await fetch("/api/check-auth", { credentials: "include" });

      if (res.status !== 200) {
        console.log("Not authenticated. Redirecting...");
        router.push("/signin");
      } else {
        console.log("Authenticated!");
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      router.push("/signin");
    } finally {
      setLoading(false);
    }
  }

  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <p>Loading...</p>
    </div>
  ) : (
    <div className="p-6">
      <div className="">
        <h1 className="text-center text-2xl font-bold mb-4 text-white p-2 bg-linear-to-r from-cyan-500 to-blue-500 rounded-md">Admin Panel</h1>
      </div>

      <button
        onClick={() => openModal()}
        className="bg-linear-to-r from-cyan-800 to-blue-500 text-white px-4 py-2 rounded-md mb-4 "
      >
        Add New Template
      </button>
      <button
        onClick={() => router.push("/recent")}
        className="bg-linear-to-r from-green-500 to-green-800 text-white mx-4 px-4 py-2 rounded-md"
      >
        Recent Templates
      </button>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template) => (
            <tr key={template.id}>
              <td className="border p-2">{template.name}</td>
              <td className="border p-2">{template.category}</td>
              <td className="border p-2">
                <button
                  onClick={() => openModal(template)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Edit" : "Add"} Template
            </h2>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 mb-2 border rounded"
              value={currentTemplate.name}
              onChange={(e) =>
                setCurrentTemplate({ ...currentTemplate, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Category"
              className="w-full p-2 mb-4 border rounded"
              value={currentTemplate.category}
              onChange={(e) =>
                setCurrentTemplate({
                  ...currentTemplate,
                  category: e.target.value,
                })
              }
            />

            <textarea
              type="text"
              placeholder="content"
              className="w-full p-2 mb-4 border rounded"
              value={currentTemplate.content}
              onChange={(e) =>
                setCurrentTemplate({
                  ...currentTemplate,
                  content: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="placeholders"
              className="w-full p-2 mb-4 border rounded"
              value={currentTemplate.placeholders}
              onChange={(e) =>
                setCurrentTemplate({
                  ...currentTemplate,
                  placeholders: e.target.value,
                })
              }
            />

            <div className="flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={saveTemplate}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
