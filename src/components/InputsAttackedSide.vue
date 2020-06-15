<template>
  <div class="inputs attacked-side">
    <h3>Attacked Side</h3>
    <label>
      <span>Front</span>
      <input type="radio" id="front" value="front" :checked="value === 'front'" @change="update('front')"/>
    </label>
    <label>
      <span>Flank</span>
      <input type="radio" id="flank" value="flank" :checked="value === 'flank'" @change="update('flank')"/>
    </label>
    <label>
      <span>Rear</span>
      <input type="radio" id="rear" value="rear" :checked="value === 'rear'" @change="update('rear')"/>
    </label>
  </div>
</template>

<script>
export default {
  name: "InputsAttackedSide",
  props: {
    value: String
  },
  methods: {
    update(value) {
      this.$emit('input', value)
    }
  }
};
</script>
