/**
 * HEALTH AI ADVISOR
 * AI-powered medical insights and health trend analysis
 *
 * Integrates OpenAI with:
 * - Lab Results & Trends
 * - Medication Management
 * - Symptom Tracking
 * - Vitals Monitoring
 */

import { openAIExtended } from './openai-extended';

// ============================================================================
// INTERFACES
// ============================================================================

export interface LabTrendAnalysisRequest {
  testName: string;
  results: Array<{
    date: string;
    value: number;
    unit: string;
    referenceRange?: string;
  }>;
}

export interface LabTrendAnalysisResponse {
  summary: string;
  trend: 'improving' | 'stable' | 'concerning';
  insights: string[];
  recommendations: string[];
  nextSteps: string[];
}

export interface MedicationInteractionRequest {
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    purpose?: string;
  }>;
}

export interface MedicationInteractionResponse {
  summary: string;
  potentialInteractions: string[];
  timingOptimization: string[];
  sideEffectManagement: string[];
  questionsForDoctor: string[];
}

export interface SymptomAnalysisRequest {
  symptoms: Array<{
    name: string;
    severity: number; // 1-10
    duration: string;
    frequency: string;
  }>;
  existingConditions?: string[];
  medications?: string[];
}

export interface SymptomAnalysisResponse {
  summary: string;
  patterns: string[];
  triggers: string[];
  management: string[];
  whenToSeekCare: string[];
}

export interface VitalsInsightsRequest {
  vitals: Array<{
    type: string; // 'blood_pressure', 'heart_rate', 'temperature', etc.
    value: string;
    date: string;
    unit: string;
  }>;
}

export interface VitalsInsightsResponse {
  summary: string;
  trends: string[];
  concerns: string[];
  lifestyle: string[];
  monitoring: string[];
}

// ============================================================================
// HEALTH AI ADVISOR SERVICE
// ============================================================================

class HealthAIAdvisor {

  // ============================================================================
  // LAB TREND ANALYSIS
  // ============================================================================

  async analyzeLabTrends(request: LabTrendAnalysisRequest): Promise<LabTrendAnalysisResponse | null> {
    if (!openAIExtended.isConfigured()) {
      console.error('OpenAI not configured');
      return null;
    }

    const latestValue = request.results[request.results.length - 1].value;
    const oldestValue = request.results[0].value;
    const change = ((latestValue - oldestValue) / oldestValue) * 100;

    const prompt = `You are a medical data analyst. Analyze this lab test trend and provide insights.

DISCLAIMER: This is for informational purposes only. Always consult with healthcare providers for medical advice.

LAB TEST: ${request.testName}

RESULTS OVER TIME:
${request.results.map((r, i) => `${i + 1}. ${r.date}: ${r.value} ${r.unit}${r.referenceRange ? ` (Reference: ${r.referenceRange})` : ''}`).join('\n')}

Change: ${change > 0 ? '+' : ''}${change.toFixed(1)}% from first to latest reading

Provide:
1. Summary of the trend (is it improving, stable, or concerning?)
2. Key insights about what this trend might indicate
3. Lifestyle recommendations that could help
4. Questions to ask the doctor
5. What to monitor going forward

Be informative but emphasize the importance of professional medical guidance.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('openai_api_key')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1200,
          temperature: 0.6
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API error');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      const lines = content.split('\n').filter((l: string) => l.trim());

      // Determine trend
      let trend: 'improving' | 'stable' | 'concerning' = 'stable';
      if (content.toLowerCase().includes('improving') || content.toLowerCase().includes('better')) {
        trend = 'improving';
      } else if (content.toLowerCase().includes('concerning') || content.toLowerCase().includes('worrying')) {
        trend = 'concerning';
      }

      return {
        summary: lines.slice(0, 3).join(' '),
        trend,
        insights: lines.filter((l: string) => l.includes('•') || l.includes('-')).slice(0, 4),
        recommendations: lines.filter((l: string) => l.toLowerCase().includes('recommend') || l.toLowerCase().includes('should')).slice(0, 4),
        nextSteps: lines.filter((l: string) => l.toLowerCase().includes('monitor') || l.toLowerCase().includes('track')).slice(0, 3)
      };

    } catch (error) {
      console.error('Lab trend analysis error:', error);
      return null;
    }
  }

  // ============================================================================
  // MEDICATION INTERACTION CHECK
  // ============================================================================

  async checkMedicationInteractions(request: MedicationInteractionRequest): Promise<MedicationInteractionResponse | null> {
    if (!openAIExtended.isConfigured()) {
      console.error('OpenAI not configured');
      return null;
    }

    const prompt = `You are a pharmaceutical specialist. Review this medication regimen for optimization opportunities.

DISCLAIMER: This is educational only. Always consult pharmacists and doctors before making medication changes.

CURRENT MEDICATIONS:
${request.medications.map(m => `- ${m.name}: ${m.dosage}, ${m.frequency}${m.purpose ? ` (for ${m.purpose})` : ''}`).join('\n')}

Provide:
1. Summary of the medication profile
2. Potential interaction concerns to discuss with doctor/pharmacist
3. Timing optimization (best times to take each medication)
4. Side effect management strategies
5. Important questions to ask the prescriber

Be thorough but emphasize the critical importance of professional pharmaceutical guidance.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('openai_api_key')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1200,
          temperature: 0.5
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API error');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      const lines = content.split('\n').filter((l: string) => l.trim());

      return {
        summary: lines.slice(0, 2).join(' '),
        potentialInteractions: lines.filter((l: string) => l.toLowerCase().includes('interaction') || l.toLowerCase().includes('combine')).slice(0, 3),
        timingOptimization: lines.filter((l: string) => l.toLowerCase().includes('timing') || l.toLowerCase().includes('time')).slice(0, 4),
        sideEffectManagement: lines.filter((l: string) => l.toLowerCase().includes('side effect') || l.toLowerCase().includes('manage')).slice(0, 3),
        questionsForDoctor: lines.filter((l: string) => l.includes('?')).slice(0, 5)
      };

    } catch (error) {
      console.error('Medication interaction check error:', error);
      return null;
    }
  }

  // ============================================================================
  // SYMPTOM PATTERN ANALYSIS
  // ============================================================================

  async analyzeSymptomPatterns(request: SymptomAnalysisRequest): Promise<SymptomAnalysisResponse | null> {
    if (!openAIExtended.isConfigured()) {
      console.error('OpenAI not configured');
      return null;
    }

    const prompt = `You are a clinical pattern analyst. Help identify patterns and triggers in these symptoms.

DISCLAIMER: This is for tracking purposes only. Seek immediate medical attention for severe symptoms.

SYMPTOMS:
${request.symptoms.map(s => `- ${s.name}: Severity ${s.severity}/10, Duration: ${s.duration}, Frequency: ${s.frequency}`).join('\n')}

${request.existingConditions ? `Known Conditions: ${request.existingConditions.join(', ')}` : ''}
${request.medications ? `Current Medications: ${request.medications.join(', ')}` : ''}

Provide:
1. Overall symptom profile summary
2. Patterns you notice in the symptoms
3. Possible triggers to investigate
4. Self-management strategies to try
5. When to seek immediate medical care

Be supportive and focus on empowering the patient with tracking insights.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('openai_api_key')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1200,
          temperature: 0.6
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API error');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      const lines = content.split('\n').filter((l: string) => l.trim());

      return {
        summary: lines.slice(0, 3).join(' '),
        patterns: lines.filter((l: string) => l.toLowerCase().includes('pattern') || l.toLowerCase().includes('notice')).slice(0, 3),
        triggers: lines.filter((l: string) => l.toLowerCase().includes('trigger') || l.toLowerCase().includes('cause')).slice(0, 4),
        management: lines.filter((l: string) => l.toLowerCase().includes('manage') || l.toLowerCase().includes('try')).slice(0, 5),
        whenToSeekCare: lines.filter((l: string) => l.toLowerCase().includes('seek') || l.toLowerCase().includes('emergency')).slice(0, 3)
      };

    } catch (error) {
      console.error('Symptom analysis error:', error);
      return null;
    }
  }

  // ============================================================================
  // VITALS INSIGHTS
  // ============================================================================

  async getVitalsInsights(request: VitalsInsightsRequest): Promise<VitalsInsightsResponse | null> {
    if (!openAIExtended.isConfigured()) {
      console.error('OpenAI not configured');
      return null;
    }

    const prompt = `You are a vitals monitoring specialist. Analyze these vital signs and provide actionable insights.

DISCLAIMER: This is for informational tracking only. Contact healthcare provider for medical concerns.

VITAL SIGNS:
${request.vitals.map(v => `- ${v.type}: ${v.value} ${v.unit} (${v.date})`).join('\n')}

Provide:
1. Overall vitals summary
2. Trends to be aware of
3. Potential concerns to discuss with doctor
4. Lifestyle modifications that could help
5. Monitoring recommendations

Focus on practical, actionable guidance while emphasizing professional medical oversight.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('openai_api_key')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          temperature: 0.6
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API error');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      const lines = content.split('\n').filter((l: string) => l.trim());

      return {
        summary: lines.slice(0, 2).join(' '),
        trends: lines.filter((l: string) => l.toLowerCase().includes('trend')).slice(0, 3),
        concerns: lines.filter((l: string) => l.toLowerCase().includes('concern') || l.toLowerCase().includes('elevated')).slice(0, 3),
        lifestyle: lines.filter((l: string) => l.toLowerCase().includes('lifestyle') || l.toLowerCase().includes('diet') || l.toLowerCase().includes('exercise')).slice(0, 4),
        monitoring: lines.filter((l: string) => l.toLowerCase().includes('monitor') || l.toLowerCase().includes('track')).slice(0, 3)
      };

    } catch (error) {
      console.error('Vitals insights error:', error);
      return null;
    }
  }

  // ============================================================================
  // QUICK HEALTH INSIGHT
  // ============================================================================

  /**
   * Get a quick AI health insight
   */
  async getQuickHealthInsight(question: string, context?: string): Promise<string | null> {
    if (!openAIExtended.isConfigured()) {
      console.error('OpenAI not configured');
      return null;
    }

    const prompt = `MEDICAL DISCLAIMER: This is educational information only. Always consult qualified healthcare professionals for medical advice, diagnosis, or treatment.

Question: ${question}
${context ? `Context: ${context}` : ''}

Provide a brief, helpful response in 100 words or less. Emphasize consulting healthcare providers.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('openai_api_key')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 200,
          temperature: 0.6
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API error');
      }

      const data = await response.json();
      return data.choices[0].message.content;

    } catch (error) {
      console.error('Quick health insight error:', error);
      return null;
    }
  }

  // ============================================================================
  // IMAGE ANALYSIS FOR MEDICAL TRACKING
  // ============================================================================

  /**
   * Analyze medical images (rashes, wounds, pills, etc.) using Vision API
   */
  async analyzeMedicalImage(imageUrl: string, purpose: string): Promise<string | null> {
    if (!openAIExtended.isConfigured()) {
      console.error('OpenAI not configured');
      return null;
    }

    const result = await openAIExtended.analyzeImage({
      imageUrl,
      prompt: `MEDICAL DISCLAIMER: This is for tracking/documentation purposes only. Never rely on AI for medical diagnosis.

Analyze this image for: ${purpose}

Describe what you see objectively. Note colors, size, characteristics. Suggest what to tell the healthcare provider.`,
      detail: 'high',
      maxTokens: 500
    });

    return result?.description || null;
  }

  // ============================================================================
  // VOICE NOTE TRANSCRIPTION FOR SYMPTOMS
  // ============================================================================

  /**
   * Transcribe voice notes about symptoms using Whisper
   */
  async transcribeSymptomNote(audioBlob: Blob): Promise<string | null> {
    if (!openAIExtended.isConfigured()) {
      console.error('OpenAI not configured');
      return null;
    }

    const result = await openAIExtended.transcribeAudio({
      audioFile: audioBlob,
      prompt: 'This is a voice note about health symptoms or medical observations.',
      responseFormat: 'text'
    });

    return result?.text || null;
  }

  // ============================================================================
  // HEALTH REPORT GENERATION
  // ============================================================================

  /**
   * Generate a comprehensive health summary report
   */
  async generateHealthReport(data: {
    vitals?: any[];
    medications?: any[];
    symptoms?: any[];
    labResults?: any[];
    timeRange?: string;
  }): Promise<string | null> {
    if (!openAIExtended.isConfigured()) {
      console.error('OpenAI not configured');
      return null;
    }

    const prompt = `Generate a comprehensive health summary report for sharing with healthcare providers.

TIME RANGE: ${data.timeRange || 'Last 30 days'}

${data.vitals ? `VITALS: ${data.vitals.length} readings recorded` : ''}
${data.medications ? `MEDICATIONS: ${data.medications.length} medications tracked` : ''}
${data.symptoms ? `SYMPTOMS: ${data.symptoms.length} symptoms logged` : ''}
${data.labResults ? `LAB RESULTS: ${data.labResults.length} tests` : ''}

Create a clear, concise summary in bullet points that a healthcare provider would find useful. Include trends, concerns, and questions to discuss.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('openai_api_key')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1500,
          temperature: 0.5
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API error');
      }

      const data = await response.json();
      return data.choices[0].message.content;

    } catch (error) {
      console.error('Health report generation error:', error);
      return null;
    }
  }
}

export const healthAIAdvisor = new HealthAIAdvisor();
