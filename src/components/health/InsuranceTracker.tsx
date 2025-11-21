import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, DollarSign, Calendar, Phone, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Insurance {
  id: string;
  type: 'Health' | 'Dental' | 'Vision' | 'Disability' | 'Life' | 'Other';
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  effectiveDate: string;
  renewalDate: string;
  monthlyPremium: number;
  deductible: number;
  deductibleMet: number;
  outOfPocketMax: number;
  outOfPocketMet: number;
  customerServicePhone: string;
  notes: string;
  active: boolean;
}

interface Claim {
  id: string;
  insuranceType: string;
  claimNumber: string;
  serviceDate: string;
  provider: string;
  amount: number;
  status: 'Submitted' | 'Processing' | 'Approved' | 'Denied' | 'Paid';
  dateSubmitted: string;
  notes: string;
}

const InsuranceTracker: React.FC = () => {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [showInsuranceForm, setShowInsuranceForm] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [activeView, setActiveView] = useState<'policies' | 'claims'>('policies');
  const [insuranceData, setInsuranceData] = useState<Partial<Insurance>>({
    active: true,
    deductibleMet: 0,
    outOfPocketMet: 0,
  });
  const [claimData, setClaimData] = useState<Partial<Claim>>({
    status: 'Submitted',
  });

  useEffect(() => {
    const storedInsurances = localStorage.getItem('insurances');
    const storedClaims = localStorage.getItem('insurance-claims');
    if (storedInsurances) setInsurances(JSON.parse(storedInsurances));
    if (storedClaims) setClaims(JSON.parse(storedClaims));
  }, []);

  const saveInsurances = (newInsurances: Insurance[]) => {
    setInsurances(newInsurances);
    localStorage.setItem('insurances', JSON.stringify(newInsurances));
  };

  const saveClaims = (newClaims: Claim[]) => {
    setClaims(newClaims);
    localStorage.setItem('insurance-claims', JSON.stringify(newClaims));
  };

  const addInsurance = () => {
    if (!insuranceData.provider || !insuranceData.policyNumber) {
      toast.error('Provider and policy number required');
      return;
    }

    const newInsurance: Insurance = {
      id: `ins_${Date.now()}`,
      type: insuranceData.type || 'Health',
      provider: insuranceData.provider!,
      policyNumber: insuranceData.policyNumber!,
      groupNumber: insuranceData.groupNumber,
      effectiveDate: insuranceData.effectiveDate || '',
      renewalDate: insuranceData.renewalDate || '',
      monthlyPremium: insuranceData.monthlyPremium || 0,
      deductible: insuranceData.deductible || 0,
      deductibleMet: insuranceData.deductibleMet || 0,
      outOfPocketMax: insuranceData.outOfPocketMax || 0,
      outOfPocketMet: insuranceData.outOfPocketMet || 0,
      customerServicePhone: insuranceData.customerServicePhone || '',
      notes: insuranceData.notes || '',
      active: insuranceData.active !== false,
    };

    saveInsurances([...insurances, newInsurance]);
    setInsuranceData({ active: true, deductibleMet: 0, outOfPocketMet: 0 });
    setShowInsuranceForm(false);
    toast.success('Insurance added');
  };

  const addClaim = () => {
    if (!claimData.claimNumber || !claimData.serviceDate) {
      toast.error('Claim number and service date required');
      return;
    }

    const newClaim: Claim = {
      id: `claim_${Date.now()}`,
      insuranceType: claimData.insuranceType || 'Health',
      claimNumber: claimData.claimNumber!,
      serviceDate: claimData.serviceDate!,
      provider: claimData.provider || '',
      amount: claimData.amount || 0,
      status: claimData.status || 'Submitted',
      dateSubmitted: claimData.dateSubmitted || new Date().toISOString().split('T')[0],
      notes: claimData.notes || '',
    };

    saveClaims([...claims, newClaim]);
    setClaimData({ status: 'Submitted' });
    setShowClaimForm(false);
    toast.success('Claim added');
  };

  const deleteInsurance = (id: string) => {
    saveInsurances(insurances.filter(i => i.id !== id));
    toast.success('Insurance deleted');
  };

  const deleteClaim = (id: string) => {
    saveClaims(claims.filter(c => c.id !== id));
    toast.success('Claim deleted');
  };

  const getStatusColor = (status: Claim['status']): string => {
    switch (status) {
      case 'Submitted': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Processing': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Approved': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Denied': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Paid': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  const totalMonthlyPremiums = insurances
    .filter(i => i.active)
    .reduce((sum, i) => sum + i.monthlyPremium, 0);

  const activeInsurances = insurances.filter(i => i.active);

  return (
    <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 p-6 rounded-xl border border-green-500/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl font-bold text-white">Insurance Tracker</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView(activeView === 'policies' ? 'claims' : 'policies')}
            className="px-4 py-2 bg-green-600/30 hover:bg-green-500/40 text-green-300 font-semibold rounded-lg transition-colors"
          >
            {activeView === 'policies' ? 'View Claims' : 'View Policies'}
          </button>
          <button
            onClick={() => activeView === 'policies' ? setShowInsuranceForm(!showInsuranceForm) : setShowClaimForm(!showClaimForm)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            {activeView === 'policies'
              ? (showInsuranceForm ? 'Cancel' : 'Add Policy')
              : (showClaimForm ? 'Cancel' : 'Add Claim')}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-black/40 p-4 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm font-semibold">Active Policies</span>
          </div>
          <p className="text-3xl font-bold text-white">{activeInsurances.length}</p>
        </div>

        <div className="bg-black/40 p-4 rounded-lg border border-yellow-500/20">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-300 text-sm font-semibold">Monthly Premiums</span>
          </div>
          <p className="text-3xl font-bold text-white">${totalMonthlyPremiums.toFixed(0)}</p>
        </div>

        <div className="bg-black/40 p-4 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-semibold">Active Claims</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {claims.filter(c => c.status === 'Submitted' || c.status === 'Processing').length}
          </p>
        </div>

        <div className="bg-black/40 p-4 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-semibold">Pending Amount</span>
          </div>
          <p className="text-3xl font-bold text-white">
            ${claims.filter(c => c.status !== 'Paid').reduce((sum, c) => sum + c.amount, 0).toFixed(0)}
          </p>
        </div>
      </div>

      {/* Insurance Form */}
      {activeView === 'policies' && showInsuranceForm && (
        <div className="bg-black/60 p-6 rounded-lg border border-green-500/30 mb-6 space-y-4">
          <h3 className="text-green-300 font-semibold text-lg">Add Insurance Policy</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Type</label>
              <select
                value={insuranceData.type}
                onChange={(e) => setInsuranceData({...insuranceData, type: e.target.value as Insurance['type']})}
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
              >
                <option value="Health">Health</option>
                <option value="Dental">Dental</option>
                <option value="Vision">Vision</option>
                <option value="Disability">Disability</option>
                <option value="Life">Life</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Provider *</label>
              <input
                type="text"
                value={insuranceData.provider || ''}
                onChange={(e) => setInsuranceData({...insuranceData, provider: e.target.value})}
                placeholder="Blue Cross, Aetna, etc."
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white placeholder-green-400/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Policy Number *</label>
              <input
                type="text"
                value={insuranceData.policyNumber || ''}
                onChange={(e) => setInsuranceData({...insuranceData, policyNumber: e.target.value})}
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Group Number</label>
              <input
                type="text"
                value={insuranceData.groupNumber || ''}
                onChange={(e) => setInsuranceData({...insuranceData, groupNumber: e.target.value})}
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Monthly Premium ($)</label>
              <input
                type="number"
                value={insuranceData.monthlyPremium || ''}
                onChange={(e) => setInsuranceData({...insuranceData, monthlyPremium: parseFloat(e.target.value)})}
                min="0"
                step="0.01"
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Deductible ($)</label>
              <input
                type="number"
                value={insuranceData.deductible || ''}
                onChange={(e) => setInsuranceData({...insuranceData, deductible: parseFloat(e.target.value)})}
                min="0"
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Deductible Met ($)</label>
              <input
                type="number"
                value={insuranceData.deductibleMet || ''}
                onChange={(e) => setInsuranceData({...insuranceData, deductibleMet: parseFloat(e.target.value)})}
                min="0"
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Out-of-Pocket Max ($)</label>
              <input
                type="number"
                value={insuranceData.outOfPocketMax || ''}
                onChange={(e) => setInsuranceData({...insuranceData, outOfPocketMax: parseFloat(e.target.value)})}
                min="0"
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Out-of-Pocket Met ($)</label>
              <input
                type="number"
                value={insuranceData.outOfPocketMet || ''}
                onChange={(e) => setInsuranceData({...insuranceData, outOfPocketMet: parseFloat(e.target.value)})}
                min="0"
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-green-300 text-sm font-semibold mb-2">Customer Service Phone</label>
            <input
              type="tel"
              value={insuranceData.customerServicePhone || ''}
              onChange={(e) => setInsuranceData({...insuranceData, customerServicePhone: e.target.value})}
              placeholder="1-800-XXX-XXXX"
              className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white placeholder-green-400/50"
            />
          </div>

          <div>
            <label className="block text-green-300 text-sm font-semibold mb-2">Notes</label>
            <textarea
              value={insuranceData.notes || ''}
              onChange={(e) => setInsuranceData({...insuranceData, notes: e.target.value})}
              placeholder="Coverage details, limitations, etc."
              className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white placeholder-green-400/50"
              rows={2}
            />
          </div>

          <button
            onClick={addInsurance}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Save Insurance
          </button>
        </div>
      )}

      {/* Claim Form */}
      {activeView === 'claims' && showClaimForm && (
        <div className="bg-black/60 p-6 rounded-lg border border-green-500/30 mb-6 space-y-4">
          <h3 className="text-green-300 font-semibold text-lg">Add Insurance Claim</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Insurance Type</label>
              <select
                value={claimData.insuranceType || ''}
                onChange={(e) => setClaimData({...claimData, insuranceType: e.target.value})}
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
              >
                <option value="">Select...</option>
                <option value="Health">Health</option>
                <option value="Dental">Dental</option>
                <option value="Vision">Vision</option>
                <option value="Disability">Disability</option>
              </select>
            </div>

            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Claim Number *</label>
              <input
                type="text"
                value={claimData.claimNumber || ''}
                onChange={(e) => setClaimData({...claimData, claimNumber: e.target.value})}
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Service Date *</label>
              <input
                type="date"
                value={claimData.serviceDate || ''}
                onChange={(e) => setClaimData({...claimData, serviceDate: e.target.value})}
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Provider</label>
              <input
                type="text"
                value={claimData.provider || ''}
                onChange={(e) => setClaimData({...claimData, provider: e.target.value})}
                placeholder="Dr. Smith, City Hospital..."
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white placeholder-green-400/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Amount ($)</label>
              <input
                type="number"
                value={claimData.amount || ''}
                onChange={(e) => setClaimData({...claimData, amount: parseFloat(e.target.value)})}
                min="0"
                step="0.01"
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-green-300 text-sm font-semibold mb-2">Status</label>
              <select
                value={claimData.status}
                onChange={(e) => setClaimData({...claimData, status: e.target.value as Claim['status']})}
                className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
              >
                <option value="Submitted">Submitted</option>
                <option value="Processing">Processing</option>
                <option value="Approved">Approved</option>
                <option value="Denied">Denied</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-green-300 text-sm font-semibold mb-2">Notes</label>
            <textarea
              value={claimData.notes || ''}
              onChange={(e) => setClaimData({...claimData, notes: e.target.value})}
              placeholder="Claim details, follow-up actions..."
              className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white placeholder-green-400/50"
              rows={2}
            />
          </div>

          <button
            onClick={addClaim}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Save Claim
          </button>
        </div>
      )}

      {/* Policies View */}
      {activeView === 'policies' && (
        <div className="space-y-4">
          {insurances.length > 0 ? (
            insurances.map(insurance => {
              const deductibleProgress = insurance.deductible > 0
                ? (insurance.deductibleMet / insurance.deductible) * 100
                : 0;
              const oopProgress = insurance.outOfPocketMax > 0
                ? (insurance.outOfPocketMet / insurance.outOfPocketMax) * 100
                : 0;

              return (
                <div
                  key={insurance.id}
                  className={`bg-black/40 p-4 rounded-lg border-2 transition-all ${
                    insurance.active ? 'border-green-500/30' : 'border-gray-500/30 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-bold text-lg">{insurance.provider}</h3>
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded border border-green-500/30">
                          {insurance.type}
                        </span>
                        {!insurance.active && (
                          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded">Inactive</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">Policy: {insurance.policyNumber}</p>
                    </div>
                    <button
                      onClick={() => deleteInsurance(insurance.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                    <div>
                      <span className="text-gray-400">Premium:</span>
                      <p className="text-white font-semibold">${insurance.monthlyPremium}/mo</p>
                    </div>
                    {insurance.customerServicePhone && (
                      <div>
                        <span className="text-gray-400">Phone:</span>
                        <p className="text-white font-semibold">{insurance.customerServicePhone}</p>
                      </div>
                    )}
                  </div>

                  {insurance.deductible > 0 && (
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-400">Deductible</span>
                        <span className="text-white font-semibold">
                          ${insurance.deductibleMet} / ${insurance.deductible}
                        </span>
                      </div>
                      <div className="w-full bg-black/40 rounded-full h-2">
                        <div
                          className="h-2 bg-green-500 rounded-full transition-all"
                          style={{ width: `${Math.min(deductibleProgress, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {insurance.outOfPocketMax > 0 && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-400">Out-of-Pocket Max</span>
                        <span className="text-white font-semibold">
                          ${insurance.outOfPocketMet} / ${insurance.outOfPocketMax}
                        </span>
                      </div>
                      <div className="w-full bg-black/40 rounded-full h-2">
                        <div
                          className="h-2 bg-blue-500 rounded-full transition-all"
                          style={{ width: `${Math.min(oopProgress, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center text-green-400 py-12">
              <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No insurance policies added</p>
            </div>
          )}
        </div>
      )}

      {/* Claims View */}
      {activeView === 'claims' && (
        <div className="space-y-3">
          {claims.length > 0 ? (
            claims.map(claim => (
              <div key={claim.id} className="bg-black/40 p-4 rounded-lg border border-green-500/20">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-bold">Claim #{claim.claimNumber}</span>
                      <span className={`px-2 py-1 text-xs rounded border ${getStatusColor(claim.status)}`}>
                        {claim.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{claim.insuranceType} | {claim.provider}</p>
                  </div>
                  <button
                    onClick={() => deleteClaim(claim.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-300">
                    <Calendar className="w-4 h-4" />
                    Service: {new Date(claim.serviceDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-300">
                    <DollarSign className="w-4 h-4" />
                    ${claim.amount.toFixed(2)}
                  </div>
                </div>

                {claim.notes && (
                  <p className="text-gray-400 text-sm mt-2 italic">{claim.notes}</p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-green-400 py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No claims submitted</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 bg-green-900/20 border border-green-500/30 rounded-lg p-3">
        <p className="text-green-300 text-xs">
          <span className="font-bold">Insurance Management:</span> Track policies, premiums, deductibles, and out-of-pocket maximums. Monitor claims status and amounts. Keep important insurance information organized and accessible.
        </p>
      </div>
    </div>
  );
};

export default InsuranceTracker;
