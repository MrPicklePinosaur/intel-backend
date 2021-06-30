
ENTRY=index.ts
DENO_PERMS=--allow-net

.PHONY: run

run:
	deno run $(DENO_PERMS) $(ENTRY)
