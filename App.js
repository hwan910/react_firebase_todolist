// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Button,
  Alert,
  TextInput,
} from "react-native";
import styled from "@emotion/native";
import { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyCj5PiipCXZ_xKHpjy38Go-JzyR18qDEcw",
  authDomain: "st-practice-975cb.firebaseapp.com",
  projectId: "st-practice-975cb",
  storageBucket: "st-practice-975cb.appspot.com",
  messagingSenderId: "708217413194",
  appId: "1:708217413194:web:52628d7b98e22a1e44d0b3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editText, setEditText] = useState("");
  const [category, setCategory] = useState("js");
  useEffect(() => {
    getTodos();
  }, [todos]);

  const getTodos = async () => {
    const array = [];
    const querySnapshot = await getDocs(collection(db, "todos"));
    querySnapshot.forEach((doc) => {
      array.push({ ...doc.data(), docId: doc.id });
    });
    return setTodos(array);
  };

  const addTodo = async () => {
    try {
      const docRef = await addDoc(collection(db, "todos"), {
        id: Date.now(),
        text,
        isDone: false,
        isEdit: false,
        category,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setText("");
  };

  const switchDone = async (id) => {
    const index = todos.findIndex((todo) => todo.docId === id);
    const todoRef = doc(db, "todos", id);
    await updateDoc(todoRef, {
      isDone: !todos[index].isDone,
    });
  };

  const deleteTodo = (id) => {
    Alert.alert("Todo삭제", "삭제하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
        onPress: () => console.log("취소"),
      },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "todos", id));
        },
      },
    ]);
  };
  const editTodo = async (id) => {
    const todoRef = doc(db, "todos", id);
    await updateDoc(todoRef, {
      text: editText,
      isEdit: false,
    });
    setEditText("");
  };

  const switchEdit = async (id) => {
    const index = todos.findIndex((todo) => todo.docId === id);
    const todoRef = doc(db, "todos", id);
    await updateDoc(todoRef, {
      isEdit: !todos[index].isEdit,
    });
  };

  return (
    <SafeAreaView style={styles.safearea}>
      <StatusBar style="auto" />
      <View style={styles.view}>
        <Header>
          <Btn
            color={category === "js" ? "skyblue" : "gray"}
            onPress={() => setCategory("js")}
          >
            <Text>JavaScript</Text>
          </Btn>
          <Btn
            color={category === "react" ? "skyblue" : "gray"}
            onPress={() => setCategory("react")}
          >
            <Text>React</Text>
          </Btn>
          <Btn
            color={category === "ct" ? "skyblue" : "gray"}
            onPress={() => setCategory("ct")}
          >
            <Text>Coding Test</Text>
          </Btn>
        </Header>
        <InputContainer>
          <InputBox
            value={text}
            placeholder="Enter your task"
            onChangeText={setText}
            onSubmitEditing={addTodo}
          ></InputBox>
        </InputContainer>
        <ScrollView>
          <ListsContainer>
            {todos?.map((todo) => {
              if (todo.category === category) {
                return (
                  <ListBox key={todo.id}>
                    <List>
                      {todo.isEdit ? (
                        <TextInput
                          onChangeText={setEditText}
                          onSubmitEditing={() => {
                            editTodo(todo.docId);
                          }}
                          value={editText}
                          style={{
                            backgroundColor: "white",
                          }}
                        ></TextInput>
                      ) : (
                        <Text
                          style={{
                            textDecorationLine: todo.isDone
                              ? "line-through"
                              : "none",
                          }}
                        >
                          {todo.text}
                        </Text>
                      )}
                    </List>

                    <Button
                      title="✅"
                      onPress={() => switchDone(todo.docId)}
                    ></Button>
                    <Button
                      title="📝"
                      onPress={() => switchEdit(todo.docId)}
                    ></Button>
                    <Button
                      title="❌"
                      onPress={() => deleteTodo(todo.docId)}
                    ></Button>
                  </ListBox>
                );
              }
            })}
          </ListsContainer>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
  },
  view: {
    marginTop: 50,
    padding: 20,
  },
});

const Header = styled.View`
  border-bottom-width: 3px;
  border-bottom-color: gray;
  flex-direction: row;
  justify-content: space-evenly;
  padding-bottom: 10px;
`;

const Btn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 40px;
  background-color: ${(props) => props.color};
`;

const InputContainer = styled.View`
  border-bottom-width: 3px;
  border-bottom-color: gray;
  height: 70px;
  align-items: center;
  justify-content: center;
`;

const InputBox = styled.TextInput`
  width: 95%;
  height: 30px;
  border: 1px solid gray;
  padding-left: 10px;
`;

const ListsContainer = styled.View``;

const ListBox = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: lightgray;
  margin-top: 10px;
  padding-left: 10px;

  .Text {
    align-items: center;
  }
`;

const List = styled.View`
  flex: 1;
  background-color: lightgray;
`;
