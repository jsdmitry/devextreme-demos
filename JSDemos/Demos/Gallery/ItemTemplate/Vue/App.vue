<template>
  <DxGallery
    :data-source="dataSource"
    :height="440"
    :loop="true"
    :show-indicator="false"
    width="100%"
  >
    <template #item="{ data }">
      <div class="content">
        <img :src="data.Image">
        <div class="item-price">{{ data.Price | formatCurrency }}</div>
        <div class="item-address">{{ data.Address + ", " + data.City + ", " + data.State }}</div>
      </div>
    </template>
  </DxGallery>
</template>
<script>
import DxGallery from 'devextreme-vue/gallery';
import { gallery } from './data.js';

export default {
  components: {
    DxGallery
  },
  filters: {
    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
  },
  data() {
    return {
      dataSource: gallery
    };
  },
};
</script>

