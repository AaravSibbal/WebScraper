export let courseObj:Course[] = []

export interface Course {
    id: string|null;
    name: string|null;
    code: string|null;
    departmentId: string|null;
}


export function createEmptyCourse(): Course{
    let course: Course ={
        id: "",
        name: "",
        code: "",
        departmentId: ""
    }
    return course
}



export function createCourseID(str:string|null){
    if(str !== null){
        let arr = str.split(" ");
        return arr[0]+arr[1]
    }
    return null
    
}

export function getCourseCode(str: string|null){
    if(str !== null){
        const arr =str.split(" ")
        return arr[1]
    }
    return null
}


