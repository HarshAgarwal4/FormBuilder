import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../services/axios";
import { toast } from "react-toastify";

function ResponseForm() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFormResponse() {
      try {
        const res = await axios.get(`/response/form/${id}`);
        if (res.status === 200 && res.data.status === 1) {
          setForm(res.data.form);
          setResponses(res.data.responses || []);
        } else {
          toast.error("Failed to fetch form responses");
        }
      } catch (err) {
        console.error(err);
        toast.error("Server error");
      } finally {
        setLoading(false);
      }
    }
    fetchFormResponse();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!form) return <div className="p-6 text-center">Form not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
        <p className="text-gray-500 mb-4">{form.description}</p>

        {responses.length === 0 ? (
          <div className="text-center text-gray-400 p-4 border rounded">
            No responses yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">#</th>
                  {form.fields.map((f) => (
                    <th
                      key={f.id}
                      className="px-4 py-2 text-left text-sm font-semibold"
                    >
                      {f.label}
                    </th>
                  ))}
                  <th className="px-4 py-2 text-left text-sm font-semibold">
                    Submitted At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {responses.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm">{idx + 1}</td>
                    {form.fields.map((f) => (
                      <td key={f.id} className="px-4 py-2 text-sm">
                        {Array.isArray(r.values[f.id])
                          ? r.values[f.id].join(", ")
                          : r.values[f.id] || "-"}
                      </td>
                    ))}
                    <td className="px-4 py-2 text-sm">
                      {new Date(r.submittedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResponseForm;
