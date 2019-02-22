---
layout: page
title: 今、情热が 岚になって
---
### 近期博文
{% for post in site.posts limit:5 %}
 - [{{ post.title }}]({{ post.url }}) <small>{{ post.date | date_to_string  }}</small>
{% endfor %}
 - [更多…](/archive)

### ACM模板
{% for post in site.categories.Template %}
 - [{{ post.title }}]({{ post.url }})
{% endfor %}
