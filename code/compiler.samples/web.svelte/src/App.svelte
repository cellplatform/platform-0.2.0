<script lang="ts">
  import Counter from './Counter.svelte';
</script>

<main>
  <div class="main">
    <h1>My Title</h1>
    <div>
      <Counter />
    </div>
  </div>
</main>

<style>
  .main {
    font-family: sans-serif;
    padding: 50px;
  }
  h1 {
    color: red;
  }
</style>
