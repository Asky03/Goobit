import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>GoBit</Text>

        <Text style={styles.subtitle}>
          Your fitness, movement and health dashboard.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today</Text>
          <Text style={styles.cardText}>0 steps</Text>
          <Text style={styles.cardText}>0 kcal</Text>
          <Text style={styles.cardText}>0 km</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
  },
  card: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    marginTop: 6,
  },
});