import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Icon, Button, ListItem, Overlay } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';

import firebase from './Firestore';

export default class Centros extends Component{
    constructor(props){
        super(props);
        this.state = {
            arrayCentros: [], 
            userId: '', 
            toDelete: [], 
            delete: false, 
            isLoading:true
        };
    }

    obtenerCentros(user){
        var db = firebase.firestore();

        db.collection('centrosFavoritos').where('idPersona','==', user).get().then(querySnapshot => {
            var obj = [];

            querySnapshot.forEach(doc => {
                obj.push(
                    <ListItem 
                        key={doc.id} 
                        leftIcon={<Icon name='store' color='gray'/>} 
                        title={doc.data().centros.nombre} 
                        subtitle={doc.data().centros.profesionista} 
                        titleStyle={{color: 'black'}} 
                        subtitleProps={{color:'gray'}} 
                        containerStyle={Styles.citeContainer} 
                        onPress={() => {this.props.navigation.push('CenterDetail', {centroId: doc.data().centros.idCentro, favorite: true, docId: doc.id, user: this.state.userId})}} 
                        onLongPress={() => {this.addToDelete(doc.id)}} 
                    />
                );
            });

            this.setState({
                arrayCentros: obj, 
                isLoading: false
            });
        }).catch(err => {
            console.log('Error getting documents!', err);
        });
    }

    static navigationOptions = ({navigation}) => {
        return{
            title: 'Centros de Atención Favoritos', 
            headerTintColor: 'white', 
            headerStyle: {
                backgroundColor: '#019AE8'
            }, 
            headerRight: (
                <View style={Styles.headerContainer}>
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
                    <Button 
                        icon={
                            <Icon 
                                name='search' 
                                color='white' 
                            />
                        } 
                        buttonStyle={{backgroundColor: 'transparent'}} 
                        onPress={() => {navigation.push('SearchScreen')}}
                    />
                </View>
            ), 
        };
    };

    userIsLoged(){
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                this.setState({
                    userId: user.uid, 
                });
                console.log(this.state.userId);
                this.obtenerCentros(user.uid);
            } else {
                this.props.navigation.goback();
            }
        });
    }

    addToDelete(id){
        var obj = this.state.toDelete;

        if(obj.length > 0){
            if(obj.find(id) == undefined){
                obj.push(id);
                this.setState({toDelete: obj});
            }
        } else {
            obj.push(id);
            this.setState({toDelete: obj});
        }
    }

    deleteCenter(){
        var db = firebase.firestore();
        var batch = db.batch();
        var obj = this.state.toDelete;

        console.log('datos a borrar', obj);

        for(id in obj){
            console.log('dato:', obj[id]);
            var docRef = db.collection('centrosFavoritos').doc(obj[id]);
            batch.delete(docRef);
        }
        batch.commit().then(() => {
            this.setState({toDelete: [], delete: false});
            this.obtenerCentros(this.state.userId);
        }).catch(err => {
            console.log('Error deletting documents!', err);
        });
    }

    _toConfirm = () => {
        this.setState({delete: true});
    };

    componentDidMount(){
        this.userIsLoged();
        this.props.navigation.setParams({toConfirm: this._toConfirm});
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

                <NavigationEvents villFocus={this.obtenerCentros(this.state.userId)}/>

                {this.state.arrayCentros}

                <Overlay 
                    isVisible={this.state.delete} 
                    onBackdropPress={() => this.setState({ delete: false })} 
                    height={170} 
                    containerStyle={Styles.overlayContainer}
                >
                    <View>
                        <Text style={Styles.overlayText}>{'¿Está seguro que desea eliminar los centros seleccionadas? (' + this.state.toDelete.length + ')'}</Text>
                        <Button title='Eliminar' buttonStyle={Styles.buttonStyle} onPress={() => {this.deleteCenter()}} />
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
    normalText: {
        fontSize: 16
    },
    subtitleText: {
        color:'gray', 
    }, 
    citeContainer: {
        backgroundColor: '#FFFE9F', 
        margin: 5
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