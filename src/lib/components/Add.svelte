<script>
	export let adding;

	import SaveButton from './SaveButton.svelte';
	import { enhance } from '$app/forms';
</script>

<div class="add-holiday my-16">
	<h1 class="text-2xl my-4">Add another</h1>
	<form
		method="POST"
		action="?/add"
		use:enhance={() => {
			adding = true;

			return async ({ update }) => {
				await update();
				adding = false;
			};
		}}
	>
		<div class="inline-block mr-2">
			<label class="font-bold" for="start-date">First day</label>
			<input
				class="shadow-md shadow-indigo-500 my-4 p-2"
				id="start-date"
				name="start-date"
				type="date"
				required
			/>
		</div>
		<div class="inline-block mx-4">
			<label class="font-bold" for="end-date">Last day</label>
			<input
				class="shadow-md shadow-indigo-500 my-4 p-2"
				id="end-date"
				name="end-date"
				type="date"
				required
			/>
		</div>

		<SaveButton loading={adding} text="Add" />
	</form>
</div>
