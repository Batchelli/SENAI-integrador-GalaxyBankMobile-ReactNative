import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, ImageBackground, TextInput, ToastAndroid } from 'react-native';
import style from './Style.module.css';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const bg = require('../../assets/Bg/BgBg.png');

export default function Transfer({ navigation }) {
    const [receiverCpf, setReceiverCpf] = useState('');
    const [amount, setAmount] = useState('');
    const [transferData, setTransferData] = useState({
        sender_cpf: '',
        receiver_cpf: '',
        amount: '',
    });

    useEffect(() => {
        // Obter o CPF do usuário logado ao inicializar o componente
        const getLoggedUserCpf = async () => {
            try {
                const cpf = await AsyncStorage.getItem('cpf');
                setTransferData((prevData) => ({ ...prevData, sender_cpf: String(cpf) })); // Converta para string ao atribuir
            } catch (error) {
                console.error('Erro ao obter CPF do usuário:', error);
            }
        };
    
        getLoggedUserCpf();
    }, []);

    const handleTransfer = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('access_token');

            const response = await axios.post(
                'http://10.0.2.2:8000/api/transfer/',
                {
                    ...transferData,
                    receiver_cpf: receiverCpf,
                    amount: amount,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            console.log('Resposta da transferência:', response.data);

            ToastAndroid.show('Transferência realizada com sucesso', ToastAndroid.SHORT);
            navigation.navigate('Home');
        } catch (error) {
            console.error('Erro na transferência:', error.response?.data.detail);

            ToastAndroid.show('Falha na transferência', ToastAndroid.SHORT);
        }
    };

    return (
        <View>
            <ImageBackground source={bg} resizeMode="cover" style={style.container}>
                <View style={style.bg}>
                    <View>
                        <Text style={style.title}>Transferência</Text>
                    </View>
                    <View style={style.inps}>
                        <TextInput
                            placeholder="CPF do Destinatário:"
                            placeholderTextColor="gray"
                            style={style.caixa}
                            keyboardType='numeric'
                            onChangeText={setReceiverCpf}
                            value={receiverCpf}
                        />
                        <TextInput
                            placeholder="Valor:"
                            placeholderTextColor="gray"
                            style={style.caixa}
                            keyboardType='numeric'
                            onChangeText={setAmount}
                            value={amount}
                        />
                    </View>
                    <View style={style.btns}>
                        <TouchableOpacity style={style.btn} onPress={handleTransfer}>
                            <Text style={style.text}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}
