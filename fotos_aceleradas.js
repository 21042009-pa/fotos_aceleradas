import { Accelerometer } from 'expo-sensors';
import { CameraView, useCameraPermissions } from 'expo-camera';

const [permission, requestPermission] = useCameraPermissions();

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