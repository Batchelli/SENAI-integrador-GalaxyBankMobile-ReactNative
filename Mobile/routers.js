import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./pages/Home/Home.jsx";
import Pix from "./pages/Pix/Pix.jsx";
import CodeBar from "./pages/BarCode/CodeBar.jsx";
import Cards from "./pages/Cards/Cards.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import Transfer from "./pages/Tranferencia/Transfer.jsx";
import Emprestimos from "./pages/Emprestimos/Emprestimo.jsx"


const Pilha = createStackNavigator()

export default function Routers({navigation}) {
    return (
        <NavigationContainer>
            <Pilha.Navigator>
                <Pilha.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />

                <Pilha.Screen
                    name="Register"
                    component={Register}
                    options={{ headerShown: false }}
                />

                <Pilha.Screen
                    name="Home"
                    component={Home}
                    options={{ headerShown: false }}
                />

                <Pilha.Screen
                    name="Pix"
                    component={Pix}
                    options={{ headerShown: false }}
                />

                <Pilha.Screen
                    name="CodeBar"
                    component={CodeBar}
                    options={{ headerShown: false }}
                />

                <Pilha.Screen
                    name="Cards"
                    component={Cards}
                    options={{ headerShown: false }}
                />

                <Pilha.Screen
                    name="Transfer"
                    component={Transfer}
                    options={{ headerShown: false }}
                />

                <Pilha.Screen
                    name="Loan"
                    component={Emprestimos}
                    options={{ headerShown: false }}
                />
            </Pilha.Navigator>
        </NavigationContainer>
    )
}