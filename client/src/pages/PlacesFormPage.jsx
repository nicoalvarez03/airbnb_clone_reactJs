import axios from "axios";
import { useEffect, useState } from "react";
import Perks from "../Perks";
import PhotosUploader from "../PhotosUploeader";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function PlacesFormPage() {
  const {id} = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if(!id){
      return
    }
    axios.get(`/places/${id}`).then(response => {
      const {data} = response;
      setTitle(data.title || "");
      setAddress(data.address || "");
      setAddedPhotos(data.photos || []);
      setDescription(data.description || "");
      setPerks(data.perks || []);
      setExtraInfo(data.extraInfo || "");
      setCheckIn(data.checkIn || "");
      setCheckOut(data.checkOut || "");
      setMaxGuests(data.maxGuests || 1);
      setPrice(data.price || 100);
    });
  }, [id])
  

  // Se crea una funcion para generar el header de los inputs
  function inputHeader(text, isRequired = false) {
    return isRequired ? 
      <h2 className="text-2xl mt-4">{text} <span className="text-red-500 font-semibold">*</span></h2> 
        : <h2 className="text-2xl mt-4">{text}</h2>;
  }

  // Se crea una funcion para generar la descripcion de los inputs
  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  // Se crea una funcion para generar el header y la descripcion de los inputs
  function preInput(header, description, isRequired = false) {
    return (
      <>
        {inputHeader(header, isRequired)}
        {inputDescription(description)}
      </>
    );
  }

  async function savePlace(ev) {
    ev.preventDefault();

    try {
      if (!title || !address || !addedPhotos.length || !description || perks.length === 0 || !checkIn || !checkOut || !maxGuests || !price) {
        toast.error("Por favor, debe completar todos los campos obligatorios");
        return;
      }else{

        const placeData = {
            title,
            address,
            addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,
            price,
        }
        if (id) {
          // Actualizar un lugar existente
          await axios.put("/places", {
            id, ...placeData
          });
          setRedirect(true);
        }else{
          // Crear un nuevo lugar
          await axios.post("/places", placeData);
          setRedirect(true);
        }
        toast.success("Lugar guardado con éxito");
      }
  }catch (e) {
      alert("Error al guardar el lugar");
      console.error(e);
    }
  }

  if (redirect) {
    return <Navigate to="/account/places" />;
  }

  return (
    <div>
        <AccountNav />
      <form className="px-5" onSubmit={savePlace}>
        {preInput(
          `Título`,
          true,
          "Título de tu alojamiento. Debe ser breve y atractivo, como un anuncio."
        )}
        <input
          type="text"
          placeholder="Título, ej: Apartamento en el centro"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />
        {preInput("Dirección", true, "Dirección exacta de tu alojamiento")}
        <input
          type="text"
          placeholder="Dirección"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
        />
        {preInput("Fotos", true, "Más = Mejor")}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
        {preInput("Descripción", true, "Describe tu alojamiento")}
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
        {preInput("Beneficios", true, "Selecciona todos los beneficios de tu alojamiento")}
        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Perks selected={perks} onChange={setPerks} />
        </div>
        {preInput(
          "Información extra",
          "¿Algo más que los huéspedes deban saber? ¿Hay algún coste adicional? ¿Hay algo que no se puede hacer en el alojamiento?"
        )}
        <textarea
          placeholder="Información extra"
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
        />
        {preInput(
          "Check In & Check Out", true,
          "Añade un check in y check out para tu alojamiento. Recuerda tener un intervalo de tiempo para limpiar el mismo entre huéspedes."
        )}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Check In</h3>
            <input
              type="text"
              placeholder="14:00 PM"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check Out</h3>
            <input
              type="text"
              placeholder="12:00 AM"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Cantidad de huéspedes</h3>
            <input
              type="number"
              value={maxGuests}
              onChange={(ev) => setMaxGuests(Number(ev.target.value))}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Precio por noche</h3>
            <input
              type="number"
              value={price}
              onChange={(ev) => setPrice(Number(ev.target.value))}
            />
          </div>

        </div>
        <button className="button-primary my-4 ">Guardar</button>
      </form>
    </div>
  );
}
