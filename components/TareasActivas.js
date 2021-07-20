import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Icon, Button, ListItem } from 'react-native-elements';

import firebase from './Firestore';

export default class TareasActivas extends Component{
    constructor(props){
        super(props);
        this.state = {
            userId: '', 
            arrayTareas: [], 
            isLoading: true
        };
    }

    static navigationOptions = ({navigation}) => {
        return{
            title: 'TareasActivas', 
            headerTintColor: 'white', 
            headerStyle: {
                backgroundColor: '#019AE8'
            }
        };
    };

    obtenerTareas(user){
        var db = firebase.firestore();

        db.collection('Tarea').where('idPersona','==', user).where('estado', '==', '1').get().then(querySnapshot => {
            var obj = [];

            querySnapshot.forEach(doc => {
                obj.push(
                    <ListItem 
                        key={doc.id} 
                        leftIcon={<Icon name='send'/>} 
                        title={doc.data().nombre} 
                        subtitle={
                            <View style={{color:'gray'}}>
                                <Text style={Styles.subtitleText}> {doc.data().persona} </Text>
                                <Text style={Styles.subtitleText}> {'Visita: ' + doc.data().fechaVisita + '-' + doc.data().horaVisita} </Text>
                                <Text style={Styles.subtitleText}> {doc.data().centroAtencion} </Text>
                                <Text style={Styles.subtitleText}> {doc.data().profesionista} </Text>
                            </View>
                        } 
                        titleStyle={{color: 'black'}} 
                        subtitleProps={{color:'gray'}} 
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
            console.log('Error getting documents!', err);
        });
    }

    userIsLoged(){
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                this.setState({
                    userId: user.uid, 
                });
                console.log(this.state.userId);
                this.obtenerTareas(user.uid);
            } else {
                this.props.navigation.goback();
            }
        });
    }

    componentDidMount(){
        this.userIsLoged();
    }

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

                {this.state.arrayTareas}

            </ScrollView>
        );
    }
}

const Styles  = StyleSheet.create({
    container: {
        backgroundColor: 'white', 
    },
    normalText: {
        fontSize: 16
    },
    subtitleText: {
        color:'gray', 
    }, 
    citeContainer: {
        backgroundColor: '#FFFE9F', 
        margin: 5
    }
});
