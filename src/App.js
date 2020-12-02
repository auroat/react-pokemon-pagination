import React, { useState, useEffect } from "react";
import PokemonList from "./PokemonList";
import axios from "axios";
import Pagination from "./Pagination";

export default function App() {
  const [pokemon, setPokemon] = useState(["aurel"]);
  const [currPageUrl, setCurrPageUrl] = useState(
    "https://pokeapi.co/api/v2/pokemon"
  );
  const [loading, setLoading] = useState(true);

  const [nextPageUrl, setNextPageUrl] = useState();
  const [prevPageUrl, setPrevPageUrl] = useState();

  useEffect(() => {
    setLoading(true);
    let cancel;
    axios
      .get(currPageUrl, {
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      })
      .then((res) => {
        setLoading(false);
        setNextPageUrl(res.data.next);
        setPrevPageUrl(res.data.previous);
        setPokemon(res.data.results.map((p) => p.name));
      });

    return () => {
      cancel();
    };
  }, [currPageUrl]);

  function gotoNextPage() {
    setCurrPageUrl(nextPageUrl);
  }

  function gotoPrevPage() {
    setCurrPageUrl(prevPageUrl);
  }

  if (loading) return "Loading...";

  return (
    <>
      <PokemonList pokemon={pokemon} />
      <Pagination
        gotoNextPage={nextPageUrl ? gotoNextPage : null}
        gotoPrevPage={prevPageUrl ? gotoPrevPage : null} />
    </>
  );
}
