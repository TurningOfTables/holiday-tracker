<script>
    export let friendlyDate
    export let remainingAllowance
    export let allowanceDays
</script>

<div class="holiday-overview">
    <h1 class="text-2xl my-4">Overview</h1>
    <p class="my-4">
        Today is {friendlyDate}. You have <span class="font-bold">{remainingAllowance}</span> of
        <span class="font-bold">{allowanceDays}</span> days holiday left.
    </p>
</div>