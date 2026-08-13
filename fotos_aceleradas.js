// Configuração câmera
import { CameraView, useCameraPermissions } from "expo-camera";
import { Accelerometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";
import { Button, Text, StyleSheet, View } from "react-native";
import React from "react";

export default function CameraScreen() {
  // =========================
  // CONFIGURAÇÃO DA CÂMERA
  // =========================

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [pronta, setPronta] = useState(false);
  const [facing, setFacing] = useState("back");

  // =========================
  // CONFIGURAÇÃO ACELERÔMETRO
  // =========================

  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [ativo, setAtivo] = useState(false);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    // Verifica se o acelerômetro está disponível
    async function verificarSensor() {
      const disponivel = await Accelerometer.isAvailableAsync();

      if (!disponivel) {
        alert("Sensor indisponível");
      }
    }

    verificarSensor();

    // Remove a inscrição ao desmontar a tela
    return () => subscriptionRef.current?.remove();
  }, []);

  // =========================
  // FUNÇÕES DA CÂMERA
  // =========================

  function trocarCamera() {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  }

  // =========================
  // FUNÇÕES DO ACELERÔMETRO
  // =========================

  function iniciar() {
    if (subscriptionRef.current) {
      return;
    }

    Accelerometer.setUpdateInterval(200);

    // Inicia a leitura do acelerômetro
    subscriptionRef.current = Accelerometer.addListener(setData);

    setAtivo(true);
  }

  function parar() {
    // Encerra a leitura do acelerômetro
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;

    setAtivo(false);
  }

  // =========================
  // PERMISSÕES DA CÂMERA
  // =========================

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.texto}>Verificando permissões...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.texto}>
          Permissão de câmera necessária.
        </Text>

        <Button
          title="Solicitar"
          onPress={requestPermission}
        />
      </View>
    );
  }

  // =========================
  // TELA PRINCIPAL
  // =========================

  return (
    <View style={styles.container}>

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        onCameraReady={() => setPronta(true)}
      />

      <View style={styles.painel}>

        <Text style={styles.titulo}>
          Fotos Aceleradas
        </Text>

        <Text style={styles.status}>
          Câmera: {pronta ? "Pronta" : "Preparando..."}
        </Text>

        <View style={styles.dados}>
          <Text style={styles.dado}>
            X: {data.x.toFixed(2)}
          </Text>

          <Text style={styles.dado}>
            Y: {data.y.toFixed(2)}
          </Text>

          <Text style={styles.dado}>
            Z: {data.z.toFixed(2)}
          </Text>
        </View>

        <View style={styles.botoes}>
          <View style={styles.botao}>
            <Button
              title="Trocar câmera"
              onPress={trocarCamera}
            />
          </View>

          <View style={styles.botao}>
            <Button
              title={ativo ? "Parar sensor" : "Iniciar sensor"}
              onPress={ativo ? parar : iniciar}
            />
          </View>
        </View>

      </View>
    </View>
  );
}

// =========================
// TIRAR FOTO NA QUEDA
// =========================
const LIMIAR_QUEDA = 2.5;        // magnitude "g" que caracteriza uma queda — calibre testando no aparelho
const COOLDOWN_MS = 5000;        // tempo mínimo entre duas capturas

const [foto, setFoto] = useState(null);
const prontaRef = useRef(false);
const ultimaCapturaRef = useRef(0);

useEffect(() => {
  prontaRef.current = pronta;
}, [pronta]);

function verificarQueda({ x, y, z }) {
  const magnitude = Math.sqrt(x * x + y * y + z * z);
  if (magnitude > LIMIAR_QUEDA) {
    tirarFoto();
  }
}

async function tirarFoto() {
  if (!cameraRef.current || !prontaRef.current) return;

  const agora = Date.now();
  if (agora - ultimaCapturaRef.current < COOLDOWN_MS) return;
  ultimaCapturaRef.current = agora;

  try {
    const novaFoto = await cameraRef.current.takePictureAsync();
    setFoto(novaFoto);
    console.log("Queda detectada! Foto tirada:", novaFoto.uri);
  } catch (erro) {
    console.log("Erro ao tirar foto:", erro);
  }
}

function iniciar() {
  if (subscriptionRef.current) {
    return;
  }

  Accelerometer.setUpdateInterval(200);

  subscriptionRef.current = Accelerometer.addListener((novaLeitura) => {
    setData(novaLeitura);
    verificarQueda(novaLeitura);
  });

  setAtivo(true);
}

{foto && (
  <Image
    source={{ uri: foto.uri }}
    style={styles.preview}
    resizeMode="contain"
  />
)}

preview: {
  width: "100%";
  height: 200;
  marginTop: 10;
};

// =========================
// ESTILIZAÇÃO
// =========================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  camera: {
    flex: 1,
  },

  painel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },

  titulo: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },

  texto: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },

  status: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },

  dados: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },

  dado: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  botoes: {
    gap: 10,
  },

  botao: {
    marginVertical: 2,
  },

  center: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});