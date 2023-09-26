<script>
	export let data;
	export let allowanceDays;

	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { businessDaysInclusive } from '$lib/dateutils/index.js';
	import SaveButton from './SaveButton.svelte';

	let accordionVisible = false;
	let updatingAllowance = false;
	let deletingId = false;
	let addingExcluded = false;

	function toggleAccordion() {
		accordionVisible = !accordionVisible;
	}
</script>

<div class="config my-16 border-2 max-w-2xl mx-auto border-indigo-200">
	<button
		class="text-2xl my-4 inline-block "
		on:click={toggleAccordion}
		on:keypress={toggleAccordion}
	>
		<span class="inline-block">Configuration</span>{#if accordionVisible}<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6 inline-block align-middle"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
				/>
			</svg>
		{:else}<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6 inline-block align-middle"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5"
				/>
			</svg>
		{/if}
	</button>
	{#if accordionVisible}
		<div class="accordion-content" transition:slide={{ easing: quintOut, axis: 'y' }}>
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
			<p class="font-bold mt-8">Excluded dates</p>
			{#if data.excludedDays.length > 0}
				<ul>
					{#each data.excludedDays as { id, start_date, end_date }}
						<div
							class="shadow-md shadow-indigo-500 mx-auto my-4 w-fit p-4"
							transition:slide={{ easing: quintOut, axis: 'y' }}
						>
							<li>
								<form
									class="inline-block"
									method="POST"
									action="?/deleteExcludedDays"
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
										>{#if deletingId === id}Deleting...{:else}{businessDaysInclusive(start_date, end_date)} day(s)
											from
											{start_date}
											to {end_date}{/if}</span
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
				</ul>
			{/if}
			<div class="add-excluded">
				<form
					method="POST"
					action="?/addExcludedDays"
					use:enhance={() => {
						addingExcluded = true;

						return async ({ update }) => {
							await update();
							addingExcluded = false;
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

					<SaveButton loading={addingExcluded} text="Add" />
				</form>
			</div>
		</div>
	{/if}
</div>
