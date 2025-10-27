import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets_admin/assets";

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments,completeAppointment,cancelAppointment } = useContext(DoctorContext);

  const { calculateAge, slotDateFormat } = useContext(AppContext);

  // if doctor change then function will execute

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  // create UI using the appointments array (ehich consist all the appoinments of a doctor )
  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
        {/* Header: hidden on small screens, grid on sm+ with the SAME columns as rows */}
        <div className="hidden sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-3 py-3 px-6 border-b">
          <p className="text-left">#</p>
          <p className="text-left">Patient</p>
          <p className="text-left">Payment</p>
          <p className="text-left">Age</p>
          <p className="text-left">Date &amp; Time</p>
          <p className="text-left">Fees</p>

          {/* move the Action header slightly to the right so it aligns with the icons below */}
          <div className="flex justify-end pr-5">
            <p className="text-right">Action</p>
          </div>
        </div>

        {appointments.reverse().map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-3 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
          >
            {/* Column 1: index (#) */}
            <p className="hidden sm:block text-left">{index + 1}</p>

            {/* Column 2: patient (image + name) */}
            <div className="flex items-center gap-2 min-w-0">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={item.userData.image}
                alt=""
              />
              <p className="text-xs inline border border-primary px-2 rounded-full truncate">
                {item.userData.name}
              </p>
            </div>

            {/* Column 3: payment */}
            <p className="text-left">{item.payment ? "Online" : "CASH"}</p>

            {/* Column 4: age */}
            <p className="hidden sm:block text-left">
              {calculateAge(item.userData.dob)}
            </p>

            {/* Column 5: date & time */}
            <p className="min-w-0 text-left truncate">
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>

            {/* Column 6: fees */}
            <p className="text-left">₹{item.amount}</p>
            {item.cancelled ? (
              <p className="ml-8 text-red-600 font-semibold">Cancelled</p>
            ) : item.isCompleted ? (
              <p className="ml-8 text-green-800 font-semibold">Completed</p>
            ) : (
              //   Column 7: action (icons)
              <div className="flex gap-2 justify-end items-center">
                <img
                  onClick={() => cancelAppointment(item._id)}
                  className="w-8 h-9 rounded-full cursor-pointer pr-1"
                  src={assets.cancel_icon}
                  alt="cancel"
                />
                <img
                  onClick={() => completeAppointment(item._id)}
                  className="w-8 h-9  rounded-full cursor-pointer pr-1"
                  src={assets.tick_icon}
                  alt="confirm"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointments;
