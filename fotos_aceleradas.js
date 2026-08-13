import { Accelerometer } from "expo-sensors";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
// Configuração câmera

export default function CameraScreen(){
  const [permission, requestPermission] = useCameraPermissions();
const cameraRef = useRef(null);
const [pronta, setPronta] = useState(false);

if (!permission) {
  return <Text>Verificando permissoes...</Text>;
}

if (!permission.granted) {
  return (
    <>
      <Text>Permissao de camera necessaria.</Text>
      <Button title="Solicitar" onPress={requestPermission} />
    </>
  );
}

<CameraView // Renderiza o preview em tempo real
  ref={cameraRef}
  style={{ flex: 1 }} // Precisa de dimensões definidas
  facing="back"
  onCameraReady={() => setPronta(true)} // Aguardar este evento antes de chamar takePictureAsync
/>;

const [facing, setFacing] = useState('back'); // 'back' | 'front'

function trocarCamera() {
  setFacing(prev => prev === 'back' ? 'front' : 'back');
}

<CameraView facing={facing}/>

import { Image } from 'react-native';

{foto && (
  <Image
    source={{ uri: foto.uri }}
    style={{ width: '100%', height: 300 }}
    resizeMode="contain"
  />
)}
}


//configuração acelerometro
import { Accelerometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';

const disponivel = await Accelerometer.isAvailableAsync();

if (!disponivel) {
  alert("sensor indisponível")
}

export default function AcelerometroScreen(){

}

