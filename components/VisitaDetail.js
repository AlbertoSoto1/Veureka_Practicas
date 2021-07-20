import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Icon, Button, ListItem, Overlay } from 'react-native-elements';

import firebase from './Firestore';


export default class VisitaDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            id: '', 
            centroAtencion: '', 
            profesionista: '', 
            fecha: '', 
            hora: '', 
            persona: '', 
            parametros: '', 
            conclusion: '', 
            observaciones: '', 
            deleteOverlay: false, 
            isLoading: true
        };
    }

    obtenerDatos(){
        var idVisita = this.props.navigation.getParam('VisitaId', '');
        var db = firebase.firestore();
        
        var docRef = db.collection('Visita').doc(idVisita);
        docRef.get().then(doc => {
            if(doc.exists){
                this.setState({
                    id: doc.id, 
                    centroAtencion: doc.data().centroAtencion, 
                    profesionista: doc.data().profesionista, 
                    fecha: doc.data().fecha, 
                    hora: doc.data().hora, 
                    persona: doc.data().persona, 
                    parametros: doc.data().parametros, 
                    conclusion: doc.data().conclusiones, 
                    observaciones: doc.data().observaciones,
                    isLoading: false
                });
            } else {
                console.log("No such document!");
                this.props.navigation.goback();
            }
        }).catch(err => {
            console.log("Error getting document:", err);
            this.props.navigation.goback();
        });
    }

    deleteVisit(){
        var db = firebase.firestore();
        var idVisita = this.props.navigation.getParam('VisitaId', '');

        db.collection('Visita').doc(idVisita).delete().then(() => {
            this.setState({
                deleteOverlay: false
            });
            this.props.navigation.goBack();
        }).catch(err => {
            console.log('Erorr removind document!', err);
        });
    }

    _toConfirm = () => {
        this.setState({deleteOverlay: true});
    };

    componentDidMount(){
        this.obtenerDatos();
        this.props.navigation.setParams({toConfirm: this._toConfirm});
    }

    static navigationOptions = ({navigation}) => {
        return{
            title: 'Detalle de Visita', 
            headerTintColor: 'white', 
            headerStyle: {
                backgroundColor: '#019AE8'
            }, 
            headerRight: (
                <View style={Styles.headerContainer}>
                    <Button 
                        icon={
                            <Icon 
                                name='playlist-add-check' 
                                color='white' 
                            />
                        } 
                        onPress={() => {navigation.push('TaskList', {idVisita: navigation.getParam('VisitaId', '')})}}
                        buttonStyle={{backgroundColor: 'transparent'}}
                    />
                    <Button 
                        icon={
                            <Icon 
                                name='delete' 
                                color='white' 
                            />
                        } 
                        buttonStyle={{backgroundColor: 'transparent'}} 
                        onPress={navigation.getParam('toConfirm')} 
                    />
                </View>
            ), 
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

                <ListItem
                    key={0} 
                    leftIcon={<Icon name='event-seat' color='gray'/>} 
                    title={this.state.centroAtencion} 
                />
                <ListItem
                    key={1} 
                    leftIcon={<Icon name='person' color='white'/>} 
                    title={this.state.profesionista} 
                />
                <ListItem
                    key={2} 
                    leftIcon={<Icon name='date-range' color='gray'/>} 
                    title={this.state.fecha} 
                />
                <ListItem
                    key={3} 
                    leftIcon={<Icon name='timer' color='gray'/>} 
                    title={this.state.hora} 
                />
                <ListItem
                    key={4} 
                    leftIcon={<Icon name='person' color='gray'/>} 
                    title={this.state.persona} 
                />
                <ListItem
                    key={5} 
                    title='Parámetros' 
                    subtitle={this.state.parametros} 
                />
                <ListItem
                    key={6} 
                    title='Conclusión' 
                    subtitle={this.state.conclusion} 
                />
                <ListItem
                    key={7} 
                    title='Observaciones' 
                    subtitle={this.state.observaciones} 
                />

                <Overlay 
                    isVisible={this.state.deleteOverlay} 
                    onBackdropPress={() => this.setState({ deleteOverlay: false })} 
                    height={170} 
                    containerStyle={Styles.overlayContainer}
                >
                    <View>
                        <Text style={Styles.overlayText}>{'¿Está seguro que desea eliminar la visita?'}</Text>
                        <Button title='Eliminar' buttonStyle={Styles.buttonStyle} onPress={() => {this.deleteVisit()}} />
                    </View> 
                </Overlay>

            </ScrollView>
        );
    }
}

const Styles  = StyleSheet.create({
    container: {
        backgroundColor: 'white' 
    },  
    headerContainer: {
        flex: 1, 
        flexWrap: 'wrap', 
    }, 
    overlayText: {
        fontSize: 18, 
        textAlign: 'justify'
    }, 
    overlayContainer: {
        flex: 1, 
        justifyContent: 'space-between', 
        alignItems: 'center', 
    }, 
    buttonStyle: {
        margin: 5
    }
});