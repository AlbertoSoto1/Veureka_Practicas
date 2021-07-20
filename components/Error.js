import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, Button } from 'react-native-elements';

export default class Error extends Component{

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
                    icon={{name: 'error-outline'}} 
                    overlayContainerStyle={{backgroundColor: '#02BBD2'}}
                />

                <Text style={Styles.boldText}> UPS... no puede ingresar </Text>

                <Text style={Styles.normalText}> Su usuario y/o contraseña son incorrectos, intentelo nuevamente. </Text>

                <Button 
                    title='Trate nuevamente' 
                    titleStyle={Styles.normalText} 
                    containerStyle={Styles.buttonContainer} 
                    buttonStyle={{backgroundColor: '#02BBD2'}} 
                    onPress={() => {this.props.navigation.replace('LoginScreen')}}
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
        justifyContent: 'space-around', 
    }, 
    normalText: {
        fontSize: 18
    }, 
    boldText: {
        fontSize: 18, 
        fontWeight: 'bold'
    }, 
    buttonContainer: {
        width: '70%', 
    }
});