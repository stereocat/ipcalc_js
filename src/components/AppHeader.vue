<template>
  <header>
    <h1>IP Calculator</h1>
    <div class="github-ribbon-container">
      <a
        class="github-ribbon"
        href="https://github.com/stereocat/ipcalc_js"
        aria-label="Fork ipcalc_js on GitHub"
      >
        Fork me on GitHub
      </a>
    </div>
  </header>
</template>

<script>
export default {}
</script>

<style scoped>
.github-ribbon-container {
  position: absolute;
  z-index: 10;
  top: 0;
  right: 0;
  width: 160px;
  height: 160px;
  overflow: hidden;
  pointer-events: none;
}

.github-ribbon {
  position: absolute;
  top: 38px;
  right: -52px;
  width: 220px;
  padding: 8px 0;
  color: white;
  background: #ff7600;
  box-shadow: 0 2px 4px rgb(0 0 0 / 30%);
  font: 700 14px/1.2 sans-serif;
  text-align: center;
  text-decoration: none;
  transform: rotate(45deg);
  pointer-events: auto;
}

.github-ribbon:hover,
.github-ribbon:focus-visible {
  background: #d95f00;
  text-decoration: underline;
}
</style>
