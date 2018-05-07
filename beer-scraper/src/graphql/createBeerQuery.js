export default beerId => ({
    "operationName": "beer",
    "variables": {
        "beerId": `${beerId}`
    },
    "query": "query beer($beerId: ID!) {\n  info: beer(id: $beerId) {\n    id\n    name\n    description\n    style {\n      id\n      name\n      glasses {\n        id\n        name\n        __typename\n      }\n      __typename\n    }\n    styleScore\n    overallScore\n    averageRating\n    abv\n    ibu\n    calories\n    brewer {\n      id\n      name\n      __typename\n    }\n    ratingCount\n    isRetired\n    isUnrateable\n    seasonal\n    labels\n    availability {\n      bottle\n      tap\n      distribution\n      __typename\n    }\n    __typename\n  }\n}\n"
});