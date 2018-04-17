export default function getIdFromUrl(url) {
    const chunks = url.split('/');
    const rawId = chunks[chunks.length - 2];

    return parseInt(rawId, 10);
}