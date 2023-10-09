import {View, Text, Platform} from 'react-native';
import React, {useEffect} from 'react';
import Config from 'react-native-config';
import Analytics from 'appcenter-analytics';
import codePush from 'react-native-code-push';
import {Provider} from 'react-redux';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import RepositoryList from './getRepos';

type Props = {};

const App = (props: Props) => {
  const queryClient = new QueryClient();

  useEffect(() => {
    Analytics.trackEvent('My custom event, from ' + Config.ENV);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RepositoryList />
      {/**
   <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center' } }>
          <Text style={{fontSize: 30}}> env: {Config.ENV} </Text>
        </View>
  */}
    </QueryClientProvider>
  );
};

// Define the deployment key based on the platform (iOS or Android)
const deploymentKey = Platform.select({
  ios: Config.IOS_CODEPUSH_DEPLOYMENT_KEY,
});

// Wrap your App component with CodePush higher-order component
const CodePushedApp = codePush({
  deploymentKey,
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
})(App);

export default CodePushedApp;
