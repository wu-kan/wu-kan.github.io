---
  layout: null
---
  {% if site.katex.enable %}
$("<link>").attr({ href: "{{ site.katex.stylesheet }}", rel: "stylesheet" }).appendTo("head");
document.write('<script src="{{ site.katex.src }}" type="text/javascript" charset="utf-8"></script>');
document.write('<script src="{{ site.katex.auto_render }}" type="text/javascript" charset="utf-8"></script>');
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
