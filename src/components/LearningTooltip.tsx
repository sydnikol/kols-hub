import React, { useState } from 'react';
import { Lightbulb, X } from 'lucide-react';

interface LearningTooltipProps {
  skill: string;
  explanation: string;
  example?: string;
  show: boolean;
  onDismiss: () => void;
}

const LearningTooltip: React.FC<LearningTooltipProps> = ({
  skill,
  explanation,
  example,
  show,
  onDismiss
}) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-gradient-to-br from-[#1a0a2e] to-[#2a1a3a] border border-[#9d7bd8] rounded-lg p-4 shadow-xl z-50 animate-slide-up">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#9d7bd8]" />
          <h4 className="font-semibold text-[#9d7bd8]">{skill}</h4>
        </div>
        <button
          onClick={onDismiss}
          className="text-[#8c6bb1] hover:text-[#9d7bd8] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <p className="text-sm text-[#c8b7e5] mb-2">{explanation}</p>
      
      {example && (
        <div className="bg-[#0a0a0f]/50 p-2 rounded text-xs text-[#8c6bb1] italic">
          Example: {example}
        </div>
      )}
      
      <div className="mt-3 text-xs text-[#8c6bb1]">
        ✨ You're building resume skills just by using the app
      </div>
    </div>
  );
};

// Hook for triggering passive learning
export const useLearningTrigger = () => {
  const [tooltip, setTooltip] = useState<{
    skill: string;
    explanation: string;
    example?: string;
    show: boolean;
  }>({
    skill: '',
    explanation: '',
    show: false
  });

  const triggerLearning = (skill: string, explanation: string, example?: string) => {
    // Only show if user hasn't dismissed this skill today
    const dismissedToday = localStorage.getItem(`learning_dismissed_${skill}_${new Date().toDateString()}`);
    
    if (!dismissedToday) {
      setTooltip({
        skill,
        explanation,
        example,
        show: true
      });

      // Auto-dismiss after 10 seconds
      setTimeout(() => {
        setTooltip(prev => ({ ...prev, show: false }));
      }, 10000);
    }
  };

  const dismissTooltip = () => {
    // Mark as dismissed for today
    localStorage.setItem(
      `learning_dismissed_${tooltip.skill}_${new Date().toDateString()}`,
      'true'
    );
    setTooltip(prev => ({ ...prev, show: false }));
  };

  return {
    tooltip,
    triggerLearning,
    dismissTooltip,
    LearningTooltipComponent: () => (
      <LearningTooltip
        {...tooltip}
        onDismiss={dismissTooltip}
      />
    )
  };
};

// Learning triggers for different app actions
export const learningTriggers = {
  photoUpload: {
    skill: "Composition & Framing",
    explanation: "Great photo! Notice how the subject is positioned using the rule of thirds—imagine a 3×3 grid, and place key elements along those lines or intersections.",
    example: "In portrait photography, eyes often sit on the top horizontal line for balanced composition."
  },
  
  themeCreation: {
    skill: "Color Theory & Accessibility",
    explanation: "Creating themes teaches color psychology and contrast ratios. Dark themes reduce eye strain and save battery on OLED screens.",
    example: "Purple (like #9d7bd8) represents creativity and spirituality. High contrast ensures readability."
  },
  
  medicationTracking: {
    skill: "Pharmacology Basics & Self-Care",
    explanation: "Tracking medications teaches you about drug interactions, half-lives, and the importance of consistent timing.",
    example: "Some meds work best on empty stomach, others with food. You're learning pharmaceutical timing patterns."
  },
  
  journalEntry: {
    skill: "Narrative Structure & Self-Reflection",
    explanation: "Every journal entry is practice in storytelling. You're learning to structure thoughts, build narrative arcs, and develop your voice.",
    example: "Notice how you naturally use beginning-middle-end structure when describing your day."
  },
  
  outfitPlanning: {
    skill: "Fashion Design & Visual Composition",
    explanation: "Outfit planning teaches color coordination, texture mixing, and silhouette balance—core fashion design principles.",
    example: "Monochromatic outfits (one color in different shades) create elongated, cohesive looks."
  },
  
  animeTracking: {
    skill: "Japanese Language Exposure",
    explanation: "Watching anime with subtitles is passive language learning. Your brain absorbs pronunciation, common phrases, and cultural context.",
    example: "Notice recurring phrases like 'itadakimasu' (before eating) or 'ganbatte' (do your best)."
  },
  
  dramaTracking: {
    skill: "Korean Language & Cultural Understanding",
    explanation: "K-dramas teach honorific systems (banmal vs jondaemal), relationship dynamics, and cultural values through immersion.",
    example: "Pay attention to how characters address each other differently based on age and relationship."
  },
  
  ancestorResearch: {
    skill: "Genealogical Research Methods",
    explanation: "Documenting family history teaches research skills: source evaluation, timeline building, and historical context analysis.",
    example: "Cross-referencing multiple sources (documents, photos, stories) builds accurate family trees."
  },
  
  ritualPlanning: {
    skill: "Ritual Design & Spiritual Practice",
    explanation: "Creating rituals teaches structure, symbolism, and intentionality—applicable to ceremony design in many contexts.",
    example: "Elements like candles (fire), water, earth (salt), and air (incense) represent different energies."
  },
  
  taskScheduling: {
    skill: "Project Management & Time Allocation",
    explanation: "Scheduling tasks teaches resource management, prioritization, and realistic time estimation—core PM skills.",
    example: "Breaking big projects into small tasks (work breakdown structure) makes them manageable."
  },
  
  dataExport: {
    skill: "Data Structures & File Formats",
    explanation: "Exporting data teaches you about JSON, CSV, and data interoperability—valuable tech skills.",
    example: "JSON uses key-value pairs: {'name': 'Kol', 'skill': 'learning'}. It's how apps talk to each other."
  },
  
  automationSetup: {
    skill: "Automation Logic & Systems Thinking",
    explanation: "Creating automations teaches if-then logic, trigger-action patterns, and system design—foundation of programming.",
    example: "'If medication time, then send reminder' is automation logic. Same principle powers all smart tech."
  },
  
  mediaReview: {
    skill: "Critical Analysis & Media Literacy",
    explanation: "Reviewing shows/movies builds critical thinking: analyzing themes, representation, narrative structure, cinematography.",
    example: "Ask: What's the theme? How's diversity portrayed? What camera angles create mood?"
  },
  
  sodiumTracking: {
    skill: "Nutrition Science & Health Management",
    explanation: "Tracking sodium teaches you about fluid balance, blood pressure, and how nutrients affect the body.",
    example: "4000mg daily = 1 teaspoon salt. Processed foods often hide huge sodium amounts."
  },
  
  moodTracking: {
    skill: "Emotional Intelligence & Pattern Recognition",
    explanation: "Mood tracking builds self-awareness: recognizing triggers, patterns, and the body's signals.",
    example: "Notice if low moods cluster around certain times, events, or hormonal cycles."
  },
  
  communityOrganizing: {
    skill: "Activism & Group Facilitation",
    explanation: "Planning community events teaches logistics, coalition building, and inclusive facilitation—core organizing skills.",
    example: "Successful events need: clear goals, accessible venue, promotion, follow-up action plan."
  },
  
  artCreation: {
    skill: "Visual Arts & Creative Process",
    explanation: "Every piece you create teaches composition, color, and the iterative creative process. Art is practice.",
    example: "Artists create 100 'bad' pieces to get 1 'good' one. Volume builds skill faster than perfectionism."
  },
  
  writingPractice: {
    skill: "Creative Writing & Voice Development",
    explanation: "Writing anything—poetry, prose, notes—develops your unique voice and storytelling skills.",
    example: "First drafts are for getting ideas out. Second drafts are where the real writing happens."
  },
  
  financialTracking: {
    skill: "Personal Finance & Budgeting",
    explanation: "Tracking expenses teaches budgeting, cash flow, and financial awareness—foundation of financial literacy.",
    example: "The 50/30/20 rule: 50% needs, 30% wants, 20% savings/debt. Adjust to your reality."
  },
  
  productCreation: {
    skill: "Entrepreneurship & Product Design",
    explanation: "Creating templates, guides, or resources teaches product development, pricing, and value communication.",
    example: "Digital products scale infinitely: create once, sell forever. Low overhead, high potential."
  }
};

export default LearningTooltip;
