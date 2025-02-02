import { setWithExpiry, getWithExpiry } from "./modules/localStorageHelpers.js";

// // store the link plus the API key in a variable
const key = "I1v92ZQoxXVhltaR4Di8ZiNndFaWe16C";
const API = `https://api.nytimes.com/svc/topstories/v2/nyregion.json?api-key=${key}`;
const storagePrefix = "nyt-autosave";

// function setWithExpiry(key, value, ttl) {
//   const now = new Date();
//   // `item` is an object which contains the original value
//   // as well as the time when it's supposed to expire
//   const item = {
//     value: value,
//     expiry: now.getTime() + ttl,
//   };
//   localStorage.setItem(key, JSON.stringify(item));
// }

// function getWithExpiry(key) {
//   const itemStr = localStorage.getItem(key);
//   // if the item doesn't exist, return null
//   if (!itemStr) {
//     console.log("no item string");
//     return null;
//   }
//   console.log("item string found!", itemStr);
//   const item = JSON.parse(itemStr);
//   const now = new Date();
//   // compare the expiry time of the item with the current time
//   if (now.getTime() > item.expiry) {
//     // If the item is expired, delete the item from storage
//     // and return null
//     localStorage.removeItem(key);
//     return null;
//   }
//   return item.value;
// }

function getStories() {
  const stories = getWithExpiry(storagePrefix);
  if (!stories) {
    console.warn(" stories expired - fetching again ");
    fetch(API)
      .then((response) => response.json())
      .then((data) => showData(data.results));
  } else {
    console.warn(" stories not expired - no fetching ");
    document.querySelector(".stories").innerHTML = stories;
  }
}

function showData(stories) {
  const looped = stories
    .map(
      (story) => `
    <div class="item">
    <img src="${story.multimedia ? story.multimedia[2].url : ""}" alt="${
        story.multimedia ? story.multimedia[2]?.caption : ""
      }" />
    <figcaption>${
      story.multimedia ? story.multimedia[2]?.caption : ""
    }</figcaption>
      <h3><a href="${story.url}">${story.title}</a></h3>
      <p>${story.abstract}</p>
    </div>
  `
    )
    .join("");

  document.querySelector(".stories").innerHTML = looped;
  setWithExpiry(storagePrefix, looped, 1000 * 60 * 60);
}

if (document.querySelector(".home")) {
  getStories();
}

// function getStories() {
//   fetch(API)
//     .then((response) => response.json())
//     .then((data) => showData(data.results));
// }

// // this function contains ternary expressions
// function showData(stories) {
//   var looped = stories
//     .map(
//       (story) => `
//     <div class="item">
//     <img src="${story.multimedia ? story.multimedia[2].url : ""}" alt="${
//         story.multimedia ? story.multimedia[2]?.caption : ""
//       }" />
//     <figcaption>${
//       story.multimedia ? story.multimedia[2]?.caption : ""
//     }</figcaption>
//       <h3><a href="${story.url}">${story.title}</a></h3>
//       <p>${story.abstract}</p>
//     </div>
//   `
//     )
//     .join("");

//   // document.querySelector(".stories").innerHTML = looped;
//   sessionStorage.setItem(storagePrefix, looped);
// }

// // if (document.querySelector(".home")) {
// //   getStories();
// // }

// if (document.querySelector(".home")) {
//   var saved = sessionStorage.getItem(storagePrefix);
//   if (saved) {
//     console.log("loading from sessionStorage");
//     document.querySelector(".stories").innerHTML = saved;
//   } else {
//     console.log("fetching from nytimes");
//     getStories();
//   }
// }