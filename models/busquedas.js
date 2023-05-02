import fs from 'fs';
import axios from "axios";

class Busquedas {
    historial= [];
    dbPath = './db/database.json';
    constructor( ){
        //TODO: Leer DB si existe
        this.leerDB();

    }

    get historialCapitalizado(){
        return this.historial.map ( lugar=> {
            let palabras = lugar.split( ' ' );
            palabras = palabras.map( p=> p[0].toUpperCase()+ p.substring(1) );
            return palabras.join(' ')
        })
    }

    get paramsMapBox() {
        return {
            'limit':5,
            'languaje': 'es',
            'access_token': process.env.MAPBOX_KEY
        }
    }

    async ciudad( lugar= '' ){
        //Peticion HTTP
        try {
            const instance = axios.create( {
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapBox
            });
            const resp = await instance.get();
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
        } catch (error) {
            
        }
        return []; //retornar los lugares que coincidan 
    }

    get paramsOpenWeather() {
        return {
            'units':'metric',
            'lang': 'es',
            'appid': process.env.OPENWEATHER_KEY
        }
    }
    async climaLugar ( lat, lon ) {

        try {
            //isntance axios.create()
            const instance = axios.create( {
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ... this.paramsOpenWeather, lat, lon }
            })
            //resp.data
            const resp = await instance.get();
            return {
                desc: resp.data.weather[0].description ?? 'Sin descripcion',
                temp: resp.data.main.temp,
                min: resp.data.main.temp_min,
                max: resp.data.main.temp_max
            };
        } catch (error) {
            console.log( error )
        }
    }

    agregarHistorial ( lugar = '' ){

        // TODO: prevenir duplicados
        if (this.historial.includes( lugar.toLocaleLowerCase() ) ){
            return;
        }
        this.historial = this.historial.splice(0,4);
        this.historial.unshift( lugar.toLocaleLowerCase() );

        //grabarDB
        this.guardarDB();
    }
    
    guardarDB() {
        const payLoad={
            historial: this.Historial
        };
        fs.writeFileSync( this.dbPath, JSON.stringify(payLoad));
    }
    guardarDB() {
        const payLoad = {
            historial: this.historial
        };
        fs.writeFileSync(this.dbPath, JSON.stringify(payLoad));
    }
    
    leerDB(){
        if ( !fs.existsSync(this.dbPath) ){
            return 'No hay archivo para mostrar';
        }
        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8'} );
        const data = JSON.parse( info );
        this.historial = data.historial
        console.log(data);
        return data;
    }
}

export {Busquedas};