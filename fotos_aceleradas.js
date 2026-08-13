// Configuração câmera
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, Text, Image } from "react-native";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [pronta, setPronta] = useState(false);

  if (!permission) {
    return <Text>Verificando permissões...</Text>;
  }

  if (!permission.granted) {
    return (
      <>
        <Text>Permissão de câmera necessária.</Text>
        <Button title="Solicitar" onPress={requestPermission} />
      </>
    );
  }

  const [facing, setFacing] = useState("back"); // 'back' | 'front'

  function trocarCamera() {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  }

  return (
    <CameraView // Renderiza o preview em tempo real
      ref={cameraRef}
      style={{ flex: 1 }} // Precisa de dimensões definidas
      facing={facing}
      onCameraReady={() => setPronta(true)} // Aguarda a câmera ficar pronta
    />
  );
}


// Configuração acelerômetro
import { Accelerometer } from "expo-sensors";
import { useEffect } from "react";

export default function AcelerometroScreen() {
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

  function iniciar() {
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
}