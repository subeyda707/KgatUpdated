import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState(null);

  const loadFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try { setData(JSON.parse(e.target.result)); }
      catch (err) { alert('Could not parse this file as JSON.'); }
    };
    reader.readAsText(file);
  };

  return <DataContext.Provider value={{ data, loadFile }}>{children}</DataContext.Provider>;
}

export function useKgatData() {
  return useContext(DataContext);
}
