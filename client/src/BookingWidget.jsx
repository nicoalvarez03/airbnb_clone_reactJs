import React, { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  const {user} = useContext(UserContext);

  useEffect(() => {
    if(user) {
      setName(user.name);
    }
  }, [user])

  let numberOfNigths = 0;
  if (checkIn && checkOut) {
    numberOfNigths = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  async function bookThisPlace() {
    const response = await axios.post('/bookings', {
      checkIn, 
      checkOut, 
      numberOfGuests, 
      name, 
      phone, 
      place:place._id,
      price:numberOfNigths * place.price,
    });
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />; // Se redirecciona a la página de reservas
  }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Precio: ${place.price} / por noche
      </div>
      <div className="border border-gray-200 rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Check-in: </label>
            <input
              type="date"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div className="py-3 px-4 border-l border-gray-200">
            <label>Check-out: </label>
            <input
              type="date"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t border-gray-200">
          <label>Numero de huéspedes: </label>
          <input
            type="number"
            value={numberOfGuests}
            onChange={(ev) => setNumberOfGuests(ev.target.value)}
          />
        </div>
        {numberOfNigths > 0 && (
          <div className="py-3 px-4 border-t border-gray-200">
            <label>Nombre completo: </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
            <label>Número de teléfono: </label>
            <input
              type="tel"
              placeholder="123456789"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
            />
          </div>
        )}
      </div>

      <button className="button-primary mt-4"
        onClick={bookThisPlace}>
        Reserva este lugar por:
        {numberOfNigths > 0 && (
          <>
            <span className="font-bold"> ${numberOfNigths * place.price}</span>
          </>
        )}
      </button>
    </div>
  );
}
