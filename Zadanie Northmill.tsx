import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

const URL = "https://example.com/countries";

export default function App() {
  const [countries, setCountries] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsFetching(true);
    const offset = countries.length;

    try {
      const response = await fetch(`${URL}?offset=${offset}&limit=20`);
      const data = await response.json();

      setCountries([...countries, ...data.results]);

      //TUTAJ POWINNO BYĆ
      // setCountries([...countries, ...data.results], () => {
      //   if (data.count >= countries.length) {
      //     setHasMore(false);
      //   }
      // });
      // LUB
      // const totalCountries = [...countries, ...data.results];
      // if (data.count === totalCountries) {
      //   setHasMore(false);
      // }
      // ponizsze rozwiązanie tez zadziala ale niepotrzebnie wykona dodatkową petle dodatkowo w warunku powinno byc >= tak dla bezpieczenstwa

      if (data.count === countries.length) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleEndReached = () => {
    if (!isFetching && hasMore) {
      fetchData();
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text>{item.name}</Text>
    </View>
  );

  const renderFooter = () => {
    if (isFetching) {
      return <ActivityIndicator size="small" />;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={countries}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    width: "100%",
    height: "100%",
  },
  listItem: {
    width: "100%",
    height: "40px",
    padding: "8px",
    alignItems: "flexStart",
  },
});
