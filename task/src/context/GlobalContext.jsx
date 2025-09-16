import { useState, useEffect, useContext, createContext } from "react";
import axios from "../services/axios";

const AppContext = createContext();

const GlobalContext = ({ children }) => {
  const [user, setUser] = useState(null)
  const [Loading , setLoading] = useState(true)

  async function fetchUser() {
    try {
      const res = await axios.get('/user/me');
      if(res.status === 200){
        if(res.data.status === 0) setUser(null)
        if(res.data.status === 2) setUser(null)
        if(res.data.status === 1) {
          setUser(res.data.data)
          return res.data.data
        }
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser()
  },[])

  async function logout() {
    try {
      let res = await axios.post('/logout')
      if (res.status === 200) {
        if (res.data.status === 1) {
          setUser(null)
          await fetchUser()
        }
        else {
          setUser(null)
        }
      }
    } catch (err) {
      setUser(null);
    }
    setOrders([])
  }

  return (
    <AppContext.Provider value={{user , setUser  , fetchUser , logout }}>
      {children}
    </AppContext.Provider>
  );
}

export { GlobalContext, AppContext }
