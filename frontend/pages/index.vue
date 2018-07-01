<template>
    <div>
        <h1 class="title is-size-1">
            Beerlytics
        </h1>

        <ul class="is-size-1">
            <li>
                <nuxt-link to="/beer/2360">
                    Rochefort Trappistes 10
                </nuxt-link>
            </li>
            <li>
                <nuxt-link to="/beer/10569">
                    Dogfish Head 90 Minute Imperial IPA
                </nuxt-link>
            </li>
            <li>
                <nuxt-link to="/beer/473">
                    Budweiser
                </nuxt-link>
            </li>
            <li>
                <nuxt-link to="/beer/37">
                    Heineken
                </nuxt-link>
            </li>
            <li>
                <nuxt-link to="/beer/647">
                    Paulaner Hefe-Weissbier
                </nuxt-link>
            </li>
            <li>
                <nuxt-link to="/beer/1762">
                    Schneider Weisse Original
                </nuxt-link>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'Index'
    };
</script>