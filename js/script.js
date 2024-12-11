const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');
const typeSelect = document.getElementById('type');
const raritySelect = document.getElementById('rarity');
const favoritesButton = document.getElementById('favoritesButton');

// Función para realizar la búsqueda
function searchCards() {
  const query = searchInput.value.trim();
  const type = typeSelect.value;
  const rarity = raritySelect.value;

  if (!query) return alert('Por favor, escribe un nombre para buscar.');

  let url = `https://api.pokemontcg.io/v2/cards?q=name:"${query}"`;

  if (type !== 'all') url += ` AND types:"${type}"`;
  if (rarity !== 'all') url += ` AND rarity:"${rarity}"`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('No se encontraron resultados.');
      return response.json();
    })
    .then(data => {
      resultsDiv.innerHTML = ''; // Limpiar resultados anteriores
      if (data.data.length === 0) {
        resultsDiv.innerHTML = '<p style="color: red">No se encontraron cartas.</p>';
        return;
      }
      displayCards(data.data);
    })
    .catch(error => alert(error.message));
}

// Función para mostrar las cartas
function displayCards(cards) {
  cards.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.innerHTML = `
      <h3>${card.name}</h3>
      <img src="${card.images.small}" alt="${card.name}">
      <p>Tipo: ${card.types ? card.types.join(', ') : 'Desconocido'}</p>
      <p>Rareza: ${card.rarity || 'Desconocida'}</p>
      <button class="favorite-btn" 
              data-id="${card.id}" 
              data-name="${card.name}" 
              data-image="${card.images.small}" 
              data-type="${card.types ? card.types.join(', ') : 'Desconocido'}" 
              data-rarity="${card.rarity || 'Desconocida'}">⭐</button>
    `;
    resultsDiv.appendChild(cardElement);
  });
}

// Función para manejar los clics en los elementos de resultados
function handleCardClick(event) {
  const target = event.target;

  // Ver detalles de la carta
  if (target.closest('.card') && !target.classList.contains('favorite-btn') && !target.classList.contains('remove-favorite-btn')) {
    const cardElement = target.closest('.card');
    const cardData = {
      id: cardElement.querySelector('.favorite-btn')?.dataset.id,
      name: cardElement.querySelector('h3').innerText,
      image: cardElement.querySelector('img').src,
      type: cardElement.querySelector('p').innerText.split(':')[1].trim(),
      rarity: cardElement.querySelector('p:nth-of-type(2)').innerText.split(':')[1].trim(),
    };

    // Guardar los detalles en localStorage y redirigir
    localStorage.setItem('cardDetails', JSON.stringify(cardData));
    window.location.href = 'detalle.html';
  }

  // Añadir a favoritos
  if (target.classList.contains('favorite-btn')) {
    const cardData = {
      id: target.dataset.id,
      name: target.dataset.name,
      image: target.dataset.image,
      type: target.dataset.type,
      rarity: target.dataset.rarity
    };
    addToFavorites(cardData);
  }

  // Eliminar de favoritos
  if (target.classList.contains('remove-favorite-btn')) {
    const id = target.dataset.id;
    removeFromFavorites(id);
  }
}

// Función para añadir a favoritos
function addToFavorites(card) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (favorites.some(fav => fav.id === card.id)) {
    return alert('Esta carta ya está en favoritos.');
  }
  favorites.push(card);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  alert('Carta añadida a favoritos.');
}

// Función para mostrar los favoritos
function showFavorites() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  resultsDiv.innerHTML = '';

  if (favorites.length === 0) {
    resultsDiv.innerHTML = '<p>No tienes cartas en favoritos.</p>';
    return;
  }

  favorites.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.innerHTML = `
      <h3>${card.name}</h3>
      <img src="${card.image}" alt="${card.name}">
      <p>Tipo: ${card.type}</p>
      <p>Rareza: ${card.rarity}</p>
      <button class="remove-favorite-btn" data-id="${card.id}">❌</button>
    `;
    resultsDiv.appendChild(cardElement);
  });
}

// Función para eliminar de favoritos
function removeFromFavorites(id) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites = favorites.filter(fav => fav.id !== id);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  alert('Carta eliminada de favoritos.');
  showFavorites(); // Actualizar la vista de favoritos
}

// Event listeners
searchButton.addEventListener('click', searchCards);
resultsDiv.addEventListener('click', handleCardClick);
favoritesButton.addEventListener('click', showFavorites);
