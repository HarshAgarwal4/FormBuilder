import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/GlobalContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "../services/axios";
import { toast } from "react-toastify";

function Dashboard() {
  const [view, setView] = useState("dashboard");
  const [openNav, setOpenNav] = useState(false);
  const { user } = useContext(AppContext);
  const [editingForm, setEditingForm] = useState(null);
  const [renderForm, setRenderForm] = useState(null);
  const [values, setValues] = useState({});
  const [localForm, setLocalForm] = useState(null);
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  async function fetchForms() {
    try {
      const res = await axios.get("/fetchForms");
      if (res.status === 200 && res.data.status === 1) {
        toast.success("Forms fetched successfully");
        setForms(res.data.forms);
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  }

  useEffect(() => {
    fetchForms();
  }, []);

  function createNewForm() {
    const f = {
      title: "Untitled form",
      description: "",
      fields: [],
      theme: { primary: "#2563eb", font: "Inter, sans-serif" },
    };
    setEditingForm(f);
    setLocalForm(f);
    setView("builder");
  }

  async function deleteForm(id) {
    if (!confirm("Delete this form? This cannot be undone.")) return;
    try {
      let res = await axios.post("/deleteForm", { id });
      if (res.status === 200 && res.data.status === 1) {
        toast.success("Deleted successfully");
        setForms(forms.filter((f) => f._id !== id));
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  }

  function getResponseOfForm(id) {
    navigate(`/response/form/${id}`);
  }

  async function saveFormLocally(form) {
    try {
      let res = await axios.post("/saveForm", form);
      if (res.status === 200 && res.data.status === 1) {
        toast.success("Form saved successfully");
        setForms((prev) => {
          const exists = prev.find((p) => p._id === form._id);
          if (exists) {
            return prev.map((p) => (p._id === form._id ? form : p));
          }
          return [form, ...prev];
        });
        setView("dashboard");
        setEditingForm(null);
        setLocalForm(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  }

  function openForm(form) {
    setRenderForm(form);
    setView("render");
  }

  function ShareForm(id) {
    const formLink = `${window.location.origin}/form/${id}`;
    navigator.clipboard
      .writeText(formLink)
      .then(() => toast.success("Form link copied!"))
      .catch((err) => console.error(err));
  }

  function addField(type) {
    const field = {
      id: Date.now().toString(),
      type,
      label:
        type === "text"
          ? "Short Answer"
          : type === "textarea"
          ? "Paragraph"
          : "Option",
      placeholder: "",
      required: false,
      options:
        type === "select" || type === "radio" || type === "checkbox"
          ? ["Option 1", "Option 2"]
          : [],
      layout: "full",
    };
    setLocalForm({ ...localForm, fields: [...localForm.fields, field] });
  }

  function updateField(id, patch) {
    setLocalForm({
      ...localForm,
      fields: localForm.fields.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    });
  }

  function removeField(id) {
    setLocalForm({
      ...localForm,
      fields: localForm.fields.filter((f) => f.id !== id),
    });
  }

  function moveField(id, dir) {
    const idx = localForm.fields.findIndex((f) => f.id === id);
    if (idx === -1) return;
    const arr = [...localForm.fields];
    const [item] = arr.splice(idx, 1);
    arr.splice(idx + dir, 0, item);
    setLocalForm({ ...localForm, fields: arr });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const key = `responses:${renderForm._id}`;
    const prev = JSON.parse(localStorage.getItem(key) || "[]");
    localStorage.setItem(
      key,
      JSON.stringify([
        { id: Date.now().toString(), submittedAt: new Date().toISOString(), values },
        ...prev,
      ])
    );
    alert("Submitted (demo)");
    setView("dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-6 font-sans">
      {/* HEADER */}
      <header className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold">No-Code Form Builder (Demo)</h1>
        <div className="flex flex-wrap gap-2 items-center">
          {user && (
            <div className="relative">
              <button
                onClick={() => setOpenNav(!openNav)}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
              >
                {user.name}
              </button>
              {openNav && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-10">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700 transition"
                  >
                    Profile
                  </Link>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 transition">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => setView("dashboard")}
            className="px-3 py-1 rounded bg-white shadow"
          >
            Dashboard
          </button>
          <button
            onClick={createNewForm}
            className="px-3 py-1 rounded bg-blue-600 text-white"
          >
            Create Form
          </button>
        </div>
      </header>

      {/* DASHBOARD */}
      {view === "dashboard" && (
        <div>
          <h2 className="text-lg font-medium mb-3">Your Forms</h2>
          {forms.length === 0 && (
            <div className="p-6 bg-white rounded shadow">No forms yet.</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms.map((f) => (
              <div key={f._id} className="p-4 bg-white rounded shadow flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-slate-500">{f.description}</p>
                  <p className="mt-2 text-xs text-slate-400">Fields: {f.fields.length}</p>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => openForm(f)}
                    className="px-2 py-1 rounded bg-green-600 text-white w-full sm:w-auto"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => deleteForm(f._id)}
                    className="px-2 py-1 rounded bg-red-500 text-white w-full sm:w-auto"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => ShareForm(f._id)}
                    className="px-2 py-1 rounded bg-blue-500 text-white w-full sm:w-auto"
                  >
                    Share
                  </button>
                  <button
                    onClick={() => getResponseOfForm(f._id)}
                    className="px-2 py-1 rounded bg-blue-500 text-white w-full sm:w-auto"
                  >
                    View Response
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BUILDER */}
      {view === "builder" && localForm && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="md:col-span-2 bg-white p-4 rounded shadow overflow-x-auto">
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <div className="w-full">
                <input
                  value={localForm.title}
                  onChange={(e) => setLocalForm({ ...localForm, title: e.target.value })}
                  className="text-xl font-semibold w-full mb-1"
                  placeholder="Form Title"
                />
                <input
                  value={localForm.description}
                  onChange={(e) => setLocalForm({ ...localForm, description: e.target.value })}
                  className="text-sm w-full text-slate-500"
                  placeholder="Form Description"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => saveFormLocally(localForm)}
                  className="px-3 py-1 rounded bg-blue-600 text-white"
                >
                  Save
                </button>
                <button
                  onClick={() => setView("dashboard")}
                  className="px-3 py-1 rounded bg-white border"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {localForm.fields.map((field, i) => (
                <div key={field.id} className="p-3 border rounded">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <strong>
                        {i + 1}. {field.label}
                      </strong>
                      <div className="text-xs text-slate-500">{field.type}</div>
                    </div>
                    <div className="flex gap-1 mt-2 sm:mt-0">
                      <button
                        onClick={() => moveField(field.id, -1)}
                        disabled={i === 0}
                        className="px-2 py-1 rounded bg-slate-100"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveField(field.id, 1)}
                        disabled={i === localForm.fields.length - 1}
                        className="px-2 py-1 rounded bg-slate-100"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removeField(field.id)}
                        className="px-2 py-1 rounded bg-red-500 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      placeholder="Label"
                      className="p-2 border rounded w-full"
                    />
                    <input
                      value={field.placeholder}
                      onChange={(e) =>
                        updateField(field.id, { placeholder: e.target.value })
                      }
                      placeholder="Placeholder"
                      className="p-2 border rounded w-full"
                    />
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                          updateField(field.id, { required: e.target.checked })
                        }
                      />
                      <span className="text-sm">Required</span>
                    </label>
                  </div>

                  {/* Options editor for select/radio/checkbox */}
                  {(field.type === "select" || field.type === "radio" || field.type === "checkbox") && (
                    <div className="mt-3">
                      <label className="text-sm font-medium">Options</label>
                      <div className="space-y-2 mt-2">
                        {field.options.map((opt, oi) => (
                          <div key={oi} className="flex items-center gap-2">
                            <input
                              value={opt}
                              onChange={(e) =>
                                updateField(field.id, {
                                  options: field.options.map((o, idx) => (idx === oi ? e.target.value : o)),
                                })
                              }
                              className="p-2 border rounded w-full"
                            />
                            <button
                              onClick={() =>
                                updateField(field.id, { options: field.options.filter((_, idx) => idx !== oi) })
                              }
                              className="px-2 py-1 rounded bg-red-500 text-white"
                            >
                              Delete
                            </button>
                          </div>
                        ))}

                        <button
                          onClick={() =>
                            updateField(field.id, { options: [...field.options, `Option ${field.options.length + 1}`] })
                          }
                          className="mt-2 px-2 py-1 rounded bg-slate-100"
                        >
                          + Add option
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <aside className="bg-white p-4 rounded shadow md:sticky md:top-4">
            <h4 className="font-semibold mb-2">Add Field</h4>
            <div className="flex flex-wrap gap-2">
              {['text', 'textarea', 'select', 'radio', 'checkbox'].map((type) => (
                <button
                  key={type}
                  onClick={() => addField(type)}
                  className="px-3 py-1 rounded bg-slate-100 text-sm"
                >
                  {type === 'text'
                    ? 'Short Answer'
                    : type === 'textarea'
                    ? 'Paragraph'
                    : type === 'select'
                    ? 'Dropdown'
                    : type === 'radio'
                    ? 'Radio'
                    : 'Checkboxes'}
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}

      {/* RENDER FORM */}
      {view === "render" && renderForm && (
        <div>
          <button onClick={() => setView("dashboard")} className="text-sm mb-3">
            ← Back to dashboard
          </button>
          <div className="max-w-2xl bg-white p-4 sm:p-6 rounded shadow">
            <h2 className="text-xl font-semibold">{renderForm.title}</h2>
            <p className="text-sm text-slate-500">{renderForm.description}</p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {renderForm.fields.map((f) => (
                <div key={f.id}>
                  <label className="block text-sm font-medium mb-1">
                    {f.label}
                    {f.required ? "*" : ""}
                  </label>
                  {f.type === "text" && (
                    <input
                      value={values[f.id] || ""}
                      onChange={(e) => setValues((p) => ({ ...p, [f.id]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="p-2 border rounded w-full"
                    />
                  )}
                  {f.type === "textarea" && (
                    <textarea
                      value={values[f.id] || ""}
                      onChange={(e) => setValues((p) => ({ ...p, [f.id]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="p-2 border rounded w-full"
                    />
                  )}
                  {f.type === "select" && (
                    <select
                      value={values[f.id] || f.options[0] || ""}
                      onChange={(e) => setValues((p) => ({ ...p, [f.id]: e.target.value }))}
                      className="p-2 border rounded w-full"
                    >
                      {f.options.map((o, idx) => (
                        <option key={idx} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  )}
                  {f.type === "radio" &&
                    f.options.map((o, idx) => (
                      <label key={idx} className="block">
                        <input
                          type="radio"
                          name={f.id}
                          value={o}
                          onChange={(e) =>
                            setValues((p) => ({ ...p, [f.id]: e.target.value }))
                          }
                        />{" "}
                        {o}
                      </label>
                    ))}
                  {f.type === "checkbox" &&
                    f.options.map((o, idx) => (
                      <label key={idx} className="block">
                        <input
                          type="checkbox"
                          checked={(values[f.id] || []).includes(o)}
                          onChange={(e) => {
                            const prev = values[f.id] || [];
                            if (e.target.checked)
                              setValues((p) => ({ ...p, [f.id]: [...prev, o] }));
                            else
                              setValues((p) => ({
                                ...p,
                                [f.id]: prev.filter((x) => x !== o),
                              }));
                          }}
                        />{" "}
                        {o}
                      </label>
                    ))}

                  <div className="mt-2" />
                </div>
              ))}
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
