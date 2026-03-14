import { useEffect, useState } from 'react';
import { Users, AlertTriangle, Calendar, TrendingUp, CheckCircle2, Code2, Globe } from 'lucide-react';
import type { InterviewData } from '@/types/dashboard.type';
import RenderQuestions from './RenderQuestions';
import PreparationPlan from './PreparationPlan';
import SkillGaps from './SkillGaps';
import { useNavigate, useParams } from 'react-router-dom';
import { getInterviewReport } from '@/api/interview.api';
import Loader from './Loader';
import toast from 'react-hot-toast';

export default function InterviewResults() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [data, setData] = useState<InterviewData | null>(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function getReport() {
            try {
                if (!id) return;
                const res = await getInterviewReport(id);
                setData(res.interviewReport)
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message);
                    navigate('/');
                }
            }
        }
        getReport();
    }, [id]);

    if (!data) return <Loader />;

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high': return { bg: 'bg-rose-500', light: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-200' };
            case 'medium': return { bg: 'bg-amber-500', light: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' };
            case 'low': return { bg: 'bg-emerald-500', light: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' };
            default: return { bg: 'bg-slate-500', light: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' };
        }
    };

    const getScoreMessage = (score: number) => {
        if (score >= 90) return "Outstanding! You're a top performer!"
        if (score >= 80) return "Excellent! Strong interview readiness"
        if (score >= 70) return "Good progress! Keep pushing"
        if (score >= 60) return "Getting there! Focus on weak areas"
        if (score >= 50) return "Need practice. Let's work on it"
        return "Starting point. Every expert was once a beginner"
    }

    const categories = [
        { id: 'all', label: 'All Insights', icon: Globe, count: data.technicalQuestions.length + data.behaviourQuestions.length + data.skillGaps.length },
        { id: 'technical', label: 'Technical', icon: Code2, count: data.technicalQuestions.length },
        { id: 'behavioral', label: 'Behavioral', icon: Users, count: data.behaviourQuestions.length },
        { id: 'skills', label: 'Skill Gaps', icon: AlertTriangle, count: data.skillGaps.length },
        { id: 'plan', label: 'Prep Plan', icon: Calendar, count: data.preparationPlan.length }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/40">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header Section with Match Score */}
                <div className="grid gap-6 mb-8">

                    {/* Match Score Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden">
                        {/* Modern Background Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl" />

                        <div className="relative">
                            {/* Modern Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                        <TrendingUp className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-indigo-100">Profile Strength</span>
                                        <div className="text-xs text-indigo-300">Combined Analysis</div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Score with Ring */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <div className="text-5xl font-bold tracking-tight">
                                        {Math.round((data.matchScore + data.atsScore) / 2)}
                                        <span className="text-xl text-indigo-300 ml-1">/100</span>
                                    </div>
                                    <div className="text-sm text-indigo-200 mt-1">
                                        {getScoreMessage((data.matchScore + data.atsScore) / 2)}
                                    </div>
                                </div>
                            </div>

                            {/* Modern Score Cards */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-indigo-200">Match</span>
                                        <span className="text-lg font-semibold">{data.matchScore}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white rounded-full transition-all"
                                            style={{ width: `${data.matchScore}%` }}
                                        />
                                    </div>
                                    <div className="text-[10px] text-indigo-300 mt-2">
                                        {data.matchScore >= 80 ? 'Strong' : data.matchScore >= 60 ? 'Good' : 'Needs work'}
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-indigo-200">ATS</span>
                                        <span className="text-lg font-semibold">{data.atsScore}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white rounded-full transition-all"
                                            style={{ width: `${data.atsScore}%` }}
                                        />
                                    </div>
                                    <div className="text-[10px] text-indigo-300 mt-2">
                                        {data.atsScore >= 80 ? 'Optimal' : data.atsScore >= 60 ? 'Average' : 'Improve'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-2 py-1 border border-slate-200 rounded-full text-sm cursor-pointer flex items-center gap-3 font-medium whitespace-nowrap transition-all ${selectedCategory === category.id ? "bg-indigo-500 text-white" : "bg-slate-200/20"}`}
                            >
                                <Icon className='h-4 w-4' />
                                {category.label}
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedCategory === category.id ? "bg-indigo-300" : "bg-slate-200"}`}>
                                    {category.count}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Sidebar - Quick Stats */}
                    <div className="hidden md:block md:col-span-3 space-y-4">
                        {/* Progress Card */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Preparation Progress</h3>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-600">Technical Questions</span>
                                        <span className="font-medium text-slate-800">0/{data.technicalQuestions.length}</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full w-0 bg-indigo-500 rounded-full" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-600">Behavioral Questions</span>
                                        <span className="font-medium text-slate-800">0/{data.behaviourQuestions.length}</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full w-0 bg-purple-500 rounded-full" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-600">Skill Gaps Addressed</span>
                                        <span className="font-medium text-slate-800">0/{data.skillGaps.length}</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full w-0 bg-amber-500 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Skill Gap Summary */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Priority Skills</h3>
                            <div className="space-y-2">
                                {data.skillGaps.map((gap, index) => {
                                    const colors = getSeverityColor(gap.serverity);
                                    return (
                                        <div key={index} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50">
                                            <div className={`w-2 h-2 rounded-full ${colors.bg}`} />
                                            <span className="text-xs text-slate-600 flex-1 truncate">{gap.skill}</span>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${colors.light} ${colors.text}`}>
                                                {gap.serverity}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Today's Focus */}
                        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-100 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1.5 rounded-lg bg-indigo-100">
                                    <Calendar className="w-3 h-3 text-indigo-600" />
                                </div>
                                <h3 className="text-xs font-semibold text-indigo-900">Today's Focus</h3>
                            </div>
                            <p className="text-sm font-medium text-slate-800 mb-1">{data.preparationPlan[0]?.focus}</p>
                            <p className="text-xs text-slate-500 mb-3">{data.preparationPlan[0]?.tasks.substring(0, 60)}...</p>
                            <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-lg transition-colors">
                                Start Learning
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="col-span-12 md:col-span-6 space-y-4">
                        <RenderQuestions
                            questionArr={data.technicalQuestions}
                            selectedCategory={selectedCategory}
                            category="technical"
                            title="Technical Questions"
                            answerLabel="suggested answer"
                            accentColorClass="text-indigo-600 hover:text-indigo-700"
                            accentBgClass="bg-indigo-100"
                        />

                        <RenderQuestions
                            questionArr={data.behaviourQuestions}
                            selectedCategory={selectedCategory}
                            category="behavioral"
                            title="Behavioral Questions"
                            answerLabel="STAR response"
                            accentColorClass="text-purple-600 hover:text-purple-700"
                            accentBgClass="bg-purple-100"
                        />

                        {(selectedCategory === 'all' || selectedCategory === 'skills') && (
                            <SkillGaps data={data.skillGaps} getSeverityColor={getSeverityColor} />
                        )}

                        {(selectedCategory === 'all' || selectedCategory === 'plan') && (
                            <PreparationPlan data={data.preparationPlan} />
                        )}
                    </div>

                    {/* Right Sidebar - Recommendations */}
                    <div className="hidden md:block md:col-span-3 space-y-4">
                        {/* Preparation Timeline */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Prep Timeline</h3>
                            <div className="space-y-3">
                                {data.preparationPlan.map((day) => (
                                    <div key={day.day} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <span className="text-xs font-medium text-indigo-600">{day.day}</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-slate-800">{day.focus}</p>
                                            <p className="text-[10px] text-slate-500 mt-0.5">{day.tasks.substring(0, 40)}...</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recommended Resources */}
                        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-4 text-white">
                            <h3 className="text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-3">Pro Tips</h3>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-xs">
                                    <div className="flex-shrink-0 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center mt-0.5">
                                        <CheckCircle2 className="w-3 h-3" />
                                    </div>
                                    <span>Practice with a timer to simulate real interview pressure</span>
                                </li>
                                <li className="flex items-start gap-2 text-xs">
                                    <div className="flex-shrink-0 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center mt-0.5">
                                        <CheckCircle2 className="w-3 h-3" />
                                    </div>
                                    <span>Record yourself to analyze communication style</span>
                                </li>
                                <li className="flex items-start gap-2 text-xs">
                                    <div className="flex-shrink-0 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center mt-0.5">
                                        <CheckCircle2 className="w-3 h-3" />
                                    </div>
                                    <span>Review skill gaps daily for better retention</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
