---
  layout: null
---
  {% if site.mermaid.enable %}
$("<link>").attr({ href: "{{ site.mermaid.stylesheet }}", rel: "stylesheet" }).appendTo("head");
$.ajax({
  url: "{{ site.mermaid.src }}",
  dataType: "script",
  cache: true
});
{% if site.mermaid.markdown_expand %}
$(".language-mermaid").attr("class", "mermaid");
{% endif %}
mermaid.init();
{% endif %}
