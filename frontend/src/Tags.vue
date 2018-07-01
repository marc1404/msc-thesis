<template>
    <div class="tags">
        <span class="tag" v-for="tag in tags">
            {{ tag }}
        </span>
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
        }
    };
</script>