class RecService {

    constructor() {
        this.apiHost = 'http://localhost:3002';
    }

    async get(url) {
        const response = await fetch(url);

        return await response.json();
    }

    async recommend(pos, neg) {
        const url = this.apiUrl(`/recommend?pos[]=${pos}&neg[]=${neg}`);

        return this.get(url)
    }
    apiUrl(url) {
        return this.apiHost + url;
    }

}

export default new RecService();
