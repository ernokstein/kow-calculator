<template>
  <div class="inputs-attacker">
    <h3>Attackers</h3>
  </div>
</template>

<script>
export default {
  name: "InputsAttackerList",
  props: {
    value: Object
  },
  methods: {
    update(key, event) {
      this.updateValue(key, event.target.value);
    },
    updateBool(key, event) {
      this.updateValue(key, event.target.checked);
    },
    updateValue(key, value) {
      this.$emit("input", { ...this.value, [key]: value });
    }
  }
};
</script>
