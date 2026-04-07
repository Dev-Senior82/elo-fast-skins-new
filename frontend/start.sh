#!/bin/bash
cd /app
exec node_modules/.bin/next start -H 0.0.0.0 -p 3000
