<script>
	export let form;

	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
</script>

{#if form?.error}
	<p
		transition:slide={{ easing: quintOut, axis: 'y' }}
		data-testid="form-error"
		class="error shadow-md shadow-red-500 p-2 my-2 bg-red-400 w-fit mx-auto sticky bottom-0 inline-block"
	>
		<span data-testid="form-error__content" class="inline-block align-middle">{form.error}</span>
	</p>
{/if}
