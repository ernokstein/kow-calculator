<template>
  <div class="inputs inputs-attacker">
    <h3>Attacker</h3>
    <label>
      <span>Me</span>
      <input type="number" :value="value.me" @input="update('att', $event)"/>
    </label>
    <label>
      <span>Att</span>
      <input type="number" :value="value.att" @input="update('att', $event)"/>
    </label>
    <br />
    <label>
      <span>Crushing Strength</span>
      <input type="number" :value="value.cs" @input="update('cs', $event)"/>
    </label>
    <label>
      <span>Thunderous Charge</span>
      <input type="number" :value="value.tc" @input="update('tc', $event)"/>
    </label>
    <br />
    <label>
      <span>Elite</span>
      <input type="checkbox" :value="value.elite" @input="updateBool('elite', $event)"/>
    </label>
    <label>
      <span>Vicious</span>
      <input type="checkbox" :value="value.vicious" @input="updateBool('vicious', $event)"/>
    </label>
    <label>
      <span>Brutal/Shattering</span>
      <input type="checkbox" :value="value.brutal" @input="updateBool('brutal', $event)"/>
    </label>
    <br />
    <label>
      <span>Hindered</span>
      <input type="checkbox" :value="value.hindered" @input="updateBool('hindered', $event)"/>
    </label>
    <label>
      <span>Charge from hill</span>
      <input type="checkbox" :value="value.chargeFromHill" @input="updateBool('chargeFromHill', $event)"/>
    </label>
  </div>
</template>

<script>
export default {
  name: "InputsAttacker",
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
      this.$emit('input', { ...this.value, [key]: value })
    }
  }
};
</script>
