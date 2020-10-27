const imageGrid = document.getElementById('image-grid');
const loader = document.getElementById('loader');
const errorMsg = document.getElementById('error');
let ready = false;
let isInitialLoad = true;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// Unsplash API
let initialLoadCount = 30;
const apiKey = '9LzNu9ijZaR0g-KmAtwcdRCckej8zL1l2iO829ZKBZo';
let apiURL = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialLoadCount}`;

function updateAPIURLwithNewCount(imageCount) {
  apiURL = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${imageCount}`;
}

// Get photos from unsplash API
async function getPhotos() {
  let response;
  try {
    response = await fetch(apiURL);
    photosArray = await response.json();
    displayPhotos();
    if (isInitialLoad) {
      isInitialLoad = false;
      updateAPIURLwithNewCount(30);
    }
    
  } catch (error) {
    // Catch error here
    displayErrorMsg();
    throw new Error(error);
  }
}

// For each photo, create elements for links & photos and add to DOM
function displayPhotos() {
  totalImages = photosArray.length;
  console.log('total images =', totalImages);
  photosArray.forEach((photo) => {
    // Create <a> to link to 
    const item = document.createElement('a');
    setAttributes(item, {
      href: photo.links.html,
      target: '_blank'
    });

    // Create <div> container for the image
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');

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

    // Add portrait class for photos with portrait orientation
    if (photo.width < photo.height) {
      item.classList.add('portrait');
    }

    img.addEventListener('load', imageLoaded);

    // Put <img> inside <div> then inside <a>, then put <a> inside imageGrid element
    imageContainer.appendChild(img);
    item.appendChild(imageContainer);
    imageGrid.appendChild(item);
  });
}

// Check if all images were loaded
function imageLoaded() {
  imagesLoaded++;

  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

// When scrolling near the bottom of the page, load more photos
window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000
    && ready
  ) {
    imagesLoaded = 0;
    ready = false;
    getPhotos();
  }
});

// Helper function to set attributes on DOM elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Display error message if request throws an error
function displayErrorMsg() {
  console.log('displaying error msg');
  errorMsg.hidden = false;
  loader.hidden = true;
}

// On load
getPhotos();