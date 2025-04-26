import { fetchDataAuth } from "../hooks/services/services";

import { fetchData } from "../hooks/services/services";

export const getTime = (appointmentDate) => {
  const date = new Date(appointmentDate);
  let hours = date?.getHours();
  let minutes = date?.getMinutes();

  // Pad minutes with leading zero if less than 10
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // Format time as HH:mm
  const timeString = `${hours}:${minutes}`;
  return timeString;
};

export const getFormattedDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatTime = (date) => {
  let hours = new Date(date).getHours();
  const minutes = new Date().getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12; // Convert 24-hour time to 12-hour time
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${formattedMinutes}${ampm}`;
};

export const getAppointmentFormattedDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export const getAppointmentFormatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
};

export const getLanguageData = async (navigate) => {
  try {
    const response = await fetchDataAuth("clinics/languages", navigate);
    if (!response.ok) {
      throw new Error("Failed to fetch data from the server.");
    }
    const getData = await response.json();
    const formattedData = getData?.map((item) => ({
      name: item.title,
      id: item.id,
    }));
    return formattedData;
  } catch (error) {
    console.log(error.message);
  }
};


// --Hemraj
export const getAppointmentList = async (startDate, endDate, role, navigate) => {
  const response = await fetchData(
    `clinics/calendar-appointments/?start_date=${startDate}&end_date=${endDate}&role=${role}`,
    navigate
  );
  if (!response.ok) {
    throw new Error("Failed to fetch data from the server.");
  }
  const list = await response.json();
  return list;
};

export const getProfileClass = (status) => {
  const classMap = {
    Verified: "greenProfile",
    Pending: "yellowProfile",
    Rejected: "redProfile"
  };
  return classMap[status] || "";
};


