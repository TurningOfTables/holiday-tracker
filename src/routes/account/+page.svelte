<script>
	export let data;
	export let form;
	import { format, getYear } from 'date-fns';
	import Overview from '$lib/components/Overview.svelte';
	import Booked from '$lib/components/Booked.svelte';
	import Add from '$lib/components/Add.svelte';
	import Config from '$lib/components/Config.svelte';
	import FormError from '$lib/components/FormError.svelte';
	import Header from '$lib/components/Header.svelte';
	let friendlyDate = format(new Date(), 'EEEE do MMMM, yyyy');
	let adding = false;
	let deleting = false;
	let updatingAllowance = false;
	$: allowanceDays = data.allowanceDays;
	$: total = data.totalDays;
	$: remainingAllowance = allowanceDays - total;
</script>

<Header {data}/>
<div class="container text-center mx-auto">
	<Overview {data} {friendlyDate} {remainingAllowance} {allowanceDays} />

	<Booked {total} {data} {deleting} />

	<Add {adding} />

	<Config {data} {updatingAllowance} {allowanceDays} />

	<FormError {form} />
</div>
