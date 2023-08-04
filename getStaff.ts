import { createFolder, writeToJsonFile } from "./getData";
import { getJsonName } from "./getEvents";

/**
 * basically my idea is do something like
 * map<deptName: string, staffObj: staff[]>
 *
 * func getStaffObj
 * let staffObj: staff[] = []
 * if(staffObjArr.has(deptName)){
 *  staffObj = staffObjArr.get(deptName)
 *  return staffObj
 * }
 * return staffObj
 *
 * let staffObj = getStaffObj()
 * this way staff can be added without any consequeses I think
 * this should work over all I think
 */

let staffObjMap = new Map<string, StaffMapAndObj>(); //this name is shit
export let staffObj: staff[] = [];
let staffMap = new Map<string, string>();

type StaffMapAndObj = {
  staffObj: staff[];
  staffMap: Map<string, string>;
};

interface staff {
  name: string;
  id: string;
}

export function emptyStaffMapObj() {
  staffObjMap = new Map<string, StaffMapAndObj>();
}

export function updateStaff(deptName: string | null) {
  if (deptName === null) {
    return;
  }
  let staffArr: staff[] = [];
  let tempMap: Map<string, string>;
  let temp: StaffMapAndObj;
  if (!staffObjMap.has(deptName)) {
    console.log("we don't have dept name " + deptName);

    emptyStaff();
    console.log(staffObj, staffMap);
    temp = {
      staffObj: staffArr,
      staffMap: new Map<string, string>(),
    };

    staffObjMap.set(deptName, temp);
    return;
  }
  console.log("we have dept " + deptName);
    // the exclamation is required so that the get method doesn't return undefined

    // update the values
    staffObj = staffObjMap.get(deptName)!.staffObj;

    staffMap = staffObjMap.get(deptName)!.staffMap;
    return;
}

export function addStaffObj(deptName: string | null, staffObj: staff[]) {
  if (deptName === null) {
    return;
  }
  let temp: StaffMapAndObj = {
    staffObj,
    staffMap,
  };
  staffObjMap.set(deptName, temp);
}

export function createStaffID(name: string | null) {
  if (name === null) {
    return null;
  }
  name = name.toLowerCase();
  let arr: string[] = name.split(" ");
  let temp = "";
  for (let i = 0; i < arr.length - 1; i++) {
    temp += arr[i] + "-";
  }
  temp += arr[arr.length - 1];
  return temp;
}

export function addStaff(name: string | null) {
  if (name === null) {
    return;
  }
  if (staffMap.has(name)) {
    return;
  }
  let id = createStaffID(name);
  if (id === null) {
    return;
  }
  staffMap.set(name, id);
  let staff: staff = {
    name: name,
    id: id,
  };
  staffObj.push(staff);
}

export function emptyStaff() {
  staffObj = [];
  staffMap = new Map<string, string>();
}

export function writeStaffToFile(term: string | null, deptName: string | null) {
  let fileName = getJsonName(deptName);
  let filePathname = `data/staff/${fileName}`;
  writeToJsonFile(staffObj, filePathname);
}
