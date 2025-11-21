import React, { useState } from 'react';
import { Shield, Phone, Heart, Book, Activity } from 'lucide-react';
import SafetyPlan from '../components/crisis/SafetyPlan';
import CrisisCalmMode from '../components/crisis/CrisisCalmMode';

type TabType = 'overview' | 'calm' | 'safety-plan' | 'resources';

const CrisisSupportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Activity },
    { id: 'calm' as const, label: 'Calm Mode', icon: Heart },
    { id: 'safety-plan' as const, label: 'Safety Plan', icon: Shield },
    { id: 'resources' as const, label: 'Resources', icon: Book },
  ];

  const emergencyNumbers = [
    { name: '988 Suicide & Crisis Lifeline', number: '988', description: '24/7 suicide prevention and crisis support' },
    { name: 'Crisis Text Line', number: 'Text HOME to 741741', description: 'Text-based crisis support' },
    { name: 'Emergency Services', number: '911', description: 'Immediate emergency response' },
    { name: 'SAMHSA Helpline', number: '1-800-662-4357', description: 'Mental health & substance use support' },
    { name: 'Veterans Crisis Line', number: '1-800-273-8255 (Press 1)', description: 'Support for veterans' },
    { name: 'Trans Lifeline', number: '1-877-565-8860', description: 'Peer support for trans people' },
    { name: 'Trevor Project', number: '1-866-488-7386', description: 'LGBTQ+ youth crisis support' },
    { name: 'RAINN (Sexual Assault)', number: '1-800-656-4673', description: 'Sexual assault hotline' },
    { name: 'Domestic Violence Hotline', number: '1-800-799-7233', description: 'Support for domestic violence' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-purple-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-red-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              Crisis Support Center
            </h1>
          </div>
          <p className="text-purple-400">
            Immediate support, safety planning, and crisis resources
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-purple-900/20 p-2 rounded-xl border border-purple-500/30 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                      : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="animate-fadeIn">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Emergency Alert */}
              <div className="bg-gradient-to-br from-red-900/40 to-pink-900/40 p-6 rounded-xl border-2 border-red-500/50">
                <div className="flex items-start gap-4">
                  <Shield className="w-12 h-12 text-red-400 flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">If You're in Crisis Right Now</h2>
                    <p className="text-red-200 mb-4">
                      You are not alone. Help is available 24/7. You don't have to go through this by yourself.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <a
                        href="tel:988"
                        className="flex items-center gap-3 px-6 py-4 bg-red-500/30 hover:bg-red-500/40 border border-red-500/50 rounded-xl transition-all"
                      >
                        <Phone className="w-6 h-6 text-red-300" />
                        <div>
                          <p className="text-white font-bold">Call 988</p>
                          <p className="text-red-200 text-sm">Suicide & Crisis Lifeline</p>
                        </div>
                      </a>
                      <a
                        href="sms:741741&body=HOME"
                        className="flex items-center gap-3 px-6 py-4 bg-red-500/30 hover:bg-red-500/40 border border-red-500/50 rounded-xl transition-all"
                      >
                        <Phone className="w-6 h-6 text-red-300" />
                        <div>
                          <p className="text-white font-bold">Text HOME to 741741</p>
                          <p className="text-red-200 text-sm">Crisis Text Line</p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Access Tools */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('calm')}
                  className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-6 rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all text-left"
                >
                  <Heart className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Calm Mode</h3>
                  <p className="text-blue-200 text-sm">
                    Immediate grounding techniques and calming exercises for acute distress
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab('safety-plan')}
                  className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-6 rounded-xl border border-green-500/30 hover:border-green-400/50 transition-all text-left"
                >
                  <Shield className="w-8 h-8 text-green-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Safety Plan</h3>
                  <p className="text-green-200 text-sm">
                    Personalized crisis plan with warning signs, coping strategies, and contacts
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab('resources')}
                  className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all text-left"
                >
                  <Book className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Resources</h3>
                  <p className="text-purple-200 text-sm">
                    Crisis hotlines, mental health resources, and emergency contacts
                  </p>
                </button>
              </div>

              {/* You Are Not Alone */}
              <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30">
                <h2 className="text-2xl font-bold text-white mb-4">You Are Not Alone</h2>
                <div className="space-y-3 text-purple-200">
                  <p>
                    If you're experiencing suicidal thoughts, a mental health crisis, or intense emotional distress,
                    please know that these feelings are temporary, even though they feel overwhelming right now.
                  </p>
                  <p>
                    Crisis support is available 24/7. These professionals are trained to help you through this moment
                    and can provide immediate support.
                  </p>
                  <p className="font-semibold text-purple-100">
                    Your life has value. Your pain is real, and you deserve support. Reaching out for help is a sign
                    of strength, not weakness.
                  </p>
                </div>
              </div>

              {/* What to Expect */}
              <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30">
                <h3 className="text-xl font-bold text-white mb-4">What to Expect When You Call</h3>
                <ul className="space-y-3 text-blue-200">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>You'll speak with a trained crisis counselor who will listen without judgment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>They'll help you understand your feelings and explore options</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>They can connect you with local resources and ongoing support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>Your call is confidential and you can remain anonymous if you prefer</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>If you're in immediate danger, they can help coordinate emergency services</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'calm' && <CrisisCalmMode />}
          {activeTab === 'safety-plan' && <SafetyPlan />}
          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30">
                <h2 className="text-2xl font-bold text-white mb-4">Crisis & Support Hotlines</h2>
                <p className="text-purple-300 mb-6">
                  All hotlines below provide free, confidential support 24/7 unless otherwise noted.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {emergencyNumbers.map((line, i) => (
                    <div
                      key={i}
                      className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30 hover:border-purple-400/50 transition-all"
                    >
                      <h3 className="text-white font-bold mb-1">{line.name}</h3>
                      <a
                        href={`tel:${line.number.replace(/[^0-9]/g, '')}`}
                        className="text-2xl font-bold text-purple-300 hover:text-purple-200 block mb-2"
                      >
                        {line.number}
                      </a>
                      <p className="text-purple-400 text-sm">{line.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Online Resources */}
              <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30">
                <h2 className="text-2xl font-bold text-white mb-4">Online Support Communities</h2>
                <div className="space-y-3">
                  <div className="bg-blue-900/30 p-4 rounded-lg">
                    <h3 className="text-white font-bold mb-1">r/SuicideWatch</h3>
                    <p className="text-blue-300 text-sm mb-2">Peer support community on Reddit</p>
                    <a
                      href="https://www.reddit.com/r/SuicideWatch/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm underline"
                    >
                      Visit Community →
                    </a>
                  </div>
                  <div className="bg-blue-900/30 p-4 rounded-lg">
                    <h3 className="text-white font-bold mb-1">7 Cups</h3>
                    <p className="text-blue-300 text-sm mb-2">Free emotional support chat with trained listeners</p>
                    <a
                      href="https://www.7cups.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm underline"
                    >
                      Start Chat →
                    </a>
                  </div>
                </div>
              </div>

              {/* When to Go to Emergency Room */}
              <div className="bg-red-900/20 p-6 rounded-xl border border-red-500/30">
                <h2 className="text-2xl font-bold text-white mb-4">When to Go to the Emergency Room</h2>
                <p className="text-red-200 mb-4">
                  Go to your nearest emergency room or call 911 if:
                </p>
                <ul className="space-y-2 text-red-200">
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">•</span>
                    <span>You have a specific plan to harm yourself or end your life</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">•</span>
                    <span>You have access to means and intent to harm yourself</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">•</span>
                    <span>You're hearing voices telling you to hurt yourself</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">•</span>
                    <span>You've taken steps toward a suicide attempt</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">•</span>
                    <span>You feel you cannot keep yourself safe</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CrisisSupportPage;
