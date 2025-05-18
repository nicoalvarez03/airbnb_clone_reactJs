import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({}); // Se crea el contexto de usuario

// Se crea el contexto de usuario para poder compartir la informacion del usuario en toda la aplicacion
export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if(!user){
            axios.get('/profile')
                .then(({data}) => {
                    setUser(data || {});
                })
                .catch(err => {
                    console.error(err);
                    setUser({});
                })
                .finally(() => {
                    setReady(true);
                }); 
        }
    }, [])

    // Se retorna el contexto de usuario con la informacion del usuario y el estado de carga
    return (
        <UserContext.Provider value={{user, setUser, ready}}>
            {children}
        </UserContext.Provider>
    );
}