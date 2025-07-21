import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  jobPosition: string;
}

export type Screen = 'welcome' | 'explanation' | 'interview';

export const useAppState = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [userData, setUserData] = useState<UserData | null>(null);

  // Load user data from cookies on component mount
  useEffect(() => {
    const savedUserData = Cookies.get('userData');
    if (savedUserData) {
      try {
        const parsedData = JSON.parse(savedUserData);
        setUserData(parsedData);
        // If we have user data, we might want to skip to explanation screen
        // setCurrentScreen('explanation');
      } catch (error) {
        console.error('Error parsing user data from cookies:', error);
      }
    }
  }, []);

  const saveUserData = (data: UserData) => {
    setUserData(data);
    // Save to cookies with 24 hour expiration
    Cookies.set('userData', JSON.stringify(data), { expires: 1 });
  };

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const clearUserData = () => {
    setUserData(null);
    Cookies.remove('userData');
  };

  return {
    currentScreen,
    userData,
    saveUserData,
    navigateToScreen,
    clearUserData,
  };
};
