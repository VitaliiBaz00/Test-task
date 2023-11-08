import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {DetailsScreen} from './src/screens/DetailsScreen';
import {SearchScreen} from './src/screens/SearchScreen';

export type RootStackParamList = {
  Search: undefined;
  Details: {book: Book}; // You can specify the parameters here
};

const Stack = createStackNavigator<RootStackParamList>();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Search">
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
