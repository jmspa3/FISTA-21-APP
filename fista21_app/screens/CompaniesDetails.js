import React, {Component} from 'react';
import {StyleSheet, Text, View,TouchableHighlight,Image, Dimensions, ScrollView} from 'react-native';
import { Icon } from 'react-native-elements';
import * as Font from 'expo-font';
import { SvgUri } from 'react-native-svg';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

 class CompaniesDetails extends Component {
    state = {
        token: '',
        modalVisible: true,
        company:this.props.route.params.data,
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
               
              semibold:  {
                uri: require('../assets/fonts/MyriadProSemibold.ttf'),
                // Only effects web
                display: Font.FontDisplay.SWAP,
              },
        });
        this.setState({fontsLoaded:true})
    
      }
    

    
    async componentDidMount(){
        this.loadFonts();
    }

    
    cores =[
        {cor:'#96c45b', key:'premium'},
        {cor:'#ffcc66', key:'gold'},
        {cor:'#999999', key:'silver'},
    ]

    cores2 =[
        {cor:'#dbebc7', key:'premium'},
        {cor:'#ffeecc', key:'gold'},
        {cor:'#d9d9d9', key:'silver'},
    ]

    handleToken = (text) => {
        this.setState({ token: text })
      }
      isSvg(str){

        var pos = str.indexOf("svg");
        if(pos > -1){
         
            return true;
        }else{return false;}
    
        }

    render(){
        if(this.state.fontsLoaded ){
        return (
            <ScrollView style={{flex:1,backgroundColor:'white',marginTop:height*0.04}}>
                <View style={styles.container}>
                <TouchableHighlight onPress={() => this.props.navigation.goBack()} activeOpacity={0.86} underlayColor={'#FAFAFA'}style={{
                            position:'relative',backgroundColor:'transparent'
                        ,borderRadius:30,
                            paddingVertical:height*0.022,marginHorizontal:width*0.00001,
                            width:width*0.165, backgroundColor:"transparent",color:"blue"}}> 
                     <Icon
								name={'arrow-left'}
								type='feather'
								backgroundColor="transparent"
								color="black"
								size={Dimensions.get('window').width*0.065}
                                
							/>
    </TouchableHighlight>  
                    {this.state.company.avatar !== null && this.state.company.avatar !== ""?
                    <View style={{
                 
                        alignItems:'center',
                        
                    }}>
                    
                    {this.isSvg(this.state.company.avatar)?<SvgUri  resizeMode={'contain'} uri ={'https://fista.iscte-iul.pt/storage/'+this.state.company.avatar} width={width*0.6} height={height*0.35} />:  <Image
                        resizeMode={'contain'}
                        source={{uri:'https://fista.iscte-iul.pt/storage/'+ this.state.company.avatar}}
                        style={styles.imagem}
                    />} 
                  
                    </View>: <View></View>}
                    <View style={{
                        flex:1,
                        backgroundColor:this.cores2.filter( color => color.key === this.state.company.plano)[0].cor,
                        marginTop:height*0.03,
                    }}>
                        <Text style={styles.texto}>{ this.state.company.nome_empresa }</Text>
                    </View>

                    <View style={{alignItems:'center',flex:1}}>
                        <View style={{
                            flex:1,
                            marginTop: height*0.04,
                            backgroundColor: this.cores.filter( color => color.key === this.state.company.plano)[0].cor,
                            borderRadius:height*0.04,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 8,
                            },
                            shadowOpacity: 0.15,
                            shadowRadius: 10,
                            elevation:1,
                            paddingVertical:height*0.01,
                            width:width*0.49,
                        }}>
                            <Text style={styles.tipoEmpresa}>{ this.state.company.plano.toUpperCase() }</Text>
                        </View>
                    </View>

                    <Text style={styles.descricao}>{ this.state.company.pequena_descricao }</Text>
                </View>
            </ScrollView>
        );
    } else{ return null}
        
    
}

};

export default CompaniesDetails;


const styles = StyleSheet.create({
    container: {
        backgroundColor:'white',
        flex:1,
    },
    imagem: {
        width:width*0.6, 
        height:width*0.35,
        paddingBottom:height*0.1,
    },
    texto: {
        fontSize:width*0.08,
        fontFamily:'bold',
        paddingVertical:height*0.007,
        textAlign:'center',
    },
    tipoEmpresa: {
        fontSize:height*0.03,
        fontFamily:'bold',
        textAlign: 'center',
        color:'#fff',
        alignSelf:'center',
    },
    descricao: {
        lineHeight:30,
        paddingBottom:height*0.14,
        marginTop:width*0.07,
        marginHorizontal: width*0.04,
        fontSize: width*0.045,
        textAlign:'justify'
    },
})