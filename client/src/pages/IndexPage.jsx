import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/places").then((response) => {
      setPlaces(response.data);
    });
  }, []);
  return (
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {places.length > 0 &&
        places.map((place) => (
          <Link target="_blank" to={'/place/' + place._id} key={place._id}>
            <div className="bg-gray-500 mb-2 rounded-2xl flex">
              {place.photos?.[0] && (
                <img
                  className="object-cover rounded-2xl aspect-square"
                  src={"http://localhost:4000/uploads/" + place.photos?.[0]}
                  alt=""
                />
              )}
            </div>
            <h2 className="font-bold">
              {place.address}
            </h2>
            <h3 className="text-sm text-gray-500 truncate">
              {place.title}
            </h3>
            <div className="mt-1">
              <span className="font-bold">{place.price}€</span> por noche
            </div>
          </Link>
        ))}
    </div>
  );
}
