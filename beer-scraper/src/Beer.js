export default class Beer {

    constructor({ id, url, name, brewery, style, location, image, ratings, description, stats, tags }) {
        this.id = id;
        this.url = url;
        this.name = name;
        this.brewery = brewery;
        this.style = style;
        this.location = location;
        this.image = image;
        this.ratings = ratings;
        this.description = description;
        this.stats = stats;
        this.tags = tags;
    }

}