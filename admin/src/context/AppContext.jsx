import { createContext } from "react";

export const AppContext= createContext()

const AppContextProvider = (props) => {
  // calculate the age
  const calculateAge = (dob) => {
    const today = new Date();

    const birthDate = new Date(dob);

    let age = today.getFullYear() - birthDate.getFullYear();

    return age;
  };

  // date formatted

  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    //  we get like this slotDate = 30_10_2025

    const dateArray = slotDate.split("_");

    return dateArray[0] + " " + months[dateArray[1]] + " " + dateArray[2];
  };

  const value = {
    calculateAge,
    slotDateFormat
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

export default AppContextProvider