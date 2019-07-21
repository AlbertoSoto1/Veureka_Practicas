import React, { Component } from 'react';
import { StyleSheet,  Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { Avatar,  Button, Input } from 'react-native-elements';
import { Icon } from 'react-native-vector-icons/FontAwesome';
import RNFileSelector from 'react-native-file-selector';

import firebase from './Firestore';

export default class EditProfile extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: '', 
            surname: '', 
            mail: '', 
            password: '', 
            profileImage: undefined,
            phone: undefined, 
            newPhone : '', 
            isLoading: true, 
        };
    }
    
    selectImage(){
        console.log("Seleccionar imagen");
        return(
            <RNFileSelector title={"Selecciona una imagen"} visible={true}  onDone={() => {
                    console.log("File selected: " + path);
                }}  onCancel={() => {
                    console.log("canceled");
                }} />
        );
    }
    
    updateTextInput = (text, field) => {
        const state = this.state
        state[field] = text;
        this.setState(state);
    }
    
    updateUser(){
        this.setState({isLoading: true});
        
        var object = {
            name: this.state.name, 
            surname: this.state.surname, 
            email: this.state.mail, 
            password: this.state.password, 
        };
        
        if(this.state.newPhone != ''){
            object['phone'] = this.state.newPhone;
        }
        
        var db = firebase.firestore();
        
        db.collection('users').doc(this.props.navigation.getParam('id')).update(object).then(() => {
            console.log('Actualizacion exitosa');
            this.props.navigation.goBack();
        }).catch(err => {
            console.log(err);
            this.props.navigation.goBack();
        });
    }
    
    setAvatar(){
        if(this.state.profileImage == undefined){
            return(
                <Avatar 
                    showEditButton 
                    rounded 
                    size = 'xlarge' 
                    containerStyle = {{margin: 20}}
                    title = {this.state.name[0] + this.state.surname[0]} 
                    editButton =  {{onPress: () => {this.selectImage()}}} 
                />
            );
        }
    }
    
    setPhone(){
        if(this.state.phone == undefined){
            return(
                    <Input
                      placeholder= 'No hay teléfono registrado' 
                      onChangeText={(text) => this.updateTextInput(text, 'newPhone')} 
                    />
            );
        }
        
        return(
            <Input
                placeholder= {this.state.phone} 
                onChangeText={(text) => this.updateTextInput(text, 'newPhone')} 
            />
        );
    }
    
    obtenerDatos(){
        var userId = this.props.navigation.getParam('id');
        
        var db = firebase.firestore();
        db.collection('users').doc(userId).get().then(doc => {
            this.setState({
                name: doc.data().name, 
                surname: doc.data().surname, 
                mail: doc.data().email, 
                password: doc.data().password, 
                profileimage: doc.data().image, 
                phone: doc.data().phone, 
                isLoading: false
            });
            console.log(this.state.name);
        }).catch(err => {
            console.log("Fatal error: " , err);
            this.props.navigation.goBack();
        });
    }
    
    componentDidMount(){
        this.obtenerDatos();
    }
    
    static navigationOptions = {
        title: 'Editar perfil',
    }
    
    render(){
        if(this.state.isLoading){
            return(
                <View style = {Styles.activity}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                </View>
            );
        }
        
        return (
            <ScrollView contentContainerStyle={Styles.container}>
               
                {this.setAvatar()}
                
                <Text style={Styles.text}>Nombre</Text>
                <Input
                  placeholder={this.state.name} 
                  onChangeText={(text) => this.updateTextInput(text, 'name')} 
                />
                
                <Text style={Styles.text}>Apellidos</Text>
                <Input
                  placeholder={this.state.surname} 
                  onChangeText={(text) => this.updateTextInput(text, 'surname')} 
                />
                
                <Text style={Styles.text}>Correo</Text>
                <Input
                  placeholder={this.state.mail} 
                  onChangeText={(text) => this.updateTextInput(text, 'mail')} 
                />
                
                <Text style={Styles.text}>Teléfono</Text>
                {this.setPhone()}
                
                <Button 
                    title = 'Guardar cambios' 
                    buttonStyle = {{backgroundColor: 'green'}} 
                    containerStyle = {Styles.button}
                    onPress = {() => {this.updateUser()}} 
                />
                
            </ScrollView>
        );
    }
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    }, 
    activity: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }, 
    text: {
        fontSize: 18, 
    },
    button: {
        width: '80%', 
        margin: 20
    }
});