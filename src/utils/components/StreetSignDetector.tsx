import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { Module, Tensor } from 'react-native-pytorch';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

async function loadModel() {
  const module = await Module.loadAsset('models/streetsign_simple.pt');
  return module;
}

export default function StreetSignDetector() {
  const [model, setModel] = useState<Module | null>(null);
  const [outputText, setOutputText] = useState('Model not run yet');
  const devices = useCameraDevices();
  const device = devices.back;

  useEffect(() => {
    loadModel().then(setModel);
  }, []);

  const runDummyInference = () => {
    if (!model) return;
    // Create dummy tensor filled with zeros with shape [1,3,224,224]
    const inputTensor = new Tensor(new Float32Array(1 * 3 * 224 * 224), [1, 3, 224, 224]);
    const output = model.forward(inputTensor);
    setOutputText(`Model output shape: ${output.shape.join(', ')}`);
    console.log('Model output:', output);
  };

  if (!device) {
    return <Text>Loading camera device...</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        device={device}
        isActive={true}
        photo={false}
        video={false}
      />
      <Button title="Run Model Inference" onPress={runDummyInference} />
      <Text style={{ padding: 10, backgroundColor: 'white' }}>{outputText}</Text>
    </View>
  );
}
