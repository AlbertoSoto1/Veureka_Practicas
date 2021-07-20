import React, { Component } from 'react';
import { createStackNavigator,  createAppContainer } from 'react-navigation';
import { YellowBox } from 'react-native';
import _ from 'lodash';

import Login from './components/Login';
import Error from './components/Error';
import Principal from './components/Principal';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

const AppNavigator = createStackNavigator(
  {
    LoginScreen: Login, 
    ErrorScreen: Error, 
    PrincipalScreen: {screen: Principal, navigationOptions: {header: null}}
  },
  {
    initialRouteName: 'LoginScreen'
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component{
    render(){
        return(
            <AppContainer />
        );
    }
}