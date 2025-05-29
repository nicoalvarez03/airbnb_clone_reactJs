import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SkeletonCard from "../SkeletonCard";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.BACKEND_URL}/places`).then((response) => {
      setPlaces(response.data);
    });
  }, []);

  useEffect(() => {
    const startTime = Date.now(); // ⏱️ Tiempo al comenzar
  
    axios.get(`${import.meta.env.BACKEND_URL}/places`)
      .then((response) => {
        setPlaces(response.data);
      })
      .finally(() => {
        const elapsed = Date.now() - startTime;
        const MIN_DISPLAY_TIME = 500; // mínimo 1 segundo
  
        const remainingTime = MIN_DISPLAY_TIME - elapsed;
        if (remainingTime > 0) {
          setTimeout(() => setLoading(false), remainingTime);
        } else {
          setLoading(false);
        }
      });
  }, []);

  return (
    <div className="mt-8 px-5 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {loading
        ? Array.from({ length: places.length }).map((_, index) => <SkeletonCard key={index} />)
        : places.map((place) => (
            <Link target="_blank" to={'/place/' + place._id} key={place._id}>
              <div className="bg-gray-500 mb-2 rounded-2xl flex">
                {place.photos?.[0] && (
                  <img
                    className="object-cover rounded-2xl aspect-square"
                    src={place.photos?.[0]}
                    alt={`Foto de ${place.title}`}
                  />
                )}
              </div>
              <h2 className="font-bold truncate">{place.title}</h2>
              <h3 className="text-sm text-gray-500">{place.address}</h3>
              <div className="mt-1">
                <span className="font-bold">{place.price}€</span> por noche
              </div>
            </Link>
          ))}
    </div>
  );
}
