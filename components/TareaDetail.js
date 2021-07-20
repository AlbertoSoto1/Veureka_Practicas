import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Icon, Button, ListItem, Overlay } from 'react-native-elements';

import firebase from './Firestore';

export default class TareaDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            fechaVisita: '', 
            horaVisita: '', 
            intervalo: '', 
            duracion: '', 
            estado: '', 
            fechaInicio: '', 
            horaInicio: '', 
            repeticiones: '', 
            fechaFinal: '', 
            horaFinal: '', 
            persona: '', 
            centroAtencion: '', 
            profesionista: '', 
            stadoTitulo: 'Termina', 
            isVisibleStop: false, 
            isVisibleActive: false, 
            isLoading: true
        };
    }

    _stopTask = () => {
        this.setState({ isVisibleStop: true });
    }

    updateTask(){
        var tareaId = this.props.navigation.getParam('tareaId','');
        var db = firebase.firestore();
        var docRef = db.collection('Tarea').doc(tareaId);

        if(this.state.estado !== 'Activa'){
            this.setState({
                isVisibleActive: true
            });
            return;
        }

        var ahora = new Date();
        var dia = ahora.getDate();
        var mes = ahora.getMonth();
        var anio = ahora.getFullYear();
        var hora = ahora.getHours();
        var minutos = ahora.getMinutes();
        var rep = parseInt(this.state.repeticiones) +1;

        if(dia < 10){
            dia = '0' + dia;
        }
        if(mes <10){
            mes = '0' + mes;
        }

        docRef.update({
            horaFinal: hora + ':' + minutos, 
            fechaFinal: dia + '/' + mes + '/' + anio,
            estado: '2', 
            repeticiones: '' + rep
        }).then(() => {
            this.setState({isVisibleActive: false});
            this.props.navigation.goBack();
        }).catch(err => {
            console.error("Error updating document:", err);
        });
    }

    obtenerDatos(){
        var tareaId = this.props.navigation.getParam('tareaId','');
        var db = firebase.firestore();

        var docRef = db.collection('Tarea').doc(tareaId);
        docRef.get().then(doc => {
            var status = "Sin realizar";
            if(doc.data().estado === '1'){
                status = "Activa";
            } else if(doc.data().estado === '2'){
                status = "Finalizada";
            }

            var status2 = "Termina";
            if(doc.data().estado === '2'){
                status2 = "Terminó";
            }

            if(doc.exists){
                this.setState({
                    fechaVisita: doc.data().fechaVisita, 
                    horaVisita: doc.data().horaVisita, 
                    intervalo: doc.data().intervalo, 
                    duracion: doc.data().duracion, 
                    estado: status, 
                    fechaInicio: doc.data().fechaInicio, 
                    horaInicio: doc.data().horaInicio, 
                    repeticiones: doc.data().repeticiones, 
                    fechaFinal: doc.data().fechaFinal, 
                    horaFinal: doc.data().horaFinal, 
                    persona: doc.data().persona, 
                    centroAtencion: doc.data().centroAtencion, 
                    profesionista: doc.data().profesionista, 
                    estadoTitulo: status2, 
                    isLoading: false
                });
            } else {
                console.log('No such document !');
            }
        }).catch(err => {
            console.log("Error getting document:", err);
            this.props.navigation.goBack();
        });
    }

    componentDidMount(){
        this.props.navigation.setParams({stopTask: this._stopTask});
        this.obtenerDatos();
    }

    static navigationOptions = ({navigation}) => {
        return{
            title: 'Detalle de Tarea', 
            headerTintColor: 'white', 
            headerStyle: {
                backgroundColor: '#019AE8'
            }, 
            headerRight: (
                <View style={Styles.headerContainer}>
                    <Button 
                        icon={
                            <Icon 
                                name='stop' 
                                color='white' 
                            />
                        } 
                        buttonStyle={{backgroundColor: 'transparent'}} 
                        onPress={navigation.getParam('stopTask')} 
                    />
                    <Button 
                        icon={
                            <Icon 
                                name='play-arrow' 
                                color='white' 
                            />
                        } 
                        buttonStyle={{backgroundColor: 'transparent'}} 
                        onPress={() => {navigation.push('StartTask', {tareaId: navigation.getParam('tareaId','')})}}
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
                    leftIcon={<Icon name='person' color='gray'/>} 
                    title={this.state.persona} 
                />
                <ListItem
                    key={1} 
                    leftIcon={<Icon name='event-seat' color='gray'/>} 
                    title={this.state.centroAtencion} 
                />
                <ListItem
                    key={2} 
                    leftIcon={<Icon name='person' color='white'/>} 
                    title={this.state.profesionista} 
                />
                <ListItem
                    key={3} 
                    leftIcon={<Icon name='date-range' color='gray'/>} 
                    title={'Visita: ' + this.state.fechaVisita + " - " + this.state.horaVisita} 
                />
                <ListItem
                    key={4} 
                    leftIcon={<Icon name='send' color='gray'/>} 
                    title={
                        <View>
                            <Text> {this.state.nombre} </Text>
                            <Text> {"Repetir cada " + this.state.intervalo + " horas"} </Text>
                            <Text> {"Durante " + this.state.duracion + " días"} </Text>
                        </View>
                    } 
                />
                <ListItem
                    key={5} 
                    leftElement={<Text style={{fontWeight: 'bold', color: 'gray'}}> Estado: </Text>} 
                    title={this.state.estado} 
                />

                <ListItem
                    key={6} 
                    leftElement={<Text style={{fontWeight: 'bold', color: 'gray'}}> Inició: </Text>} 
                    title={this.state.fechaInicio + " " + this.state.horaInicio} 
                />
                <ListItem
                    key={7} 
                    leftElement={<Text style={{fontWeight: 'bold', color: 'gray'}}> Realizada: </Text>} 
                    title={this.state.repeticiones + ' veces'} 
                />
                <ListItem
                    key={8} 
                    leftElement={<Text style={{fontWeight: 'bold', color: 'gray'}}> {this.state.estadoTitulo} </Text>} 
                    title={this.state.fechaFinal + " " + this.state.horaFinal} 
                />

                <Overlay 
                    isVisible={this.state.isVisibleStop} 
                    onBackdropPress={() => this.setState({ isVisibleStop: false })} 
                    height={170} 
                    containerStyle={Styles.overlayContainer}
                >
                    <View>
                        <Text style={Styles.overlayText}>¿Está seguro que desea detener la tarea?</Text>
                        <Button title='Detener Tarea' buttonStyle={Styles.buttonStyle} onPress={() => this.updateTask()}/>
                        <Button title='Cancelar' buttonStyle={Styles.buttonStyle} onPress={() => this.setState({ isVisibleStop: false })} />
                    </View> 
                </Overlay>

                <Overlay 
                    isVisible={this.state.isVisibleActive} 
                    onBackdropPress={() => this.setState({ isVisibleActive: false })} 
                    height={170} 
                    containerStyle={Styles.overlayContainer}
                >
                    <View>
                        <Text style={Styles.overlayText}>La tarea no se encuentra activa</Text>
                        <Button title='Aceptar' buttonStyle={Styles.buttonStyle} onPress={() => this.setState({ isVisibleActive: false })} />
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
        flexWrap: 'wrap'
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