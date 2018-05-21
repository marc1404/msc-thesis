import consola from 'consola';

export default async function insertBeer(place, db) {
    const { id, slug, name, type, street, locality, region, country, postalCode, ratingCount, ratingValue, facebookUrl, twitterUrl, websiteUrl, telephone, openingTimes, imageUrl } = place;

    try {
        return await db`
            INSERT IGNORE INTO places (
                id, slug, name, type, street, locality, region, country, postal_code, rating_count, rating_value, facebook_url, twitter_url, website_url, telephone, opening_times, image_url
            ) VALUES (
                ${id}, ${slug}, ${name}, ${type}, ${street}, ${locality}, ${region}, ${country}, ${postalCode}, ${ratingCount}, ${ratingValue}, ${facebookUrl}, ${twitterUrl}, ${websiteUrl}, ${telephone}, ${openingTimes}, ${imageUrl}
            );
        `;
    } catch (error) {
        consola.error(`Failed to insert ${name}!`);
        consola.error(place);
        throw error;
    }
};