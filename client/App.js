import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider as PaperProvider} from 'react-native-paper';
import Constants from './env'

import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { ApolloProvider } from "react-apollo";

import {AppTheme} from './src/theme';
import {HomeScreen, LoginScreen, SignupScreen, JobApplication , SocialLogin} from './src/ui';

/*
const client = new ApolloClient({
  uri: '${Constants.SERVER_URL}/graphql',
  cache: new InMemoryCache(),
  credentials: 'include',
})*/

const client = new ApolloClient({
  // initialize cache
  cache: new InMemoryCache(),
  //Assign your link with a new instance of a HttpLink linking to your graphql server
  link: new HttpLink({
    uri: `${Constants.SERVER_URL}/graphql`
  }),
  credentials: 'include',
});

console.log("LoginScreen",LoginScreen)
console.log("SocialLoginScreen",SocialLogin)

// this is a stag of all screens
// the screens will be popped and pushed based on user's actions
const Stack = createStackNavigator();

const App = () => {
  return (
    <PaperProvider theme={AppTheme}>
      <ApolloProvider client={client}>
        <NavigationContainer>
        <Stack.Navigator initialRouteName="SocialLogin">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              title: 'Log In',
              headerStyle: {
                backgroundColor: '#aed581',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="SocialLogin"
            component={SocialLogin}
            options={{
              title: 'Log In',
              headerStyle: {
                backgroundColor: '#aed581',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />                        
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{
              title: 'Sign Up',
              headerStyle: {
                backgroundColor: '#aed581',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Jobs....',
              headerStyle: {
                backgroundColor: '#aed581',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="JobApplication"
            component={JobApplication}
            options={{
              title: 'JobApplication....',
              headerStyle: {
                backgroundColor: '#aed581',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      </ApolloProvider>
    </PaperProvider>
  )
}

export default App;
