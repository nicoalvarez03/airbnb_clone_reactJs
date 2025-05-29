import { useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import { Link } from "react-router-dom";
import BookingDates from "../BookingDates";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  
  useEffect(() => {
    axios.get(`${import.meta.env.BACKEND_URL}/bookings`).then((response) => {
      setBookings(response.data);
    });
  }, []);

  return (
    <div>
      <AccountNav />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
        {bookings?.length > 0 &&
          bookings.map((booking) => (
            <Link
              to={`/account/bookings/${booking._id}`}
              key={booking._id}
              className="flex justify-center px-5"
            >
              <div className="bg-gray-200 lg:max-h-[180px] rounded-2xl overflow-hidden mt-4 flex flex-col items-center lg:flex-row w-300 gap-4">              
                <div className="w-full object-cover lg:w-48">
                  <PlaceImg place={booking.place} />
                </div>
                <div className="flex flex-col items-center md:block py-3 pr-3 grow">
                  <h2 className="text-xl font-bold text-center lg:text-start">{booking.place.title}</h2>
                  <div className="items-center">

                    <BookingDates booking={booking} className="mb-2 mt-4 text-gray-500" />

                    <div className="flex gap-1 items-center justify-center lg:justify-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                        />
                      </svg>
                      <span className="text-lg font-semibold">
                        Precio total: €{booking.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
