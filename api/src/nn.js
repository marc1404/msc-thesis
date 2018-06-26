import { connect } from '../../beer-scraper/src/mysql';

export default async function nn(request) {
    const db = await connect();
    const { id } = request.params;
    const { rows } = await db`SELECT embedding, query, neighbor, similarity FROM beer_nn WHERE beer_id = ${id};`;
    const cleanedTokens = new Set();

    for (const row of rows) {
        const { neighbor } = row;

        cleanedTokens.add(neighbor);
    }

    const dictionary = await loadDictionary(cleanedTokens, db);

    await db.close();

    for (const row of rows) {
        row.neighbors = dictionary.get(row.neighbor);
    }

    return rows;
}

async function loadDictionary(cleanedTokens, db) {
    const values = Array.from(cleanedTokens)
        .map(token => `'${token}'`)
        .join(',');
    console.log(values);
    const statement = `SELECT original_token, cleaned_token FROM token_dictionary WHERE cleaned_token IN (${values});`;
    const { rows } = await db.run(statement, []);
    const dictionary = new Map();

    for (const row of rows) {
        const { original_token: originalToken, cleaned_token: cleanedToken } = row;
        let originalTokens = dictionary.get(cleanedToken);

        if (!originalTokens) {
            originalTokens = [];

            dictionary.set(cleanedToken, originalTokens);
        }

        originalTokens.push(originalToken);
    }

    return dictionary;
}
