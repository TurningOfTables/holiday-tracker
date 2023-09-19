<script>
	export let loading;
	export let text;
</script>

<button
	class="bg-indigo-500 py-2 px-4 my-2 text-white font-semibold w-fit shadow-md shadow-indigo-500 inline-block h-fit"
	disabled={loading}
	><span class="px-2 inline-block align-middle">{text}</span>{#if loading}<svg
			xmlns="http://www.w3.org/2000/svg"
			class="w-6 h-6 inline-block align-middle"
			viewBox="0 0 100 100"
		>
			<path
				fill="#fff"
				d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
			>
				<animateTransform
					attributeName="transform"
					attributeType="XML"
					type="rotate"
					dur="1s"
					from="0 50 50"
					to="360 50 50"
					repeatCount="indefinite"
				/>
			</path>
		</svg>{:else}<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			class="stroke-white mx-auto w-6 h-6 inline-block align-middle"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
			/>
		</svg>{/if}
</button>
