<script setup lang="ts">
import {useColorMode} from "@vueuse/core";

interface LogoAsset {
  id: string
  variant: "symbol" | "logo"
  src: string
  dark: boolean
}

interface Props {
  variant?: "symbol" | "logo"
}

const LOGO_ASSETS: LogoAsset[] = [
  {
    id: "brandmark-black",
    variant: "symbol",
    src: "/brandkit/Logo/Brandmark/SVG/Brandmark Black.svg",
    dark: false
  },
  {
    id: "brandmark-white",
    variant: "symbol",
    src: "/brandkit/Logo/Brandmark/SVG/Brandmark White.svg",
    dark: true
  },
  {
    id: "logomark-black",
    variant: "logo",
    src: "/brandkit/Logo/Logomark/SVG/Logomark Black.svg",
    dark: false
  },
  {
    id: "logomark-white",
    variant: "logo",
    src: "/brandkit/Logo/Logomark/SVG/Logomark White.svg",
    dark: true
  },
]

const props = withDefaults(defineProps<Props>(), {variant: 'logo'});

const colorMode = useColorMode();
console.log(colorMode.value)

const path = computed(function () {
  const variants = LOGO_ASSETS.filter(asset => asset.variant === props.variant);
  return variants.filter(asset =>
    colorMode.value === 'dark' ? asset.dark : !asset.dark
  )[0].src;
})

</script>

<template>
  <img :src="path" alt="Logo"/>
</template>
