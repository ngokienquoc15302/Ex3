import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export function TodoListApp() {
    const navigation = useNavigation();
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
        const unsubscribe = firestore().collection('todos')
            .onSnapshot((querySnapshot) => {
                const todos = [];
                querySnapshot.forEach((doc) => {
                    todos.push({ id: doc.id, ...doc.data() });
                });
                setTodos(todos);
            });
        return () => unsubscribe();
    }, []);

    const addTodo = async () => {
        if (text.trim()) {
            const todoData = {
                title: text,
                description: '',
                priority: 'Medium',
                dueDate: null,
                completed: false,
                createdAt: new Date(),
                lastModifiedAt: new Date(),
                assignedTo: '',
                tags: [],
                attachments: []
            };

            try {
                const docRef = await firestore().collection('todos').add(todoData);
                console.log('Todo added successfully with ID: ', docRef.id);
                setText('');
            } catch (error) {
                console.error('Error adding todo: ', error);
            }
        }
    };

    const removeTodo = async (id) => {
        try {
            await firestore().collection('todos').doc(id).delete();
        } catch (error) {
            console.error('Error removing todo: ', error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.todoItem}>
            <TouchableOpacity onPress={() => removeTodo(item.id)}>
                <Icon name="times" size={20} color="red" />
            </TouchableOpacity>
            <Text>{item.title}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder="Add Todo..."
                value={text}
                onChangeText={setText}
            />
            <TouchableOpacity style={styles.addButton} onPress={addTodo}>
                <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <FlatList
                data={todos}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                style={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    backButton: {
        marginBottom: 10,
    },
    backButtonText: {
        color: '#007bff',
        fontSize: 16,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    addButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    list: {
        flex: 1,
    },
    todoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
});

export default TodoListApp;
