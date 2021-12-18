import { createContext, ReactNode, useEffect, useState } from "react"
import { auth, firebase } from "../services/firebase"

type User = {
  name: string,
  avatar: string,
  id: string
}

type AuthContextType = {
  user: User | undefined,
  signInWithGoogle: () => Promise<void>
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider(props: AuthContextProviderProps){
  
  const [user, setUser] = useState<User>()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user) {
        const { displayName, photoURL, uid} = user;

        if (!displayName || !photoURL){
          throw new Error('missing information from Google account.')
        }
        setUser({
          name: displayName,
          avatar: photoURL,
          id: uid
        })
      }
    })

    return() => {unsubscribe()}
  }, [])

  async function signInWithGoogle(){
    const provider = new firebase.auth.GoogleAuthProvider();
    
    const result = await auth.signInWithPopup(provider);

    if(result.user){
      const { displayName, photoURL, uid} = result.user;

      if (!displayName || !photoURL){
        throw new Error('missing information from Google account.')
      }

      setUser({
        name: displayName,
        avatar: photoURL,
        id: uid
      })
      console.log(result)
    }
  }

  return (
    <AuthContext.Provider value= {{ user, signInWithGoogle}}>
      {props.children}
    </AuthContext.Provider>
  )
}