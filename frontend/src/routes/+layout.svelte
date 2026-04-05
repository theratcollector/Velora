<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	import { createWebHaptics } from "web-haptics/svelte";
	import { onDestroy } from "svelte";
	const { trigger, destroy } = createWebHaptics();
	onDestroy(destroy);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="stylesheet" href="/styles.css" />
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&family=Saira+Stencil+One&display=swap" rel="stylesheet">
</svelte:head>

{@render children()}
