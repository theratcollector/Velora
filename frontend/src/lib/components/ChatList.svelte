<script>
    import { onMount } from "svelte";
    import Button from "$lib/components/Button.svelte";
    import { writable } from "svelte/store";
    import chatCard from "$lib/components/ChatCard.svelte"  
    import SearchBar from "$lib/components/SearchBar.svelte";
    import ChatCard from "$lib/components/ChatCard.svelte";
    import newChatIcon from "$lib/assets/icons/newChatIcon.svelte";
  import NewChatIcon from "$lib/assets/icons/newChatIcon.svelte";


     let apiBase = "http://localhost:3000"

</script>

<div class="chatList">
    <div class="head">
        <SearchBar />
        <Button class="btn-primary fit" spacingLR="1rem"><NewChatIcon/></Button>
    </div>
    <div class="chats">
        <h3>Chats</h3>
        <ChatCard title="Chat with Alice" lastMessage="Hey, how are you?" timestamp="2h" avatarUrl="/skeletons/avatar-skeleton.jpg" newMessages={3} />
    </div>
</div>

<style>
    .head{
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    .chatList{
        display: flex;
        flex-direction: column;
        padding: 1rem;
        background-color: #161719;
        width: 30%;
        gap:1rem;
    }

    .chats h3{
        margin-bottom: 0.5rem;
    }

    :global(.fit) {
        width: auto;
        align-self: flex-start;
    }
</style>