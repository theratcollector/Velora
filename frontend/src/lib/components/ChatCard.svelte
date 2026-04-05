<script lang="ts">
    let {
        title = "Chat Title",
        lastMessage = "Last message preview...",
        timestamp = "Just now",
        avatarUrl = "/skeletons/avatar.jpg",
        newMessages = 0,
    } = $props();
</script>

<div class="chat-card">
    {#if newMessages > 0}
        <span class="badge">
            {newMessages > 99 ? "99+" : newMessages}
        </span>
    {/if}
    <img class="avatar" src={avatarUrl} alt={title} />

    <div class="content">
        <div class="top-row">
            <h4 class="title">{title}</h4>
            <span class="timestamp">{timestamp}</span>
        </div>

        <p class="message">{lastMessage}</p>
    </div>
</div>

<style>
    .chat-card {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        border-radius: 16px;
        cursor: pointer;
        transition: 0.2s ease;
        min-width: 0;
        background: rgba(255, 255, 255, 0.02);
        position:relative;
    }

    .chat-card:hover {
        background: rgba(255, 255, 255, 0.03);
        transform: scale(1.01);
    }

    .chat-card:active {
        transform: scale(1);
    }

    .avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
    }

    .content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
    }

    .top-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        min-width: 0;
    }

    .title {
        margin: 0;
        font-size: 0.95rem;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
    }

    .timestamp {
        flex-shrink: 0;
        font-size: 0.75rem;
        opacity: 0.65;
    }

    .message {
        margin: 0;
        font-size: 0.88rem;
        opacity: 0.8;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .badge {
        position: absolute;
        top: -6px;
        right: -6px;

        background: var(--color-primary, #4f46e5);
        color: white;

        font-size: 0.6rem;
        font-weight: 600;

        height: 20px;
        min-width: 20px;

        border-radius: 999px;

        display: flex;
        align-items: center;
        justify-content: center;

        box-shadow: 0 2px 6px rgba(0,0,0,0.9);
    }
</style>