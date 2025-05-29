import React, { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import toast from "react-hot-toast";
import dayjs from "dayjs";


export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [cleared, setCleared] = React.useState(false);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  const {user} = useContext(UserContext);

  const today = dayjs(); // Fecha actual
  const tomorrow = dayjs().add(1, 'day'); // Fecha de mañana

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
    try{
      if(!user){
        toast.error("Por favor, inicia sesión para reservar");
        setRedirect("/login");
        return;
      }else if(!name || !phone || !checkIn || !checkOut || !numberOfGuests){
        toast.error("Por favor, completa todos los campos");
        return;
      }else if(numberOfNigths <= 0){
        toast.error("Por favor, selecciona fechas válidas");
        return;
      }else if(numberOfGuests > place.maxGuests || numberOfGuests < 1){
        toast.error(`El número de huéspedes tiene que ser mínimo 1 y máximo ${place.maxGuests}`);
        return;
      }else{
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/bookings`, {
          checkIn: checkIn.toISOString(), 
          checkOut: checkOut.toISOString(), 
          numberOfGuests, 
          name, 
          phone, 
          place:place._id,
          price:numberOfNigths * place.price,
        });
        const bookingId = response.data._id;
        toast.success("Reserva realizada con éxito");
        setRedirect(`/account/bookings/${bookingId}`);
      }
    }catch(e){
      toast.error(`Error inesperado ${e} al realizar la reserva. Por favor, inténtelo de nuevo`);
      setCleared(true);
    }
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
        
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/2 py-3 px-4">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker 
                slotProps={{
                  field: { clearable: true, onClear: () => setCleared(true) },
                }}
                defaultValue={today}
                disablePast
                label="Check-in"
                value={checkIn}
                onChange={(newValue) => setCheckIn(newValue)}
                format="DD/MM/YYYY"
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </div>

          <div className="w-full sm:w-1/2 py-3 px-4 border-t sm:border-t-0 sm:border-l border-gray-200">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker 
                slotProps={{
                  field: { clearable: true, onClear: () => setCleared(true) },
                }}
                label="Check-out"
                disablePast
                minDate={checkIn ? dayjs(checkIn).add(1, 'day') : tomorrow}
                value={checkOut}
                onChange={(newValue) => setCheckOut(newValue)}
                format="DD/MM/YYYY"
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
            
          </div>
        </div>

        <div className="py-3 px-4 border-t border-gray-200">
          <label>Numero de huéspedes: </label>
          <input
            type="number"
            min={1}
            max={place.maxGuests}
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

      <button className={`button-primary mt-4 transition 
        ${numberOfNigths > 0 ? " hover:bg-[#ff5f92] cursor-pointer" : "bg-gray-300"}`}
        disabled={numberOfNigths === 0}
        onClick={() => {
          if (numberOfNigths > 0) {
            bookThisPlace();
          } else {
            setCleared(true);
          }
        }}
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
