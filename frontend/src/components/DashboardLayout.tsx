import { FileUser, Luggage, UploadCloud, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form"

type FormValue = {
    jobDescription: string;
    selfDescription: string;
    resume: File | null;
}

export default function DashboardLayout() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValue>();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setValue("resume", file, { shouldValidate: true });
        }
    }

    function onDrop(e: React.DragEvent<HTMLLabelElement>) {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setSelectedFile(file);
            setValue("resume", file, { shouldValidate: true });
        }
    }

    function onDragOver(e: React.DragEvent<HTMLLabelElement>) {
        e.preventDefault();
        setIsDragging(true);
    }

    function onDragLeave(e: React.DragEvent<HTMLLabelElement>) {
        e.preventDefault();
        setIsDragging(false);
    }

    function onSubmit(data: FormValue) {
        console.log(data)
    }

    return (
        <div className="flex items-center justify-center">
            <div className="w-full max-w-6xl">
                <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow shadow-indigo-500/5 overflow-hidden">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* LEFT SIDE - Job Description */}
                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-indigo-50/50 to-white rounded-xl p-6 border border-indigo-100/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 rounded-full bg-indigo-500 text-white">
                                            <Luggage className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-slate-800">Target Job Description</h2>
                                            <p className="text-sm text-slate-500">Paste the job you're targeting</p>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <textarea
                                            {...register("jobDescription", {
                                                required: "Job Description is required",
                                            })}
                                            placeholder="Paste the complete job description here including requirements, responsibilities, and qualifications..."
                                            className="w-full h-116.5 rounded-xl border border-slate-200 bg-white p-2 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none shadow-sm"
                                        />
                                        {errors.jobDescription && (
                                            <p className="absolute -bottom-6 left-0 text-sm text-rose-500">
                                                {errors.jobDescription.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT SIDE - Resume & Self Description */}
                            <div className="space-y-6">
                                {/* Resume Upload */}
                                <div className="bg-gradient-to-br from-indigo-50/50 to-white rounded-xl p-6 border border-indigo-100/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 rounded-full bg-indigo-500 text-white">
                                            <FileUser className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-slate-800">Upload Resume</h2>
                                            <p className="text-sm text-slate-500">PDF or DOCX (Max 5MB)</p>
                                        </div>
                                    </div>

                                    <label
                                        onDrop={onDrop}
                                        onDragOver={onDragOver}
                                        onDragLeave={onDragLeave}
                                        className={`group relative flex flex-col items-center justify-center w-full h-48 border-2 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden
                                            ${isDragging
                                                ? 'border-indigo-400 bg-indigo-50 scale-[1.02]'
                                                : selectedFile
                                                    ? 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50/80'
                                                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 hover:border-indigo-300'
                                            }`}
                                    >
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            className="hidden"
                                            onChange={handleChange}
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                                        {selectedFile ? (
                                            <>
                                                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                                                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                                </div>
                                                <p className="text-sm font-medium text-slate-700 text-center px-4">
                                                    {selectedFile.name}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-2">
                                                    Click or drag to replace
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="p-3 rounded-full bg-indigo-100 mb-3 group-hover:scale-110 transition-transform">
                                                    <UploadCloud className={`w-6 h-6 transition-colors ${isDragging ? 'text-indigo-600' : 'text-indigo-500'}`} />
                                                </div>
                                                <p className="text-sm font-medium text-slate-700">
                                                    {isDragging ? 'Drop your resume here' : 'Click or drag & drop'}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-2">
                                                    Support: PDF, DOCX
                                                </p>
                                            </>
                                        )}
                                    </label>
                                </div>

                                {/* Self Description */}
                                <div className="bg-gradient-to-br from-indigo-50/50 to-white rounded-xl p-6 border border-indigo-100/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 rounded-full bg-indigo-500 text-white">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-slate-800">Self Description</h2>
                                            <p className="text-sm text-slate-500">Tell us about yourself</p>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <textarea
                                            {...register("selfDescription", {
                                                required: "Self Description is required",
                                            })}
                                            placeholder="Share your experience, key skills, career goals, and what you're looking for in your next role..."
                                            className="w-full h-34 rounded-xl border border-slate-200 bg-white p-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none shadow-sm"
                                        />
                                        {errors.selfDescription && (
                                            <p className="absolute -bottom-6 left-0 text-sm text-rose-500">
                                                {errors.selfDescription.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button Section */}
                        <div className="pt-8 gap-4 sm:flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-500 border-2 border-white" />
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 border-2 border-white" />
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 border-2 border-white" />
                                </div>
                                <span>Trusted by 10,000+ job seekers</span>
                            </div>

                            <button
                                type="submit"
                                className="group relative inline-flex items-center gap-2 bg-indigo-600 text-white font-medium px-8 py-3 rounded-full transition-all duration-300 cursor-pointer active:scale-102"
                            >
                                <span>Generate Interview Plan</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}