import dotenv from 'dotenv' 
dotenv.config({path:'./.env'})
import { LeerInput, inquirerMenu, listarLugares, pausa } from "./helpers/inquirer.js";
import { Busquedas } from "./models/busquedas.js";
const main = async() => {
  let op;
  console.clear();

const busquedas = new Busquedas();

// const historialDB = busquedas.leerDB(); 

do {     
    // Esta funcion Imprime el menu
    op = await inquirerMenu();
    switch (op) {
        case 1:
            //Mostrar Mensaje
            const termino = await LeerInput('Ciudad: ');
            //Buscar los lugares
            const lugares = await busquedas.ciudad( termino );
            //Seleccionar el lugar
            
            const id = await listarLugares ( lugares );
            if (id === '0') continue;
            const lugarSel = lugares.find( l=> l.id === id );
            busquedas.agregarHistorial( lugarSel.nombre );
            //Datos del Clima
             const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
            //Mostrar resultados
            console.clear();
            console.log('\nInformacion de la ciudad\n'.green);
            console.log('Ciudad:', lugarSel.nombre)
            console.log('Lat:', lugarSel.lat)
            console.log('Lng:', lugarSel.lng)
            console.log('Temperatura:', clima.temp)
            console.log('Mínima:', clima.min)
            console.log('Máxima:', clima.max)
            console.log('¿Cómo está el clima?:', clima.desc.green)
        break;
    

        case 2: 
            busquedas.historialCapitalizado.forEach( (lugar, i)=>{
                const idx= `${i +1}`.green ;
                console.log( `${ idx } ${ lugar }`);
            } )
        break;
        default:
            break;
    }
    await pausa();
} while ( op !== 0);
}

main();