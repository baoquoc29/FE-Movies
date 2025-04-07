const apiConfig = {
    baseUrl: 'https://api.themoviedb.org/3/',
    apiKey: '0623e0d232ae90274f2d77494ac4ce50',
    originalImage: (imgPath) => `https://image.tmdb.org/t/p/original/${imgPath}`,
    w500Image: (imgPath) => `https://image.tmdb.org/t/p/w500/${imgPath}`
}

export default apiConfig;