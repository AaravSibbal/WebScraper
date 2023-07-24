export let staffObj:staff[] = []
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

export function addStaff(name: string|null){
    if(name === null){
        return
    }
    if(staffMap.has(name)){
        return;
    }
    let id = createStaffID(name)
    if(id === null){
        return;
    }
    staffMap.set(name, id)
    let staff:staff = {
        name: name,
        id: id
    }
    staffObj.push(staff)
}
