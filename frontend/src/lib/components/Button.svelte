<script lang="ts"> 
    let{
        disabled = false,
        onClick = () => {},
        class: className = ""
    } = $props();
</script>

<button class={`btn ${className}`} disabled={disabled} onclick={onClick}>
    <slot />
</button>

<style>
    .btn {
        padding: 0.8rem 2.5rem;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        transition: 0.3s ease;
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
        transform: scale(0.97);
    }
</style>