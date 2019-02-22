---
layout: page
title: 标签
---
#### tags
{% for tag in site.tags %}

##### {{ tag[0] }}

{% for post in tag[1] %}

 - [{{ post.title }}]({{ post.url }}) <small>{{ post.date | date_to_string }}</small>

{% endfor %}

{% endfor %}
#### categories
{% for tag in site.categories %}

##### {{ tag[0] }}

{% for post in tag[1] %}

 - [{{ post.title }}]({{ post.url }}) <small>{{ post.date | date_to_string  }}</small>

{% endfor %}

{% endfor %}