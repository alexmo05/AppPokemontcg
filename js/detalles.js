// Cargar los detalles de la carta desde el localStorage
const cardDetails = JSON.parse(localStorage.getItem('cardDetails'));
const cardDetailsSection = document.getElementById('cardDetails');
const addToFavoritesButton = document.getElementById('addToFavoritesButton');
const goBackButton = document.getElementById('goBackButton');

// Verificar si hay detalles de la carta
if (cardDetails) {
  const { name, image, type, rarity } = cardDetails;

  // Mostrar detalles de la carta
  cardDetailsSection.innerHTML = `
    <img src="${image}" alt="${name}" style="width: 100%; max-width: 300px; margin-bottom: 20px;">
    <h2 style="color: black;">${name}</h2>
    <p  style="color: black;><strong>Tipo:</strong> ${type}</p>
    <p>  style="color: black;<strong>Rareza:</strong> ${rarity}</p>
  `;
}

// Añadir a favoritos
addToFavoritesButton.addEventListener('click', () => {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favorites.some(fav => fav.id === cardDetails.id)) {
    favorites.push(cardDetails);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert(`${cardDetails.name} ha sido añadido a tus favoritos.`);
  } else {
    alert(`${cardDetails.name} ya está en tus favoritos.`);
  }
});

// Volver a la página anterior (búsqueda)
goBackButton.addEventListener('click', () => {
  window.location.href = 'cartas.html';
});