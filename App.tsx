import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import Config from 'react-native-config';
type Props = {};
import Analytics from 'appcenter-analytics';
const App = (props: Props) => {
  useEffect(() => {
    Analytics.trackEvent('My custom event, from ' + Config.ENV);
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 30}}> env: {Config.ENV} </Text>
    </View>
  );
};

export default App;
