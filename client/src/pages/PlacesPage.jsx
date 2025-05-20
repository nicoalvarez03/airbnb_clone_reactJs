import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/user-places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);


  return (
    <div>
      <AccountNav />
      <div className="text-center">
        <Link
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full cursor-pointer"
          to={"/account/places/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
          Añadir nuevo alojamiento
        </Link>
      </div>
      <div className="mt-4 px-5">
        {places.length > 0 &&
          places.map((place) => (
            <Link to={'/account/places/'+place._id} className="flex flex-col md:flex-row cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl my-3" key={place._id}>
              <div className="flex w-full h-32 md:w-32 shrink-0">
                <PlaceImg place={place} />
              </div>
              <div className="grow-0 shrink">
                <h2 className="text-xl font-semibold">
                  {place.title}
                  <p className="cardText text-sm font-normal mt-2 line-clamp-5">
                    {place.description}
                  </p>
                </h2>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
