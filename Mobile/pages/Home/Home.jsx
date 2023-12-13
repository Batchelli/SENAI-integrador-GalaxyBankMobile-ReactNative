import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, ImageBackground, Image } from 'react-native';
import style from './App.module.css';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const bg = require('../../assets/Bg/BgBg.png');

export default function Home({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [saldo, setSaldo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [cpf, setCpf] = useState([]);

  function Pix() {
    navigation.navigate('Pix')
  }
  function Code() {
    navigation.navigate('CodeBar')
  }
  function Card() {
    navigation.navigate('Cards')
  }
  function Loan() {
    navigation.navigate('Loan')
  }


  useEffect(() => {
    // Função para obter dados do usuário
    const fetchDados = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('access_token');
        if (!accessToken) {
          console.error('Access token not found in AsyncStorage');
          return;
        }

        const response = await axios.get('http://10.0.2.2:8000/api/user', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data) {
          setUserData(response.data);
          setSaldo(response.data.saldo);
          setCpf(response.data.cpf)
          await AsyncStorage.setItem('cpf', String(cpf));
        } else {
          console.error('Resposta da API não contém propriedade "data":', response);
        }
      } catch (error) {
        console.error('Erro ao obter informações do usuário:', error.response?.data || error.message);
      }
    };



    // Função para obter o histórico de transações
    const fetchTransactions = async () => {

      try {
        
        const response = await axios.get(`http://10.0.2.2:8000/api/transactions/${cpf}/`);
        setTransactions(response.data);
      } catch (error) {
        console.error('Erro ao obter o histórico de transações:', error);
      }
    };

    // Chame as funções no carregamento do componente
    fetchDados();
    fetchTransactions();
    console.log("CPF" + cpf)

    // Defina os intervalos para atualização periódica (a cada 5000ms)
    const fetchDadosTimer = setInterval(fetchDados, 5000);
    const fetchTransactionsTimer = setInterval(fetchTransactions, 5000);

    // Limpe os intervalos quando o componente for desmontado
    return () => {
      clearInterval(fetchDadosTimer);
      clearInterval(fetchTransactionsTimer);
    };
  }, [cpf]);

  return (
    <View>
      <ImageBackground source={bg} resizeMode="cover" style={style.container}>
        <View style={style.bg}>
          {userData && (
            <>
              {userData.profile_picture && (
                <Image source={{ uri: userData.profile_picture }} style={style.pic} />
              )}
              <Text style={style.name}>{userData.first_name + " " + userData.last_name}</Text>
            </>
          )}
        </View>
        <View style={style.containerElipse}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            <TouchableOpacity style={style.elipse}
              onPress={Pix}>
              <Image source={require('../../assets/Icons/pix.png')} style={style.icon}></Image>
            </TouchableOpacity>
            <TouchableOpacity style={style.elipse}
              onPress={Code}>
              <Image source={require('../../assets/Icons/barcode.png')} style={style.icon}></Image>
            </TouchableOpacity>
            <TouchableOpacity style={style.elipse}
              onPress={Card}>
              <Image source={require('../../assets/Icons/cards.png')} style={style.icon}></Image>
            </TouchableOpacity>
            <TouchableOpacity style={style.elipse}
              onPress={Pix}>
              <Image source={require('../../assets/Icons/pig.png')} style={style.icon}></Image>
            </TouchableOpacity>
            <TouchableOpacity style={style.elipse}
              onPress={Loan}>
              <Image source={require('../../assets/Icons/coin.png')} style={style.icon}></Image>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <View style={style.bg2}>
          <Text style={style.saldoN}>Saldo:</Text>
          <Text style={style.saldo}>R$: {saldo !== null ? saldo : 'Carregando...'}</Text>
        </View>
        <View style={style.bg3}>
          <Text style={style.extratoN}>Extrato</Text>
          <ScrollView>
            {transactions.map((transaction) => (
              <Text key={transaction.id} style={style.extrato}>
                {`Transferência de ${transaction.sender_name} para ${transaction.receiver_name} | Valor R$: ${transaction.amount}`}
              </Text>
            ))}
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}
