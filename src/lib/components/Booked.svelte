<script>
	export let total;
	export let data;

	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { businessDaysInclusive } from '$lib/dateutils/index.js';
	import SaveButton from './SaveButton.svelte';

	let deletingId = false;
	let adding = false;
</script>

<div class="booked-holiday mt-16 border-2 max-w-2xl mx-auto border-indigo-200">
	<h1 class="text-2xl my-4">Bookings - {total} day(s)</h1>
	<ul>
		{#each data.holidays as { id, from, to }}
			<div
				class="shadow-md shadow-indigo-500 mx-auto my-4 w-fit p-4"
				transition:slide={{ easing: quintOut, axis: 'y' }}
			>
				<li>
					<form
						class="inline-block"
						method="POST"
						action="?/delete"
						use:enhance={() => {
							deletingId = id;

							return async ({ update }) => {
								await update();
								deletingId = false;
							};
						}}
					>
						<input type="hidden" name="id" value={id} />
						<span class="inline-block align-middle"
							>{#if deletingId === id}Deleting...{:else}{businessDaysInclusive(from, to)} day(s) from
								{from}
								to {to}{/if}</span
						>
						<button class="inline-block align-middle" aria-label="Delete"
							><svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								alt="Delete"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								class="w-7 h-7 fill-indigo-500 stroke-white"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z"
								/>
							</svg>
						</button>
					</form>
				</li>
			</div>
		{/each}
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
	</ul>
</div>
