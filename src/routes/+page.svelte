<script>
	export let data;
	export let form;
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import dayjs from 'dayjs';
	import { quintOut } from 'svelte/easing';
	import { businessDaysInclusive } from '$lib/dateutils/index.js';
	let date = dayjs().format('YYYY-MM-DD');
	let friendlyDate = dayjs().format('dddd, MMMM DD YYYY');
	$: today = date;
	$: allowanceDays = data.allowanceDays;
	$: total = data.totalDays;
	$: remainingAllowance = allowanceDays - total;
</script>

<div class="hero bg-indigo-500 text-white p-6">
	<h1 class="text-3xl font-bold underline text-center">Holidays {dayjs().year()}</h1>
</div>
<div class="container text-center mx-auto">
	<div class="holiday-overview">
		<h1 class="text-2xl my-4">Overview</h1>
		<p class="my-4">
			Today is {friendlyDate}. You have <span class="font-bold">{remainingAllowance}</span> of
			<span class="font-bold">{allowanceDays}</span> days holiday left.
		</p>
	</div>

	<div class="booked-holiday my-16">
		<h1 class="text-2xl">Booked - {total} day(s)</h1>

		<ul>
			{#each data.holidays as { id, from, to }}
				<div
					class="shadow shadow-indigo-500 mx-auto my-4 w-fit p-4"
					transition:slide={{ easing: quintOut, axis: 'y' }}
				>
					<li>
						<form class="inline-block" method="POST" action="?/delete" use:enhance>
							<input type="hidden" name="id" value={id} />
							<span class="inline-block align-middle"
								>{businessDaysInclusive(from, to)} day(s) from {from} to {to}</span
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
	</div>

	<div class="add-holiday my-16">
		<h1 class="text-2xl my-4">Add another</h1>
		<form method="POST" action="?/add" use:enhance>
			<label class="font-bold" for="start-date">First day</label><br />
			<input
				class="shadow-md shadow-indigo-500 my-4 p-2"
				id="start-date"
				name="start-date"
				type="date"
				required
			/><br />
			<label class="font-bold" for="end-date">Last day</label><br />
			<input
				class="shadow-md shadow-indigo-500 my-4 p-2"
				id="end-date"
				name="end-date"
				type="date"
				required
			/><br />
			<button
				class="bg-indigo-500 py-2 px-4 my-2 text-white font-semibold w-fit shadow-md shadow-indigo-500 inline-block"
				><span class="px-2 inline-block align-middle">Add</span><svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					class="fill-white mx-auto w-6 h-6 inline-block align-middle"
				>
					<path
						fill-rule="evenodd"
						d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</form>
	</div>

	<div class="config my-16">
		<h1 class="text-2xl my-4">Configuration</h1>
		<form method="POST" action="?/changeAllowance" use:enhance>
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
			<button
				class="bg-indigo-500 py-2 px-4 my-2 text-white font-semibold shadow-md shadow-indigo-500 inline-block"
				><span class="px-2 inline-block align-middle">Save</span><svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					class="stroke-white mx-auto w-6 h-6 inline-block align-middle"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
				</svg>
			</button>
		</form>
		<p class="font-bold">Excluded dates</p>
		{#each data.excludedDays as { id, from, to }}
			<div class="shadow shadow-indigo-500 mx-auto p-2 w-fit my-4">{from} to {to}</div>
		{/each}
	</div>
	{#if form?.error}
		<p
			transition:slide={{ easing: quintOut, axis: 'y' }}
			class="error shadow-md shadow-red-500 p-2 my-2 bg-red-400 w-fit mx-auto sticky bottom-0 inline-block"
		>
			<span class="inline-block align-middle">{form.error}</span>
		</p>
	{/if}
</div>
