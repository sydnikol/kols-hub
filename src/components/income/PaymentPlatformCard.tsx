/**
 * Payment Platform Card Component
 * Beautiful cards for Cash App, Venmo, and PayPal
 */

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ExternalLink,
  QrCode,
  Share2,
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
  Copy
} from 'lucide-react';
import PaymentPlatformService, { PaymentPlatform } from '../../services/paymentPlatformService';

interface PaymentPlatformCardProps {
  platform: 'cashapp' | 'venmo' | 'paypal';
  platformData?: PaymentPlatform;
  onRefresh?: () => void;
}

const PaymentPlatformCard: React.FC<PaymentPlatformCardProps> = ({
  platform,
  platformData,
  onRefresh
}) => {
  const [balance, setBalance] = useState<number>(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [showQR, setShowQR] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const colors = PaymentPlatformService.getPlatformColors(platform);
  const logo = PaymentPlatformService.getPlatformLogo(platform);

  useEffect(() => {
    loadData();
  }, [platformData]);

  const loadData = async () => {
    if (!platformData?.username) return;

    setIsLoading(true);
    try {
      const [balanceData, transactions] = await Promise.all([
        PaymentPlatformService.getBalance(platform),
        PaymentPlatformService.getRecentTransactions(platform)
      ]);

      setBalance(balanceData);
      setRecentTransactions(transactions.slice(0, 3));
    } catch (error) {
      console.error('Error loading payment data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenApp = () => {
    if (platformData?.username) {
      PaymentPlatformService.openPlatformApp(platform, platformData.username);
    }
  };

  const handleShare = async () => {
    if (platformData?.username) {
      const link = await PaymentPlatformService.createPaymentLink(
        platform,
        platformData.username
      );
      await PaymentPlatformService.sharePaymentLink(link);
    }
  };

  const handleCopyUsername = async () => {
    if (platformData?.username) {
      const prefix = platform === 'cashapp' ? '$' : '@';
      await navigator.clipboard.writeText(`${prefix}${platformData.username}`);
      alert(`${platform.toUpperCase()} username copied!`);
    }
  };

  const getPlatformName = () => {
    switch (platform) {
      case 'cashapp': return 'Cash App';
      case 'venmo': return 'Venmo';
      case 'paypal': return 'PayPal';
    }
  };

  const getUsername = () => {
    if (!platformData?.username) return 'Not configured';

    switch (platform) {
      case 'cashapp': return `$${platformData.username}`;
      case 'venmo': return `@${platformData.username}`;
      case 'paypal': return platformData.username;
    }
  };

  if (!platformData?.isActive) {
    return (
      <div className={`bg-gradient-to-br ${colors.gradient} bg-opacity-10 p-6 rounded-xl border border-gray-700 opacity-50`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{getPlatformName()}</h3>
              <p className="text-sm text-gray-400">Not configured</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-400 text-center py-4">
          Configure your {getPlatformName()} account in settings to see your balance and transactions.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br ${colors.gradient} p-6 rounded-xl border border-white/20 shadow-2xl transform transition-all hover:scale-105`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
            {logo ? (
              <img src={logo} alt={getPlatformName()} className="w-8 h-8 object-contain" />
            ) : (
              <DollarSign className="w-6 h-6" style={{ color: colors.primary }} />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{getPlatformName()}</h3>
            <button
              onClick={handleCopyUsername}
              className="text-sm text-white/80 hover:text-white flex items-center gap-1 transition-colors"
            >
              {getUsername()}
              <Copy className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQR(!showQR)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            title="Show QR Code"
          >
            <QrCode className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            title="Share Payment Link"
          >
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Balance */}
      <div className="mb-6">
        <div className="text-sm text-white/70 mb-1">Balance</div>
        <div className="text-4xl font-bold text-white mb-2">
          {PaymentPlatformService.formatCurrency(balance)}
        </div>
        <div className="flex items-center gap-2 text-sm text-white/80">
          <TrendingUp className="w-4 h-4" />
          <span>Last synced: {platformData.lastSynced ? new Date(platformData.lastSynced).toLocaleTimeString() : 'Never'}</span>
        </div>
      </div>

      {/* QR Code */}
      {showQR && platformData?.username && (
        <div className="mb-6 bg-white p-4 rounded-lg">
          <img
            src={PaymentPlatformService.getQRCodeURL(platform, platformData.username)}
            alt="Payment QR Code"
            className="w-full h-auto"
          />
          <p className="text-center text-xs text-gray-600 mt-2">
            Scan to pay {getUsername()}
          </p>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white/90 mb-3">Recent Transactions</h4>
        <div className="space-y-2">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((tx, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-white/10 p-3 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {tx.type === 'received' ? (
                    <ArrowDownCircle className="w-5 h-5 text-green-300" />
                  ) : (
                    <ArrowUpCircle className="w-5 h-5 text-red-300" />
                  )}
                  <div>
                    <div className="text-sm font-medium text-white">
                      {tx.description}
                    </div>
                    <div className="text-xs text-white/60">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className={`font-bold ${tx.type === 'received' ? 'text-green-300' : 'text-red-300'}`}>
                  {tx.type === 'received' ? '+' : '-'}{PaymentPlatformService.formatCurrency(tx.amount)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-white/60 text-sm py-4">
              No recent transactions
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleOpenApp}
          className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Open App
        </button>
        <button
          onClick={loadData}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          <TrendingUp className="w-4 h-4" />
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
    </div>
  );
};

export default PaymentPlatformCard;
