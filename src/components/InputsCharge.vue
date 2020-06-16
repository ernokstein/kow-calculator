<template>
  <div class="inputs-charge">
    <h3>Charge</h3>
    <div class="charged-side">
      <span>Charged side:</span>
      <div class="charged-side-options">
        <label>
          <input
            type="radio"
            id="front"
            value="front"
            :checked="value.attackedSide === 'front'"
            @change="update('attackedSide', $event)"
          />
          Front
        </label>
        <label>
          <input
            type="radio"
            id="flank"
            value="flank"
            :checked="value.attackedSide === 'flank'"
            @change="update('attackedSide', $event)"
          />
          Flank
        </label>
        <label>
          <input
            type="radio"
            id="rear"
            value="rear"
            :checked="value.attackedSide === 'rear'"
            @change="update('attackedSide', $event)"
          />
          Rear
        </label>
      </div>
    </div>
    <br />
    <label>
      <span>Hindered</span>
      <input type="checkbox" :value="value.hindered" @input="updateBool('hindered', $event)" />
    </label>
    <label>
      <span>Charge from hill</span>
      <input
        type="checkbox"
        :value="value.chargeFromHill"
        @input="updateBool('chargeFromHill', $event)"
      />
    </label>
  </div>
</template>

<script>
export default {
  name: "InputsCharge",
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
.charged-side {
  display: flex;
  flex-direction: row;
}
.charged-side span {
  flex: 1 1 50%;
  text-align: end;
}
.charged-side .charged-side-options {
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;
}
</style>