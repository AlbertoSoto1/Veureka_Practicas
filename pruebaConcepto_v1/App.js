import React, { Component } from 'react';
import { createStackNavigator,  createAppContainer } from 'react-navigation';
import { YellowBox } from 'react-native';
import _ from 'lodash';

import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

const AppNavigator = createStackNavigator(
    {
        LogInScreen: LogIn, 
        SignUpScreen: SignUp, 
        ProfileScreen: Profile, 
        EditProfileScreen: EditProfile
    },
    {
        initialRouteName: 'LogInScreen'
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