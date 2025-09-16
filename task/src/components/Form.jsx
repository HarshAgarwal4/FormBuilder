import React, { useState, useEffect } from "react";

// Single-file React App (TailwindCSS assumed to be available)
// - Dashboard: list forms
// - FormBuilder: click-to-add fields, edit props, reorder, save form (to API/localStorage)
// - FormRenderer: render saved form and submit responses

export default function Form() {
  const [view, setView] = useState("dashboard"); // dashboard | builder | render
  const [forms, setForms] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("forms")) || [];
    } catch (e) {
      return [];
    }
  });
  const [editingForm, setEditingForm] = useState(null);
  const [renderForm, setRenderForm] = useState(null);

  useEffect(() => {
    localStorage.setItem("forms", JSON.stringify(forms));
  }, [forms]);

  function createNewForm() {
    const f = {
      id: Date.now().toString(),
      title: "Untitled form",
      description: "",
      fields: [],
      theme: { primary: "#2563eb", font: "Inter, sans-serif" },
      createdAt: new Date().toISOString(),
    };
    setEditingForm(f);
    setView("builder");
  }

  function editForm(form) {
    setEditingForm(JSON.parse(JSON.stringify(form)));
    setView("builder");
  }

  function duplicateForm(form) {
    const copy = JSON.parse(JSON.stringify(form));
    copy.id = Date.now().toString();
    copy.title = form.title + " (copy)";
    setForms([copy, ...forms]);
  }

  function deleteForm(id) {
    if (!confirm("Delete this form? This cannot be undone.")) return;
    setForms(forms.filter((f) => f.id !== id));
  }

  function saveFormLocally(form) {
    setForms((prev) => {
      const exists = prev.find((p) => p.id === form.id);
      if (exists) {
        return prev.map((p) => (p.id === form.id ? form : p));
      }
      return [form, ...prev];
    });
    setView("dashboard");
    setEditingForm(null);
  }

  function openForm(form) {
    setRenderForm(form);
    setView("render");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 font-sans">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">No‑Code Form Builder (Demo)</h1>
        <div className="space-x-2">
          <button onClick={() => setView("dashboard")} className="px-3 py-1 rounded bg-white shadow">Dashboard</button>
          <button onClick={createNewForm} className="px-3 py-1 rounded bg-blue-600 text-white">Create Form</button>
        </div>
      </header>

      {view === "dashboard" && (
        <div>
          <h2 className="text-lg font-medium mb-3">Your Forms</h2>
          {forms.length === 0 && (
            <div className="p-6 bg-white rounded shadow">No forms yet — click "Create Form" to start.</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forms.map((f) => (
              <div key={f.id} className="p-4 bg-white rounded shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="text-sm text-slate-500">{f.description}</p>
                    <p className="mt-2 text-xs text-slate-400">Fields: {f.fields.length}</p>
                  </div>
                  <div className="space-x-1 text-xs">
                    <button onClick={() => openForm(f)} className="px-2 py-1 rounded bg-green-600 text-white">Open</button>
                    <button onClick={() => editForm(f)} className="px-2 py-1 rounded bg-yellow-400">Edit</button>
                    <button onClick={() => duplicateForm(f)} className="px-2 py-1 rounded bg-indigo-500 text-white">Duplicate</button>
                    <button onClick={() => deleteForm(f.id)} className="px-2 py-1 rounded bg-red-500 text-white">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "builder" && editingForm && (
        <FormBuilder form={editingForm} onSave={saveFormLocally} onCancel={() => setView("dashboard")} />
      )}

      {view === "render" && renderForm && (
        <div>
          <button onClick={() => setView("dashboard")} className="text-sm mb-3">← Back to dashboard</button>
          <FormRenderer form={renderForm} onSubmitted={() => alert("Submitted (demo)")} />
        </div>
      )}
    </div>
  );
}

function FormBuilder({ form, onSave, onCancel }) {
  const [local, setLocal] = useState(form);

  useEffect(() => setLocal(form), [form]);

  function addField(type) {
    const field = {
      id: Date.now().toString(),
      type,
      label: type === "text" ? "Short answer" : type === "textarea" ? "Paragraph" : "Option",
      placeholder: "",
      required: false,
      options: type === "select" || type === "radio" || type === "checkbox" ? ["Option 1", "Option 2"] : [],
      layout: "full",
    };
    setLocal({ ...local, fields: [...local.fields, field] });
  }

  function updateField(id, patch) {
    setLocal({ ...local, fields: local.fields.map((f) => (f.id === id ? { ...f, ...patch } : f)) });
  }

  function removeField(id) {
    setLocal({ ...local, fields: local.fields.filter((f) => f.id !== id) });
  }

  function moveField(id, dir) {
    const idx = local.fields.findIndex((f) => f.id === id);
    if (idx === -1) return;
    const arr = [...local.fields];
    const [item] = arr.splice(idx, 1);
    arr.splice(idx + dir, 0, item);
    setLocal({ ...local, fields: arr });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white p-4 rounded shadow">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <input value={local.title} onChange={(e) => setLocal({ ...local, title: e.target.value })} className="text-xl font-semibold w-full" />
            <input value={local.description} onChange={(e) => setLocal({ ...local, description: e.target.value })} className="text-sm w-full mt-1 text-slate-500" />
          </div>
          <div className="text-sm">
            <button onClick={() => onSave(local)} className="px-3 py-1 rounded bg-blue-600 text-white">Save</button>
            <button onClick={onCancel} className="px-3 py-1 ml-2 rounded bg-white">Cancel</button>
          </div>
        </div>

        <div className="space-y-3">
          {local.fields.map((field, i) => (
            <div key={field.id} className="p-3 border rounded">
              <div className="flex justify-between items-start">
                <div>
                  <strong>{i + 1}. {field.label} </strong>
                  <div className="text-xs text-slate-500">{field.type}</div>
                </div>
                <div className="space-x-1">
                  <button onClick={() => moveField(field.id, -1)} disabled={i === 0} className="px-2 py-1 rounded bg-slate-100">↑</button>
                  <button onClick={() => moveField(field.id, 1)} disabled={i === local.fields.length - 1} className="px-2 py-1 rounded bg-slate-100">↓</button>
                  <button onClick={() => removeField(field.id)} className="px-2 py-1 rounded bg-red-500 text-white">Delete</button>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                <input value={field.label} onChange={(e) => updateField(field.id, { label: e.target.value })} placeholder="Label" className="p-2 border rounded" />
                <input value={field.placeholder} onChange={(e) => updateField(field.id, { placeholder: e.target.value })} placeholder="Placeholder" className="p-2 border rounded" />
                <label className="flex items-center space-x-2"><input type="checkbox" checked={field.required} onChange={(e) => updateField(field.id, { required: e.target.checked })} /> <span className="text-sm">Required</span></label>
                {(field.type === "select" || field.type === "radio" || field.type === "checkbox") && (
                  <OptionsEditor options={field.options} onChange={(opts) => updateField(field.id, { options: opts })} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="bg-white p-4 rounded shadow">
        <h4 className="font-semibold mb-2">Add Field</h4>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => addField("text")} className="px-3 py-1 rounded bg-slate-100">Short answer</button>
            <button onClick={() => addField("textarea")} className="px-3 py-1 rounded bg-slate-100">Paragraph</button>
            <button onClick={() => addField("select")} className="px-3 py-1 rounded bg-slate-100">Dropdown</button>
            <button onClick={() => addField("radio")} className="px-3 py-1 rounded bg-slate-100">Radio</button>
            <button onClick={() => addField("checkbox")} className="px-3 py-1 rounded bg-slate-100">Checkboxes</button>
          </div>

          <div className="mt-4">
            <h5 className="font-medium">Preview</h5>
            <div className="mt-2 border p-3 rounded">
              <strong>{local.title}</strong>
              <p className="text-xs text-slate-500">{local.description}</p>
              <div className="mt-3 space-y-2">
                {local.fields.map((f) => (
                  <div key={f.id} className="p-2 border rounded text-sm">
                    <div>{f.label} {f.required ? '*' : ''}</div>
                    {f.type === 'text' && <input className="mt-1 p-1 border rounded w-full" placeholder={f.placeholder} />}
                    {f.type === 'textarea' && <textarea className="mt-1 p-1 border rounded w-full" placeholder={f.placeholder} />}
                    {(f.type === 'select') && (
                      <select className="mt-1 p-1 border rounded w-full">
                        {f.options.map((o, idx) => <option key={idx}>{o}</option>)}
                      </select>
                    )}
                    {f.type === 'radio' && f.options.map((o, idx) => <div key={idx}><label><input type="radio" name={f.id}/> {o}</label></div>)}
                    {f.type === 'checkbox' && f.options.map((o, idx) => <div key={idx}><label><input type="checkbox" name={f.id}/> {o}</label></div>)}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </aside>
    </div>
  );
}

function OptionsEditor({ options, onChange }) {
  function updateOption(idx, val) {
    const copy = [...options];
    copy[idx] = val;
    onChange(copy);
  }
  function add() { onChange([...options, `Option ${options.length + 1}`]); }
  function remove(idx) { onChange(options.filter((_, i) => i !== idx)); }
  return (
    <div>
      <div className="text-xs text-slate-500">Options</div>
      <div className="space-y-2 mt-1">
        {options.map((o, idx) => (
          <div key={idx} className="flex gap-2">
            <input value={o} onChange={(e) => updateOption(idx, e.target.value)} className="p-2 border rounded flex-1" />
            <button onClick={() => remove(idx)} className="px-2 rounded bg-red-500 text-white">x</button>
          </div>
        ))}
        <button onClick={add} className="mt-2 px-2 py-1 rounded bg-slate-100">Add option</button>
      </div>
    </div>
  );
}

function FormRenderer({ form, onSubmitted }) {
  const [values, setValues] = useState({});

  function handleChange(field, val) {
    setValues((p) => ({ ...p, [field.id]: val }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: send to backend API: POST /api/forms/:id/responses
    // For demo we store responses in localStorage keyed by formResponses:{formId}
    const key = `responses:${form.id}`;
    const prev = JSON.parse(localStorage.getItem(key) || "[]");
    localStorage.setItem(key, JSON.stringify([{ id: Date.now().toString(), submittedAt: new Date().toISOString(), values }, ...prev]));
    onSubmitted?.();
  }

  return (
    <div className="max-w-2xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold">{form.title}</h2>
      <p className="text-sm text-slate-500">{form.description}</p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {form.fields.map((f) => (
          <div key={f.id}>
            <label className="block text-sm font-medium mb-1">{f.label}{f.required ? '*' : ''}</label>
            {f.type === 'text' && <input value={values[f.id] || ''} onChange={(e) => handleChange(f, e.target.value)} placeholder={f.placeholder} className="p-2 border rounded w-full" />}
            {f.type === 'textarea' && <textarea value={values[f.id] || ''} onChange={(e) => handleChange(f, e.target.value)} placeholder={f.placeholder} className="p-2 border rounded w-full" />}
            {f.type === 'select' && (
              <select value={values[f.id] || f.options[0] || ''} onChange={(e) => handleChange(f, e.target.value)} className="p-2 border rounded w-full">
                {f.options.map((o, idx) => <option key={idx} value={o}>{o}</option>)}
              </select>
            )}
            {f.type === 'radio' && f.options.map((o, idx) => (
              <label key={idx} className="block"><input type="radio" name={f.id} value={o} onChange={(e) => handleChange(f, e.target.value)} /> {o}</label>
            ))}
            {f.type === 'checkbox' && f.options.map((o, idx) => (
              <label key={idx} className="block"><input type="checkbox" checked={(values[f.id] || []).includes(o)} onChange={(e) => {
                const prev = values[f.id] || [];
                if (e.target.checked) handleChange(f, [...prev, o]); else handleChange(f, prev.filter(x => x !== o));
              }} /> {o}</label>
            ))}
          </div>
        ))}

        <div className="flex items-center gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
        </div>
      </form>
    </div>
  );
}