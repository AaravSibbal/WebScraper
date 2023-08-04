import { writeToJsonFile } from "./getData";
import { Page } from "puppeteer";

interface department {
  id: string | null;
  name: string | null;
}

let deptObj: department[] = [];
let deptMap = new Map<string, string>();

function addDept(tempObj: department) {
  if (tempObj.id === null) {
    return false;
  }
  if (tempObj.name === null) {
    return false;
  }
  if (deptMap.has(tempObj.id)) {
    return false;
  }
  deptMap.set(tempObj.id, tempObj.name);
  deptObj.push(tempObj);
  return true;
}

export function getDeptID(str: string | null) {
  if (str !== null) {
    const arr = str.split(" ");
    return arr[0];
  }
  return null;
}

export function getDeptIDForDepts(str: string | null) {
  if (str != null) {
    const arr = str.split("(");
    str = arr[arr.length - 1];
    str = str.substring(0, str.length - 1);
    return str;
  }
  return null;
}

export function getDeptName(str: string | null) {
  if (str != null) {
    const arr = str.split("(");
    str = arr[0];
    return str;
  }
  return null;
}

// this only works in the context of the page
// and the implementation that is in the codebase is using is exactly for
export async function getDeptLen(page: Page) {
  const length = page.$eval("#subj_id", (elements: any) => {
    return elements.childElementCount;
  });
  return length;
}

export async function getDepartments(page: Page) {
  let length = await getDeptLen(page);
  console.log("" + length);
  for (let i = 2; i < length + 1; i++) {
    let [el] = await page.$x(`//*[@id="subj_id"]/option[${i}]`);
    let txt = await el.getProperty("textContent");
    let rawTxt: string | null = await txt.jsonValue();
    let tempObj: department = { id: "", name: "" };
    tempObj.id = getDeptIDForDepts(rawTxt);
    tempObj.name = getDeptName(rawTxt);
    addDept(tempObj);
  }
}

// TODO: add the writedepttofile after the loops

export function writeDeptToFile() {
  writeToJsonFile(deptObj, "data/dept.json");
}
