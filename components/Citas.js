import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Icon, Button, ListItem, Overlay } from 'react-native-elements';

import firebase from './Firestore';

export default class Citas extends Component{
    constructor(props){
        super(props);
        this.state={
            arrayCitas: [], 
            toDelete: [], 
            userId: '', 
            delete: false, 
            isLoading: true
        };
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

    obtenerCitas(user){
        var db = firebase.firestore();

        db.collection('Citas').where("idPersona", "==", user).get().then(querySnapshot => {
            var obj = [];

            querySnapshot.forEach(doc => {
                obj.push(
                    <ListItem 
                        key={doc.id} 
                        leftIcon={<Icon name='today'/>} 
                        title={doc.data().fecha + " " + doc.data().hora} 
                        subtitle={
                            <View style={{color:'gray'}}>
                                <Text style={Styles.subtitleText}> {doc.data().centroAtencion} </Text>
                                <Text style={Styles.subtitleText}> {doc.data().profesionista} </Text>
                                <Text style={Styles.subtitleText}> {doc.data().persona} </Text>
                            </View>
                        } 
                        titleStyle={{color: 'black'}} 
                        subtitleProps={{color:'gray'}} 
                        containerStyle={Styles.citeContainer} 
                        onPress={() => {this.addToDelete(doc.id)}}
                    />
                );
            });

            this.setState({
                arrayCitas: obj, 
                isLoading: false
            });
        }).catch(err =>{
            console.log("Error getting document:", err);
            this.props.navigation.goback();
        });
    }

    userIsLoged(){
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                this.setState({
                    userId: user.uid, 
                });
                console.log(this.state.userId);
                this.obtenerCitas(user.uid);
            } else {
                this.props.navigation.goback();
            }
        });
    }

    deleteCite(){
        var db = firebase.firestore();
        var batch = db.batch();
        var obj = this.state.toDelete;

        console.log('datos a borrar', obj);

        for(id in obj){
            console.log('dato:', obj[id]);
            var docRef = db.collection('Citas').doc(obj[id]);
            batch.delete(docRef);
        }
        batch.commit().then(() => {
            this.setState({toDelete: [], delete: false});
            this.obtenerCitas(this.state.userId);
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

    static navigationOptions = ({navigation}) => {
        return{
            title: 'Citas', 
            headerTintColor: 'white', 
            headerStyle: {
                backgroundColor: '#019AE8'
            }, 
            headerRight: (
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

                {this.state.arrayCitas}

                <Overlay 
                    isVisible={this.state.delete} 
                    onBackdropPress={() => this.setState({ delete: false })} 
                    height={170} 
                    containerStyle={Styles.overlayContainer}
                >
                    <View>
                        <Text style={Styles.overlayText}>{'¿Está seguro que desea eliminar las citas seleccionadas? (' + this.state.toDelete.length + ')'}</Text>
                        <Button title='Eliminar' buttonStyle={Styles.buttonStyle} onPress={() => {this.deleteCite()}} />
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
