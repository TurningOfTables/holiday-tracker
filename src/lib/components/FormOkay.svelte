<script>
	export let content;
	export let dataTestId

	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
</script>

<p
	transition:slide={{ easing: quintOut, axis: 'y' }}
	class="shadow-md shadow-green-500 p-2 my-2 bg-green-400 w-fit mx-auto sticky bottom-0 inline-block"
	data-testid={dataTestId}
>
	<span class="inline-block align-middle">{content}</span>
</p>
