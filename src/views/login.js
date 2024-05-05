import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function Login({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const checkCredentials = async () => {
        setLoading(true);
        try {
            const documentSnapshot = await firestore()
                .collection('testing')
                .doc('fUiRJ8X4z4BgIzhAk5wv')
                .get();

            if (documentSnapshot.exists) {
                const userData = documentSnapshot.data();
                if (userData.ID === username && userData.Password === password) {
                    console.log('successful');
                    navigation.navigate('Home');
                } else {
                    Alert.alert('Error', 'Incorrect username or password');
                }
            } else {
                Alert.alert('Error', 'User not found');
            }
        } catch (error) {
            console.error('Error checking credentials:', error);
            Alert.alert('Error', 'An error occurred while checking credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ backgroundColor: '#3498DB', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ marginTop: 5 }}>
                <Text style={{ fontSize: 24, color: 'pink' }}>Login</Text>
            </View>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, marginTop: 15 }}>
                <TextInput
                    style={{ height: 40, width: 350, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
                    placeholder="Username"
                    onChangeText={setUsername}
                    value={username}
                />
                <TextInput
                    style={{ height: 40, width: 350, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
                    placeholder="Password"
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry={true}
                />
                <Button
                    style={{ backgroundColor: 'pink' }}
                    title={loading ? 'Loading...' : 'Login'}
                    onPress={checkCredentials}
                    disabled={loading}
                />
            </View>
        </View>
    );
}
