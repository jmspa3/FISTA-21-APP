import React, { Component } from 'react';
import {RefreshControl,BackHandler,StyleSheet,ActivityIndicator,Alert,SafeAreaView,Dimensions, Image, Text, View, FlatList,Modal,TouchableHighlight} from 'react-native';
import { Card } from 'react-native-paper';
import {Icon } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import API from '../components/api'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { SvgUri } from 'react-native-svg';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class App extends Component {
  state = {
    posts: [],
    refreshing: false,
    companies: [],
    modalVisible: '',
    loading:false,
    fontsLoaded:false,
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


  imagemEmpresa(idEmpresa) {
    for (const [i, companie] of this.state.companies.entries()) {
      if(companie.id == idEmpresa){
        return companie.avatar
      }
    }
  }
  
  nomeEmpresa(idEmpresa){
    for (const [i, companie] of this.state.companies.entries()) {
      if(companie.id == idEmpresa){
        return companie.nome_empresa
      }
    }
  }

  planoEmpresa(idEmpresa){
    for (const [i, companie] of this.state.companies.entries()) {
      if(companie.id == idEmpresa){
        return companie.plano
      }
    }
  }

  disableBackButton= ()=> {
    if (!this.props.navigation.isFocused()) {
      return false;
    } else{
    BackHandler.exitApp();
    return true;
    }
  }

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress',this.disableBackButton);
  }

  async componentDidMount() {
    
    BackHandler.addEventListener('hardwareBackPress',this.disableBackButton);
    this.loadFonts();

    if(await AsyncStorage.getItem('modalAbertura')!='aberto'){
      this.setState({modalVisible:true})
    }
    this.obterPosts()
    try {
      await API.doRequest('GET', 'empresas', "registered=true").then(data => {
        this.setState({ companies: data });
        this.setState({loading:true});
    })
      
      .catch(() => { Alert.alert("Falha na ligação", "Verifica se estás bem conectado", [{ text: 'OK' , onPress:()=> this.setState({loading:true})}])})
    } catch {
      Alert.alert("Falha na ligação", "Verifica se estás bem conectado", [{ text: 'OK' }])
    }
  }

  async obterPosts(){
    try {
      await API.doRequest('GET', 'feed', "registered=true").then( data => {
        let array = data.sort((a, b) => b.id - a.id)
        this.setState({posts: array.slice(0,10)});
      })
      .catch(() => { Alert.alert("Sem ligação à Internet", "Não foi possivel atualizar o feed. ", [{ text: 'OK' }])})
    } catch {
      Alert.alert("Sem ligação à Internet", "Não foi possivel atualizar o feed. ", [{ text: 'OK' }])
    }
  }

  async guardarAbertura(){
    await AsyncStorage.setItem('modalAbertura','aberto')
  }

  wait = timeout => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  };

  isSvg(str){
    var pos = str.indexOf("svg");
    if(pos > -1){
        return true;
    }else{return false;}

    }





  onRefresh() {
    this.setState({refreshing: true})
    this.obterPosts()
    this.wait(2000).then(() => this.setState({refreshing: false}));
  }

  renderItem = ({ item }) => {

    if(item.plano !== ""){

      var imagem;
      if(this.imagemEmpresa(item.id_empresa) !== null){
          if(this.isSvg(this.imagemEmpresa(item.id_empresa))){

          imagem = <SvgUri style={{marginLeft:width*0.01}} resizeMode={'contain'} uri ={'https://fista.iscte-iul.pt/storage/'+this.imagemEmpresa(item.id_empresa)} width={width*0.20} height={height*0.152} />;
         
        }else{
          imagem = <Image
          
              resizeMode={'contain'}
              source={{uri:'https://fista.iscte-iul.pt/storage/' +this.imagemEmpresa(item.id_empresa)}}
              style={styles.imagem}
          />;
      }
      }else{
         imagem = <Image
              source={require('../assets/default.png')}
              style={styles.imagem}
          />;
      }
    }
    return( <View style={styles.feedItem}>
      <Card  style={{   backgroundColor: "white",elevation:6,marginLeft:width*0.02,shadowColor: "#000",shadowOffset: {width: 0,height: 5,},shadowOpacity: 0.25,shadowRadius: 10,width:width * 0.85}} onPress={() => this.props.navigation.navigate('Publicação',{ data: item, imagem: this.imagemEmpresa(item.id_empresa), nome: this.nomeEmpresa(item.id_empresa),plano:this.planoEmpresa(item.id_empresa)})}>
        <View style={{backgroundColor:'transparent',flex:1,flexDirection:'row',}}>
          <View style={{backgroundColor:'transparent',marginTop:height*0.04,shadowColor: "#000",marginLeft:-height*0.017,}}>
            <Card  style={{elevation:10,shadowOffset: {width: 3,height: 3,},shadowOpacity: 0.25,shadowRadius: 4,marginTop:-height*0.07,width:width*0.22,height:width*0.22,borderRadius:50}}>
            {imagem}  
            </Card>
          </View>

          <View style={{backgroundColor:'transparent',alignSelf:'center',width:width*0.65,}}>
            <Text style={{fontFamily:'semibold',backgroundColor:'transparent',fontSize:width*0.06,alignSelf:'stretch',textAlign:'left',marginLeft:width*0.03,marginTop:height*0.01}}>{this.nomeEmpresa(item.id_empresa)}</Text>
          </View>
        </View>

        <View style={{backgroundColor:'transparent',width:width*0.60,marginTop:height*0.015}}>
          <Text style={{fontFamily:'regular',backgroundColor:'transparent',fontSize:width*0.05,alignSelf:'stretch',textAlign:'left',marginLeft:width*0.03}}>{item.titulo}</Text>
        </View>
        
        <Text style={styles.post}>{item.descricao}</Text>
        <Card.Cover source={{uri:'https://fista.iscte-iul.pt/storage/'+ item.avatar1}} style={styles.postImage} />
        <Text style={{fontFamily:'regular',color:'grey',marginBottom:height*0.01,marginLeft:width*0.03}}>Clica em cima para saberes mais!</Text>
      </Card>
    
    </View>
     );
  }

  
  _keyExtractor = (item) => item.toString() + Math.random().toString();

  render(){

    if(this.state.fontsLoaded){
    return (
      <SafeAreaView style={styles2.Container}>
        <StatusBar style="dark" />
        <Image
          source={require('../assets/fistaverde.png')}
          style={{marginTop:40,width:114,height:25,marginLeft:16}}
        />
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
              elevation:5,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
          
              }}>
            <View style={{flexDirection:'row',alignContent:'space-between'}}>
              <View style={{flex:0.9}} >
              <Image
                source={require('../assets/fistaverde.png')}
                style={{marginTop:height*0.023,width:width*0.3,height:width*0.067,marginLeft:width*0.05}}
              />
              </View>
              <View>
              <TouchableHighlight activeOpacity={0.86} underlayColor={'#F5F8F1'}style={{top:height*0.01,
              alignSelf:'flex-end',justifyContent:'flex-end',alignItems:'flex-end',backgroundColor:'white',
              borderRadius:40,padding:width*0.02} }
              onPress={() => {
                this.setState({modalVisible: false});
                this.guardarAbertura();
              }}
              >
              <Icon
                name='close'
                type='ionicons'
                backgroundColor="transparent"
                color="#95C45A"
                size={Dimensions.get('window').width*0.06}
              />
             </TouchableHighlight>
             </View>
             </View>
            
            <View style={{alignItems:'center',justifyContent:'center'}}>
              <Text style={{
                backgroundColor:'white',
                padding:5,
                color:'grey',
                borderRadius:12,
                marginTop:height*0.03,
                marginBottom:height*0.03,
                marginHorizontal:20,
                fontFamily:'regular',
                textAlign:'justify',
                fontSize:width*0.06,
                justifyContent:'center'}}
              >Bem-vindos, nesta página poderão ver as publicações das empresas que participam no evento!</Text>

                </View>
            </View>

          </View>
        </Modal>
        <View style={{
          marginTop:height*0.02,
          borderColor:'#E8E8E8',
          borderTopWidth:height*0.001,
        }}>
          {!this.state.loading? <View style={{height:height*1}}><ActivityIndicator style={{height:height*0.7,alignSelf:'center',justifyContent:'center',alignContent:'center'}}size="large" color="#96c45b" /></View>:
          <FlatList
            style={styles.feed}
            data={this.state.posts}
            renderItem={this.renderItem}
            refreshControl={<RefreshControl colors={['#9CC56F']}refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)} />}
            ListFooterComponent={<View style={{height:height*0.1}}></View>}
            keyExtractor={this._keyExtractor}
          />}
        </View>
      </SafeAreaView>
    );
  } else{return null}}
}


export default App;


const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: "#EBECF4"
  },

  header: {
  paddingTop: 64,
  paddingBottom: 16,
  backgroundColor: "#FFF",
  alignItems: "center",
   justifyContent: "center",
   borderBottomWidth: 1,
   borderBottomColor: "#EBECF4",
   shadowColor: "#454D65",
   shadowOffset: { height: 5 },
   shadowRadius: 15,
   shadowOpacity: 0.2,
   zIndex: 10
   },

   headerTitle: {
   fontSize: 20,
   fontWeight: "500"
   },

   feed: {
    marginTop:height*0.00,marginBottom:height*0.9,backgroundColor:'white',paddingBottom:height*0.4,
  
  height:height*0.9,
  flexGrow:0,

   },

   feedItem: {
    marginHorizontal: width*0.04,
   backgroundColor: "transparent",
   borderRadius: 5,
   paddingBottom:height*0.10,
   paddingHorizontal:width*0.02,
   marginTop:height*0.06,

   },

   avatar: {
   flex:1,
   alignSelf:'center',
   marginRight: 0,
   width:width*0.17,
   resizeMode:'contain',
   },

   name: {
   fontSize: 30,
   fontWeight: "500",
   color:'black',
   },

   timestamp: {
   fontSize: 11,
   color: "#C4C6CE",
   marginTop: 4
   },

  post: {
    height:70,
    marginTop: 16,
    fontSize: 14,
    color: "#838899",
    marginHorizontal:13,
    textAlign:'justify'
  },
  postImage: {
   width: width*0.7,
   height: 150,
   marginBottom:25,
   shadowColor: "#000",
   shadowOffset: {
     width: 0,
     height: 2
   },
   shadowOpacity: 0.25,
   shadowRadius: 3.84,
   elevation: 4,
   marginVertical: 16,
   alignSelf:'center',
   alignContent:'center',
  }
});

const styles2 = StyleSheet.create({
container: {
},
mask: {
  backgroundColor: 'white',
},
mask2:{
  backgroundColor: 'white',
  alignItems:'center',
  marginTop:height*0.000001,
},
Container: {
  width: '100%',
  backgroundColor:'#fff',
},
token: {
  fontSize:width*0.063,
  textAlign: 'center',
  color:'#6D6E6D',
  marginTop: height*0.13,
  alignItems:'center',
  marginRight:width*0.17,
},
feed_title: {
  fontSize: 40,
  textAlign: 'left',
  marginHorizontal: 25,
  color:'#9CC56F',
  marginBottom:10,
  marginTop:height*0.03,
  position: 'absolute',
  height: height*0.5,
},
name: {
  fontSize:width*0.063,
  marginTop:height*0.1,
  marginHorizontal:width*0.05,
  color:'#4F545E',

},
news_container: {
  marginHorizontal:width*0.05,
}
});
