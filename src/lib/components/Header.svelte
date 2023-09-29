<script>
	export let data;
	import { getYear } from 'date-fns';
	import { goto } from '$app/navigation';

	async function handleLogOut() {
		await goto(`/?logout=true`);
	}
</script>

<div class="hero bg-indigo-500 text-white p-6">
	<h1 class="text-3xl font-bold underline text-center">Holidays {getYear(new Date())}</h1>
	{#if data?.user?.isLoggedIn}
		<button data-testid="header__logout" on:click={handleLogOut}>Log out</button>
	{:else}
		<a data-testid="header__login" href="/">Login</a> |
		<a data-testid="header__register" href="/register">Register</a>
	{/if}
</div>
