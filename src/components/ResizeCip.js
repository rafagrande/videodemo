import React, { useEffect,useRef, useState } from "react"
import '../styles/timeline.css'
export default function ResizeClip({frames,layer,indexer}){
    const [canDrag,setCanDrag]= useState(true)
    const left_handle = useRef('')
    const right_handle = useRef('')
    const clip_handle = useRef('')
    const clip_track = useRef('')
    
    const clipwidth = useRef('')

    const flag_reszie = useRef('')
    const startX = useRef('')
    const orimargin = useRef('')
    const initial_width = useRef('')
    
    const handleDragStart = (event) => {
        const data = {
            layer,
            indexer,
            frames:[...frames]
        }
        event.dataTransfer.setData('application/json',JSON.stringify(data))
    };
    // 更新margin开始的地方
    const mdhandler = (event)=>{
        setCanDrag(false)
        flag_reszie.current = 'right'
        startX.current = event.clientX
        const clipdom = clip_handle.current
        const {width,height} = clipdom.getBoundingClientRect()
        clipwidth.current = width
        // clipwidth.current = 
    }

    const mdhandler_left = (event)=>{
        setCanDrag(false)
        // console.log(clip_handle.listenners)
        flag_reszie.current = 'left'
        // alert("11111")
        startX.current = event.clientX
        const clipdom = clip_handle.current
        const {width,height} = clipdom.getBoundingClientRect()
        clipwidth.current = width
        const computedStyle = window.getComputedStyle(clipdom)?.getPropertyValue('margin-left') 
        orimargin.current = computedStyle?parseFloat(computedStyle):0
        //console.log(orimargin.current)
        // clipwidth.current = 
    }



    const movehandler = (event)=>{
        if(!flag_reszie.current)return
        
        const clipdom = clip_handle.current
        const clicktrack_dom = clip_track.current
        const start = startX.current
        const end = event.clientX
        const move_distance = end - start
        
        const orignWidth = clipwidth.current
        const {width:maxWidth,height} = clicktrack_dom.getBoundingClientRect()
        const minWidth = 0
        const ori_margin = orimargin.current

        if(flag_reszie.current==='right'){
            // 右侧向左移动，宽度增加
            if(move_distance<0){
                // 拖到原点
                if((orignWidth-Math.abs(move_distance))<=0){
                    // stopResize()
                    return
                }

                clipdom.style.width=(orignWidth-Math.abs(move_distance))+'px'
            }else{
                if((orignWidth+Math.abs(move_distance))>=maxWidth){
                    // stopResize()
                    clipdom.style.width=400+'px'
                    return
                }
                clipdom.style.width = (orignWidth+Math.abs(move_distance))+'px'
            }
        }else{
            // 如果是左侧手柄

            if(move_distance>0){
                // 向左移动，如果向左移动到
                if(Math.abs(move_distance)>=orignWidth){
                    // stopResize()
                    return
                }
                clipdom.style.width=(orignWidth-Math.abs(move_distance))+'px'
                // const {left} = clipdom.getBoundingClientRect()
                clipdom.style.marginLeft=ori_margin+Math.abs(move_distance)+'px'
            }else{
                if((ori_margin-Math.abs(move_distance))<=0){
                    // stopResize()
                    clipdom.style.marginLeft = 0
                    clipdom.style.width=400+'px'
                    return
                }
                clipdom.style.width = (orignWidth+Math.abs(move_distance))+'px'
                clipdom.style.marginLeft=ori_margin-Math.abs(move_distance)+'px'
            }
            // clipdom.style.marginLeft=(Math.abs(move_distance))+'px'
        }

        
        
        
    }
    const stopResize = (event)=>{
        flag_reszie.current = false    
        const clipdom = clip_handle.current
        const cliptrack = clip_track.current
        //console.log(clip_track,clipdom);
        if(clipdom){
            const {width,height} = clipdom.getBoundingClientRect()
            clipwidth.current = width
            //cliptrack.style.width = width + 'px'
        }
        setCanDrag(true)
    }

    const clipSelected = ()=>{
        const clipdom = clip_handle.current
        //console.log(clip_handle);
        // clipdom.classList.add('clip_selected')
    }

    useEffect(()=>{
        const lh = left_handle.current
        const rh = right_handle.current
        const clip = clip_track.current
        const frames_dom = clip_handle.current
        //const initdom = initial_width.current


        // 获取最开始的宽度和margin
        const {width,} = clip.getBoundingClientRect()
        // const {width:initwidth,} = clip.getBoundingClientRect()
        // initial_width.current = initwidth
        

        lh.addEventListener('mousedown',mdhandler_left,true)
        rh.addEventListener('mousedown',mdhandler,true)

        clip.addEventListener('mousemove',movehandler,true)
        clip.addEventListener('mousedown',clipSelected,true)
        document.addEventListener('mouseup',stopResize)

        clip.addEventListener('dragstart', handleDragStart);
        // clip.addEventListener('mouseup',stopResize)
        return ()=>{

        }
    },[])
    return (
        <div data-belong={`C_${layer}_${indexer}`} key={`${layer}_${indexer}_clip`} draggable={canDrag} ref={clip_track} className="clip_track" style={{width:'400px'}}>
                <div data-belong={`C_${layer}_${indexer}`} ref={clip_handle} className='frames_wrapper'>
                    <div data-belong={`C_${layer}_${indexer}`} draggable={false} ref={left_handle} className="f_left_handle"></div>
                        {
                                    frames.length>0 && frames.map((_item,_index)=>{
                                        return (
                                            <img data-belong={`C_${layer}_${indexer}`} draggable={false}  key={`${layer}_${indexer}_clip_${_index}_pic`}  src={_item}></img>
                                        )
                                    })
                        }
                    <div data-belong={`C_${layer}_${indexer}`} draggable={false} ref={right_handle} className="f_right_handle"></div>
                </div>
        </div>
    )
}