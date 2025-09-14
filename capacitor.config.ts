import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d4747237bdc44034b28854bfc690160c',
  appName: 'crypto-sprunkies-orchestra-27',
  webDir: 'dist',
  server: {
    url: "https://d4747237-bdc4-4034-b288-54bfc690160c.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: "#1a1a2e",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;