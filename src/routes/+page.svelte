<script>
	export let data;
	import { enhance } from '$app/forms';
	import dayjs from 'dayjs';
    let today = dayjs().format('YYYY-MM-DD')
	$: allowanceDays = data.allowanceDays
	$: total = data.totalDays
    $: remainingAllowance = allowanceDays - total
</script>

<h1 class="text-3xl font-bold underline text-center">Holidays</h1>
<p class="my-5">Today's date: {today}</p>
<label for="allowance">Allowance days</label>
<input class="shadow shadow-indigo-500 my-4 p-2 w-fit" id="allowance" type="text" inputmode="numeric" pattern="\d" bind:value={allowanceDays}/>
<p>Remaining allowance: {remainingAllowance}</p>

<div class="booked-holiday my-16">
	<h1 class="text-2xl">Booked - {total} day(s)</h1>

	<ul>
		{#each data.holidays as { id, from, to }}
			<div class="shadow shadow-indigo-500 my-4 p-4 w-fit">
				<li>
					<form method="POST" action="?/delete" use:enhance>
						<input type="hidden" name="id" value={id} />
						<span>{dayjs(to).diff(dayjs(from), 'day', false)} day(s) from {from} to {to}</span>
						<button aria-label="Mark as complete">🗑</button>
					</form>
				</li>
			</div>
		{/each}
	</ul>
</div>

<div class="add-holiday my-16">
	<h1 class="text-2xl">Add another</h1>
	<form method="POST" action="?/add" use:enhance>
		<label for="start-date">Start date</label>
		<input
			class="shadow shadow-indigo-500 my-4"
			id="start-date"
			name="start-date"
            value={today}
            min={today}
			type="date"
			required
		/><br />
		<label for="end-date">End date</label>
		<input
			class="shadow shadow-indigo-500 my-4"
			id="end-date"
			name="end-date"
            value={today}
            min={today}
			type="date"
			required
		/><br />
		<button class="bg-indigo-500 py-2 px-4 my-2">Add</button>
	</form>
</div>

// Add new holiday // Remove holiday // Calculations of holiday
