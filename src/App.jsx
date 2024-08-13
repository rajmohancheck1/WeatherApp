import { useEffect, useState } from 'react';

import './App.css';

import searchicon from "./assets/search.jpeg";
import clearicon from "./assets/clear.jpeg";
import cloudicon from "./assets/cloudy.jpeg";
import drizzleicon from "./assets/drizzle.jpeg";
import rainicon from "./assets/Rainy.jpeg";
import windicon from "./assets/windy.jpeg";
import snowicon from "./assets/snow.jpeg";
import humidityicon from "./assets/humidity.jpeg";
import PropTypes from "prop-types"

const WethearDetails = ({ icon, temp, city, cntry, lat, lon,wind,humidity }) => {
  return (
    <>
      <div className='image'>
        <img src={icon} alt="weather icon" />
      </div>
      <div className='temp'>{temp} °C</div>
      <div className='location'>{city}</div>
      <div className='cntry'>{cntry}</div>
      <div className='cord'>
        <div>
          <span className='lat'>Latitude: </span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='lon'>Longitude: </span>
          <span>{lon}</span>
        </div>
      </div>
      <div className='data-containder'>
        <div className='element' style={{float:'left'}}>
          <img src={humidityicon}  alt="wind" className='icon'/>
          <div className='data'>
            <div className='humidity-percent'>{humidity}%</div>
            <div className='text'>Humidity</div>
          </div>
          </div>
          <div className='element' style={{float:'right'}}>
          <img src= {windicon} alt="wind" className='icon'/>
          <div className='data'>
            <div className='wind-percent'>{wind}</div>
            <div className='text'>Wind</div>
          </div>
          </div>
        
        </div>
    </>
  );
}
WethearDetails.propTypes={
  icon:PropTypes.string.isRequired,
  temp:PropTypes.number.isRequired,
  city:PropTypes.string.isRequired,
  cntry:PropTypes.string.isRequired,
  humidity:PropTypes.number.isRequired,
  wind:PropTypes.number.isRequired,
  lat:PropTypes.number.isRequired,
  lon:PropTypes.number.isRequired,

  
}

function App() {
  let apikey="95f700287014ceb6bff6d45d60bf3284";
  const [text,settext]=useState("Chennai");
  const [icon, setIcon] = useState(snowicon);
  const [temp, setTemp] = useState(30);
  const [city, setCity] = useState("Chennai");
  const [cntry, setCntry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [humidity, sethumidity] = useState(0);
  const [wind, setwind] = useState(0);
  const [cityNotfound,setcityNotFound]=useState(false);
  const [loading,setloading]=useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01n": clearicon,
    "01d": clearicon,
    "02d": cloudicon,
    "02n": cloudicon,
    "03d": drizzleicon,
    "03n": drizzleicon,
    "04d": drizzleicon,
    "04n": drizzleicon,
    "09d": rainicon,
    "09n": rainicon,
    "10d": rainicon,
    "10n": rainicon,
    "13d": snowicon,
    "13n": snowicon
  };
  
  const search=async()=>{
      setloading(true);
      let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apikey}&units=Metric`;
      try{
        let res=await fetch(url);
        let data=await res.json();
        //console.log(data);
        if(data.cod==="404"){
          console.error("City not found");
          setcityNotFound(true);
          setloading(false);
          return;
        }
        sethumidity(data.main.humidity);
        setwind(data.wind.speed);
        setTemp(Math.floor(data.main.temp));
        setCity(data.name);
        setCntry(data.sys.country);
        setLat(data.coord.lat);
        setLong(data.coord.lon);
        const weathericoncode=data.weather[0].icon;
        setIcon(weatherIconMap[weathericoncode] || clearicon);
        setcityNotFound(false);


      }catch(error){
        console.error("An error occured:",error.message);
      }
      finally{
        setloading(false);
      }
      
  }
  const handlecity=(e)=>{
    settext(e.target.value);

  };
  const handleKeyDown = (e) =>{
    if(e.key==="Enter"){
      search();
    }
  }
  useEffect(function(){
    search();
  },[]);


  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input type="text" placeholder='Search city' className='city-input' onChange={handlecity} 
          value={text} onKeyDown={handleKeyDown}/>
          <div className='searchicon'>
            <img src={searchicon} alt="search icon" style={{ width: 30 }} onClick={()=>search()} />
          </div>
        </div>
         {loading && <div  className='loading-message'>Loading....</div>}
        {error && <div className='error-message'>{error}</div>}
        {cityNotfound &&<div className='city-not-found'> City not Found</div>}
        {!loading && !cityNotfound && <WethearDetails icon={icon} temp={temp} city={city} cntry={cntry} lat={lat} lon={long} humidity={humidity} wind={wind}/>}
       
        <p className='copyright'>Designed by Rajmohan</p>
      </div>
      
    </>
  );
}

export default App;
