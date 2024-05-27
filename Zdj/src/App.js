import './App.css';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [images, setImages] = useState([]);
  const imagesRef = useRef(null);
  const [backgroundImages, setBackgroundImages] = useState({
    animals: '',
    landscapes: '',
    cities: '',
    others: '',
  });
  const [hoveredButton, setHoveredButton] = useState(null);

  const fetchImages = (tag) => {
    const apiKey = 'ddefaa4205d633b24350eab2cab9b9b9';
    const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=${tag}&format=json&nojsoncallback=1&per_page=9`;

    axios.get(url)
      .then(response => {
        const photos = response.data.photos.photo.map(photo => {
          const srcPath = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_w.jpg`;
          return {
            ...photo,
            srcPath
          }
        });
        setImages(photos);
        scrollToImages();
      })
      .catch(error => {
        console.error("Error while dowloading pictures", error);
      });
  };

  const scrollToImages = () => {
    if (imagesRef.current) {
      imagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchBackgroundImages = () => {
    const apiKey = 'ddefaa4205d633b24350eab2cab9b9b9';
    const tags = ['animals', 'landscapes', 'cities', 'others'];
    const promises = tags.map(tag => {
      const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=${tag}&format=json&nojsoncallback=1&per_page=1`;
      return axios.get(url).then(response => {
        const photo = response.data.photos.photo[0];
        const srcPath = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_w.jpg`;
        return { tag, srcPath };
      });
    });

    Promise.all(promises).then(results => {
      const newBackgroundImages = { ...backgroundImages };
      results.forEach(({ tag, srcPath }) => {
        newBackgroundImages[tag] = srcPath;
      });
      setBackgroundImages(newBackgroundImages);
    }).catch(error => console.error("Error while downloading background pictures: ", error));
  };

  useEffect(() => {
    fetchBackgroundImages();
  }, []);

  return (
    <>
            <div className="h-screen w-screen flex flex-wrap">
        {Object.keys(backgroundImages).map((key, index) => (
          <button
            key={index}
            onClick={() => fetchImages(key)}
            onMouseEnter={() => setHoveredButton(key)}
            onMouseLeave={() => setHoveredButton(null)}
            className={`w-1/2 h-1/2 transition-opacity duration-300 ${hoveredButton && hoveredButton !== key ? 'opacity-25' : 'opacity-100'} przycisk`}
            style={{ backgroundImage: `url(${backgroundImages[key]})`, backgroundSize: 'cover', color:'white'}}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>
      <div ref={imagesRef} className="p-5 grid grid-cols-3 gap-4">
        {images.map(image => (
          <a href={image.srcPath} key={image.id} target="_blank" rel="noopener noreferrer">
            <img src={image.srcPath} alt={image.title} className="w-full h-full object-cover" />
          </a>
        ))}
      </div>
    </>
  );
}

export default App;