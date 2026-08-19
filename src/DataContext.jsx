import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from './config.js';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState('');

  const fetchResults = async () => {
    setStatus('loading');
    try {
      const res = await fetch(`${API_BASE_URL}/api/results`);
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const json = await res.json();
      setData(json);
      setStatus('ready');
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  useEffect(() => { fetchResults(); }, []);

  return (
    <DataContext.Provider value={{ data, status, errorMsg, refetch: fetchResults }}>
      {children}
    </DataContext.Provider>
  );
}

export function useKgatData() {
  return useContext(DataContext);
}
