import { View, Image } from 'react-native';
import style from './Style.module.css';

export default function NavBar() {
    return (
        <View style={style.container}>
            <View style={style.footer}>
                <Image source={require('../../assets/Icons/home.png')} style={style.iconF}></Image>
                <Image source={require('../../assets/Icons/qrCode.png')} style={style.iconF}></Image>
                <Image source={require('../../assets/Icons/bag.png')} style={style.iconF}></Image>
            </View>
        </View>
    )
}
