<script>
	export let data;
	export let updatingAllowance;
	export let allowanceDays;

	import { enhance } from '$app/forms';
	import SaveButton from './SaveButton.svelte';
</script>

<div class="config my-16">
	<h1 class="text-2xl my-4">Configuration</h1>
	<form
		method="POST"
		action="?/changeAllowance"
		use:enhance={() => {
			updatingAllowance = true;

			return async ({ update }) => {
				await update();
				updatingAllowance = false;
			};
		}}
	>
		<label class="font-bold" for="change-allowance">Annual allowance</label><br />
		<input
			class="shadow-md shadow-indigo-500 my-4 p-2 w-20"
			id="change-allowance"
			name="change-allowance"
			type="text"
			inputmode="numeric"
			pattern="[0-9]+"
			placeholder={allowanceDays}
			required
		/>
		<SaveButton loading={updatingAllowance} text="Save" />
	</form>
	<p class="font-bold">Excluded dates</p>
	{#each data.excludedDays as { id, from, to }}
		<div class="shadow shadow-indigo-500 mx-auto p-2 w-fit my-4">{from} to {to}</div>
	{/each}
</div>
