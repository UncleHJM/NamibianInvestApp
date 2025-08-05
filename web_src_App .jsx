import React, { useState } from 'react';
import axios from 'axios';

const mockMarketData = {
  nsx: [{ symbol: 'ANG', name: 'Anglo American', price: 653.59 }],
  jse: [{ symbol: 'MTN', name: 'MTN Group', price: 120.45 }],
  international: [{ symbol: 'AAPL', name: 'Apple Inc.', price: 145.32 }],
  crypto: [{ symbol: 'BTC', name: 'Bitcoin', price: 45000 }],
  annuities: [{ name: 'Standard Annuity', rate: '5% p.a.' }],
  property: [{ name: 'Windhoek Property Fund', value: 1000000 }],
};

const App = () => {
  const [activeTab, setActiveTab] = useState('nsx');
  const [user, setUser] = useState(null);
  const [kycStatus, setKycStatus] = useState('pending');
  const [portfolio, setPortfolio] = useState([]);

  const login = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        email: 'user@example.com',
        password: 'password123',
      });
      setUser(response.data.user);
      const kycResponse = await axios.post('http://localhost:3000/api/kyc', {
        name: response.data.user.name,
        id: '123456',
      });
      setKycStatus(kycResponse.data.status);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const buyAsset = (asset) => {
    const tax = user?.isNonResident ? asset.price * 0.1 : 0; // 10% tax for non-residents
    setPortfolio([...portfolio, { ...asset, tax }]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Namibian Invest App</h1>
      {!user ? (
        <button className="bg-blue-500 text-white p-2 rounded" onClick={login}>
          Login
        </button>
      ) : (
        <>
          <p className="mb-2">Welcome, {user.name}! KYC Status: {kycStatus}</p>
          <div className="flex mb-4">
            {['nsx', 'jse', 'international', 'crypto', 'annuities', 'property'].map((tab) => (
              <button
                key={tab}
                className={`p-2 mr-2 ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">{activeTab.toUpperCase()} Assets</h2>
            <ul>
              {mockMarketData[activeTab].map((asset, index) => (
                <li key={index} className="mb-2">
                  {asset.name} - {asset.price || asset.rate || asset.value}
                  <button
                    className="ml-2 bg-green-500 text-white p-1 rounded"
                    onClick={() => buyAsset(asset)}
                    disabled={kycStatus !== 'verified'}
                  >
                    Buy
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-bold mb-2">Portfolio</h2>
            <ul>
              {portfolio.map((asset, index) => (
                <li key={index}>
                  {asset.name} - {asset.price || asset.rate || asset.value} (Tax: {asset.tax})
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default App;