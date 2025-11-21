import React from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare, Scale, Phone, Users, CreditCard, FileText,
  UserCheck, ScrollText, Briefcase, Shield
} from 'lucide-react';

const SelfAdvocacyHub: React.FC = () => {
  const advocacyFeatures = [
    {
      id: 'scripts',
      title: 'Script Picker (Tone-Based)',
      description: 'Browse Calm, Firm, Warm, and Assertive communication scripts for any situation',
      icon: MessageSquare,
      path: '/advocacy/scripts',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      id: 'hearing-prep',
      title: 'Hearing Prep Wizard',
      description: 'Step-by-step disability hearing preparation with checklist and document tracker',
      icon: Scale,
      path: '/advocacy/hearing-prep',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'insurance-helper',
      title: 'Insurance Call Helper',
      description: 'Live prompt cards and call logging for navigating insurance systems',
      icon: Phone,
      path: '/advocacy/insurance-helper',
      color: 'from-green-500 to-teal-500',
    },
    {
      id: 'role-play',
      title: 'Doctor Visit Role-Play',
      description: 'Practice responses to medical dismissal and gaslighting scenarios',
      icon: Users,
      path: '/advocacy/role-play',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: 'access-cards',
      title: 'Access Needs Card Generator',
      description: 'Create printable cards listing your accessibility needs and accommodations',
      icon: CreditCard,
      path: '/advocacy/access-cards',
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: 'records-binder',
      title: 'Records Binder Index',
      description: 'Searchable index of PDFs, lab results, and medical documents',
      icon: FileText,
      path: '/advocacy/records-binder',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      id: 'appeal-letters',
      title: 'Appeal Letter Builder',
      description: 'Template-guided tool for writing insurance and benefits appeals',
      icon: ScrollText,
      path: '/advocacy/appeal-letters',
      color: 'from-red-500 to-pink-500',
    },
    {
      id: 'accommodations',
      title: 'Accommodations Request Wizard',
      description: 'Generate ADA-compliant accommodation request letters',
      icon: Briefcase,
      path: '/advocacy/accommodations',
      color: 'from-teal-500 to-green-500',
    },
    {
      id: 'meeting-receipts',
      title: 'Meeting Receipt Logger',
      description: 'Document what was said, decided, and next steps from important meetings',
      icon: UserCheck,
      path: '/advocacy/meeting-receipts',
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 'boundaries',
      title: 'Care Boundary Library',
      description: 'Collection of saved phrases for setting and maintaining boundaries',
      icon: Shield,
      path: '/advocacy/boundaries',
      color: 'from-purple-600 to-pink-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
            <MessageSquare size={48} />
            Self-Advocacy Hub
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Tools to help you advocate for yourself in medical, insurance, and daily life situations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advocacyFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.id}
                to={feature.path}
                className="group bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all hover:transform hover:scale-105"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {feature.description}
                </p>
                <span className="text-purple-400 text-sm group-hover:translate-x-1 transition-transform inline-block">
                  Open →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SelfAdvocacyHub;
