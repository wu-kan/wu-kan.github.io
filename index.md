---
layout: page
title: 今、情热が岚になって
showtag:
  - ICPC模板
---
### 近期
{% for post in site.posts limit:5 %}
- [{{ post.title }}]({{ post.url }}) <small>{{ post.date | date_to_string  }}</small>
{% endfor %}
- [更多…](/archive)

{% for tag in page.showtag %}
### {{ tag }}
{% for post in site.tags[tag] %}
- [{{ post.title }}]({{ post.url }})
{% endfor %}
{% endfor %}
