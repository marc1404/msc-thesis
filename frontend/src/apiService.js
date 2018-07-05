class ApiService {

    constructor() {
        this.apiHost = 'http://localhost:3001';
    }

    async get(url) {
        const response = await fetch(url);

        return await response.json();
    }

    async beer(id) {
        const url = this.apiUrl(`/beer/${id}`);

        return this.get(url)
    }

    async reviews(id) {
        const url = this.apiUrl(`/beer/${id}/reviews`);

        return this.get(url);
    }

    async places(id) {
        const url = this.apiUrl(`/beer/${id}/places`);

        return this.get(url);
    }

    async nn(id) {
        const url = this.apiUrl(`/beer/${id}/nn`);

        return this.get(url);
    }

    async userLocations(userId) {
        const url = this.apiUrl(`/user/${userId}/locations`);

        return this.get(url);
    }

    async search(query = '') {
        const url = this.apiUrl(`/search/${query}`);

        return this.get(url);
    }

    apiUrl(url) {
        return this.apiHost + url;
    }

}

export default new ApiService();