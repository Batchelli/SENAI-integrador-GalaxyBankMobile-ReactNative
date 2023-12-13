import { useState } from 'react';
import style from './Style.module.css';
import * as ImagePicker from 'expo-image-picker';
import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

const bg = require('../../assets/Bg/BgBg.png');

export default function Register({ navigation }) {
    const [email, setEmail] = useState('');
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [imagem, setImagem] = useState(null);
    const [blob, setBlob] = useState(null);

    const getBlobFromUri = async (uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });
    
        const mimeType = blob.type;
    
        return { blob, mimeType };
    };

    const handleRegistration = async () => {
        console.log('Tentando fazer a requisição...');
    
        try {
            const { blob, mimeType } = await getBlobFromUri(image);
    
            const formData = new FormData();
            formData.append('cpf', cpf);
            formData.append('email', email);
            formData.append('first_name', nome);
            formData.append('last_name', sobrenome);
            formData.append('password', password);
            formData.append('profile_picture', {
                uri: image,
                name: `profile_picture.${mimeType.split('/')[1]}`,
                type: mimeType,
            });
    
            const response = await axios.post('http://10.0.2.2:8000/api/register/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            console.log('Cadastro bem-sucedido!', response.data);
            navigation.navigate('Login');
            // Adicione qualquer lógica de manipulação adicional conforme necessário
        } catch (error) {
            console.error('Erro durante o cadastro:', error.response?.data || error.message);
            // Handle the error
        }
    };
    
    
    const camera = async () => {
        try {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.canceled) {
                getBlobFromUri(result.assets[0].uri);
                setImage(result.assets[0].uri);
                const path = result.assets[0].uri;
                setImagem(path.substring(path.lastIndexOf('/') + 1, path.length));
            }
        } catch (E) {
            console.log(E);
        }
    };
    
    const gallery = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.canceled) {
                getBlobFromUri(result.assets[0].uri);
                setImage(result.assets[0].uri);
                const path = result.assets[0].uri;
                setImagem(path.substring(path.lastIndexOf('/') + 1, path.length));
            }
        } catch (E) {
            console.log(E);
        }
    };
    
    return (
        <View>
            <ImageBackground source={bg} resizeMode="cover" style={style.container}>
                <View style={style.bg}>
                    <View >
                        <Text style={style.title}>REGISTER</Text>
                    </View>
                    <View style={style.imgArea}>
                        <View style={style.imgBox}>
                            {image && (
                                <>
                                    <Image source={{ uri: image }} style={style.img} />
                                </>
                            )}
                        </View>
                        <View style={style.btnsImg}>
                            <TouchableOpacity onPress={gallery}>
                                <FontAwesome name="image" size={40} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={camera}>
                                <AntDesign name="camera" size={40} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={style.inps}>
                        <TextInput
                            placeholder="Nome:"
                            placeholderTextColor="gray"
                            onChangeText={setNome}
                            value={nome}
                            style={style.caixa}
                        />
                        <TextInput
                            placeholder="Sobrenome:"
                            placeholderTextColor="gray"
                            onChangeText={setSobrenome}
                            value={sobrenome}
                            style={style.caixa}
                        />
                        <TextInput
                            placeholder="Cpf:"
                            placeholderTextColor="gray"
                            onChangeText={setCpf}
                            value={cpf}
                            style={style.caixa}
                            keyboardType='numeric'
                        />
                        <TextInput
                            placeholder="Email:"
                            placeholderTextColor="gray"
                            onChangeText={setEmail}
                            value={email}
                            style={style.caixa}
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

                    <View style={style.btns}>
                        <TouchableOpacity style={style.btn} onPress={handleRegistration}>
                            <Text style={style.text}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}
