import React, { useState, useEffect } from 'react';
import './App.css';
// import episodes from './episodes.json';
import Episode from './Components/episode';
import shows from './shows.json';

// .then response => { 
//   const responseVar = response.json()
//   console.log(responseVar)
//   return (
//     responseVar
//   )
// } )

// fetch('https://api.tvmaze.com/shows/82/episodes')
// .then(async response => {
// episodes = await response.json();
// console.log(episodes);
//   }
// )

interface IEpisode {
  id: number;
  url: string;
  name: string;
  season: number;
  number: number;
  type: string;
  airdate: string;
  airtime: string;
  airstamp: string;
  runtime: number;
  image: {
    medium: string | null;
    original: string | null;
  };
  summary: string;
  _links: { self: { href: string } };
}

function App() {

  const [input, setInput] = useState("");
  const [episodes, setEpisodes] = useState<IEpisode[]>([]);

  console.log("Hi");

  useEffect(() => {
    fetch('https://api.tvmaze.com/shows/82/episodes').then(
      async response => {
      let episodesInProgress: IEpisode[] = await response.json();
      console.log(episodesInProgress);
      setEpisodes(episodesInProgress);
      }
    )
  }, [])

  console.log("Hi2");

  const mapEpisodeDetails = ( {id, name, season, number, image, summary}: IEpisode) => {
    return <Episode 
            id = {id}   
            name = {name}
            season = {season}
            number = {number}
            image = {image}
            summary = {summary}
            />
  }

  const episodesDropdown = ( {id, name, season, number}: IEpisode) => {
    return (
      <option value={`${id}`}> S{season<10?`0${season}`:season}E{number<10?`0${number}`:number} - {name}</option>
    )
  }

  const episodesShowing = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  }

  const episodePick = ( {name}: {name: string} ) => {
    return (
      input.length > 0 ? (`${name.toLowerCase()}`).startsWith(`${input.toLowerCase()}`)
    : true
    )
  }

  const scrollToEpisode = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const element = document.getElementById(`${event.target.value}`);
    element?.scrollIntoView({behavior: "smooth"});
  }

  const mapShowNames = ({id, name}: {id: number, name: string}) => {
      return (
        id === 82 ? <option selected value={`${id}`}>{name}</option> : <option value={`${id}`}>{name}</option>
      )
  }

  const selectShow = (event: React.ChangeEvent<HTMLSelectElement>) => {
      fetch(`https://api.tvmaze.com/shows/${event.target.value}/episodes`).then(
        async response => {
        let episodesInProgress = await response.json();
        console.log(episodesInProgress);
        setEpisodes(episodesInProgress);
        }
      )
  }

  // let filteredEpisodes;
  // typeof(episodes) !== "object" ? filteredEpisodes = ([]).filter(episodePick)
  // : filteredEpisodes = (episodes).filter(episodePick);
  let filteredEpisodes = (episodes).filter(episodePick);
  let mappedEpisodes = filteredEpisodes.map(mapEpisodeDetails);
  // let episodeOption
  // typeof(episodes) !== "object" ? episodeOption = ([]).map(episodesDropdown)
  // : episodeOption = episodes.map(episodesDropdown)
  let episodeOption = episodes.map(episodesDropdown)
  let sortedShows = shows.sort((a,b) => a.name.localeCompare(b.name))
  let showNames = sortedShows.map(mapShowNames);

  console.log("Hi3");

  return (
    <div onLoad={() => console.log("Hi4")}>
      {/* Ask Neill why 73 re-renders */}
      <select onChange={scrollToEpisode}>
        {episodeOption}
      </select>
      <select onChange={selectShow}>
        {showNames}
      </select>
      <input 
      type="text"
      onChange={episodesShowing}
      />
      <p>The number of episodes which match your search: {filteredEpisodes.length}/{episodes.length}</p>
     {mappedEpisodes}
    </div>
  );
}

export default App;
