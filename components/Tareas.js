import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Icon, Button, ListItem } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';

import firebase from './Firestore';

export default class Tareas extends Component{
    constructor(props){
        super(props);
        this.state={
            arrayTareas: [], 
            isLoading: true
        };
    }

    obtenerDatos(){
        var idVisita = this.props.navigation.getParam('idVisita', '');
        var db = firebase.firestore();

        db.collection('Tarea').where('idVisita', '==', idVisita).get().then(querySnapshot => {
            var obj = [];

            querySnapshot.forEach(doc => {
                var itemIcon = <Icon name='done'/>;
                if(doc.data().estado === '1'){
                    itemIcon = <Icon name='done'/>;
                } else if(doc.data().estado === '2'){
                    itemIcon = <Icon name='done-all'/>;
                } else {
                    itemIcon = <Icon name='done' color='#FFFE9F'/>;
                }

                obj.push(
                    <ListItem 
                    key={doc.id} 
                    leftIcon={<Icon name='send'/>} 
                    title={doc.data().nombre} 
                    subtitle={
                        <View>
                            <Text style={Styles.subtitleText}> {"Repetir cada " + doc.data().intervalo + " horas"} </Text>
                            <Text style={Styles.subtitleText}> {"Durante " + doc.data().duracion + " dias"} </Text>
                        </View>
                    } 
                    rightIcon={itemIcon} 
                    titleStyle={{color: 'black'}} 
                    containerStyle={Styles.citeContainer} 
                    onPress={() => {this.props.navigation.push('TaskDetail', {tareaId: doc.id})}}
                />
                );
            });

            this.setState({
                arrayTareas: obj, 
                isLoading: false
            });
        }).catch(err => {
            console.log("Error getting documents:", error);
            this.props.navigation.goBack();
        });
    }
    
    componentDidMount(){
        this.obtenerDatos();
    }

    static navigationOptions = ({navigation}) => {
        return{
            title: 'Tareas', 
            headerTintColor: 'white', 
            headerStyle: {
                backgroundColor: '#019AE8'
            }
        };
    };

    render(){
        if(this.state.isLoading){
            return(
                <View>
                    <ActivityIndicator size='large' color='#0000ff'/>
                </View>
            );
        }

        return(
            <ScrollView style={Styles.container}>

            <NavigationEvents willFocus={this.obtenerDatos()}/>

                {this.state.arrayTareas}

            </ScrollView>
        );
    }
}

const Styles  = StyleSheet.create({
    container: {
        backgroundColor: 'white', 
    }, 
    subtitleText: {
        color:'gray', 
    }, 
    citeContainer: {
        backgroundColor: '#FFFE9F', 
        margin: 5
    }, 
    doubleCheck: {
        flex: 1, 
        flexWrap: 'wrap', 
        justifyContent: 'space-between'
    }
});