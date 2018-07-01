select beers.name, beer_id, count(beer_id) as count
from reviews
left join beers on beers.id = reviews.beer_id
where language = 'en'
group by beer_id
order by count desc