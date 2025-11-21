import { useState, useEffect } from 'react';
import { ancestryService, Ancestor } from '../services/ancestryService';

interface HeritageBreakdown {
  region: string;
  percentage: number;
  traditions: string[];
}

interface FamilyHealthData {
  commonTraits: string[];
  healthPredispositions: string[];
  averageLifespan: number;
  longevityPatterns: Array<{
    name: string;
    lifespan: number;
  }>;
}

interface AncestryDataHook {
  ancestors: Ancestor[];
  loading: boolean;
  heritageData: HeritageBreakdown[];
  familyHealth: FamilyHealthData;
  refreshData: () => Promise<void>;
  addAncestor: (ancestor: Omit<Ancestor, 'id'>) => Promise<void>;
  removeAncestor: (id: string) => Promise<void>;
  updateAncestor: (id: string, updates: Partial<Ancestor>) => Promise<void>;
}

export function useAncestryData(): AncestryDataHook {
  const [ancestors, setAncestors] = useState<Ancestor[]>([]);
  const [loading, setLoading] = useState(true);
  const [heritageData, setHeritageData] = useState<HeritageBreakdown[]>([]);
  const [familyHealth, setFamilyHealth] = useState<FamilyHealthData>({
    commonTraits: [],
    healthPredispositions: [],
    averageLifespan: 0,
    longevityPatterns: []
  });

  const loadAncestors = async () => {
    setLoading(true);
    try {
      const data = await ancestryService.getAncestors();
      setAncestors(data);

      // Calculate heritage breakdown
      const heritage = calculateHeritageBreakdown(data);
      setHeritageData(heritage);

      // Calculate family health data
      const health = calculateFamilyHealth(data);
      setFamilyHealth(health);
    } catch (error) {
      console.error('Failed to load ancestry data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAncestors();
  }, []);

  const calculateHeritageBreakdown = (ancestors: Ancestor[]): HeritageBreakdown[] => {
    const cultureCounts = new Map<string, number>();
    const cultureTraditions = new Map<string, Set<string>>();

    ancestors.forEach(ancestor => {
      if (ancestor.culturalBackground) {
        ancestor.culturalBackground.forEach(culture => {
          cultureCounts.set(culture, (cultureCounts.get(culture) || 0) + 1);

          if (!cultureTraditions.has(culture)) {
            cultureTraditions.set(culture, new Set());
          }

          // Add some example traditions based on culture
          const traditions = getTraditionsForCulture(culture);
          traditions.forEach(t => cultureTraditions.get(culture)!.add(t));
        });
      }
    });

    const total = Array.from(cultureCounts.values()).reduce((sum, count) => sum + count, 0);

    return Array.from(cultureCounts.entries()).map(([culture, count]) => ({
      region: culture,
      percentage: Math.round((count / total) * 100),
      traditions: Array.from(cultureTraditions.get(culture) || [])
    }));
  };

  const getTraditionsForCulture = (culture: string): string[] => {
    const traditions: { [key: string]: string[] } = {
      'Irish': ['Storytelling', 'Music & Dance', 'St. Patrick\'s Day'],
      'Italian': ['Family Meals', 'Religious Festivals', 'Sunday Gatherings'],
      'African': ['Oral History', 'Community Celebrations', 'Ancestral Honoring'],
      'Asian': ['Lunar New Year', 'Ancestor Veneration', 'Tea Ceremonies'],
      'German': ['Oktoberfest', 'Christmas Markets', 'Folk Music'],
      'Polish': ['Easter Traditions', 'Name Days', 'Folk Dancing'],
      'Jewish': ['Sabbath', 'High Holidays', 'Passover Seders'],
      'Mexican': ['Day of the Dead', 'Quinceañera', 'Family Gatherings'],
      'Native American': ['Powwows', 'Spiritual Ceremonies', 'Storytelling'],
      'Scottish': ['Highland Games', 'Burns Night', 'Clan Gatherings'],
    };

    return traditions[culture] || ['Family Gatherings', 'Cultural Celebrations', 'Traditional Foods'];
  };

  const calculateFamilyHealth = (ancestors: Ancestor[]): FamilyHealthData => {
    const lifespans: number[] = [];
    const longevityPatterns: Array<{ name: string; lifespan: number }> = [];

    ancestors.forEach(ancestor => {
      if (ancestor.birthYear && ancestor.deathYear) {
        const lifespan = ancestor.deathYear - ancestor.birthYear;
        lifespans.push(lifespan);
        longevityPatterns.push({
          name: ancestor.name,
          lifespan
        });
      }
    });

    const averageLifespan = lifespans.length > 0
      ? Math.round(lifespans.reduce((sum, age) => sum + age, 0) / lifespans.length)
      : 0;

    // Identify common traits based on data
    const commonTraits: string[] = [];
    if (averageLifespan > 75) {
      commonTraits.push('Longevity patterns detected');
    }
    if (averageLifespan > 70) {
      commonTraits.push('Strong cardiovascular health');
    }

    // Add occupation-based traits
    const occupations = ancestors.map(a => a.occupation).filter(Boolean);
    if (occupations.some(o => o?.toLowerCase().includes('farmer'))) {
      commonTraits.push('Connection to nature and physical work');
    }

    const healthPredispositions: string[] = [
      'Regular health monitoring recommended',
      'Maintain healthy lifestyle habits',
      'Consider family medical history in preventive care'
    ];

    return {
      commonTraits,
      healthPredispositions,
      averageLifespan,
      longevityPatterns: longevityPatterns.sort((a, b) => b.lifespan - a.lifespan)
    };
  };

  const addAncestor = async (ancestor: Omit<Ancestor, 'id'>) => {
    await ancestryService.addAncestor(ancestor);
    await loadAncestors();
  };

  const removeAncestor = async (id: string) => {
    await ancestryService.deleteAncestor(id);
    await loadAncestors();
  };

  const updateAncestor = async (id: string, updates: Partial<Ancestor>) => {
    await ancestryService.updateAncestor(id, updates);
    await loadAncestors();
  };

  return {
    ancestors,
    loading,
    heritageData,
    familyHealth,
    refreshData: loadAncestors,
    addAncestor,
    removeAncestor,
    updateAncestor
  };
}

// Hook to get ancestor wisdom based on current context
export function useAncestorWisdom(context?: string) {
  const { ancestors } = useAncestryData();

  const getWisdom = (topic?: string): string => {
    const wisdomByTopic: { [key: string]: string[] } = {
      'crisis': [
        'Remember, you come from a line of survivors. This strength flows in your veins.',
        'Your ancestors faced great challenges. Their resilience lives on in you.',
        'In times of hardship, lean on family. We have always been stronger together.'
      ],
      'decision': [
        'Take time to think, but trust your instincts. They carry ancestral wisdom.',
        'Consider how this choice honors those who came before and those who will follow.',
        'Seek counsel from elders, but make your own path.'
      ],
      'health': [
        'Your body is a gift from your ancestors. Care for it well.',
        'Listen to what your body tells you. Our family has always valued wellness.',
        'Remember the healing practices passed down through generations.'
      ],
      'family': [
        'Family is your greatest treasure. Nurture these bonds.',
        'The love we share transcends time and distance.',
        'Keep our stories alive. They connect past to future.'
      ],
      'work': [
        'Honest work brings dignity and purpose.',
        'Find meaning in what you do, as we always have.',
        'Hard work and integrity will carry you through life\'s storms.'
      ]
    };

    const category = topic || 'general';
    const wisdom = wisdomByTopic[category] || [
      'Be kind, even when it\'s difficult. Kindness echoes through generations.',
      'Never forget where you came from. Your roots give you strength.',
      'Face challenges with courage. You carry the strength of your ancestors.'
    ];

    return wisdom[Math.floor(Math.random() * wisdom.length)];
  };

  return { getWisdom, ancestors };
}

// Hook to integrate family health history with current health tracking
export function useFamilyHealth() {
  const { familyHealth } = useAncestryData();

  const getHealthInsights = () => {
    return {
      ...familyHealth,
      recommendations: [
        `Based on family history, maintain regular health checkups`,
        `Average family lifespan: ${familyHealth.averageLifespan} years`,
        `Consider genetic screening for inherited conditions`,
        `Focus on preventive care based on family patterns`
      ]
    };
  };

  const linkToHealthDashboard = () => {
    // This would integrate with the health service
    return {
      familyHistory: familyHealth.healthPredispositions,
      geneticMarkers: familyHealth.commonTraits,
      longevityGoal: familyHealth.averageLifespan
    };
  };

  return {
    healthInsights: getHealthInsights(),
    linkToHealthDashboard
  };
}
