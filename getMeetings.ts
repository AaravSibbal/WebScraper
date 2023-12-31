import { Event } from "./getEvents";
import { MeetingTimeEvent } from "./getEvents";

export interface meetingTime {
  day: string[] | null;
  startTime: string | null;
  endTime: string | null;
  building: string | null;
  room: string | null;
}
const months: months = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

interface months {
  [key: string]: string;
}

export let meetingTimeArr: meetingTime[] = [];

export function createEmptyMeetingTime() {
  let meetingTime: meetingTime = {
    day: [],
    startTime: "",
    endTime: "",
    building: "",
    room: "",
  };
  return meetingTime;
}

function parseDays(days: string) {
  /**
   * this work for when the array has one space: [""]
   * no space: [""]
   * and actually have the days ["mon", "tue"]
   */
  days = days.trim();
  let daysArr = days.split(" ");
  return daysArr;
}

export function parseMeetingDay(
  line: string,
  meetingTimeObj: meetingTime,
  event: Event | null = null
): MeetingTimeEvent {
  const idxOfDate = line.indexOf(":");
  const idxOfTo = line.indexOf("to");

  const idxOfDays = line.indexOf("Days");
  const idxOfTime = line.indexOf("Time");
  const idxOfBuilding = line.indexOf("Building");
  const idxOfRoom = line.indexOf("Room");
  let startDate = line.substring(idxOfDate + 1, idxOfTo - 1);
  let endDate = line.substring(idxOfTo + 2, idxOfDays - 1);

  startDate = parseDate(startDate);
  endDate = parseDate(endDate);

  let days = line.substring(idxOfDays + 5, idxOfTime - 1);
  let daysArr = parseDays(days);

  let time = line.substring(idxOfTime + 5, idxOfBuilding - 1);
  let timeArr;
  let startTime = null;
  let endTime = null;
  if (time.includes("-")) {
    timeArr = time.split("-");
    startTime = timeArr[0].trim();
    endTime = timeArr[1].trim();
  }

  let building: string | null = line.substring(
    idxOfBuilding + 9,
    idxOfRoom - 1
  );
  if (!(building.length > 2)) {
    building = null;
  }
  let room: string | null = line.substring(idxOfRoom + 5, line.length);
  if (!(room.length > 2)) {
    room = null;
  }
  meetingTimeObj.building = building;
  meetingTimeObj.day = daysArr;
  meetingTimeObj.endTime = endTime;
  meetingTimeObj.room = room;
  meetingTimeObj.startTime = startTime;
  let MeetingTimeEvent: MeetingTimeEvent = [meetingTimeObj, event];

  if (event === null) {
    return MeetingTimeEvent;
  }
  event.startDate = startDate;
  event.endDate = endDate;
  return MeetingTimeEvent;
}

function parseDate(date: string): string {
  date = date.trim();
  const dateArr = date.split(" ");
  const monthNum = months[dateArr[0]];
  let day = dateArr[1]; //removing the comma
  day = day.substring(0, 2);
  const year = dateArr[2].trim();

  date = `${year}-${monthNum}-${day}`;
  return date;
}
