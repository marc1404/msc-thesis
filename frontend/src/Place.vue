<template>
    <div>
        <h2 class="title is-size-3 mb-half">
            {{ place.name }}
        </h2>

        <address class="mb-half" v-html="address"></address>

        <div class="mb-half" v-if="place.opening_times">
            <strong>
                Opening Times
            </strong>
            <br>
            <code class="is-inline-block">
                {{ place.opening_times }}
            </code>
        </div>

        <ul>
            <li v-if="place.website_url">
                <a rel="noopener" :href="place.website_url">
                    <span class="icon has-text-dark">
                        <i class="fi fi-home"></i>
                    </span>
                    Homepage
                </a>
            </li>
            <li v-if="place.facebook_url">
                <a rel="noopener" :href="place.facebook_url">
                    <span class="icon has-text-dark">
                        <i class="fi fi-facebook"></i>
                    </span>
                    Facebook
                </a>
            </li>
            <li v-if="place.twitter_url">
                <a rel="noopener" :href="place.twitter_url">
                    <span class="icon has-text-dark">
                        <i class="fi fi-twitter"></i>
                    </span>
                    Twitter
                </a>
            </li>
            <li v-if="telephone">
                <a rel="noopener" :href="telephone">
                    <span class="icon has-text-dark">
                        <i class="fi fi-phone"></i>
                    </span>
                    {{ place.telephone }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'Place',
        props: {
            place: {
                type: Object,
                required: true
            }
        },
        computed: {
            telephone() {
                const { telephone } = this.place;

                if (!telephone) {
                    return null;
                }

                return `tel:${telephone}`;
            },
            address() {
                const addressParts = [
                    this.place.street,
                    (this.place.postal_code || '') + ' ' + (this.place.locality || ''),
                    this.place.region,
                    this.place.country
                ].filter(part => part !== undefined && part !== null && part !== '');

                return addressParts.join('<br>');
            }
        }
    };
</script>