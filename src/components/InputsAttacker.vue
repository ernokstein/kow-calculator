<template>
  <div class="inputs-attacker">
    <h3>Attacker</h3>
    <label>
      <span>Me</span>
      <input type="number" :value="value.me" @input="update('me', $event)" />
    </label>
    <label>
      <span>Att</span>
      <input type="number" :value="value.att" @input="update('att', $event)" />
    </label>
    <br />
    <label>
      <span>Crushing Strength</span>
      <input type="number" :value="value.cs" @input="update('cs', $event)" />
    </label>
    <label>
      <span>Thunderous Charge</span>
      <input type="number" :value="value.tc" @input="update('tc', $event)" />
    </label>
    <br />
    <label>
      <span>Elite</span>
      <input type="checkbox" :value="value.elite" @input="updateBool('elite', $event)" />
    </label>
    <label>
      <span>Vicious</span>
      <input type="checkbox" :value="value.vicious" @input="updateBool('vicious', $event)" />
    </label>
    <label>
      <span>
        <TagBeta></TagBeta>Reroll 1 hit die
      </span>
      <input
        type="checkbox"
        :value="value.rerollOneHitDie"
        @input="updateBool('rerollOneHitDie', $event)"
      />
    </label>
    <label>
      <span>
        <TagBeta></TagBeta>Reroll 1 damage die
      </span>
      <input
        type="checkbox"
        :value="value.rerollOneDmgDie"
        @input="updateBool('rerollOneDmgDie', $event)"
      />
    </label>
    <label>
      <span>Brutal/Shattering</span>
      <input type="checkbox" :value="value.brutal" @input="updateBool('brutal', $event)" />
    </label>
    <br />
    <label>
      <span>Blast</span>
      <input type="checkbox" :checked="value.hasBlast" @input="updateBool('hasBlast', $event)" />
      <select :value="value.blastDie" @input="update('blastDie', $event)">
        <option value="3">D3</option>
        <option value="6">D6</option>
      </select>
      +
      <input type="number" :value="value.blastPlus" @input="update('blastPlus', $event)" />
    </label>
  </div>
</template>

<script>
import TagBeta from "./TagBeta.vue";

export default {
  name: "InputsAttacker",
  components: {
    TagBeta,
  },
  props: {
    value: Object,
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
    },
  },
};
</script>
