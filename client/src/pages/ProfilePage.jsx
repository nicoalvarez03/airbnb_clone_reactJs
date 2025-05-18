import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(false);
  const { ready, user, setUser } = useContext(UserContext);
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  async function logout() {
    await axios.post("/logout");
    setRedirect("/");
    setUser(null);
  }

  if (!ready) {
    return <div>Cargando...</div>;
  }

  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  //bg-primary text-white rounded-full
  if (redirect) {
    return <Navigate to={redirect} />;
  }
  return (
    <div>
      
      <AccountNav />

      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto flex flex-col items-center">
          Usuario logeado: {user.name} ({user.email})
          <button
            onClick={logout}
            className="bg-primary text-white py-1 rounded-full w-100 max-w-sm mt-2 cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      )}
      {subpage === 'places' && (
            <PlacesPage />
        )}
    </div>
  );
}
