<template>
  <div class="inputs-defender">
    <h3>Defender</h3>
    <label>
      <span>De</span>
      <input type="number" :value="value.de" @input="update('de', $event)" />
    </label>
    <label>
      <span>Ne</span>
      <div class="inputs-defender-ne">
        <input type="number" :value="value.neWaver" @input="update('neWaver', $event)" /> /
        <input type="number" :value="value.neRout" @input="update('neRout', $event)" />
      </div>
    </label>
    <br />
    <label>
      <span>Previous Wounds</span>
      <input type="number" :value="value.wounds" @input="update('wounds', $event)" />
    </label>
    <label>
      <span>Rallied</span>
      <input type="number" :value="value.rallied" @input="update('rallied', $event)" />
    </label>
    <br />
    <label>
      <span>Inspired</span>
      <input type="checkbox" :checked="value.inspired" @input="updateBool('inspired', $event)" />
    </label>
    <label>
      <span>Ensnare/Stealthy</span>
      <input type="checkbox" :checked="value.ensnare" @input="updateBool('ensnare', $event)" />
    </label>
  </div>
</template>

<script>
export default {
  name: "InputsDefender",
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

<style scoped>
.inputs-defender-ne {
  flex: 1 1 50%;
  display: flex;
  flex-direction: row;
}
.inputs-defender-ne input {
  flex: 1;
  width: 0;
}
</style>