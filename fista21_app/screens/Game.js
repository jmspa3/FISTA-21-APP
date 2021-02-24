import React, { Component} from "react";
import {  TouchableHighlight,Animated,Modal,StyleSheet,Image, Text, View,Dimensions } from "react-native";
import {Icon } from 'react-native-elements';
import QuestionsView from "../components/questionsView";
import ScannerView from "../screens/Scanner";
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class Game extends Component {

  state = {
    start: false,
    scanned : false,
    fadeAnim: new Animated.Value(0),
    modalVisible:'',
    fontsLoaded: false,
    questions:"",
    token:"",
  };


init() {
  this.setState({
     scanned: true,
  });
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
    hammer:  {
      uri:  require('../assets/fonts/Hammer.ttf'),
      // Only effects web
      display: Font.FontDisplay.SWAP,
    },
    spartan_Bold:  {
      uri: require('../assets/fonts/Spartan-Bold.ttf'),
      // Only effects web
      display: Font.FontDisplay.SWAP,
    },
    snippet:  {
      uri: require('../assets/fonts/Snippet-Regular.ttf'),
      // Only effects web
      display: Font.FontDisplay.SWAP,
    },
  });
  this.setState({ fontsLoaded: true });
}

async regrasJogo(){
  await AsyncStorage.setItem('regrasJogo','aberto')
}

async componentDidMount(){

  this.loadFonts();
  if(await AsyncStorage.getItem('regrasJogo')!='aberto'){
    this.setState({modalVisible:true});
  }
 
  }

updateQuestions = (w,t) => {

  this.setState({questions: w});
  this.setState({token:t});
}

  render() {

    const startView = (
      <View style={styles.startButtonContainer}>
        <View style={{height:height*0.45,}}>
        <Text style={{
          textAlign:'center',
           borderRadius: 50,
           color:"#88B859",
           backgroundColor:'white',
           fontFamily:'hammer',
           height:height*0.14,
           width: width*0.47,
           alignItems:'center',
           alignSelf:'center',
           fontSize:height*0.09,
           
        }}>QUIZ</Text>
        <Image style={{width:width*0.64, height: width*0.336}}
               source={require('../assets/fistaGo2.png')}>
       </Image>
       </View> 

       <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.15)'}}>
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
          <View style={{flexDirection:'row',alignContent:'space-between'}}>
              <View style={{flex:0.9}} >
              <Image
                source={require('../assets/fistaverde.png')}
                style={{marginTop:height*0.023,width:width*0.3,height:width*0.067,marginLeft:width*0.05}}
              />
              </View>
              <View  >
              <TouchableHighlight activeOpacity={0.86} underlayColor={'#F5F8F1'}style={{top:height*0.01,
              alignSelf:'flex-end',justifyContent:'flex-end',alignItems:'flex-end',backgroundColor:'white',
              borderRadius:40,padding:width*0.02} }
              onPress={() => {
                this.setState({modalVisible: false});
                this.regrasJogo();
              }}
              >
              <Icon
                name='close'
                type='ionicons'
                backgroundColor="transparent"
                color="#95C45A"
                size={width*0.06}
              />
             </TouchableHighlight>
             </View>
              </View>
            <View style={{alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontFamily:'semibold',color:'#5E5E5E',textAlign:'center',fontSize:width*0.07}}>{'\n'}Bem-vindos ao Jogo</Text>
              <Text style={{
                backgroundColor:'white',
                
                color:'grey',
                borderRadius:12,
                marginTop:height*0.02,
                marginBottom:height*0.02,
                marginHorizontal:width*0.07,
                textAlign:'justify',
                fontSize:width*0.0467,
                justifyContent:'center'}}
              >
              
              No site da easyvirtualfair, cada empresa tem um<Text style={{fontFamily:'semibold'}}> stand </Text>com um<Text style={{fontFamily:'semibold'}}> código </Text>associado.{'\n'}{'\n'}
              Por cada<Text style={{fontFamily:'semibold'}}> código </Text>introduzido, recebes duas<Text style={{fontFamily:'semibold'}}>  perguntas</Text>.{'\n'}{'\n'}
              Cada<Text style={{fontFamily:'semibold'}}>  pergunta  </Text>vale 25 pontos caso a resposta seja a<Text style={{fontFamily:'semibold'}}> certa </Text>,
              ou seja, podes ganhar<Text style={{fontFamily:'semibold'}}>  até  </Text>50 pontos por cada código inserido.</Text>

              
            </View>
            </View>
          </View>
        </Modal>
       <TouchableHighlight activeOpacity={1.5} underlayColor={'transparent'} style={{ 
         paddingVertical: width*0.03,
         borderRadius: 50,
         backgroundColor:"#82AD58",
         elevation:2,
         shadowColor: "#000",
         shadowOffset: {
           width: 0,
           height: 9,
         },
         shadowOpacity: 0.25,
         shadowRadius: 7,
         width: width*0.40,
         alignItems:'center',
         alignSelf:'center',
         alignContent:'center',
         marginTop:height*0.02,
         }}onPress={ () => this.init()}>
         <Text style={{  
            fontSize:width*0.05,
            alignSelf:'center',
            color:"white",
            fontFamily:'bold',
          }} > Iniciar</Text>
       </TouchableHighlight>
      </View>
    
    );

    const startScreen = (
      
    ( this.state.scanned === false ? startView: <ScannerView updateQ={this.updateQuestions} nxtStart={() => this.setState(({ scanned: false }))} nxtQV={() => this.setState(({ start: true }))}/>));
    

    if (this.state.fontsLoaded) {
    return (
      <View style={this.state.scanned === false && this.state.start === false ? styles.mainContainer : {flex:1}} >
        {this.state.start === false ? startScreen : <QuestionsView nxtStart={() => this.setState(({ scanned: false }))} nxtSS={() => this.setState(({ start: false }))} token={this.state.token} bank={this.state.questions} handler={() => this.setState(({ start: false, scanned:false }))}/>}
      </View>
    );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  
  nextButtonContainer: {
    alignItems: "flex-end",
    alignSelf:'center',
    marginTop:-height *0.06,
  },

  mainContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    color: "green",
  },
  startButtonContainer: {
    alignItems: "center",
    height:height*0.55,
    backgroundColor:'white'
  },
  startContainerText: {
    fontSize: 20,
    paddingBottom: 20,
    color: "green",
  },
});

export default Game;