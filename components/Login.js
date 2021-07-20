import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar,  Input, Button }from 'react-native-elements';

import firebase from './Firestore';

export default class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            mail: '', 
            password: ''
        }
    }

    updateTextInput = (text, field) => {
        const state = this.state;
        state[field] = text;
        this.setState(state);
    }

    logger(){
        firebase.auth().signInWithEmailAndPassword(this.state.mail, this.state.password).then((user) => {
            this.props.navigation.replace('PrincipalScreen');
        }).catch(error => {
            this.props.navigation.replace('ErrorScreen');
        });
    }

    static navigationOptions = ({navigation}) => {
        return{
            header: null
        };
    };

    render(){

        return(
            <View style={Styles.container}>

                <Avatar 
                    size='xlarge' 
                    icon={{name: 'account-circle'}}
                    containerStyle={{margin: 5}} 
                />

                <Input 
                    placeholder='Email' 
                    inputStyle={Styles.inputText} 
                    onChangeText={(text) => {this.updateTextInput(text, 'mail')}}
                />

                <Input 
                    placeholder='Password' 
                    inputStyle={Styles.inputText} 
                    onChangeText={(text) => {this.updateTextInput(text, 'password')}}
                />

                <Button 
                    title='Ingresar' 
                    titleStyle={Styles.normalText} 
                    buttonStyle={{backgroundColor:'#02BBD2'}}
                    containerStyle={Styles.buttonContainer} 
                    onPress={() => {this.logger()}}
                />

            </View>
        );
    }
}

const Styles  = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: 'white', 
        alignItems: 'center',
        justifyContent: 'space-around'
    }, 
    normalText: {
        fontSize: 18
    }, 
    buttonContainer: {
        width: '70%', 
    }, 
    inputText: {
        textAlign: 'center', 
        fontSize: 18
    }
});