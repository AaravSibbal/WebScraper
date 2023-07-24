import { classInformation } from "./getEvents";
import { getDeptID } from "./getDept";

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

export function populateCourse(course: Course, classInfo: classInformation){
    course.name = classInfo.title
    course.id = createCourseID(classInfo.subject)
    course.code = getCourseCode(classInfo.subject)
    course.departmentId = getDeptID(classInfo.subject)
    return course
}

export function getCourseCode(str: string|null){
    if(str !== null){
        const arr =str.split(" ")
        return arr[1]
    }
    return null
}


