<script lang="ts">
    let counter = 0;
    let number_to_sum: number;

    function sumCounter (number: number = 1) {
        counter += number;
    }
</script>

<h1>Welcome to SvelteKit</h1>
<input type="number" placeholder="Numero a sumar" bind:value={number_to_sum}>
<button on:click={ () => {sumCounter(number_to_sum) }}>btn {counter}</button> <br>
{number_to_sum}
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

