import React, {Component} from 'react';
import {TouchableOpacity,TouchableHighlight,Modal,ActivityIndicator,TextInput,StyleSheet, SafeAreaView, ScrollView ,Dimensions, Image, Text, View,Alert,Animated} from 'react-native';
import { Button,Icon } from 'react-native-elements';
import { Card } from 'react-native-paper';
import { Path, Svg } from 'react-native-svg';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from 'expo-clipboard';
import API from '../components/api.js'
import * as Linking from 'expo-linking';
import * as Font from 'expo-font';



const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const size = width;

const mask = {

  width: width * 1.5,
  height: height*0.1,
  alignItems: 'center',
  bgColor: '#F9F8F8',


};


const styles = StyleSheet.create({
  centeredView: {
    flex: 1, alignItems: 'center', justifyContent: 'center',height:height*0.8,
  },
  modalView: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#95c45a",
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
    container: {
      backgroundColor: 'white',
      color:'white',
     
      
    },
 
   
  });

const styles2 = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  mask: {
    backgroundColor: 'white',
  },
  mask2:{
    backgroundColor: 'white',
    alignItems:'center',
    marginTop:height*0.001,
  },

  textContainer: {
    width: '100%',
    backgroundColor: 'black', 
  },
  token: {
    fontSize:width*0.063,
    textAlign: 'center',
    color:'#6D6E6D',
    marginTop: height*0.13,
    alignItems:'center',
    marginRight:width*0.17,
  },
  profile: {
    fontSize: width * 0.1,
    fontFamily:'semibold',
    textAlign: 'left',
    marginHorizontal: width * 0.058,
    color:'#9CC56F',
    marginTop:height*0.07,
  },
  name: {
    fontSize:width*0.063,
    marginTop:height*0.1,
    marginHorizontal: width*0.05,
    color:'#4F545E',
    fontFamily:'regular',
 
  },
  course: {
    fontFamily:'regular',
    fontSize: width*0.053,
    marginTop:height*0.145,
    textAlign:'center',
    position:'absolute',
    color:'grey',
    marginHorizontal: width*0.05,
  }
});



class Profile extends Component {


  state = {
    first_name: '',
    last_name: '',
    user_token: '',
    token: '',
    course: '',
    modalLinked:false,
    copiedText:'',
    text: '',
    avatar:'',
    fadeIn: new Animated.Value(0),
    fadeOut: new Animated.Value(1),
    fadeIn2: new Animated.Value(0),
    fadeOut2: new Animated.Value(1),
    alerta:'',
    textoToken:'',
    activeSlide:0,
    modalToken: false,
    fontsLoaded: false,
    pontos:'',
    workshops:[],
    loading:false,

  }

pbcopy(){
  Clipboard.setString("https://fista.iscte-iul.pt?invite=" + this.state.user_token)
}


  async loadData(){
    try {
      const body = JSON.stringify({
        email: await AsyncStorage.getItem('mail'),
        password:await AsyncStorage.getItem('password'),
  
        });
        API.doRequest("POST", "login", body ).then(response => response.json()).then(async data => {
         this.setState({workshops:data.workshops});
         await AsyncStorage.setItem('pontos',data.user.pontos.toString());
            })
            .catch(() => { Alert.alert("Erro na ligação", "Verifica se estás bem conectado ", [{ text: 'OK' ,  onPress: () => this.setState({loading:false})}])})
         
          }  catch (error) {
            Alert.alert("Erro na ligação", "Verifica se estás bem conectado ", [{ text: 'OK' }])
          
      }
    this.setState({
      first_name: await AsyncStorage.getItem('first_name'),
      last_name: await AsyncStorage.getItem('last_name'),
      user_token: await AsyncStorage.getItem('user_token'),
      course: await AsyncStorage.getItem('curso'),
      year: await AsyncStorage.getItem('ano'),
      avatar: await AsyncStorage.getItem('avatar'),
      pontos: await AsyncStorage.getItem('pontos'),
     
  })
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
semibold: {
        uri: require('../assets/fonts/MyriadProSemibold.ttf'),
        // Only effects web
        display:Font.FontDisplay.SWAP,
      },
    });
    this.setState({ fontsLoaded: true });
  }
  

  async componentDidMount() {

  this.loadFonts();
 

         
    this.loadData()

  this._unsubscribe = this.props.navigation.addListener('focus', () => {
    this.loadData();
  }); 

 
}



  async componentWillUnmount() {
    this._unsubscribe();

  }

 

  setModalLinked = (visible) => {
    this.setState({ modalLinked: visible });
  }

  mycourse = (c) => {
    switch(c) {
      case '1':
        return "LEI"
      case '2':
        return "IGE"
      case '3':
        return "ETI"
       case '4':
          return "LCD"
          case '5':
            return "ARQ"
            case '7':
              return "ES"
              case '8':
                return "Docente"
                case '9':
                  return "Alumni"
                  case '10':
                    return "Outro"
                    case '11':
                      return "Não Docente"
                      case '0':
                        return ""

      }
  }
 

  mygrade = (a,c) => {
    if(parseInt(c) > 0 && parseInt(c) < 5){
      switch(a) {
        case '1':
          return '1ºAno'
        case '2':
          return '2ºAno'
        case '3':
          return '3ºAno'
        case '4':
            return '4ªAno'
            case '5':
              return "Ms 1"
              case '6':
                return "Ms 2"
                case '7':
                  return ""
                  case '0':
                    return ""

        }
    } else {
      return ''
    }
  }
 



  
 

  _renderItem = ({item}) => {
    return (
      <View style={{alignSelf:'center',backgroundColor:'transparent',paddingBottom:height*0,height:height*0.4}}>
      <Card style={{backgroundColor:'transparent',borderRadius:15,alignItems:'center',justifyContent:'center',height:height*0.26,width:width*0.76,marginTop:height*0.0,marginBottom:height*0.1}}>
      <TouchableHighlight  underlayColor={'transparent'} style={{backgroundColor:'transparent',borderRadius:15,elevation:0,shadowColor: "#000",shadowOffset: {width: 3,height: 5,},shadowOpacity: 0.25,shadowRadius: 10,backgroundColor:'white',height: height *0.26}}onPress={() => this.props.navigation.navigate('WorkshopsDetails', {data: item})}>
      <Card.Cover resizeMode={'contain'}style={{alignSelf:'center',elevation:7,borderRadius:15,shadowColor: "#000",height:height*0.26,width:width*0.76,shadowOffset: {width: 0,height: 15,},shadowOpacity: 0.25,shadowRadius: 10,}} source={item.image !== null ? {uri:'https://fista.iscte-iul.pt/storage'+ item.image}: require('../assets/workshop.png')}  />
      </TouchableHighlight>
      <Text style={{textAlign:'center',fontSize:width*0.046,fontFamily:'semibold',color:'#333333',marginTop:height*0.05,marginHorizontal:width*0.000}}>{item.title}</Text>
      </Card>
     
     </View>

      
    );
  }
 

 handleToken = (text) => {
  this.setState({ token: text })
}

/*ALERTAS CÓPIA*/
fadeIn() {
  this.state.fadeIn.setValue(0)                  
  Animated.timing(
    this.state.fadeIn,           
    {
      toValue: 1,                   
      duration: 1400,
      useNativeDriver: true              
    }
  ).start(() => this.fadeOut());                        
}

fadeOut() {
  Animated.timing(                  
     this.state.fadeIn,            
     {
       toValue: 0,                   
       duration: 1500,
       useNativeDriver: true              
     }
  ).start();                        
}
/**/

/*ALERTAS TOKEN*/
fadeIn2() {
  this.state.fadeIn2.setValue(0)                  
  Animated.timing(
    this.state.fadeIn2,           
    {
      toValue: 1,                   
      duration: 1300,
      useNativeDriver: true              
    }
  ).start(() => this.fadeOut2());                        
}

fadeOut2() {
  Animated.timing(                  
     this.state.fadeIn2,            
     {
       toValue: 0,                   
       duration: 1400,
       useNativeDriver: true              
     }
  ).start();
  this.wait(1200).then(() => this.setState({modalToken: false}));                        
}
/**/

wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

async validarToken() {
  this.setState({loading:true});
  try {
    const body = JSON.stringify({
      token: this.state.textoToken,
      id: this.state.user_token,
    });
    API.doRequest("POST", "token", body )
      .then(response => response.json())
        .then(async data => {
   
          if (data.message == "Token Válido!") {
            AsyncStorage.setItem('pontos', data.pontos.toString())
            this.setState({pontos:data.pontos.toString()})
            this.setState({modalToken:true})
            this.setState({alerta: 'Token válido'})
            this.setState({loading:false});
            this.fadeIn2()
          }else
          if(data.message== "Token Inválido!"){
            this.setState({modalToken:true})
            this.setState({alerta: 'Token inválido'})
            this.setState({loading:false});
            this.fadeIn2()
          }else{
            this.setState({modalToken:true})
            this.setState({alerta: 'Token já introduzido'})
            this.setState({loading:false});
            this.fadeIn2()
          }	
  
        })

        .catch(() => { Alert.alert("Erro na ligação", "Não é possivel enviar o token", [{ text: 'OK' ,  onPress: () => this.setState({loading:false})}])})
  } catch  {
    Alert.alert("Erro na ligação", "Não é possivel enviar o token", [{ text: 'OK' ,  onPress: () => this.setState({loading:false})}])

  
  }
}

pagination() {
  return (
  
      <Pagination
        dotsLength={this.state.workshops.length }
        activeDotIndex={this.state.activeSlide}
        containerStyle={{ backgroundColor: 'transparent' }}
        dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 8,
            backgroundColor: 'grey'
        }}
        inactiveDotStyle={{
            // Define styles for inactive dots here
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    
  );
}

bar(){
  if(parseInt(this.state.year) >  0 && parseInt(this.state.year) < 7 && parseInt(this.state.course) >  0 && parseInt(this.state.course) < 7){
    return ' | ';
  }
}
  render(){

    const active = 'rgba(249, 249, 249, 1)';
//this.state.workshops.length  === 0 ? 
  if(this.state.fontsLoaded){
  return (
    <SafeAreaView style={styles.container}>

      <ScrollView style={this.state.workshops.length  === 0?{ backgroundColor: 'white',
      marginHorizontal: 0,marginTop:height*0.04,marginBottom:height*0.01}:{ backgroundColor: 'white',
      marginHorizontal: 0,marginTop:height*0.04,marginBottom:height*0.01,} }>

      <View style={styles.container}>
          <Text style={styles2.profile}>Minha Conta</Text>
        
          <View style={styles2.mask}>
              <View>
                <Text style={styles2.name}>{this.state.first_name} {this.state.last_name} </Text>

                <Text style={styles2.course}>{this.mycourse(this.state.course)}{this.bar()}{this.mygrade(this.state.year,this.state.course)} </Text>

                <Image
                style={{borderColor:'#9BC174',borderWidth: 2.5,marginTop:-height*0.090,marginLeft:width*0.56,width: width*0.33, height: width*0.33, borderRadius: 400/ 2}}
                source={this.state.avatar !== 'users/default.png'? {uri:'https://fista.iscte-iul.pt/storage/'+ this.state.avatar} : require('../assets/default.png')}
                />
                <View style={{flex: 1, flexDirection: 'row',marginLeft:width*0.59,marginHorizontal: width*0.01}}>
               
             
              <Button
              icon={<Icon
                name='settings'
                type='material-icons'
                backgroundColor="transparent"
                color="#9CC56F"
                size={width*0.068}
              />}
              buttonStyle={{marginHorizontal: width*0.00001,width:width*0.27, backgroundColor:"transparent",color:"blue"}}
                onPress={() => this.props.navigation.navigate('Configurações')} 
                title="">
              
              </Button>
                </View>
              </View>
              <Text style={{fontFamily:'regular',fontSize:width*0.063,marginTop:height*0.06,marginLeft:width*0.07,color:'#9CC56F'}}>Convida os teus amigos</Text>
              
              <View style={{flexDirection: 'row',marginTop:height*0.05,alignSelf:'center',}}>

              <TouchableHighlight activeOpacity={0.86} underlayColor={'#FAFAFA'}style={{borderRadius:30,paddingVertical:height*0.022,marginHorizontal: width*0.00001,width:width*0.165, backgroundColor:"transparent",color:"blue"}}
             
             onPress={() => {this.setModalLinked(true);}}>
              <Icon
                name='link-variant'
                type='material-community'
                backgroundColor="transparent"
                color="gray"
                size={width*0.08}
              />
             </TouchableHighlight>
           
             <TouchableHighlight activeOpacity={0.86} underlayColor={'#FAFAFA'}style={{borderRadius:30,paddingVertical:height*0.022,marginHorizontal: width*0.00001,width:width*0.165, backgroundColor:"transparent",color:"blue"}}
             onPress={() => {Linking.openURL('https://www.linkedin.com/sharing/share-offsite/?url=https://fista.iscte-iul.pt?invite=' + this.state.user_token)}}>
              <Icon
                name='linkedin'
                type='material-community'
                backgroundColor="transparent"
                color="#0077b5"
                size={width*0.08}></Icon>
             </TouchableHighlight>
           

             <TouchableHighlight activeOpacity={0.86} underlayColor={'#FAFAFA'}style={{borderRadius:30,paddingVertical:height*0.022,marginHorizontal: width*0.00001,width:width*0.165, backgroundColor:"transparent",color:"blue"}}
             
             onPress={() => {Linking.openURL('https://twitter.com/intent/tweet?text=https://fista.iscte-iul.pt?invite=' + this.state.user_token)}}>
              <Icon
                  name='twitter'
                  type='material-community'
                  backgroundColor="transparent"
                  color="dodgerblue"
                  size={width*0.08}></Icon>
             </TouchableHighlight>
             
             <TouchableHighlight activeOpacity={0.86} underlayColor={'#FAFAFA'}style={{borderRadius:30,paddingVertical:height*0.022,marginHorizontal: width*0.00001,width:width*0.165, backgroundColor:"transparent",color:"blue"}}
             
             onPress={() => {Linking.openURL('https://www.facebook.com/sharer/sharer.php?u=https://fista.iscte-iul.pt?invite=' + this.state.user_token)}}>
              <Icon
                name='facebook'
                type='material-community'
                backgroundColor="transparent"
                color="darkslateblue"
                size={width*0.08}></Icon>
             </TouchableHighlight>
             <TouchableHighlight activeOpacity={0.86} underlayColor={'#FAFAFA'}style={{borderRadius:30,paddingVertical:height*0.022,marginHorizontal: width*0.00001,width:width*0.165, backgroundColor:"transparent",color:"blue"}}
             
             onPress={() => {Linking.openURL('https://wa.me/?text=https://fista.iscte-iul.pt?invite=' + this.state.user_token)}}>
              <Icon
                 name='whatsapp'
                 type='material-community'
                 backgroundColor="transparent"
                 color="limegreen"
                 size={width*0.08}></Icon>
             </TouchableHighlight>
             
             
              </View>
              <View style={styles2.mask2}>
            
                <Svg width={mask.width} height={mask.height} >
                  <Path
                    fill={mask.bgColor} 
                    d={`M 0 0 L 0 ${mask.height} L ${mask.width} ${mask.height} L ${mask.width} 0 A ${mask.width / 2} ${mask.height / 2} 0 0 1 ${mask.width / 2} ${mask.height / 2} A ${mask.width / 2} ${mask.height / 2} 0 0 1 0 0 z `} />
                </Svg>
              </View>
          </View>
          
          <View style={this.state.workshops.length  === 0 ? {backgroundColor:'#F9F8F8',height:height*0.6}:{backgroundColor:'#F9F8F8',height:height*1.26}}>
      
          <View style={styles.centeredView}>

         

          </View>

            <Text style={{alignSelf:'center',fontSize:width*0.113,marginTop:height*0.001,marginLeft:width*0.02,color:'#9CC56F'}}>{this.state.pontos} pts</Text>
           
           
            <Text style={styles2.token}>Introduzir o token</Text>
            
   

              
          			<View
                
								style={{borderRadius: size * 0.017,
                  marginBottom: size * 0.16 / 3,
                  height: size * 0.144,
                  backgroundColor: '#6c6d6d',
                  marginTop:height*0.017,
                  marginHorizontal:size *0.17,
									alignContent:'space-between',
									flexDirection: 'row',
								}}>

								<View style={{borderRadius: size * 0.08 / 3,
		marginBottom: size * 0.16 / 3,
    height: size * 0.144,
    marginHorizontal:size*0.018,
		backgroundColor:'#6c6d6d',flex:0.9,}}>
								<TextInput
								
									style={[{marginHorizontal: size * 0.09,
                    fontSize: size * 0.05,
                    color: active,paddingLeft:size*0.04,marginTop:height*0.019}]}
                  returnKeyType="go"
                  
									placeholder='ABC123'
									placeholderTextColor='#f9f9f9'
									onChangeText={text => this.setState({textoToken: text})}
								
								
								/>
								</View>
								<TouchableOpacity style={{marginTop:height*0.021}}>
                {this.state.loading? <ActivityIndicator color={'white'} style={{paddingVertical:height*0.005,backgroundColor:'transparent',alignSelf:'center',justifyContent:'center',alignContent:'center'}} /> :
								<Icon
								name={'arrow-right'}
								type='feather'
								backgroundColor="transparent"
								color="white"
								size={width*0.065}
                onPress={() => {
                  this.validarToken();
                }}
							/> }
							</TouchableOpacity>
							</View>
     
             
       {this.state.workshops.length  === 0 ? <View style={{backgroundColor:'transparent',marginTop:height*0.01,marginBottom:height*0.79}}></View> :
       <View style={{backgroundColor:'transparent',marginTop:height*0.01,marginBottom:height*0.70}}>
        <Text style={{alignSelf:'center',color:'grey',marginBottom:height*0.038,marginTop:height*0.09,fontFamily:'regular',fontSize:width*0.09}}>Meus workshops</Text>
          <Carousel 
        layout='default'
        layoutCardOffset={9}
        ref={(c) => { this._carousel = c; }}
        data={this.state.workshops}
        renderItem={this._renderItem}
        sliderWidth={ width }
        itemWidth={width}
        inactiveSlideShift={0}
        useScrollView={true}
        onSnapToItem={(index) => this.setState({ activeSlide: index }) }
      />
      {
        this.pagination()
      }</View>
    }
          </View> 
    
    
    
         
      </View>

    
    
      <Modal 
        transparent={true}
        visible={this.state.modalToken}
        style={{height:height}}>
        <Animated.View                 
          style={{opacity: this.state.fadeIn2}}
        >
          <View style={{alignItems:'center',marginTop:height*0.8}}>
          <View style={{padding:width*0.03,borderRadius:28,backgroundColor:'#777777',opacity:0.9}}>
            <Text style={{fontSize: width*0.04, color:'#fff'}}>{this.state.alerta}</Text>
          </View>
          </View>
        </Animated.View>
      </Modal>

      
     <Modal
          animationType="slide"
          transparent={true}

          style={{height:height*3,alignSelf:'center'}}
          visible={this.state.modalLinked}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={{flex:1,backgroundColor: 'rgba(0, 0, 0, 0.35)'}}>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',}}>
            <View style={{
              width: '90%',
              paddingTop:6,
              paddingBottom:30,
              borderRadius:10,
              backgroundColor: 'white',
              justifyContent: 'center',
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5
              }}>
             
            
    
              <TouchableHighlight activeOpacity={0.86} underlayColor={'#F5F8F1'}style={{top:height*0.01,
              marginHorizontal: width*0.70,width:width*0.14,backgroundColor:'white',
              borderRadius:40,elevation:0.1,padding:height*0.015} }
            onPress={() => {this.setModalLinked(!this.state.modalLinked)}}>
              <Icon
                name='close'
                type='ionicons'
                backgroundColor="transparent"
                color="#95C45A"
                size={width*0.08}
              />
             </TouchableHighlight>
            
            <View style={{alignItems:'center',justifyContent:'center'}}>
              <Text style={{backgroundColor:'#FAFAFA',padding:5,color:'grey',borderRadius:12,marginTop:20,marginHorizontal:20,textAlign:'center',fontSize:width*0.043,justifyContent:'center'}}>{"https://fista.iscte-iul.pt?invite=" + this.state.user_token}</Text>
              
              <TouchableOpacity
              style={{backgroundColor:"white",color:'black',borderRadius:16,paddingHorizontal:12,}}
              onPress={()=>{
                this.pbcopy();
                this.fadeIn();
              }}
            
                ><Text style={{marginTop:27,color:'#95C45A',fontSize:width*0.06}}>Copiar</Text></TouchableOpacity>

                </View>
            </View>

          </View>
              
          <Animated.View                 
                style={{opacity: this.state.fadeIn}}
              >
                 <View style={{alignItems:'center',marginBottom:height*0.06}}>
          <View style={{padding:width*0.03,borderRadius:28,backgroundColor:'#777777',opacity:0.9}}>
            <Text style={{fontSize: width*0.04, color:'#fff'}}>Copiado com sucesso !</Text>
          </View>
          </View>
              </Animated.View>
              </View>
        </Modal>


      
      

      </ScrollView>
     

    </SafeAreaView>
    

  ); 
    } else{
      return null
    }
              }
}

export default Profile;