<template>
    <div class="tags">
        <div class="tag">
            <strong>Tags:</strong>
        </div>
        <a rel="noopener" :href="tagUrlMap[tag]" class="tag" v-for="tag in tags">
            {{ tag }}
        </a>
    </div>
</template>

<script>
    export default {
        name: 'Tags',
        props: {
            tags: {
                type: Array,
                required: true
            }
        },
        computed: {
            tagUrlMap() {
                const map = {};

                for (const tag of this.tags) {
                    map[tag] = `https://www.ratebeer.com/tag/${tag}/`;
                }

                return map;
            }
        }
    };
</script>