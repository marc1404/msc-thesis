<style>
    body {
        font-family: 'Proxima Nova', Georgia, sans-serif;
    }

    .mb-1 {
        margin-bottom: 1rem !important;
    }

    .mb-half {
        margin-bottom: 0.5rem !important;
    }

    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .pre-line {
        white-space: pre-line;
    }

    .is-size-larger {
        font-size: larger;
    }
</style>

<template>
    <section class="section">
        <div class="container">
            <nuxt />
        </div>
    </section>
</template>

<script>
    export default {
        name: 'Layout'
    };
</script>