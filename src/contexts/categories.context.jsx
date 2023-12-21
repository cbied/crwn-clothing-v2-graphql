import { createContext, useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { getCategoriesAndDocuments } from '../utils/firebase/firebase.utils';

export const CategoriesContext = createContext({
  categoriesMap: {},
});

const COLLECTIONS = gql`
  query GetCollections {
    collections {
    id 
    title
    items {
      id
      name
      price
      imageUrl
    }
  }
  }
`

export const CategoriesProvider = ({ children }) => {
  const { loading, data } = useQuery(COLLECTIONS)
  const [categoriesMap, setCollectionsMap] = useState({});

  useEffect(() => {
    if(data) {
      const { collections } = data;
      const collectionsMap = collections.reduce((acc, collection) => {
        const { title, items } = collection
        acc[title.toLowerCase()] = items
        return acc
    }, {})
      setCollectionsMap(collectionsMap)
    }
  }, [data])

  const value = { categoriesMap, loading };
  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};
