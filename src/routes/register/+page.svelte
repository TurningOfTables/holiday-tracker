<script>
	export let form;

	import { enhance } from '$app/forms';
	import SaveButton from '$lib/components/SaveButton.svelte';
	import Header from '$lib/components/Header.svelte';
	import FormError from '$lib/components/FormError.svelte';

	let registering = false;
</script>

<Header />
<div class="container text-center mx-auto">
	<div class="login-form my-16">
		<h1 class="text-2xl my-4">Register</h1>
		<form
			method="POST"
			action="?/register"
			use:enhance={() => {
				registering = true;

				return async ({ update }) => {
					await update();
					registering = false;
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
					pattern={".{8,255}"}
					placeholder="8-255 characters"
					required
				/>
			</div>
            <div class="my-4">
				<label class="font-bold" for="confirm-password">Confirm Password</label><br />
				<input
					class="shadow-md shadow-indigo-500 my-4 p-2"
					id="confirm-password"
					name="confirm-password"
					type="password"
					pattern={".{8,255}"}
					placeholder="8-255 characters"
					required
				/>
			</div>
			<SaveButton loading={registering} text="Register" />
		</form>
	</div>
	<FormError {form} />
</div>
