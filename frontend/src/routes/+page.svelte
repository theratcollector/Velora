<script lang="ts">
    import { onMount } from "svelte";
    import Button from "$lib/components/Button.svelte";
    import { auth, initializeAuth, logout } from "$lib/auth";
    import { writable } from "svelte/store";
    import ChatList from "$lib/components/ChatList.svelte"

    let apiBase = "http://192.168.178.192:3000"

     onMount(async () => {
        const ok = await initializeAuth();

        if(!ok){
            window.location.href = '/login';
        }
    });
</script>

<div>
    <ChatList />
</div>