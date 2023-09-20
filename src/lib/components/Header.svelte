<script>
	export let data;
	import { getYear } from 'date-fns';
	import { enhance } from '$app/forms';
</script>

<div class="hero bg-indigo-500 text-white p-6">
	<h1 class="text-3xl font-bold underline text-center">Holidays {getYear(new Date())}</h1>
	{#if data?.user.isLoggedIn}<form method="POST" action="?/logout" use:enhance>
			<button>Log out</button>
		</form>{:else}
		<a href="/">Login</a> | <a href="/register">Register</a>{/if}
</div>
