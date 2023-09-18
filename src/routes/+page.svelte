<script>
	export let data;
	export let form;
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import dayjs from 'dayjs';
	import { quintOut } from 'svelte/easing';
	let date = dayjs().format('YYYY-MM-DD');
	let friendlyDate = dayjs().format('dddd, MMMM DD YYYY');
	$: today = date;
	$: allowanceDays = data.allowanceDays;
	$: total = data.totalDays;
	$: remainingAllowance = allowanceDays - total;
</script>

<div class="hero bg-indigo-500 text-white p-6">
	<h1 class="text-3xl font-bold underline text-center">Holidays</h1>
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
				<div class="shadow shadow-indigo-500 mx-auto my-4 p-4 w-fit">
					<li>
						<form method="POST" action="?/delete" use:enhance>
							<input type="hidden" name="id" value={id} />
							<span>{dayjs(to).diff(dayjs(from), 'day', false) + 1} day(s) from {from} to {to}</span
							>
							<button aria-label="Mark as complete">🗑</button>
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
				min={today}
				type="date"
				required
			/><br />
			<label class="font-bold" for="end-date">Last day</label><br />
			<input
				class="shadow-md shadow-indigo-500 my-4 p-2"
				id="end-date"
				name="end-date"
				min={today}
				type="date"
				required
			/><br />
			{#if form?.error}
				<p
					transition:slide={{ easing: quintOut, axis: 'y' }}
					class="error shadow-md shadow-red-500 py-2 px-4 my-2 w-fit"
				>
					⚠️ {form.error}
				</p>
			{/if}
			<button class="bg-indigo-500 py-2 px-4 my-2 text-white font-semibold w-fit"
				><span class="mx-auto">Add</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fill-white mx-auto w-10 h-10">
					<path
						fill-rule="evenodd"
						d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</form>
	</div>
</div>
