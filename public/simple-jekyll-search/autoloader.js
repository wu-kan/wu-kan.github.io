---
  layout: null
---
  document.write('<input id="search-input" placeholder="{{ site.simple_jekyll_search.placeholder }}" />');
  document.write('<div id="results-container"></div>');
  document.write('<script src="{{ site.simple_jekyll_search.src }}"></script>');
  $("<link>").attr({ href: "{{ site.simple_jekyll_search.stylesheet }}", rel: "stylesheet" }).appendTo("head");
$(window).on("load", function () {
  SimpleJekyllSearch({
    json: '{{ site.simple_jekyll_search.json }}',
    searchInput: document.getElementById('search-input'),
    resultsContainer: document.getElementById('results-container')
  });
});
