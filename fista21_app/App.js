
import React, {Component} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login'
import HomeTab from './screens/HomeTab'

const stack = createStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<stack.Navigator
				screenOptions={{
					gestureEnabled: false,
					headerShown: false,
					backgroundColor:'none',
				}}
			>
				<stack.Screen name="Login" component={Login} />
				<stack.Screen name="HomeTab" component={HomeTab} />
			
				
			</stack.Navigator>
		</NavigationContainer >
	);
}