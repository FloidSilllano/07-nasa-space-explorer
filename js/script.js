// Array of random space facts for the LevelUp bonus
const spaceFacts = [
  "A day on Venus is longer than a year on Venus!",
  "Neutron stars are so dense that a teaspoon of them would weigh about 6 billion tons.",
  "There are more trees on Earth than stars in the Milky Way galaxy.",
  "Because there's no atmosphere on the Moon, footprints left by astronauts will stay there for millions of years.",
  "One day, the Andromeda Galaxy and our Milky Way will collide and merge!"
];

// Elements from the DOM
const galleryContainer = document.getElementById("gallery-container"); 
const loadingElement = document.getElementById("loading-message");     
const factElement = document.getElementById("space-fact");             
const modal = document.getElementById("image-modal");                  
const modalImage = document.getElementById("modal-image");
const modalVideo = document.getElementById("modal-video");
const modalTitle = document.getElementById("modal-title");
const modalDate = document.getElementById("modal-date");
const modalExplanation = document.getElementById("modal-explanation");
const closeBtn = document.querySelector(".close-button");

// LevelUp: Display a Random Space Fact on Load
function displayRandomFact() {
  if (factElement) {
    const randomIndex = Math.floor(Math.random() * spaceFacts.length);
    factElement.textContent = `Did You Know? ${spaceFacts[randomIndex]}`;
  }
}

// Helper function to calculate a date 8 days ago from today (for 9 consecutive days total)
function getStartDate(endDateStr) {
  const date = new Date(endDateStr);
  date.setDate(date.getDate() - 8);
  return date.toISOString().split('T')[0];
}

// Core: Fetch 9 Consecutive Days of APOD Data
async function fetchSpaceImages(startDate, endDate) {
  if (loadingElement) loadingElement.style.display = "block";
  if (galleryContainer) galleryContainer.innerHTML = "";

  const apiKey = "DEMO_KEY";
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (loadingElement) loadingElement.style.display = "none";
    
    renderGallery(data);
  } catch (error) {
    console.error("Error fetching NASA APOD data:", error);
    if (loadingElement) {
      loadingElement.textContent = "Failed to load space images. Please try again later.";
    }
  }
}

// Core: Display the Gallery & LevelUp: Handle Videos + Hover Effects
function renderGallery(items) {
  galleryContainer.innerHTML = "";

  items.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("gallery-card"); 

    let mediaContent = "";
    if (item.media_type === "video") {
      mediaContent = `<iframe src="${item.url}" frameborder="0" allowfullscreen class="gallery-video"></iframe>`;
    } else {
      mediaContent = `<img src="${item.url}" alt="${item.title}">`;
    }

    card.innerHTML = `
      ${mediaContent}
      <div class="card-info">
        <h3>${item.title}</h3>
        <p>${item.date}</p>
      </div>
    `;

    card.addEventListener("click", () => {
      openModal(item);
    });

    galleryContainer.appendChild(card);
  });
}

// Core & LevelUp: Modal View Management
function openModal(item) {
  if (!modal) return;

  modalTitle.textContent = item.title;
  modalDate.textContent = item.date;
  modalExplanation.textContent = item.explanation;

  if (item.media_type === "video") {
    modalImage.style.display = "none";
    modalVideo.style.display = "block";
    modalVideo.src = item.url;
  } else {
    modalVideo.style.display = "none";
    modalImage.style.display = "block";
    modalImage.src = item.hdurl || item.url;
  }

  modal.style.display = "block";
}

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    modalVideo.src = ""; 
  });
}

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
    modalVideo.src = "";
  }
});

window.addEventListener("DOMContentLoaded", () => {
  displayRandomFact();
  
  const today = new Date().toISOString().split('T')[0];
  const startDate = getStartDate(today);
  
  fetchSpaceImages(startDate, today);
});