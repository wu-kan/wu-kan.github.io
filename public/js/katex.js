---
  layout: null
---
  {% if site.katex.enable %}
$("<link>").attr({ href: "{{ site.katex.stylesheet }}", rel: "stylesheet" }).appendTo("head");
document.write('<script src="{{ site.katex.src }}"></script>');
document.write('<script src="{{ site.katex.auto_render }}"></script>');
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
