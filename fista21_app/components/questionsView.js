import React, { Component} from "react";
import {Easing,Animated,FlatList,StyleSheet,Image,Alert,Text, View, TouchableHighlight,Dimensions } from "react-native";
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import * as Font from 'expo-font';
import LottieView from 'lottie-react-native';
import API from '../components/api.js';
import AsyncStorage from '@react-native-async-storage/async-storage';



const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class QuestionsView extends Component {

  state = {
    questionBank:[],
    quizScore: 0,
    index: 0,
    disable: false,
    nextQuestion: false,
    finish:false,
    fadeAnim: new Animated.Value(0),
    currentOption:0,
    selectedId:"",
    currentQuestion:0,
    selectedtItem:"",
    isPlaying:true,
    counter:5,
    button:new Animated.Value(0),
    lottie:new Animated.Value(0),
    answers:0,
    firstAnim:true,
    counterFirst:3,
    fontsLoaded:false,
    boolean:false,
  };

 

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

async componentDidMount(){
  this.loadFonts();
  this.setState({questionBank:JSON.parse(this.props.bank)});
}




questionView = (indexView,score,currentQuestion,btnText,pressEvent) => {
 
 
  return(
    <View>
    { this.state.firstAnim === false?
      
      <View style={styles.questionViewContainer}>

    <View style={styles.questionContainer}>
      <View style={{flexDirection:'row-reverse'}}>
     <View style={{alignSelf:'flex-end',justifyContent:'flex-end',alignItems:'flex-end',marginBottom:height*0.011,marginLeft:width*0.18}}> 
      <CountdownCircleTimer
        isPlaying={this.state.isPlaying}
        size={100}
        duration={20}
        strokeWidth={width*0.015}
        key={this.state.counter}
        colors="#9BC174"
        onComplete={() => {
          this.setState({isPlaying:false});
          this.handleSelection("",currentQuestion,pressEvent);
          
        }}
      >
        {({ remainingTime }) => (
          <Animated.Text
            style={{ ...styles.remainingTime, fontFamily:'semibold',color: '#333333',fontSize:width*0.08 }}>
            {remainingTime}
          </Animated.Text>
        )}
      </CountdownCircleTimer>
  </View>
      <Text style={{fontFamily:'semibold',textAlign:'left',alignSelf:'flex-end',color:'#9BC174',marginLeft:width*0.04,fontSize:width*0.088}}>
        Pergunta {indexView}
      </Text>
    
     </View>
  
      <Text style={styles.questionContainerText}>
        {currentQuestion.pergunta}
      </Text>
  

      
      {this.currentQF(currentQuestion,pressEvent)}

        
    </View>
   
  </View> : <View style={{justifyContent:'center',marginTop:-height*0.1,alignSelf:'center',alignContent:'center',alignItems:'center',flex:1}}>  
    <Text style={{fontFamily:'semibold',color: '#9BC174',fontSize:width*0.1,textAlign:'center' }}>Estás preparado ?</Text>
  <CountdownCircleTimer
        isPlaying
        size={200}
        key={0}
        duration={3}
        strokeWidth={width*0}
        key={this.state.counter}
        colors="#9BC174"
        onComplete={() => {
          this.setState({firstAnim:false});
        }}
      >
        {({ remainingTime }) => (
          <Animated.Text
            style={{ ...styles.remainingTime, fontFamily:'semibold',color: '#82AD58',fontSize:width*0.3 ,marginTop:height*0.1}}>
            {remainingTime}
          </Animated.Text>
        )}
      </CountdownCircleTimer>
      </View> }</View>)

}
 

  _keyExtractor = (item) => item.toString() + Math.random().toString();


  handleSelection = (id,cq,press) => {

    if(this.state.selectedId === id){
      this.setState({selectedItem: ""})
    }
    else {
      this.setState({selectedItem: id})
    }
   setTimeout(() => {

      this.checkAnswer(id,cq);
      press();
     this.setState({counter: this.state.counter - 1 });
     this.setState({isPlaying:true});

    }, 124); 
    
    

 }


  currentQF = (cq,pressEvent) => {
    
    const array = [cq.alinea1,cq.alinea2,cq.alinea3,cq.alinea4];

    return(
         
    <FlatList
      data={array}
      style={{height:height * 0.42,marginBottom:height * 0.05,marginTop:height*0.04}}
      
      keyExtractor={this._keyExtractor} 

      renderItem={({ item }) => {
        return (
  
    <TouchableHighlight
    disabled={this.state.disable}
    // key={currentQuestion.id}
    extraData={this.state.selectedId}
    //onPress={() => this.checkAnswer(item,cq)}
    activeOpacity={0.86} underlayColor={'transparent'}
    onPress={() => this.handleSelection(item,cq,pressEvent)}
    style={{alignSelf:'flex-start',width:width * 0.8, height:height * 0.13}} 
    
  >

    <View

      // ref={el => Ref[index] = el}
      style={item === this.state.selectedItem? styles.optionContainer2:styles.optionContainer}
    >
      <Text style={{color: "white",
    fontSize: width*0.045,
    backgroundColor:"#9BC174",textAlign:'center',justifyContent:'center',
    borderColor:"white",}}>{item}</Text>
  
    </View>
      
  </TouchableHighlight>

        );
      }}
    />
    )
    }

 



  
  


  checkAnswer = (option,question,index) => {
    if (question.alinea_correta == option) {
      this.setState({
        quizScore: this.state.quizScore + 25,
        answers:this.state.answers + 1,
        disable: true,
        nextQuestion: true,
        currentOption:index,

        // myRef: this.state.myRef.current[index].setNativeProps({style: {backgroundColor: 'green'}})
      });
    } else {
      this.setState({ 
        disable: true, 
        nextQuestion: true, 
        currentOption:index,
    
        // myRef:this.state.myRef.current[index].setNativeProps({style: {backgroundColor: 'red'}})
      });
    }
  };

  nextQuestion = () => {
    
    this.setState({
      index: this.state.index + 1,
      disable: false,
      nextQuestion: false,
      // myRef:this.state.myRef.current[currentQuestion].setNativeProps({style: {backgroundColor: '#446d8b'}})
    });
    
  };



 finalScoreView = () => {

  Animated.sequence([

    Animated.timing(this.state.lottie, {
      toValue: 1,
      duration: this.state.answers === 0 ? 0 : 3000,
      easing: Easing.linear,
      useNativeDriver:false,
    }),
   
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration:1100,
      useNativeDriver:false,
    }),
    Animated.timing(this.state.button, {
      toValue: 1,
      duration: 600,
      useNativeDriver:false,
    })
  ]).start()
  
  
      
    return(
      <View style={{marginTop:height*0.07}}>
      <View style={styles.startButtonContainer}>
      { this.state.answers === 0 ? <View></View> :
      <LottieView
          progress={this.state.lottie}
          autoPlay={false}
          loop={false}
          style={{
            position:'absolute',
            width: 400,
            height: 400,
            backgroundColor: 'white',
            marginTop:0,
          }}
      
          source={require('../assets/score.json')}
        />
 }
         <View
        style={[
          {marginTop:height*0.01,
            position:'relative',

          }
        ]}
    >
    <Animated.View style={{height:height*0.15,opacity: this.state.fadeAnim}}>
    <Text style={{marginHorizontal:width*0.017,fontFamily:'bold',textAlign:'center',alignSelf:'center',color:'#A7BA90',fontSize:width * 0.059,marginBottom:height * 0.07}}>{this.state.answers > 0 ? <Text>ACERTASTE {this.state.answers} PERGUNTA{this.state.answers>1?"S!":"!"}</Text>:<Text>NÃO ACERTASTE NENHUMA PERGUNTA!</Text> }</Text>
   
    </Animated.View>
    
   
    <Animated.View style={{height:height*0.4,opacity:this.state.button,marginTop:height*0.01,marginHorizontal:width*0.05}}>
    <View style={{height:height*0.2}}>
    <Text style={{marginHorizontal:width*0.001,fontFamily:'bold',textAlign:'center',alignSelf:'center',color:'#9BC174',fontSize:width * 0.1}}>{this.state.answers > 0 ? <Text>GANHASTE {this.state.quizScore} PONTOS!</Text>:<Text>Opps..!</Text> }</Text>
     </View>
     <TouchableHighlight onPress = {() => this.finishQuiz()} activeOpacity={0.5} underlayColor={'white'} style={{backgroundColor:"white"}}>
        <View style = {{...styles.buttonContainer,}}>
            <Text style = {styles.buttonContainerText}>Sair</Text>
        </View>
      </TouchableHighlight>
    </Animated.View>
    
    
    
    <Animated.View style={{alignItems:'flex-end',position:'relative',opacity: this.state.fadeAnim}}>

    <Image style={{alignSelf:'center',justifyContent:'flex-end',width: width*0.40, height: width*0.21}}
               source={require('../assets/fistaGo2.png')}></Image>
               </Animated.View>
    </View>
    
  

     
   
    </View>
   
     </View>
    
    )
 };


 finalScore = () => { 
  if(!this.state.boolean){
    return this.finalScoreView();
  } else{
    this.finishQuiz();
  }
};

final = () => { 
  this.finalScore();
  return this.finalScoreView();
};

  finishQuiz = () => {
    this.props.handler();
    this.setState({
      quizScore: 0,
      answers:0,
      index: 0,
      disable: false,
      nextQuestion: false,
      finish:false,
      firstAnim:true,
      button:new Animated.Value(0),
      lottie:new Animated.Value(0),
      fadeAnim:new Animated.Value(0),
    });
   
  };

   finalState = () => {
    this.func();


  }

  func = async() =>{
    try {
      const body = JSON.stringify({
        token: this.props.token,
        id: await AsyncStorage.getItem('user_token'),
        pontos:this.state.quizScore,
      
        });
        API.doRequest("POST", "gamepontos", body ).then(response => response.json()).then(async data => {
            if(data.code !== 300){
            this.setState({boolean: true});
            } else{
              this.setState({boolean: false});
            }
            })
            .catch(() => { Alert.alert("Falha na ligação", "Verifica se estás bem conectado ", [{ text: 'OK' ,  onPress: () => this.setState({boolean:false})}])})
          }  catch (error) {
            this.setState({boolean: false});
            Alert.alert("Falha na ligação", "Verifica se estás bem conectado ", [{ text: 'OK' }])
    }
    this.setState({
      finish:true,
    });
  }


  

 
  render() {

    

    const questionsView = (
        (indexView = this.state.index + 1),
      
        (currentQuestion = this.state.questionBank[this.state.index]),
      
        (score = this.state.quizScore),
      
        (btnText = indexView == 5 ? (btnText = "Finish") : (btnText = "Next")),
      
        (pressEvent =

        indexView != 2 ? (pressEvent = this.nextQuestion) : (pressEvent = this.finalState)),
        
      ( this.state.finish === false ? this.questionView(indexView,score,currentQuestion,btnText,pressEvent) : this.final()
        

      ));
if(this.state.fontsLoaded){
    return (
      <View style={styles.mainContainer}>
        {questionsView}
      </View>
    );
  } else{return false}}
}

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#9BC174",
    alignSelf: "center",
    padding: height *0.02,
    margin: 3,
    width: "100%",
    borderRadius: 10,
    borderWidth:0.00001,
    elevation: 3, borderColor: "white" ,
   shadowColor: "#000",shadowOffset: {width: 0,height: 6,},shadowOpacity: 0.2,shadowRadius: 10,
    
  
    // paddingBottom:30,
  },
  optionContainer2: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#9BC174",
    alignSelf: "center",
    padding: height *0.016,
    margin: 1,
    width: "100%",
    borderRadius: 10,
    borderWidth:4,
    elevation: 3, 
    shadowColor: "#000",shadowOffset: {width: 0,height: 6,},shadowOpacity: 0.2,shadowRadius: 10,
    borderColor: "#7C995E" ,
 
  },
  optionContainerText: {
    fontSize: width *0.085,
    color: "black",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    fontFamily:'regular',
  },
  questionContainer: {
 
    alignItems: "center",
    paddingBottom: 0,
    height:height *0.9,

  },
  questionContainerText: {
    color: "#333333",
    fontSize: width *0.05,
    backgroundColor:"white",
    borderColor:"white",
    fontFamily:'regular',
    marginLeft:width*0.04,
    marginTop:height*0.02,
    alignSelf:'flex-start',
  },
  nextButtonContainer: {
    alignItems: "flex-end",
    alignSelf:'center',
    backgroundColor:'white',
    marginTop:-height *0.10,
  },
  questionViewContainer: {
    marginTop: height*0.055,
    justifyContent: "flex-start",
    backgroundColor: "white",
    width: "90%",
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    color: "white",
  },
  scoreTextContainer: {
    fontSize: 20,
    paddingBottom: 20,
    color: "white",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-start",
    color: "green",
  },
  startButtonContainer: {
    alignItems: "center",
    paddingTop: 50,
    backgroundColor:'white'
  },
  startContainerText: {
    fontSize: 20,
    paddingBottom: 20,
    color: "green",
  },

  buttonContainer:{
    paddingVertical: width*0.02,
    borderRadius: 50,
    backgroundColor:"#89B062",
    elevation:2,
    shadowColor: "#000",shadowOffset: {width: 0,height: 15,},shadowOpacity: 0.25,shadowRadius: 10,
    width: width*0.54,
    alignItems:'center',
    alignSelf:'center',
    marginTop:height*0.02,
  },
  buttonContainerText:{
    fontSize:width*0.05,
    alignSelf:'center',
    color:"white",
  },
});

export default QuestionsView;