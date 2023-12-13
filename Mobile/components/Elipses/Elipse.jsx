import { TouchableOpacity, Image } from 'react-native';
import style from './Elipse.module.css'



export default function Elipse({ img, func }) {
    return (
        <TouchableOpacity style={style.elipse}>
            onPress={func}
            {img}
        </TouchableOpacity>
    );
}