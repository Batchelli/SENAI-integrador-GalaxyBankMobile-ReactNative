import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, TextInput, Image, ImageBackground } from 'react-native';
import style from './Style.module.css';
import axios from 'axios';
import { ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const bg = require('../../assets/Bg/BgBg.png');

const MAX_LOGIN_ATTEMPTS = 3;
const LOCKOUT_DURATION = 10 * 1000; // 10 seconds in milliseconds

export default function Login({ navigation }) {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lastFailedAttemptTimestamp, setLastFailedAttemptTimestamp] = useState(null);

  useEffect(() => {
    const checkLoginAttempts = async () => {
      const storedAttempts = await AsyncStorage.getItem('login_attempts');
      const storedTimestamp = await AsyncStorage.getItem('last_failed_attempt_timestamp');

      if (storedAttempts && storedTimestamp) {
        setLoginAttempts(parseInt(storedAttempts, 10));
        setLastFailedAttemptTimestamp(parseInt(storedTimestamp, 10));
      }
    };

    checkLoginAttempts();
  }, []);

  const logar = async () => {
    if (loginAttempts >= MAX_LOGIN_ATTEMPTS && Date.now() - lastFailedAttemptTimestamp < LOCKOUT_DURATION) {
      ToastAndroid.show(`Too many failed attempts. Please wait ${LOCKOUT_DURATION / 1000} seconds.`, ToastAndroid.LONG);
      return;
    }

    if (!cpf || !password) {
      ToastAndroid.show('CPF and password are required', ToastAndroid.SHORT);
      return;
    }

    try {
      const response = await axios.post('http://10.0.2.2:8000/api/login/', {
        cpf: cpf,
        password: password,
      });

      const accessToken = response.data.access;
      if (accessToken) {
        // Reset login attempts on successful login
        setLoginAttempts(0);
        await AsyncStorage.multiRemove(['login_attempts', 'last_failed_attempt_timestamp']);

        await AsyncStorage.setItem('access_token', accessToken);
        ToastAndroid.show('Logged in successfully', ToastAndroid.SHORT);
        navigation.navigate('Home');
      } else {
        ToastAndroid.show('Access token not found in the response', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error during login:', error.response?.data || error.message);
      ToastAndroid.show('Invalid credentials', ToastAndroid.SHORT);

      // Update login attempts and timestamp on failed login
      setLoginAttempts(loginAttempts + 1);
      setLastFailedAttemptTimestamp(Date.now());

      await AsyncStorage.multiSet([
        ['login_attempts', String(loginAttempts + 1)],
        ['last_failed_attempt_timestamp', String(Date.now())],
      ]);

      // If max attempts reached, show lockout message
      if (loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS) {
        ToastAndroid.show(`Too many failed attempts. Please wait ${LOCKOUT_DURATION / 1000} seconds.`, ToastAndroid.LONG);
      }
    }
  };

  function Cad() {
    navigation.navigate('Register');
  }

  return (
    <View>
      <ImageBackground source={bg} resizeMode="cover" style={style.container}>
        <View style={style.bg}>
          <View>
            <Text style={style.title}>LOGIN</Text>
          </View>
          <View style={style.inps}>
            <TextInput
              placeholder="Cpf:"
              placeholderTextColor="gray"
              onChangeText={setCpf}
              value={cpf}
              style={style.caixa}
              keyboardType='numeric'
            />
            <TextInput
              placeholder="Password:"
              placeholderTextColor="gray"
              onChangeText={setPassword}
              value={password}
              style={style.caixa}
              secureTextEntry={true}
            />
          </View>
          <View>
            <Text style={style.textP}>Forgot Password?</Text>
          </View>
          <View style={style.btns}>
            <TouchableOpacity style={style.btn} onPress={logar}>
              <Text style={style.text}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.btn} onPress={Cad}>
              <Text style={style.text}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
