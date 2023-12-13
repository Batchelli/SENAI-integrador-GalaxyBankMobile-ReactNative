import { Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import style from './Style.module.css';
import { Ionicons as Exit, Feather as Help } from '@expo/vector-icons';
import NavBar from '../../components/NavBar/NavBar';

const bg = require('../../assets/Bg/BgBg.png');

export default function Cards({ navigation }) {
    function Home() {
        navigation.navigate('Home')
    }
    return (
        <View>
            <ImageBackground source={bg} resizeMode="cover" style={style.container}>
                <View style={style.bg}>
                    <NavBar/>
                </View>
            </ImageBackground>
        </View>
    );
}
