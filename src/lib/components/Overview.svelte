<script>
	export let data;
	export let friendlyDate;
	export let remainingAllowance;
	export let allowanceDays;
	let emojis = [
		'😀',
		'😃',
		'😄',
		'😁',
		'😆',
		'😅',
		'🤣',
		'😂',
		'🙂',
		'😉',
		'😊',
		'😇',
		'🥰',
		'😍',
		'🤩',
		'😘'
	];

	import { getHours } from 'date-fns';
	$: hours = getHours(new Date());
	$: greeting = getGreeting(hours);
	$: emoji = getRandomEmoji();

	function getGreeting(hours) {
		if (hours > 0 && hours < 12) {
			return 'Good morning,';
		} else if (hours >= 12 && hours < 17) {
			return 'Good afternoon,';
		} else {
			return 'Good evening,';
		}
	}

	function getRandomEmoji() {
		return emojis[Math.floor(Math.random() * emojis.length)];
	}
</script>

<div class="holiday-overview border-2 mt-16 max-w-2xl mx-auto border-indigo-200">
	<h1 class="text-2xl my-4">{greeting} {data?.user?.username}! {emoji}</h1>
	<p class="my-4">
		Today is {friendlyDate}. You have <span class="font-bold">{remainingAllowance}</span> of
		<span class="font-bold">{allowanceDays}</span> days holiday left.
	</p>
</div>
