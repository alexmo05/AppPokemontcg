const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');
const typeSelect = document.getElementById('type');
const raritySelect = document.getElementById('rarity');
const favoritesButton = document.getElementById('favoritesButton');

// Realizar búsqueda
searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  const type = typeSelect.value; // Obtener el tipo seleccionado
  const rarity = raritySelect.value; // Obtener la rareza seleccionada

  if (!query) return alert('Por favor, escribe un nombre para buscar.');

  // Construir URL para la API
  let url = `https://api.pokemontcg.io/v2/cards?q=name:"${query}"`;

  // Filtrar por tipo si se ha seleccionado uno
  if (type !== 'all') {
    url += ` AND types:"${type}"`;
  }

  // Filtrar por rareza si se ha seleccionado una
  if (rarity !== 'all') {
    url += ` AND rarity:"${rarity}"`;
  }

  // Llamar a la API
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
      data.data.forEach(card => {
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
                  data-rarity="${card.rarity || 'Desconocida'}">⭐ Añadir a favoritos</button>
          <button class="details-btn" 
                  data-id="${card.id}" 
                  data-name="${card.name}" 
                  data-image="${card.images.small}" 
                  data-type="${card.types ? card.types.join(', ') : 'Desconocido'}" 
                  data-rarity="${card.rarity || 'Desconocida'}">🔍 Ver Detalles</button>
        `;
        resultsDiv.appendChild(cardElement);
      });
    })
    .catch(error => {
      alert(error.message);
    });
});

// Delegar eventos para botones dentro de las tarjetas
resultsDiv.addEventListener('click', (e) => {
  if (e.target.classList.contains('favorite-btn')) {
    const cardData = {
      id: e.target.dataset.id,
      name: e.target.dataset.name,
      image: e.target.dataset.image,
      type: e.target.dataset.type,
      rarity: e.target.dataset.rarity
    };
    addToFavorites(cardData);
  }

  // Evento para ver los detalles de la carta
  if (e.target.classList.contains('details-btn')) {
    const cardData = {
      id: e.target.dataset.id,
      name: e.target.dataset.name,
      image: e.target.dataset.image,
      type: e.target.dataset.type,
      rarity: e.target.dataset.rarity
    };

    // Guardar los detalles en localStorage
    localStorage.setItem('cardDetails', JSON.stringify(cardData));

    // Redirigir a la página de detalles
    window.location.href = 'detalle.html';
  }
});

// Función para añadir a favoritos
function addToFavorites(card) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (favorites.some(fav => fav.id === card.id)) {
    alert('Esta carta ya está en favoritos.');
    return;
  }
  favorites.push(card);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  alert('Carta añadida a favoritos.');
}

// Mostrar favoritos
favoritesButton.addEventListener('click', () => {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  resultsDiv.innerHTML = ''; // Limpiar resultados anteriores

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
      <button class="remove-favorite-btn" data-id="${card.id}">❌ Eliminar de favoritos</button>
    `;
    resultsDiv.appendChild(cardElement);
  });
});

// Delegar eventos para eliminar de favoritos
resultsDiv.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-favorite-btn')) {
    const id = e.target.dataset.id;
    removeFromFavorites(id);
  }
});

// Función para eliminar de favoritos
function removeFromFavorites(id) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites = favorites.filter(fav => fav.id !== id);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  alert('Carta eliminada de favoritos.');

  // Actualizar vista de favoritos
  favoritesButton.click();
}