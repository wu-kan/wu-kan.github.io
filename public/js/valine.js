---
  layout: null
---
  document.write('<div id="valine"></div>');
document.write('<script src="{{ site.valine.src }}"></script>');
setTimeout(function () {
  new Valine({
    appId: '{{ site.valine.appId }}',
    appKey: '{{ site.valine.appKey }}',
    avatar: '{{ site.valine.avatar }}',
    placeholder: '{{ site.valine.placeholder }}',
    notify: {{ site.valine.notify }},
  verify: {{ site.valine.verify }},
  highlight: {{ site.valine.highlight }},
  avatarForce: {{ site.valine.avatarForce }},
  visitor: {{ site.valine.visitor }},
  recordIP: {{ site.valine.recordIP }},
  el: '#valine'
  });
}, 1000); 
