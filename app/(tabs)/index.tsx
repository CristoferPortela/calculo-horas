import {useEffect, useState} from "react";
import {FlatList, StyleSheet, Text} from 'react-native';
import {View} from '../../components/Themed';
import {AdicionarHora} from "../../components/AdicionarHora";
import DatabaseInit from "../../database/innit";
import DatabaseService from "../../services/crud";
import moment from "moment/moment";
import {Registro} from "../../models/Registros";
import {Hora} from "../../models/Horas";

type mesclado = Registro & Hora
type estado = {
    [key: string]: mesclado[]
}


export default function TabOneScreen() {
    const [listaHoras, setListaHoras] = useState<estado>({})
    useEffect(() => {
        new DatabaseInit()
    }, [])

    async function listar() {
        const existe: any = await DatabaseService.findByDayJoin(moment().format('D/MM/Y'));
        let ordenarPorDia: any = {}

        existe._array.forEach((item: mesclado) => {
            if (ordenarPorDia[item.dia]) {
                ordenarPorDia[item.dia].push(item)
            } else {
                ordenarPorDia[item.dia] = [item]
            }
        })
        console.log(ordenarPorDia)
        setListaHoras(ordenarPorDia)
    }

    useEffect(() => {
        listar()
    }, [])

    return (
        <View style={styles.container}>
            <AdicionarHora/>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.5)"/>
            <View style={{flex: 3, width: '80%'}}>
                <FlatList
                    data={Object.keys(listaHoras)}
                    renderItem={({item, index}) => {
                        return (
                            <View style={{marginBottom: 10, backgroundColor: '#aaa', width: '100%', borderRadius: 5}}>
                                <Text style={{color: '#fff'}}>{item}</Text>
                                {
                                    listaHoras[item].map((hora) => {
                                        return (
                                            <Text style={{color: '#fff'}}>{hora.hora}</Text>
                                        )
                                    })
                                }
                            </View>
                        )
                    }}
                />

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
