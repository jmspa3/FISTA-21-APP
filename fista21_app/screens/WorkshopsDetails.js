import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableHighlight,SafeAreaView,Animated,Modal, Dimensions, ScrollView, Alert} from 'react-native';
import API from '../components/api';
import {Icon } from 'react-native-elements';
import { Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import * as Linking from 'expo-linking';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
 class WorkshopsDetailScreen extends Component {
     state={
         token: '',
         modalVisible: true,
         workshop:this.props.route.params.data,
         user_token:'',
         inscrito: false,
         fontsLoaded:false,
         spotsavailable: this.props.route.params.data.spotsavailable,
         alerta:'',
         modalToken:false,
         fadeIn2: new Animated.Value(0),
         fadeOut2: new Animated.Value(1),
       };
        
       wait = timeout => {
         return new Promise(resolve => {
           setTimeout(resolve, timeout);
         });
       };
     
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
         this.wait(1000).then(() => {this.setState({modalToken: false})});     
        
     
                          
       }
     

     

     months =[
        {n:'1', month:'Janeiro'},
        {n:'2', month:'Fevereiro'}, 
        {n:'3', month:'Março'}, 
        {n:'4', month:'Abril'},
        {n:'5', month:'Maio'},
        {n:'6', month:'Junho'},
        {n:'7', month:'Julho'},
        {n:'8', month:'Agosto'},
        {n:'9', month:'Setembro'},
        {n:'10', month:'Outubro'},
        {n:'11', month:'Novembro'},
        {n:'12', month:'Dezembro'},
      ]


     
getParseDay(strDate){
    var strSplitDate = String(strDate).split(' ');
    var date = new Date(strSplitDate[0]);
    return  date.getDate() + " " + this.months[(date.getMonth())].month;
  }

  getParseHours(strDate){
    var strSplitDate = String(strDate).split(' ');
    var hh = String(strSplitDate[1]).split(':');
    return hh[0] + "h" + hh[1];
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

     async componentDidMount() {
        this.loadFonts();
        this.setState({
          user_token: await AsyncStorage.getItem('user_token')
          
        })
        try {
			body = JSON.stringify({
            id: this.state.user_token,
            id_work: this.state.workshop.id

         });
        
            API.doRequest("POST", "jaInscrito", body )
				.then(response => response.json())
					.then(async data => {
                        this.setState({inscrito: data.message});
					})
                    .catch(() => { Alert.alert("Erro na ligação", "Verifica se estás bem conectado", [{ text: 'OK' }])}) 
		} catch(error) {
            Alert.alert("Erro na ligação!", "Verifica se estás bem conectado", [{ text: 'OK' }])
        }   
        
        
      }


      
     async inscreverW() {
		try {
			const body = JSON.stringify({
            id: this.state.user_token,
            id_work: this.state.workshop.id

      });
        
      API.doRequest("POST", "workshopinscrever", body )
				.then(response => response.json())
					.then(async data => {
                       
                      
                        
                    if (data.message == "Inscrito!") {
                        this.setState({inscrito:true})
                        this.setState({spotsavailable: this.state.spotsavailable-1 })
                        this.setState({modalToken:true})
                        this.setState({alerta: 'Inscrição realizada com sucesso!'})
                        this.fadeIn2();
                    } else{
                        this.setState({modalToken:true})
                        this.setState({alerta: 'Erro na inscrição!'})
                        this.fadeIn2();
                    }
					})
                    .catch(() => { Alert.alert("Erro na ligação!", "Não é possivel inscrever-se ", [{ text: 'OK' }])}) 
		} catch {
            Alert.alert("Erro na ligação!", "Não é possivel desinscrever-se ", [{ text: 'OK' }])
		}
  }

  async desinscreverW() {
    try {
       const body = JSON.stringify({
        id: this.state.user_token,
        id_work: this.state.workshop.id

  });
    
  API.doRequest("POST", "workshopdesinscrever", body )
            .then(response => response.json())
                .then(async data => {
        
                    if (data.message == "Desinscrito") {
                        this.setState({inscrito:false})
                        this.setState({spotsavailable: this.state.spotsavailable+1 })
                        this.setState({modalToken:true})
                        this.setState({alerta: 'Inscrição cancelada com sucesso!'})
                        this.fadeIn2();
                    
                    } else{
                        this.setState({modalToken:true})
                        this.setState({alerta: 'Erro na desinscrição!'})
                        this.fadeIn2();
                    }
                })
                .catch(() => { Alert.alert("Erro na ligação", "Não é possivel desinscrever-se ", [{ text: 'OK' }])}) 
    } catch {
        Alert.alert("Oops!", "Falha na rede! ", [{ text: 'OK' }])
       
    }
    
}


    esgotado(){
      this.setState({modalToken:true})
      this.setState({alerta: 'O workshop está esgotado.'})
      this.fadeIn2();
    }


     setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
      }

      handleToken = (text) => {
        this.setState({ token: text })
      }

      inscricao(){
        if( this.state.workshop.form === null)
        this.inscreverW()
        else{ 
         Linking.openURL(this.state.workshop.form)
        }
      }

    render(){
        const date = this.getParseDay(this.state.workshop.begin) + "  às  " + this.getParseHours(this.state.workshop.begin);
        if(this.state.fontsLoaded){
        return (
        <SafeAreaView style={{flex:1,marginTop:height*0.04}}>
            <ScrollView style={{flex:1,backgroundColor:'white', }}>
         
               
<TouchableHighlight onPress={() => this.props.navigation.goBack()} activeOpacity={0.86} underlayColor={'#FAFAFA'}style={{position:'relative',backgroundColor:'transparent',borderRadius:30,paddingVertical:height*0.022,marginHorizontal: width*0.00001,width:width*0.165, backgroundColor:"transparent",color:"blue"}}> 
                     <Icon
								name={'arrow-left'}
								type='feather'
								backgroundColor="transparent"
								color="black"
								size={width*0.065}
                                
							/>
    </TouchableHighlight>      

<Card style={{ backgroundColor: 'transparent',
    alignSelf:'center',
    marginBottom:height * 0.2,width: Math.round((width + 80) * 0.84),
    height: height *0.10,marginTop:height*0,}}>
      
   <Card.Cover style={{borderRadius:6,
    elevation:5,shadowColor: "#000",shadowOffset: {width: 0,height: 15,},shadowOpacity: 0.25,shadowRadius: 10,
    height: height *0.30,width:Math.round((width + 80) * 0.84)}}
    source={this.state.workshop.image !== null ? {uri:'https://fista.iscte-iul.pt/storage/'+ this.state.workshop.image}: require('../assets/workshop.png')} />
    
   </Card>
                <Text style={{marginTop:height*0.05,
                alignSelf:'center',
                fontSize: width*0.050,
                fontFamily: 'semibold',
                color:'#444444'
                }}>{date}</Text>
                
                <Text style={styles.texto }>{ this.state.workshop.title }</Text>

                <Text style={styles.company}>{this.state.workshop.company}</Text> 

                <Text style={styles.vagasText}>Vagas Disponiveis: {this.state.spotsavailable} </Text>
       
                
                <View style={styles.buttonContainer}>
                    {this.state.inscrito?
                
                    <TouchableHighlight activeOpacity={0.8} underlayColor={'#BAE08A'}
                        style={styles.button}
                    onPress={() => this.desinscreverW() }
             
                    ><Text style={{fontFamily:'semibold',color:'white',fontSize:width*0.045,textAlign:'center'}}>Desinscrever</Text>
                    </TouchableHighlight> :
                    <TouchableHighlight  activeOpacity={0.8} underlayColor={'#BAE08A'}
                    style={styles.button}
                    onPress={ this.state.spotsavailable > 0 ?() => this.inscricao(): ()=>this.esgotado()}
                 
              
                    ><Text style={{color:'white',fontFamily:'semibold',fontSize:width*0.045,textAlign:'center'}}>{this.state.spotsavailable > 0 ?'Inscrever':'Esgotado'}</Text></TouchableHighlight> 
        }
                </View>

            
                
           

                <View style={styles.linha}></View>

                <Text style={styles.descricao}>{this.state.workshop.description}</Text> 
                 
                <Modal 
        transparent={true}
        visible={this.state.modalToken}
        style={{height:height}}>
        <Animated.View                 
          style={{opacity: this.state.fadeIn2}}
        >
          <View style={{alignItems:'center',marginTop:height*0.73}}>
          <View style={{padding:width*0.03,borderRadius:28,backgroundColor:'#777777',opacity:0.9}}>
            <Text style={{fontSize: width*0.04, color:'#fff'}}>{this.state.alerta}</Text>
          </View>
          </View>
        </Animated.View>
      </Modal>
              
            </ScrollView>
        </SafeAreaView>
        )
    } else{ return null}}
};

export default WorkshopsDetailScreen;



const styles = StyleSheet.create({

    texto: {
        paddingBottom: height *0.016,
        fontSize:width*0.063,
        textAlign:'center',
        fontFamily:'bold',
        marginTop: height*0.02
    },
    company: {
      paddingBottom: height *0.024,
      fontSize:width*0.054,
      textAlign:'center',
      color:'grey',
      fontFamily:'bold',
      marginTop: height*0.02
  },
    descricao: {
        marginVertical:height*0.03,
        paddingBottom:height*0.2,
        marginHorizontal: width*0.04,
        fontSize: width*0.045,
        fontFamily:'semibold',
        lineHeight:height*0.035,
        color:'#444444'
    },
    descricaoOrador: {
        marginHorizontal: width*0.04,
        marginLeft: width*0.35,
        fontSize: width*0.025,
        fontWeight: 'bold',
        color:'black'
    },
    nomeOrador: {
        marginTop: width*0.02,
        marginHorizontal: width*0.04,
        fontSize: width*0.035,
        fontWeight: 'bold',
        color:'#444444'
    },
    linha: {
        width: width-width*0.08,
        backgroundColor: '#999999',
        height:width*0.0084,
        marginTop: width*0.0,
        marginHorizontal: width*0.04,
        borderRadius: 20,
    },
    buttonContainer:{
      marginTop:height *0.01,
      },

    button:{
        borderRadius:width*0.2,
        justifyContent:'center',marginBottom:height*0.04,
        alignSelf:'center',height:height*0.07,
        width:width*0.7,backgroundColor:'white',
        elevation:1,
        backgroundColor:'#96c45b'
    },
    
    vagasText:{
        height: height *0.05,
        marginTop:height*0.05,
        fontSize:width*0.055,
        fontFamily:'semibold',
        textAlign:'center',
        color:'#96c45b',
    },
})



