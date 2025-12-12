import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import { AuthContext } from "../context/AuthProvider";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // TEMP — until backend ready
  const handleLogin = () => {
    if (!email || !password) {
      alert("Enter email & password");
      return;
    }

    // mock login (replace with backend later)
    login("DUMMY_JWT_TOKEN", { name: "Sai Charan", email });

    navigation.replace("Home");
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: "800", marginBottom: 20 }}>
        Login
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={{ color: "#007bff", marginTop: 10 }}>
          Create new account?
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "700" },
};
