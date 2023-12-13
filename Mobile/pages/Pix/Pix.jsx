import { Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import style from './Style.module.css';
import { Ionicons as Exit, Feather as Help } from '@expo/vector-icons';
import NavBar from '../../components/NavBar/NavBar';

const bg = require('../../assets/Bg/BgBg.png');

export default function Pix({ navigation }) {
  function Home() {
    navigation.navigate('Home')
  }

  function Transfer(){
    navigation.navigate('Transfer')
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
              <Image source={require('../../assets/Icons/pix.png')} style={style.icon}></Image>
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
              Pix
            </Text>
            <Text style={style.text}>
              Lorem ipsum dolor set ametLorem ipsum dolor set ametLorem ipsum dolor set ametLorem ipsum dolor set ametLorem ipsum
            </Text>
          </View>
          <View style={style.enviar}>
            <Text style={style.title}>
              Enviar
            </Text>
            <View style={style.elipses}>
              <View style={style.nameElipse}>
                <TouchableOpacity style={style.elipse}
                  onPress={Transfer}>
                  <Image source={require('../../assets/Icons/pay.png')} style={style.icon}></Image>
                </TouchableOpacity>
                <Text style={style.name}>Transferir</Text>
              </View>
              <View style={style.nameElipse}>
                <TouchableOpacity style={style.elipse}
                  onPress={Pix}>
                  <Image source={require('../../assets/Icons/calen.png')} style={style.icon}></Image>
                </TouchableOpacity>
                <Text style={style.name}>Programar</Text>
              </View>
              <View style={style.nameElipse}>
                <TouchableOpacity style={style.elipse}
                  onPress={Pix}>
                  <Image source={require('../../assets/Icons/copcol.png')} style={style.icon}></Image>
                </TouchableOpacity>
                <Text style={style.name}>Copia e Cola</Text>
              </View>
              <View style={style.nameElipse}>
                <TouchableOpacity style={style.elipse}
                  onPress={Pix}>
                  <Image source={require('../../assets/Icons/qrCode.png')} style={style.icon}></Image>
                </TouchableOpacity>
                <Text style={style.name}>QR Code</Text>
              </View>
            </View>
          </View>
          <View style={style.enviar}>
            <Text style={style.title}>
              Receber
            </Text>
            <View style={style.elipses}>
              <View style={style.nameElipse}>
                <TouchableOpacity style={style.elipse}
                  onPress={Pix}>
                  <Image source={require('../../assets/Icons/cobrar.png')} style={style.icon}></Image>
                </TouchableOpacity>
                <Text style={style.name}>Cobrar</Text>
              </View>
              <View style={style.nameElipse}>
                <TouchableOpacity style={style.elipse}
                  onPress={Pix}>
                  <Image source={require('../../assets/Icons/depo.png')} style={style.icon}></Image>
                </TouchableOpacity>
                <Text style={style.name}>Depositar</Text>
              </View>
            </View>
          </View>
          <View style={style.textArea}>
            <Text style={style.titleR}>
              Registrar nova chave PIX
            </Text>
            <Text style={style.textR}>
              Registre uma nova chave PIX
              ou faça a portabilidade de uma
            </Text>
          </View>
          <NavBar/>
        </View>
      </ImageBackground>
    </View>
  );
}
