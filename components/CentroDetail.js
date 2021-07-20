import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Icon, Button, ListItem, Overlay } from 'react-native-elements';

import firebase from './Firestore';

export default class CentroDetail extends Component{
    constructor(props){
        super(props);
        this.state = {
            profesionista: '', 
            especialidad_1: '', 
            especialidad_2: '', 
            nombre: '', 
            telefono1: '', 
            telefono2: '', 
            telefono3: '', 
            correo: '', 
            direccion: '', 
            aviso : '', 
            deleteOverlay: false, 
            notFavoriteOverlay: false, 
            favoriteOverlay: false, 
            isFavorite: false, 
            isLoading: true
        };
    }

    obtenerDatos(){
        var centroId = this.props.navigation.getParam('centroId', '');
        var db = firebase.firestore();
        var docRef = db.collection('CentroDeAtencion').doc(centroId);

        docRef.get().then(doc => {
            if(doc.exists){
                this.setState({
                    profesionista: doc.data().profesionista, 
                    especialidad_1: doc.data().especialidad_1, 
                    especialidad_2: doc.data().especialidad_2, 
                    nombre: doc.data().nombre, 
                    telefono1: doc.data().telefono_1, 
                    telefono2: doc.data().telefono_2, 
                    telefono3: doc.data().telefono_3, 
                    correo: doc.data().correo, 
                    direccion: doc.data().direccion, 
                    aviso : doc.data().aviso,
                    isLoading: false
                });
            } else {
                console.log('No such document!');
            }
        }).catch(err => {
            console.log('Error getting document!',err);
            this.props.navigation.goBack();
        });
    }

    static navigationOptions = ({navigation}) => {
        return{
            title: 'Detalle de Centro de Atención', 
            headerTintColor: 'white', 
            headerStyle: {
                backgroundColor: '#019AE8'
            }, 
            headerRight: (
                <View style={Styles.headerContainer}>
                    <Button 
                        icon={
                            <Icon 
                                name='star' 
                                color='white' 
                            />
                        } 
                        buttonStyle={{backgroundColor: 'transparent'}} 
                        onPress={navigation.getParam('toFavorite')} 
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

    addFav(){
        console.log('AddFav');
        var db = firebase.firestore();

        var centros = {};
        centros['idCentro'] = this.props.navigation.getParam('centroId', '');
        centros['nombre'] = this.state.nombre;
        centros['profesionista'] = this.state.profesionista;

        db.collection('centrosFavoritos').add({
            idPersona: this.props.navigation.getParam('user', ''), 
            centros: centros
        }).then(() => {
            this.setState({favoriteOverlay: true});
        }).catch(err => {
            console.error('Error adding document!', error);
        });
    }

    addFavorite(){
        var db = firebase.firestore();

        db.collection('centrosFavoritos').where('idPersona', '==', this.props.navigation.getParam('user', '')).where('centros.idCentro', '==', this.props.navigation.getParam('centroId', '')).get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                if(doc.exists){
                    this.setState({isFavorite: true});
                    return;
                } else {
                    this.addFav();
                }
            });
            this.addFav();
        }).catch(err => {
            console.log('Error getting documents:', err);
            this.addFav();
        });
    }

    deleteCenter(){
        var db = firebase.firestore();
        var idDoc = this.props.navigation.getParam('docId', '');
        var isFavorite = this.props.navigation.getParam('favorite', false);

        if(!isFavorite){
            this.setState({notFavoriteOverlay: true});
            return;
        }

        db.collection('centrosFavoritos').doc(idDoc).delete().then(() => {
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

    _toFavorite = () => {
        this.addFavorite();
    };

    componentDidMount(){
        this.obtenerDatos();
        this.props.navigation.setParams({toConfirm: this._toConfirm, toFavorite: this._toFavorite});
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

                <ListItem 
                    key={0} 
                    leftIcon={<Icon name='event-seat' color='gray'/>} 
                    title={this.state.nombre} 
                />
                <ListItem 
                    key={1} 
                    leftIcon={<Icon name='person' color='gray'/>} 
                    title={this.state.profesionista} 
                />
                <Text style={{fontWeight: 'bold', color: 'gray'}}> especialidad 1: </Text>
                <ListItem 
                    key={2} 
                    leftIcon={<Icon name='person' color='white'/>} 
                    title={this.state.especialidad_1} 
                />
                <Text style={{fontWeight: 'bold', color: 'gray'}}> especialidad 2: </Text>
                <ListItem 
                    key={3} 
                    leftIcon={<Icon name='person' color='white'/>} 
                    title={this.state.especialidad_2} 
                />
                <ListItem 
                    key={4} 
                    leftIcon={<Icon name='phone' color='gray'/>} 
                    title={this.state.telefono1} 
                />
                <ListItem 
                    key={5} 
                    leftIcon={<Icon name='phone' color='gray'/>} 
                    title={this.state.telefono2} 
                />
                <ListItem 
                    key={6} 
                    leftIcon={<Icon name='phone' color='gray'/>} 
                    title={this.state.telefono3} 
                />
                <ListItem 
                    key={7} 
                    leftIcon={<Icon name='mail-outline' color='gray'/>} 
                    title={this.state.correo} 
                />
                <ListItem
                    key={8} 
                    leftIcon={<Icon name='store' color='gray'/>} 
                    title={this.state.direccion}
                />
                <ListItem
                    key={9} 
                    leftElement={<Text style={{fontWeight: 'bold', color: 'gray'}}> Aviso: </Text>} 
                    title={this.state.aviso} 
                />

                <Overlay 
                    isVisible={this.state.deleteOverlay} 
                    onBackdropPress={() => this.setState({ deleteOverlay: false })} 
                    height={170} 
                    containerStyle={Styles.overlayContainer}
                >
                    <View>
                        <Text style={Styles.overlayText}>{'¿Está seguro que desea eliminar el centro de la lista de favoritos?'}</Text>
                        <Button title='Eliminar' buttonStyle={Styles.buttonStyle} onPress={() => {this.deleteCenter()}} />
                    </View> 
                </Overlay>

                <Overlay 
                    isVisible={this.state.notFavoriteOverlay} 
                    onBackdropPress={() => this.setState({ notFavoriteOverlay: false })} 
                    height={170} 
                    containerStyle={Styles.overlayContainer}
                >
                    <View>
                        <Text style={Styles.overlayText}>{'Este centro de atención no está en tus favoritos'}</Text>
                        <Button title='Aceptar' buttonStyle={Styles.buttonStyle} onPress={() => {this.setState({notFavoriteOverlay: false})}} />
                    </View> 
                </Overlay>

                <Overlay 
                    isVisible={this.state.favoriteOverlay} 
                    onBackdropPress={() => this.setState({favoriteOverlay: false })} 
                    height={170} 
                    containerStyle={Styles.overlayContainer}
                >
                    <View>
                        <Text style={Styles.overlayText}>{'El centro de atención se agrego a tus favoritos'}</Text>
                        <Button title='Aceptar' buttonStyle={Styles.buttonStyle} onPress={() => {this.setState({favoriteOverlay: false})}} />
                    </View> 
                </Overlay>

                <Overlay 
                    isVisible={this.state.isFavorite} 
                    onBackdropPress={() => this.setState({isFavorite: false })} 
                    height={170} 
                    containerStyle={Styles.overlayContainer}
                >
                    <View>
                        <Text style={Styles.overlayText}>{'El centro de atención ya está en tus favoritos'}</Text>
                        <Button title='Aceptar' buttonStyle={Styles.buttonStyle} onPress={() => {this.setState({isFavorite: false})}} />
                    </View> 
                </Overlay>

            </ScrollView>
        );
    }
}

const Styles  = StyleSheet.create({
    container: {
        backgroundColor: 'white', 
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