import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, ImageBackground, TextInput, ToastAndroid } from 'react-native';
import style from './Style.module.css';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const bg = require('../../assets/Bg/BgBg.png');

export default function Transfer({ navigation }) {
    const [Income, setIncome] = useState('');
    const [Loan_amount, setAmount] = useState('');
    const [num_installments, setNum_installments] = useState('');
    const [transferData, setTransferData] = useState({
        sender_cpf: '',
    });


    const cpf = 0

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
        console.log(transferData.sender_cpf)
        console.log(Loan_amount)
        console.log(Income)
        console.log(num_installments)
        try {
            const accessToken = await AsyncStorage.getItem('access_token');

            const response = await axios.post(
                `http://10.0.2.2:8000/api/loanRequest/${transferData.sender_cpf}/`,
                {

                    loan_amount: Loan_amount,
                    income: Income,
                    num_installments: num_installments,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            console.log('Resposta do empréstimo:', response.data);

            ToastAndroid.show('Empréstimo realizada com sucesso', ToastAndroid.SHORT);
            navigation.navigate('Home');
        } catch (error) {
            console.error('Erro no empréstimo:', error.response?.data.detail);

            ToastAndroid.show('Falha no empréstimo', ToastAndroid.SHORT);
        }
    };

    return (
        <View>
            <ImageBackground source={bg} resizeMode="cover" style={style.container}>
                <View style={style.bg}>
                    <View>
                        <Text style={style.title}>Empréstimo</Text>
                    </View>
                    <View style={style.inps}>
                        <TextInput
                            placeholder="valor solicitado:"
                            placeholderTextColor="gray"
                            style={style.caixa}
                            keyboardType='numeric'
                            onChangeText={setAmount}
                            value={Loan_amount}
                        />
                        <TextInput
                            placeholder="Renda mensal:"
                            placeholderTextColor="gray"
                            style={style.caixa}
                            keyboardType='numeric'
                            onChangeText={setIncome}
                            value={Income}
                        />
                        <TextInput
                            placeholder="Número de parcelas:"
                            placeholderTextColor="gray"
                            style={style.caixa}
                            keyboardType='numeric'
                            onChangeText={setNum_installments}
                            value={num_installments}
                        />
                    </View>
                    <View style={style.btns}>
                        <TouchableOpacity style={style.btn} onPress={handleTransfer}>
                            <Text style={style.text}>solicitar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}
