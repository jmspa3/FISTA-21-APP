import { Alert, Image,KeyboardAvoidingView,TouchableHighlight, ActivityIndicator,View, Text, TextInput, SafeAreaView, ScrollView, Dimensions ,StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../components/api.js';
import * as Linking from 'expo-linking';
import React, {Component} from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {Icon } from 'react-native-elements';
import * as Font from 'expo-font';
import { StatusBar } from 'expo-status-bar';

//import '../shim'



const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class LoginScreen extends Component {
	state = {
		loading: false,
		email: '',
		password: '',
		isLoading: true,
		secure: true,
		fontsLoaded:false,
	}

	static navigationOptions = { header: null }

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
	
	  }
	

	
	 async componentDidMount() {
		await this.loadFonts();
		this.setState({ fontsLoaded: true });
		const state = await AsyncStorage.getItem('state')
		if (state === "logged_in") {
				this.props.navigation.navigate('HomeTab')
		}
		this.setState({ isLoading: false })
	}
	

	register() {
		Linking.openURL('https://fista.iscte-iul.pt/#myModal')
	}

	lost_password() {
		Linking.openURL('https://fista.iscte-iul.pt/password/reset')
	}

	async doLogin() {
		this.setState({ loading: true })
		if (this.state.email != '' && this.state.password != '') {
			try {
				const body = JSON.stringify({
                    email: this.state.email,
                    password:this.state.password,
                });
				API.doRequest("POST", "login", body )
				.then(response => response.json())
					.then(async data => {
						if(data.user.id_ano === null){
							var ano = '0';
						} else {
							var ano = data.user.id_ano;
						}
						if(data.user.id_curso === null){
							var curso = '0';
						} else{
							var curso = data.user.id_curso;
						}


						if (data.message == "login successful") {
				
							await AsyncStorage.multiSet([
								['mail',this.state.email],
								['password',this.state.password],
								['first_name', data.user.first_name],
								['last_name', data.user.last_name],
								['user_token', data.user.uuid],
								['ano', ano],
								['curso', curso],
								['avatar',data.user.avatar],
								['pontos',data.user.pontos.toString()],
								['workshops',JSON.stringify(data.workshops)],
								['state', 'logged_in']
							])
							 this.passwordInput.clear()
							 this.emailInput.clear()
							 this.setState({ loading: false })
							 this.props.navigation.navigate('HomeTab')
					
						} else{
							if (data.message == "wrong login") {
								Alert.alert(
									'Ops!',
									'Dados inválidos!',
									[
										{ text: 'OK' }
									],
									{ cancelable: false },
								);
								this.setState({ loading: false })
								return;
							}
						}
						
					})
					.catch(() => { Alert.alert("Não foi possivel iniciar sessão", "Verifique os dados introduzidos novamente", [{ text: 'OK' ,  onPress: () => this.setState({loading:false})}])})
			} catch {
			  Alert.alert("Erro na ligação", "Não é possivel iniciar sessão", [{ text: 'OK' ,  onPress: () => this.setState({loading:false})}])}

		} else {
			Alert.alert(
				'Ops!',
				'Nenhum dado foi inserido!',
				[
					{ text: 'OK' }
				],
				{ cancelable: false },
			);
			this.setState({ loading: false })
		}
	}
	

	render() {
		if (this.state.isLoading) {
			return (
				<View style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 0,
					bottom: 0,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: '#fff'
				}}>
					<ActivityIndicator size={"large"} />
				</View>
			);
		} else 
			return (
				
				<LinearGradient
				colors={['#97CA53', '#5C9D2E']}
				useAngle={true}
				style={{height:height}}
				angle={340}
				angleCenter={{ x: 0.5, y: 0.5 }}>
						   <StatusBar style="light" />
					<SafeAreaView style={{ height: height,}}>
					
						<ScrollView style={styles.sideMargins}>
						<KeyboardAvoidingView  behavior={'position'} style={{flex:1}} >
							<Image resizeMode={'cover'} source={require('../assets/logofista21.png')} style={{marginTop:height*0.08,alignSelf:'center',width:width*0.4,height:width*0.4}}></Image>
							<View
								style={{
									marginBottom: size * 0.05,
								
									flexDirection: 'row',
									justifyContent: 'space-between',
								}}>
								<Text
									style={[{ 	fontSize: width * 0.116,
										marginTop:height*0.03,
										fontFamily: 'semibold',color: 'rgba(249, 249, 249, 1)' }]}>
									Entrar
                        </Text>
								<Text
									style={[{fontSize: width * 0.116,
										marginTop:height*0.03,
										fontFamily: 'semibold',color: 'rgba(249, 249, 249, 0.5)' }]}
									onPress={() => this.register()}>
									Registar
                        </Text>
							</View>
					
							<View
								style={[styles.button, {
									backgroundColor: 'rgba(249, 249, 249, 0.25)',
									justifyContent: 'center',
									
								},]}>
						
								<TextInput
									ref={ref => this.emailInput = ref}
									style={styles.buttonText}
									autoCapitalize="none"
									onSubmitEditing={() => this.passwordInput.focus()}
									autoCorrect={false}
									keyboardType='email-address'
									returnKeyType="next"
									placeholder='Endereço de email'
									placeholderTextColor='#f9f9f9'
									onChangeText={email => this.setState({ email: email })}
								/>
							</View>
						
							
							<View
								style={[styles.button, {
									backgroundColor: 'rgba(249, 249, 249, 0.25)',
									alignContent:'space-between',
									flexDirection: 'row',
								}]}>
					
								<View style={styles.button,{flex:0.9,width:10}}>
								
								<TextInput
									ref={ref => this.passwordInput = ref}
									style={[styles.buttonText,{marginVertical:height*0.019}]}
									returnKeyType="go"
									placeholder='Palavra-passe'
									placeholderTextColor='#f9f9f9'
									secureTextEntry={this.state.secure}
									onChangeText={password => { this.setState({ password: password }) }}
								
								/>
								
								</View>
							
								<TouchableHighlight activeOpacity={0.5} underlayColor={'transparent'} onPress={()=> this.setState({ secure: !this.state.secure })} style={{marginVertical:height*0.003,justifyContent:'center',width:width*0.13,height:width*0.13}}>
								<Icon
								name={this.state.secure? 'eye-off': 'eye'}
								type='feather'
								backgroundColor="transparent"
								color="white"
								size={width*0.059}
								
							/>
								
							</TouchableHighlight>
					
							</View>
							
							

							<TouchableHighlight onPress = {() => this.doLogin()} activeOpacity={0.86} underlayColor={'transparent'} disabled={this.props.disabled} >
							<View style={[styles.buttonNext, { justifyContent: 'center' }]}>
								<Text style = {[styles.buttonText, { color: '#5C9D2E' }, Platform.OS == 'ios' ? { paddingTop: width * 0.019 } : null]}>Continuar</Text>
							</View>
							</TouchableHighlight>


						
							
							<Text
								style={{
									alignSelf: "center",
									fontSize: size * 41.4 / 1125,
									marginBottom: size * 0.16 / 9,
									color: '#f9f9f9',
									fontFamily:'regular',
									textDecorationLine: 'underline'
								}}
								onPress={() => this.lost_password()}>
								Recuperar palavra-passe
                    </Text>

				
					</KeyboardAvoidingView>	
						
						</ScrollView>
						{this.state.loading &&
							<View style={{
								position: 'absolute',
								left: 0,
								right: 0,
								top: 0,
								bottom: 0,
								opacity: 0.5,
								backgroundColor: '#4fad32',
								justifyContent: 'center',
								alignItems: 'center'
							}}>
								<ActivityIndicator size={"large"} color={'#4fad32'} />
							</View>
						}
					</SafeAreaView>
				</LinearGradient>
			)
	}
}

const size = width

const active = 'rgba(249, 249, 249, 1)'
const disable = 'rgba(249, 249, 249, 1)'

const styles = StyleSheet.create({
	sideMargins: {
		marginLeft: size * 0.08,
		marginRight: size * 0.08,
		height: height,
		
	},
	buttonText: {
		marginHorizontal: size * 0.09,
		fontSize: size * 0.055,
		color: active,
		fontFamily: 'regular',
		
		
	},
	buttonNext: {
		borderRadius: size * 0.11 / 3,
		marginBottom: size * 0.16 / 3,
		height: size * 0.144,
		backgroundColor: active, 
		elevation:1,
		shadowColor: "#000",shadowOffset: {width: 0,height:  4,},shadowOpacity: 0.1,shadowRadius: 3,
		borderColor:'transparent',
		
	},
	button: {
		borderRadius: size * 0.11 / 3,
		marginBottom: size * 0.16 / 3,
		height: size * 0.144,
		backgroundColor: active,
		
	},
	
	logo: {
		alignSelf: "center",
		marginTop: size * 0.08,
		marginBottom: size * 0.08
	},
	linkedin: {
		marginLeft: size * 0.015,
	},
	break: {
		marginTop: size * 0.03,
		width: size * 0.32,
		height: size * 0.032 / 9,
		backgroundColor: active
	}
});
