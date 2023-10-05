import {View, Text} from 'react-native';
import React from 'react';
import Config from 'react-native-config';
type Props = {};

const App = (props: Props) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 30}}> env: {Config.ENV} </Text>
    </View>
  );
};

export default App;
