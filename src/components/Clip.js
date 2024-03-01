import React, { useRef, useEffect, useState} from 'react';
import '../styles/timeline.css'
export default function Clip({frames,layer,indexer}){
    const clipref = useRef(null);
    const leftref = useRef(null);
    const rightref = useRef(null);

    const distanceLeft = useRef('');
    const distanceRight = useRef('');

    const [disLeft,setDisLeft] = useState(0)
    const [disRight,setDisRight] = useState(0)
    const [canDrag,setCanDrag] = useState(true)
    const [resizeFlag,setResizeFlag] = useState(false)


    const handleDragStart = (event) => {
        // event.preventDefault();
        event.target.dataset.lastX = event.clientX || event.touches[0].clientX;
        event.target.dataset.lastY = event.clientY || event.touches[0].clientY;
        const data = {
            layer,
            indexer,
            frames:[...frames]
        }
        event.dataTransfer.setData('application/json',JSON.stringify(data))
    };
    
    const handleResizeLeft = (event)=>{
        // event.stopPropagation()
        const x = event.clientX || event.touches[0].clientX;
        const deltaX = x - event.target.dataset.lastX;
        const {width,height} = clipref.current.getBoundingClientRect()
        clipref.current.style.width = width-deltaX>0?(width-deltaX)+'px':0
        

    }
    const handleResizeRight = (event)=>{
        
        // event.stopPropagation()
        if(!resizeFlag)return
        const x = event.clientX || event.touches[0].clientX;
        const deltaX = x - event.target.dataset.lastX;
        const {width,height} = clipref.current.getBoundingClientRect()
        clipref.current.style.width = width+deltaX>0?(width+deltaX)+'px':0
    }

    const stopResize = ()=>{
        setResizeFlag(false);
        setCanDrag(true);
    }




    const handleDragResizeLeft = (event)=>{
        event.target.dataset.lastX = event.clientX || event.touches[0].clientX;
        setCanDrag(false)
        const lefthandle = leftref.current;
    }
    const handleDragResizeRight = (event)=>{

        event.target.dataset.lastX = event.clientX || event.touches[0].clientX;
        setCanDrag(false);
        setResizeFlag(true);
        const righthandle = rightref.current;
    }
    


    const handleDrag = (event)=>{
        const x = event.clientX || event.touches[0].clientX;
        const deltaX = x - event.target.dataset.lastX;

        const y = event.clientY || event.touches[0].clientY;
        const deltaY = y - event.target.dataset.lastY;

        if(Math.abs(deltaY)<=3){
            // 认为是横向的移动
            clipref.current.style.marginLeft=deltaX+'px'
        }

    }


    useEffect(()=>{
        const clips = clipref.current;
        const lefthandle = leftref.current;
        const righthandle = rightref.current;


        clips.addEventListener('dragstart', handleDragStart);
        

        return () => {
            clips.removeEventListener('dragstart', handleDragStart);
            
        };
    },[])
    return (
        <div ref={clipref} draggable key={`${layer}_${indexer}_clip`} data-belong={`C_${layer}_${indexer}`} className='frames' style={{maxWidth:'600px',overflow:'hidden',borderRadius:'6px',display:'flex',margin:'0px',padding:'0'}}>
            <div draggable={false} ref={leftref} className='handle_left'></div>
            {
                                frames.length>0 && frames.map((_item,_index)=>{
                                    return (
                                        <img draggable={false} data-belong={`L_${layer}`} key={`${layer}_${indexer}_clip_${_index}_pic`}  src={_item}></img>
                                    )
                                })
            }
            <div draggable={false} ref={rightref} className='handle_right'></div>
        </div>
    )
}