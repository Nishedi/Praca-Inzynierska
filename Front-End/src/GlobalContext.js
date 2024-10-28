import {createContext} from 'react';
import { createClient } from '@supabase/supabase-js'

export const GlobalContext = createContext();

export const GlobalProvider = ({children}) => {
    const supabaseUrl = 'https://sxudgukfwlwgjflfnnhe.supabase.co'
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4dWRndWtmd2x3Z2pmbGZubmhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAxMzYzODEsImV4cCI6MjA0NTcxMjM4MX0.tOzn4tok-O-zNGMiBJb9Up86jlGagWNQQNA_SPSNLIM";
    const supabase = createClient(supabaseUrl, supabaseKey);
    return (
        <GlobalContext.Provider value={{ 
          supabase 
        }}>
          {children}
        </GlobalContext.Provider>
      );
}