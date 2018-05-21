import scrape from '../scrape';
import { Place } from '../models';

export default async function extractPlace(url, insert, db) {
    const $ = await scrape(url);
    const { slug, id } = dissectUrl(url);
    const name = $('h1[itemprop="name"]').text().trim();
    const type = $('span.label').text().trim();
    const street = $('span[itemprop="streetAddress"]').text().trim();
    const locality = $('span[itemprop="addressLocality"]').text().trim();
    const region = $('span[itemprop="addressRegion"]').text().trim();
    const country = $('span[itemprop="addressCountry"]').text().trim();
    const postalCode = $('span[itemprop="postalCode"]').text().trim();
    const ratingCount = $('span[itemprop="ratingCount"]').text().trim();
    const ratingValue = $('span[itemprop="ratingValue"]').text().trim();
    const facebookUrl = $('i.fa-facebook-square').parent('a').attr('href');
    const twitterLink = $('i.fa-twitter-square').parent('a');
    const twitterUrl = twitterLink.attr('href');
    const websiteUrl = twitterLink.next('a[target="_blank"]').attr('href');
    const telephone = $('span[itemprop="telephone"]').text().trim();
    const timeIcon = $('span.glyphicon-time')[0];
    const openingTimes = timeIcon ? timeIcon.next.data.trim() : null;
    const imageUrl = $('img.hidden-xs').attr('src');
    const place = new Place({
        id: id,
        slug: slug,
        name: name,
        type: type,
        street: street,
        locality: locality,
        region: region,
        country: country,
        postalCode: postalCode,
        ratingCount: parseInt(ratingCount, 10) || 0,
        ratingValue: parseFloat(ratingValue) || null,
        facebookUrl: facebookUrl || null,
        twitterUrl: twitterUrl || null,
        websiteUrl: websiteUrl || null,
        telephone: telephone,
        openingTimes: openingTimes,
        imageUrl: imageUrl
    });

    await insert(place, db);

    return place;
}

function dissectUrl(url) {
    const chunks = url.split('/');
    const slug = chunks[chunks.length - 3];
    const id = chunks[chunks.length - 2];

    return {
        slug: slug,
        id: parseInt(id, 10)
    };
}