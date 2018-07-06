export default function castToAverageRating({ aroma, appearance, taste, palate, overall }) {
    return {
        aroma: parseFloat(aroma),
        appearance: parseFloat(appearance),
        taste: parseFloat(taste),
        palate: parseFloat(palate),
        overall: parseFloat(overall)
    };
}