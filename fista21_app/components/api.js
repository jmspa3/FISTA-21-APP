import AsyncStorage from '@react-native-async-storage/async-storage';


export default class API {

    static async doRequest(method, endpoint, parameters) {
        const url = "https://fista.iscte-iul.pt/api/" + endpoint
        const session_token = await AsyncStorage.getItem('session_token')
        var headers = new Headers()
        headers.append('User-Agent', 'FISTA_APP_IOS')
        if (session_token) {
            headers.append('Authorization', session_token)
        }
        if (method == 'POST') {
            if(endpoint == "login" || endpoint == "gametoken" || endpoint == "gamepontos" ||endpoint=="curso" || endpoint=="ano" || endpoint=="token" || endpoint=="workshopinscrever" || endpoint=="jaInscrito"|| endpoint=="workshopdesinscrever"){
                headers.append('Accept', 'application/json')
                headers.append('Content-Type', 'application/json')
                return fetch('https://fista.iscte-iul.pt/api/' + endpoint, {
                method: method,
                headers:headers,
                body: parameters,
                })
            }else{
            headers.append('Accept', 'application/json')
            headers.append('Content-Type', 'application/x-www-form-urlencoded')
            return fetch(url, { method: method, headers: headers, body: parameters })
                .then(response => response.text())
                .then(text => {
                 
                    return JSON.parse(text.trim());
                })
                .catch(error => console.warn(error))
            }
        }
        
        return fetch(parameters != '' ? url + '?' + parameters : url, { method: method, headers: headers })
            .then(response => response.text())
            .then(text => {
                
                return JSON.parse(text.trim());
            })
            .catch(error => console.warn(error))
    }
}