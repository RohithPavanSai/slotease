import React, { createContext, useState } from 'react'

export const contexts = createContext();

export const Authentication = ({children}) => {
    const [isMenuActive,setIsMenuActive] = useState(false);
    
    const val={isMenuActive,setIsMenuActive};
  return (
    <contexts.Provider value={val}>
      {children}
    </contexts.Provider>
  )
}


