import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { Tensor, Module } from 'react-native-pytorch';

type Props = {
  model: Module;
};

export default function CameraInput({ model }: Props) {
  const devices = useCameraDevices();
  const device = devices.back;
  const cameraRef = useRef<Camera>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [result, setResult] = useState<string>('No detection yet');

  useEffect(() => {
    async function requestPermission() {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    }
    requestPermission();
  }, []);

  async function captureAndRunModel() {
    if (cameraRef.current == null) return;

    // Capture a photo frame (will return a path or data depending on config)
    const photo = await cameraRef.current.takePhoto({
      flash: 'off',
      qualityPrioritization: 'speed',
    });

    // You need to load the image file, resize and convert to tensor here
    // (You can use libraries like 'react-native-image-resizer' or native modules)
    // Then preprocess it to Float32Array [1, 3, 224, 224]

    // For demo, create a dummy tensor instead:
    const inputTensor = new Tensor(new Float32Array(1 * 3 * 224 * 224), [1, 3, 224, 224]);

    // Run model
    const output = model.forward(inputTensor);

    // TODO: interpret output and update UI
    setResult('Model ran! Output shape: ' + output.shape.join(', '));
  }

  if (device == null || !hasPermission) {
    return <Text>Loading camera or permission not granted...</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        ref={cameraRef}
        photo={true}
      />
      <View style={{ position: 'absolute', bottom: 50, left: 20 }}>
        <Button title="Capture & Detect" onPress={captureAndRunModel} />
        <Text style={{ color: 'white', marginTop: 10 }}>{result}</Text>
      </View>
    </View>
  );
}
