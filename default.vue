<template>
  <router-view class="content" :locale="locale"></router-view>
</template>

<script>
  define(["Vue"], function(Vue) {
    return Vue.component("default-component", {
      template: template, // the variable template will be injected
      props:['locale'],
       head: {
            // To use "this" in the component, it is necessary to return the object through a function
            title: function () {
              return {
                inner: this.meta.meta_title,
                separator: ' ', // Leave empty separator
                complement: ' ' // Leave empty complement
              }
            },
            meta: function () {
              return [
                 { name: 'description', id: 'description', content: this.meta.meta_description },
                 { name: 'keywords',  id: 'keywords', content: this.meta.meta_keywords },
                 { property: 'og:title', id: 'og:title', content: this.meta.meta_title },
                 { property: 'og:description', id: 'og:description', content: this.meta.meta_description }
              ]
            }
        },
      data: function() {
        return {
          meta: {
               meta_title: "",
               meta_description: "",
               meta_keywords: "",
               meta_image: ""
            }
        }
      },
      beforeRouteEnter (to, from, next) {
        next(vm => {
          // access to component instance via `vm`
          vm.meta = vm.findMetaDataByPath(to.path);
          vm.$emit('updateHead')
          console.log('vm.meta', vm.meta, 'to.path', to.path)
        })
      },
      beforeRouteUpdate (to, from, next) {
        this.meta = this.findMetaDataByPath(to.path);
        this.$emit('updateHead')
        next();
      },
      computed: {
        findMetaDataByPath () {
          return this.$store.getters.findMetaDataByPath;
        }
      }
    });
  });
</script>