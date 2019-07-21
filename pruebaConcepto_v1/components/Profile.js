import React, { Component } from 'react';
import { StyleSheet,  Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { Avatar,  Button } from 'react-native-elements';
import { Icon } from 'react-native-vector-icons/FontAwesome';

import firebase from './Firestore';

export default class  Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: '', 
            surname: '', 
            mail: '', 
            profileImage: undefined,
            phone: undefined, 
            isLoading: true, 
        }
    }
    
    setImage(){
        if(this.state.profileImage == undefined){
            return(
                <Avatar 
                    rounded 
                    size = 'xlarge' 
                    title = { this.state.name[0] + this.state.surname[0] } 
                    containerStyle = {{margin: 20}}
                />
            );
        }
    }
    
    setPhone(){
        if(this.state.phone == undefined){
            return(
                <Text style = {Styles.text}>
                    <Text>No hay teléfono registrado</Text>
                </Text>
            );
        }
        
        return(
            <Text style = {Styles.text}>
                <Text>{this.state.phone}</Text>
            </Text>
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

    static navigationOptions = ({ navigation }) => {
        return {
          title: 'Perfil',
          headerRight: (
            <Button
              buttonStyle={{ padding: 0, backgroundColor: 'transparent' }}
              icon={{ name: 'edit', style: { marginRight: 0, fontSize: 28 } }}
              onPress={() => { navigation.push('EditProfileScreen', {id: navigation.getParam('id')}) }}
            />
          ),
        };
  };
    
    render(){
        if(this.state.isLoading){
            return(
                <View style = {Styles.activity}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                </View>
            );
        }
        
        return (
            <ScrollView contentContainerStyle={Styles.container} >
                    
                {this.setImage()}
                
                <Text style = {{fontWeight: 'bold', fontSize: 24}}>{this.state.name + ' ' + this.state.surname}</Text>
                
                <Text style = {Styles.text}>
                    <Text>{this.state.mail}</Text>
                </Text>
                
                {this.setPhone()}
                   
                <Button 
                    title = 'Cerrar Sesión' 
                    buttonStyle = {{backgroundColor: 'red'}} 
                    containerStyle = {Styles.button}
                    onPress = {() => {this.props.navigation.replace('LogInScreen')}} 
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
        color: 'grey' ,
        margin: 20, 
    },
    button: {
        width: '80%', 
        margin: 20
    }
});