import { Platform } from 'react-native';

export const BASE_URL = Platform.OS === 'android'
  ? 'http://192.168.18.114:3000'
  : 'http://localhost:3000';
