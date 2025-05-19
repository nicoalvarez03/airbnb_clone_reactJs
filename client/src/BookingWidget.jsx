import React, { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";


import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';


export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [cleared, setCleared] = React.useState(false);
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

  useEffect(() => {
    if(cleared){
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
    return () => {};

  }, [cleared]);

  let numberOfNigths = 0;
  if (checkIn && checkOut) {
    numberOfNigths = differenceInCalendarDays(
      checkOut.toDate(),
      checkIn.toDate()
    );
  }

  async function bookThisPlace() {
    const response = await axios.post('/bookings', {
      checkIn: checkIn.toISOString(), 
      checkOut: checkOut.toISOString(), 
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
            {/* Date Picker Component */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <DemoContainer components={['DatePicker', 'DatePicker']}>
                  <DatePicker 
                    slotProps={{
                      field: {clearable: true, onClear: () => setCleared(true) },
                    }}
                    label="Check-in"
                    value={checkIn}
                    onChange={(newValue) => setCheckIn(newValue)}
                    format="DD/MM/YYYY"
                  />
                </DemoContainer>
              </Box>
            </LocalizationProvider>
          </div>
          
          <div className="py-3 px-4 border-l border-gray-200">
            {/* Date Picker Component */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <DemoContainer components={['DatePicker', 'DatePicker']}>
                  <DatePicker 
                    slotProps={{
                      field: {clearable: true, onClear: () => setCleared(true) },
                    }}
                    label="Check-out"
                    value={checkOut}
                    onChange={(newValue) => setCheckOut(newValue)}
                    format="DD/MM/YYYY"
                  />
                </DemoContainer>
              </Box>
            </LocalizationProvider>
          </div>
        </div>
        <div className="py-3 px-4 border-t border-gray-200">
          <label>Numero de huéspedes: </label>
          <input
            type="number"
            min={1}
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

      <button className={`button-primary mt-4 transition ${
          numberOfNigths === 0 && user ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-[#ff5f92]'
        }`}
        onClick={bookThisPlace}
        disabled={numberOfNigths === 0}
        >
          
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
