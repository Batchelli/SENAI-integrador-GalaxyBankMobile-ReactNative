import { Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import style from './Style.module.css';
import { Ionicons as Exit, Feather as Help } from '@expo/vector-icons';

const bg = require('../../assets/Bg/BgBg.png');

export default function CodeBar({ navigation }) {
    function Home() {
        navigation.navigate('Home')
    }
    return (
        <View>
            <ImageBackground source={bg} resizeMode="cover" style={style.container}>
                <View style={style.bg}>
                    <View style={style.header}>
                        <TouchableOpacity
                            onPress={Home}
                        >
                            <Exit
                                name="md-close"
                                size={30}
                                color={'#fff'}
                            />
                        </TouchableOpacity>
                        <View style={style.elipse}>
                            <Image source={require('../../assets/Icons/barcode.png')} style={style.icon} />
                        </View>
                        <TouchableOpacity>
                            <Help
                                name="help-circle"
                                size={30}
                                color={'#fff'}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={style.textArea}>
                        <Text style={style.title}>
                            Pagamento
                        </Text>
                        <Text style={style.text}>
                            Lorem ipsum dolor set ametLorem ipsum dolor set ametLorem ipsum dolor set ametLorem ipsum dolor set ametLorem ipsum
                        </Text>
                    </View>
                    <View style={style.enviar}>
                        <Text style={style.title}>
                            Opções de pagamento
                        </Text>
                        <View style={style.elipses}>
                            <View style={style.nameElipse}>
                                <TouchableOpacity style={style.elipse}
                                >
                                    <Image source={require('../../assets/Icons/card.png')} style={style.icon} />
                                </TouchableOpacity>
                                <Text style={style.name}>Fatura do cartão</Text>
                            </View>
                            <View style={style.nameElipse}>
                                <TouchableOpacity style={style.elipse}
                                >
                                    <Image source={require('../../assets/Icons/codeBar.png')} style={style.icon} />
                                </TouchableOpacity>
                                <Text style={style.name}>Boleto</Text>
                            </View>
                            <View style={style.nameElipse}>
                                <TouchableOpacity style={style.elipse}
                                >
                                    <Image source={require('../../assets/Icons/qrCode.png')} style={style.icon} />
                                </TouchableOpacity>
                                <Text style={style.name}>PIX QR Code</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                    </View>
                    <View style={style.textAreas}>
                        <View>
                            <Image source={require('../../assets/Icons/search.png')} style={style.icon} />
                        </View>
                        <View style={style.textBox}>
                            <Text style={style.titleR}>
                                Buscardor
                            </Text>
                            <Text style={style.textR}>
                                Busque seus boletos pedentes ou agende boletos.
                            </Text>
                        </View>
                    </View>
                    <View style={style.textAreas}>
                        <View>
                            <Image source={require('../../assets/Icons/sub.png')} style={style.icon} />
                        </View>
                        <View style={style.textBox}>
                            <Text style={style.titleR}>
                                Débito Automatico
                            </Text>
                            <Text style={style.textR}>
                                Contas em débito automatico
                            </Text>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}
