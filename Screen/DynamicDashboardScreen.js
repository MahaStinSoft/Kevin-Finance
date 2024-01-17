import React from 'react';
import { WebView } from 'react-native-webview';

const DynamicDashboardScreen = () => {
  return (
    <WebView
      style={{ flex: 1, marginTop: -50 }}
      source={{
        uri:
          'https://org0f7e6203.crm5.dynamics.com/main.aspx?appid=56cd2108-479a-ee11-be37-6045bd2198ef&forceUCI=1&pagetype=dashboard&id=076feb56-43a5-ee11-be37-6045bd2198ef&type=system&_canOverride=true',
      }}
    />
  );
};
 // Always return true to prevent re-renders

export default DynamicDashboardScreen;
