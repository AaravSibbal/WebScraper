import { writeFile } from "fs/promises";
import { Page } from "puppeteer";
import { getDepartments, getDeptLen, getDeptIDForDepts } from "./getDept";
import { createEvents, emptyEvent } from "./getEvents";
import { getTerms } from "./getTerms";
import { emptyStaff } from "./getStaff";
import { emptyCourse } from "./getCourse";
import fs from "fs";
import path from "path";

const puppeteer = require("puppeteer");
export let currDept: string | null = "ACCT";
export let currTerm: string | null = "summer-2023";

export function createFolder(pathname: string) {
  // the recursive needs to be
  let dir = path.join(__dirname, pathname);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log("the dir is removed");
  }
  console.log("Path of Dir" + dir);
  fs.mkdirSync(dir, { recursive: true });

  console.log("the dir is created successfully");
}

export async function writeToJsonFile(jsonObj: object, fileName: string) {
  const jsonString = JSON.stringify(jsonObj);
  await writeFile(fileName, jsonString, { flag: "w" });
}

async function getPageArr(
  page: Page,
  currDept: string | null,
  currTerm: string | null
) {
  let data = await page.evaluate(() => {
    //get the Tbody
    let tbody = document.querySelector(
      "body > section > section > form > table > tbody > tr:nth-child(4) > td > div > table > tbody"
    );
    if (tbody === null) {
      return;
    } //making sure it is not null
    // getting the list of all the tr elems in Object from
    let trList = tbody.getElementsByTagName("tr");
    let trArr = Object.values(trList); // getting the actual value in array
    let data: string[] = [];

    trArr.forEach((elem) => {
      data.push(elem.innerText);
    });
    return data;
  });

  let listOfEvents = createEvents(data, currDept, currTerm);
  return listOfEvents;
}

async function getPageData(
  page: Page,
  currDept: string | null,
  currTerm: string | null
) {
  // await getPageArr(page)
  let listOfEvents = await getPageArr(page, currDept, currTerm);
}
function emptyAllObjects() {
  emptyEvent();
  emptyStaff();
  emptyCourse();
}

async function getAllData(url: string) {
  const browser = await puppeteer.launch({ headless: false });
  let page = await browser.newPage();
  await page.goto(url);

  await getTerms(page);

  //get the proceed btn
  const [proceedBtn] = await page.$x(
    "/html/body/section/section/form/table/tbody/tr[3]/td/div/input"
  );
  await proceedBtn.click(); //click the btn
  await page.waitForNavigation(); //because it navigates wait for the navigation
  let pagesArr = await browser.pages(); // get the new page that is created
  page = pagesArr[pagesArr.length - 1];
  await getDepartments(page); // from the new page get the departments
  let length = await getDeptLen(page);
  
  for (let i = 2; i < length + 1; i++) {
    pagesArr = await browser.pages(); // get the new page that is created
    page = pagesArr[pagesArr.length - 1];

    emptyAllObjects();
    console.log(i);
    let [selectElem] = await page.$x(`//*[@id="subj_id"]/option[${i}]`); //gets accounting
    let txt = await selectElem.getProperty("textContent");
    let rawTxt: string | null = await txt.jsonValue();
    currDept = getDeptIDForDepts(rawTxt);

    await selectElem.click(); // clicks acounting
    //gets the search button
    let [search] = await page.$x(
      "/html/body/section/section/form/table/tbody/tr[5]/td/input[1]"
    );
    await search.click(); //clicks the search button
    await page.waitForNavigation(); //waiting for navingation to get to the page
    pagesArr = await browser.pages(); // gets the all the pages
    console.log(pagesArr[pagesArr.length - 1].url()); //the most recent opened page
    page = pagesArr[pagesArr.length - 1];

    await getPageData(page, currDept, currTerm);
    await page.goBack();

    //await page.waitForNavigation()
    // console.log(deptObj[2].name)
  }
  // just for visual purposes
  setTimeout(() => {
    browser.close();
  }, 3000);
}

const url =
  "https://central.carleton.ca/prod/bwysched.p_select_term?wsea_code=EXT";
getAllData(url);
