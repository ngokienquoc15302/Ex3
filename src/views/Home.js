import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export function TodoListApp() {
    const navigation = useNavigation();
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');

    const addTodo = async () => {
        if (text.trim()) {
            const todoData = {
                text: text,
                completed: false
            };

            try {
                await firestore().collection('todo').doc('lxZjPFK1r18CJzqiaH7h').collection('items').add(todoData);
                setTodos([...todos, { id: Date.now(), text: text }]);
                setText('');
            } catch (error) {
                console.error('Error adding todo: ', error);
            }
        }
    };

    const removeTodo = async (id) => {
        try {
            await firestore().collection('todo').doc('lxZjPFK1r18CJzqiaH7h').collection('items').doc(id.toString()).delete();
            setTodos(todos.filter(todo => todo.id !== id));
        } catch (error) {
            console.error('Error removing todo: ', error);
        }
    };

    const startEditing = (id, text) => {
        setEditingId(id);
        setEditingText(text);
    };

    const saveEditing = async () => {
        try {
            await firestore().collection('todo').doc('lxZjPFK1r18CJzqiaH7h').collection('items').doc(editingId.toString()).update({ text: editingText });
            setTodos(todos.map(todo => todo.id === editingId ? { ...todo, text: editingText } : todo));
            setEditingId(null);
            setEditingText('');
        } catch (error) {
            console.error('Error updating todo: ', error);
        }
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingText('');
    };

    const renderItem = ({ item }) => (
        <View style={styles.todoItem}>
            {editingId === item.id ? (
                <View style={styles.editingContainer}>
                    <TextInput
                        style={styles.input}
                        value={editingText}
                        onChangeText={setEditingText}
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={saveEditing}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={cancelEditing}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity onPress={() => startEditing(item.id, item.text)}>
                    <Text>{item.text}</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => removeTodo(item.id)}>
                <Icon name="times" size={20} color="red" />
            </TouchableOpacity>
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
                keyExtractor={item => item.id.toString()}
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
    editingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: 'green',
        padding: 5,
        borderRadius: 5,
        marginLeft: 5,
    },
    saveButtonText: {
        color: '#fff',
    },
    cancelButton: {
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 5,
        marginLeft: 5,
    },
    cancelButtonText: {
        color: '#fff',
    },
});

export default TodoListApp;
