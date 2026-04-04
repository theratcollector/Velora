<script>
    import Button from "$lib/components/Button.svelte";

    let email = $state("");
    let username = $state("");
    let password = $state("");
    let notRobot = $state(false);
    let error = $state("");
    let requiredFields = $state("");

    let apiBase = "http://localhost:3000"

    async function handleRegister(){
        if(!notRobot || !email || !username || !password){
            requiredFields = "Please fill in all required fields";
            return;
        }

        const res = await fetch(`${apiBase}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                username,
                password
            })
        });

        const data = await res.json();
        
        if(res.ok){
            window.location.href = '/login?registered=success';
        } else {
            error = data.message;
        }
    }
</script>

<div class="form">
    <img src="/assets/onboarding.svg" alt="Access Account" width="200" height="200">
    <h1>Register</h1>
    {#if error}
        <p class="error">{error}</p>
    {/if}
    {#if requiredFields}
        <p class="required-fields">{requiredFields}</p>
    {/if}
    <form>
        <label for="email">Email</label>
        <input type="email" id="email" name="email" bind:value={email} required>

        <label for="username">Username</label>
        <input type="text" id="username" name="username" bind:value={username} required>

        <label for="password">Password</label>
        <input type="password" id="password" name="password" bind:value={password} required>

        <label class="robot-div custom-check" for="not-robot">
            <input type="checkbox" id="not-robot" name="not-robot" bind:checked={notRobot} required>
            <span class="checkmark"></span>
            <span class="robot-text">I'm Not A Robot (Trust me):</span>
        </label>

        <div class="btn-div">
            <Button class="btn-primary fit" onClick={handleRegister}>Register</Button>
            <Button class="btn-secondary fit" onClick={() => window.location.href = '/login'}>Login</Button>
        </div>
    </form>
</div>

<style>
    .btn-div{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        gap: 15px;
    }
    .robot-div{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        margin-bottom: 15px;
    }
    .form{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 90vh;
    }
    h1 {
        text-align: center;
        margin-bottom: 20px;
    }

    form {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 500px;
    }

    label {
        margin-bottom: 5px;
        font-weight: 500;
    }

    input[type="text"],
    input[type="password"],
    input[type="email"] {
        padding: 0.8rem 1rem;
        margin-bottom: 15px;
        border: none;
        border-radius: 10px;
        background-color: var(--color-secondary);
        color: var(--color-text);
        transition: 0.3s ease;
    }

    .robot-div {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 12px;
        margin-bottom: 18px;
        cursor: pointer;
        user-select: none;
    }

    .custom-check input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
    }

    .checkmark {
        width: 24px;
        height: 24px;
        border-radius: 8px;
        background: #ffffff10;
        border: 2px solid #ffffff25;
        position: relative;
        transition: transform 0.18s ease, background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
        flex-shrink: 0;
    }

    .robot-text {
        line-height: 1.3;
    }

    .custom-check:hover .checkmark {
        transform: scale(1.06);
        border-color: var(--color-primary);
        box-shadow: 0 0 0 6px #ffffff08;
    }

    .checkmark::after {
        content: "";
        position: absolute;
        left: 7px;
        top: 2px;
        width: 6px;
        height: 12px;
        border: solid white;
        border-width: 0 3px 3px 0;
        transform: rotate(45deg) scale(0);
        transform-origin: center;
        opacity: 0;
        transition: transform 0.2s ease, opacity 0.2s ease;
    }

    .custom-check input:checked + .checkmark {
        background: var(--color-primary);
        border-color: var(--color-primary);
        transform: scale(1.08);
        animation: checkbox-pop 0.28s ease;
    }

    .custom-check input:checked + .checkmark::after {
        transform: rotate(45deg) scale(1);
        opacity: 1;
    }

    .custom-check input:focus-visible + .checkmark {
        outline: 2px solid var(--color-primary);
        outline-offset: 3px;
    }

    @keyframes checkbox-pop {
        0% {
            transform: scale(0.9);
        }
        50% {
            transform: scale(1.14);
        }
        100% {
            transform: scale(1.08);
        }
    }

    :global(.fit) {
        width: auto;
        align-self: flex-start;
    }
</style>