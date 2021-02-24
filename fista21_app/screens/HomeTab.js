import React, { Component } from 'react';
import {  View,BackHandler} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'
import Scanner from './Scanner'
import Profile from './Profile'
import Game from './Game'
import {Icon } from 'react-native-elements';
import ProfileSettings from './ProfileSettings'
import Companies from './Companies'
import HomeFeed from './Feed'
import Workshops from './Workshops'

import { BottomFabBar } from 'rn-wave-bottom-bar';
import KeynotesDetails from './KeynotesDetails';
import WorkshopsDetails from './WorkshopsDetails';
import CompaniesDetails from './CompaniesDetails';
import FeedDetails from './FeedDetails';
import Sobre from './Sobre';
import { Dimensions, StyleSheet} from 'react-native';



const width = Dimensions.get('window').width;

const stack = createStackNavigator();







const MenuStackScreen = () =>{

    return (
        <stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: '#fff',
              },
            
            
            }}
            initialRouteName='Menu'
        >
            <stack.Screen name="Minha Conta"   options={{ headerShown: false }}component={Profile} />
            <stack.Screen name="WorkshopsDetails" options={{ headerShown: false ,backgroundColor:'white'}} component={WorkshopsDetails} />
            <stack.Screen name="Configurações" style={{backgroundColor:'white'}} component={ProfileSettings} />
            <stack.Screen name="Sobre" style={{backgroundColor:'white'}} component={Sobre} />
         
        </stack.Navigator >
    );
}

const CompaniesStackScreen = () =>{

  return (
      <stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: 'white',
            },
            backgroundColor:'white',
          
          
          }}
          initialRouteName='Menu'
      >
          <stack.Screen name="Empresas"   options={{ headerShown: false ,backgroundColor:'white'}}component={Companies} />
          <stack.Screen name="CompaniesDetails"  options={{ headerShown: false ,backgroundColor:'white'}} component={CompaniesDetails} />
       
      </stack.Navigator >
  );
        }

  const WorkshopsStackScreen = () =>{

    return (
        <stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: 'white',
              },
              backgroundColor:'white',
            
            
            }}
            initialRouteName='Workshops'
            
        >
            <stack.Screen name="Workshops"   options={{ headerShown: false ,backgroundColor:'white'}}component={Workshops} />
            <stack.Screen name="WorkshopsDetails" options={{ headerShown: false ,backgroundColor:'white'}} component={WorkshopsDetails} />
            <stack.Screen name="KeynotesDetails" options={{ headerShown: false ,backgroundColor:'white'}} component={KeynotesDetails} />
         
        </stack.Navigator >
    );
  }


const GameStackScreen = () =>{

  return (
      <stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#fff',
            },
          
          
          }}
          initialRouteName='Menu'
      >
          <stack.Screen name="Game"   options={{ headerShown: false }}component={Game} />
          <stack.Screen name="Scanner" style={{headerShown: false}} component={Scanner} />
       
      </stack.Navigator >
  );
}

const FeedStackScreen = () =>{

  return (
      <stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: 'white',
            },
       
          
          }}
          initialRouteName='Menu'
          
      >
          <stack.Screen name="Feed"   options={{ headerShown: false ,backgroundColor:'white'}}component={HomeFeed} />
          <stack.Screen name="Publicação"  options={{ headerShown: false ,backgroundColor:'white'}} component={FeedDetails} />
       
      </stack.Navigator >
  );
}



const Tab = createBottomTabNavigator();

const tabBarIcon = (nome,expr) => ({
  focused
}) => {

  switch(expr) {
    case 0:
      return <View style={focused? styles.focus:styles.nfocus}>
        <Icon name={nome} type='antdesign'
      color={focused ? '#90C166' : 'white'} size={iconSize}></Icon></View>;

    case 1:
      return <View style={focused? styles.focus:styles.nfocus}>
       <Icon name={nome}type='font-awesome-5'  color={focused ? '#90C166' : 'white'}size={focused ?iconSiza:iconSize}></Icon>
       </View>;
     case 2:
      return <View style={focused? styles.focus:styles.nfocus}>
      <Icon name={nome}type='material-community'  color={focused ? '#90C166' : 'white'}size={focused ?iconSiza:iconSize}></Icon></View>;;
    case 3 :
      return <View style={focused? styles.focus:styles.nfocus}>
       <Icon name={nome}type='feather'  raised={true}  color={focused ? '#90C166' : 'white'}size={focused ?iconSiza:iconSize}></Icon></View>;;
    case 4 :
      return <View style={focused? styles.focus:styles.nfocus}>
      <Icon name={nome}type='material' raised={true}   color={focused ? '#90C166' : 'white'}size={focused ?iconSiza:iconSize}></Icon></View>;;
    case 5:
        return <View style={focused? styles.focus:styles.nfocus}>
        <Icon name={nome}type='font-awesome' raised={true}   color={focused ? '#90C166' : 'white'}size={focused ?iconSiza:iconSize}></Icon></View>;;
    case 6:
        return <View style={focused? styles.focus:styles.nfocus}>
        <Icon name={nome}type='simple-line-icon'  color={focused ? '#90C166' : 'white'}size={focused ?iconSiza:iconSize}></Icon></View>;
    case 7:
        return <View style={focused? styles.focus:styles.nfocus}>
         <Icon name={nome}type='ionicon' color={focused ? '#90C166' : 'white'}size={focused ?iconSiza:iconSize}></Icon></View>;
    default:
    // code block
}
}

class HomeTab extends Component{




  render(){
  return (
    <PaperProvider>
        <Tab.Navigator
          tabBarOptions={{
            activeTintColor: 'white',
            inactiveTintColor: 'orange',
            activeBackgroundColor:'orange',
            inactiveBackgroundColor:'blue',
         
         
          
          }}
          initialRouteName='HomeFeed'
          tabBar={(props) => (
            <BottomFabBar
              color="#90C166"
              bottomBarContainerStyle={{
               position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,

               }}
              {...props}
            />
          )}>
            
          <Tab.Screen
            options={{tabBarIcon: tabBarIcon('briefcase',6),tabBarOptions:{shadowColor: "#000",shadowOffset: {width: 0,height:  4,},shadowOpacity: 0.1,shadowRadius: 3}} }
            name="Empresas"
         
            component={CompaniesStackScreen}
          />
           <Tab.Screen
            
            options={{
              unmountOnBlur: true,
              
              tabBarIcon: tabBarIcon('microphone',6)}}
            name="Workshops"
            component={WorkshopsStackScreen}
          />
           <Tab.Screen
            options={{tabBarIcon: tabBarIcon('home',0)}}
            name="HomeFeed"
            component={FeedStackScreen}
          />
          <Tab.Screen
            options={{tabBarIcon: tabBarIcon('ios-game-controller-outline',7)}}
            name="Trophy"
            component={GameStackScreen}
          />
          <Tab.Screen
            name="Minha Conta"
            options={{tabBarIcon: tabBarIcon('user-circle',1)}}
            component={MenuStackScreen}
          />
        </Tab.Navigator>
    </PaperProvider>
  );
              }
            }
          
export default HomeTab;



const iconSize = width* 0.058;
const iconSiza = width* 0.050;

const height = Dimensions.get('window').height;


const styles = StyleSheet.create({

focus: {
  width:(width*0.125),height:width*0.125,justifyContent:'center',alignContent:'center',backgroundColor:'white',borderRadius:100, shadowColor: "#000",shadowOffset: {width:0,height: 0,},shadowOpacity: 0.15,shadowRadius: 3,
},
nfocus: {
  backgroundColor:'transparent',
}
})