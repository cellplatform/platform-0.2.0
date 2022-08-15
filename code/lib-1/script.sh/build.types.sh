rm .cache/tsconfig.d.tsbuildinfo # Clear TS build-cache to ensure fresh rebuild.
rm -rf types
tsc -p config/tsconfig.d.json 
mv types/src/* types/.
