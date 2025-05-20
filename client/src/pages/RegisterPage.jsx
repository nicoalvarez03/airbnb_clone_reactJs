import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  // Se crea una funcion para registrar un usuario
  async function registerUser(ev){
    ev.preventDefault();
    // Se hace una peticion POST a la API para registrar un usuario
    try{
        await axios.post('/register', {
            name, 
            email, 
            password
        });

        // Se redirige al usuario a la pagina de inicio de sesion
        toast.success(`Usuario '${name}' registrado con éxito`);

        setRedirect(true);
    }catch(e){
        toast.error('Error al registrar el usuario. El email ya existe.');
        console.error(e);
    }
      // Se limpian los campos de entrada
      setName('');
      setEmail('');
      setPassword('');
    
  }

  if(redirect){
    return <Navigate to={"/login"} />
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Registrarse</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
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
            Registrarse
          </button>
          <div className="py-2 text-center text-gray-500">
            ¿Tienes una cuenta?
            <Link
              to={"/login"}
              className="ml-1 underline text-black font-semibold"
            >
              Ingresa
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
