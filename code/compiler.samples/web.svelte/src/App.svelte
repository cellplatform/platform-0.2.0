<script lang="ts">
  import Counter from './Counter.svelte';
</script>

<main>
  <div class="main">
    <h1>{'👋 Hello Svelte'}</h1>
    <div>
      <Counter />
    </div>
  </div>
</main>

<style>
  .main {
    font-family: sans-serif;
    padding-top: 30px;
    padding-left: 45px;
  }
  h1 {
    font-size: 60px;
    color: red;
  }
</style>
