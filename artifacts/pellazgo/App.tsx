import React, { useRef, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';

const APP_URL = 'https://pellazgo.base44.app';
const GREEN = '#0f2318';
const GOLD = '#C9A84C';

// ─── Splash / loading overlay ─────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <View style={styles.overlay}>
      <Image
        source={require('./assets/images/icon.png')}
        style={styles.splashLogo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color={GOLD} style={{ marginTop: 32 }} />
    </View>
  );
}

// ─── No-internet screen ───────────────────────────────────────────────────────
function OfflineScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.overlay}>
      <Image
        source={require('./assets/images/icon.png')}
        style={styles.splashLogo}
        resizeMode="contain"
      />
      <Text style={styles.offlineTitle}>No Internet Connection</Text>
      <Text style={styles.offlineSubtitle}>
        Please check your connection and try again.
      </Text>
      <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
        <Text style={styles.retryText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const webRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [navState, setNavState] = useState<WebViewNavigation | null>(null);

  // Android hardware back — navigate in-app first
  React.useEffect(() => {
    if (Platform.OS !== 'android') return;
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navState?.canGoBack) {
        webRef.current?.goBack();
        return true;
      }
      return false;
    });
    return () => handler.remove();
  }, [navState]);

  const handleRetry = useCallback(() => {
    setOffline(false);
    setLoading(true);
    webRef.current?.reload();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={GREEN} />

      {offline ? (
        <OfflineScreen onRetry={handleRetry} />
      ) : (
        <>
          <WebView
            ref={webRef}
            source={{ uri: APP_URL }}
            style={styles.webview}
            onLoadStart={() => { setLoading(true); setOffline(false); }}
            onLoadEnd={() => setLoading(false)}
            onError={() => { setLoading(false); setOffline(true); }}
            onHttpError={() => { setLoading(false); }}
            onNavigationStateChange={setNavState}
            javaScriptEnabled
            domStorageEnabled
            allowsBackForwardNavigationGestures
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            sharedCookiesEnabled
          />
          {loading && <LoadingScreen />}
        </>
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GREEN,
  },
  webview: {
    flex: 1,
    backgroundColor: GREEN,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    zIndex: 10,
  },
  splashLogo: {
    width: 200,
    height: 200,
  },
  offlineTitle: {
    color: GOLD,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 28,
    textAlign: 'center',
  },
  offlineSubtitle: {
    color: '#ffffff99',
    fontSize: 15,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryBtn: {
    marginTop: 28,
    backgroundColor: GOLD,
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 8,
  },
  retryText: {
    color: GREEN,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
