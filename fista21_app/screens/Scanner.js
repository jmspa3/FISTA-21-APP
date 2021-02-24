import React, { Component} from 'react';
import { KeyboardAvoidingView, Modal,Animated,ActivityIndicator,TextInput,Text,TouchableOpacity, View,Alert } from 'react-native';
import API from '../components/api.js';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';
import {Icon } from 'react-native-elements';
const active = 'rgba(249, 249, 249, 1)';

const size = Dimensions.get('window').width;
const { width } = Dimensions.get('window');


export default class ScannerView extends Component  {
  state = {
    textToken:'',
    fontsLoaded:false,
    loading:false,
    modalToken:false,
    alerta:'',
    fadeIn2: new Animated.Value(0),
    fadeOut2: new Animated.Value(1),
  };
   
  wait = timeout => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  };

  fadeIn2(press) {
    this.state.fadeIn2.setValue(0)                  
    Animated.timing(
      this.state.fadeIn2,           
      {
        toValue: 1,                   
        duration: 1300,
        useNativeDriver: true              
      }
    ).start(() => this.fadeOut2(press));                        
  }
  
  fadeOut2(press) {
    Animated.timing(                  
       this.state.fadeIn2,            
       {
         toValue: 0,                   
         duration: 1400,
         useNativeDriver: true              
       }
    ).start();
    this.wait(2200).then(() => {this.setState({modalToken: false})});     
    this.wait(1000).then(() => { press();});     

                     
  }

  async validarToken() {
    this.setState({loading:true});
    try {
       const body = JSON.stringify({
        token: this.state.textToken,
        id: await AsyncStorage.getItem('user_token'),
      
        });
        API.doRequest("POST", "gametoken", body )
        .then(response => response.json()).then(async data => {
            if(data.code === 200){
               this.props.updateQ(JSON.stringify(data.questoes),this.state.textToken);
    
               this.setState({modalToken:true})
               this.setState({alerta: 'Token válido'})
               this.fadeIn2(  this.props.nxtQV);
               this.setState({loading:false});
          
            }else{

              this.setState({modalToken:true})
              this.setState({alerta: data.questoes})
              this.fadeIn2(this.props.nxtStart);
              this.setState({loading:false});

        
            }

            })
            .catch(() => { Alert.alert("Erro na ligação", "Não é possivel enviar o token", [{ text: 'OK' ,  onPress: () => this.setState({loading:false})}])})
       
          } catch {
            Alert.alert("Erro na ligação", "Não é possivel enviar o token ", [{ text: 'OK' ,  onPress: () => this.setState({loading:false})}])
      }
  };
  
  async componentDidMount(){
    await this.loadFonts();
  }

  async loadFonts() {
    await Font.loadAsync({
     
      bold:  {
        uri:require('../assets/fonts/MyriadProBold.ttf'),
        // Only effects web
        display: Font.FontDisplay.SWAP,
      },
       
      regular:  {
        uri: require('../assets/fonts/MyriadProRegular.ttf'),
        // Only effects web
        display:Font.FontDisplay.SWAP,
      },
       
      semibold:  {
        uri: require('../assets/fonts/MyriadProSemibold.ttf'),
        // Only effects web
        display: Font.FontDisplay.SWAP,
      },
    });
    this.setState({ fontsLoaded: true });
  }


  render(){

  if(this.state.fontsLoaded){

  return (
  
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor:'transparent'
      }}>
          <KeyboardAvoidingView behavior={'padding'}>
       <View style={{height:Dimensions.get('window').height*0.16}}>
       <Text style={{fontFamily:'semibold',color:'#9BC174',justifyContent:'center',alignSelf:'center', fontSize: size * 0.09,}}>Introduz o código</Text>
       </View>
       <View
								style={[{borderRadius: size * 0.017,
                  marginBottom: size * 0.16 / 3,
                  height: size * 0.144,
                  backgroundColor: '#6c6d6d',
                  marginHorizontal:size *0.17,
									alignContent:'space-between',
									flexDirection: 'row',
								}]}>

								<View style={{borderRadius: size * 0.08 / 3,
		marginBottom: size * 0.16 / 3,
    height: size * 0.144,
    marginHorizontal:size*0.018,
		backgroundColor:'#6c6d6d',flex:0.9,}}>
								<TextInput
								
									style={[{marginHorizontal: size * 0.09,
                    fontSize: size * 0.05,
                    color: active,paddingLeft:size*0.04,marginTop:Dimensions.get('window').height*0.019}]}
                  returnKeyType="go"
                  
									placeholder='ABC123'
									placeholderTextColor='#f9f9f9'
									onChangeText={text => this.setState({textToken: text})}
								
								
								/>
								</View>
                <TouchableOpacity style={{marginTop:Dimensions.get('window').height*0.021}}>
                {this.state.loading? <ActivityIndicator color={'white'} style={{paddingVertical:Dimensions.get('window').height*0.005,backgroundColor:'transparent',alignSelf:'center',justifyContent:'center',alignContent:'center'}} /> :
								<Icon
								name={'arrow-right'}
								type='feather'
								backgroundColor="transparent"
								color="white"
								size={Dimensions.get('window').width*0.065}
                onPress={() => {
                  this.validarToken();
                }}
							/> }
							</TouchableOpacity>
							</View>

              <Modal 
        transparent={true}
        visible={this.state.modalToken}
        style={{height:Dimensions.get('window').height}}>
        <Animated.View                 
          style={{opacity: this.state.fadeIn2}}
        >
          <View style={{alignItems:'center',marginTop:Dimensions.get('window').height*0.7}}>
          <View style={{padding:Dimensions.get('window').width*0.03,borderRadius:28,backgroundColor:'#777777',opacity:0.9}}>
            <Text style={{fontSize: Dimensions.get('window').width*0.04, color:'#fff'}}>{this.state.alerta}</Text>
          </View>
          </View>
        </Animated.View>
      </Modal>
 </KeyboardAvoidingView>
  </View>

  );
} else { return null}}
}
