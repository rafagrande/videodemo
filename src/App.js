import logo from './logo.svg';
import './App.css';
import React from 'react';
import ImageSequenceGenerator from './components/DropVideoToFrames';
import ResizeClip from './components/ResizeCip';

const App = () => {
  return (
    <div style={{display:'flex'}}>
      <ImageSequenceGenerator />
      {/* <ResizeClip key={'c1'}/>
      <ResizeClip key={'c2'}/> */}
      {/* <ResizeClip/> */}
    </div>
  );
};
export default App;
