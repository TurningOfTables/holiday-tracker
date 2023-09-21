<script>
	export let form;
	export let data;

	import { enhance } from '$app/forms';
	import SaveButton from '$lib/components/SaveButton.svelte';
	import FormOkay from '../lib/components/FormOkay.svelte';
	import Header from '$lib/components/Header.svelte';
	import FormError from '$lib/components/FormError.svelte';

	let loggingin = false;
</script>

<Header {data} />
<div class="container text-center mx-auto">
	<div class="login-form my-16">
		{#if data.registered}<FormOkay content="Registration successful 🎉" />{/if}
		<h1 class="text-2xl my-4">Log in</h1>
		<form
			method="POST"
			action="?/login"
			use:enhance={() => {
				loggingin = true;

				return async ({ update }) => {
					await update();
					loggingin = false;
				};
			}}
		>
			<div class="my-4">
				<label class="font-bold" for="username">Username</label><br />
				<input
					class="shadow-md shadow-indigo-500 my-4 p-2"
					id="username"
					name="username"
					type="text"
					required
				/>
			</div>
			<div class="my-4">
				<label class="font-bold" for="password">Password</label><br />
				<input
					class="shadow-md shadow-indigo-500 my-4 p-2"
					id="password"
					name="password"
					type="password"
					required
				/>
			</div>
			<SaveButton loading={loggingin} text="Submit" />
		</form>
	</div>
	<FormError {form} />
</div>
