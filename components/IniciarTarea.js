import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Icon, Button, ListItem, Input, Overlay } from 'react-native-elements';

import firebase from './Firestore';

export default class IniciarTarea extends Component{
    constructor(props){
        super(props);
        this.state={
            nombre: '', 
            intervalo: '', 
            duracion: '', 
            fechaInicio: '', 
            horaInicio: '', 
            isLoading: true, 
            isVisiblecheck: false
        }
    }

    

    updateTextInput = (text, field) => {
        const state = this.state;
        state[field] = text;
        this.setState(state);
    }

    obtenerDatos(){
        var tareaId = this.props.navigation.getParam('tareaId','');
        var db = firebase.firestore();
        var docRef = db.collection('Tarea').doc(tareaId);

        docRef.get().then(doc => {
            var ahora = new Date();
            var dia = ahora.getDate();
            var mes = ahora.getMonth();
            var anio = ahora.getFullYear();
            var hora = ahora.getHours();
            var minutos = ahora.getMinutes();

            if(dia < 10){
                dia = '0' + dia;
            }
            if(mes <10){
                mes = '0' + mes;
            }

            if(doc.exists){
                this.setState({
                    nombre: doc.data().nombre, 
                    intervalo: doc.data().intervalo, 
                    duracion: doc.data().duracion, 
                    fechaInicio: dia + '/' + mes + '/' + anio, 
                    horaInicio: hora + ':' + minutos,
                    isLoading: false
                });
            } else {
                console.log('No such document!');
                this.props.navigation.goBack();
            }
        }).catch(err => {
            console.log('Error getting document:', err);
        });
    }

    componentDidMount(){
        this.props.navigation.setParams({updateTask: this._updateTask});
        this.obtenerDatos();
    }

    _updateTask = () => {
        console.log('Entró a la funcion')
        if(this.state.fechaInicio === '' || this.state.horaInicio === ''){
            this.setState({
                isVisiblecheck: true
            });
            return;
        }

        var tareaId = this.props.navigation.getParam('tareaId','');
        var db = firebase.firestore();
        var docRef = db.collection('Tarea').doc(tareaId);

        var diaFinal = this.state.fechaInicio[0] + this.state.fechaInicio[1];
        var mes = this.state.fechaInicio[3] + this.state.fechaInicio[4];
        var anio = this.state.fechaInicio[6] + this.state.fechaInicio[7] + this.state.fechaInicio[8] + this.state.fechaInicio[9];

        docRef.update({
            estado: '1',
            horaInicio: this.state.horaInicio, 
            fechaInicio: this.state.fechaInicio,
            fechaFinal: (parseInt(this.state.duracion) + parseInt(diaFinal)) + '/' + mes + '/' + anio, 
            horaFinal: this.state.horaInicio, 
        }).then(() => {
            this.props.navigation.navigate('TaskList');
        }).catch(err => {
            console.error("Error updating document:", err);
        });
    };

    static navigationOptions = ({navigation}) => {
        return{
            title: 'Iniciar Tarea', 
            headerTintColor: 'white', 
            headerStyle: {
                backgroundColor: '#019AE8'
            }, 
            headerRight: (
                <View style={Styles.headerContainer}>
                    <Button 
                        icon={
                            <Icon 
                                name='close' 
                                color='white' 
                            />
                        } 
                        onPress={() => {navigation.navigate('TaskList')}} 
                        buttonStyle={{backgroundColor: 'transparent'}}
                    />
                    <Button 
                        icon={
                            <Icon 
                                name='check' 
                                color='white' 
                            />
                        } 
                        buttonStyle={{backgroundColor: 'transparent'}} 
                        onPress={navigation.getParam('updateTask')} 
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
                    leftIcon={<Icon name='send' color='gray'/>} 
                    title={this.state.nombre}
                />
                <ListItem
                    key={1} 
                    leftIcon={<Icon name='timer' color='white'/>} 
                    title={'repetir cada ' + this.state.intervalo + ' horas'}
                />
                <ListItem
                    key={2} 
                    leftIcon={<Icon name='date-range' color='white'/>} 
                    title={'Durante ' + this.state.duracion + 'días'}
                />
                <ListItem
                    key={3} 
                    title='seleccionar fecha y hora de arranque:'
                />
                <ListItem
                    key={4} 
                    leftIcon={<Icon name='date-range' color='gray'/>} 
                    title={<Input placeholder={this.state.fechaInicio} onChangeText={(text) => {this.updateTextInput(text, 'fechaInicio')}}/>} 
                />
                <ListItem
                    key={5} 
                    leftIcon={<Icon name='timer' color='gray'/>} 
                    title={<Input placeholder={this.state.horaInicio} onChangeText={(text) => {this.updateTextInput(text, 'horaInicio')}}/>} 
                />

                <Overlay 
                    isVisible={this.state.isVisiblecheck} 
                    onBackdropPress={() => this.setState({ isVisiblecheck: false })} 
                >
                    <Text style={Styles.overlayText}>Por favor rellena todos los campos</Text> 
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
        justifyContent: 'center', 
        alignContent: 'center'
    }
});