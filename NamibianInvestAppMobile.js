import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

// Mock market data
const mockMarketData = {
  nsx: [{ symbol: 'ANG', name: 'Anglo American', price: 653.59 }],
  jse: [{ symbol: 'MTN', name: 'MTN Group', price: 120.45 }],
  international: [{ symbol: 'AAPL', name: 'Apple Inc.', price: 145.32 }],
  crypto: [{ symbol: 'BTC', name: 'Bitcoin', price: 45000 }],
  annuities: [{ name: 'Standard Annuity', rate: '5% p.a.' }],
  property: [{ name: 'Windhoek Property Fund', value: 1000000 }],
};

// Mock KYC verification function
const verifyKYC = async (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ status: 'verified', message: 'KYC completed' }), 1000);
  });
};

// Mock tax calculation
const calculateTax = (amount, isNonResident) => {
  return isNonResident ? amount * 0.1 : 0;
};

const App = () => {
  const [activeTab, setActiveTab] = useState('nsx');
  const [user, setUser] = useState(null);
  const [kycStatus, setKycStatus] = useState('pending');
  const [portfolio, setPortfolio] = useState([]);

  const login = () => {
    setUser({ name: 'John Doe', isNonResident: true });
    verifyKYC({ name: 'John Doe', id: '123456' }).then((result) => {
      setKycStatus(result.status);
    });
  };

  const buyAsset = (asset) => {
    const tax = calculateTax(asset.price, user?.isNonResident);
    setPortfolio([...portfolio, { ...asset, tax }]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.name} - {item.price || item.rate || item.value}</Text>
      <Button
        title="Buy"
        onPress={() => buyAsset(item)}
        disabled={kycStatus !== 'verified'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {!user ? (
        <Button title="Login" onPress={login} />
      ) : (
        <>
          <Text style={styles.header}>Welcome, {user.name}! KYC Status: {kycStatus}</Text>
          <View style={styles.tabContainer}>
            {['nsx', 'jse', 'international', 'crypto', 'annuities', 'property'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab ? styles.activeTab : null]}
                onPress={() => setActiveTab(tab)}
              >
                <Text>{tab.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.sectionHeader}>{activeTab.toUpperCase()} Assets</Text>
          <FlatList
            data={mockMarketData[activeTab]}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
          <Text style={styles.sectionHeader}>Portfolio</Text>
          <FlatList
            data={portfolio}
            renderItem={({ item }) => (
              <Text>{item.name} - {item.price || item.rate || item.value} (Tax: {item.tax})</Text>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  tabContainer: { flexDirection: 'row', marginBottom: 16 },
  tab: { padding: 8, marginRight: 8, backgroundColor: '#e0e0e0', borderRadius: 4 },
  activeTab: { backgroundColor: '#3b82f6' },
  sectionHeader: { fontSize: 20, fontWeight: 'bold', marginVertical: 8 },
  item: { flexDirection: 'row', justifyContent: 'space-between', padding: 8 },
});

export default App;