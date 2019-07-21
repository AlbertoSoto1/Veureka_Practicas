import React, { Component } from 'react';
import { StyleSheet, View, Picker, ActivityIndicator } from 'react-native';
import { Avatar, Input, Text, Button, Overlay } from 'react-native-elements';

import firebase from './Firestore';

export default class SignUp extends Component{
    constructor(props){
        super(props);
        this.state = {
            newName: '', 
            newSurname: '', 
            newMail: '', 
            newPassword: '',
            replayPassword: '', 
            newGenre: 'Hombre', 
            isLoading: false, 
            isVisible1: false, 
            isVisible2: false, 
            isVisible3: false, 
            isVisible4: false
        };
    }
    
    updateTextInput = (text, field) => {
        const state = this.state
        state[field] = text;
        this.setState(state);
    }
    
    checkFields(){
        if(this.state.newName === '')
            return false
        if(this.state.newSurname === '')
            return false
        if(this.state.newMail === '')
            return false
        if(this.state.newPassword === '')
            return false
        return true;
    }
    
    register(){        
        if(this.state.newPassword == this.state.replayPassword){
            if(!this.checkFields()){
                this.setState({isVisible1: true, isLoading: false});
                
                return;
            }
            
            this.setState({
                isLoading: true
            });
            
            var db = firebase.firestore();
        
            db.collection('users').add({
                name: this.state.newName, 
                surname: this.state.newSurname, 
                email: this.state.newMail, 
                password: this.state.newPassword, 
                genre: this.state.newGenre 
            }).then(ref => {
                this.setState({
                    newName: '', 
                    newSurname: '', 
                    newMail: '', 
                    newPassword: '',
                    replayPassword: '', 
                    newGenre: 'Hombre', 
                    isLoading: false, 
                });
                this.props.navigation.goBack();
            }).catch(err => {
                this.setSate({isVisible4: true});
            });
        } else {
            this.setState({
                isVisible2: true
            });
        }
    }
    
    static navigationOptions = {
        title: 'Registro',
      };
    
    render(){
        if(this.state.isLoading){
            return(
                <View style = {Styles.activity}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                </View>
            );
        }
        
        return(
            <View style = {Styles.container}>
              
              <Input 
                    placeholder = 'Nombre' 
                    containerStyle = {{margin: 10}} 
                    onChangeText={(text) => this.updateTextInput(text, 'newName')} 
                />
               
               <Input 
                    placeholder = 'Apellidos' 
                    containerStyle = {{margin: 10}} 
                    onChangeText={(text) => this.updateTextInput(text, 'newSurname')} 
                />
                
                <Input 
                    placeholder = 'Correo electrónico' 
                    containerStyle = {{margin: 10}} 
                    onChangeText={(text) => this.updateTextInput(text, 'newMail')} 
                />
                
                <Input 
                    placeholder = 'Contraseña' 
                    secureTextEntry = {true}
                    containerStyle = {{margin: 10}} 
                    onChangeText={(text) => this.updateTextInput(text, 'newPassword')} 
                />
                
                <Input 
                    placeholder = 'Repetir contraseña' 
                    secureTextEntry = {true}
                    containerStyle = {{margin: 10}} 
                    onChangeText={(text) => this.updateTextInput(text, 'replayPassword')} 
                />
                
                <Picker style={{width: '90%'}} 
                   onValueChange={(text) => this.updateTextInput(text, 'newGenre')} 
                   selectedValue={this.state.newGenre} >
                    <Picker.Item label="Hombre" value="Hombre"/>
                    <Picker.Item label="Mujer" value="Mujer"/>
                </Picker>
                
                <Button 
                    title = 'Registrarse' 
                    containerStyle = {{width: '80%', marginTop: 50, marginBottom: 30}} 
                    onPress = {() => {this.register()}} 
                />
                
                <Overlay
                    isVisible = {this.state.isVisible1} 
                    overlayStyle = {Styles.overlay}
                    onBackdropPress = {() => this.setState({isVisible1: false})} 
                >
                    <Text>Es necesario rellenar todos los campos.</Text>
                </Overlay>
                
                <Overlay
                    isVisible = {this.state.isVisible2} 
                    overlayStyle = {Styles.overlay}
                    onBackdropPress =  {() => this.setState({isVisible2: false})}
                >
                    <Text>Las contraseñas no coinciden.</Text>
                </Overlay>
                
                <Overlay
                    isVisible = {this.state.isVisible3} 
                    overlayStyle = {Styles.overlay}
                    onBackdropPress =  {() => this.setState({isVisible3: false})}
                >
                    <Text>El correo fue registrado anteriormente.</Text>
                </Overlay>
                
                <Overlay
                    isVisible = {this.state.isVisible4} 
                    overlayStyle = {Styles.overlay}
                    onBackdropPress =  {() => this.setState({isVisible4: false})}
                >
                    <Text>Ocurrió un error al registrar la cuenta.</Text>
                </Overlay>
                
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        //justifyContent: 'space-around',
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
    overlay: {
        justifyContent: 'center', 
        alignItems: 'center',
        height: 100
    }
});