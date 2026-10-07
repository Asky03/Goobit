import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native';
import {
  getTrackingState,
  pauseTracking,
  resetTracking,
  resumeTracking,
  startTracking,
  stopTracking,
} from '../services/trackingService';

export default function TrackScreen() {
  const [status, setStatus] = useState(getTrackingState().status);

  const handleStart = () => {
    setStatus(startTracking().status);
  };

  const handlePause = () => {
    setStatus(pauseTracking().status);
  };

  const handleResume = () => {
    setStatus(resumeTracking().status);
  };

  const handleStop = () => {
    setStatus(stopTracking().status);
  };

  const handleReset = () => {
    setStatus(resetTracking().status);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Track</Text>

        <Text style={styles.status}>
          Status: {status.toUpperCase()}
        </Text>

        <Pressable style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>Start</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={handlePause}>
          <Text style={styles.buttonText}>Pause</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={handleResume}>
          <Text style={styles.buttonText}>Resume</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={handleStop}>
          <Text style={styles.buttonText}>Stop</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={handleReset}>
          <Text>Reset</Text>
        </Pressable>
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
  status: {
    marginVertical: 24,
    fontSize: 18,
  },
  button: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#111111',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
  },
});