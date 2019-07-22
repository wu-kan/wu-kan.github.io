---
  layout: null
---
  {% if site.katex.enable %}
$("<link>").attr({ href: "{{ site.katex.stylesheet }}", rel: "stylesheet" }).appendTo("head");
$.ajax({
  url: "{{ site.katex.src }}",
  dataType: "script",
  cache: true
});
$.ajax({
  url: "{{ site.katex.auto-render }}",
  dataType: "script",
  cache: true
});
{% if site.katex.delimiters %}
$(window).on("load", function () {
  renderMathInElement(document.body,
    {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false }
      ]
    }
  );
});
{% endif %}
{% endif %}
