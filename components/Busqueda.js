import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, Picker, ActivityIndicator } from 'react-native';
import { Icon, Button, ListItem, Input } from 'react-native-elements';

import firebase from './Firestore';

export default class Busqueda extends Component{
    constructor(props){
        super(props);
        this.state = {
            userId: '', 
            topic: 'nombre', 
            busqueda: '', 
            arrayCentros: [], 
        };
    }

    static navigationOptions = ({navigation}) => {
        return{
            title: 'Buscar Centro de Atención', 
            headerTintColor: 'white', 
            headerStyle: {
                backgroundColor: '#019AE8'
            } 
        };
    };

    buscar(){
        var db = firebase.firestore();

        db.collection('CentroDeAtencion').get().then(querySnapshot => {
            var obj = [];

            querySnapshot.forEach(doc => {
                if(doc.data()[this.state.topic].search(this.state.busqueda) >= 0){
                    obj.push(
                        <ListItem 
                            key={doc.id} 
                            leftIcon={<Icon name='person' color='gray'/>} 
                            title={doc.data().profesionista} 
                            subtitle={
                                <View style={{color:'gray'}}>
                                    <Text style={Styles.subtitleText}> {doc.data().nombre} </Text>
                                    <Text style={Styles.subtitleText}> {doc.data().telefono_1} </Text>
                                    <Text style={Styles.subtitleText}> {doc.data().direccion} </Text>
                                </View>
                            } 
                            titleStyle={{color: 'black'}} 
                            subtitleProps={{color:'gray'}} 
                            containerStyle={Styles.citeContainer} 
                            onPress={() => {this.props.navigation.push('CenterDetail', {centroId: doc.id, favorite: false, docId: doc.id, user: this.state.userId})}}
                        />
                    );
                }
            });

            this.setState({
                arrayCentros: obj, 
            });
        }).catch(err =>{
            console.log("Error getting document:", err);
        });
    }

    updateTextInput = (text, field) => {
        const state = this.state
        state[field] = text;
        this.setState(state);
    }

    userIsLoged(){
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                this.setState({
                    userId: user.uid, 
                });
                console.log(this.state.userId);
            } else {
                this.props.navigation.goback();
            }
        });
    }
    componentDidMount(){
        this.userIsLoged();
    }

    render(){
        return(
            <View style={Styles.container}>

                <View style={{margin: 10}}>
                    <Text style={{fontWeight: 'bold', color: 'gray'}}> Buscar por: </Text>
                    <Input 
                        leftIcon={
                            <Picker 
                                selectedValue='NOMBRE' 
                                style={{width: 140}} 
                                onValueChange={(text) => this.updateTextInput(text, 'topic')} 
                                selectedValue={this.state.topic}
                                >
                                <Picker.Item label='NOMBRE' value='nombre'/>
                                <Picker.Item label='ESPECIALIDAD' value='especialidad_1'/>
                                <Picker.Item label='PROFESIONISTA' value='profesionista'/>
                            </Picker>
                        }
                        placeholder='Ingrese texto...' 
                        containerStyle={{width: '100%'}} 
                        rightIcon={
                            <Icon 
                                name='search' 
                                color='white' 
                                containerStyle={{backgroundColor: '#4B96EC'}} 
                                onPress={() => {this.buscar()}}
                            />
                        } 
                        onChangeText={(text) => this.updateTextInput(text, 'busqueda')} 
                    />
                </View>

                <ScrollView>
                    
                    {this.state.arrayCentros}

                </ScrollView>

            </View>
        );
    }
}

const Styles  = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    }, 
    subtitleText: {
        color:'gray', 
    }, 
    citeContainer: {
        backgroundColor: '#FFFE9F', 
        margin: 5
    }
});