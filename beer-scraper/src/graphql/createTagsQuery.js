export default beerId => ({
    "operationName": "tagDisplay",
    "variables": {
        "beerId": `${beerId}`
    },
    "query": "query tagDisplay($beerId: ID!, $first: Int) {\n  tagDisplayArr: beerTags(beerId: $beerId, first: $first) {\n    items {\n      id\n      urlName: plain\n      __typename\n    }\n    __typename\n  }\n}\n"
});