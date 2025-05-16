let watchedMovies = [];
let unwatchedMovies = [];
let isAdmin = false;

loadMoviesFromStorage();
renderMovies();

function showAdminLogin() {
  document.getElementById('password-section').style.display = 'block';
}

function loginAsAdmin() {
  const password = document.getElementById('admin-password').value;
  if (password === 'admin123') {
    isAdmin = true;
    document.getElementById('admin-controls').style.display = 'flex';
    document.getElementById('admin-login').style.display = 'none';
    renderMovies();
  } else {
    alert("Неверный пароль!");
  }
}

function addToWatched() {
  if (!isAdmin) return;
  const movieTitle = document.getElementById('movie-title').value.trim();
  if (!movieTitle) return;

  watchedMovies.push({ title: movieTitle, image: null });
  document.getElementById('movie-title').value = '';
  renderMovies();
  saveMoviesToStorage();
}

function addToUnwatched() {
  if (!isAdmin) return;
  const movieTitle = document.getElementById('movie-title').value.trim();
  if (!movieTitle) return;

  unwatchedMovies.push({ title: movieTitle, image: null });
  document.getElementById('movie-title').value = '';
  renderMovies();
  saveMoviesToStorage();
}

function renderMovies() {
  const watchedContainer = document.getElementById('watched');
  const unwatchedContainer = document.getElementById('unwatched');
  watchedContainer.innerHTML = '';
  unwatchedContainer.innerHTML = '';

  watchedMovies.forEach((movie, index) => {
    const movieElement = createMovieElement(movie, index, 'watched');
    watchedContainer.appendChild(movieElement);
  });

  unwatchedMovies.forEach((movie, index) => {
    const movieElement = createMovieElement(movie, index, 'unwatched');
    unwatchedContainer.appendChild(movieElement);
  });
}

function createMovieElement(movie, index, listType) {
  const movieElement = document.createElement('div');
  movieElement.classList.add('movie-tile');

  const imageElement = document.createElement('img');
  if (movie.image) imageElement.src = movie.image;
  movieElement.appendChild(imageElement);

  const titleElement = document.createElement('p');
  titleElement.classList.add('edit-title');
  titleElement.textContent = movie.title;
  if (isAdmin) {
    titleElement.addEventListener('click', () => editMovieTitle(index, listType));
  }
  movieElement.appendChild(titleElement);

  if (isAdmin) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = '×';
    deleteButton.addEventListener('click', () => deleteMovie(index, listType));
    movieElement.appendChild(deleteButton);

    const addImageButton = document.createElement('button');
    addImageButton.classList.add('add-image-button');
    addImageButton.textContent = 'Добавить картинку';
    addImageButton.addEventListener('click', () => openImageDialog(index, listType));
    movieElement.appendChild(addImageButton);
  }

  return movieElement;
}

function openImageDialog(index, listType) {
  if (!isAdmin) return;
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.addEventListener('change', (event) => handleImageUpload(event, index, listType));
  fileInput.click();
}

function handleImageUpload(event, index, listType) {
  if (!isAdmin) return;
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const imageUrl = reader.result;
    if (listType === 'watched') {
      watchedMovies[index].image = imageUrl;
    } else {
      unwatchedMovies[index].image = imageUrl;
    }
    renderMovies();
    saveMoviesToStorage();
  };
  reader.readAsDataURL(file);
}

function deleteMovie(index, listType) {
  if (!isAdmin) return;
  if (listType === 'watched') {
    watchedMovies.splice(index, 1);
  } else {
    unwatchedMovies.splice(index, 1);
  }
  renderMovies();
  saveMoviesToStorage();
}

function editMovieTitle(index, listType) {
  if (!isAdmin) return;
  const newTitle = prompt("Введите новое название фильма:", listType === 'watched' ? watchedMovies[index].title : unwatchedMovies[index].title);
  if (newTitle && newTitle.trim() !== "") {
    if (listType === 'watched') {
      watchedMovies[index].title = newTitle;
    } else {
      unwatchedMovies[index].title = newTitle;
    }
    renderMovies();
    saveMoviesToStorage();
  }
}

function saveMoviesToStorage() {
  localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies));
  localStorage.setItem('unwatchedMovies', JSON.stringify(unwatchedMovies));
}

function loadMoviesFromStorage() {
  const watched = localStorage.getItem('watchedMovies');
  const unwatched = localStorage.getItem('unwatchedMovies');
  watchedMovies = watched ? JSON.parse(watched) : [];
  unwatchedMovies = unwatched ? JSON.parse(unwatched) : [];
}
