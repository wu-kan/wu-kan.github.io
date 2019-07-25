---
  layout: null
---
  {% if site.PrismJS.enable %}
{% for s in site.PrismJS.src %}
$("<link>").attr({ href: "{{ s.stylesheet }}", rel: "stylesheet" }).appendTo("head");
{% endfor %}
{% if site.PrismJS.plugins.line_numbers %}
$('pre').addClass("line-numbers");
{% endif %}
{% if site.PrismJS.plugins.toolbar.show_language.enable %}
Prism.plugins.toolbar.registerButton('show-language', {
  text: '{{ site.PrismJS.plugins.toolbar.show_language.text }}', // required
  onClick: function (env) { // optional
    alert('{{ site.PrismJS.plugins.toolbar.show_language.alert }}' + env.language);
  }
});
{% endif %}
{% if site.PrismJS.plugins.toolbar.select_code.enable %}
Prism.plugins.toolbar.registerButton('select-code', function (env) {
  var button = document.createElement('button');
  button.innerHTML = '{{ site.PrismJS.plugins.toolbar.select_code.innerHTML }}';
  button.addEventListener('click', function () {
    // Source: http://stackoverflow.com/a/11128179/2757940
    if (document.body.createTextRange) { // ms
      var range = document.body.createTextRange();
      range.moveToElementText(env.element);
      range.select();
    } else if (window.getSelection) { // moz, opera, webkit
      var selection = window.getSelection();
      var range = document.createRange();
      range.selectNodeContents(env.element);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });
  return button;
});
{% endif %}
{% if site.PrismJS.plugins.autoloader %}
Prism.plugins.autoloader.languages_path = '{{ site.PrismJS.plugins.autoloader }}';
{% endif %}
{% endif %}
