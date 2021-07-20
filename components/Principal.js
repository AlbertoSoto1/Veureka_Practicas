import React, { Component } from 'react';
import {createBottomTabNavigator, createAppContainer, createStackNavigator} from 'react-navigation';
import { Icon } from 'react-native-elements';

import Visitas from './Visitas';
import VisitaDetail from './VisitaDetail';
import Citas from './Citas';
import Centros from './Centros';
import CentroDetail from './CentroDetail';
import Busqueda from './Busqueda';
import Tareas from './Tareas';
import TareasActivas from './TareasActivas';
import TareaDetail from './TareaDetail';
import IniciarTarea from './IniciarTarea';
import Perfil from './Perfil';


const VisitStack = createStackNavigator(
    {
        VisitList: Visitas, 
        VisitDetail: VisitaDetail,
        TaskList: Tareas, 
        TaskDetail: TareaDetail, 
        StartTask: IniciarTarea
    }
);

const DateStack = createStackNavigator(
    {
        DateList: Citas
    }
);

const CenterStack = createStackNavigator(
    {
        CenterList: Centros, 
        CenterDetail: CentroDetail, 
        SearchScreen: Busqueda
    }
);

const TaskStack = createStackNavigator(
    {
        TaskList: TareasActivas, 
        TaskDetail: TareaDetail
    }
);

const mainTab = createBottomTabNavigator(
    {
        visitListScreen: {
            screen: VisitStack, 
            navigationOptions: {
                title: 'Visitas', 
                tabBarIcon: ({tintColor}) => (
                    <Icon name='event-seat' color='white' size={30}/>
                )
            }
        }, 
        DateListScreen: {
            screen: DateStack, 
            navigationOptions: {
                title: 'Citas', 
                tabBarIcon: ({tintColor}) => (
                    <Icon name='today' color='white' size={30}/>
                )
            }
        },  
        CenterListScreen: {
            screen: CenterStack, 
            navigationOptions: {
                title: 'Centros Fav', 
                tabBarIcon: ({tintColor}) => (
                    <Icon name='store' color='white' size={30}/>
                )
            }
        }, 
        TaskListScreen: {
            screen: TaskStack, 
            navigationOptions: {
                title: 'Tareas Activas', 
                tabBarIcon: ({tintColor}) => (
                    <Icon name='playlist-add-check' color='white' size={30}/>
                )
            }
        }, 
        ProfileScreen: {
            screen: Perfil, 
            navigationOptions: {
                title: 'Perfil', 
                tabBarIcon: ({tintColor}) => (
                    <Icon name='person-pin' color='white' size={30}/>
                )
            }
        }
    }, 
    {
        tabBarOptions: {
            activeTintColor: 'white', 
            inactiveTintColor: 'white', 
            activeBackgroundColor: '#02BBD2', 
            inactiveBackgroundColor: '#019AE8', 
            showIcon: true, 
            showLabel: false
        }
    }
);

export default createAppContainer(mainTab);