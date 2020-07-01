<template>
  <div class="inputs">
    <InputsAttacker
      class="inputs-panel"
      :value="value.attacker"
      @input="update('attacker', $event)"
    ></InputsAttacker>

    <InputsDefender
      class="inputs-panel"
      :value="value.defender"
      @input="update('defender', $event)"
    ></InputsDefender>

    <InputsCharge class="inputs-panel" :value="value.charge" @input="update('charge', $event)"></InputsCharge>
  </div>
</template>

<script>
import InputsAttacker from "./InputsAttacker.vue";
import InputsDefender from "./InputsDefender.vue";
import InputsCharge from "./InputsCharge.vue";

export default {
  name: "Inputs",
  components: {
    InputsAttacker,
    InputsDefender,
    InputsCharge
  },
  props: {
    value: Object
  },
  methods: {
    update(key, value) {
      this.$emit("input", { ...this.value, [key]: value });
    }
  }
};
</script>

<style>
.inputs {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: max-content max-content max-content;
  column-gap: 16px;
}
.inputs-panel {
  display: flex;
  flex-direction: column;
  border: 1px solid #666;
  border-radius: 8px;
  padding: 16px;
}
label {
  display: flex;
  flex-direction: row;
}
label span {
  flex: 1 1 50%;
  text-align: end;
  padding: 0 10px;
}
label input {
  flex: 1 1 50%;
  min-width: 0;
}
h3 {
  margin-top: 0;
}
</style>