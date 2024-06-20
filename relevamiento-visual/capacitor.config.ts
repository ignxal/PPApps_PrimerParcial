import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter1',
  appName: 'RelevamientoVisual',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
      launchAutoHide: true,
      launchFadeOutDuration: 0,
      //backgroundColor: '#ffffffff',
      androidSplashResourceName: 'splash',
      //androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      //androidSpinnerStyle: 'large',
      //iosSpinnerStyle: 'small',
      //spinnerColor: '#999999',
      splashFullScreen: true,
      splashImmersive: true,
      //layoutName: 'launch_screen',
      //useDialog: true,
    },
  },
};

export default config;
