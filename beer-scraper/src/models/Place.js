export default class Place {

    constructor({ id, slug, name, type, street, locality, region, country, postalCode, ratingCount, ratingValue, facebookUrl, twitterUrl, websiteUrl, telephone, openingTimes, imageUrl }) {
        this.id = id;
        this.slug = slug;
        this.name = name;
        this.type = type;
        this.street = street;
        this.locality = locality;
        this.region = region;
        this.country = country;
        this.postalCode = postalCode;
        this.ratingCount = ratingCount;
        this.ratingValue = ratingValue;
        this.facebookUrl = facebookUrl;
        this.twitterUrl = twitterUrl;
        this.websiteUrl = websiteUrl;
        this.telephone = telephone;
        this.openingTimes = openingTimes;
        this.imageUrl = imageUrl;
    }

}
