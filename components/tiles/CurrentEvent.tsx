import React, {useEffect, useRef, useState} from 'react';
import {Alert, Animated, Easing, Linking, Platform, StyleSheet, TouchableOpacity, View,} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {ThemedText} from '@/components/ThemedText';
import {usePredefined} from '@/hooks/useThemeColor';
import {UserCheck, UserRound} from 'lucide-react-native';
import APIService from '@/api/APIService';
import {ActiveEvent} from "@/api/Entities";
import * as Location from 'expo-location';
import {LocationAccuracy} from 'expo-location';

export function CurrentEvent() {
  // Active event is fetched from the backend. We assume APIService.getActiveEvents()
  // returns an array of ActiveEvent objects.
  const [activeEvent, setActiveEvent] = useState<ActiveEvent | null>(null);
  // Check-in states: 'idle' | 'loading' | 'success' | 'fail'
  const [checkInState, setCheckInState] = useState('idle');

  // For loading rotation animation
  const rotationAnim = useRef(new Animated.Value(0)).current;

  const specialButton = usePredefined('special_button');
  const textColor = usePredefined('text');
  const bubbleBackground = usePredefined('bubble_background');

  // Fetch active event on mount and refresh every minute.
  useEffect(() => {
    const fetchActiveEvent = async () => {
      try {
        const events = await APIService.getActiveEvents();
        // Pick the first active event (if any)
        if (events.length > 0) {
          const activeEvent = events[0];
          setActiveEvent(activeEvent);
          // @ts-ignore
          // if (activeEvent && activeEvent.checkedIn[(await APIService.me()).id]) {
          //   setCheckInState('success');
          // }
        } else {
          setActiveEvent(null);
        }
      } catch (error) {
        console.error('Error fetching active events:', error);
      }
    };

    fetchActiveEvent();
    const interval = setInterval(fetchActiveEvent, 1000 * 20); // refresh every 20 seconds
    return () => clearInterval(interval);
  }, []);

  // Start rotation animation if in 'loading' state.
  useEffect(() => {
    if (checkInState === 'loading') {
      Animated.loop(
          Animated.timing(rotationAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.linear,
          })
      ).start();
    } else {
      rotationAnim.stopAnimation(() => {
        rotationAnim.setValue(0);
      });
    }
  }, [checkInState, rotationAnim]);

  // Handle check-in. For demonstration, we simulate user geolocation as the event’s location.
  const handleCheckIn = async () => {
    if (!activeEvent) return;
    if (checkInState === 'loading' || checkInState === 'success') return;
    setCheckInState('loading');

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setCheckInState('fail');
        return;
      }

      let location = await Location.getCurrentPositionAsync({accuracy: LocationAccuracy.Balanced});
      let res = await APIService.checkInActiveEvent(activeEvent.id, location.coords.latitude, location.coords.longitude);

      if (res.success) {
        setCheckInState('success');
      } else {
        setCheckInState('fail');
        Alert.alert("Failed to check in!", res.status);
      }
    } catch (error) {
      console.error('Check-in error:', error);
      setCheckInState('fail');
      // Revert to idle state after a short delay.
      setTimeout(() => setCheckInState('idle'), 2000);
    }
  };

  // Determine button style and text based on checkInState.
  let buttonColor = specialButton;
  let buttonText = 'Check In';
  let iconColor = 'white';
  if (checkInState === 'loading') {
    buttonText = 'Checking...';
  } else if (checkInState === 'success') {
    buttonColor = 'green';
    buttonText = 'Checked In';
  } else if (checkInState === 'fail') {
    buttonColor = 'red';
    buttonText = 'Failed';
  }

  const rotateInterpolate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Helper for opening the device’s map app to the event location.
  // @ts-ignore
  const openMap = ({ lat, lng, label }) => {
    const scheme = Platform.select({
      ios: `maps://?q=${label}&ll=${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}(${label})`,
    });
    if (scheme) {
      Linking.openURL(scheme).catch((err) =>
          console.error('Error opening map: ', err)
      );
    }
  };

  if (!activeEvent) {
    return (
        <View style={[styles.card, { backgroundColor: bubbleBackground, justifyContent: 'center', alignItems: 'center' }]}>
          <ThemedText type="subtitle">No active events.</ThemedText>
        </View>
    );
  }

  return (
      <View style={[styles.card, { backgroundColor: bubbleBackground }]}>
        <View style={styles.titleContainer}>
          <ThemedText type="subtitle">Current Event</ThemedText>
          <MapView
              style={styles.map}
              camera={{
                center: {
                  latitude: activeEvent.latitude,
                  longitude: activeEvent.longitude,
                },
                heading: 0,
                altitude: 1000,
                pitch: 0,
              }}
              scrollEnabled={false}
              rotateEnabled={false}
              showsTraffic={true}
              zoomEnabled={false}
              cameraZoomRange={{
                maxCenterCoordinateDistance: 5000,
                minCenterCoordinateDistance: 100,
              }}
              onPress={() => {
                openMap({
                  lat: activeEvent.latitude,
                  lng: activeEvent.longitude,
                  label: activeEvent.location,
                });
              }}
          >
            <Marker
                coordinate={{
                  latitude: activeEvent.latitude,
                  longitude: activeEvent.longitude,
                }}
                tappable={false}
            />
          </MapView>
        </View>

        <View style={styles.container}>
          <ThemedText type="subtitle">{activeEvent.eventName}</ThemedText>
          <UserRound style={styles.icon} color={textColor} size={35} />
          <ThemedText type="subtitle_mini">{`${Object.keys(activeEvent.checkedIn).length} brothers checked in`}</ThemedText>
          <TouchableOpacity
              style={[styles.checkInButton, { backgroundColor: buttonColor }]}
              onPress={handleCheckIn}
          >
            {checkInState === 'loading' ? (
                <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                  <UserCheck style={styles.checkInIcon} color={iconColor} size={20} />
                </Animated.View>
            ) : (
                <UserCheck style={styles.checkInIcon} color={iconColor} size={20} />
            )}
            <ThemedText type="default" style={[styles.checkInText, { color: iconColor }]}>
              {buttonText}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 15,
    overflow: 'hidden',
  },
  titleContainer: {
    gap: 8,
    width: '50%',
  },
  map: {
    height: 113,
    width: '100%',
    borderRadius: 15,
  },
  container: {
    width: '50%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    width: 76,
    height: 59,
    textAlign: 'center',
    fontSize: 35,
    fontWeight: '400',
    paddingVertical: 30,
  },
  checkInButton: {
    width: '75%',
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  checkInIcon: {
    textAlign: 'center',
    fontSize: 15,
    marginRight: 5,
  },
  checkInText: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
  },
});
