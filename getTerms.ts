import { Page } from "puppeteer";
import { writeToJsonFile } from "./getData";
let termsObj:terms[] = []


interface terms {
    id: string|null,
    name: string|null
}


function createTermID(str: string|null){
    if(str != null){
        let arr = str.split(" ");
        str = arr[0].toLowerCase() + "-" + arr[1]
        return str
    }
    return null
}

function getTermName(str: string|null){
    if(str !== null){
        let arr = str.split(" ");
        str = arr[0] + " " + arr[1]
        return str
    }
    return null
    
}

export async function getTerms(page: Page){

    // opens the page and goes to the carleton central website
    
    for(let i=1; i<4; i++){

        let [el] = await page.$x(`//*[@id="term_code"]/option[${i}]`)
        let txt = await el.getProperty("textContent")
        let rawTxt:string|null = await txt.jsonValue()

        let tempObj:terms = {id: "", name: ""}
        tempObj.id = createTermID(rawTxt)
        tempObj.name = getTermName(rawTxt)
        termsObj.push(tempObj)
        
 
    }
    // get the 
    writeToJsonFile(termsObj, "data/terms.json")
    
}
