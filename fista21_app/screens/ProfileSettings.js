import React,{Component} from 'react';
import {TouchableHighlight,View,Dimensions,Modal,StyleSheet,Text,Image,Animated, ScrollView} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import * as Linking from 'expo-linking';
import { Button } from 'react-native-elements';
import Constants from 'expo-constants';
import API from '../components/api.js'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import * as Font from 'expo-font';



const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class  HelloWorldApp extends Component  {
  state = {
    ano: '',
    cursoIni:'',
    modalContent: 'course',
    modalVisible1 : false,
    mudarCurso: '',
    mudarAno: '',
    secure: true,
    user_token: '',
    fadeIn: new Animated.Value(0),
    fadeOut: new Animated.Value(1),
    alerta: '',
    modalToken: false,
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
    this.setState({
      anoIni: await AsyncStorage.getItem('ano'),
      cursoIni: await AsyncStorage.getItem('curso'),
      mudarCurso: await AsyncStorage.getItem('curso'),
      mudarAno: await AsyncStorage.getItem('ano'),
      user_token: await AsyncStorage.getItem('user_token')
    })   
  }

  async mudarC() {
    if(this.state.mudarCurso === '0'){
      AsyncStorage.setItem('curso',this.state.mudarCurso)
    }else{
		try {
			const body = JSON.stringify({
        curso: this.state.mudarCurso,
        id: this.state.user_token,
      });
        
      API.doRequest("POST", "curso", body )
				.then(response => response.json())
					.then(async data => {
						if (data.message == "Change Successful") {
              this.setState({cursoIni: this.state.mudarCurso})
              AsyncStorage.setItem('curso',this.state.mudarCurso)
              this.setState({modalToken:true})
              this.setState({alerta: 'Alteração feita com sucesso'})
              this.fadeIn()
						} else {
              this.setState({mudarCurso: this.state.cursoIni})
              this.setState({modalToken:true})
              this.setState({alerta: 'Ocorreu um erro'})
              this.fadeIn()
            }	
					})
          .catch(() => { Alert.alert("Erro na ligação", "Não é possivel alterar curso", [{ text: 'OK' }])}) 
		} catch {
      Alert.alert("Erro na ligação", "Não é possivel alterar curso" ,[{ text: 'OK' }])
		}
  }
  }
  
  async mudarA() {
    if(this.state.mudarAno === '0'){
      AsyncStorage.setItem('ano',this.state.mudarAno)
    } else{
    try {
      const body = JSON.stringify({
        ano: this.state.mudarAno,
        id: this.state.user_token,
      });
  
      API.doRequest("POST", "ano", body )
      .then(response => response.json())
        .then(async data => {
          if (data.message == "Change Successful") {
            this.setState({anoIni: this.state.mudarAno})
            AsyncStorage.setItem('ano',this.state.mudarAno)
            this.setState({modalToken:true})
            this.setState({alerta: 'Alteração feita com sucesso'})
            this.fadeIn()
          } else {
            this.setState({mudarAno: this.state.anoIni})
            this.setState({modalToken:true})
            this.setState({alerta: 'Ocorreu um erro'})
            this.fadeIn()
          }
        })
        .catch(() => { Alert.alert("Erro na ligação", "Não é possivel alterar ano" ,[{ text: 'OK' }])}) 
    } catch {
      Alert.alert("Erro na ligação", "Não é possivel alterar ano", [{ text: 'OK' }])
    }
  }
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

      }
  }

 modalContentView = (content) => {
  switch(content) {
    case 'course':
      return <View style={{borderRadius:12,color:"white",alignSelf: 'center'}}>
        <Picker
          selectedValue={this.state.mudarCurso}
          onValueChange={(itemValue, itemIndex) => this.setState({mudarCurso: itemValue})}
          style={{width: width*0.93}}
        >
          <Picker.Item label="Nenhum" value="0"/>
          <Picker.Item label="Engenharia Informática" value="1"/>
          <Picker.Item label="Informática e Gestão de Empresas" value="2"/>
          <Picker.Item label="Eng. de Telecomunicações e Informática" value="3"/>
          <Picker.Item label="Ciência de Dados" value="4"/>
          <Picker.Item label="Arquitetura" value="5"/>
          <Picker.Item label="Escola Secundária" value="7"/>
          <Picker.Item label="Professor/Docente" value="8"/>
          <Picker.Item label="Alumni" value="9"/>
          <Picker.Item label="Outro(público geral)" value="10"/>
          <Picker.Item label="Não docente" value="11"/>
        </Picker>
      </View>
    
    case 'ano':
      return <View style={{borderRadius:12,color:"white",alignSelf: 'center'}}>
        <Picker
        selectedValue={this.state.mudarAno}
        onValueChange={(itemValue, itemIndex) => this.setState({mudarAno: itemValue})}
        style={{width: width*0.93}}
        >
          <Picker.Item label="Nenhum" value="0"/>
          <Picker.Item label="1º ano" value="1"/>
          <Picker.Item label="2º ano" value="2"/>
          <Picker.Item label="3º ano" value="3"/>
          <Picker.Item label="4º ano" value="4"/>
          <Picker.Item label="1º ano de mestrado" value="5"/>
          <Picker.Item label="2º ano de mestrado" value="6"/>
          <Picker.Item label="Outro" value="7"/>
          <Picker.Item label="Não aplicável" value="8"/>
        </Picker>
      </View>
    }
}

cancelarCurso(){
  this.setState({mudarCurso: this.state.cursoIni})
}

cancelarAno(){
  this.setState({mudarAno: this.state.anoIni})
}

modalButtonView = (content) => {
  switch (content){
    case 'course':
      return <View style={{marginTop:height*0.1,flexDirection:'row'}}>
        <Button
          buttonStyle={{width:width*0.4,backgroundColor:'#cccccc',borderRadius:12}}
          onPress={() => {
            this.cancelarCurso();
            this.setModalVisible(!this.state.modalVisible1);
          }}
          titleStyle={{fontFamily:'regular',fontSize:height*0.03,}}
          title="Cancelar"
          >
        </Button>
        <View style={{marginLeft:width*0.1/3}}>
          <Button
            buttonStyle={{width:width*0.4,backgroundColor:'#96c45b',borderRadius:12}}
            onPress={() => {
              this.setModalVisible(!this.state.modalVisible1);
              this.mudarC();
            }}
            titleStyle={{fontFamily:'regular',fontSize:height*0.03,}}
            title="Guardar"
            >
          </Button>
        </View>
      </View>

    case 'ano':
      return <View style={{marginTop:height*0.1,flexDirection:'row'}}>
        <Button
          buttonStyle={{width:width*0.4,backgroundColor:'#cccccc',borderRadius:12}}
          onPress={() => {
            this.cancelarAno();
            this.setModalVisible(!this.state.modalVisible1);
          }}
          titleStyle={{fontFamily:'regular',fontSize:height*0.03,}}
          title="Cancelar"
          >
        </Button>
        <View style={{marginLeft:width*0.1/3}}>
          <Button
            buttonStyle={{width:width*0.4,backgroundColor:'#96c45b',borderRadius:12}}
            onPress={() => {
              this.setModalVisible(!this.state.modalVisible1);
              this.mudarA();
            }}
            titleStyle={{fontFamily:'regular',fontSize:height*0.03,}}
            title="Guardar"
            >
          </Button>
        </View>

      </View>
  }
}

wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

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
       duration: 1300,
       useNativeDriver: true              
     }
  ).start();
  this.wait(2500).then(() => this.setState({modalToken: false}));                        
}

setModalVisible = (visible) => {
  this.setState({ modalVisible1: visible });
}

setModalContent = (content) => {
  this.setState({ modalContent: content });
}

async doLogout() {

  await AsyncStorage.clear()
  await AsyncStorage.setItem('state', 'not_logged')
  this.props.navigation.navigate('Login')
  
}

  render(){
    
    const { modalVisible1,modalContent} = this.state;
 
if(this.state.fontsLoaded){
  return (
    <ScrollView >
      <View
        style={{
          height:height * 0.8,
          flex: 3,
          backgroundColor:'white',
          
        }}>
          <View style={{marginTop:height*0.02,marginLeft:width*0.00}}>
          <View style={{alignItems:'center',flexDirection:'row',justifyContent:'flex-end'}}>
          <Image
              resizeMode={'contain'}
              source={require('../assets/fista-verde.png')}
              style={{width:width*0.34}}
            />
            </View>

          <TouchableHighlight 
          activeOpacity={0.86} underlayColor={'#FAFAFA'}
               style={{paddingVertical:height*0.01,justifyContent: 'flex-start',marginTop:height*0.005}}
               onPress={() => {
                this.setModalVisible(true),this.setModalContent('course');

              }}
              ><Text style={{fontFamily:'semibold',marginLeft:width*0.038,fontSize:height*0.033, color:'#96c45b'}}>Alterar Curso</Text>
          </TouchableHighlight>


          <TouchableHighlight 
          activeOpacity={0.86} underlayColor={'#FAFAFA'}
            style={{paddingVertical:height*0.01,justifyContent: 'flex-start',marginTop:height*0.005}}
            onPress={() => {
                this.setModalVisible(true),this.setModalContent('ano');
              }}
              ><Text style={{fontFamily:'semibold',marginLeft:width*0.038,fontSize:height*0.033, color:'#96c45b'}}>Alterar Ano</Text>
          </TouchableHighlight>





          <TouchableHighlight 
          activeOpacity={0.86} underlayColor={'#FAFAFA'}
              style={{paddingVertical:height*0.01,justifyContent: 'flex-start',marginTop:height*0.005}}
              onPress={() => {
                Linking.openURL('https://fista.iscte-iul.pt/contacts');
              }}
              ><Text style={{fontFamily:'semibold',marginLeft:width*0.038,fontSize:height*0.033, color:'#96c45b'}}>Ajuda</Text>
          </TouchableHighlight>


          <TouchableHighlight 
          activeOpacity={0.86} underlayColor={'#FAFAFA'}
              style={{paddingVertical:height*0.01,justifyContent: 'flex-start',marginTop:height*0.005}}
              onPress={() => {
                Linking.openURL('https://fista.iscte-iul.pt/politica-privacidade');

              }}
              ><Text style={{fontFamily:'semibold',marginLeft:width*0.038,fontSize:height*0.033, color:'#96c45b'}}>Política de Privacidade</Text>
          </TouchableHighlight>
          <TouchableHighlight 
          activeOpacity={0.86} underlayColor={'#FAFAFA'}
              style={{paddingVertical:height*0.01,justifyContent: 'flex-start',marginTop:height*0.005}}
              onPress={
                () => this.props.navigation.navigate('Sobre')

              }
              ><Text style={{fontFamily:'semibold',marginLeft:width*0.038,fontSize:height*0.033, color:'#96c45b'}}>Sobre</Text>
          </TouchableHighlight>

          <TouchableHighlight 
          activeOpacity={0.86} underlayColor={'#FAFAFA'}
              style={{paddingVertical:height*0.01,justifyContent: 'flex-start',marginTop:height*0.005}}
              onPress={() => {
                this.doLogout()
              }}
              ><Text style={{fontFamily:'semibold',marginLeft:width*0.038,fontSize:height*0.033, color:'#96c45b'}}>Logout</Text>
          </TouchableHighlight>

       

    
          <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible1}
                    onRequestClose={() => {
                      Alert.alert("Modal has been closed.");
                    }}
                  >
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>

                        {this.modalContentView(this.state.modalContent)}

                        {this.modalButtonView(this.state.modalContent)}

                      </View>
                    </View>
                  </Modal>

            <Modal 
              transparent={true}
              visible={this.state.modalToken}
              style={{height:height}}>
              <Animated.View                 
                style={{opacity: this.state.fadeIn}}
              >
                <View style={{alignItems:'center',marginTop:height-140}}>
                <View style={{padding:width*0.03,borderRadius:28,backgroundColor:'#777777',opacity:0.9}}>
                  <Text style={{fontSize: width*0.04, color:'#fff'}}>{this.state.alerta}</Text>
                </View>
                </View>
              </Animated.View>
            </Modal>    

          </View>
      </View>
    </ScrollView>
  );
} else{return null}}
}
export default HelloWorldApp;


const styles = StyleSheet.create({
  centeredView: {
    flex: 1, alignItems: 'center', justifyContent: 'center'
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
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
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
      flex: 1,
      marginTop: Constants.statusBarHeight,
    },
    scrollView: {
      backgroundColor: 'white',
      marginHorizontal: 0,
      
    },
  });