+++
title = "Photo Gallery"

+++

<div class="gallery-container">
    <a class="card china" href="/gallery/china">
        <h3> China </h3>
    </a>
    <a class="card malaysia" href="/gallery/malaysia">
        <h3> Malaysia </h3>
    </a>
    <a class="card uk" href="/gallery/uk">
        <h3> United Kingdom </h3>
    </a>
</div>

Photos were taken either on an iPhone 6s or iPhone 11. Forgive the resolution.

While I have a fair number of photos on my phone, I've never used social media enough to post them anywhere. Might as well dump them here.

<style>
    .gallery-container {
        display: flex;
        gap: 2rem;
        justify-content: center;
        margin: 2rem 0;
        flex-wrap: nowrap;
    }
    .card {
        flex: 1 1 0;
        min-width: 0;
        background: url('https://via.placeholder.com/200x120') center/cover no-repeat;
        background: url('https://via.placeholder.com/200x120') center/cover no-repeat;
        width: 100%;
        aspect-ratio: 5 / 3;
        border-radius: 16px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        display: flex;
        align-items: flex-end;
        justify-content: center;
        transition: transform 0.2s, box-shadow 0.2s;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        text-decoration: none;
    }
    .card h3 {
        background: rgba(0,0,0,0.5);
        color: #fff;
        width: 100%;
        margin: 0;
        padding: 0.5rem 0;
        text-align: center;
        font-size: 1.2rem;
        border-radius: 0 0 16px 16px;
    }
    .card:hover {
        transform: translateY(-8px) scale(1.03);
        box-shadow: 0 8px 24px rgba(0,0,0,0.22);
    }
    .card.china { background-image: url('https://r2.duti.dev/pictures/thumbnails/china.jpg'); }
    .card.malaysia { background-image: url('https://r2.duti.dev/pictures/thumbnails/penang.jpg'); }
    .card.uk { background-image: url('https://r2.duti.dev/pictures/thumbnails/UK.jpg'); }
</style>
