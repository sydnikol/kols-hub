/**
 * Language Learning Hub
 * =====================
 * Comprehensive language learning center with embedded resources
 * All tools work directly in the app
 */

import React, { useState, useEffect } from 'react';
import {
  LANGUAGES,
  LANGUAGE_RESOURCES,
  getResourcesByLanguage,
  getResourcesByCategory,
  getLanguageStats,
  Language,
  LanguageResource,
  ResourceCategory
} from '../../data/language-learning-database';

// ============================================================================
// TYPES
// ============================================================================

interface LanguageLearningHubProps {
  className?: string;
  onActivityLog?: (activity: LearningActivity) => void;
}

interface LearningActivity {
  type: 'resource_opened' | 'language_selected' | 'lesson_completed';
  resourceId?: string;
  languageId?: string;
  timestamp: Date;
  duration?: number;
}

type ViewMode = 'languages' | 'resources' | 'embedded' | 'flashcards' | 'practice';

// ============================================================================
// FLASHCARD SYSTEM
// ============================================================================

interface Flashcard {
  id: string;
  front: string;
  back: string;
  language: string;
  category: string;
  difficulty: number;
  lastReviewed?: Date;
  correctCount: number;
  incorrectCount: number;
}

const SAMPLE_FLASHCARDS: Flashcard[] = [
  // Japanese
  { id: 'jp1', front: 'こんにちは', back: 'Hello (Konnichiwa)', language: 'japanese', category: 'greetings', difficulty: 1, correctCount: 0, incorrectCount: 0 },
  { id: 'jp2', front: 'ありがとう', back: 'Thank you (Arigatou)', language: 'japanese', category: 'greetings', difficulty: 1, correctCount: 0, incorrectCount: 0 },
  { id: 'jp3', front: 'さようなら', back: 'Goodbye (Sayounara)', language: 'japanese', category: 'greetings', difficulty: 1, correctCount: 0, incorrectCount: 0 },
  { id: 'jp4', front: '水', back: 'Water (Mizu)', language: 'japanese', category: 'nouns', difficulty: 1, correctCount: 0, incorrectCount: 0 },
  { id: 'jp5', front: '食べる', back: 'To eat (Taberu)', language: 'japanese', category: 'verbs', difficulty: 2, correctCount: 0, incorrectCount: 0 },
  // Korean
  { id: 'kr1', front: '안녕하세요', back: 'Hello (Annyeonghaseyo)', language: 'korean', category: 'greetings', difficulty: 1, correctCount: 0, incorrectCount: 0 },
  { id: 'kr2', front: '감사합니다', back: 'Thank you (Kamsahamnida)', language: 'korean', category: 'greetings', difficulty: 1, correctCount: 0, incorrectCount: 0 },
  { id: 'kr3', front: '사랑해요', back: 'I love you (Saranghaeyo)', language: 'korean', category: 'phrases', difficulty: 1, correctCount: 0, incorrectCount: 0 },
  // Spanish
  { id: 'sp1', front: 'Hola', back: 'Hello', language: 'spanish', category: 'greetings', difficulty: 1, correctCount: 0, incorrectCount: 0 },
  { id: 'sp2', front: 'Gracias', back: 'Thank you', language: 'spanish', category: 'greetings', difficulty: 1, correctCount: 0, incorrectCount: 0 },
  { id: 'sp3', front: '¿Cómo estás?', back: 'How are you?', language: 'spanish', category: 'phrases', difficulty: 1, correctCount: 0, incorrectCount: 0 },
  // German
  { id: 'de1', front: 'Guten Tag', back: 'Good day/Hello', language: 'german', category: 'greetings', difficulty: 1, correctCount: 0, incorrectCount: 0 },
  { id: 'de2', front: 'Danke', back: 'Thank you', language: 'german', category: 'greetings', difficulty: 1, correctCount: 0, incorrectCount: 0 },
  { id: 'de3', front: 'Ich liebe dich', back: 'I love you', language: 'german', category: 'phrases', difficulty: 1, correctCount: 0, incorrectCount: 0 },
  // French
  { id: 'fr1', front: 'Bonjour', back: 'Hello/Good day', language: 'french', category: 'greetings', difficulty: 1, correctCount: 0, incorrectCount: 0 },
  { id: 'fr2', front: 'Merci', back: 'Thank you', language: 'french', category: 'greetings', difficulty: 1, correctCount: 0, incorrectCount: 0 },
  { id: 'fr3', front: 'Je t\'aime', back: 'I love you', language: 'french', category: 'phrases', difficulty: 1, correctCount: 0, incorrectCount: 0 },
];

// ============================================================================
// FLASHCARD COMPONENT
// ============================================================================

const FlashcardPractice: React.FC<{
  language: string;
  onComplete?: (stats: { correct: number; incorrect: number }) => void;
}> = ({ language, onComplete }) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });

  useEffect(() => {
    const filtered = SAMPLE_FLASHCARDS.filter(c => c.language === language || language === 'all');
    setCards(filtered.sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setStats({ correct: 0, incorrect: 0 });
  }, [language]);

  const currentCard = cards[currentIndex];

  const handleAnswer = (correct: boolean) => {
    setStats(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1)
    }));
    setIsFlipped(false);

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete?.(stats);
    }
  };

  if (cards.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        No flashcards available for this language yet.
      </div>
    );
  }

  if (currentIndex >= cards.length) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-green-400 mb-4">Session Complete!</h3>
        <div className="flex justify-center gap-8 text-lg">
          <div className="text-green-400">✓ Correct: {stats.correct}</div>
          <div className="text-red-400">✗ Incorrect: {stats.incorrect}</div>
        </div>
        <div className="text-gray-400 mt-4">
          Accuracy: {Math.round((stats.correct / cards.length) * 100)}%
        </div>
        <button
          onClick={() => {
            setCurrentIndex(0);
            setStats({ correct: 0, incorrect: 0 });
            setCards(cards.sort(() => Math.random() - 0.5));
          }}
          className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
        >
          Practice Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-4 flex justify-between items-center">
        <span className="text-gray-400">Card {currentIndex + 1} of {cards.length}</span>
        <div className="flex gap-4">
          <span className="text-green-400">✓ {stats.correct}</span>
          <span className="text-red-400">✗ {stats.incorrect}</span>
        </div>
      </div>

      {/* Card */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className={`
          relative h-64 cursor-pointer perspective-1000
          transform-style-preserve-3d transition-transform duration-500
          ${isFlipped ? 'rotate-y-180' : ''}
        `}
      >
        {/* Front */}
        <div className={`
          absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-900
          border-2 border-purple-500/50 flex items-center justify-center p-8
          backface-hidden ${isFlipped ? 'invisible' : ''}
        `}>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-4">{currentCard.front}</div>
            <div className="text-gray-400 text-sm">Click to reveal</div>
          </div>
        </div>

        {/* Back */}
        <div className={`
          absolute inset-0 rounded-2xl bg-gradient-to-br from-green-900 to-teal-900
          border-2 border-green-500/50 flex items-center justify-center p-8
          backface-hidden ${!isFlipped ? 'invisible' : ''}
        `}
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-4">{currentCard.back}</div>
            <div className="text-gray-400 text-sm">{currentCard.category}</div>
          </div>
        </div>
      </div>

      {/* Answer Buttons */}
      {isFlipped && (
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => handleAnswer(false)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium"
          >
            ✗ Incorrect
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
          >
            ✓ Correct
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// RESOURCE CARD
// ============================================================================

const ResourceCard: React.FC<{
  resource: LanguageResource;
  onOpen: (resource: LanguageResource) => void;
  onEmbed: (resource: LanguageResource) => void;
}> = ({ resource, onOpen, onEmbed }) => (
  <div className="bg-gray-800/60 rounded-xl border border-gray-700 hover:border-blue-500/50
                  transition-all p-4 group">
    <div className="flex items-start gap-3 mb-3">
      <span className="text-3xl group-hover:scale-110 transition-transform">{resource.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-blue-200">{resource.name}</h3>
          {resource.pricing === 'free' && (
            <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded">FREE</span>
          )}
          {resource.canEmbed && (
            <span className="text-xs bg-purple-900/50 text-purple-400 px-2 py-0.5 rounded">EMBEDDABLE</span>
          )}
        </div>
        <p className="text-sm text-gray-400 line-clamp-2">{resource.description}</p>
      </div>
    </div>

    {/* Languages */}
    <div className="flex flex-wrap gap-1 mb-3">
      {resource.languages.slice(0, 4).map((lang, idx) => (
        <span key={idx} className="text-xs bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">
          {lang}
        </span>
      ))}
      {resource.languages.length > 4 && (
        <span className="text-xs text-gray-500">+{resource.languages.length - 4} more</span>
      )}
    </div>

    {/* Features */}
    <div className="flex flex-wrap gap-1 mb-3">
      {resource.features.slice(0, 3).map((feature, idx) => (
        <span key={idx} className="text-xs bg-gray-700/50 text-gray-400 px-2 py-0.5 rounded">
          {feature}
        </span>
      ))}
    </div>

    {/* Actions */}
    <div className="flex gap-2">
      {resource.canEmbed && (
        <button
          onClick={() => onEmbed(resource)}
          className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded transition-colors"
        >
          Open in App
        </button>
      )}
      <button
        onClick={() => onOpen(resource)}
        className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded transition-colors"
      >
        Visit Site →
      </button>
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const LanguageLearningHub: React.FC<LanguageLearningHubProps> = ({
  className = '',
  onActivityLog
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('languages');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>('all');
  const [embeddedResource, setEmbeddedResource] = useState<LanguageResource | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const stats = getLanguageStats();

  const categories: { id: ResourceCategory | 'all'; name: string; icon: string }[] = [
    { id: 'all', name: 'All', icon: '📚' },
    { id: 'courses', name: 'Courses', icon: '🎓' },
    { id: 'practice', name: 'Practice', icon: '✏️' },
    { id: 'vocabulary', name: 'Vocabulary', icon: '📝' },
    { id: 'grammar', name: 'Grammar', icon: '📖' },
    { id: 'listening', name: 'Listening', icon: '🎧' },
    { id: 'speaking', name: 'Speaking', icon: '🗣️' },
    { id: 'media', name: 'Media', icon: '📺' },
    { id: 'community', name: 'Community', icon: '👥' }
  ];

  const filteredResources = selectedLanguage
    ? getResourcesByLanguage(selectedLanguage.id)
    : LANGUAGE_RESOURCES;

  const categoryFilteredResources = selectedCategory === 'all'
    ? filteredResources
    : filteredResources.filter(r => r.category === selectedCategory);

  const searchFilteredResources = searchQuery
    ? categoryFilteredResources.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categoryFilteredResources;

  const handleSelectLanguage = (lang: Language) => {
    setSelectedLanguage(lang);
    setViewMode('resources');
    onActivityLog?.({
      type: 'language_selected',
      languageId: lang.id,
      timestamp: new Date()
    });
  };

  const handleOpenResource = (resource: LanguageResource) => {
    window.open(resource.url, '_blank');
    onActivityLog?.({
      type: 'resource_opened',
      resourceId: resource.id,
      timestamp: new Date()
    });
  };

  const handleEmbedResource = (resource: LanguageResource) => {
    setEmbeddedResource(resource);
    setViewMode('embedded');
    onActivityLog?.({
      type: 'resource_opened',
      resourceId: resource.id,
      timestamp: new Date()
    });
  };

  return (
    <div className={`bg-gray-900/60 rounded-2xl border border-blue-500/30 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-blue-200">🌍 Language Learning Hub</h2>
          {selectedLanguage && (
            <p className="text-sm text-gray-400 mt-1">
              {selectedLanguage.icon} Learning {selectedLanguage.name} ({selectedLanguage.nativeName})
            </p>
          )}
        </div>
        <div className="text-sm text-gray-400">
          {stats.totalLanguages} languages • {stats.totalResources} resources
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => { setViewMode('languages'); setSelectedLanguage(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            viewMode === 'languages'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <span>🌐</span>
          <span>Languages</span>
        </button>
        <button
          onClick={() => setViewMode('resources')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            viewMode === 'resources'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <span>📚</span>
          <span>Resources</span>
        </button>
        <button
          onClick={() => setViewMode('flashcards')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            viewMode === 'flashcards'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <span>🃏</span>
          <span>Flashcards</span>
        </button>
        <button
          onClick={() => setViewMode('practice')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            viewMode === 'practice'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <span>✍️</span>
          <span>Practice</span>
        </button>
        {embeddedResource && (
          <button
            onClick={() => setViewMode('embedded')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              viewMode === 'embedded'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span>🖥️</span>
            <span>{embeddedResource.name}</span>
          </button>
        )}
      </div>

      {/* LANGUAGES VIEW */}
      {viewMode === 'languages' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {LANGUAGES.map(lang => (
            <button
              key={lang.id}
              onClick={() => handleSelectLanguage(lang)}
              className="flex flex-col items-center gap-3 p-6 rounded-xl bg-gray-800/60
                         border border-blue-500/20 hover:border-blue-400/50 hover:bg-gray-800
                         transition-all duration-300 hover:scale-105 group"
            >
              <span className="text-5xl group-hover:animate-bounce">{lang.icon}</span>
              <div className="text-center">
                <div className="font-semibold text-blue-200">{lang.name}</div>
                <div className="text-xs text-gray-500">{lang.nativeName}</div>
              </div>
              <div className={`text-xs px-2 py-0.5 rounded ${
                lang.difficulty === 'easy' ? 'bg-green-900/50 text-green-400' :
                lang.difficulty === 'medium' ? 'bg-yellow-900/50 text-yellow-400' :
                lang.difficulty === 'hard' ? 'bg-orange-900/50 text-orange-400' :
                'bg-red-900/50 text-red-400'
              }`}>
                {lang.difficulty}
              </div>
              <div className="text-xs text-gray-500">{lang.speakers} speakers</div>
            </button>
          ))}
        </div>
      )}

      {/* RESOURCES VIEW */}
      {viewMode === 'resources' && (
        <>
          {/* Search */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pl-10
                           text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all text-sm ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600/80 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchFilteredResources.map(resource => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onOpen={handleOpenResource}
                onEmbed={handleEmbedResource}
              />
            ))}
          </div>

          {searchFilteredResources.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              No resources found matching your criteria.
            </div>
          )}
        </>
      )}

      {/* FLASHCARDS VIEW */}
      {viewMode === 'flashcards' && (
        <div>
          {/* Language Selection for Flashcards */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedLanguage(null)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                !selectedLanguage
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              All Languages
            </button>
            {LANGUAGES.filter(l => ['japanese', 'korean', 'spanish', 'german', 'french'].includes(l.id)).map(lang => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedLanguage?.id === lang.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <span>{lang.icon}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>

          <FlashcardPractice
            language={selectedLanguage?.id || 'all'}
            onComplete={(stats) => {
              onActivityLog?.({
                type: 'lesson_completed',
                languageId: selectedLanguage?.id,
                timestamp: new Date()
              });
            }}
          />
        </div>
      )}

      {/* PRACTICE VIEW */}
      {viewMode === 'practice' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Dictation Tool */}
            <button
              onClick={() => window.open('https://dictation.io/', '_blank')}
              className="flex flex-col items-center gap-3 p-6 rounded-xl bg-gray-800/60
                         border border-purple-500/20 hover:border-purple-400/50 transition-all"
            >
              <span className="text-4xl">🎤</span>
              <div className="text-lg font-semibold text-purple-200">Dictation.io</div>
              <div className="text-sm text-gray-400 text-center">Practice writing with voice-to-text</div>
            </button>

            {/* Etymology */}
            <button
              onClick={() => window.open('https://www.etymonline.com/', '_blank')}
              className="flex flex-col items-center gap-3 p-6 rounded-xl bg-gray-800/60
                         border border-green-500/20 hover:border-green-400/50 transition-all"
            >
              <span className="text-4xl">📖</span>
              <div className="text-lg font-semibold text-green-200">Etymology Online</div>
              <div className="text-sm text-gray-400 text-center">Learn word origins and history</div>
            </button>

            {/* Vocabulary Builder */}
            <button
              onClick={() => window.open('https://freerice.com/', '_blank')}
              className="flex flex-col items-center gap-3 p-6 rounded-xl bg-gray-800/60
                         border border-yellow-500/20 hover:border-yellow-400/50 transition-all"
            >
              <span className="text-4xl">🍚</span>
              <div className="text-lg font-semibold text-yellow-200">Free Rice</div>
              <div className="text-sm text-gray-400 text-center">Build vocabulary, donate rice</div>
            </button>

            {/* Verbling */}
            <button
              onClick={() => window.open('https://www.verbling.com/', '_blank')}
              className="flex flex-col items-center gap-3 p-6 rounded-xl bg-gray-800/60
                         border border-blue-500/20 hover:border-blue-400/50 transition-all"
            >
              <span className="text-4xl">👥</span>
              <div className="text-lg font-semibold text-blue-200">Verbling</div>
              <div className="text-sm text-gray-400 text-center">Practice with native tutors</div>
            </button>

            {/* Latin */}
            <button
              onClick={() => window.open('https://henlelatinclass.wordpress.com/nouns/', '_blank')}
              className="flex flex-col items-center gap-3 p-6 rounded-xl bg-gray-800/60
                         border border-amber-500/20 hover:border-amber-400/50 transition-all"
            >
              <span className="text-4xl">🏛️</span>
              <div className="text-lg font-semibold text-amber-200">Henle Latin</div>
              <div className="text-sm text-gray-400 text-center">Classical Latin lessons</div>
            </button>

            {/* LessWrong */}
            <button
              onClick={() => window.open('https://www.lesswrong.com/', '_blank')}
              className="flex flex-col items-center gap-3 p-6 rounded-xl bg-gray-800/60
                         border border-cyan-500/20 hover:border-cyan-400/50 transition-all"
            >
              <span className="text-4xl">🧠</span>
              <div className="text-lg font-semibold text-cyan-200">LessWrong</div>
              <div className="text-sm text-gray-400 text-center">Critical thinking & rationality</div>
            </button>
          </div>
        </div>
      )}

      {/* EMBEDDED VIEW */}
      {viewMode === 'embedded' && embeddedResource && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{embeddedResource.icon}</span>
              <div>
                <h3 className="text-xl font-bold text-blue-200">{embeddedResource.name}</h3>
                <p className="text-sm text-gray-400">{embeddedResource.description}</p>
              </div>
            </div>
            <button
              onClick={() => setEmbeddedResource(null)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              ✕ Close
            </button>
          </div>

          <div className="bg-black rounded-xl overflow-hidden" style={{ height: '70vh' }}>
            <iframe
              src={embeddedResource.embedUrl || embeddedResource.url}
              className="w-full h-full"
              title={embeddedResource.name}
              allow="fullscreen; microphone; camera"
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-700 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
        <span>🌍 Language Learning Hub</span>
        <span>•</span>
        <span>{stats.totalLanguages} Languages</span>
        <span>•</span>
        <span>{stats.freeResources} Free Resources</span>
        <span>•</span>
        <span>Learn Anything</span>
      </div>
    </div>
  );
};

export default LanguageLearningHub;
