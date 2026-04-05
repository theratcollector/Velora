<script lang="ts"> 
    import { createWebHaptics } from "web-haptics/svelte";
	import { onDestroy } from "svelte";
	const { trigger, destroy } = createWebHaptics({ debug: true });
	onDestroy(destroy);

    let{
        disabled = false,
        onClick = () => {},
        class: className = "",
        type = "button",
        children,
        spacingLR = "2.5rem",
    } = $props();
</script>

<button class={`btn ${className}`} disabled={disabled} onclick={() => {onClick?.();trigger();}} type={type} style="padding: 0.8rem {spacingLR};">
    {@render children?.()}
</button>

<style>
    .btn {
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        transition: 0.3s ease;

        gap: 0.5rem;

        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .btn-primary {
        background-color: var(--color-primary);
        color: white;
    }

    .btn-primary:hover:not(:disabled) {
        transform: scale(1.03);
    }

    .btn-secondary {
        background-color: var(--color-secondary);
        color: white;
    }

    .btn-secondary:hover:not(:disabled) {
        transform: scale(1.03);
    }

    .btn:disabled {
        background-color: #ffffff15;
        cursor: not-allowed;
    }

    .btn:active:not(:disabled) {
        transform: scale(1);
    }
</style>