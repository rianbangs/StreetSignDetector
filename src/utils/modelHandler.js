import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { loadModel, runModel } from '../utils/modelHandler';

export default function StreetSignDetector() {
  const [model, setModel] = useState(null);

  useEffect(() => {
    async function init() {
      const loadedModel = await loadModel();
      setModel(loadedModel);

      // Create dummy input tensor with shape [1, 3, 224, 224]
      const inputTensor = new Tensor(new Float32Array(1 * 3 * 224 * 224), [1, 3, 224, 224]);

      // Run the model with the dummy input
      const output = await runModel(loadedModel, inputTensor);

      // You can now interpret output here
    }

    init();
  }, []);

  return (
    <View>
      <Text>Street Sign Detector Model is {model ? 'Loaded' : 'Loading...'}</Text>
    </View>
  );
}
