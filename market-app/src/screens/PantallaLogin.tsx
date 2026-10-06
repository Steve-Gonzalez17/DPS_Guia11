import React, { JSX, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { Input } from '@rneui/themed';
import { FontAwesome } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, Usuario } from '../types';
import { apiFetch } from '../services/api';
import { colors } from '../theme/color';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

interface LoginResponse {
    message: string;
    usuario: Usuario;
}

const PantallaLogin = ({ navigation }: Props): JSX.Element => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [cargando, setCargando] = useState<boolean>(false);

    const entrar = async (): Promise<void> => {
        if (!username.trim() || !password) {
            Alert.alert(
                'Aviso',
                'Ingresa tu nombre de usuario y contraseña'
            );
            return;
        }

        setCargando(true);

        try {
            const respuesta = await apiFetch<LoginResponse>(
                '/usuarios/login',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        username: username.trim(),
                        password,
                    }),
                }
            );

            console.log('Login exitoso:', respuesta);

            navigation.navigate('ListarProductos');

        } catch (error) {
            const mensaje =
                error instanceof Error
                    ? error.message
                    : 'Error de red';

            Alert.alert(
                'No se pudo iniciar sesión',
                mensaje
            );
        } finally {
            setCargando(false);
        }
    };

    return (
        <View style={styles.container}>

            <Image
                style={styles.logo}
                source={require('../../assets/market.jpg')}
            />

            <Text style={styles.title}>
                Bienvenido a Market
            </Text>

            <Text style={styles.subtitle}>
                Inicia sesión para continuar
            </Text>

            <Input
                placeholder="Nombre de usuario"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                rightIcon={
                    <FontAwesome
                        name="user"
                        size={18}
                        color={colors.textMuted}
                    />
                }
            />

            <Input
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                rightIcon={
                    <FontAwesome
                        name="lock"
                        size={22}
                        color={colors.textMuted}
                    />
                }
            />

            <TouchableOpacity
                style={styles.button}
                onPress={entrar}
                disabled={cargando}
            >
                {cargando ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>
                        Entrar
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('Registro')}
                disabled={cargando}
            >
                <Text style={styles.link}>
                    ¿No tienes cuenta? Regístrate
                </Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: colors.bg,
    },

    logo: {
        width: 110,
        height: 110,
        alignSelf: 'center',
        marginBottom: 14,
        borderRadius: 55,
    },

    title: {
        fontSize: 24,
        fontWeight: '800',
        textAlign: 'center',
        color: colors.primaryDark,
    },

    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        color: colors.textMuted,
        marginBottom: 22,
    },

    button: {
        height: 50,
        backgroundColor: colors.primary,
        borderRadius: 10,
        justifyContent: 'center',
        marginTop: 8,
    },

    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
        textAlign: 'center',
    },

    link: {
        textAlign: 'center',
        color: colors.primary,
        marginTop: 18,
        fontWeight: '600',
    },
});

export default PantallaLogin;
