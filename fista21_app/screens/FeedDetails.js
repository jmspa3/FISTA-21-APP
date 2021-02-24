import React, { Component } from 'react';
import {StyleSheet,TouchableHighlight,Dimensions, Image, Text, View} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as Font from 'expo-font';
import { Icon } from 'react-native-elements';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        minHeight:height,
        backgroundColor:'white',
        paddingBottom:height*0
    },
    imagem: {
        width: width*0.6, 
        height: width*0.30,
    },
    texto: {
        marginVertical: height*0.01,
        fontSize:width*0.07,
        fontFamily: 'regular',
        textAlign:'center',
    },
    tipoEmpresa: {
        fontSize:width*0.08,
        fontFamily: 'regular',
        textAlign: 'center',
        color:'#fff',
    },
    descricao: {
        lineHeight:width*0.06,
        fontFamily: 'regular',
        marginTop: width*0.07,
        marginHorizontal:width*0.04,
        fontSize: width*0.045,
        textAlign:'justify'
    },
})

class App extends Component {
  state = {
    post:this.props.route.params.data,
    imagem: this.props.route.params.imagem,
    nome: this.props.route.params.nome,
    plano: this.props.route.params.plano,
    fontsLoaded:false,
  }

  cores =[
    {cor:'#dbebc7', key:'premium'},
    {cor:'#ffeecc', key:'gold'},
    {cor:'#d9d9d9', key:'silver'},
]

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
  }


imagens(){
    if(this.state.post.avatar1===null){
        return<View style={{
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 6,
            },
            shadowOpacity: 0.37,
            shadowRadius: 7.49,
            alignItems:'center',
            flexDirection:'row'
        }}>
            <Image
                resizeMode={'contain'}
                source={{uri:'https://fista.iscte-iul.pt/storage/'+ this.state.post.avatar2}}
                style={{width: width*0.8, height:width*0.60,marginLeft:width*0.1}}
            />
        </View>
    }else 
    if(this.state.post.avatar2===null){
        return<View style={{
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 6,
            },
            shadowOpacity: 0.37,
            shadowRadius: 7.49,
            alignItems:'center',
            flexDirection:'row'
        }}>
            <Image
                resizeMode={'contain'}
                source={{uri:'https://fista.iscte-iul.pt/storage/'+ this.state.post.avatar1}}
                style={{width: width*0.8, height: width*0.60,marginLeft:width*0.1}}
            />
        </View>
    }else{
        return <View style={{
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 6,
            },
            shadowOpacity: 0.37,
            shadowRadius: 7.49,
            alignItems:'center',
            
            
        }}>
            <Image
                resizeMode={'contain'}
                source={{uri:'https://fista.iscte-iul.pt/storage/'+ this.state.post.avatar1}}
                style={{width: width*0.8, height: width*0.43}}
            />
        
            <Image
                resizeMode={'contain'}
                source={{uri:'https://fista.iscte-iul.pt/storage/'+ this.state.post.avatar2}}
                style={{width:width*0.8, height: width*0.43}}
            />
        </View>
    }
}

  render(){
    if(this.state.fontsLoaded){
    return (
        <ScrollView style={{marginTop:height*0.02 ,backgroundColor:"white"}}>
            <TouchableHighlight onPress={() => this.props.navigation.goBack()} activeOpacity={0.86} underlayColor={'white'}style={{
  position:'relative',backgroundColor:'transparent'
,borderRadius:30,
  paddingVertical:height*0.022,marginHorizontal:width*0.00001,
  width:width*0.165, backgroundColor:"transparent",color:"blue"}}> 
<Icon
name={'arrow-left'}
type='feather'
backgroundColor="transparent"
color="black"
size={width*0.065}
      
/>
</TouchableHighlight> 
        <View style={styles.container}>
            <View style={{
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 6,
                },
                shadowOpacity: 0.37,
                shadowRadius: 7.49,
                alignItems:'center',
                marginTop:height*0.02,
            }}>
            <Image
                resizeMode={'contain'}
                source={{uri:'https://fista.iscte-iul.pt/storage/'+ this.state.imagem}}
                style={styles.imagem}
            />
            </View>
            <View style={{
                backgroundColor:this.state.plano !== ""?this.cores.filter( color => color.key === this.state.plano)[0].cor:'white',
                marginTop: height*0.03,
            }}>
                <Text style={styles.texto}>{ this.state.nome}</Text>
            </View>
            <View style={{
                marginTop:height*0.02,
                alignItems:'center',
            }}>
                <Text style={{fontSize:width*0.06,fontWeight: 'bold',textAlign:'center',width:width*0.8}}>{ this.state.post.titulo}</Text>
            </View>

            <Text style={styles.descricao}>{ this.state.post.descricao }</Text>
            
            {this.imagens()}
        </View>
        <View style={{height:height*0.2}}></View>
    </ScrollView>
    );
  } else{ return null}}
}

export default App;