import React, { Component } from 'react';
import  { View, StyleSheet } from 'react-native';
import { Avatar, Input, Button, Text } from 'react-native-elements';

import firebase from './Firestore';

export default class LogIn extends Component{
    constructor(props){
        super(props);
        this.state = {
            userMail: '', 
            userPassword: ''
        };
    }
    
    updateTextInput = (text, field) => {
        const state = this.state
        state[field] = text;
        this.setState(state);
    }
    
    Logger(){
        var db = firebase.firestore();
        
        db.collection('users').where('email', '==', this.state.userMail).get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                console.log(doc.data()); // Borrar
                if(doc.data().password === this.state.userPassword){
                    this.props.navigation.replace('ProfileScreen', {id : doc.id} );
                } else {
                    console.log(this.state.userPassword);
                    console.log("Contraseña incorrecta");
                }
            });
        }).catch(err => {
            console.log("Error Gettin Document");
        });
        
    }
    
    render(){
        const { navigation } = this.props;
        
        return(
            <View style = {Styles.container}>
                
                <Avatar 
                    rounded 
                    size = 'xlarge' 
                    icon = {{name: 'user',  type: 'font-awesome'}} 
                    containerStyle = {{margin: 20}} 
                />
                
                <Input 
                    placeholder = 'Correo' 
                    leftIcon = {
                        <Avatar 
                            size = {30} 
                            icon = {{name: 'envelope', type: 'font-awesome'}} 
                            containerStyle = {{marginRight: 20}} 
                        />
                    } 
                    onChangeText={(text) => this.updateTextInput(text, 'userMail')} 
                />
                
                <Input 
                    placeholder = 'Contraseña' 
                    leftIcon = {
                        <Avatar 
                            size = {30} 
                            icon = {{name: 'key', type: 'font-awesome'}} 
                            containerStyle = {{marginRight: 20}} 
                        />
                    } 
                    onChangeText={(text) => this.updateTextInput(text, 'userPassword')} 
                    secureTextEntry = {true}
                    containerStyle = {{marginBottom: 30}}
                />
                
                <Text>Olvidé mi contraseña</Text>
                
                <Button 
                    title = 'Ingresar' 
                    containerStyle = {{width: '80%', marginTop: 50, marginBottom: 30}}
                    onPress = {() => {this.Logger()}}
                />
                
                <Text onPress={() => { this.props.navigation.push('SignUpScreen') } } > 
                    ¿Aún no tienes cuenta? 
                    <Text style = {{fontWeight: 'bold'}}> 
                        {' Regístrate'}
                    </Text> 
                </Text> 
                
                
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        //justifyContent: 'space-around',
    }
});