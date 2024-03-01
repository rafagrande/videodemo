export default function onDropChecking(target){
    // 通过data-belong 判断落点是 面板，tracker， clip
    
    


    const belong = target.getAttribute('data-belong')
    // 落点不是接收范围直接就return掉
    if(!target || !belong){
        return false
    }    
    // 1.clip如果落下点是面板，就直接添加在最上层
    if(belong==='board'){
        return ['B','']
    }
    // 2.clip如果落下点是在层上那么久直接添加在末尾,获取层号
    if(belong.includes('L_')){
        return  ['L',belong.slice(2)]
    }
    // 3.clip如果下落点是在层间分割处，获取层号，插入一个新层
    if(belong.includes('S_')){
        return  ['S',belong.slice(2)]
    }
    // 4. clip 如果下落点是在clip上，在clip后添加clip ，先切除原来的clip
    if(belong.includes('C_')){
        return  ['C',belong.slice(2)]
    }
    return false
}