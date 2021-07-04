
ENTRY=index.ts
DENO_PERMS=--allow-net --allow-read --allow-write

.PHONY: run

run:
	deno run $(DENO_PERMS) $(ENTRY)
