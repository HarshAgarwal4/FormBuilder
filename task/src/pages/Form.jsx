import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../services/axios";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";

function FormPage() {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const { handleSubmit, control, register, setValue, watch } = useForm();

    useEffect(() => {
        async function fetchForm() {
            try {
                const res = await axios.get(`/form/${id}`);
                if (res.status === 200 && res.data.status === 1) {
                    setForm(res.data.form);
                    console.log(res.data.form.fields)
                    res.data.form.fields.forEach(f => {
                        setValue(f._id, f.type === "checkbox" ? [] : "");
                    });
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchForm();
    }, [id, setValue]);

    const onSubmit = async (data) => {
        console.log(data)
        try {
            const payload = {
                form: form._id,
                values: data
            };
            console.log("Form Submitted:", payload);

            const r = await axios.post('/submit/form', payload);
            if (r.status === 200) {
                if (r.data.status === 1) toast.success("Your response has been recorded successfully");
                else toast.error("Error in recording response");
            }
        } catch (err) {
            console.log(err);
            toast.error("Server error");
        }
    };

    if (!form) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans flex justify-center items-center">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow w-full">
                <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
                <p className="text-sm text-gray-500 mb-4">{form.description}</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {form.fields.length === 0 ? (
                        <span>No fields available</span>
                    ) : (
                        form.fields.map((f) => (
                            <div key={f._id}>
                                <label className="block text-sm font-medium mb-1">
                                    {f.label} {f.required && "*"}
                                </label>

                                {f.type === "text" && (
                                    <input
                                        type="text"
                                        placeholder={f.placeholder}
                                        {...register(f.label , { required: f.required })}
                                        className="p-2 border rounded w-full"
                                    />
                                )}

                                {f.type === "textarea" && (
                                    <textarea
                                        placeholder={f.placeholder}
                                        {...register(f.label, { required: f.required })}
                                        className="p-2 border rounded w-full"
                                    />
                                )}

                                {f.type === "select" && (
                                    <select
                                        {...register(f.label, { required: f.required })}
                                        className="p-2 border rounded w-full"
                                    >
                                        {f.options.map((opt, idx) => (
                                            <option key={idx} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {f.type === "radio" && (
                                    <div>
                                        {f.options.map((opt, idx) => (
                                            <label key={idx} className="block">
                                                <input
                                                    type="radio"
                                                    value={opt}
                                                    {...register(f.label, { required: f.required })}
                                                />{" "}
                                                {opt}
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {f.type === "checkbox" && (
                                    <Controller
                                        name={f.label}
                                        control={control}
                                        rules={{ required: f.required }}
                                        render={({ field }) => (
                                            <div>
                                                {f.options.map((opt, idx) => (
                                                    <label key={idx} className="block">
                                                        <input
                                                            type="checkbox"
                                                            value={opt}
                                                            checked={field.value.includes(opt)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    field.onChange([...field.value, opt]);
                                                                } else {
                                                                    field.onChange(
                                                                        field.value.filter((v) => v !== opt)
                                                                    );
                                                                }
                                                            }}
                                                        />{" "}
                                                        {opt}
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    />
                                )}
                            </div>
                        ))
                    )}

                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default FormPage;
