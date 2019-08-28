---
  layout: null
---
  {% if site.mermaid.enable %}
$("<link>").attr({ href: "{{ site.mermaid.stylesheet }}", rel: "stylesheet" }).appendTo("head");
document.write('<script src="{{ site.mermaid.src }}"></script>');
{% if site.mermaid.markdown_expand %}
$(".language-mermaid").attr("class", "mermaid");
{% endif %}
$(window).on("load", function () {
  mermaid.init();
});
{% endif %}
