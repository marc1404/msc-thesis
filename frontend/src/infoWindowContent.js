export default place => `
<div>
    <h3 class="title is-size-4 is-marginless mb-half">
        ${place.name}
    </h3>
    <img src="${place.image_url}" style="display: block; width: auto; height: auto; max-height: 200px">
</div>
`;