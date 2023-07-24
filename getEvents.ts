import { createFolder, currDept, writeToJsonFile } from "./getData"
import { Page } from "puppeteer"
import { meetingTime, createEmptyMeetingTime, parseMeetingDay, meetingTimeArr } from "./getMeetings"
import { addStaff, createStaffID, staffObj } from "./getStaff";
import { createCourseID, createEmptyCourse, populateCourse, courseObj } from "./getCourse";

export interface Event {
    id: string|null;
    courseId: string|null;
    section: string|null;
    term: string|null;
    type: string|null;
    startDate: string|null;
    endDate: string|null;
    days: meetingTime[];
    staffId: string|null;
    physicality: string|null;
    registrationAdditions: (string|null)[];
}


export let EventsArr:Event[] = []

export interface classInformation {
    status: string;
    CRN: string;
    subject: string;
    section: string;
    title: string; 
    credits: string;
    schedule: string;
    ristricts: string;
    prereqs: string;
    instructor: string;
    
}

function createEmptyClass(){
    let classInfo: classInformation = {
        status: "",
        CRN: "",
        subject: "",
        section: "",
        title: "",
        credits: "",
        schedule: "",
        ristricts: "",
        prereqs: "",
        instructor: "",
        
    }
    return classInfo
    
}

function getAllSeperatorIdxs(line: string, substring: string): number[]{
    let tabIdxArr=[],i=-1;
    while((i=line.indexOf(substring,i+1)) >= 0) tabIdxArr.push(i);
    return tabIdxArr;
}

function getClassInformation(line: string): classInformation{
    const tabIdxArr = getAllSeperatorIdxs(line, "\t")
    let classInfo = createEmptyClass()
    for(let i=0; i<tabIdxArr.length-1; i++){
        Object.values(classInfo)[i] = line.substring(tabIdxArr[i]+1, tabIdxArr[i+1])
    }
    console.log(tabIdxArr)
    return classInfo   
}

export function createEmptyEvent(){
    let event: Event = {
        id: "",
        courseId: "",
        section: "",
        term: "",
        type: "",
        startDate: "",
        endDate: "",
        days: [createEmptyMeetingTime()],
        staffId: "",
        physicality: "",
        registrationAdditions: []
    }
    return event
    
}

function separeteEvents(rawData: string[]){
    let event: string[][] = []
    let line: string[] = []
    // console.log(rawData)
    for(let i=0; i<rawData.length; i++){
        let trElem = rawData[i]
        if(trElem.includes("Registration Closed")||trElem.includes("Open")){
            if(line.length > 0){
                event.push(line)
                line = []
                line.push(trElem)
                
                
            }
            else{
                line.push(trElem)
            }
            // console.log("isthis reached")
        }
        else{
            line.push(trElem)
        }
        if(i === rawData.length-1){
            event.push(line)
        }
    }
    return event
}

function populateEvent(classInfo: classInformation, event: Event){
    event.staffId = createStaffID(classInfo.instructor)
    event.courseId = createCourseID(classInfo.subject)
    event.section = classInfo.section
    event.id = createEventID(event.courseId, classInfo.section)
    event.type = classInfo.schedule

    return event
}

export type MeetingTimeEvent = [meetingTime, Event|null]

export function createEvents(rawdata: string[]|undefined){
    let eventsArr: string[][] = []
    if(rawdata ===  undefined){
        return null
    }
    eventsArr = separeteEvents(rawdata)
    eventsArr.forEach(eventData =>{
        let classInfo:classInformation = getClassInformation(eventData[0])
        let event = createEmptyEvent();
        let course = createEmptyCourse();
        course = populateCourse(course, classInfo)
        event = populateEvent(classInfo, event)
        let i = 1;

        while(true){
            if(!(eventData[i].includes("Meeting Date"))){
                break;
            }
            let emptyMeetingTime = createEmptyMeetingTime()
            if(i === 1){
                let MeetingTimeEvent = parseMeetingDay(eventData[i], emptyMeetingTime, event)
                if(MeetingTimeEvent[1] !== null){
                    event = MeetingTimeEvent[1]
                }
                emptyMeetingTime = MeetingTimeEvent[0]
            }
            else{
                let MeetingTimeEvent = parseMeetingDay(eventData[i], emptyMeetingTime)
                emptyMeetingTime = MeetingTimeEvent[0]
            }   
            event.days.push(emptyMeetingTime)
            i++;
        }
        if(eventData[i].includes("Also Register in")){
            event.registrationAdditions.push(getAdditions(eventData[i]))
            event.physicality = getPhysicality(eventData[i+1])
        
        }
        else{
            event.physicality = getPhysicality(eventData[i])
        }
        EventsArr.push(event)
        courseObj.push(course)
        addStaff(classInfo.instructor)
    })
    
    writeToJsonFile(EventsArr, getJsonName("ACCT"))
    writeToJsonFile(courseObj, getJsonName("ACCT"))
    writeToJsonFile(staffObj, getJsonName("ACCT"))
    return eventsArr

    
}

function getJsonName(deptName:string|null){
    return `${deptName}.json`
}

function writeEventFile(EventsArr: Event[], deptName:string, term: string){
    let dirPathname = `data/events/${term}`
    createFolder(dirPathname)
    let fileName = getJsonName(deptName)
    let filePathname = `data/events/${term}/${fileName}`
    writeToJsonFile(EventsArr, filePathname)

}

export function getPhysicality(line: string|null){
    if(line !== null){
        if(line.includes("IN-PERSON")){
            return "IN-PERSON"
        }
        else{
            return "ONLINE"
        }
    }
    return null
}

export function getAdditions(line: string|null){
    if(line!==null){
        const lineArr = line.split(":")
        return lineArr[1]
    }
    return null
    
}

export function createEventID(courseID:string|null, section:string|null){
    return `${courseID}-${section}`
}


