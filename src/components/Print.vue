<template>
  <div title="Export as PDF" ref="print" id="print" class="ol-control ol-unselectable">
    <button ref="printButton">🖨</button>
  </div>
</template>

<script>
import {Control} from 'ol/control';
import mapToPdf from '../helpers/mapToPdf';

export default {
  name: 'Print',
  props: {
    map: Object
  },
  created() {
    this.$root.$on('map', map => this.map = map);
  },
  mounted() {
    this.$refs.printButton.addEventListener('click', async () => {
      const pdf = await mapToPdf({
        map: this.$props.map, format: 'a0', dpi: 150
      })
      pdf.save('map.pdf');
    });
    this.$props.map.addControl(new Control({
      element: this.$refs.print
    }));
  }
}
</script>

<style scoped>
  #print {
    left: .5em;
    top: 4.5em;
  }
</style>