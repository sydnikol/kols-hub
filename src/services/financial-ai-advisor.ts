/**
 * FINANCIAL AI ADVISOR
 * AI-powered insights and recommendations for financial tools
 *
 * Integrates OpenAI with:
 * - Debt Payoff Calculator
 * - Net Worth Tracker
 * - Income Tracker
 * - Financial Assistance Tracker
 */

import { openAIExtended } from './openai-extended';

// ============================================================================
// INTERFACES
// ============================================================================

export interface DebtAdviceRequest {
  debts: Array<{
    name: string;
    balance: number;
    interestRate: number;
    minimumPayment: number;
    type: string;
  }>;
  monthlyBudget: number;
  strategy?: 'avalanche' | 'snowball';
}

export interface DebtAdviceResponse {
  summary: string;
  recommendations: string[];
  payoffStrategy: string;
  estimatedTimeToFree: string;
  potentialSavings: string;
  actionSteps: string[];
}

export interface NetWorthInsightsRequest {
  assets: Array<{
    name: string;
    category: string;
    value: number;
  }>;
  liabilities: Array<{
    name: string;
    type: string;
    amount: number;
  }>;
  historicalData?: Array<{
    date: string;
    netWorth: number;
  }>;
}

export interface NetWorthInsightsResponse {
  summary: string;
  trends: string[];
  recommendations: string[];
  riskAssessment: string;
  growthOpportunities: string[];
}

export interface IncomeOptimizationRequest {
  sources: Array<{
    name: string;
    category: string;
    amount: number;
    frequency: string;
    isRecurring: boolean;
  }>;
  skills?: string[];
  interests?: string[];
  timeAvailable?: number;
}

export interface IncomeOptimizationResponse {
  summary: string;
  newOpportunities: string[];
  optimizationTips: string[];
  passiveIncomeIdeas: string[];
  skillMonetization: string[];
  estimatedPotential: string;
}

export interface BenefitsGuidanceRequest {
  programs: Array<{
    name: string;
    type: string;
    status: string;
    monthlyAmount?: number;
  }>;
  userSituation?: {
    disability?: boolean;
    chronicIllness?: boolean;
    housing?: string;
    income?: number;
  };
}

export interface BenefitsGuidanceResponse {
  summary: string;
  eligiblePrograms: string[];
  applicationTips: string[];
  maximizationStrategies: string[];
  documentationNeeded: string[];
  resources: string[];
}

// ============================================================================
// FINANCIAL AI ADVISOR SERVICE
// ============================================================================

class FinancialAIAdvisor {

  // ============================================================================
  // DEBT PAYOFF ADVICE
  // ============================================================================

  async getDebtPayoffAdvice(request: DebtAdviceRequest): Promise<DebtAdviceResponse | null> {
    if (!openAIExtended.isConfigured()) {
      console.error('OpenAI not configured');
      return null;
    }

    const totalDebt = request.debts.reduce((sum, d) => sum + d.balance, 0);
    const avgInterestRate = request.debts.reduce((sum, d) => sum + d.interestRate, 0) / request.debts.length;

    const prompt = `You are a financial advisor specializing in debt management. Analyze this debt situation and provide actionable advice.

DEBT PORTFOLIO:
${request.debts.map(d => `- ${d.name}: $${d.balance} at ${d.interestRate}% APR (Min payment: $${d.minimumPayment})`).join('\n')}

Total Debt: $${totalDebt}
Monthly Budget for Debt: $${request.monthlyBudget}
Current Strategy: ${request.strategy || 'Not specified'}

Provide:
1. A brief summary of the debt situation
2. Top 3-5 specific recommendations for paying off debt faster
3. Which payoff strategy (avalanche vs snowball) is best and why
4. Estimated time to debt freedom with current budget
5. Potential interest savings from optimized strategy
6. Step-by-step action plan

Be encouraging, specific, and realistic. Focus on practical actions.`;

    try {
      // Use GPT-4o for financial analysis
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
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API error');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      // Parse the response
      const lines = content.split('\n').filter((l: string) => l.trim());

      return {
        summary: lines.slice(0, 3).join(' '),
        recommendations: lines.filter((l: string) => l.includes('•') || l.includes('-')).slice(0, 5),
        payoffStrategy: request.strategy || 'avalanche',
        estimatedTimeToFree: this.estimatePayoffTime(request.debts, request.monthlyBudget),
        potentialSavings: this.calculatePotentialSavings(request.debts, request.monthlyBudget),
        actionSteps: lines.filter((l: string) => l.match(/^\d+\./)).slice(0, 6)
      };

    } catch (error) {
      console.error('Debt advice error:', error);
      return null;
    }
  }

  // ============================================================================
  // NET WORTH INSIGHTS
  // ============================================================================

  async getNetWorthInsights(request: NetWorthInsightsRequest): Promise<NetWorthInsightsResponse | null> {
    if (!openAIExtended.isConfigured()) {
      console.error('OpenAI not configured');
      return null;
    }

    const totalAssets = request.assets.reduce((sum, a) => sum + a.value, 0);
    const totalLiabilities = request.liabilities.reduce((sum, l) => sum + l.amount, 0);
    const netWorth = totalAssets - totalLiabilities;

    const prompt = `You are a wealth management advisor. Analyze this financial profile and provide strategic insights.

ASSETS:
${request.assets.map(a => `- ${a.name} (${a.category}): $${a.value}`).join('\n')}
Total Assets: $${totalAssets}

LIABILITIES:
${request.liabilities.map(l => `- ${l.name} (${l.type}): $${l.amount}`).join('\n')}
Total Liabilities: $${totalLiabilities}

CURRENT NET WORTH: $${netWorth}

${request.historicalData ? `Historical Trend: ${request.historicalData.length} data points available` : 'No historical data'}

Provide:
1. Overall financial health summary
2. Key trends and patterns
3. Top 5 recommendations for growing net worth
4. Risk assessment and diversification advice
5. Growth opportunities to consider

Be strategic, specific, and focused on long-term wealth building.`;

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
          temperature: 0.7
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
        trends: lines.filter((l: string) => l.toLowerCase().includes('trend')).slice(0, 3),
        recommendations: lines.filter((l: string) => l.includes('•') || l.includes('-')).slice(0, 5),
        riskAssessment: lines.find((l: string) => l.toLowerCase().includes('risk')) || 'Balanced risk profile',
        growthOpportunities: lines.filter((l: string) => l.toLowerCase().includes('opportunity') || l.toLowerCase().includes('grow')).slice(0, 4)
      };

    } catch (error) {
      console.error('Net worth insights error:', error);
      return null;
    }
  }

  // ============================================================================
  // INCOME OPTIMIZATION
  // ============================================================================

  async getIncomeOptimization(request: IncomeOptimizationRequest): Promise<IncomeOptimizationResponse | null> {
    if (!openAIExtended.isConfigured()) {
      console.error('OpenAI not configured');
      return null;
    }

    const totalMonthly = request.sources
      .filter(s => s.isRecurring)
      .reduce((sum, s) => {
        const multiplier = { 'daily': 30, 'weekly': 4, 'monthly': 1, 'yearly': 1/12, 'one-time': 0 }[s.frequency] || 1;
        return sum + (s.amount * multiplier);
      }, 0);

    const prompt = `You are an income optimization specialist. Help maximize income potential with practical strategies.

CURRENT INCOME:
${request.sources.map(s => `- ${s.name} (${s.category}): $${s.amount} ${s.frequency}`).join('\n')}
Total Monthly: $${totalMonthly.toFixed(2)}

${request.skills ? `Skills: ${request.skills.join(', ')}` : ''}
${request.interests ? `Interests: ${request.interests.join(', ')}` : ''}
${request.timeAvailable ? `Available Time: ${request.timeAvailable} hours/week` : ''}

Provide:
1. Overall income profile analysis
2. New income opportunities to explore
3. Optimization tips for existing sources
4. Passive income ideas (realistic and actionable)
5. Skill monetization strategies
6. Estimated income potential from recommendations

Be specific, realistic, and focused on actionable opportunities. Consider both active and passive income.`;

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
          temperature: 0.8
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
        newOpportunities: lines.filter((l: string) => l.toLowerCase().includes('opportunity')).slice(0, 4),
        optimizationTips: lines.filter((l: string) => l.toLowerCase().includes('optimize') || l.toLowerCase().includes('improve')).slice(0, 4),
        passiveIncomeIdeas: lines.filter((l: string) => l.toLowerCase().includes('passive')).slice(0, 4),
        skillMonetization: lines.filter((l: string) => l.toLowerCase().includes('skill') || l.toLowerCase().includes('monetize')).slice(0, 3),
        estimatedPotential: this.estimateIncomePotential(request.sources, totalMonthly)
      };

    } catch (error) {
      console.error('Income optimization error:', error);
      return null;
    }
  }

  // ============================================================================
  // BENEFITS GUIDANCE
  // ============================================================================

  async getBenefitsGuidance(request: BenefitsGuidanceRequest): Promise<BenefitsGuidanceResponse | null> {
    if (!openAIExtended.isConfigured()) {
      console.error('OpenAI not configured');
      return null;
    }

    const totalBenefits = request.programs.reduce((sum, p) => sum + (p.monthlyAmount || 0), 0);

    const prompt = `You are a benefits specialist helping people with disabilities/chronic illness maximize their financial assistance.

CURRENT PROGRAMS:
${request.programs.map(p => `- ${p.name} (${p.type}): ${p.status}${p.monthlyAmount ? ` - $${p.monthlyAmount}/month` : ''}`).join('\n')}
Total Monthly Benefits: $${totalBenefits}

${request.userSituation ? `
USER SITUATION:
${request.userSituation.disability ? '- Has disability' : ''}
${request.userSituation.chronicIllness ? '- Chronic illness' : ''}
${request.userSituation.housing ? `- Housing: ${request.userSituation.housing}` : ''}
${request.userSituation.income ? `- Current income: $${request.userSituation.income}` : ''}
` : ''}

Provide:
1. Summary of current benefits situation
2. Additional programs they may be eligible for
3. Tips for successful applications
4. Strategies to maximize benefits
5. Required documentation and preparation steps
6. Helpful resources and contacts

Be compassionate, specific, and empowering. Focus on practical guidance.`;

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
          temperature: 0.7
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
        eligiblePrograms: lines.filter((l: string) => l.toLowerCase().includes('eligible') || l.toLowerCase().includes('qualify')).slice(0, 5),
        applicationTips: lines.filter((l: string) => l.toLowerCase().includes('application') || l.toLowerCase().includes('apply')).slice(0, 5),
        maximizationStrategies: lines.filter((l: string) => l.toLowerCase().includes('maximize') || l.toLowerCase().includes('increase')).slice(0, 4),
        documentationNeeded: lines.filter((l: string) => l.toLowerCase().includes('document') || l.toLowerCase().includes('proof')).slice(0, 4),
        resources: lines.filter((l: string) => l.toLowerCase().includes('resource') || l.toLowerCase().includes('contact')).slice(0, 3)
      };

    } catch (error) {
      console.error('Benefits guidance error:', error);
      return null;
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private estimatePayoffTime(debts: DebtAdviceRequest['debts'], monthlyPayment: number): string {
    const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
    const avgRate = debts.reduce((sum, d) => sum + d.interestRate, 0) / debts.length;

    // Simple estimation (doesn't account for compound interest fully)
    const monthlyRate = avgRate / 100 / 12;
    const months = Math.ceil(
      Math.log(monthlyPayment / (monthlyPayment - totalDebt * monthlyRate)) / Math.log(1 + monthlyRate)
    );

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} months` : ''}`;
    }
    return `${months} months`;
  }

  private calculatePotentialSavings(debts: DebtAdviceRequest['debts'], monthlyPayment: number): string {
    const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
    const avgRate = debts.reduce((sum, d) => sum + d.interestRate, 0) / debts.length;

    // Estimate interest paid
    const monthlyRate = avgRate / 100 / 12;
    const months = Math.ceil(
      Math.log(monthlyPayment / (monthlyPayment - totalDebt * monthlyRate)) / Math.log(1 + monthlyRate)
    );

    const totalPaid = monthlyPayment * months;
    const interestPaid = totalPaid - totalDebt;

    // Potential savings from optimized strategy (roughly 15-30% of interest)
    const savings = interestPaid * 0.25;

    return `$${savings.toFixed(2)}`;
  }

  private estimateIncomePotential(sources: IncomeOptimizationRequest['sources'], currentMonthly: number): string {
    // Conservative estimate: 20-50% increase with optimization
    const lowEstimate = currentMonthly * 1.2;
    const highEstimate = currentMonthly * 1.5;

    return `$${lowEstimate.toFixed(2)} - $${highEstimate.toFixed(2)}/month with optimization`;
  }

  // ============================================================================
  // QUICK INSIGHTS
  // ============================================================================

  /**
   * Get a quick AI insight for any financial topic
   */
  async getQuickInsight(topic: string, context: string): Promise<string | null> {
    if (!openAIExtended.isConfigured()) {
      console.error('OpenAI not configured');
      return null;
    }

    const prompt = `Provide a brief, actionable financial insight about: ${topic}

Context: ${context}

Give 2-3 specific, practical tips in 100 words or less.`;

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
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API error');
      }

      const data = await response.json();
      return data.choices[0].message.content;

    } catch (error) {
      console.error('Quick insight error:', error);
      return null;
    }
  }
}

export const financialAIAdvisor = new FinancialAIAdvisor();
