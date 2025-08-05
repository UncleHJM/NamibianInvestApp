import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
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
    const tax = user?.isNonResident ? asset.price * 0.1 : 0;
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