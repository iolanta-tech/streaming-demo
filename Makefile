PORT ?= 8766

.PHONY: serve render
render:
	node render.mjs

serve: render
	python3 -m http.server $(PORT) --bind 127.0.0.1 --directory slides
