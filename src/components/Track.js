// layer 为tracker当前的层，数据结构中通过layer来标记当前层,dataSources为当前层所有的视频
import React, { useRef, useEffect, useState} from 'react';
import Clip from './Clip'
import ResizeClip from './ResizeCip';
import '../styles/timeline.css'
export default function Track({layer,dataSource}){
    const {frames} = dataSource
    if(!frames?.length){
        // alert(0)
        return null
    }
    return (
        <div data-belong={`L_${layer}`} className='tracks' key={`layer_${layer}`}>
            {
                frames?.length>0 && frames.map((item,index)=>{

                    return(
                        <ResizeClip frames={item} layer={layer} indexer={index}></ResizeClip>
                        // <div key={`${layer}_${index}_clip`} data-belong={`C_${layer}_${index}`} className='frames' style={{maxWidth:'600px',overflow:'hidden',borderRadius:'6px',display:'flex',margin:'0px',padding:'0'}}>
                        //     {
                        //         item?.length>0 && item.map((_item,_index)=>{
                        //             return (
                        //                 <img data-belong={`L_${layer}`} key={`${layer}_${index}_clip_${_index}_pic`}  src={_item}></img>
                        //             )
                        //         })
                        //     }
                        // </div>
                    )
                })
            }
        </div>
    )
}