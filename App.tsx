import React from 'react';
import StreetSignDetector from './src/components/StreetSignDetector';
import { loadTF } from './utils/TensorFlowSetup';


function App(): React.JSX.Element {
  return <StreetSignDetector />;
}

export default App;
