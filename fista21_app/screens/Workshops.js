import React, {Component} from 'react';
import {StyleSheet,Image, SafeAreaView,ActivityIndicator,StatusBar,TouchableOpacity,TouchableHighlight,Dimensions, Text, View, FlatList} from 'react-native';
import Constants from 'expo-constants';
import { Card } from 'react-native-paper';
import API from '../components/api';
import * as Font from 'expo-font';



const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'white',
      marginTop: Constants.statusBarHeight || 0,
      marginBottom: height*0.03
    },
    scrollView: {
      backgroundColor: 'white',
      marginHorizontal: 0,
      
    },
  });








class App extends Component   {

  state = {
    changeScreen:true,
    token: '',
    modalVisible: true,
    workshops:[],
    fontsLoaded:false,
    loadingW:false,
    loadingK:false,
    keynotes:[],
}
  

  
async componentDidMount() {
  await this.loadFonts();
  this.setState({ fontsLoaded: true });
  this.loadData();
  this.loadKeynotes();
  this._unsubscribe = this.props.navigation.addListener('focus', () => {
    this.loadData();
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
  });
 
}



async loadData(){
  try {
    await API.doRequest('GET', 'workshops', "registered=true").then(data => {
      this.setState({ workshops: data.filter(e => e.show === 1) })
      this.setState({loadingW:true});
    })
    .catch(() => { Alert.alert("Sem ligação à Internet", "Verifica se estás conectado", [{ text: 'OK' , onPress:()=> this.setState({loadingW:true}) }])}) 
    this.setState({loadingW:true});
} catch {
  Alert.alert("Sem ligação à Internet", "Verifica se estás conectado", [{ text: 'OK' }])
}
}


async loadKeynotes(){
  try {
    await API.doRequest('GET', 'keynotes', "registered=true").then(data => {
      this.setState({ keynotes: data});
      this.setState({loadingK:true});
    })
  
    .catch(() => { Alert.alert("Sem ligação à Internet", "Verifica se estás bem conectado", [{ text: 'OK' , onPress:()=> this.setState({loadingK:true}) }])}) 
} catch {
  Alert.alert("Sem ligação à Internet", "Verifica se estás conectado ", [{ text: 'OK' }])
}
}



async componentWillUnmount() {
  this._unsubscribe();
}   

getParsedDate(strDate){
  var strSplitDate = String(strDate).split(' ');
  var date = new Date(strSplitDate[0]);
  // alert(date);
  var dd = date.getDate();
  var mm = date.getMonth() + 1; //January is 0!

  var yyyy = date.getFullYear();
  if (dd < 10) {
      dd = '' + dd;
  }
  if (mm < 10) {
      mm = '0' + mm;
  }
  date =  dd + "-" + mm + "-" + yyyy;
  return date.toString();
}

getParseHours(strDate){
  var strSplitDate = String(strDate).split(' ');
  var hh = String(strSplitDate[1]).split(':');
  return hh[0] + "h" + hh[1];
}

getParseDay(strDate){
  var strSplitDate = String(strDate).split(' ');
  var date = new Date(strSplitDate[0]);
  return  "Dia " + date.getDate();
}


  _renderItem = ({ item }) => {

    const date = this.getParseDay(item.begin) + "  às  " + this.getParseHours(item.begin);


  return (
    <TouchableHighlight  underlayColor={'transparent'} onPress={() => this.props.navigation.navigate('WorkshopsDetails', {data: item})}>
    <View style={{height: height *0.50,marginBottom:height *0.0003}}>


    <Card style={{ 
    alignSelf:'center',
    marginTop:height*0.03,height:height*0.08,width: Math.round((width + 80) * 0.60)
    }}>
     <View  style={{elevation:1,shadowColor: "#000",shadowOffset: {width: 3,height: 5,},shadowOpacity: 0.25,shadowRadius: 10,backgroundColor:'white',height: height *0.23}}>
   <Card.Cover style={{alignSelf:'center',borderRadius:6,elevation:5, height: height *0.25,width:Math.round((width + 80) * 0.63)}}  source={item.image !== null ? {uri:'https://fista.iscte-iul.pt/storage/'+ item.image}: require('../assets/workshop.png')}  />
   </View>
   
   
   <Text style={{textAlign:'center',fontSize:width*0.046,fontFamily:'semibold',color:'#333333',marginTop:height*0.05,marginHorizontal:width*0.000}}>{item.title}</Text>
   <Text style={{textAlign:'center',fontSize:width*0.050,fontFamily:'regular',color:'#A3BA85',marginBottom:height*0.03,marginTop:height*0.01,marginHorizontal:width*0.00}}>{date}</Text>
   </Card>


    </View>
    </TouchableHighlight>
   
  );
}


_renderKeynote = ({ item }) => {
    
    

  return (
    <View style={{borderRadius:30,height: height *0.56,paddingBottom:height*0.001,}}>
    <Card style={{ 
    alignSelf:'center',
    borderRadius:30,
    marginTop:height*0.03,height:height *0.26,width: Math.round((width + 80) * 0.65)
    }}>
    <TouchableHighlight  underlayColor={'transparent'} style={{    borderRadius:30,elevation:1,shadowColor: "#000",shadowOffset: {width: 3,height: 5,},shadowOpacity: 0.25,shadowRadius: 10,backgroundColor:'white',height: height *0.25}}onPress={() => this.props.navigation.navigate('KeynotesDetails', {data: item})}>
   <Card.Cover resizeMode={`contain`} style={{alignSelf:'center',borderRadius:10,elevation:5, shadowColor: "#000",shadowOffset: {width: 0,height: 15,},shadowOpacity: 0.25,shadowRadius: 10, height: height *0.26,width:Math.round((width + 80) * 0.65)}} source={item.avatar_empresa !== "" && item.avatar_empresa !== null ? {uri: item.avatar_empresa}: require('../assets/keynotes.png')}  />
   </TouchableHighlight>
   <Text style={{textAlign:'center',fontSize:width*0.056,fontFamily:'semibold',color:'#333333',marginTop:height*0.05,marginBottom:0,marginHorizontal:width*0.05}}>{item.titulo}</Text>
   <Text style={{fontSize: width*0.050,textAlign:'center',
		marginRight:width*0.1,
		fontFamily: 'semibold',color:'grey',marginLeft:width*0.066}}> {item.dia !== null? item.dia: ""}</Text>
   </Card>
    </View>
   
  );
}


  change(){
    const loadingView =  (<View style={{height:height*0.9,backgroundColor:'#FAFAFA'}}>
    <ActivityIndicator style={{height:height*0.7,alignSelf:'center',justifyContent:'center',alignContent:'center'}}size="large" color="#96c45b" />
 </View>);

    if(!this.state.loadingW){
      return loadingView;
    } else{
          if(this.state.changeScreen) {
            if(!this.state.loadingW){
              return loadingView;
            }else{
            return(
          <FlatList
            data={this.state.workshops}
            renderItem={this._renderItem}
            keyExtractor={item => item.title}
            style={{height:height*0.9,backgroundColor:'#FAFAFA'}}
            ListFooterComponent={<View style={{height:height*0.2}}></View>}
        
          
          />
            );
            }
              }else{ 
                if(!this.state.loadingK){
                  return loadingView;
                }else{
                  return (   
                            <FlatList
                      data={this.state.keynotes}
                      renderItem={this._renderKeynote}
                      keyExtractor={item => item.titulo}
                      style={{height:height*0.9,backgroundColor:'#FAFAFA'}}
                      ListFooterComponent={<View style={{height:height*0.10}}></View>}
                    />);
                }
              }
        }
      }

  render(){

if(this.state.fontsLoaded){
  return (

    <SafeAreaView style={styles.container,{ backgroundColor: "#FFF",paddingTop:height*0.05}}>
 <StatusBar style="dark" />
    <View style={{flexDirection:'row',marginHorizontal:width *0.15,width:width *0.7,justifyContent:'space-around',marginBottom:height*0.027,marginTop:height*0.019,backgroundColor:'white'}}>
                   
                    <TouchableOpacity
                            style={{marginHorizontal:width*0.1,backgroundColor:'white'}}
                            onPress={() => this.setState({ changeScreen: true }) }
                         >
                            <Text style={!this.state.changeScreen? {fontFamily:'regular',fontSize:width*0.065,marginTop:height*0.005,opacity:0.8,color:'#96c45b'}:{fontFamily:'regular',fontSize:width*0.070,color:'#96c45b'}}
                       >Workshops</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{marginHorizontal:width*0.1,backgroundColor:'white'}}
                            onPress={() => this.setState({ changeScreen: false }) }
                         >
                            <Text style={!this.state.changeScreen? {fontSize:width*0.070,color:'#96c45b',fontFamily:'regular'}:{fontFamily:'regular',opacity:0.8,color:'#96c45b',fontSize:width*0.065,marginTop:height*0.005}}
                        >Keynotes</Text>
                        </TouchableOpacity>
                     
    </View>
    <View>
    {this.change()}

     </View>
    </SafeAreaView>

  );
  
        
      }else{
        return null
      }}
    }



export default App;