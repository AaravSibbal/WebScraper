import { writeFile } from "fs/promises"
import { Page } from "puppeteer"
import { getDepartments, getDeptLen, deptObj } from "./getDept"
import { createEmptyMeetingTime, meetingTime } from "./getMeetings"
import { Event, createEmptyEvent, createEventID, eventsArr, getAdditions, getPhysicality, createEvents } from "./getEvents"
import { getTerms } from "./getTerms"
import { createStaffID } from "./getStaff"
import { getCourseCode, createCourseID, courseObj, Course, createEmptyCourse } from "./getCourse"
import fs from 'fs'
import path from 'path'

const puppeteer = require("puppeteer")
let currDept:string = "ACCT"
let currTerm:string = "summer-2023"

function createFolder(pathname: string){
    // the recursive needs to be 
    fs.mkdir(path.join(__dirname, pathname),
    { recursive: true }, (err) => {
        if (err) {
            return console.error(err);
        }
        console.log('Directory created successfully!');
  });
}

    


export async function writeToJsonFile(jsonObj:object, fileName:string){
    const jsonString = JSON.stringify(jsonObj)
    await writeFile(fileName, jsonString)
}

// Promise<HTMLTableRowElement[][] | undefined>

async function getPageArr(page: Page) {
    let data = await page.evaluate(() => {
        //get the Tbody
        let tbody = document.querySelector('body > section > section > form > table > tbody > tr:nth-child(4) > td > div > table > tbody')
        if(tbody === null){return} //making sure it is not null
        // getting the list of all the tr elems in Object from 
        let trList = tbody.getElementsByTagName("tr") 
        let trArr = Object.values(trList) // getting the actual value in array
        let data: string[] = []
        
        
        trArr.forEach(elem =>{
            data.push(elem.innerText)
            
        })
        return data
    });
    
    let listOfEvents = createEvents(data)
    return listOfEvents
    
}


function cleanData(arr:(string|null)[]){
    let tempArr:(string|null)[] = []
    for(let i=0; i<arr.length; i++){
        var regExp = /[a-zA-Z]/g;
        var testString = arr[i];
        if(testString !== null){
            if(regExp.test(testString)){
                tempArr.push(arr[i])
                /* do something if letters are found in your string */
            } else {
            /* do something if letters are not found in your string */
            }
        }
    }
    console.log(tempArr)
    return tempArr
}




function printObj(obj:any){
    console.log(JSON.stringify(obj))
}


async function getPageData(page: Page, currDept:string, currTerm: string) {
    // await getPageArr(page)
    let listOfEvents = await getPageArr(page)
    // console.log(listOfEvents)
    // listOfEvents?.forEach(event => {
    //     createEvent(event)
        
    // })
    // let arr:(string | null)[]|null = await getPageArr(page)
    /**
    if(arr!==null){
        
        
        arr = cleanData(arr)//removes all the whitespce elems
        
        for(let i=0; i<arr.length; i++){
            let meetingTimeObj: meetingTime = createEmptyMeetingTime()
            let event: Event = createEmptyEvent()
            let course: Course = createEmptyCourse()
            
            if(arr[i] === null){
                break;
            }
            
            if(arr[i] == 'Registration Closed' || arr[i] == "Open"){
                i++ // ignore the restration
                event.courseId = createCourseID(arr[i])
                course.id = event.courseId
                course.code = getCourseCode(arr[i])
                course.departmentId = currDept
                event.term = currTerm
                i++
                event.section = arr[i]
                event.id = createEventID(event.courseId, event.section)
                i++;
                course.name = arr[i]
                i++
                event.registrationAdditions.push(arr[i])
                i++;
                i++;
                i++;
                let staffName = arr[i]
                event.staffId = createStaffID(staffName)
                i++;
                let {newIndex, meetingTimeArr, updatedEvent} = getAllMeetingDays(arr, i, meetingTimeObj, event)
                i= newIndex
                event = updatedEvent
                event.days = meetingTimeArr
                if(arr[i]?.includes("Also Register in")){
                    event.registrationAdditions.push(getAdditions(arr[i]))
                    i++
                    event.physicality = getPhysicality(arr[i])
                
                }
                else{
                    event.physicality = getPhysicality(arr[i])
                }
                // printObj(event)
                console.log()
                // printObj(course)
                console.log()
                eventsArr.push(event)
                courseObj.push(course)
                
            }       
        }

    }
     */
}

async function getAllData(url: string) {
    const browser = await puppeteer.launch({headless: false});
    let page = await browser.newPage();
    await page.goto(url)

    await getTerms(page)

    //get the proceed btn
    const [proceedBtn] = await page.$x('/html/body/section/section/form/table/tbody/tr[3]/td/div/input')
    await proceedBtn.click(); //click the btn
    await page.waitForNavigation(); //because it navigates wait for the navigation
    let pagesArr = await browser.pages(); // get the new page that is created
    page = pagesArr[pagesArr.length-1]
    await getDepartments(page) // from the new page get the departments
    let length = await getDeptLen(page)
    
    // for(let i=2; i<length+1; i++){
        pagesArr = await browser.pages(); // get the new page that is created
        page = pagesArr[pagesArr.length-1]
        let [selectElem] = await page.$x(`//*[@id="subj_id"]/option[2]`)//gets accounting
        await selectElem.click() // clicks acounting
        //gets the search button
        let [search] = await page.$x('/html/body/section/section/form/table/tbody/tr[5]/td/input[1]')
        await search.click()//clicks the search button
        await page.waitForNavigation();//waiting for navingation to get to the page
        pagesArr = await browser.pages() // gets the all the pages
        console.log(pagesArr[pagesArr.length-1].url() )//the most recent opened page
        page = pagesArr[pagesArr.length-1]   
        
        await getPageData(page, currDept, currTerm)
        // await page.goBack();


        //await page.waitForNavigation()
        // console.log(deptObj[2].name)
    
    // just for visual purposes
    setTimeout(()=>{
        browser.close()
    }, 3000)    
    
}

const url = 'https://central.carleton.ca/prod/bwysched.p_select_term?wsea_code=EXT'
getAllData(url)

