import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class Perfil extends Component{
    render(){
        return(
            <View style={Styles.container}>

                <Text> Pantalla Perfil </Text>

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
    }
});