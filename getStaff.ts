let staffObj:staff[] = []
let staffMap = new Map<string, string>();

interface staff {
    name: string,
    id: string
}


export function createStaffID(name: string|null){

    if(name === null){
        return null
    }
    name = name.toLowerCase();
    let arr:string[] = name.split(" ");
    let temp = ""
    for(let i=0; i<arr.length-1; i++){
        temp += arr[i] + "-"
    }   
    temp += arr[arr.length-1]
    return temp;    

}

function addStaff(name: string){
    if(name === null){
        return
    }
    if(staffMap.has(name)){
        return;
    }
    let key = createStaffID(name)
    if(key === null){
        return;
    }
    staffMap.set(name, key)
}
