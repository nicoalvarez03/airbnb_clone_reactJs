import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const {setUser} = useContext(UserContext);

  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    try{
        const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
            email,
            password,
        });
        setUser(data);

        toast.success(`Bienvenido de nuevo '${data.name}'`);

        setRedirect(true);
    }catch(e){
        toast.error("Email o contraseña incorrectas. Por favor, inténtelo de nuevo");
        console.error(e);
    }
  }

    if(redirect){
        return <Navigate to="/" />
    }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Iniciar sesión</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <button className="bg-primary p-2 text-white font-semibold w-full rounded-2xl cursor-pointer my-1">
            Login
          </button>
          <div className="py-2 text-center text-gray-500">
            ¿Aún no tienes una cuenta?
            <Link
              to={"/register"}
              className="ml-1 underline text-black font-semibold"
            >
              Registrate
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
