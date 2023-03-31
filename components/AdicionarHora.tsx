import {useState} from "react";
import {Text, View} from "./Themed";
import {Button, StyleSheet, TextInput, TouchableOpacity} from "react-native";
import moment from 'moment'
import {Registro} from "../models/Registros";
import {Hora} from "../models/Horas";
import DatabaseService from "../services/crud";

export const AdicionarHora = () => {
    const [dia, setDia] = useState<string>(moment().format('D/MM/Y'))
    const [hora, setHora] = useState<string>(moment().format('H:mm'))
    const [entrada, setEntrada] = useState<boolean>(true)

    async function adicionar() {
        let registro = new Registro()
        let horas = new Hora()

        registro.dia = dia
        registro.ativo = 1

        horas.hora = hora
        horas.entrada = entrada ? 1 : 0

        const existe: any = await DatabaseService.findByDay(moment().format('D/MM/Y'));
        if (existe.length) {
            horas.registroId = existe._array[0].id
            DatabaseService.addData(horas)
        } else {
            const regId = await DatabaseService.addData(registro)
            horas.registroId = regId as number
            DatabaseService.addData(horas)
        }
    }

    return (
        <View style={{flex: 2, width: '80%'}}>
            <Text style={styles.title}>
                Ponto
            </Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.horaManual}
                    placeholder={'Dia'}
                    placeholderTextColor={'#fff'}
                    onChangeText={setDia}
                    value={dia}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.horaManual}
                    placeholder={'Hora manual'}
                    placeholderTextColor={'#fff'}
                    value={hora}
                    onChangeText={setHora}
                />
            </View>
            <TouchableOpacity onPress={() => setEntrada(true)}>
                <View style={styles.sideBySide}>
                    <View style={[styles.radio, entrada ? styles.active : null]}></View><Text>Entrada</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEntrada(false)}>
                <View style={styles.sideBySide}>
                    <View style={[styles.radio, !entrada ? styles.active : null]}></View><Text>Saída</Text>
                </View>
            </TouchableOpacity>

            <Button title={"Adicionar"} onPress={adicionar}/>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    inputContainer: {
        width: '100%',
        paddingVertical: 10
    },
    horaManual: {
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
        width: '100%',
        color: '#fff'
    },
    radio: {
        width: 15,
        height: 15,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 7
    },
    sideBySide: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
        marginVertical: 8
    },
    active: {
        backgroundColor: '#fff'
    }
});
