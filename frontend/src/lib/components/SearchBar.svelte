<script lang="ts">
    import SearchIcon from "$lib/assets/icons/searchIcon.svelte"
</script>

<div class="searchBar">
    <SearchIcon size=20 fill="rgba(255, 255, 255, 0.5)"/>
    <input type="text" placeholder="Search..." class="searchInput">
</div>

<style>
    .searchBar {
        display: flex;
        align-items: center;
        background-color: var(--color-bg);
        padding: 1rem;
        border-radius: 8px;
        width: 100%;
        max-width: 400px;
    }

    .searchInput {
        flex: 1;
        margin-left: 8px;
        background-color: transparent;
        border: none;
        color: #fff;
        font-size: 14px;


    }

    .searchInput:focus {
        outline: none;
    }

    .searchInput::placeholder {
        color: #888;
    }
</style>