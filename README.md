# vue-course

https://www.vuemastery.com/courses/intro-to-vue-js

## shorthands

### `v-bind:` can be replaced by `:`

Example:

```
  <img v-bind:src="image" />
  <img :src="image" />
```

### `v-on:` can be replaced by `@`

Example:
```
v-on:mouseover
@mouseover
```

```
v-on:click
@click
```

## Things to know

### computed vs method in Vue

computed is cached
