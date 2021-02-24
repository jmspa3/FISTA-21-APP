import React, {Component} from 'react';
import {TouchableOpacity,Alert,ActivityIndicator,TouchableHighlight,StyleSheet, Text, View, FlatList, Image, Dimensions} from 'react-native';
import API from '../components/api';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { SvgUri } from 'react-native-svg';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

 class Companies extends Component {
    state = {
        token: '',
        modalVisible: true,
        changeScreen:'All',
        companies:[],
        fontsLoaded:false,
        loading:false,
        dia_24:[],
        dia_25:[],
  
       
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
    

    async componentDidMount() {
       
        this.setState({ fontsLoaded: true });
        try {
            await API.doRequest('GET', 'empresas', "registered=true").then(data =>
                 this.setState({ 

                     companies:data.filter(e => e.mostrar === 0 && e.plano !== ''),
                     
                }))
        } catch {
            Alert.alert("Sem ligação à internet", "Verifica se estás bem conectado ", [{ text: 'OK' }])
        }
        this.setState({
            dia_24:this.state.companies.filter(e => e.dia24 === "24"  ),
            dia_25:this.state.companies.filter(e => e.dia25 === "25" ),
            loading:true,
        })
      }
    
      setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
      }
    
    cores =[
        {cor:'#96c45b', key:"premium"},
        {cor:'#ffcc66', key:"gold"},
        {cor:'#999999', key:"silver"},
    ]

    styleNav = [
        {key:'all', buttons : [styles.press, styles.unpress, styles.unpress ], },
        {key:'day1', buttons : [styles.unpress, styles.press, styles.unpress ],},
        {key:'day2', buttons : [styles.unpress, styles.unpress, styles.press ],},
    ]

    getStyle = (item) => {
        switch(this.state.changeScreen){
            case 'All': 
               return this.styleNav.filter( a => a.key === 'all')[0].buttons[item];
            case 'Day1':
               return this.styleNav.filter( a => a.key === 'day1')[0].buttons[item];
            case 'Day2' :
               return this.styleNav.filter( a => a.key === 'day2')[0].buttons[item];
        }
    }
    
    getView = () => {
       
        switch(this.state.changeScreen){
            case 'All': 
            return this.state.companies;
            case 'Day1':
                return this.state.dia_24;
            case 'Day2' :
                return this.state.dia_25;
        }
    
    }

    isSvg(str){

    var pos = str.indexOf("svg");
    if(pos > -1){
     
        return true;
    }else{return false;}

    }

 
     
    
    _renderItem = ({item}) => {
        if(item.plano !== ""){
            
      
        let imagem;
        if(item.avatar != null){
            if(this.isSvg(item.avatar)){
            imagem = <SvgUri  resizeMode={'contain'} uri ={'https://fista.iscte-iul.pt/storage/'+item.avatar} width={width*0.28} height={height*0.152} />;
            }else{
            imagem = <Image
                resizeMode={'contain'}
                source={{uri:'https://fista.iscte-iul.pt/storage/'+item.avatar}}
                style={styles.imagem}
            />;
        }
        }else{
           imagem = <Image
                source={require('../assets/default.png')}
                style={styles.imagem}
            />;
        }
       
        return (
            <TouchableHighlight style={{height:Dimensions.get('window').height*0.35}}underlayColor={'transparent'} onPress={() => this.props.navigation.navigate('CompaniesDetails', { data: item })}>
            <View style={styles.empresa}>
                <View style={styles.imagemEmpresa}>
                    {/*IMAGEM DA EMPRESA*/}
                    {imagem}  
                </View>
                <View style={{
                    paddingHorizontal: 5,
                    paddingVertical:8,
                    alignItems: 'center',
                    backgroundColor:this.cores.filter( color => color.key === item.plano)[0].cor,
                    borderRadius:10,
                    marginHorizontal:8,
                    marginTop:7,
                    marginBottom:18,
                }}>
                    <Text style={styles.texto}>{ item.plano.toUpperCase()}</Text>
                    </View>
            </View>
            </TouchableHighlight>
        );
      }
    }

     
               

    render() {
        
        if(this.state.fontsLoaded ){
        const footer = ( <View style={{height:height*0.13,backgroundColor:'white'}}></View>);
        const View3 = ( 
            <View>
            <View style={styles.container,{  backgroundColor: "white",paddingTop:height*0.05}}>
           <View style={{backgroundColor:'white'}}>
       
               <Text style={styles.titulo} >Empresas</Text>
                
                         <View style={{justifyContent:'center',marginHorizontal:width*0.12,paddingBottom:height*0.04,paddingTop:height*0.01,flexDirection:'row',alignContent:'space-around',backgroundColor:'white'}}>
                        
                         <TouchableOpacity
                             style={{backgroundColor:'white',margin:0}}
                             onPress={() => this.setState({ changeScreen: 'All' }) }
                          >
                             <Text style={this.getStyle(0)}>Todas</Text>
                         </TouchableOpacity>
                         <TouchableOpacity
                             style={{backgroundColor:'white',margin:0}}
                             onPress={() => this.setState({ changeScreen: 'Day1' }) }
                          >
                             <Text style={this.getStyle(1)}>Dia 24</Text>
                         </TouchableOpacity>
                         <TouchableOpacity
                             style={{backgroundColor:'white',margin:0}}
                             onPress={() => this.setState({ changeScreen: 'Day2' }) }
                          >
                             <Text style={this.getStyle(2)}>Dia 25</Text>
                         </TouchableOpacity>
                     </View>
                     </View>
                     
             </View>

             {!this.state.loading?
               <View style={{height:height*1,backgroundColor:'white'}}>
               <StatusBar style="dark" />
               <ActivityIndicator style={{height:height*0.4,alignSelf:'center',justifyContent:'center',alignContent:'center'}}size="large" color="#96c45b" />
              </View>
             
             :<View></View>}
             </View>
            
             ) ;
    
        return (
                <View style={{height:height*1,backgroundColor:'white'}}>
                <StatusBar style="dark" />
                {this.state.companies !== [] && this.state.companies !== undefined? 
                <FlatList 
                    style={{ marginTop:height*0.033,flexGrow: 0,paddingBottom:height*0.01,backgroundColor:'white'}}
                    data={this.getView()}
                    renderItem={this._renderItem}
                    numColumns={3}
                    ListHeaderComponent={View3}
                    ListFooterComponent={footer}
                    keyExtractor={item => item.nome_empresa + Math.random().toString()}
                    onEndReachedThreshold={1200}
              
                />: 
                
                <View style={{flex:1,paddingBottom:height*0.5,paddingTop:height*0.2}}><Text style={{ fontSize:width*0.05,fontWeight:'900',marginHorizontal:width*0.053,color:'grey',justifyContent:'center',textAlign:'center'}}>Falha na Ligação ao Servidor</Text></View>}
               </View>
 
           
     
        )
    }   else{return  <View></View>}}
};

export default Companies;

const styles = StyleSheet.create({
    container: {
        paddingTop:30,
        height:height,
        paddingBottom:20,
        backgroundColor:'white',
    
    },

    empresa: {
        borderRadius:20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 15,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
        marginLeft:(Dimensions.get('window').width-3*Dimensions.get('window').width*0.28-10*3)/4,
        marginTop:30,
        marginBottom:4,
        backgroundColor:'#fff',
    },
    imagem: {
        width: width*0.28, 
        height: height*0.15,
        borderRadius:15,
        
       
    },
    imagemEmpresa: {
        padding:5,
    },
    texto: {
        color:'#fff',
    },
    titulo: {
        color:'#96c45b',
        textAlign:'center',
        marginTop:20,
        marginBottom:5,
        fontSize:width*0.12,
        fontFamily: 'semibold',

    },
    press: {
        fontSize:width*0.068,	fontFamily: 'regular',marginHorizontal:width*0.053,color:'#96c45b',
    },
    unpress: {
        fontSize:width*0.063,	fontFamily: 'regular',marginHorizontal:width*0.053,marginTop:4,opacity:0.8,color:'#96c45b',
    }
})