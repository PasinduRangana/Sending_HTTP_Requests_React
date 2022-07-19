import React, { useState, useEffect, useCallback } from 'react';
import AddMovies from './components/AddMovie';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        'https://react-http-practice-690e7-default-rtdb.firebaseio.com/movies.json'
      );
      if (!response.ok) {
        throw new Error('Something went wrong.....!');
      }

      const data = await response.json();

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  //methana use effect eka athule fetch movies call karama meka initialy ekiyanne lode wedima call wenawa... meke antimata tiyana
  //array bracket deka [] thule call kalama  meka athule change ekak una gaman eka update wenawa.
  //meka infinit loop ekak wena eka nawathana call back eka use kala tiyanawa
  //use effect eka function eke yata dana hethuwa [] bracket athule tiyana eka palaweni parama undefined wena nisa
  //use cal back eken wenne function eka re render wena eka nawathana eka meka render wena one mokak change unamada kiyana eka dana callBack ekle [] deka athule
  //use call back ekei use effect ekei array bracket noda hadana epa infinit loop ekak hadenawa

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const addMovieHandler = async (movie) => {
    const response = await fetch(
      'https://react-http-practice-690e7-default-rtdb.firebaseio.com/movies.json',
      {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    console.log(data);
  };

  let content = <p>OOPS...Found no movies....!</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading.........!</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovies onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovies}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
