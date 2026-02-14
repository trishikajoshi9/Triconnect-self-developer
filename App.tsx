import React, { useState, useEffect } from 'react';
import NeumorphicContainer from './components/NeumorphicContainer';
import NeumorphicButton from './components/NeumorphicButton';
import { generateVibeCode, getLearningRoadmap } from './services/geminiService';
import { VibeMood, CodeVibe, SkillProgress } from './types';
import { 
  Code, 
  Cpu, 
  Zap, 
  Layout, 
  Settings, 
  Terminal, 
  ChevronRight, 
  Plus, 
  Search, 
  BookOpen, 
  PieChart, 
  Copy, 
  Check 
} from 'lucide-react';
// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vibe' | 'roadmap' | 'skills'>('vibe');
  const [vibePrompt, setVibePrompt] = useState('');
  const [selectedMood, setSelectedMood] = useState<VibeMood>(VibeMood.CREATIVE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [vibeHistory, setVibeHistory] = useState<CodeVibe[]>([]);
  const [currentVibe, setCurrentVibe] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  
  const [roadmapTopic, setRoadmapTopic] = useState('');
  const [roadmapData, setRoadmapData] = useState<any>(null);

  // Mandatory API Key Selection flow check
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKeyStatus = async () => {
      // @ts-ignore - aistudio is globally provided by the environment
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        try {
          // @ts-ignore
          const selected = await window.aistudio.hasSelectedApiKey();
          setHasApiKey(selected);
        } catch (e) {
          console.error("Failed to check API key status", e);
          setHasApiKey(false);
        }
      } else {
        // Fallback for environments without the aistudio global
        setHasApiKey(!!process.env.API_KEY);
      }
    };
    checkKeyStatus();
  }, []);

  const handleOpenKeySelector = async () => {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      try {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        setHasApiKey(true);
      } catch (e) {
        console.error("Failed to open key selector", e);
      }
    }
  };

  const skills: SkillProgress[] = [
    { skill: 'React / TS', level: 85, color: 'bg-blue-500' },
    { skill: 'Python / AI', level: 60, color: 'bg-emerald-500' },
    { skill: 'UI/UX Design', level: 75, color: 'bg-indigo-500' },
    { skill: 'Backend Architecture', level: 45, color: 'bg-orange-500' },
  ];

  const handleGenerateVibe = async () => {
    if (!vibePrompt) return;
    setIsGenerating(true);
    setCurrentVibe(null);
    try {
      const result = await generateVibeCode(vibePrompt, selectedMood);
      setCurrentVibe(result);
      const newVibe: CodeVibe = {
        id: Math.random().toString(36).substr(2, 9),
        title: result.title,
        prompt: vibePrompt,
        code: result.code,
        language: result.language,
        timestamp: Date.now()
      };
      setVibeHistory([newVibe, ...vibeHistory]);
    } catch (error: any) {
      console.error("Vibe generation failed", error);
      if (error?.message?.includes("Requested entity was not found.")) {
        setHasApiKey(false);
        await handleOpenKeySelector();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (currentVibe?.code) {
      navigator.clipboard.writeText(currentVibe.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!roadmapTopic) return;
    setIsGenerating(true);
    try {
      const result = await getLearningRoadmap(roadmapTopic);
      setRoadmapData(result);
    } catch (error: any) {
      console.error("Roadmap generation failed", error);
      if (error?.message?.includes("Requested entity was not found.")) {
        setHasApiKey(false);
        await handleOpenKeySelector();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Initial loading state
  if (hasApiKey === null) {
    return (
      <div className="min-h-screen bg-[#e0e5ec] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Cpu className="text-blue-600" size={48} />
          <p className="text-gray-500 font-medium">Initializing Workspace...</p>
        </div>
      </div>
    );
  }

  if (!hasApiKey) {
    return (
      <div className="min-h-screen bg-[#e0e5ec] flex items-center justify-center p-4">
        <NeumorphicContainer className="max-w-md w-full text-center">
          <Cpu className="mx-auto text-blue-600 mb-6" size={64} />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Pro Access Required</h1>
          <p className="text-gray-600 mb-8 font-medium leading-relaxed">
            To unlock Gemini 3 Pro features and AI reasoning, you must select an API key from a paid GCP project.
            Visit the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">billing documentation</a> for more information.
          </p>
          <NeumorphicButton onClick={handleOpenKeySelector} className="w-full py-4 text-lg bg-blue-50 text-blue-700">
            Select Pro API Key
          </NeumorphicButton>
        </NeumorphicContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e0e5ec] p-4 md:p-8">
      <nav className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <NeumorphicContainer className="p-2 rounded-xl">
            <Cpu className="text-blue-600" size={32} />
          </NeumorphicContainer>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Triconnect</h1>
            <p className="text-sm font-medium text-gray-500">Self Developer v2.5</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <NeumorphicButton 
            onClick={() => setActiveTab('vibe')}
            className={activeTab === 'vibe' ? 'text-blue-600 scale-105' : ''}
          >
            Vibe Studio
          </NeumorphicButton>
          <NeumorphicButton 
            onClick={() => setActiveTab('roadmap')}
            className={activeTab === 'roadmap' ? 'text-blue-600 scale-105' : ''}
          >
            Learning Path
          </NeumorphicButton>
          <NeumorphicButton 
            onClick={() => setActiveTab('skills')}
            className={activeTab === 'skills' ? 'text-blue-600 scale-105' : ''}
          >
            Skill Metrics
          </NeumorphicButton>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 space-y-8">
          <NeumorphicContainer>
            <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
              <PieChart size={20} className="text-indigo-500" />
              Dev Profile
            </h3>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.skill}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">{skill.skill}</span>
                    <span className="text-gray-400">{skill.level}%</span>
                  </div>
                  <div className="h-2 w-full neumorphic-inset rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${skill.color} transition-all duration-1000`} 
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </NeumorphicContainer>

          <NeumorphicContainer className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap size={64} className="text-yellow-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">Pro Subscription</h3>
            <p className="text-sm text-gray-500 mb-4">Unlimited AI reasoning with Gemini 3 Pro.</p>
            <NeumorphicButton className="w-full bg-gradient-to-br from-blue-50 to-transparent">
              Upgrade
            </NeumorphicButton>
          </NeumorphicContainer>
        </aside>

        <div className="lg:col-span-9 space-y-8">
          {activeTab === 'vibe' && (
            <div className="space-y-6">
              <NeumorphicContainer className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-sm font-semibold text-gray-600 mb-2 px-1">Code Vibe Prompt</label>
                    <div className="relative">
                      <textarea
                        value={vibePrompt}
                        onChange={(e) => setVibePrompt(e.target.value)}
                        placeholder="Describe the logic or UI vibe you want... e.g., 'A neumorphic card with Tailwind CSS'"
                        className="w-full neumorphic-inset rounded-xl p-4 text-gray-700 focus:outline-none h-24 resize-none"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-auto flex flex-col gap-2">
                    <label className="block text-sm font-semibold text-gray-600 px-1">Mood</label>
                    <select
                      value={selectedMood}
                      onChange={(e) => setSelectedMood(e.target.value as VibeMood)}
                      className="neumorphic-button rounded-xl px-4 py-3 outline-none cursor-pointer"
                    >
                      {Object.values(VibeMood).map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <NeumorphicButton 
                      onClick={handleGenerateVibe}
                      disabled={isGenerating || !vibePrompt}
                      className="py-3 bg-blue-50 text-blue-700 flex items-center justify-center gap-2"
                    >
                      {isGenerating ? 'Vibing...' : (
                        <>
                          <Zap size={18} />
                          Generate Code
                        </>
                      )}
                    </NeumorphicButton>
                  </div>
                </div>
              </NeumorphicContainer>

              {currentVibe && (
                <NeumorphicContainer className="bg-white/40 animate-in fade-in zoom-in duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Terminal size={20} className="text-blue-600" />
                      <h2 className="text-xl font-bold text-gray-800">{currentVibe.title}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {currentVibe.language}
                      </span>
                      <NeumorphicButton onClick={handleCopy} className="p-1 px-2 rounded-lg text-gray-500">
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </NeumorphicButton>
                    </div>
                  </div>
                  
                  <div className="neumorphic-inset rounded-xl mb-6 overflow-hidden relative">
                    <div className="max-h-[500px] overflow-auto">
                      <SyntaxHighlighter 
                        language={currentVibe.language.toLowerCase()} 
                        style={oneLight}
                        customStyle={{
                          background: 'transparent',
                          padding: '1.5rem',
                          margin: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {currentVibe.code}
                      </SyntaxHighlighter>
                    </div>
                  </div>

                  <div className="bg-gray-100/50 rounded-lg p-4 border border-white/50">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      <strong>Explanation:</strong> {currentVibe.explanation}
                    </p>
                  </div>
                </NeumorphicContainer>
              )}

              {vibeHistory.length > 0 && activeTab === 'vibe' && (
                <div>
                  <h4 className="text-sm font-bold text-gray-500 mb-4 px-2 uppercase tracking-widest">Recent Vibes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vibeHistory.slice(0, 4).map((v) => (
                      <NeumorphicContainer 
                        key={v.id} 
                        className="p-4 hover:scale-[1.02] transition-transform cursor-pointer"
                        onClick={() => setCurrentVibe(v)}
                      >
                        <div className="flex items-center gap-3">
                          <Terminal size={20} className="text-gray-400" />
                          <div className="flex-1 overflow-hidden">
                            <h5 className="font-semibold text-gray-700 truncate">{v.title}</h5>
                            <p className="text-xs text-gray-400">{v.language} • {new Date(v.timestamp).toLocaleTimeString()}</p>
                          </div>
                          <ChevronRight size={16} className="text-gray-300" />
                        </div>
                      </NeumorphicContainer>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              <NeumorphicContainer className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={roadmapTopic}
                    onChange={(e) => setRoadmapTopic(e.target.value)}
                    placeholder="Enter a tech stack or topic... e.g. 'Cloudflare Workers'"
                    className="w-full neumorphic-inset rounded-xl py-3 pl-12 pr-4 text-gray-700 focus:outline-none"
                  />
                </div>
                <NeumorphicButton 
                  onClick={handleGenerateRoadmap}
                  disabled={isGenerating || !roadmapTopic}
                  className="px-8 whitespace-nowrap bg-blue-50 text-blue-700"
                >
                  {isGenerating ? 'Mapping...' : 'Generate Roadmap'}
                </NeumorphicButton>
              </NeumorphicContainer>

              {roadmapData && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="text-center py-6">
                    <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">{roadmapData.topic}</h2>
                  </div>

                  <div className="relative border-l-2 border-dashed border-gray-300 ml-6 pl-10 space-y-10">
                    {roadmapData.phases.map((phase: any, idx: number) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[54px] top-0 neumorphic-button w-10 h-10 rounded-full flex items-center justify-center font-bold text-blue-600 bg-white">
                          {idx + 1}
                        </div>
                        <NeumorphicContainer className="bg-white/60">
                          <h3 className="text-xl font-bold text-gray-800 mb-4">{phase.phaseName}</h3>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {phase.milestones.map((milestone: string, midx: number) => (
                              <li key={midx} className="flex items-center gap-3 text-gray-600">
                                <div className="w-2 h-2 rounded-full bg-blue-400" />
                                <span className="text-sm font-medium">{milestone}</span>
                              </li>
                            ))}
                          </ul>
                        </NeumorphicContainer>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <NeumorphicContainer className="col-span-1">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <PieChart size={24} className="text-indigo-500" />
                  Growth Trajectory
                </h3>
                <div className="aspect-square neumorphic-inset rounded-full p-8 flex items-center justify-center relative">
                  <div className="text-center">
                    <span className="text-4xl font-extrabold text-blue-600">68%</span>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Global Mastery</p>
                  </div>
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle cx="50%" cy="50%" r="45%" stroke="rgba(255,255,255,0.5)" strokeWidth="12" fill="transparent" />
                    <circle cx="50%" cy="50%" r="45%" stroke="#3b82f6" strokeWidth="12" fill="transparent" strokeDasharray="283" strokeDashoffset="90" strokeLinecap="round" />
                  </svg>
                </div>
              </NeumorphicContainer>

              <div className="space-y-6">
                <NeumorphicContainer>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><Zap size={24} /></div>
                    <div>
                      <h4 className="font-bold text-gray-800">Streak: 12 Days</h4>
                      <p className="text-sm text-gray-500">Keep up the daily coding!</p>
                    </div>
                  </div>
                </NeumorphicContainer>
                
                <NeumorphicContainer className="bg-indigo-600 text-white">
                  <h4 className="font-bold mb-2">Next Milestone</h4>
                  <p className="text-sm opacity-90 mb-4">Mastering Edge Functions</p>
                  <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-2/3" />
                  </div>
                </NeumorphicContainer>
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-8 right-8">
        <NeumorphicButton className="w-14 h-14 rounded-full flex items-center justify-center p-0 shadow-lg">
          <Settings size={28} className="text-gray-500" />
        </NeumorphicButton>
      </div>
    </div>
  );
};

export default App;
