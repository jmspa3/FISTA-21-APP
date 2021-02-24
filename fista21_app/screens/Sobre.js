import React,{Component} from 'react';
import {View,Dimensions,Text,Image, ScrollView} from 'react-native';
import * as Font from 'expo-font';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
class  Sobre extends Component  {

  state = {fontsLoaded : false}

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

  async componentDidMount(){
    await this.loadFonts();
  }

  render(){
 if(this.state.fontsLoaded){
  return (
      <ScrollView>
        <View style={{backgroundColor:'#fff',minHeight:height}}>
          <View style={{alignItems:'center',flexDirection:'row',justifyContent:'flex-end'}}>
            <Image
                resizeMode={'contain'}
                source={require('../assets/fista-verde.png')}
                style={{width:width*0.34}}
            />
          </View>

          <Text style={{
            fontSize: width*0.05,
            marginHorizontal:width*0.05,
            textAlign:'justify',
            marginTop:height*0.03,
            lineHeight:30,
            fontFamily:'regular',

          }}>
            O "Forum of Iscte School of Technology and Architecture" é um evento anual que decorre em Lisboa graças à vontade e dedicação dos estudantes da Escola de Tecnologias e Arquitetura em trazer o mundo das empresas à universidade. São dois dias de apresentações, workshops e bancas de empresas nacionais e internacionais que trouxeram, o ano passado, mais de 2100 participantes e mais de 80 empresas! Visita o nosso website para veres como foi o FISTA o ano passado. Depois disso, não o vais querer perder!
          </Text>

          <View style={{alignItems:'center',justifyContent:'flex-start'}}>
            <Image
                resizeMode={'contain'}
                source={require('../assets/sobre.jpeg')}
                style={{width:width*0.85,height:height*0.3,marginBottom:height*0.15,marginTop:height*0.03}}
            />
          </View>
          
        </View>
      </ScrollView>
  );
} else { return null}}
}
export default Sobre;