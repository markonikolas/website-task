// Used only in watch mode e.g. --env watch

(async function hmr() {
    const main = await import('./main.js');

    // Accept module for Hot module reload
    if (module && module.hot) {
        module.hot.accept(main, () => {
            console.log('Accepting module, updating...');
        });
    }
})();
