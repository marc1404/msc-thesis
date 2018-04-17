export default class Review {

    constructor({ rating, user, location, date, text }) {
        this.rating = rating;
        this.user = user;
        this.location = location;
        this.date = date;
        this.text = text;
    }

}