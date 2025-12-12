import axios from "axios";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 🟢 IMPORTANT:
// Android emulator      -> http://10.0.2.2:8080
// iOS simulator         -> http://localhost:8080
// Real device (same WiFi)-> http://YOUR_PC_IP:8080
const BACKEND_BASE_URL = "http://10.77.75.149:8080";

export default function App() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("");
  const [approvalLink, setApprovalLink] = useState("");

  const handleCreateOrder = async () => {
    if (!amount) {
      Alert.alert("Validation", "Please enter amount");
      return;
    }

    try {
      setLoading(true);
      setStatus("");
      setOrderId("");
      setApprovalLink("");

      const response = await axios.post(
        `${BACKEND_BASE_URL}/api/paypal/create-order`,
        {
          amount,
          currency,
        }
      );

      const data = response.data;
      console.log("Create order response:", data);

      if (!data.orderId || !data.approvalLink) {
        Alert.alert("Error", "Invalid response from server");
        return;
      }

      setOrderId(data.orderId);
      setApprovalLink(data.approvalLink);
      setStatus("Order created successfully");

      Alert.alert("Order Created", `Order ID: ${data.orderId}`);
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create PayPal order";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPaypal = async () => {
    if (!approvalLink) {
      Alert.alert("Info", "No approval link found. Please create an order again.");
      return;
    }
    try {
      const supported = await Linking.canOpenURL(approvalLink);
      if (supported) {
        await Linking.openURL(approvalLink);
      } else {
        Alert.alert("Error", "Cannot open PayPal approval link");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to open PayPal");
    }
  };

  const handleCapturePayment = async () => {
    if (!orderId) {
      Alert.alert("Info", "Create an order first.");
      return;
    }

    try {
      setLoading(true);
      setStatus("");

      const response = await axios.post(
        `${BACKEND_BASE_URL}/api/paypal/capture-order/${orderId}`
      );

      console.log("Capture response:", response.data);
      const result = response.data;

      setStatus(
        `Payment captured successfully ${
          result?.id ? `(Txn: ${result.id})` : ""
        }`
      );
      Alert.alert("Success", "Payment captured successfully");
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to capture PayPal order";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>PayPal Payment</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          placeholderTextColor="#9ca3af"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.label}>Currency</Text>
        <TextInput
          style={styles.input}
          placeholder="USD"
          placeholderTextColor="#9ca3af"
          value={currency}
          onChangeText={setCurrency}
          autoCapitalize="characters"
        />

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleCreateOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Create PayPal Order</Text>
          )}
        </TouchableOpacity>

        {approvalLink ? (
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={handleOpenPaypal}
            disabled={loading}
          >
            <Text style={styles.btnText}>Open PayPal & Approve</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={[
            styles.captureBtn,
            (!orderId || loading) && { opacity: 0.5 },
          ]}
          onPress={handleCapturePayment}
          disabled={!orderId || loading}
        >
          <Text style={styles.btnText}>Capture Payment</Text>
        </TouchableOpacity>

        {orderId ? (
          <View style={styles.orderBox}>
            <Text style={styles.orderText}>Order ID:</Text>
            <Text style={styles.orderId}>{orderId}</Text>
          </View>
        ) : null}

        {status ? <Text style={styles.status}>{status}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
  },
  title: {
    fontSize: 26,
    color: "#f8fafc",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 20,
    elevation: 10,
  },
  label: {
    color: "#cbd5f5",
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#020617",
    color: "#f8fafc",
    padding: 12,
    borderRadius: 10,
  },
  primaryBtn: {
    backgroundColor: "#22c55e",
    padding: 14,
    borderRadius: 50,
    marginTop: 25,
    alignItems: "center",
  },
  secondaryBtn: {
    backgroundColor: "#3b82f6",
    padding: 14,
    borderRadius: 50,
    marginTop: 15,
    alignItems: "center",
  },
  captureBtn: {
    backgroundColor: "#6366f1",
    padding: 14,
    borderRadius: 50,
    marginTop: 15,
    alignItems: "center",
  },
  btnText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  orderBox: {
    marginTop: 25,
    backgroundColor: "#020617",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  orderText: {
    color: "#9ca3af",
  },
  orderId: {
    color: "#22c55e",
    fontWeight: "700",
  },
  status: {
    marginTop: 10,
    color: "#fbbf24",
    textAlign: "center",
  },
});
