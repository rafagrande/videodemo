import React, { useRef, useEffect, useState} from 'react';
import '../styles/timeline.css'
import Track from './Track'
import onDropChecking from '../utils'
const FRAMERATE = 8 // 

const DragVideoToFrames = () => {
  const canvasRef = useRef(null);
  const timelineRef = useRef(null);
  const clipdata = useRef('')
  const [dropFrames,setDropFrames] = useState([])  
  const [data,setData] = useState([])
  
  const moveClip = (layer,index,frames,target)=>{
    // const res = onDropChecking(target)
    // 不管其他先把原来的splice了
    const v = [...clipdata.current]
    const abandon = v[layer]['frames'].splice(index,1)
    clipdata.current = v
    
    const res = onDropChecking(target)
    const [type,indexer] = res
    if(type==='B'){
        const v = clipdata.current
        const tmp = [...v]
        tmp.unshift({frames:abandon})
        clipdata.current = tmp
        setData(tmp) 
        return
    }

    if(type==='L'){
        const v = [...clipdata.current]
        const _frames = v[indexer]['frames']
        v[indexer]['frames'] = [..._frames,...abandon]
        clipdata.current = v
        // v[indexer]['frames'].push(frames)
        // clipdata.current = v
        setData(v) 
        return
    }

  }  

  const addClip = (frames,target)=>{
    if(!clipdata.current || (!clipdata.current.length)){
        const tmp = [{frames:[frames]}]
        clipdata.current = tmp
        setData(tmp)
        return  
    }
    const res = onDropChecking(target)
    if(res){
        const [type,indexer] = res
        if(type==='B'){
            const v = clipdata.current
            const tmp = [...v]
            tmp.unshift({frames:[frames]})
            clipdata.current = tmp
            setData(tmp) 
            return
        }
        if(type==='L'){
            const v = [...clipdata.current]
            const _frames = v[indexer]['frames']
            v[indexer]['frames'] = [..._frames,frames]
            clipdata.current = v
            // v[indexer]['frames'].push(frames)
            // clipdata.current = v
            setData(v) 
            return
        }
        if(type==='C'){
            return
        }
    }
}
const getFrame = (event,frameRate=24) => {
    // rest 一下帧队列

    // setDropFrames([])
    
    const file = event.dataTransfer.files[0];
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);

    // 
    bufferVideoFrames(video, FRAMERATE).then((res) => {
        // setDropFrames(res)
        addClip(res,event.target)
    }).catch((err) => {
        console.log(err)
    })
}

// 帧率为每秒多少frames，所以就能算出一帧的时常，也就是取下一帧的起点，暂时按常见的24帧处理
const bufferVideoFrames = async (videoNode, frameTotal = 24) => {
    const canvas = canvasRef.current;
    canvas.style.position = 'fixed';
    canvas.style.left="-200%"
    const context = canvas.getContext('2d');
    //const timelines = timelineRef.current;
    return new Promise(async (resolve) => {
        let seeked;
        // 跳到下一帧需要等这帧渲染出来
        videoNode.addEventListener('seeked', async function () {
            if (seeked) seeked();
        });
        
        videoNode.addEventListener('loadeddata', async function () {
            let [w, h] = [videoNode.videoWidth, videoNode.videoHeight]
            // const rate = (w*h
            const _w = Math.floor((w*25)/h);
            const _h = 25
            canvas.width = _w;
            canvas.height = _h;

            let frames = [];
            let interval = 1 / frameTotal;
            let currentTime = 0;
            let duration = videoNode.duration;

            while (currentTime < duration) {
                videoNode.currentTime = currentTime;
                await new Promise(r => seeked = r);
        
                context.drawImage(videoNode, 0, 0,_w,_h);
                let base64ImageData = canvas.toDataURL();
                frames.push(base64ImageData);
                currentTime += interval;
            }
            resolve(frames);
        })
    });
}  


  useEffect(() => {
    
    const timelines = timelineRef.current;
    
    const handleDrop = (event) => {
        event.preventDefault()
        if(event.dataTransfer.files[0] && ((event.dataTransfer.files[0])?.type.includes('video'))){
            getFrame(event);
            return
        }
        const datajson = event.dataTransfer.getData('application/json') 
        if(datajson){
            const jsondata=JSON.parse(datajson);
            const {layer,indexer,frames} = jsondata;
            if(frames.length){  
                moveClip(layer,indexer,frames,event.target)   
            }
        }
    };

    const handleDragOver = (event) => {
      event.preventDefault();
    };

    timelines.addEventListener('drop', handleDrop);
    timelines.addEventListener('dragover', handleDragOver);

    return () => {
      timelines.removeEventListener('drop', handleDrop);
      timelines.removeEventListener('dragover', handleDragOver);
    };
  }, []);

  return (
    <div ref={timelineRef} data-belong='board' style={{width:"100%",height:'100vh',background:"#656565"}}>
        <canvas ref={canvasRef} />
        {/* <video src=''></video> */}
        <div 
            data-belong='board'
            style={{
            width:'100%',
            background:'rgba(0,0,0,0.6)',
            position:'fixed',height:'300px',overflowY:'auto',left:'0',bottom:'0'}}>
            
            {
                data.map((item,index)=>{
                    return(
                        <Track key={`time_track_layer_${index}`} layer={index} dataSource={item}></Track>
                    )   
                })
            }
            
        </div>
    </div>
  )
};

export default DragVideoToFrames;