const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');
let ready = false;
let isInitialLoad = true;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// Unsplash API
let initialLoadCount = 10;
const apiKey = '9LzNu9ijZaR0g-KmAtwcdRCckej8zL1l2iO829ZKBZo';
let apiURL = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialLoadCount}`;

function updateAPIURLwithNewCount(imageCount) {
  apiURL = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${imageCount}`;
}

// Check if all images were loaded
function imageLoaded() {
  imagesLoaded++;

  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

// Helper function to set attributes on DOM elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// For each photo, create elements for links & photos and add to DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  console.log('total images =', totalImages);
  photosArray.forEach((photo) => {
    // Create <a> to link to 
    const item = document.createElement('a');
    setAttributes(item, {
      href: photo.links.html,
      target: '_blank'
    });

    // Create <img> for photo
    const img = document.createElement('img');
    setAttributes(img, {
      src: photo.urls.small,
      alt: photo.alt_description,
      title: photo.alt_description
    });

    // Add landscape class for photos with landscape orientation
    if (photo.width > photo.height) {
      item.classList.add('landscape');
    }

    img.addEventListener('load', imageLoaded);

    // Put <img> inside <a>, then put <a> inside imageContainer element
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

// Get photos from unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiURL);
    photosArray = await response.json();
    displayPhotos();
    if (isInitialLoad) {
      isInitialLoad = false;
      updateAPIURLwithNewCount(30);
    }
  } catch (error) {
    // Catch error here
    console.log(error);
  }
}

// When scrolling near the bottom of the page, load more photos
window.addEventListener('scroll', (e) => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000
    && ready
  ) {
    ready = false;
    getPhotos();
  }
});

// On load
getPhotos();