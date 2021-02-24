import React, {Component} from 'react';
import {StyleSheet, Text, SafeAreaView,TouchableHighlight,View,Image, Dimensions, ScrollView} from 'react-native';
import { Card } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import * as Font from 'expo-font';

const width =  Dimensions.get('window').width;
const height = Dimensions.get('window').height;

 class KeynotesDetails extends Component {
     state={
         token: '',
         modalVisible: true,
         fontsLoaded:false,
        keynote:this.props.route.params.data,
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
    
     setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
      }
      async componentDidMount(){
        this.loadFonts();
      }
      handleToken = (text) => {
        this.setState({ token: text })
      }

    render(){
        if(this.state.fontsLoaded){

        
        return (
            <SafeAreaView style={{flex:1,height:height*1.4,marginTop:height*0.04}}>
            <ScrollView style={{flex:1,height:height*1.4}}>
            <View style={styles.container}>
                  
                    
    <TouchableHighlight onPress={() => this.props.navigation.goBack()} activeOpacity={0.86} underlayColor={'#FAFAFA'}style={{position:'relative',backgroundColor:'transparent',borderRadius:30,paddingVertical:height*0.022,marginHorizontal:width*0.00001,width:width*0.165, backgroundColor:"transparent",color:"blue"}}> 
                     <Icon
								name={'arrow-left'}
								type='feather'
								backgroundColor="transparent"
								color="black"
								size={width*0.065}
                                
							/>
    </TouchableHighlight>      

   <Card style={{ 
       backgroundColor: 'transparent',
       alignSelf:'center',
       marginBottom:height * 0.23,width: Math.round((width + 80) * 0.65),
       height:height *0.10,marginTop:0,}}>
      
      <Card.Cover resizeMode={`contain`} style={{alignSelf:'center',position:'absolute',borderRadius:10,height: height *0.3,width:Math.round((width + 85) )}} source={this.state.keynote.avatar_empresa !== "" && this.state.keynote.avatar_empresa !== null ? {uri:this.state.keynote.avatar_empresa}: require('../assets/keynotes.png')}   />
   </Card>
             
{this.state.keynote.dia !== null?
   <Text style={{fontSize: width*0.050,
		marginTop:height*0.03,marginBottom:height*0.001,marginRight:width*0.2,
		fontFamily: 'semibold',color:'grey',textAlign:'left',marginLeft:width*0.066}}>{this.state.keynote.dia}</Text> : <View></View>}

                <Text style={{fontSize: width*0.070,
		marginTop:height*0.01,marginRight:width*0.2,
		fontFamily: 'semibold',textAlign:'left',marginLeft:width*0.07}}>{ this.state.keynote.titulo }</Text>
             

             <Text style={{fontSize: width*0.060,
		marginTop:height*0.005,marginRight:width*0.2,
		fontFamily: 'semibold',textAlign:'left',marginLeft:width*0.066}}>{ this.state.keynote.nome_orador }</Text>
    <Text style={{fontSize: width*0.040,
		marginTop:height*0.008,marginRight:width*0.2,
		fontFamily: 'semibold',color:'#333333',textAlign:'left',marginLeft:width*0.066}}>{ this.state.keynote.cargo }</Text>
             <Text style={{
        
        marginTop: height*0.06,
        marginHorizontal: width*0.05,
        fontSize: width*0.045,
        textAlign:'justify',lineHeight:height*0.033,
      
        color:'#444444',
        fontFamily: 'regular',}}>{this.state.keynote.descricao}</Text> 
        
        <View style={{elevation:10,shadowColor: "#000",shadowOffset: {width: 0,height: 15,},shadowOpacity: 0.25,shadowRadius: 10,marginVertical:10,backgroundColor:'whitesmoke',borderColor:'grey',paddingBottom:100}}>
        <View style={{flexDirection:"row", alignContent:'center',flex:1 ,marginTop:height*0.05,paddingBottom:30}}> 
               
                <Image
                style={{borderColor:'#333333',borderWidth: 2.5,marginTop:- height*0.00,marginLeft: width*0.06,width:  width*0.33, height:  width*0.33, borderRadius: 400/ 2}}
                source={this.state.keynote.avatar_orador !== "" ? {uri:this.state.keynote.avatar_orador}: require('../assets/keynotes.png')} 
                />
                 <Text style={{alignContent:'center',alignSelf:'center',alignItems:'center',width:width*0.5,marginLeft: width*0.06,fontFamily:'regular',fontSize: width*0.07}} >{this.state.keynote.nome_orador}</Text>
               
        </View>

        <Text style={{
        marginHorizontal:  width*0.05,
        fontSize:  width*0.045,
        textAlign:'justify',lineHeight: height*0.033,
        color:'#444444',
        fontFamily: 'regular',}}>{this.state.keynote.bio}</Text> 
        </View>
        
                
                
                </View>
                
                
             

             
              
        
       
            
            </ScrollView>
            </SafeAreaView>
        )
    }else{ return null}}
};

export default KeynotesDetails;





const styles = StyleSheet.create({
    container: {
       
        backgroundColor:'white',
        fontFamily: 'regular',
    },

    buttonContainer:{
        
        borderRadius: 50,
        alignItems:"center", 
        marginTop:  height *0.05, 
        color: "black",
      },
    vagasText:{
        height:  height *0.05,
        fontSize: width*0.05,
        fontWeight: 'bold',
        textAlign:'center',
    },
})

