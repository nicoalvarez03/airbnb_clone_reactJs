import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";
import InfoModal from "../InfoModal";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    axios.get(`/places/${id}`).then((response) => {
      setPlace(response.data);
    });
  }, [id]);

  if (!place) return "";

  return (
    <div className="mt-4 border-t w-full px-5 border-gray-300 bg-gray-50 md:-mx-24 md:w-screen md:px-32 pt-8">
      <h1 className="text-xl md:text-3xl">{place.title}</h1>
      
      <AddressLink>{place.address}</AddressLink>
      
      <PlaceGallery place={place} />

      <div className="mt-8 mb-8 grid gap-8 grid-cols-1 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4 ">
            <h2 className="font-semibold text-2xl ">Información del alojamiento</h2>
            <span className="line-clamp-3 font-[500] text-gray-800 mt-4">{place.description}</span>
            <button
              onClick={() => setModalOpen(true)}
              className="button-primary hover:bg-[#ff5f92] transition-all w-50 mt-4 cursor-pointer"
              >Mostrar más</button>
          </div>
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
        
        {/* Modal */}
        <InfoModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          place={place}
        />
      </div>
    </div>
  );
}
